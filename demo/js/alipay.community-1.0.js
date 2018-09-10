arale.module("arale.uri",(function(){var _re_search=/\?(.*)/,_re_hostptc=/(https|http)\:\/\/((\w+|\.)+)/,_re_hostnoptc=/(\w+|\.)+/,_re_portnoptc=/^https|^http\:\/\/(\w+|\.)+(\:\d+)/,_re_portptc=/(\w+|\.)+(\:\d+)/;
return{setParams:function(url,data){var params_readay=arale.uri.getParams(url);var params=null;
if(data){params=typeof(data)=="object"?$H(data).toQueryString():data}if(arale.uri.getProtocol(url)){var protocol=arale.uri.getProtocol(url)+"://"
}else{var protocol=""}url=protocol+arale.uri.getHost(url,true)+arale.uri.getPath(url);
if(params_readay){url+="?"+params_readay;url=params?url+"&"+params:url}else{url=params?url+="?"+params:url
}return url},getPath:function(url){var path="";if(/(.*)\?/.test(url)){url=/(.*)\?/.exec(url)[1]
}url=url.replace(/(http|https)\:\/\//,"");var index=url.indexOf("/");if(index>-1){return url.substring(index,url.length)
}return""},getPort:function(url){if(/\:(\d+)/.test(url)){return/\:(\d+)/.exec(url)[1]
}return"80"},getHost:function(url,nonedefaultport){var hostname=arale.uri.getHostName(url);
var port=arale.uri.getPort(url);if(nonedefaultport&&port=="80"){return hostname}else{return hostname+":"+port
}},getProtocol:function(url){var reg1=/^http|^https/,reg2=/^http\:|^https\:/;if(reg1.test(url)){return reg2.exec(url)[0].replace(":","")
}return null},getHostName:function(url){if(_re_hostptc.test(url)){return _re_hostptc.exec(url)[2]
}if(_re_hostnoptc.test(url)){return _re_hostnoptc.exec(url)[0]}return null},getParams:function(url,isobject){var result={},params=_re_search.exec(url);
if(!params){return null}if(params.length&&params.length>=2){params=params[1].split("&");
for(var p;p=params.shift();){if(p.split("=").length>1){result[p.split("=")[0]]=p.split("=")[1]
}}if(isobject){return result}else{return $H(result).toQueryString()}}return null},getHash:function(url){var h=url||window.location.hash;
if(h.charAt(0)=="#"){h=h.substring(1)}else{if(h.lastIndexOf("#")>-1){h=h.substring(h.lastIndexOf("#")+1)
}}return arale.browser.Engine.gecko?h:decodeURIComponent(h)}}}),"$URI");URI=$URI;arale.module("arale.ajax",(function(){var getOptions=function(){return arale.extend(_options)
};var defaultData={_input_charset:"utf-8"};var getData=function(data){return arale.mixin(data,defaultData)
};var setValue=function(obj,name,value){if(value===null){return}var val=obj[name];
if(typeof val=="string"){obj[name]=[val,value]}else{if(arale.isArray(val)){val.push(value)
}else{obj[name]=value}}};var AjaxFactory=function(url,options){this._options={headers:{"X-Requested-With":"XMLHttpRequest",Accept:"text/javascript, text/html, application/xml, text/xml, */*"},async:true,method:"get",urlEncoded:true,encoding:"utf-8",timeout:0,timeoutTimer:null,cache:false,success:function(){},failure:function(){},arguments:null,scope:window,dataType:"json"};
this._xhr=arale.browser.Request();this._response={};this._url=url;this._running=false;
$H(this._options).extend(options||{});this._response["arguments"]=this._options.arguments;
this._response.scope=this._options.scope};var parseJSON=function(data){function validJSON(data){if(typeof data!=="string"||!data){return false
}data=data.replace(/^\s+|\s+$/g,"");return(/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))
}function W3CParse(data){if(validJSON(data)){return window.JSON.parse(data)}else{return null;
arale.error("Invalid JSON: "+data)}}function defaultParse(data){if(validJSON(data)){return(new Function("return ("+data+")"))()
}else{return null;arale.error("Invalid JSON: "+data)}}var ok_wrong_json=function(){try{JSON.parse("{ a: 1 }");
return true}catch(x){return false}};if(window.JSON&&window.JSON.parse&&ok_wrong_json()){parseJSON=function(data){return W3CParse.call(this,data)
}}else{parseJSON=function(data){return defaultParse.call(this,data)}}return parseJSON(data)
};arale.augment(AjaxFactory,{setHeader:function(name,value){$H(this._options.headers).set(name,value);
return this},getHeader:function(name){return arale.$try(function(){return this._xhr.getResponseHeader(name)
})},onSuccess:function(){var scope=this._options.scope;this._response.timeout=false;
this._options.success.call(scope,this._response[this._options.dataType]||this._response)
},onFailure:function(){var scope=this._options.scope;this._options.failure.call(scope,this._response)
},send:function(data){var that=this,options=this._options;this.cancel();this._xhr=arale.browser.Request();
var url=this._url;data=getData(data);if(this._options.method.toLowerCase()=="post"&&this._options.form){data=arale.mixin(data,this.formToObject($(this._options.form)),true)
}if(options.async&&options.timeout>0){options.timeoutTimer=setTimeout(function(){that.cancel();
that._response.text=null;that._response.xml=null;that._response.json=null;that._response.timeout=true;
that.onFailure()},options.timeout)}if(this._options.urlEncoded){$H(data).each(function(key){var value=data[key];
if(value){data[key]=$S(value).urlEncode()}})}data=$H(data).toQueryString();this._running=true;
if(this._options.urlEncoded&&this._options.method.toLowerCase()=="post"){$H(this._options.headers).set("Content-Type","application/x-www-form-urlencoded; charset="+this._options.encoding.toLowerCase())
}if(!this._options.cache){data.noCache=new Date().getTime()}if(data&&this._options.method.toLowerCase()=="get"){if(url.indexOf("?")>0){url=url+"&"+data
}else{url=url+"?"+data}data=null}var url_old=url;url=$Ajax.decorateUrl(url);url=url?url:url_old;
this._xhr.open(this._options.method.toUpperCase(),url,this._options.async);$H(this._options.headers).each(function(key,value){try{this._xhr.setRequestHeader(key,value)
}catch(e){}},this);this._xhr.onreadystatechange=arale.hitch(this,this.onStateChange);
this._xhr.send(data);if(!this._options.async){this.onStateChange()}return this},cancel:function(){if(!this._running){return this
}this._running=false;this._xhr.onreadystatechange=function(){};this._xhr.abort();
this._xhr=arale.browser.Request();return this},onStateChange:function(){var that=this,options=this._options;
if(this._xhr.readyState!=4||!this._running){return}this._running=false;arale.$try(function(){that._status=that._xhr.status
});this._xhr.onreadystatechange=function(){};if(options.timeoutTimer){clearTimeout(options.timeoutTimer);
options.timeoutTimer=null}this._response.status=this._xhr.status;if(this._xhr.status==200){this._response.text=this._xhr.responseText;
this._response.xml=this._xhr.responseXML;if(this._options.dataType=="json"){try{this._response.json=parseJSON(this._xhr.responseText)
}catch(e){this._response.json=null}}this.onSuccess()}else{this._response.text=null;
this._response.xml=null;this._response.json=null;this.onFailure()}},formToObject:function(formNode){var ret={},that=this;
var exclude="file|submit|image|reset|button|";$A($$(":input",formNode)).each(function(item){var _in=item.attr("name");
var type=(item.attr("type")||"").toLowerCase();if(_in&&type&&exclude.indexOf(type)==-1&&!item.node.disabled){setValue(ret,_in,that.fieldToObject(item));
if(type=="image"){ret[_in+".x"]=ret[_in+".y"]=ret[_in].x=ret[_in].y=0}}});return ret
},fieldToObject:function(item){var ret=null;if(item){var _in=item.attr("name");var type=(item.attr("type")||"").toLowerCase();
if(_in&&type&&!item.node.disabled){if(type=="radio"||type=="checkbox"){if(item.node.checked){ret=item.node.value
}}else{if(item.node.multiple){ret=[];$A($$("option",item)).each(function(opt){if(opt.node.selected){ret.push(opt.node.value)
}})}else{ret=item.node.value}}}}return ret}});return{getAjaxFactory:function(){return AjaxFactory
},get:function(url,options,delay){if(arale.isFunction(options)){options={success:options}
}var ajax=new AjaxFactory(url,options);if(!delay){ajax.send(options.data)}return ajax
},post:function(url,options,delay){if(arale.isFunction(options)){options={succuss:options}
}options=arale.mixin({method:"post"},options);var ajax=new AjaxFactory(url,options);
if(!delay){ajax.send(options.data)}return ajax},jsonp:function(url,options,delay){if(arale.isFunction(options)){options={succuss:options}
}var jsonp=new $Jsonp.JsonpFactory(url,options);var data=options.data||{};data._input_charset="utf-8";
if(!delay){jsonp.send(data)}return jsonp},text:function(url,options){var text="";
var ajax=new AjaxFactory(url+"?date="+new Date().getTime(),{async:false,dataType:"text",success:function(data){text=data
}});ajax.send();return text}}}()),"$Ajax");Ajax=$Ajax;$Ajax.decorateUrl=function(url){return url
};arale.module("arale.jsonp",(function(){arale.cache.callback_num=1;arale.cache.callbacks=arale.cache.callbacks||{};
var _default={failure:function(){},success:function(){},timeout:0,callparam:"_callback"};
var JsonpFactory=function(url,options){this._url=url;this._options=options||{};arale.mixin(this._options,_default);
this._callback_id=1;this._timeout_error=null};arale.augment(JsonpFactory,{send:function(data){var that=this;
if(!document.documentElement.firstChild){return null}data=data||{};data.r=(new Date()).getTime();
$H(data).each(function(key){var value=data[key];if(value){data[key]=$S(value).urlEncode()
}});if(this._options.timeout>0){this._timeout_error=setTimeout(this._options.failure,this._options.timeout)
}arale.cache.callback_num++;this._callback_id="jsonp"+arale.cache.callback_num;arale.cache.callbacks[this._callback_id]=function(){clearTimeout(that._timeout_error);
that._options.success.apply(this,[].slice.call(arguments,0))};data[this._options.callparam]="arale.cache.callbacks."+this._callback_id;
var script=document.createElement("script");script.setAttribute("type","text/javascript");
script.setAttribute("id",this._callback_id);var src=$URI.setParams(this._url,data);
if($Ajax.decorateUrl){var src_old=src;src=$Ajax.decorateUrl(src);src=src?src:src_old
}script.setAttribute("src",src);this._options.charset&&script.setAttribute("charset",this._options.charset);
document.getElementsByTagName("head")[0].appendChild(script)},cancel:function(){var scriptnode=$(this._callback_id).node;
if(scriptnode&&scriptnode.tagName.toUpperCase()=="SCRIPT"){scriptnode.parentNode.removeChild(scriptnode);
delete arale.cache.callbacks[this._callback_id];clearTimeout(this._timeout_error)
}}});return{JsonpFactory:JsonpFactory}}()),"$Jsonp");arale.module("arale.declare",function(){var a=arale,contextStack=[];var safeMixin=function(){var baseClass=arguments[0],clazzs=[].slice.call(arguments,1);
for(var i=0,len=clazzs.length;i<len;i++){var clazz=clazzs[i];a._mixin(baseClass.prototype,clazz.prototype)
}};var getPpFn=function(couns,fn,fnName){var superCouns=couns.superCouns,superProto=superCouns.prototype;
if(fn!==superProto[fnName]){return superProto[fnName]}else{return getPpFn(superCouns,fn,fnName)
}};var getFnName=function(couns,fn){if(fn.fnName){return fn.fnName}var fnName=$H(couns.prototype).keyOf(fn);
if(fnName==null){return getFnName(couns.superCouns,fn)}fn.fnName=fnName;return fnName
};var ConstructorFactory=function(className,parents,proto){var current=a.namespace(className),parent=null;
var couns=function(){this.declaredClass=className;this.init&&this.init.apply(this,arguments);
this.create&&this.create.apply(this,arguments)};if(parents&&arale.isArray(parents)){parent=parents.shift()
}else{parent=parents}parent&&a.inherits(couns,parent);a.augment(couns,proto);couns.prototype.parent=function(){var couns=this.constructor;
var fn=arguments[0].callee;var fnName=getFnName(couns,fn);fn=getPpFn(couns,fn,fnName);
return fn.apply(this,arguments[0])};if(parents&&parents.length>0){safeMixin.apply(null,[couns].concat(parents))
}current._parentModule[current._moduleName]=couns};return ConstructorFactory},"$Declare");(function(){var cache={};arale.tmpl=function tmpl(str,data,opt_context){var fn=!/\W/.test(str)?cache[str]=cache[str]||arale.tmpl(document.getElementById(str).innerHTML):new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+str.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");
return data?fn.call(opt_context||window,data):fn}})();arale.module("arale.aspect",(function(arale){var a=arale,aop=arale.aspect,ap=Array.prototype,contextStack=[],context;
var Advice=function(){this.next_before=this.prev_before=this.next_around=this.prev_around=this.next_afterReturning=this.prev_afterReturning=this.next_afterThrowing=this.prev_afterThrowing=this;
this.counter=0};arale.augment(Advice,{add:function(advice){var dyn=a.isFunction(advice),node={advice:advice,dynamic:dyn};
this._add(node,"before","",dyn,advice);this._add(node,"around","",dyn,advice);this._add(node,"after","Returning",dyn,advice);
this._add(node,"after","Throwing",dyn,advice);++this.counter;return node},_add:function(node,topic,subtopic,dyn,advice){var full=topic+subtopic;
if(dyn||advice[topic]||(subtopic&&advice[full])){var next="next_"+full,prev="prev_"+full;
(node[prev]=this[prev])[next]=node;(node[next]=this)[prev]=node}},remove:function(node){this._remove(node,"before");
this._remove(node,"around");this._remove(node,"afterReturning");this._remove(node,"afterThrowing");
--this.counter},_remove:function(node,topic){var next="next_"+topic,prev="prev_"+topic;
if(node[next]){node[next][prev]=node[prev];node[prev][next]=node[next]}},isEmpty:function(){return !this.counter
}});var getDispatcher=function(){return function(){var self=arguments.callee,advices=self.advices,ret,i,a,e,t;
if(context){contextStack.push(context)}context={instance:this,joinPoint:self,depth:contextStack.length,around:advices.prev_around,dynAdvices:[],dynIndex:0};
try{for(i=advices.prev_before;i!=advices;i=i.prev_before){if(i.dynamic){context.dynAdvices.push(a=new i.advice(context));
if(t=a.before){t.apply(a,arguments)}}else{t=i.advice;t.before.apply(t,arguments)}}try{ret=(advices.prev_around==advices?self.target:arale.aspect.proceed).apply(this,arguments)
}catch(e){context.dynIndex=context.dynAdvices.length;for(i=advices.next_afterThrowing;
i!=advices;i=i.next_afterThrowing){a=i.dynamic?context.dynAdvices[--context.dynIndex]:i.advice;
if(t=a.afterThrowing){t.call(a,e)}if(t=a.after){t.call(a)}}throw e}context.dynIndex=context.dynAdvices.length;
for(i=advices.next_afterReturning;i!=advices;i=i.next_afterReturning){a=i.dynamic?context.dynAdvices[--context.dynIndex]:i.advice;
if(t=a.afterReturning){t.call(a,ret)}if(t=a.after){t.apply(a,arguments)}}var ls=self._listeners;
for(i in ls){if(!(i in ap)){ls[i].apply(this,arguments)}}}finally{for(i=0;i<context.dynAdvices.length;
++i){a=context.dynAdvices[i];if(a.destroy){a.destroy()}}context=contextStack.length?contextStack.pop():null
}return ret}};return{advise:function(obj,method,advice){if(typeof obj!="object"){obj=obj.prototype
}var methods=[];if(!(method instanceof Array)){method=[method]}for(var j=0;j<method.length;
++j){var t=method[j];if(t instanceof RegExp){for(var i in obj){if(a.isFunction(obj[i])&&t.test(i)){methods.push(i)
}}}else{if(a.isFunction(obj[t])){methods.push(t)}}}if(!a.isArray(advice)){advice=[advice]
}return arale.aspect.adviseRaw(obj,methods,advice)},adviseRaw:function(obj,methods,advices){if(!methods.length||!advices.length){return null
}var m={},al=advices.length;for(var i=methods.length-1;i>=0;--i){var name=methods[i],o=obj[name],ao=new Array(al),t=o.advices;
if(!t){var x=obj[name]=getDispatcher();x.target=o.target||o;x.targetName=name;x._listeners=o._listeners||[];
x.advices=new Advice;t=x.advices}for(var j=0;j<al;++j){ao[j]=t.add(advices[j])}m[name]=ao
}return[obj,m]},unadvise:function(handle){if(!handle){return}var obj=handle[0],methods=handle[1];
for(var name in methods){var o=obj[name],t=o.advices,ao=methods[name];for(var i=ao.length-1;
i>=0;--i){t.remove(ao[i])}if(t.isEmpty()){var empty=true,ls=o._listeners;if(ls.length){for(i in ls){if(!(i in ap)){empty=false;
break}}}if(empty){obj[name]=o.target}else{var x=obj[name]=d._listener.getDispatcher();
x.target=o.target;x._listeners=ls}}}},getContext:function(){return context},getContextStack:function(){return contextStack
},proceed:function(){var joinPoint=context.joinPoint,advices=joinPoint.advices;for(var c=context.around;
c!=advices;c=context.around){context.around=c.prev_around;if(c.dynamic){var a=context.dynAdvices[context.dynIndex++],t=a.around;
if(t){return t.apply(a,arguments)}}else{return c.advice.around.apply(c.advice,arguments)
}}return joinPoint.target.apply(context.instance,arguments)}}})(arale),"$Aspect");
Aspect=$Aspect;arale.declare("aralex.View",null,{show:function(){this.domNode&&$Node(this.domNode).setStyle("display","block")
},hide:function(){this.domNode&&$Node(this.domNode).setStyle("display","none")}});
arale.declare("aralex.Widget",null,{id:null,domNode:null,init:function(params){},create:function(params){arale.mixin(this,params,true);
this._connects=[];this.actionFilters={};this.beforeCreate.apply(this,arguments);this.initDom.apply(this,arguments);
this.bind.apply(this,arguments);this.postCreate();this._created=true},beforeCreate:function(){},initDom:function(){if(this.id){this.domNode=$(this.id)
}},postCreate:function(){},bind:function(){},addEvent:function(eventType,handler,selector){var handler=$E.delegate(this.domNode,eventType,arale.hitch(this,handler),selector);
this._connects.push(handler)},aroundFn:function(fn){var that=this;var tracer={before:function(){$E.publish(that._getEventTopic(fn,"before"),[].slice.call(arguments))
},after:function(){$E.publish(that._getEventTopic(fn,"after"),[].slice.call(arguments))
}};$Aspect.advise(this,fn,tracer);this.defaultFn(fn)},defaultFn:function(fn){var b="before"+$S(fn).capitalize();
var a="after"+$S(fn).capitalize();this[b]&&this.before(fn,this[b]);this[a]&&this.after(fn,this[a]);
var that=this;var tracer={around:function(){var checkFuncs;if(checkFuncs=that.getActionFilters_(fn)){for(var e in checkFuncs){var isValid=checkFuncs[e];
if(arale.isFunction(isValid)&&!isValid.apply(that,arguments)){return}}}return arale.aspect.proceed.apply(null,arguments)
}};$Aspect.advise(this,fn,tracer)},addActionFilter:function(fn,filter){var id=arale.getUniqueId();
(this.actionFilters[fn]||(this.actionFilters[fn]={}))[id]=filter;return[fn,id]},getActionFilters_:function(fn){return this.actionFilters[fn]
},removeActionFilter:function(handler){if(arale.isArray(handler)){var fn=handler[0],id=handler[1];
if(fn&&arale.isNumber(id)&&arale.isObject(this.actionFilters[fn])){delete this.actionFilters[fn][id]
}}},_getEventTopic:function(fn,phase){return this.declaredClass+"/"+(this.id||1)+"/"+fn+"/"+phase
},before:function(fn,callback){return $E.subscribe(this._getEventTopic(fn,"before"),arale.hitch(this,callback))
},after:function(fn,callback){return $E.subscribe(this._getEventTopic(fn,"after"),arale.hitch(this,callback))
},rmFn:function(handler){$E.unsubscribe(handler)},attr:function(key,value){if((key in this)&&value!==undefined){return(this[key]=value)
}return this[key]},destroy:function(){$A(this._connects).each(function(handler){$E.disConnect(handler)
})}});arale.declare("aralex.TplWidget",aralex.Widget,{onlyWidget:false,srcId:null,parentId:null,data:null,templatePath:null,tmpl:null,tmplReg:/<script\s+type=\"text\/html"\s+id=\"([^"]+)\"[^>]*>([\s\S]*?)<\/script>/g,templateString:null,isUrlDecode:true,initDom:function(){this.tmpl={};
this._initParent();if(!this.id){this._initWidgetId.apply(this,arguments)}if(!this.domNode){this._initDomNode.apply(this,arguments)
}},_initParent:function(){this.parentNode=this.parentId?$(this.parentId):$(document.body)
},_initWidgetId:function(params){if(this.srcId){this.id=this.srcId;return}if(this.domNode){this.id=$(this.domNode).attr("id")
}else{this.id=arale.getUniqueId(this.declaredClass.replace(/\./g,"_"))}},_initDomNode:function(params){this._initTmpl();
this._mixinProperties();this.domNode=$Node($D.toDom(this.templateString));this.domNode.attr("id",this.id);
if(this.srcId){$(this.srcId).replace(this.domNode)}else{this.domNode.inject(this.parentNode.node,"bottom")
}if(this.data){this.renderData(this.data)}},_mixinProperties:function(){this.templateString=$S(this.templateString).substitute(this)
},_initTmpl:function(){var that=this;if(!this.templateString){this.templateString=$Ajax.text(this.templatePath)
}else{if(this.isUrlDecode){this.templateString=$S(this.templateString).urlDecode()
}}var num=0,defaultTmpl;this.templateString=this.templateString.replace(this.tmplReg,function(tmpl,id,tmplContent){that.tmpl[id]=tmplContent;
num++;defaultTmpl=id;return""});if(num==1){this.defaultTmpl=defaultTmpl}},renderData:function(data,tmplId,isReplace){var that=this;
if(tmplId){this._fillTpl(data,tmplId,isReplace)}else{$H(this.tmpl).each(function(tmplId,tmpl,isReplace){that._fillTpl(data,tmplId)
})}},_fillTpl:function(data,tmplId,isReplace){var html=this.getTmplHtml(data,tmplId);
if(isReplace){var id=$(this._getTmplId(tmplId)).attr("id");var node=$D.toDom(html);
$Node(node).attr("id",id);$D.replace($Node(node).node,node)}else{$(this._getTmplId(tmplId)).setHtml(html)
}},_getTmplId:function(tmplId){if(this.onlyWidget){return tmplId}else{return this.id+"_"+tmplId
}},getTmplHtml:function(data,tmplId){var tmpl=this.tmpl[tmplId];return arale.tmpl(tmpl,data,this)
}});(function(){function Animator(options){this.setOptions(options);var _this=this;this.timerDelegate=function(){_this.onTimerEvent()
};this.subjects=[];this.target=0;this.state=0;this.lastTime=null}Animator.prototype={setOptions:function(options){this.options=Animator.applyDefaults({interval:20,duration:400,onComplete:function(){},onStep:function(){},transition:Animator.tx.easeInOut},options)
},seekTo:function(to){this.seekFromTo(this.state,to)},seekFromTo:function(from,to){this.target=Math.max(0,Math.min(1,to));
this.state=Math.max(0,Math.min(1,from));this.lastTime=new Date().getTime();if(!this.intervalId){this.intervalId=window.setInterval(this.timerDelegate,this.options.interval)
}},jumpTo:function(to){this.target=this.state=Math.max(0,Math.min(1,to));this.propagate()
},toggle:function(){this.seekTo(1-this.target)},addSubject:function(subject){this.subjects[this.subjects.length]=subject;
return this},clearSubjects:function(){this.subjects=[]},propagate:function(){var value=this.options.transition(this.state);
for(var i=0;i<this.subjects.length;i++){if(this.subjects[i].setState){this.subjects[i].setState(value)
}else{this.subjects[i](value)}}},onTimerEvent:function(){var now=new Date().getTime();
var timePassed=now-this.lastTime;this.lastTime=now;var movement=(timePassed/this.options.duration)*(this.state<this.target?1:-1);
if(Math.abs(movement)>=Math.abs(this.state-this.target)){this.state=this.target}else{this.state+=movement
}try{this.propagate()}finally{this.options.onStep.call(this);if(this.target==this.state){window.clearInterval(this.intervalId);
this.intervalId=null;this.options.onComplete.call(this)}}},play:function(){this.seekFromTo(0,1)
},reverse:function(){this.seekFromTo(1,0)},inspect:function(){var str="#<Animator:\n";
for(var i=0;i<this.subjects.length;i++){str+=this.subjects[i].inspect()}str+=">";
return str}};Animator.applyDefaults=function(defaults,prefs){prefs=prefs||{};var prop,result={};
for(prop in defaults){result[prop]=prefs[prop]!==undefined?prefs[prop]:defaults[prop]
}return result};Animator.makeArray=function(o){if(o==null){return[]}if(!o.length){return[o]
}var result=[];for(var i=0;i<o.length;i++){result[i]=o[i]}return result};Animator.camelize=function(string){var oStringList=string.split("-");
if(oStringList.length==1){return oStringList[0]}var camelizedString=string.indexOf("-")==0?oStringList[0].charAt(0).toUpperCase()+oStringList[0].substring(1):oStringList[0];
for(var i=1,len=oStringList.length;i<len;i++){var s=oStringList[i];camelizedString+=s.charAt(0).toUpperCase()+s.substring(1)
}return camelizedString};Animator.apply=function(el,style,options){if(style instanceof Array){return new Animator(options).addSubject(new CSSStyleSubject(el,style[0],style[1]))
}return new Animator(options).addSubject(new CSSStyleSubject(el,style))};Animator.makeEaseIn=function(a){return function(state){return Math.pow(state,a*2)
}};Animator.makeEaseOut=function(a){return function(state){return 1-Math.pow(1-state,a*2)
}};Animator.makeElastic=function(bounces){return function(state){state=Animator.tx.easeInOut(state);
return((1-Math.cos(state*Math.PI*bounces))*(1-state))+state}};Animator.makeADSR=function(attackEnd,decayEnd,sustainEnd,sustainLevel){if(sustainLevel==null){sustainLevel=0.5
}return function(state){if(state<attackEnd){return state/attackEnd}if(state<decayEnd){return 1-((state-attackEnd)/(decayEnd-attackEnd)*(1-sustainLevel))
}if(state<sustainEnd){return sustainLevel}return sustainLevel*(1-((state-sustainEnd)/(1-sustainEnd)))
}};Animator.makeBounce=function(bounces){var fn=Animator.makeElastic(bounces);return function(state){state=fn(state);
return state<=1?state:2-state}};Animator.tx={easeInOut:function(pos){return((-Math.cos(pos*Math.PI)/2)+0.5)
},linear:function(x){return x},easeIn:Animator.makeEaseIn(1.5),easeOut:Animator.makeEaseOut(1.5),strongEaseIn:Animator.makeEaseIn(2.5),strongEaseOut:Animator.makeEaseOut(2.5),elastic:Animator.makeElastic(1),veryElastic:Animator.makeElastic(3),bouncy:Animator.makeBounce(1),veryBouncy:Animator.makeBounce(3)};
function NumericalStyleSubject(els,property,from,to,units){this.els=Animator.makeArray(els);
if(property=="opacity"&&window.ActiveXObject&&Number(arale.browser.ver())<9){this.property="filter"
}else{this.property=Animator.camelize(property)}this.from=parseFloat(from);this.to=parseFloat(to);
this.units=units!=null?units:"px"}NumericalStyleSubject.prototype={setState:function(state){var style=this.getStyle(state);
var visibility=(this.property=="opacity"&&state==0)?"hidden":"";var j=0;for(var i=0;
i<this.els.length;i++){try{this.els[i].style[this.property]=style}catch(e){if(this.property!="fontWeight"){throw e
}}if(j++>20){return}}},getStyle:function(state){state=this.from+((this.to-this.from)*state);
if(this.property=="filter"){return"alpha(opacity="+Math.round(state*100)+")"}if(this.property=="opacity"){return state
}return Math.round(state)+this.units},inspect:function(){return"\t"+this.property+"("+this.from+this.units+" to "+this.to+this.units+")\n"
}};function ColorStyleSubject(els,property,from,to){this.els=Animator.makeArray(els);
this.property=Animator.camelize(property);this.to=this.expandColor(to);this.from=this.expandColor(from);
this.origFrom=from;this.origTo=to}ColorStyleSubject.prototype={expandColor:function(color){var hexColor,red,green,blue;
hexColor=ColorStyleSubject.parseColor(color);if(hexColor){red=parseInt(hexColor.slice(1,3),16);
green=parseInt(hexColor.slice(3,5),16);blue=parseInt(hexColor.slice(5,7),16);return[red,green,blue]
}if(window.DEBUG){alert("Invalid colour: '"+color+"'")}},getValueForState:function(color,state){return Math.round(this.from[color]+((this.to[color]-this.from[color])*state))
},setState:function(state){var color="#"+ColorStyleSubject.toColorPart(this.getValueForState(0,state))+ColorStyleSubject.toColorPart(this.getValueForState(1,state))+ColorStyleSubject.toColorPart(this.getValueForState(2,state));
for(var i=0;i<this.els.length;i++){this.els[i].style[this.property]=color}},inspect:function(){return"\t"+this.property+"("+this.origFrom+" to "+this.origTo+")\n"
}};ColorStyleSubject.parseColor=function(string){var color="#",match;if(match=ColorStyleSubject.parseColor.rgbRe.exec(string)){var part;
for(var i=1;i<=3;i++){part=Math.max(0,Math.min(255,parseInt(match[i])));color+=ColorStyleSubject.toColorPart(part)
}return color}if(match=ColorStyleSubject.parseColor.hexRe.exec(string)){if(match[1].length==3){for(var i=0;
i<3;i++){color+=match[1].charAt(i)+match[1].charAt(i)}return color}return"#"+match[1]
}return false};ColorStyleSubject.toColorPart=function(number){if(number>255){number=255
}var digits=number.toString(16);if(number<16){return"0"+digits}return digits};ColorStyleSubject.parseColor.rgbRe=/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
ColorStyleSubject.parseColor.hexRe=/^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;function DiscreteStyleSubject(els,property,from,to,threshold){this.els=Animator.makeArray(els);
this.property=Animator.camelize(property);this.from=from;this.to=to;this.threshold=threshold||0.5
}DiscreteStyleSubject.prototype={setState:function(state){var j=0;for(var i=0;i<this.els.length;
i++){this.els[i].style[this.property]=state<=this.threshold?this.from:this.to}},inspect:function(){return"\t"+this.property+"("+this.from+" to "+this.to+" @ "+this.threshold+")\n"
}};function CSSStyleSubject(els,style1,style2){els=Animator.makeArray(els);this.subjects=[];
if(els.length==0){return}var prop,toStyle,fromStyle;if(style2){fromStyle=this.parseStyle(style1,els[0]);
toStyle=this.parseStyle(style2,els[0])}else{toStyle=this.parseStyle(style1,els[0]);
fromStyle={};for(prop in toStyle){fromStyle[prop]=CSSStyleSubject.getStyle(els[0],prop)
}}var prop;for(prop in fromStyle){if(fromStyle[prop]==toStyle[prop]){delete fromStyle[prop];
delete toStyle[prop]}}var prop,units,match,type,from,to;for(prop in fromStyle){var fromProp=String(fromStyle[prop]);
var toProp=String(toStyle[prop]);if(toStyle[prop]==null){if(window.DEBUG){alert("No to style provided for '"+prop+'"')
}continue}if(from=ColorStyleSubject.parseColor(fromProp)){to=ColorStyleSubject.parseColor(toProp);
type=ColorStyleSubject}else{if(fromProp.match(CSSStyleSubject.numericalRe)&&toProp.match(CSSStyleSubject.numericalRe)){from=parseFloat(fromProp);
to=parseFloat(toProp);type=NumericalStyleSubject;match=CSSStyleSubject.numericalRe.exec(fromProp);
var reResult=CSSStyleSubject.numericalRe.exec(toProp);if(match[1]!=null){units=match[1]
}else{if(reResult[1]!=null){units=reResult[1]}else{units=reResult}}}else{if(fromProp.match(CSSStyleSubject.discreteRe)&&toProp.match(CSSStyleSubject.discreteRe)){from=fromProp;
to=toProp;type=DiscreteStyleSubject;units=0}else{if(window.DEBUG){alert("Unrecognised format for value of "+prop+": '"+fromStyle[prop]+"'")
}continue}}}this.subjects[this.subjects.length]=new type(els,prop,from,to,units)}}CSSStyleSubject.prototype={parseStyle:function(style,el){var rtn={};
if(style.indexOf(":")!=-1){var styles=style.split(";");for(var i=0;i<styles.length;
i++){var parts=CSSStyleSubject.ruleRe.exec(styles[i]);if(parts){rtn[parts[1]]=parts[2]
}}}else{var prop,value,oldClass;oldClass=el.className;el.className=style;for(var i=0;
i<CSSStyleSubject.cssProperties.length;i++){prop=CSSStyleSubject.cssProperties[i];
value=CSSStyleSubject.getStyle(el,prop);if(value!=null){rtn[prop]=value}}el.className=oldClass
}return rtn},setState:function(state){for(var i=0;i<this.subjects.length;i++){this.subjects[i].setState(state)
}},inspect:function(){var str="";for(var i=0;i<this.subjects.length;i++){str+=this.subjects[i].inspect()
}return str}};CSSStyleSubject.getStyle=function(el,property){var style;if(document.defaultView&&document.defaultView.getComputedStyle){style=document.defaultView.getComputedStyle(el,"").getPropertyValue(property);
if(style){return style}}property=Animator.camelize(property);if(el.currentStyle){style=el.currentStyle[property]
}return style||el.style[property]};CSSStyleSubject.ruleRe=/^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/;
CSSStyleSubject.numericalRe=/^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/;CSSStyleSubject.discreteRe=/^\w+$/;
CSSStyleSubject.cssProperties=["azimuth","background","background-attachment","background-color","background-image","background-position","background-repeat","border-collapse","border-color","border-spacing","border-style","border-top","border-top-color","border-right-color","border-bottom-color","border-left-color","border-top-style","border-right-style","border-bottom-style","border-left-style","border-top-width","border-right-width","border-bottom-width","border-left-width","border-width","bottom","clear","clip","color","content","cursor","direction","display","elevation","empty-cells","css-float","font","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","height","left","letter-spacing","line-height","list-style","list-style-image","list-style-position","list-style-type","margin","margin-top","margin-right","margin-bottom","margin-left","max-height","max-width","min-height","min-width","orphans","outline","outline-color","outline-style","outline-width","overflow","padding","padding-top","padding-right","padding-bottom","padding-left","pause","position","right","size","table-layout","text-align","text-decoration","text-indent","text-shadow","text-transform","top","vertical-align","visibility","white-space","width","word-spacing","z-index","opacity","outline-offset","overflow-x","overflow-y"];
function AnimatorChain(animators,options){this.animators=animators;this.setOptions(options);
for(var i=0;i<this.animators.length;i++){this.listenTo(this.animators[i])}this.forwards=false;
this.current=0}AnimatorChain.prototype={setOptions:function(options){this.options=Animator.applyDefaults({resetOnPlay:true},options)
},play:function(){this.forwards=true;this.current=-1;if(this.options.resetOnPlay){for(var i=0;
i<this.animators.length;i++){this.animators[i].jumpTo(0)}}this.advance()},reverse:function(){this.forwards=false;
this.current=this.animators.length;if(this.options.resetOnPlay){for(var i=0;i<this.animators.length;
i++){this.animators[i].jumpTo(1)}}this.advance()},toggle:function(){if(this.forwards){this.seekTo(0)
}else{this.seekTo(1)}},listenTo:function(animator){var oldOnComplete=animator.options.onComplete;
var _this=this;animator.options.onComplete=function(){if(oldOnComplete){oldOnComplete.call(animator)
}_this.advance()}},advance:function(){if(this.forwards){if(this.animators[this.current+1]==null){return
}this.current++;this.animators[this.current].play()}else{if(this.animators[this.current-1]==null){return
}this.current--;this.animators[this.current].reverse()}},seekTo:function(target){if(target<=0){this.forwards=false;
this.animators[this.current].seekTo(0)}else{this.forwards=true;this.animators[this.current].seekTo(1)
}}};function Accordion(options){this.setOptions(options);var selected=this.options.initialSection,current;
if(this.options.rememberance){current=document.location.hash.substring(1)}this.rememberanceTexts=[];
this.ans=[];var _this=this;for(var i=0;i<this.options.sections.length;i++){var el=this.options.sections[i];
var an=new Animator(this.options.animatorOptions);var from=this.options.from+(this.options.shift*i);
var to=this.options.to+(this.options.shift*i);an.addSubject(new NumericalStyleSubject(el,this.options.property,from,to,this.options.units));
an.jumpTo(0);var activator=this.options.getActivator(el);activator.index=i;activator.onclick=function(){_this.show(this.index)
};this.ans[this.ans.length]=an;this.rememberanceTexts[i]=activator.innerHTML.replace(/\s/g,"");
if(this.rememberanceTexts[i]===current){selected=i}}this.show(selected)}Accordion.prototype={setOptions:function(options){this.options=Object.extend({sections:null,getActivator:function(el){return document.getElementById(el.getAttribute("activator"))
},shift:0,initialSection:0,rememberance:true,animatorOptions:{}},options||{})},show:function(section){for(var i=0;
i<this.ans.length;i++){this.ans[i].seekTo(i>section?1:0)}if(this.options.rememberance){document.location.hash=this.rememberanceTexts[section]
}}};arale.animator=window.$Animator=Animator;$Animator.prototype.stop=function(){this.clearSubjects();
return this};$Animator.prototype.addMotion=function(ele,prop,from,to){var obj=function(){};
ele=ele.node?ele.node:ele;switch(arale.typeOf(from)){case"number":obj=new NumericalStyleSubject(ele,prop,from,to);
break;case"string":obj=from.charAt(0)=="#"?new ColorStyleSubject(ele,prop,from,to):new DiscreteStyleSubject(ele,prop,from,to,arguments[4]);
break}this.addSubject(obj);return this};$Animator.prototype.addCSSMotion=function(ele,fromStyle,toStyle){ele=ele.node?ele.node:ele;
this.addSubject(new CSSStyleSubject(ele,fromStyle,toStyle));return this};$Node.fn.fadeTo=function(duration,opacity,callback){var anim=new $Animator({duration:duration,onComplete:function(){callback&&callback()
}});anim.addCSSMotion(this,"opacity:"+opacity);anim.play();return this};$Node.fn.fadeIn=function(duration,callback){var o={opacity:0};
if(this.getStyle("display")=="none"){o.display="block"}return this.setStyle(o).fadeTo(duration,1,callback)
};$Node.fn.fadeOut=function(duration,callback){if(this.getStyle("display")=="none"){return this
}var that=this;return this.setStyle("opacity",1).fadeTo(duration,0,function(){that.setStyle({display:"none",opacity:1});
callback&&callback()})};$Node.fn.hide=function(duration,callback){var display=this.getStyle("display");
if(display=="none"){return}var that=this;if(duration&&arale.isNumber(duration)){var height=this.getStyle("height");
var width=this.getStyle("width");var overflow=this.getStyle("overflow");this.setStyle("overflow","hidden");
var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle({display:"none",width:width,height:height,overflow:overflow});
callback&&callback()}});anim.addCSSMotion(this,"width:0;height:0;");anim.play();return anim
}else{this.setStyle("display","none")}return this};$Node.fn.show=function(duration,callback){var display=this.getStyle("display");
if(display!="none"){return this}var that=this;if(duration&&arale.isNumber(duration)){var height=this.getStyle("height");
var width=this.getStyle("width");var overflow=this.getStyle("overflow");this.setStyle({width:0,height:0,display:"block",overflow:"hidden"});
var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle("overflow",overflow);
callback&&callback()}});anim.addCSSMotion(this,"width:"+width+";height:"+height+";overflow:"+overflow);
anim.play();return anim}else{this.setStyle("display","block")}return this};$Node.fn.slideDown=function(duration,callback){var display=this.getStyle("display");
if(display!="none"){return}var that=this;var height=this.getStyle("height");var of=this.getStyle("overflow");
this.setStyle({height:0,display:"block",overflow:"hidden"});var duration=duration?duration:400;
var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle({overflow:of});
callback&&callback()}});anim.addCSSMotion(this,"height:"+height);anim.play();return this
};$Node.fn.slideUp=function(duration,callback){var display=this.getStyle("display");
if(display=="none"){return}var that=this;var height=this.getStyle("height");var of=this.getStyle("overflow");
this.setStyle({overflow:"hidden"});var duration=duration?duration:400;var anim=new $Animator({duration:duration,onComplete:function(){that.setStyle({display:"none",height:height,overflow:of});
callback&&callback()}});anim.addCSSMotion(this,"height:0");anim.play();return this
}})();Animator=$Animator;arale.namespace("alipay.community");alipay.community.lazyLoadPrototype={_conf:{placeholder:null,thresholdTop:0,thresholdBottom:0,onLoadError:null},_resourceSaver:{},_eventManager:{scroll:null,resize:null,load:{},error:{}},init:function(){this.parent(arguments);
arale.mixin(this._conf,arguments[0],true);this.argsValidator();this.entrance()},bind:function(){this.parent(arguments);
that=this;this._eventManager.scroll=$E.connect(window,"scroll",function(){that.loadImg()
});this._eventManager.resize=$E.connect(window,"resize",function(){that.loadImg()
})},argsValidator:function(){var conf=this._conf;var errorType="LazyLoad Config Error : ";
if(!conf.placeholder){throw new Error(errorType+'No value specified for parameter "placeholder" !')
}if(!(typeof conf.placeholder==="string")||conf.placeholder.length===0){throw new Error(errorType+'parameter "placeholder" data type mismatch !')
}if(isNaN(conf.thresholdTop)||isNaN(conf.thresholdBottom)){throw new Error(errorType+'parameter "thresholdTop" or "thresholdBottom" data type mismatch !')
}},getPosInfo:function(){return{top:$D.getScroll(window).top,height:$D.getViewportHeight()}
},loadImg:function(){var pos=this.getPosInfo();var that=this;var viewportScope=[pos.top,pos.top+pos.height];
var lowerLimit=viewportScope[0]-that._conf.thresholdTop;var upperLimit=viewportScope[1]+that._conf.thresholdBottom;
var counter=0;$H(this._resourceSaver).each(function(index,item){counter++;var offsetTop=$D.getOffsets(item).top;
if(lowerLimit<=offsetTop&&offsetTop<=upperLimit){if(item.attr("lazyload-src")){that._eventManager.load[index]=$E.delegate(item,"load",function(){delete that._resourceSaver[index]
});that._eventManager.error[index]=$E.delegate(item,"error",function(){if(that.onLoadError){that.onLoadError(that._resourceSaver[index])
}delete that._resourceSaver[index]});item.node.src=item.attr("lazyload-src");item.removeAttrs("lazyload-src")
}}});if(counter===0){this.onAllComplete()}},entrance:function(){var that=this;$A($$("img[lazyload-src]")).each(function(item,index){if((!item.attr("src")||!item.attr("src").length)){if(item.attr("lazyload-src").length){item.node.src=that._conf.placeholder;
that._resourceSaver[index]=item}}});this.loadImg()},onAllComplete:function(){$E.disConnect(this._eventManager.scroll);
$E.disConnect(this._eventManager.resize);$H(this._eventManager.load).each(function(index,item){$E.disConnect(item)
});$H(this._eventManager.error).each(function(index,item){$E.disConnect(item)})}};
arale.declare("alipay.community.LazyLoad",[aralex.Widget],alipay.community.lazyLoadPrototype);