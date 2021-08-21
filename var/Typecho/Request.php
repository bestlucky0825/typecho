<?php

namespace Typecho;

/**
 * 服务器请求处理类
 *
 * @package Request
 */
class Request
{
    /**
     * 单例句柄
     *
     * @access private
     * @var Request
     */
    private static $instance;

    /**
     * 支持的过滤器列表
     *
     * @access private
     * @var string
     */
    private static $supportFilters = [
        'int'     => 'intval',
        'integer' => 'intval',
        'search'  => ['Typecho_Common', 'filterSearchQuery'],
        'xss'     => ['Typecho_Common', 'removeXSS'],
        'url'     => ['Typecho_Common', 'safeUrl'],
        'slug'    => ['Typecho_Common', 'slugName']
    ];

    /**
     * 内部参数
     *
     * @access private
     * @var array
     */
    private $params = [];

    /**
     * 路径信息
     *
     * @access private
     * @var string
     */
    private $pathInfo = null;

    /**
     * requestUri
     *
     * @var string
     * @access private
     */
    private $requestUri = null;

    /**
     * requestRoot
     *
     * @var mixed
     * @access private
     */
    private $requestRoot = null;

    /**
     * 获取baseurl
     *
     * @var string
     * @access private
     */
    private $baseUrl = null;

    /**
     * 客户端ip地址
     *
     * @access private
     * @var string
     */
    private $ip = null;

    /**
     * 域名前缀
     *
     * @var string
     */
    private $urlPrefix = null;

    /**
     * 当前过滤器
     *
     * @access private
     * @var array
     */
    private $filter = [];

    /**
     * 初始化变量
     */
    public function __construct()
    {
    }

