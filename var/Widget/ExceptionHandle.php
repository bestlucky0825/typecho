<?php

namespace Widget;

if (!defined('__TYPECHO_ROOT_DIR__')) {
    exit;
}

/**
 * 异常处理组件
 *
 * @author qining
 * @category typecho
 * @package Widget
 * @copyright Copyright (c) 2008 Typecho team (http://www.typecho.org)
 * @license GNU General Public License 2.0
 */
class ExceptionHandle extends Widget_Archive
{
    /**
     * 重载构造函数
     */
    public function __construct()
    {
        self::widget('Widget_Archive@404', 'type=404')->render();
        exit;
    }
}
