report-js -- 前端日志上报与JS异常监控
---

## Install

```shell
$ npm install report-js
```
```shell
$ bower install https://gitlab.com/TalBlocks/report-js.git
```
```shell
$ lego install report-js --save
```

## Getting Started
> report-js 必须在所有类库之前加载并初始化。
> 但是要在 jquery、seajs、requrejs等类库后调用spyAll()。

##### 初始化
```javascript
QYLIN_REPORT.init({
  id: 1                                 // 不指定 id 将不上报
});
```
##### 配置说明
```javascript
QYLIN_REPORT.init({
  id: 1,                                // 上报 id, 不指定 id 将不上报
  uin: 123,                             // 指定用户 id, (默认已经读取 qq uin)
  delay: 1000,                          // 当 combo 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
  url: "//badjs2.qq.com/badjs",         // 指定上报地址
  ignore: [/Script error/i],            // 忽略某个错误
  random: 1,                            // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
  repeat: 5,                            // 重复上报次数(对于同一个错误超过多少次不上报)
                                        // 避免出现单个用户同一错误上报过多的情况
  onReport: function(id, errObj){},     // 当上报的时候回调。 id: 上报的 id, errObj: 错误的对象
  submit,                               // 覆盖原来的上报方式，可以自行修改为 post 上报等
  ext: {}                               // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor,
  offlineLog : false,                    // 是否启离线日志 [默认 false]
  offlineLogExp : 5,                    // 离线有效时间，默认最近5天
});
```
BJ_Report 是重写了 window.onerror 进行上报的，无需编写任何捕获错误的代码

#####  手动上报
```javascript
QYLIN_REPORT.report("error msg");

QYLIN_REPORT.report({
  msg: "xx load error",                 // 错误信息
  target: "xxx.js",                     // 错误的来源js
  rowNum: 100,                          // 错误的行数
  colNum: 100,                          // 错误的列数
});

try{
    // something throw error ...
}catch(error){
    QYLIN_REPORT.report(e);
}
```

#####  延迟上报

```javascript
QYLIN_REPORT.push("error msg");

QYLIN_REPORT.push({
  msg: "xx load error",                 // 错误信息
  target: "xxx.js",                     // 错误的来源js
  rowNum: 100,                          // 错误的行数
  colNum: 100,                          // 错误的列数
});

QYLIN_REPORT.report();

```

#####  上报离线日志  

```javascript
QYLIN_REPORT.reportOfflineLog();
```