    /**
     * 获取单例句柄
     *
     * @access public
     * @return Request
     */
    public static function getInstance(): Request
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * 获取url前缀
     *
     * @access public
     * @return string
     */
    public function getUrlPrefix(): string
    {
        if (empty($this->urlPrefix)) {
            if (defined('__TYPECHO_URL_PREFIX__')) {
                $this->urlPrefix = __TYPECHO_URL_PREFIX__;
            } elseif (php_sapi_name() != 'cli') {
                $this->urlPrefix = ($this->isSecure() ? 'https' : 'http') . '://'
                    . ($_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME']);
            }
        }

        return $this->urlPrefix;
    }

    /**
     * 判断是否为https
     *
     * @access public
     * @return boolean
     */
    public function isSecure(): bool
    {
        return (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && !strcasecmp('https', $_SERVER['HTTP_X_FORWARDED_PROTO']))
            || (!empty($_SERVER['HTTP_X_FORWARDED_PORT']) && 443 == $_SERVER['HTTP_X_FORWARDED_PORT'])
            || (!empty($_SERVER['HTTPS']) && 'off' != strtolower($_SERVER['HTTPS']))
            || (!empty($_SERVER['SERVER_PORT']) && 443 == $_SERVER['SERVER_PORT'])
            || (defined('__TYPECHO_SECURE__') && __TYPECHO_SECURE__);
    }

    /**
     * 设置过滤器
     *
     * @param string|callable ...$filters
     * @return $this
     */
    public function filter(...$filters): Request
    {
        foreach ($filters as $filter) {
            $this->filter[] = is_string($filter) && isset(self::$supportFilters[$filter])
                ? self::$supportFilters[$filter] : $filter;
        }

        return $this;
    }

    /**
     * 获取实际传递参数(magic)
     *
     * @access public
     *
     * @param string $key 指定参数
     *
     * @return mixed
     */
    public function __get(string $key)
    {
        return $this->get($key);
    }

    /**
     * 判断参数是否存在
     *
     * @access public
     *
     * @param string $key 指定参数
     *
     * @return boolean
     */
    public function __isset(string $key)
    {
        return isset($_GET[$key])
            || isset($_POST[$key])
            || isset($this->params[$key]);
    }

    /**
     * 获取实际传递参数
     *
     * @access public
     *
     * @param string $key 指定参数
     * @param mixed $default 默认参数 (default: NULL)
     *
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        switch (true) {
            case isset($this->params[$key]):
                $value = $this->params[$key];
                break;
            case isset($_GET[$key]):
                $value = $_GET[$key];
                break;
            case isset($_POST[$key]):
                $value = $_POST[$key];
                break;
            default:
                $value = $default;
                break;
        }

        $value = ((!is_array($value) && strlen($value) > 0) || is_array($default)) ? $value : $default;
        return $this->applyFilter($value);
    }

    /**
     * 获取一个数组
     *
     * @param $key
     *
     * @return array
     */
    public function getArray($key): array
    {
        $result = $this->get($key, []);

        return is_array($result) ? $result
            : (strlen($result) > 0 ? [$result] : []);
    }

    /**
     * 从参数列表指定的值中获取http传递参数
     *
     * @access public
     *
     * @param mixed $params 指定的参数
     *
     * @return array
     */
    public function from($params): array
    {
        $result = [];
        $args = is_array($params) ? $params : func_get_args();

        foreach ($args as $arg) {
            $result[$arg] = $this->get($arg);
        }

        return $result;
    }

    /**
     * 设置http传递参数
     *
     * @access public
     *
     * @param string $name 指定的参数
     * @param mixed $value 参数值
     *
     * @return void
     */
    public function setParam(string $name, $value)
    {
        $this->params[$name] = $value;
    }

    /**
     * 设置多个参数
     *
     * @access public
     *
     * @param mixed $params 参数列表
     *
     * @return void
     */
    public function setParams($params)
    {
        //处理字符串
        if (!is_array($params)) {
            parse_str($params, $out);
            $params = $out;
        }

        $this->params = array_merge($this->params, $params);
    }

    /**
     * getRequestRoot
     *
     * @access public
     * @return string
     */
    public function getRequestRoot(): string
    {
        if (null === $this->requestRoot) {
            $root = rtrim($this->getUrlPrefix() . $this->getBaseUrl(), '/') . '/';

            $pos = strrpos($root, '.php/');
            if ($pos) {
                $root = dirname(substr($root, 0, $pos));
            }

            $this->requestRoot = rtrim($root, '/');
        }

        return $this->requestRoot;
    }

    /**
     * 获取当前请求url
     *
     * @access public
     * @return string
     */
    public function getRequestUrl(): string
    {
        return $this->getUrlPrefix() . $this->getRequestUri();
    }

    /**
     * 获取请求地址
     *
     * @access public
     * @return string
     */
    public function getRequestUri(): ?string
    {
        if (!empty($this->requestUri)) {
            return $this->requestUri;
        }

        //处理requestUri
        $requestUri = '/';

        if (isset($_SERVER['HTTP_X_REWRITE_URL'])) { // check this first so IIS will catch
            $requestUri = $_SERVER['HTTP_X_REWRITE_URL'];
        } elseif (
            // IIS7 with URL Rewrite: make sure we get the unencoded url (double slash problem)
            isset($_SERVER['IIS_WasUrlRewritten'])
            && $_SERVER['IIS_WasUrlRewritten'] == '1'
            && isset($_SERVER['UNENCODED_URL'])
            && $_SERVER['UNENCODED_URL'] != ''
        ) {
            $requestUri = $_SERVER['UNENCODED_URL'];
        } elseif (isset($_SERVER['REQUEST_URI'])) {
            $requestUri = $_SERVER['REQUEST_URI'];
            $parts = @parse_url($requestUri);

            if (isset($_SERVER['HTTP_HOST']) && strstr($requestUri, $_SERVER['HTTP_HOST'])) {
                if (false !== $parts) {
                    $requestUri = (empty($parts['path']) ? '' : $parts['path'])
                        . ((empty($parts['query'])) ? '' : '?' . $parts['query']);
                }
            } elseif (!empty($_SERVER['QUERY_STRING']) && empty($parts['query'])) {
                // fix query missing
                $requestUri .= '?' . $_SERVER['QUERY_STRING'];
            }
        } elseif (isset($_SERVER['ORIG_PATH_INFO'])) { // IIS 5.0, PHP as CGI
            $requestUri = $_SERVER['ORIG_PATH_INFO'];
            if (!empty($_SERVER['QUERY_STRING'])) {
                $requestUri .= '?' . $_SERVER['QUERY_STRING'];
            }
        }

        return $this->requestUri = $requestUri;
    }

    /**
     * getBaseUrl
     *
     * @access public
     * @return string
     */
    public function getBaseUrl(): ?string
    {
        if (null !== $this->baseUrl) {
            return $this->baseUrl;
        }

        //处理baseUrl
        $filename = (isset($_SERVER['SCRIPT_FILENAME'])) ? basename($_SERVER['SCRIPT_FILENAME']) : '';

        if (isset($_SERVER['SCRIPT_NAME']) && basename($_SERVER['SCRIPT_NAME']) === $filename) {
            $baseUrl = $_SERVER['SCRIPT_NAME'];
        } elseif (isset($_SERVER['PHP_SELF']) && basename($_SERVER['PHP_SELF']) === $filename) {
            $baseUrl = $_SERVER['PHP_SELF'];
        } elseif (isset($_SERVER['ORIG_SCRIPT_NAME']) && basename($_SERVER['ORIG_SCRIPT_NAME']) === $filename) {
            $baseUrl = $_SERVER['ORIG_SCRIPT_NAME']; // 1and1 shared hosting compatibility
        } else {
            // Backtrack up the script_filename to find the portion matching
            // php_self
            $path = $_SERVER['PHP_SELF'] ?? '';
            $file = $_SERVER['SCRIPT_FILENAME'] ?? '';
            $segs = explode('/', trim($file, '/'));
            $segs = array_reverse($segs);
            $index = 0;
            $last = count($segs);
            $baseUrl = '';
            do {
                $seg = $segs[$index];
                $baseUrl = '/' . $seg . $baseUrl;
                ++$index;
            } while (($last > $index) && (false !== ($pos = strpos($path, $baseUrl))) && (0 != $pos));
        }

        // Does the baseUrl have anything in common with the request_uri?
        $finalBaseUrl = null;
        $requestUri = $this->getRequestUri();

        if (0 === strpos($requestUri, $baseUrl)) {
            // full $baseUrl matches
            $finalBaseUrl = $baseUrl;
        } elseif (0 === strpos($requestUri, dirname($baseUrl))) {
            // directory portion of $baseUrl matches
            $finalBaseUrl = rtrim(dirname($baseUrl), '/');
        } elseif (!strpos($requestUri, basename($baseUrl))) {
            // no match whatsoever; set it blank
            $finalBaseUrl = '';
        } elseif (
            (strlen($requestUri) >= strlen($baseUrl))
            && ((false !== ($pos = strpos($requestUri, $baseUrl))) && ($pos !== 0))
        ) {
            // If using mod_rewrite or ISAPI_Rewrite strip the script filename
            // out of baseUrl. $pos !== 0 makes sure it is not matching a value
            // from PATH_INFO or QUERY_STRING
            $baseUrl = substr($requestUri, 0, $pos + strlen($baseUrl));
        }

        return ($this->baseUrl = (null === $finalBaseUrl) ? rtrim($baseUrl, '/') : $finalBaseUrl);
    }

    /**
     * 根据当前uri构造指定参数的uri
     *
     * @access public
     *
     * @param mixed $parameter 指定的参数
     *
     * @return string
     */
    public function makeUriByRequest($parameter = null): string
    {
        /** 初始化地址 */
        $requestUri = $this->getRequestUrl();
        $parts = parse_url($requestUri);

        /** 初始化参数 */
        if (is_string($parameter)) {
            parse_str($parameter, $args);
        } elseif (is_array($parameter)) {
            $args = $parameter;
        } else {
            return $requestUri;
        }

        /** 构造query */
        if (isset($parts['query'])) {
            parse_str($parts['query'], $currentArgs);
            $args = array_merge($currentArgs, $args);
        }
        $parts['query'] = http_build_query($args);

        /** 返回地址 */
        return Common::buildUrl($parts);
    }

    /**
     * 获取当前pathinfo
     *
     * @access public
     *
     * @param string|null $inputEncoding 输入编码
     * @param string|null $outputEncoding 输出编码
     *
     * @return string
     */
    public function getPathInfo(string $inputEncoding = null, string $outputEncoding = null): ?string
    {
        /** 缓存信息 */
        if (null !== $this->pathInfo) {
            return $this->pathInfo;
        }

        //参考Zend Framework对pahtinfo的处理, 更好的兼容性
        $pathInfo = null;

        //处理requestUri
        $requestUri = $this->getRequestUri();
        $finalBaseUrl = $this->getBaseUrl();

        // Remove the query string from REQUEST_URI
        if ($pos = strpos($requestUri, '?')) {
            $requestUri = substr($requestUri, 0, $pos);
        }

        if (
            (null !== $finalBaseUrl)
            && (false === ($pathInfo = substr($requestUri, strlen($finalBaseUrl))))
        ) {
            // If substr() returns false then PATH_INFO is set to an empty string
            $pathInfo = '/';
        } elseif (null === $finalBaseUrl) {
            $pathInfo = $requestUri;
        }

        if (!empty($pathInfo)) {
            //针对iis的utf8编码做强制转换
            //参考http://docs.moodle.org/ja/%E5%A4%9A%E8%A8%80%E8%AA%9E%E5%AF%BE%E5%BF%9C%EF%BC%9A%E3%82%B5%E3%83%BC%E3%83%90%E3%81%AE%E8%A8%AD%E5%AE%9A
            if (
                !empty($inputEncoding)
                && !empty($outputEncoding)
                && (stripos($_SERVER['SERVER_SOFTWARE'], 'Microsoft-IIS') !== false
                    || stripos($_SERVER['SERVER_SOFTWARE'], 'ExpressionDevServer') !== false)
            ) {
                if (function_exists('mb_convert_encoding')) {
                    $pathInfo = mb_convert_encoding($pathInfo, $outputEncoding, $inputEncoding);
                } elseif (function_exists('iconv')) {
                    $pathInfo = iconv($inputEncoding, $outputEncoding, $pathInfo);
                }
            }
        } else {
            $pathInfo = '/';
        }

        // fix issue 456
        return ($this->pathInfo = '/' . ltrim(urldecode($pathInfo), '/'));
    }

    /**
     * 获取环境变量
     *
     * @access public
     *
     * @param string $name 获取环境变量名
     * @param string|null $default
     *
     * @return string|null
     */
    public function getServer(string $name, string $default = null): ?string
    {
        return $_SERVER[$name] ?? $default;
    }

    /**
     * 获取ip地址
     *
     * @access public
     * @return string
     */
    public function getIp(): string
    {
        if (null === $this->ip) {
            $header = defined('__TYPECHO_IP_SOURCE__') ? __TYPECHO_IP_SOURCE__ : 'X-Forwarded-For' ;
            $ip = $this->getHeader($header, $this->getHeader('Client-Ip', $this->getServer('REMOTE_ADDR')));

            if (!empty($ip)) {
                [$ip] = array_map('trim', explode(',', $ip));
                $ip = filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6);
            }

            if (!empty($ip)) {
                $this->ip = $ip;
            } else {
                $this->ip = 'unknown';
            }
        }

        return $this->ip;
    }

