(function(){var t,k,r,d,c,g,$,f,B=[].slice;function e(){this.commonWhiteList="kbd|b|i|strong|em|sup|sub|br|code|del|a|hr|small",this.blockHtmlTags="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|address|form|fieldset|iframe|hr|legend|article|section|nav|aside|hgroup|header|footer|figcaption|svg|script|noscript",this.specialWhiteList={table:"table|tbody|thead|tfoot|tr|td|th"},this.hooks={},this.html=!1,this.line=!1,this.blockParsers=[["code",10],["shtml",20],["pre",30],["ahtml",40],["shr",50],["list",60],["math",70],["html",80],["footnote",90],["definition",100],["quote",110],["table",120],["sh",130],["mh",140],["dhr",150],["default",9999]],this.parsers={}}f=function(t){return t.charAt(0).toUpperCase()+t.substring(1)},c=function(t){return t.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&")},g=function(t,e,n){var r,s,l,i,o,a;if(t instanceof Array)if(e instanceof Array)for(r=s=0,i=t.length;s<i;r=++s)a=t[r],n=g(a,e[r],n);else for(l=0,o=t.length;l<o;l++)a=t[l],n=g(a,e,n);else t=c(t),n=n.replace(new RegExp(t,"g"),e.replace(/\$/g,"$$$$"));return n},d=function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},$=function(t,e){var n,r,s,l,i;if(null==e&&(e=null),null==e)return t.replace(/^\s*/,"").replace(/\s*$/,"");for(i="",r=s=0,l=e.length-1;0<=l?s<=l:l<=s;r=0<=l?++s:--s)n=e[r],i+=c(n);return i="["+i+"]*",t.replace(new RegExp("^"+i),"").replace(new RegExp(i+"$"),"")},k=function(t){var e,n,r,s=[];if(t instanceof Array)for(n=e=0,r=t.length;e<r;n=++e)t[n],s.push(n);else for(n in t)s.push(n);return s},r=function(t){var e,n,r,s,l=[];if(t instanceof Array)for(n=0,r=t.length;n<r;n++)s=t[n],l.push(s);else for(e in t)s=t[e],l.push(s);return l},e.prototype.makeHtml=function(t){var e,n,r,s,l;for(this.footnotes=[],this.definitions={},this.holders={},this.uniqid=Math.ceil(1e7*Math.random())+Math.ceil(1e7*Math.random()),this.id=0,this.blockParsers.sort(function(t,e){return t[1]<e[1]?-1:1}),e=0,n=(l=this.blockParsers).length;e<n;e++)r=(s=l[e])[0],void 0!==s[2]?this.parsers[r]=s[2]:this.parsers[r]=this["parseBlock"+f(r)].bind(this);return t=this.initText(t),t=this.parse(t),t=this.makeFootnotes(t),t=this.optimizeLines(t),this.call("makeHtml",t)},e.prototype.enableHtml=function(t){this.html=null==t||t},e.prototype.enableLine=function(t){this.line=null==t||t},e.prototype.hook=function(t,e){return null==this.hooks[t]&&(this.hooks[t]=[]),this.hooks[t].push(e)},e.prototype.makeHolder=function(t){var e="|\r"+this.uniqid+this.id+"\r|";return this.id+=1,this.holders[e]=t,e},e.prototype.initText=function(t){return t.replace(/\t/g,"    ").replace(/\r/g,"").replace(/(\u000A|\u000D|\u2028|\u2029)/g,"\n")},e.prototype.makeFootnotes=function(t){var e,n;if(0<this.footnotes.length){for(t+='<div class="footnotes"><hr><ol>',e=1;n=this.footnotes.shift();)"string"==typeof n?n+=' <a href="#fnref-'+e+'" class="footnote-backref">&#8617;</a>':(n[n.length-1]+=' <a href="#fnref-'+e+'" class="footnote-backref">&#8617;</a>',n=1<n.length?this.parse(n.join("\n")):this.parseInline(n[0])),t+='<li id="fn-'+e+'">'+n+"</li>",e+=1;t+="</ol></div>"}return t},e.prototype.parse=function(t,e,n){var r,s,l,i,o,a,c,h,p,u;for(null==e&&(e=!1),null==n&&(n=0),a=[],r=this.parseBlock(t,a),l="",e&&1===r.length&&"normal"===r[0][0]&&(r[0][3]=!0),i=0,o=r.length;i<o;i++)p=(s=r[i])[0],h=s[1],c=s[2],u=s[3],s=a.slice(h,c+1),p="parse"+f(p),s=this.call("before"+f(p),s,u),c=this[p](s,u,h+n,c+n),l+=this.call("after"+f(p),c,u);return l},e.prototype.call=function(){var t,e,n,r=arguments[0],s=2<=arguments.length?B.call(arguments,1):[],l=s[0];if(null==this.hooks[r])return l;for(t=0,e=(n=this.hooks[r]).length;t<e;t++)l=n[t].apply(this,s),s[0]=l;return l},e.prototype.releaseHolder=function(t,e){var n;for(null==e&&(e=!0),n=0;0<=t.indexOf("\r")&&n<10;)t=g(k(this.holders),r(this.holders),t),n+=1;return e&&(this.holders={}),t},e.prototype.markLine=function(t,e){return null==e&&(e=-1),this.line?'<span class="line" data-start="'+t+'" data-end="'+(e=e<0?t:e)+'" data-id="'+this.uniqid+'"></span>':""},e.prototype.markLines=function(t,e){var n,r=-1;return this.line?t.map((n=this,function(t){return r+=1,n.markLine(e+r)+t})):t},e.prototype.optimizeLines=function(t){var n=0,e=new RegExp('class="line" data\\-start="([0-9]+)" data\\-end="([0-9]+)" (data\\-id="'+this.uniqid+'")',"g");return this.line?t.replace(e,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=n!==parseInt(t[1])?'class="line" data-start="'+n+'" data-start-original="'+t[1]+'" data-end="'+t[2]+'" '+t[3]:t[0];return n=1+parseInt(t[2]),e}):t},e.prototype.parseInline=function(t,e,n,r){var s,l,i,o,a,c,h,p,u,f,k,m;return null==e&&(e=""),null==n&&(n=!0),null==r&&(r=!0),t=(t=(t=(t=(t=(t=this.call("beforeParseInline",t)).replace(/(^|[^\\])(`+)(.+?)\2/gm,(s=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return t[1]+s.makeHolder("<code>"+d(t[3])+"</code>")}))).replace(/(^|[^\\])(\$+)(.+?)\2/gm,(l=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return t[1]+l.makeHolder(t[2]+d(t[3])+t[2])}))).replace(/\\(.)/g,(i=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=t[1].match(/^[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]$/)?"":"\\",t=d(t[1]);return t=t.replace(/\$/g,"&dollar;"),i.makeHolder(e+t)}))).replace(/<(https?:\/\/.+|(?:mailto:)?[_a-z0-9-\.\+]+@[_\w-]+\.[a-z]{2,})>/gi,(o=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=o.cleanUrl(t[1]),t=o.call("parseLink",e);return o.makeHolder('<a href="'+e+'">'+t+"</a>")}))).replace(/<(\/?)([a-z0-9-]+)(\s+[^>]*)?>/gi,(a=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return a.html||0<=("|"+a.commonWhiteList+"|"+e+"|").indexOf("|"+t[2].toLowerCase()+"|")?a.makeHolder(t[0]):a.makeHolder(d(t[0]))})),this.html&&(t=t.replace(/<!\-\-(.*?)\-\->/g,(c=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return c.makeHolder(t[0])}))),t=(t=(t=(t=(t=(t=g(["<",">"],["&lt;","&gt;"],t)).replace(/\[\^((?:[^\]]|\\\]|\\\[)+?)\]/g,(h=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=h.footnotes.indexOf(t[1]);return e<0&&(e=h.footnotes.length+1,h.footnotes.push(h.parseInline(t[1],"",!1))),h.makeHolder('<sup id="fnref-'+e+'"><a href="#fn-'+e+'" class="footnote-ref">'+e+"</a></sup>")}))).replace(/!\[((?:[^\]]|\\\]|\\\[)*?)\]\(((?:[^\)]|\\\)|\\\()+?)\)/g,(p=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=d(p.escapeBracket(t[1])),n=p.escapeBracket(t[2]),t=p.cleanUrl(n,!0);return n=t[0],t=null==(t=t[1])?e:' title="'+t+'"',p.makeHolder('<img src="'+n+'" alt="'+t+'" title="'+t+'">')}))).replace(/!\[((?:[^\]]|\\\]|\\\[)*?)\]\[((?:[^\]]|\\\]|\\\[)+?)\]/g,(u=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=d(u.escapeBracket(t[1])),e=null!=u.definitions[t[2]]?'<img src="'+u.definitions[t[2]]+'" alt="'+e+'" title="'+e+'">':e;return u.makeHolder(e)}))).replace(/\[((?:[^\]]|\\\]|\\\[)+?)\]\(((?:[^\)]|\\\)|\\\()+?)\)/g,(f=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=f.parseInline(f.escapeBracket(t[1]),"",!1,!1),n=f.escapeBracket(t[2]),t=f.cleanUrl(n,!0);return n=t[0],t=null==(t=t[1])?"":' title="'+t+'"',f.makeHolder('<a href="'+n+'"'+t+">"+e+"</a>")}))).replace(/\[((?:[^\]]|\\\]|\\\[)+?)\]\[((?:[^\]]|\\\]|\\\[)+?)\]/g,(k=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=k.parseInline(k.escapeBracket(t[1]),"",!1,!1),e=null!=k.definitions[t[2]]?'<a href="'+k.definitions[t[2]]+'">'+e+"</a>":e;return k.makeHolder(e)})),t=this.parseInlineCallback(t),r&&(t=t.replace(/(^|[^\"])(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)|(?:mailto:)?[_a-z0-9-\.\+]+@[_\w-]+\.[a-z]{2,})($|[^\"])/g,(m=this,function(){var t=1<=arguments.length?B.call(arguments,0):[],e=m.cleanUrl(t[2]),n=m.call("parseLink",t[2]);return t[1]+'<a href="'+e+'">'+n+"</a>"+t[5]}))),t=this.call("afterParseInlineBeforeRelease",t),t=this.releaseHolder(t,n),t=this.call("afterParseInline",t)},e.prototype.parseInlineCallback=function(t){var e,n,r,s,l,i,o;return t=(t=(t=(t=(t=(t=(t=t.replace(/(\*{3})((?:.|\r)+?)\1/gm,(e=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return"<strong><em>"+e.parseInlineCallback(t[2])+"</em></strong>"}))).replace(/(\*{2})((?:.|\r)+?)\1/gm,(n=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return"<strong>"+n.parseInlineCallback(t[2])+"</strong>"}))).replace(/(\*)((?:.|\r)+?)\1/gm,(r=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return"<em>"+r.parseInlineCallback(t[2])+"</em>"}))).replace(/(\s+|^)(_{3})((?:.|\r)+?)\2(\s+|$)/gm,(s=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return t[1]+"<strong><em>"+s.parseInlineCallback(t[3])+"</em></strong>"+t[4]}))).replace(/(\s+|^)(_{2})((?:.|\r)+?)\2(\s+|$)/gm,(l=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return t[1]+"<strong>"+l.parseInlineCallback(t[3])+"</strong>"+t[4]}))).replace(/(\s+|^)(_)((?:.|\r)+?)\2(\s+|$)/gm,(i=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return t[1]+"<em>"+i.parseInlineCallback(t[3])+"</em>"+t[4]}))).replace(/(~{2})((?:.|\r)+?)\1/gm,(o=this,function(){var t=1<=arguments.length?B.call(arguments,0):[];return"<del>"+o.parseInlineCallback(t[2])+"</del>"}))},e.prototype.parseBlock=function(t,e){for(var n,r,s,l,i,o,a,c,h,p=t.split("\n"),u=0,f=p.length;u<f;u++)i=p[u],e.push(i);for(this.blocks=[],this.current="normal",this.pos=-1,h={special:k(this.specialWhiteList).join("|"),empty:0,html:!1},r=s=0,l=e.length;s<l;r=++s)if(i=e[r],n=this.getBlock(),null!=n&&(n=n.slice(0)),"normal"===this.current||this.parsers[this.current](n,r,i,h,e))for(o in c=this.parsers)if(a=c[o],o!==this.current&&!a(n,r,i,h,e))break;return this.optimizeBlocks(this.blocks,e)},e.prototype.parseBlockList=function(t,e,n,r){var s,l;if(this.isBlock("list")&&!n.match(/^\s*\[((?:[^\]]|\\\]|\\\[)+?)\]:\s*(.+)$/)){if(n.match(/^(\s*)(~{3,}|`{3,})([^`~]*)$/i))return!0;if(r.empty<=1&&(l=n.match(/^(\s*)\S+/))&&l[1].length>=t[3][0]+r.empty)return r.empty=0,this.setBlock(e),!1;if(n.match(/^\s*$/)&&0===r.empty)return r.empty+=1,this.setBlock(e),!1}return!(l=n.match(/^(\s*)((?:[0-9]+\.)|\-|\+|\*)\s+/i))||(s=l[1].length,n=l[0].length-s,l=(r.empty=0)<="+-*".indexOf(l[2])?"ul":"ol",!this.isBlock("list")||s<t[3][0]||s===t[3][0]&&l!==t[3][1]?this.startBlock("list",e,[s,l,n]):this.setBlock(e),!1)},e.prototype.parseBlockCode=function(t,e,n,r){var s;if(n=n.match(/^(\s*)(~{3,}|`{3,})([^`~]*)$/i)){if(this.isBlock("code")){if(r.code!==n[2])return this.setBlock(e),!1;(s=t[3][2])?(r.empty=0,this.combineBlock().setBlock(e)):this.setBlock(e).endBlock()}else s=!1,this.isBlock("list")&&(t=t[3][0],s=n[1].length>=t+r.empty),r.code=n[2],this.startBlock("code",e,[n[1],n[3],s]);return!1}return!this.isBlock("code")||(this.setBlock(e),!1)},e.prototype.parseBlockShtml=function(t,e,n,r){if(this.html){if(n.match(/^(\s*)!!!(\s*)$/))return this.isBlock("shtml")?this.setBlock(e).endBlock():this.startBlock("shtml",e),!1;if(this.isBlock("shtml"))return this.setBlock(e),!1}return!0},e.prototype.parseBlockAhtml=function(t,e,n,r){var s,l,i,o;if(this.html)if(o=new RegExp("^\\s*<("+this.blockHtmlTags+")(\\s+[^>]*)?>","i"),o=n.match(o)){if(this.isBlock("ahtml"))return this.setBlock(e),!1;if(void 0===o[2]||"/"!==o[2]){for(this.startBlock("ahtml",e),s=new RegExp("\\s*<("+this.blockHtmlTags+")(\\s+[^>]*)?>","ig");i=s.exec(n);)l=i[1];return 0<=n.indexOf("</"+l+">")?this.endBlock():r.html=l,!1}}else{if(r.html&&0<=n.indexOf("</"+r.html+">"))return this.setBlock(e).endBlock(),r.html=!1;if(this.isBlock("ahtml"))return this.setBlock(e),!1;if(o=n.match(/^\s*<!\-\-(.*?)\-\->\s*$/))return this.startBlock("ahtml",e).endBlock(),!1}return!0},e.prototype.parseBlockMath=function(t,e,n){return n.match(/^(\s*)\$\$(\s*)$/)?(this.isBlock("math")?this.setBlock(e).endBlock():this.startBlock("math",e),!1):!this.isBlock("math")||(this.setBlock(e),!1)},e.prototype.parseBlockPre=function(t,e,n,r){return n.match(/^ {4}/)?(this.isBlock("pre")?this.setBlock(e):this.startBlock("pre",e),!1):!this.isBlock("pre")||!n.match(/^\s*$/)||(this.setBlock(e),!1)},e.prototype.parseBlockHtml=function(t,e,n,r){var s,l;return(s=n.match(new RegExp("^\\s*<("+r.special+")(\\s+[^>]*)?>","i")))?(l=s[1].toLowerCase(),this.isBlock("html",l)||this.isBlock("pre")||this.startBlock("html",e,l),!1):(s=n.match(new RegExp("</("+r.special+")>\\s*$","i")))?(l=s[1].toLowerCase(),this.isBlock("html",l)&&this.setBlock(e).endBlock(),!1):!this.isBlock("html")||(this.setBlock(e),!1)},e.prototype.parseBlockFootnote=function(t,e,n){var r;return!(r=n.match(/^\[\^((?:[^\]]|\\\]|\\\[)+?)\]:/))||(n=r[0].length-1,this.startBlock("footnote",e,[n,r[1]]),!1)},e.prototype.parseBlockDefinition=function(t,e,n){return!(n=n.match(/^\s*\[((?:[^\]]|\\\]|\\\[)+?)\]:\s*(.+)$/))||(this.definitions[n[1]]=this.cleanUrl(n[2]),this.startBlock("definition",e).endBlock(),!1)},e.prototype.parseBlockQuote=function(t,e,n){return!(n=n.match(/^(\s*)>/))||(this.isBlock("list")&&0<n[1].length||this.isBlock("quote")?this.setBlock(e):this.startBlock("quote",e),!1)},e.prototype.parseBlockTable=function(t,e,n,r,s){var l,i,o,a,c,h;if(c=n.match(/^((?:(?:(?:\||\+)(?:[ :]*\-+[ :]*)(?:\||\+))|(?:(?:[ :]*\-+[ :]*)(?:\||\+)(?:[ :]*\-+[ :]*))|(?:(?:[ :]*\-+[ :]*)(?:\||\+))|(?:(?:\||\+)(?:[ :]*\-+[ :]*)))+)$/)){if(this.isBlock("table"))t[3][0].push(t[3][2]),t[3][2]+=1,this.setBlock(e,t[3]);else{for(n=0,null==t||"normal"!==t[0]||s[t[2]].match(/^\s*$/)?this.startBlock("table",e):(n=1,this.backBlock(1,"table")),"|"===c[1][0]&&(c[1]=c[1].substring(1),"|"===c[1][c[1].length-1]&&(c[1]=c[1].substring(0,c[1].length-1))),i=[],o=0,a=(h=c[1].split(/\+|\|/)).length;o<a;o++)l="none",(c=h[o].match(/^\s*(:?)\-+(:?)\s*$/))&&(c[1]&&c[2]?l="center":c[1]?l="left":c[2]&&(l="right")),i.push(l);this.setBlock(e,[[n],i,n+1])}return!1}return!0},e.prototype.parseBlockSh=function(t,e,n){return!(n=n.match(/^(#+)(.*)$/))||(n=Math.min(n[1].length,6),this.startBlock("sh",e,n).endBlock(),!1)},e.prototype.parseBlockMh=function(t,e,n,r,s){return!((n=n.match(/^\s*((=|-){2,})\s*$/))&&null!=t&&"normal"===t[0]&&!s[t[2]].match(/^\s*$/))||(this.isBlock("normal")?this.backBlock(1,"mh","="===n[1][0]?1:2).setBlock(e).endBlock():this.startBlock("normal",e),!1)},e.prototype.parseBlockShr=function(t,e,n){return!n.match(/^(\* *){3,}\s*$/)||(this.startBlock("hr",e).endBlock(),!1)},e.prototype.parseBlockDhr=function(t,e,n){return!n.match(/^(- *){3,}\s*$/)||(this.startBlock("hr",e).endBlock(),!1)},e.prototype.parseBlockDefault=function(t,e,n,r){return this.isBlock("footnote")?n.match(/^(\s*)/)[1].length>=t[3][0]?this.setBlock(e):this.startBlock("normal",e):this.isBlock("table")?0<=n.indexOf("|")?(t[3][2]+=1,this.setBlock(e,t[3])):this.startBlock("normal",e):this.isBlock("quote")?n.match(/^(\s*)$/)?this.startBlock("normal",e):this.setBlock(e):null==t||"normal"!==t[0]?this.startBlock("normal",e):this.setBlock(e),!0},e.prototype.optimizeBlocks=function(t,e){var n,r,s,l,i,o,a,c,h=t.slice(0),p=e.slice(0);for(h=this.call("beforeOptimizeBlocks",h,p),s=0;null!=h[s];)l=!1,n=h[s],o=null!=h[s-1]?h[s-1]:null,i=null!=h[s+1]?h[s+1]:null,c=n[0],r=n[1],a=n[2],"pre"===c&&p.slice(n[1],n[2]+1).reduce(function(t,e){return e.match(/^\s*$/)&&t},!0)&&(n[0]=c="normal"),"normal"===c&&(c=["list","quote"],r===a&&p[r].match(/^\s*$/)&&null!=o&&null!=i&&o[0]===i[0]&&0<=c.indexOf(o[0])&&("list"!==o[0]||o[3][0]===i[3][0]&&o[3][1]===i[3][1])&&(h[s-1]=[o[0],o[1],i[2],null!=o[3]?o[3]:null],h.splice(s,2),l=!0)),l||(s+=1);return this.call("afterOptimizeBlocks",h,p)},e.prototype.parseCode=function(t,e,n){var r,s,l,i=e[0],o=e[1];return o=$(o),r=i.length,o.match(/^[_a-z0-9-\+\#\:\.]+$/i)?1<(e=o.split(":")).length&&(o=e[0],l=e[1],o=$(o),l=$(l)):o=null,s=!0,t=t.slice(1,-1).map(function(t){return t=t.replace(new RegExp("^[ ]{"+r+"}"),""),s&&!t.match(/^\s*$/)&&(s=!1),d(t)}),n=this.markLines(t,n+1).join("\n"),s?"":"<pre><code"+(o?' class="'+o+'"':"")+(l?' rel="'+l+'"':"")+">"+n+"</code></pre>"},e.prototype.parsePre=function(t,e,n){return t=t.map(function(t){return d(t.substring(4))}),(n=this.markLines(t,n).join("\n")).match(/^\s*$/)?"":"<pre><code>"+n+"</code></pre>"},e.prototype.parseAhtml=function(t,e,n){return $(this.markLines(t,n).join("\n"))},e.prototype.parseShtml=function(t,e,n){return $(this.markLines(t.slice(1,-1),n+1).join("\n"))},e.prototype.parseMath=function(t,e,n,r){return"<p>"+this.markLine(n,r)+d(t.join("\n"))+"</p>"},e.prototype.parseSh=function(t,e,n,r){t=this.markLine(n,r)+this.parseInline($(t[0],"# "));return t.match(/^\s*$/)?"":"<h"+e+">"+t+"</h"+e+">"},e.prototype.parseMh=function(t,e,n,r){return this.parseSh(t,e,n,r)},e.prototype.parseQuote=function(t,e,n){return(t=(t=t.map(function(t){return t.replace(/^\s*> ?/,"")})).join("\n")).match(/^\s*$/)?"":"<blockquote>"+this.parse(t,!0,n)+"</blockquote>"},e.prototype.parseList=function(t,e,n){for(var r,s,l,i,o,a,c="",h=e[0],p=e[1],u=e[2],f=[],k="",m=0,d=r=0,g=t.length;r<g;d=++r)(o=(i=t[d]).match(new RegExp("^(\\s{"+h+"})((?:[0-9]+\\.?)|\\-|\\+|\\*)(\\s+)(.*)$")))?("ol"===p&&0===d&&1!==(n=parseInt(o[2]))&&(k=' start="'+n+'"'),f.push([o[4]]),m=f.length-1):f[m].push(i.replace(new RegExp("^\\s{"+(u+h)+"}"),""));for(s=0,l=f.length;s<l;s++)a=f[s],c+="<li>"+this.parse(a.join("\n"),!0,n)+"</li>",n+=a.length;return"<"+p+k+">"+c+"</"+p+">"},e.prototype.parseTable=function(t,e,n){for(var r,s,l,i,o,a,c,h,p,u,f,k=e[0],m=e[1],d=0<k.length&&0<k.reduce(function(t,e){return e+t}),g="<table>",B=!d||null,b=!1,y=s=0,v=t.length;s<v;y=++s)if(a=t[y],0<=k.indexOf(y))d&&b&&(B=!(d=!1));else{for(b=!0,"|"===(a=$(a))[0]&&"|"===(a=a.substring(1))[a.length-1]&&(a=a.substring(0,a.length-1)),r={},i=-1,l=0,o=(p=a.split("|").map(function(t){return t.match(/^\s*$/)?" ":$(t)})).length;l<o;l++)0<(h=p[l]).length?r[i+=1]=[null!=r[i]?r[i][0]+1:1,h]:null!=r[i]?r[i][0]+=1:r[0]=[1,h];for(y in d?g+="<thead>":B&&(g+="<tbody>"),g+="<tr",this.line&&(g+=' class="line" data-start="'+(n+y)+'" data-end="'+(n+y)+'" data-id="'+this.uniqid+'"'),g+=">",r)c=(u=r[y])[0],f=u[1],g+="<"+(u=d?"th":"td"),1<c&&(g+=' colspan="'+c+'"'),null!=m[y]&&"none"!==m[y]&&(g+=' align="'+m[y]+'"'),g+=">"+this.parseInline(f)+"</"+u+">";g+="</tr>",d?g+="</thead>":B=B&&!1}return null!==B&&(g+="</tbody>"),g+"</table>"},e.prototype.parseHr=function(t,e,n){return this.line?'<hr class="line" data-start="'+n+'" data-end="'+n+'">':"<hr>"},e.prototype.parseNormal=function(t,e,n){var r,s=0;return t=t.map((r=this,function(t){return(t=r.parseInline(t)).match(/^\s*$/)||(t=r.markLine(n+s)+t),s+=1,t})),(t=(t=(t=$(t.join("\n"))).replace(/(\n\s*){2,}/g,function(){return e=!1,"</p><p>"})).replace(/\n/g,"<br>")).match(/^\s*$/)?"":e?t:"<p>"+t+"</p>"},e.prototype.parseFootnote=function(t,e){e[0];var e=e[1],e=this.footnotes.indexOf(e);return 0<=e&&((t=t.slice(0))[0]=t[0].replace(/^\[\^((?:[^\]]|\]|\[)+?)\]:/,""),this.footnotes[e]=t),""},e.prototype.parseDefinition=function(){return""},e.prototype.parseHtml=function(t,e,n){var r;return t=t.map((r=this,function(t){return r.parseInline(t,null!=r.specialWhiteList[e]?r.specialWhiteList[e]:"")})),this.markLines(t,n).join("\n")},e.prototype.cleanUrl=function(t,e){var n,r;return null==e&&(e=!1),r=null,t=$(t),e&&0<=(n=t.indexOf(" "))&&(r=d($(t.substring(n+1)," \"'")),t=t.substring(0,n)),(n=(t=t.replace(/["'<>\s]/g,"")).match(/^(mailto:)?[_a-z0-9-\.\+]+@[_\w-]+\.[a-z]{2,}$/i))&&null==n[1]&&(t="mailto:"+t),t.match(/^\w+:/i)&&!t.match(/^(https?|mailto):/i)?"#":e?[t,r]:t},e.prototype.escapeBracket=function(t){return g(["\\[","\\]","\\(","\\)"],["[","]","(",")"],t)},e.prototype.startBlock=function(t,e,n){return null==n&&(n=null),this.pos+=1,this.current=t,this.blocks.push([t,e,e,n]),this},e.prototype.endBlock=function(){return this.current="normal",this},e.prototype.isBlock=function(t,e){return null==e&&(e=null),this.current===t&&(null===e||this.blocks[this.pos][3]===e)},e.prototype.getBlock=function(){return null!=this.blocks[this.pos]?this.blocks[this.pos]:null},e.prototype.setBlock=function(t,e){return null==t&&(t=null),null==e&&(e=null),null!==t&&(this.blocks[this.pos][2]=t),null!==e&&(this.blocks[this.pos][3]=e),this},e.prototype.backBlock=function(t,e,n){var r;return null==n&&(n=null),this.pos<0?this.startBlock(e,0,n):(r=this.blocks[this.pos][2],this.blocks[this.pos][2]=r-t,n=[e,r-t+1,r,n],this.blocks[this.pos][1]<=this.blocks[this.pos][2]?(this.pos+=1,this.blocks.push(n)):this.blocks[this.pos]=n,this.current=e,this)},e.prototype.combineBlock=function(){var t,e;return this.pos<1||(e=this.blocks[this.pos-1].slice(0),t=this.blocks[this.pos].slice(0),e[2]=t[2],this.blocks[this.pos-1]=e,this.current=e[0],this.blocks=this.blocks.slice(0,-1),--this.pos),this},t=e,"undefined"!=typeof module&&null!==module?module.exports=t:"undefined"!=typeof window&&null!==window&&(window.HyperDown=t)}).call(this);