> 什么是离线日志？ [#25](https://gitlab.com/TalBlocks/report-js/issues/25)

#####  用法
```javascript
//初始化
QYLIN_REPORT.init({id: 1})

//主动上报错误日志
QYLIN_REPORT.report("error msg 2");

//info上报，用于记录操作日志
QYLIN_REPORT.info("info");

//可以结合实时上报，跟踪问题; 不存入存储
QYLIN_REPORT.debug("debug");

//记录离线日志  
QYLIN_REPORT.offlineLog("offlineLog");
```
<br/>

### 高级用法
>script error  的错误，怎么解决？  [#3](https://gitlab.com/TalBlocks/report-js/issues/3)

由于 BJ_Report 只是重写了onerror 方法而已，而且浏览器的跨域问题不能获得外链 javascript 的错误，所以使用tryJs  进行包裹。
#### 包裹jquery
```javascript
QYLIN_REPORT.tryJs().spyJquery();
```
包裹 jquery 的 event.add , event.remove , event.ajax 这几个异步方法。
<br/>
<br/>
#### 包裹 define , require
```javascript
QYLIN_REPORT.tryJs().spyModules();
```
包裹 模块化框架 的 define , require 方法
<br/>
<br/>
#### 包裹  js 默认的方法
```javascript
QYLIN_REPORT.tryJs().spySystem();
```
包裹 js 的 setTimeout , setInterval 方法
<br/>
<br/>
#### 包裹 自定义的方法
```javascript
var customFunction = function (){};
customFunction  = QYLIN_REPORT.tryJs().spyCustom(customFunction );

// 只会包裹 customOne  , customTwo
var customObject = { customOne : function (){} , customTwo : function (){} , customVar : 1}
QYLIN_REPORT.tryJs().spyCustom(customObject );
```
包裹 自定义的方法或则对象
<br/>
<br/>
#### 运行所有默认的包裹
```javascript
//自动运行 SpyJquery , SpyModule , SpySystem
QYLIN_REPORT.tryJs().spyAll();
```

http://www.alloyteam.com/2014/03/front-end-data-monitoring/

##### v1.0.0
1. 功能上线


function error(msg,url,line){
   var REPORT_URL = "http://children-log.code-test.100tal.com/"; // 收集上报数据的信息
   var m =[msg, url, line, navigator.userAgent, +new Date];// 收集错误信息，发生错误的脚本文件网络地址，用户代理信息，时间
   var url = REPORT_URL + m.join('||');// 组装错误上报信息内容URL
   var img = new Image;
   img.onload = img.onerror = function(){
      img = null;
   };
   img.src = url;// 发送数据到后台cgi
}
// 监听错误上报
window.onerror = function(msg,url,line){
   error(msg,url,line);
}

QYLIN_REPORT.init({
  id: 1,                                // 上报 id, 不指定 id 将不上报
  uin: 123,                             // 指定用户 id, (默认已经读取 qq uin)
  delay: 1000,                          // 当 combo 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
  url: "http://children-log.code-test.100tal.com/",         // 指定上报地址
  ignore: [/Script error/i],            // 忽略某个错误
  random: 1,                            // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
  repeat: 5,                            // 重复上报次数(对于同一个错误超过多少次不上报)
                                        // 避免出现单个用户同一错误上报过多的情况
  onReport: function(id, errObj){},     // 当上报的时候回调。 id: 上报的 id, errObj: 错误的对象
  submit:null,                               // 覆盖原来的上报方式，可以自行修改为 post 上报等
  ext: {}                               // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor,
  offlineLog : false,                    // 是否启离线日志 [默认 false]
  offlineLogExp : 5,                    // 离线有效时间，默认最近5天
});

## 前端使用 
在 index.html 的head中增加
```html
  <!-- reportJs -->
  <script type="text/javascript">
    (function (w) {
      w.reportJsConfig = {
        behaviour: 15,
        method: 'get',// 上报格式
        delay:2000,
        userData: {
          uid: '0'
        },
        token: '7770a96e93743246f12594ea18dbc833',
        url: 'http://children-log.code-test.100tal.com/web/?', // 上报服务器地址
      }
    })(window);
  </script>
  <script type="text/javascript" src="/static/js/reportJs.js" crossorigin="true"></script>
  <!-- end -->
```

## 服务器设置

### 配置日志格式 nginx.conf http 
```json   
http {
log_format web_log_post escape=json '{"@ts":"$time_local",'
                         '"@addr":"$remote_addr",'
                         '"@method":"$request_method",'
                         '"@ua":"$http_user_agent",'
                         '"@data":"$request_body"}';

log_format web_log_get  '{"@ts":"$time_local",'
                         '"@addr":"$remote_addr",'
                         '"@method":"$request_method",'
                         '"@ua":"$http_user_agent",'
                         '"@data":"$arg_data"}';
```

###  日志上报接口 conf.d/you_web.conf
 server
```json
server {
    listen 80;

    # 域名
    server_name www.service.com;

    add_header Access-Control-Allow-Headers X-Requested-With;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;

    location / {
        default_type application/json;
        # 信任的域名
        if ($http_origin ~* (http?://.*\.mywebsiet\.com$)) {
                add_header Access-Control-Allow-Origin $http_origin;
        }
        # get 参数读取
        if ($request_method != POST) {
                #default_type application/json;
                access_log /var/log/nginx/children_web_error_get.log web_error_get;
                return 200 '{"status":"success","result":"nginx json"}';
        }
        # post 参数处理
        access_log /var/log/nginx/children_web_error_post.log web_error_post;
        proxy_pass http://www.service.com/null/null;
    }
    # 空返回 写给post
    location /null/null {
        default_type application/json;
        return 200 '{"status":"success","result":"nginx json"}';
    }
}
```
### 日志格式
#### get 
 ```json
 {
   "@ts":"12/Jan/2018:17:09:29 +0800",
  "@addr":"210.12.48.132",
  "@method":"GET",
  "@ua":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36","@data":"encodeURIComponent(JSON.stringify(data))"
 }
 ```
#### post 
 ```json
 {
  "@ts":"12/Jan/2018:17:09:29 +0800",
  "@addr":"210.12.48.132",
  "@method":"POST",
  "@ua":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36","@data":"JSON.stringify(data)"
 }


 ```


## logstash doc
  https://doc.yonyoucloud.com/doc/logstash-best-practice-cn/filter/date.html
  http://grokdebug.herokuapp.com/

 
## logstash cli
logstash -e "input { stdin {  } } 
filter { 
  json {
    source => 'message'
    target => 'message'
  }
  json {
    source => '[message][@data]'
    target => '[message][@data]'
  }
  split {field => '[message][@data][infos]'}
} 
output { stdout {codec => rubydebug} }" --path.data ./logs/te2/



logstash -e "input { stdin {  } } 
filter { 
  json {
    source => 'message'
    target => 'message'
  }
  json {
    source => '[message][@data]'
  }
  split {field => '[infos]'}
  mutate {
    remove_field => 'message'
    remove_field => '[message][@data]'
  }
} 
output { stdout {codec => rubydebug} }" --path.data ./logs/te2/

https://fabianlee.org/2017/04/24/elk-using-ruby-in-logstash-filters/
https://fabianlee.org/2017/04/24/elk-using-ruby-in-logstash-filters/