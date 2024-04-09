!function(n){var i={};function o(t){if(i[t])return i[t].exports;var e=i[t]={exports:{},id:t,loaded:!1};return n[t].call(e.exports,e,e.exports,o),e.loaded=!0,e.exports}o.m=n,o.c=i,o.p="",o(0)}([function(t,e,n){t.exports=n(3)},,,function(module,exports){var _originWhiteList=["https://gallery.echartsjs.com","https://echarts.duapp.com","http://127.0.0.1:3000","https://127.0.0.1:3000"],myChart=null,myCharts=[];$(document).ready(function(){function t(t){var e=t.data,n=e.action;__actions__[n]&&__actions__[n](e)}if(window.addEventListener?window.addEventListener("message",t,!1):window.attachEvent("onmessage",t),window.__currentLayout__&&window.__layoutCustomized__)var e=window.__layoutWidth__.length*window.__layoutHeight__.length;else e=0;__actions__.create(e)});var app={},gui,_intervalIdList=[],_timeoutIdList=[],_oldSetTimeout=window.setTimeout,_oldSetInterval=window.setInterval,_windowTopOrigin="";function _clearTimeTickers(){for(var t=0;t<_intervalIdList.length;t++)clearInterval(_intervalIdList[t]);for(t=0;t<_timeoutIdList.length;t++)clearTimeout(_timeoutIdList[t]);_intervalIdList=[],_timeoutIdList=[]}window.setTimeout=function(t,e){var n=_oldSetTimeout(t,e);return _timeoutIdList.push(n),n},window.setInterval=function(t,e){var n=_oldSetInterval(t,e);return _intervalIdList.push(n),n};var syncBackTimeout=0;function syncBackOption(t){var e=t.getOption();if(_windowTopOrigin){var n={series:[]};try{n=JSON.stringify(e)}catch(t){console.error(t)}window.top.postMessage({action:"optionUpdated",computedOption:n},_windowTopOrigin)}}function _wrapEChartsSetOption(e){var n=e.setOption;e.setOption=function(){var t=n.apply(e,arguments);return clearTimeout(syncBackTimeout),syncBackTimeout=setTimeout(function(){syncBackOption(e)},2e3),t}}var _events=[];function _wrapOnMethods(n){var i=n.on;n.on=function(t){var e=i.apply(n,arguments);return _events.push(t),e}}function _clearChartEvents(){_events.forEach(function(t){if(myChart)myChart.off(t);else for(var e=0;e<myCharts.length;++e)myCharts[e].off(t)}),_events.length=0}function updateConfigGUI(){if(gui&&($(gui.domElement).remove(),gui.destroy(),gui=null),app.config){gui=new dat.GUI({autoPlace:!1}),$(gui.domElement).css({position:"absolute",right:5,top:0,zIndex:1e3}),$("#chart-panel").append(gui.domElement);var t=app.configParameters||{};for(var e in app.config){var n=app.config[e];if("onChange"!==e&&"onFinishChange"!==e){var i=!1,o=null;if(t[e]&&(t[e].options?o=gui.add(app.config,e,t[e].options):null!=t[e].min&&(o=gui.add(app.config,e,t[e].min,t[e].max),null!=t[e].step&&o.step(t[e].step))),"string"==typeof n)try{var a=echarts.color.parse(n);(i=!!a)&&(n=echarts.color.stringify(a,"rgba")),app.config[e]=n}catch(t){}o=o||gui[i?"addColor":"add"](app.config,e),app.config.onChange&&o.onChange(app.config.onChange),app.config.onFinishChange&&o.onFinishChange(app.config.onFinishChange)}}}}var __actions__={useOrigin:function(t){0<=_originWhiteList.indexOf(t.origin)&&(_windowTopOrigin=t.origin)},resize:function(){myChart&&myChart.resize();for(var t=0;t<myCharts.length;++t)myCharts[t].resize();_windowTopOrigin&&window.top.postMessage({action:"afterResize"},_windowTopOrigin)},create:function(t){if(t){myChart&&myChart.dispose(),myChart=null,$("#chart-panel").html("");for(var e=0;e<myCharts.length;++e)myCharts[e]&&myCharts[e].dispose();myCharts=[];var n=t;if(window.__currentLayout__&&window.__layoutCustomized__)n=window.__layoutWidth__.length*window.__layoutHeight__.length;else if(window.__layoutWidth__=[],window.__layoutHeight__=[],"1xN"===window.__currentLayout__){for(e=0;e<n;++e)window.__layoutWidth__.push(100/n+"%");window.__layoutHeight__.push("100%")}else if("NxM"===window.__currentLayout__){var i=Math.ceil(Math.sqrt(n));for(e=0;e<i;++e)window.__layoutWidth__.push(100/i+"%");var o=Math.ceil(n/i);for(e=0;e<o;++e)window.__layoutHeight__.push(100/o+"%")}else{window.__layoutWidth__.push("100%");for(e=0;e<n;++e)window.__layoutHeight__.push(100/n+"%")}t<n&&console.warn("部分图表没有对应的布局项，因而未被显示。");for(var a=0,r=0;r<window.__layoutHeight__.length;++r)for(var s=0;s<window.__layoutWidth__.length&&!(t<=a);++s){var h=$('<div style="width: '+window.__layoutWidth__[s]+"; height: "+window.__layoutHeight__[r]+'; float: left; display: inline-block"></div>');$("#chart-panel").append(h);var _=echarts.init(h[0],window.__currentTheme__);_wrapEChartsSetOption(_),_wrapOnMethods(_),myCharts.push(_),++a}}else myChart&&myChart.dispose(),myChart=echarts.init($("#chart-panel")[0],window.__currentTheme__),myCharts=[myChart],_wrapEChartsSetOption(myChart),_wrapOnMethods(myChart)},run:function(data){var __err__,option,options;_clearTimeTickers(),_clearChartEvents(),app.config=null;try{eval(data.code),updateConfigGUI()}catch(t){option=myChart.getModel()?null:{series:[]},__err__=t.toString()}if(option)myChart.setOption(option,!0);else if(options){options.length!==myCharts.length&&__actions__.create(options.length);for(var i=0;i<myCharts.length;++i)options[i]&&myCharts[i].setOption(options[i])}_windowTopOrigin&&window.top.postMessage({action:"afterRun",error:__err__,chartCnt:myChart?1:myCharts.length},_windowTopOrigin)},prepareChartDetail:function(e){var s=document.createElement("canvas");s.width=400,s.height=300;for(var h=s.getContext("2d"),_="",p="",l=[],c=Number.MAX_VALUE,t=0,u=Number.MAX_VALUE,n=0,d=[],i=0;i<myCharts.length;++i){var o=myCharts[i].getDom().getBoundingClientRect();d.push(o),c=Math.min(c,o.left),t=Math.max(t,o.right),u=Math.min(u,o.top),n=Math.max(n,o.bottom)}var g=t-c,m=n-u;function a(t){_windowTopOrigin&&window.top.postMessage({onlyScreenshot:e.onlyScreenshot,action:"afterPrepared",echartsVersion:echarts.version,title:_,description:p,tags:l,thumbUrl:t},_windowTopOrigin)}try{!function e(n,i){var t=d[n],o=(t.right-t.left)/g*s.width,a=(t.bottom-t.top)/m*s.height,r={left:c+(t.left-c)/g*s.width,top:u+(t.top-u)/m*s.height};renderPartialCanvas(n,o,a,function(t){h.drawImage(t.canvas,r.left,r.top),_=_||t.title,p=p||t.subtitle,l=l.concat(t.tags),n+1<myCharts.length?e(n+1,i):i()})}(0,function(){a(s.toDataURL())})}catch(t){console.error(t),a("")}}};function renderPartialCanvas(t,e,n,i){var o=document.createElement("canvas");o.width=2*e,o.height=2*n;var a=document.createElement("canvas");a.width=e,a.height=n;var r=a.getContext("2d"),s=echarts.init(o),h=myChart?myChart.getOption():myCharts[t].getOption(),_=myChart?myChart.getModel():myCharts[t].getModel(),p=_.getComponent("title"),l=[],c=["markLine","markPoint","markArea","series","xAxis","yAxis","xAxis3D","yAxis3D","zAxis3D","angleAxis","radiusAxis","parallelAxis","axisPointer"];for(var u in h)c.indexOf(u)<0&&_.getComponent(u)&&("grid"===u&&_.getComponent("xAxis")&&_.getComponent("yAxis")||"grid"!==u)&&l.push({type:"component",value:u});var d={};_.eachComponent("series",function(t){var e=t.subType;d[e]||(d[e]=!0,l.push({type:"chart",value:e}))});var g={};if(_.eachComponent("series",function(e){["markPoint","markLine","markArea"].forEach(function(t){e.get(t,!0)&&!g[t]&&(l.push({type:"component",value:t}),g[t]=!0)})}),h.timeline&&h.timeline.length){var m=h.timeline[0];m.currentIndex=0,h.timeline=null;var w={timeline:m,options:[]};h.animation=!1;for(var f=0;f<m.data.length;f++)w.options.push(h);h=w}h.animation=!1,h.series&&h.series.forEach(function(t){"graph"===t.type&&"force"===t.layout&&(t.force=t.force||{},t.force.layoutAnimation=!1),t.progressive=0,t.progressiveThreshold=1/0}),s.setOption(h,!0),setTimeout(function(){r.drawImage(o,0,0,a.width,a.height),i({title:p&&p.get("text")||"",subtitle:p&&p.get("subtext")||"",tags:l,canvas:a})},100)}}]);