    /**
     * get header value
     *
     * @param string $key
     * @param string|null $default
     *
     * @return string|null
     */
    public function getHeader(string $key, ?string $default = null): ?string
    {
        $key = 'HTTP_' . strtoupper(str_replace('-', '_', $key));
        return $this->getServer($key, $default);
    }

    /**
     * 获取客户端
     *
     * @access public
     * @return string
     */
    public function getAgent(): ?string
    {
        return $this->getHeader('User-Agent');
    }

    /**
     * 获取客户端
     *
     * @access public
     * @return string|null
     */
    public function getReferer(): ?string
    {
        return $this->getHeader('Referer');
    }

    /**
     * 判断是否为get方法
     *
     * @access public
     * @return boolean
     */
    public function isGet(): bool
    {
        return 'GET' == $this->getServer('REQUEST_METHOD');
    }

    /**
     * 判断是否为post方法
     *
     * @access public
     * @return boolean
     */
    public function isPost(): bool
    {
        return 'POST' == $this->getServer('REQUEST_METHOD');
    }

    /**
     * 判断是否为put方法
     *
     * @access public
     * @return boolean
     */
    public function isPut(): bool
    {
        return 'PUT' == $this->getServer('REQUEST_METHOD');
    }

    /**
     * 判断是否为ajax
     *
     * @access public
     * @return boolean
     */
    public function isAjax(): bool
    {
        return 'XMLHttpRequest' == $this->getServer('HTTP_X_REQUESTED_WITH');
    }

    /**
     * 判断输入是否满足要求
     *
     * @access public
     *
     * @param mixed $query 条件
     *
     * @return boolean
     */
    public function is($query): bool
    {
        $validated = false;

        /** 解析串 */
        if (is_string($query)) {
            parse_str($query, $params);
        } elseif (is_array($query)) {
            $params = $query;
        }

        /** 验证串 */
        if (!empty($params)) {
            $validated = true;
            foreach ($params as $key => $val) {
                $validated = empty($val) ? $this->__isset($key) : ($val == $this->get($key));

                if (!$validated) {
                    break;
                }
            }
        }

        return $validated;
    }

    /**
     * 应用过滤器
     *
     * @param mixed $value
     *
     * @return mixed
     */
    private function applyFilter($value)
    {
        if ($this->filter) {
            foreach ($this->filter as $filter) {
                $value = is_array($value) ? array_map($filter, $value) :
                    call_user_func($filter, $value);
            }

            $this->filter = [];
        }

        return $value;
    }
}
