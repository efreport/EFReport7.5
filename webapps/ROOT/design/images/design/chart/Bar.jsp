
<%@page import="com.efreport.util.WebUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fns" uri="/WEB-INF/tlds/fns.tld" %>
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="Cache-Control" content="no-cache, no-store">
    <meta http-equiv="expires" content="0">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta name="format-detection" content="adress=no">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/plugin.css">
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/spectrum.css">
    <link rel="stylesheet" href="/lib/layui/css/layui.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/json-viewer.css">
    <style type="text/css">
        body {
            /*display: flex;
            justify-content: center;*/
        }


        .plugin-container{
            width: 800px;
            height:400px;
            text-align: center;
            display: flex;
        }

        .json-container{
            width: 800px;
            height:390px;
            text-align: center;
            display: flex;
            overflow-y: scroll;
        }

        .chart-panel {
            width: 600px;
            display: flex;
        }

        .property-panel .layui-tab-title .layui-this:after{
            height:70px;
        }

        .json-document{
            padding:0px;
            margin:0px;
        }

        .layui-unselect{
            display:none;
        }

    </style>
</head>
<body>
<div>
    <div class="layui-tab" style="margin:0px;">
        <ul class="layui-tab-title">
            <li class="layui-this">html</li>
            <li>json</li>
        </ul>
        <div class="layui-tab-content" style="height:400px;">

            <div class="layui-tab-item layui-show">
                <div class="plugin-container" style="height:400px;">
                    <div class="chart-panel" id="plugin">


                    </div>
                    <div class="property-panel" style="height:400px;">
                        <div class="layui-tab">
                            <ul class="layui-tab-title" id="lay_expend" style="width: 20px;">
                                <li class="layui-this">标<br>题</li>
                                <li>图<br>例</li>
                                <li>网<br>格</li>
                                <li>数<br>据</li>
                            </ul>
                            <div class="layui-tab-content" style="width: 100%;height:400px;padding:5px;">
                                <div class="layui-tab-item layui-show" id="title"
                                     style="overflow: auto;white-space: normal;height:390px;">
                                    <div id="chart" class="chart">
                                        <!--<label>显示图例</label><input type="checkbox" id="ct_exp"><br/>-->
                                        <%-- <div style="width: 100%;text-align: center;margin-bottom:5px;font-size:20px">
                                             <a style="display: inline-grid;">标 题</a>
                                         </div>--%>
                                        <table style="width: 100%; display: table;">
                                            <tbody>
											
																						 <tr>
                                                <td>控件背景颜色</td>
                                                <td>
                                                    <div style="width: 100px;margin-right:5px;display:table-cell"><input type="text"
                                                                                                                         id="chartBgInput"
                                                                                                                         style="margin-right:5px;" value="#000000">
                                                    </div>
                                                    <div id="chartBg"
                                                         style="width: 80px; display: table-cell; height: 29px; border: 1px solid rgb(213, 213, 213); background-color: rgb(255, 255, 255);"></div>
                                                </td>
                                            </tr>
											
                                            <tr>
                                                <td style="width:100px;">显示标题</td>
                                                <td style="width:130px;"><select id="titleShow">
                                                    <option value="1" selected>显示</option>
                                                    <option value="0">不显示</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>标题文本</td>
                                                <td><input type="text" id="titleText" autocomplete="off" value="销量图"></td>
                                            </tr>
                                            <tr>
                                                <td>背景颜色</td>
                                                <td>
                                                    <div style="width: 100px;margin-right:5px;display:table-cell"><input type="text"
                                                                                                                         id="titleBgInput"
                                                                                                                         style="margin-right:5px;" value="#000000">
                                                    </div>
                                                    <div id="titleBg"
                                                         style="width: 80px; display: table-cell; height: 29px; border: 1px solid rgb(213, 213, 213); background-color: rgb(255, 255, 255);"></div>
                                                </td>
                                            </tr>
											<!--
                                            <tr>
                                                <td>上边距</td>
                                                <td><input type="text" id="title-top" autocomplete="off" class="position"
                                                           placeholder="" value="0"></td>
                                            </tr>
                                            <tr>
                                                <td>下边距</td>
                                                <td><input type="text" id="title-bottom" autocomplete="off" class="position"
                                                           placeholder="" value="0"></td>
                                            </tr>
                                            <tr>
                                                <td>左边距</td>
                                                <td><input type="text" id="title-left" autocomplete="off" class="position"
                                                           placeholder="" value="0"></td>
                                            </tr>
                                            <tr>
                                                <td>右边距</td>
                                                <td><input type="text" id="title-right" autocomplete="off" class="position"
                                                           placeholder="" value="0"></td>
                                            </tr>
											-->
                                            <tr>
                                                <td>文本样式</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>颜色</td>
                                                <td>
                                                    <div style="width: 100px;margin-right:5px;display:table-cell"><input type="text"
                                                                                                                         id="titleColorInput"
                                                                                                                         style="margin-right:5px;"
                                                                                                                         value="#ffffff">
                                                    </div>
                                                    <div id="titleColor"
                                                         style="width: 80px; display: table-cell; height: 29px; border: 1px solid rgb(213, 213, 213); background-color: black;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>字体风格</td>
                                                <td><select id="titleStyle">
                                                    <option value="normal">正常</option>
                                                    <option value="italic">斜体</option>
                                                    <option value="oblique">倾斜</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>字体粗细</td>
                                                <td><select id="titleWeight">
                                                    <option value="normal">正常</option>
                                                    <option value="bold" selected>加粗</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>字体名称</td>
                                                <td><select id="titleFont">
                                                    <option value="sans-serif">sans-serif</option>
                                                    <option value="serif">serif</option>
                                                    <option value="monospace">monospace</option>
                                                    <option value="Arial">Arial</option>
                                                    <option value="Microsoft YaHei">Microsoft YaHei</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>字体大小</td>
                                                <td><input type="text" autocomplete="off" id="titleSize" value="18"></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="layui-tab-item" id="legend" style="overflow: auto;white-space: normal;height:390px;">
                                    <div class="chart">
                                        <%-- <div style="width:100%;text-align: center;margin-bottom:5px;font-size:20px">
                                             <a style="display: inline-grid;">图 例</a>
                                         </div>--%>
                                        <table style="width:100%;display:table;table-layout:fixed">
                                            <tbody>
                                            <tr>
                                                <td style="width:88px;">列表布局</td>
                                                <td style="width:114px;"><select id="legendOrient">
                                                    <option value="horizontal">水平</option>
                                                    <option value="vertical">垂直</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>文本对齐</td>
                                                <td><select id="legendAlign">
                                                    <option value="auto">自动</option>
                                                    <option value="left">左</option>
                                                    <option value="right">右</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>显示图例</td>
                                                <td><select id="legendShow">
                                                    <option value="1" selected>显示</option>
                                                    <option value="0">不显示</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>背景颜色</td>
                                                <td>
                                                    <div style="width: 100px;margin-right:5px;display:table-cell">
                                                        <input type="text" id="legendBgInput" style="margin-right:5px;" value="#FFFFFF">
                                                    </div>
                                                    <div id="legendBg"
                                                         style="width: 80px; display: table-cell; height: 29px; border: 1px solid rgb(213, 213, 213); background-color: white;"></div>
                                                </td>
                                            </tr>
											<!--
                                            <tr>
                                                <td>上边距</td>
                                                <td><input type="text" autocomplete="off" id="legend-top" class="position" value="0"></td>
                                            </tr>
                                            <tr>
                                                <td>下边距</td>
                                                <td><input type="text" autocomplete="off" id="legend-bottom" class="position" value="0"></td>
                                            </tr>
                                            <tr>
                                                <td>左边距</td>
                                                <td><input type="text" autocomplete="off" id="legend-left" class="position" value="0"></td>
                                            </tr>
                                            <tr>
                                                <td>右边距</td>
                                                <td><input type="text" autocomplete="off" id="legend-right" class="position" value="0"></td>
                                            </tr>
											-->
                                            <tr>
                                                <td>文本样式</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>颜色</td>
                                                <td>
                                                    <div style="width: 100px;margin-right:5px;display:table-cell">
                                                        <input type="text" id="legendColorInput" style="margin-right:5px;" value="#000000">
                                                    </div>
                                                    <div id="legendColor"
                                                         style="width: 80px; display: table-cell; height: 29px; border: 1px solid rgb(213, 213, 213); background-color: black;"></div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>字体风格</td>
                                                <td><select id="legendStyle">
                                                    <option value="normal">正常</option>
                                                    <option value="italic">斜体</option>
                                                    <option value="oblique">倾斜</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>字体粗细</td>
                                                <td><select id="legendWeight">
                                                    <option value="normal">正常</option>
                                                    <option value="bold">加粗</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>字体名称</td>
                                                <td><select id="legendFamily">
                                                    <option value="sans-serif">sans-serif</option>
                                                    <option value="serif">serif</option>
                                                    <option value="monospace">monospace</option>
                                                    <option value="Arial">Arial</option>
                                                    <option value="Microsoft YaHei">Microsoft YaHei</option>
                                                </select></td>
                                            </tr>
                                            <tr>
                                                <td>字体大小</td>
                                                <td><input type="text" autocomplete="off" id="legendSize" value="12"></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="layui-tab-item" id="grid" style="overflow: auto;white-space: normal;height:390px;">
                                    <div class="chart">
                                        <%-- <div style="width: 100%;text-align: center;margin-bottom:5px;font-size:20px">
                                             <a style="display: inline-grid;">网 格</a>
                                         </div>--%>
                                        <table style="width: 100%;display:table;table-layout:fixed">
                                            <tr>
                                                <td style="width:88px;">显示网格</td>
                                                <td style="width:114px;">
                                                    <select id="gridShow">
                                                        <option value="1">显示</option>
                                                        <option value="0" selected>不显示</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>是否包含<br>刻度标签</td>
                                                <td>
                                                    <select id="containLabel">
                                                        <option value="1">包含</option>
                                                        <option value="0" selected>不包含</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>背景颜色</td>
                                                <td>
                                                    <div style="width: 100px;display:table-cell"><input type="text" id="gridBgInput" style="margin-right:5px;" value="#ffffff"></div>
                                                    <div id="gridBg" style="width: 80px;display:table-cell;height:29px;border:1px solid #D5D5D5;"></div>
                                                </td>
                                            </tr>
											<!--
                                            <tr><td>上边距</td><td><input type="text" autocomplete="off" id="grid-top" class="position" value="0"></td></tr>
                                            <tr><td>下边距</td><td><input type="text" autocomplete="off" id="grid-bottom" class="position" value="0"></td></tr>
                                            <tr><td>左边距</td><td><input type="text" autocomplete="off" id="grid-left" class="position" value="0"></td></tr>
                                            <tr><td>右边距</td><td><input type="text" autocomplete="off" id="grid-right" class="position" value="0"></td></tr>
											-->
                                        </table>
                                    </div>
                                </div>
                                <div class="layui-tab-item" id="data" style="overflow: auto;white-space: normal;height:390px;">
                                    <div class="chart">
                                        <%-- <div style="width: 100%;text-align: center;margin-bottom:5px;font-size:20px">
                                             <a style="display: inline-grid;">网 格</a>
                                         </div>--%>
                                        <table style="width: 100%;display:table;table-layout:fixed">
                                            <tr>
                                                <td>分类</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">数据</td>
                                                <td style="width:114px;">
                                                    <input type="text" autocomplete="off" id="category" class="position">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">是否显示X轴</td>
                                                <td style="width:114px;">
                                                    <select id="showX">
                                                        <option value=true selected>显示</option>
                                                        <option value=false >不显示</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">x轴位置</td>
                                                <td style="width:114px;">
                                                    <select id="xPosition">
                                                        <option value="top">上方</option>
                                                        <option value="bottom" selected>下方</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">旋转角度</td>
                                                <td style="width:114px;">
                                                    <input type="text" autocomplete="off" id="xLabelRotate" class="position">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>系列</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">数据</td>
                                                <td style="width:114px;">
                                                    <input type="text" autocomplete="off" id="series" class="position">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">是否显示标签</td>
                                                <td style="width:114px;">
                                                    <select id="showLabel">
                                                        <option value=true>显示</option>
                                                        <option value=false selected>不显示</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">是否显示提示框</td>
                                                <td style="width:114px;">
                                                    <select id="showTip">
                                                        <option value=true>显示</option>
                                                        <option value=false selected>不显示</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>值</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">数据</td>
                                                <td style="width:114px;">
                                                    <input type="text" autocomplete="off" id="value" class="position">
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">是否显示Y轴</td>
                                                <td style="width:114px;">
                                                    <select id="showY">
                                                        <option value=true selected>显示</option>
                                                        <option value=false >不显示</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">y轴位置</td>
                                                <td style="width:114px;">
                                                    <select id="yPosition">
                                                        <option value="left" selected>左侧</option>
                                                        <option value="right">右侧</option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width:88px;">旋转角度</td>
                                                <td style="width:114px;">
                                                    <input type="text" autocomplete="off" id="yLabelRotate" class="position">
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="layui-tab-item">
                <div class="json-container">

                </div>
            </div>

        </div>
    </div>
</div>
<div class="operation" style="width:800px;height:60px;text-align: center;margin-top:8px;">
    <button  class="layui-btn" id="confirm">
        确定
    </button>
    <button class="layui-btn" id="dismiss">
        取消
    </button>
</div>

</body>
<script src="${pageContext.request.contextPath}/js/jquery-1.11.3.min.js"></script>
<script src="${pageContext.request.contextPath}/lib/echarts/echarts-4.1.0.min.js"></script>
<script src="${pageContext.request.contextPath}/lib/echarts/tools.js"></script>
<script src="${pageContext.request.contextPath}/lib/echarts/map.js"></script>
<script src="${pageContext.request.contextPath}/lib/layui/layui.js"></script>
<script src="${pageContext.request.contextPath}/js/design/spectrum.js"></script>
<script src="${pageContext.request.contextPath}/js/design/comm.js"></script>
<script src="${pageContext.request.contextPath}/wasm/qtloader.js"></script>
<script src="${pageContext.request.contextPath}/js/plugin/plugin.js"></script>
<script src="${pageContext.request.contextPath}/js/json-viewer.js"></script>
<script src="${pageContext.request.contextPath}/js/def/global.js"></script>


<script type="text/javascript">
    var base = '${pageContext.request.contextPath}';
    var column = '<%=request.getParameter("column")%>';
    var row = '<%=request.getParameter("row")%>';
    var width = '<%=request.getParameter("width")%>';
    var height = '<%=request.getParameter("height")%>';
    var uuid = '<%=request.getParameter("uuid")%>'; //插件属性
    var type= '<%=request.getParameter("type")%>'; //插件类型
    var layer ;
	
    layui.use('element', function () {
        var element = layui.element;
    });
	layui.use('layer', function() {
        layer = layui.layer;
    });
    /**
     * Created by whj on 2019/9/10.
     */

    var plugin = {
        instance: {},  //Echart实例
        optionJson: {},
        saveJson: {
            categoryData:'',
            seriesData:'',
            valueData:''
        }, //保存到内核的json
        util: {
            isPositiveNumber: function (num) { //判断是否是正整数
                var g = /^[1-9]*[1-9][0-9]*$/;
                return g.test(num);
            },
            isNoNegativeNumber: function (num) {
                var g = /^[1-9]*[1-9][0-9]*$/;
                if (g.test(num)) {
                    return true;
                } else {
                    if (num == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            isRotateNumber:function(num){
                var g = /^[1-9]*[1-9][0-9]*$/;
                var g1 = /-^[1-9]*[1-9][0-9]*$/;
                if(g.test(num)){ //是正整数
                    if(num<=90){
                        return true;
                    }else{
                        //layer.alert("请输入-90到90间整数!");
                        efalert(layer , "请输入-90到90间整数!");
                        return false;
                    }
                }else if(g1.test(num)){
                    if(num>=-90){
                        return true;
                    }else{
                        //layer.alert("请输入-90到90间整数!");
                        efalert(layer , "请输入-90到90间整数!");
                        return false;
                    }
                }
            },
            HexToRgba:function(val){
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{8})$/;
                var sColor = val.toLowerCase();
                if(sColor && reg.test(sColor)){
                    if(sColor.length === 4){
                        var sColorNew = "#";
                        for(var i=1; i<4; i+=1){
                            sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for(var i=1; i<9; i+=2){
						if(i<7){
							sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
						}else{
							var number = parseInt("0x"+sColor.slice(i,i+2));
							sColorChange.push(number/255);
						}
                        
                    }
                    return "RGBA(" + sColorChange.join(",") + ")";
                }else{
                    return sColor;
                }
            },
			HexToRgb:function(val){
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                var sColor = val.toLowerCase();
                if(sColor && reg.test(sColor)){
                    if(sColor.length === 4){
                        var sColorNew = "#";
                        for(var i=1; i<4; i+=1){
                            sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
                        }
                        sColor = sColorNew;
                    }
                    //处理六位的颜色值
                    var sColorChange = [];
                    for(var i=1; i<7; i+=2){
                        sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
                    }
                    return "RGB(" + sColorChange.join(",") + ")";
                }else{
                    return sColor;
                }
            },

            RgbToHex : function(val){
                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                if(/^(rgb|RGB)/.test(val)){
                    var aColor = val.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
                    var strHex = "#";
                    for(var i=0; i<aColor.length; i++){
                        var hex = Number(aColor[i]).toString(16);
                        if(hex === "0"){
                            hex += hex;
                        }
                        strHex += hex;
                    }
                    if(strHex.length !== 7){
                        strHex = val;
                    }
                    return strHex;
                }else if(reg.test(val)){
                    var aNum = val.replace(/#/,"").split("");
                    if(aNum.length === 6){
                        return val;
                    }else if(aNum.length === 3){
                        var numHex = "#";
                        for(var i=0; i<aNum.length; i+=1){
                            numHex += (aNum[i]+aNum[i]);
                        }
                        return numHex;
                    }
                }else{
                    return val;
                }
            },
			RgbaToHex:function(val){
				var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{8})$/;
                if(/^(rgba|RGBA)/.test(val)){
                    var aColor = val.replace(/(?:\(|\)|rgba|RGBA)*/g,"").split(",");
                    var strHex = "#";
                    for(var i=0; i<aColor.length; i++){
						if(i==3){
							var hex = (Number(aColor[i])*255).toString(16);
							if(hex === "0"){
								hex += hex;
							}
							strHex += hex;
						}else{
							var hex = Number(aColor[i]).toString(16);
							if(hex === "0"){
								hex += hex;
							}
							strHex += hex;
						}
                       
                    }
					
                    //if(strHex.length !== 9){
                        //strHex = val;
                    //}
                    return strHex;
                }else if(reg.test(val)){
                    var aNum = val.replace(/#/,"").split("");
                    if(aNum.length === 6){
                        return val;
                    }else if(aNum.length === 3){
                        var numHex = "#";
                        for(var i=0; i<aNum.length; i+=1){
                            numHex += (aNum[i]+aNum[i]);
                        }
                        return numHex;
                    }
                }else{
                    return val;
                }
			},
			CheckIsHex6:function(bgVal) { 
			　　var type = "^#[0-9a-fA-F]{6}$"; 
			　　var re = new RegExp(type); 
			　　if (bgVal.match(re) == null) { 
			　　　　type = "^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$"; 
			　　　　re = new RegExp(type); 
			　　　　if (bgVal.match(re) == null) { 
			　　　　　　return false;
			　　　　} else { 
			　　　　　　return true;
			　　　　} 
			　　　} else { 
			　　　　return true;
			　　} 
			},
			CheckIsHex8:function(bgVal) { 
			　　var type = "^#[0-9a-fA-F]{8}$"; 
			　　var re = new RegExp(type); 
			　　if (bgVal.match(re) == null) { 
			　　　　type = "^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$"; 
			　　　　re = new RegExp(type); 
			　　　　if (bgVal.match(re) == null) { 
			　　　　　　return false;
			　　　　} else { 
			　　　　　　return true;
			　　　　} 
			　　　} else { 
			　　　　return true;
			　　} 
			}

        },
        colors: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ],

        colorOpt: {
            allowEmpty: true, showInput: true, containerClassName: "full-spectrum", showInitial: true, showPalette: true,
            showSelectionPalette: false, showAlpha: true, maxPaletteSize: 10, preferredFormat: "hex",

            change: function (color) { //修改title的背景颜色
                var hexColor = "transparent";
                if (color) {
                    hexColor = color.toHexString();
                    $(this).css("background-color", hexColor);
                    $(this).prev().find('input').val(hexColor);
                    if ($(this).attr('id') == 'titleBg') {
                        plugin.title.changeBgColor(plugin.util.HexToRgb(hexColor)); //将Hex转为rgb数据
                    } else if ($(this).attr('id') == 'titleColor') {
                        plugin.title.changeTitleColor(plugin.util.HexToRgb(hexColor));
                    } else if ($(this).attr('id') == 'legendBg') {
                        plugin.legend.changeBgColor(plugin.util.HexToRgb(hexColor));
                    } else if ($(this).attr('id') == 'legendColor') {
                        plugin.legend.changeTitleColor(plugin.util.HexToRgb(hexColor));
                    } else if ($(this).attr('id') == 'gridBg') {
                        plugin.grid.changeBgColor(plugin.util.HexToRgb(hexColor));
                    } else if ($(this).attr('id') == 'chartBg') {
                        plugin.changeBgColor(hexColor);
                    }
                }
            },
            beforeShow: function () {

            },
            hide: function () {

            },
            palette: this.colors
        },

        initColorPlugin: function (id) {  //初始化颜色选择控件
            $('#' + id).spectrum(this.colorOpt);
        },
        bind:function(){

            plugin.initColorPlugin('titleBg');
            plugin.initColorPlugin('titleColor');
            plugin.initColorPlugin('legendBg');
            plugin.initColorPlugin('legendColor');
            plugin.initColorPlugin('gridBg');
			plugin.initColorPlugin('chartBg');
            /*     $('#titleText').val(property.title.text);
             $('#titleBgInput').val(property.title.backgroundColor);
             $('#titleColorInput').val(property.title.fontColor);
             $('#title-top').val(property.title.topPadding);
             $('#title-bottom').val(property.title.bottomPadding);
             $('#title-left').val(property.title.leftPadding);
             $('#title-right').val(property.title.rightPadding);
             $('#titleSize').val(property.title.fontSize);*/
            $('#titleShow').bind('change', function () {
                if ($(this).val() == '0') {
                    plugin.title.isVisible(false);
                } else {
                    plugin.title.isVisible(true);
                }
            });
            $('#legendShow').bind('change', function () {
                if ($(this).val() == '0') {
                    plugin.legend.isVisible(false);
                } else {
                    plugin.legend.isVisible(true);
                }
            });
            $('#gridShow').bind('change', function () {
                if ($(this).val() == '0') {
                    plugin.grid.isVisible(false);
                } else {
                    plugin.grid.isVisible(true);
                }
            });

            $('#titleText').bind('change', function () {
                plugin.title.changeText($(this).val());
            });

            $('#titleSize').bind('change', function () {
                if (plugin.util.isPositiveNumber($(this).val())) {
                    plugin.title.changeTitleSize($(this).val());
                } else {
                    //layer.alert("请输入正确的数字!");
                    efalert(layer , "请输入正确的数字");
                }
            });
			
			$('#chartBgInput').bind('change',function(){
				if(plugin.util.CheckIsHex6($(this).val())){
					plugin.changeBgColor(plugin.util.HexToRgb($(this).val()));
				}else if(plugin.util.CheckIsHex8($(this).val())){
					plugin.changeBgColor(plugin.util.HexToRgba($(this).val()));
				}
				else{
					//layer.alert("请输入正确的颜色!");
                    efalert(layer , "请输入正确的颜色");
				}
				
			});
			$('#titleBgInput').bind('change',function(){
				if(plugin.util.CheckIsHex6($(this).val())){
					console.log(plugin.util.HexToRgb($(this).val()));
					plugin.title.changeBgColor(plugin.util.HexToRgb($(this).val()));
				}else if(plugin.util.CheckIsHex8($(this).val())){
					plugin.title.changeBgColor(plugin.util.HexToRgba($(this).val()));
				}
				else{
					//layer.alert("请输入正确的颜色!");
                    efalert(layer , "请输入正确的颜色");
				}
				
			});
			$('#legendBgInput').bind('change',function(){
				if(plugin.util.CheckIsHex6($(this).val())){
					console.log(plugin.util.HexToRgb($(this).val()));
					plugin.legend.changeBgColor(plugin.util.HexToRgb($(this).val()));
				}else if(plugin.util.CheckIsHex8($(this).val())){
					plugin.legend.changeBgColor(plugin.util.HexToRgba($(this).val()));
				}
				else{
					//layer.alert("请输入正确的颜色!");
                    efalert(layer , "请输入正确的颜色");
				}
				
			});
			$('#gridBgInput').bind('change',function(){
				
				if(plugin.util.CheckIsHex6($(this).val())){
					console.log(plugin.util.HexToRgb($(this).val()));
					plugin.grid.changeBgColor(plugin.util.HexToRgb($(this).val()));
				}else if(plugin.util.CheckIsHex8($(this).val())){
					plugin.grid.changeBgColor(plugin.util.HexToRgba($(this).val()));
				}
				else{
					//layer.alert("请输入正确的颜色!");
                    efalert(layer , "请输入正确的颜色");
				}
			});
			
            $('#legendSize').bind('change', function () {
                if (plugin.util.isPositiveNumber($(this).val())) {
                    plugin.legend.changeTitleSize($(this).val());
                } else {
                    //layer.alert("请输入正确的数字!");
                    efalert(layer , "请输入正确的数字");
                }
            });
            $('#title-top').bind('change', function () {
                if (plugin.util.isNoNegativeNumber($(this).val())) {
                    plugin.title.changeTop($(this).val());
                } else {
                    //layer.alert("请输入正确的数字!");
                    efalert(layer , "请输入正确的数字");
                }
            });
            $('#title-bottom').bind('change', function () {
                if (plugin.util.isNoNegativeNumber($(this).val())) {
                    plugin.title.changeBottom($(this).val());
                } else {
                    //layer.alert("请输入正确的数字!");
                    efalert(layer , "请输入正确的数字");
                }
            });
            $('#title-left').bind('change', function () {
                if (plugin.util.isNoNegativeNumber($(this).val())) {
                    plugin.title.changeLeft($(this).val());
                } else {
                    //layer.alert("请输入正确的数字!");
                    efalert(layer , "请输入正确的数字");
                }
            });
            $('#title-right').bind('change', function () {
                if (plugin.util.isNoNegativeNumber($(this).val())) {
                    plugin.title.changeRight($(this).val());
                } else {
                    //layer.alert("请输入正确的数字!");
                    efalert(layer , "请输入正确的数字");
                }
            });
            $('#titleStyle').bind('change', function () {
                plugin.title.changeFontStyle($(this).val());
            });
            $('#titleFont').bind('change',function(){
                plugin.title.changeFont($(this).val());
            })
            $('#legendStyle').bind('change', function () {
                plugin.legend.changeFontStyle($(this).val());
            });
            $('#titleWeight').bind('change', function () {
                plugin.title.changeFontWeight($(this).val());
            });
            $('#legendWeight').bind('change', function () {
                plugin.legend.changeFontWeight($(this).val());
            });

            $('#legendOrient').bind('change', function () {
                plugin.legend.changeOrient($(this).val());
            });

            $('#legendAlign').bind('change', function () {
                plugin.legend.changeAlign($(this).val());
            });

            $('#legendFamily').bind('change', function () {
                plugin.legend.changeFont($(this).val());
            });


            $('#showX').bind('change', function () {
                plugin.category.showX($(this).val());
            });

            $('#xPosition').bind('change', function () {
                plugin.category.xPosition($(this).val());
            })

            $('#xLabelRotate').bind('change', function () {
                if(plugin.util.isRotateNumber($(this).val())){
                    plugin.category.xLabelRotate($(this).val());
                }
            })

            $('#showY').bind('change', function () {
                plugin.value.showY($(this).val());
            });

            $('#yPosition').bind('change', function () {
                plugin.value.yPosition($(this).val());
            })

            $('#yLabelRotate').bind('change', function () {
                if(plugin.util.isRotateNumber($(this).val())){
                    plugin.value.yLabelRotate($(this).val());
                }
            })

            $('#category').bind('change' , function(){ //分类
                plugin.saveJson.categoryData = $(this).val();
            })

            $('#series').bind('change' , function(){ //系列
                plugin.saveJson.seriesData = $(this).val();
            })

            $('#value').bind('change' , function(){ //值
                plugin.saveJson.valueData = $(this).val();
            })

            $('#showLabel').bind('change',function(){
                plugin.series.showLabel($(this).val());
            })

            $('#showTip').bind('change' , function(){
                plugin.toolTip.show($(this).val());
            })

        },
        init: function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('plugin'));
            $.ajax({
                url: base + "/plugin/generateOption",
                type: "post",
                data: {"type": "Bar"},
                dataType: "json",
                success: function (res) {
                    if (res.state == 'failed') {
                        //layer.alert(res.message);
                        efalert(layer , res.message);
                    } else {
                        /*var property = res.property;*/
                        plugin.instance = myChart;
                        plugin.instance.setOption(res.option);
                        plugin.instance.setOption({
                            animation: false
                        });
                        plugin.optionJson = res.option;
                        //$('.property-panel').append(res.html.config);
                        //$('.json-container').append("<p id='echart-json'></p>")
                        $('.json-container').jsonViewer(res.option);
                        plugin.bind();


                    }
                },
                error: function () {
                    //layer.alert("初始化Echart模板出错!");
                    efalert(layer , "初始化Echart模板出错!");
                }

            })


        },
        initByJson:function(json){
            var option = JSON.parse(json);
            var myChart = echarts.init(document.getElementById('plugin'));
            plugin.instance = myChart;
            plugin.instance.setOption(option);
            plugin.instance.setOption({
                animation: false
            });
            plugin.optionJson = option;
            $('.json-container').jsonViewer(option);
            plugin.initStyle(option);
            plugin.bind();
        },
        initByDefaultJson:function(json){
            var option = JSON.parse(json);
            var myChart = echarts.init(document.getElementById('plugin'));
            plugin.instance = myChart;
            plugin.instance.setOption(option);
            plugin.instance.setOption({
                animation: false
            });
            plugin.optionJson = option;
            $('.json-container').jsonViewer(option);
            plugin.bind();
        },
        initStyle:function(json){

			
			var seriesData = json.seriesData==undefined?'':json.seriesData;
			plugin.saveJson.seriesData = seriesData;
			
			var categoryData = json.categoryData==undefined?'':json.categoryData;
			plugin.saveJson.categoryData = categoryData;
			
			var valueData = json.valueData==undefined?'':json.valueData;
			plugin.saveJson.valueData = valueData;

            var barWidth = json.barWidth == undefined?'auto':json.barWidth;
            plugin.saveJson.barWidth = barWidth;
            $('#barWidth').val(barWidth);
			
			var chartBg = json.backgroundColor;
		
			if(chartBg == undefined){
				
			}else{
				if(chartBg.indexOf('RGBA') == -1){//标题背景颜色
					$('#chartBgInput').val(plugin.util.RgbToHex(chartBg));//标题背景颜色
					$('#chartBg').css("background-color" , plugin.util.RgbToHex(chartBg));
				}else{
					$('#chartBgInput').val(plugin.util.RgbaToHex(chartBg));//标题背景颜色
					$('#chartBg').css("background-color" , plugin.util.RgbaToHex(chartBg));
				}
				
			}

            var title = json.title[0];
            $('#titleText').val(title.text); //标题
            //$('#titleBgInput').val(plugin.util.RgbToHex(title.backgroundColor));//标题背景颜色
            //$('#titleBg').spectrum("set", plugin.util.RgbToHex(title.backgroundColor));
            //$('#titleBg').css("background-color" , plugin.util.RgbToHex(title.backgroundColor));
			if(title.backgroundColor.indexOf('RGBA')==-1){
				$('#titleBgInput').val(plugin.util.RgbToHex(title.backgroundColor));//标题背景颜色  
				$('#titleBg').css("background-color" , plugin.util.RgbToHex(title.backgroundColor));
			}else{
				$('#titleBgInput').val(plugin.util.RgbaToHex(title.backgroundColor));//标题背景颜色  
				$('#titleBg').css("background-color" , plugin.util.RgbaToHex(title.backgroundColor));
			}
			
			
            if(title.show == true){
                $('#titleShow').val("1").attr("selected" , true); //是否显示标题
            }
            var textStyle = title.textStyle;
            $('#titleSize').val(textStyle.fontSize);
            var weight = textStyle.fontWeight;
            if(weight == 'normal'){
                $('#titleWeight').val('normal').prop("selected" , true);
            }else{
                $('#titleWeight').val('bold').prop("selected" , true);
            }

		    if(textStyle.color.indexOf('RGBA') == -1){
                if(textStyle.color.indexOf('rgba') == -1){
                    $('#titleColorInput').val(plugin.util.RgbToHex(textStyle.color));
                    $('#titleColor').css("background-color"  , plugin.util.RgbToHex(textStyle.color));
                }else{
                    $('#titleColorInput').val(plugin.util.RgbaToHex(textStyle.color));
                    $('#titleColor').css("background-color"  , plugin.util.RgbaToHex(textStyle.color));
                }
			}else{
                $('#titleColorInput').val(plugin.util.RgbaToHex(textStyle.color));
                $('#titleColor').css("background-color"  , plugin.util.RgbaToHex(textStyle.color));
			}


			
			
            //$('#titleColorInput').val(textStyle.color);
            //$('#titleColor').css("background-color"  , textStyle.color);

            //$('#titleStyle').val(textStyle.fontStyle).prop("selected" , true);
			
			if(textStyle.fontStyle == undefined){ 				
			   $('#titleStyle option:first').prop("selected" , true); 			
			}else{ 				
			   $('#titleStyle').val(textStyle.fontStyle).prop("selected" , true); 			
		    } 
			
           if(textStyle.fontFamily == undefined){ 				
			   $('#titleFont option:first').prop("selected" , true); 			
		   }else{ 				 
			   $('#titleFont').val(textStyle.fontFamily).prop("selected" , true); 			
		   }
			
			

            //图例
            var legend = json.legend[0];
            if(legend.show == true){
                $('#legendShow').val("1").prop("selected" , true); //是否显示图例
            }else{
                $('#legendShow').val("0").prop("selected" , true); //是否显示图例
            }
			if(legend.backgroundColor.indexOf('RGBA') == -1){
                if(legend.backgroundColor.indexOf('rgba') == -1){
                    $('#legendBgInput').val(plugin.util.RgbToHex(legend.backgroundColor)) //图例背景颜色
                    $("#legendBg").css("background-color", plugin.util.RgbToHex(legend.backgroundColor));
                }else{
                    $('#legendBgInput').val(plugin.util.RgbaToHex(legend.backgroundColor)) //图例背景颜色
                    $("#legendBg").css("background-color", plugin.util.RgbaToHex(legend.backgroundColor));
                }

			}else{
                $('#legendBgInput').val(plugin.util.RgbaToHex(legend.backgroundColor)) //图例背景颜色
                $("#legendBg").css("background-color", plugin.util.RgbaToHex(legend.backgroundColor));
			}
           
            if(legend.orient == 'horizontal'){ //图例布局
                $('#legendOrient').val("horizontal").prop("selected"  ,true);
            }else{
                $('#legendOrient').val("vertical").prop("selected"  ,true);
            }
            if(legend.align == 'auto'){//图例对齐方式
                $('#legendAlign').val("auto").prop("selected" , true);
            }else if(legend.align == 'left'){
                $('#legendAlign').val("left").prop("selected" , true);
            }else{
                $('#legendAlign').val("right").prop("selected" , true);
            }
            //图例样式
            var legendStyle = legend.textStyle;
            if(legendStyle.color.indexOf('RGBA') == -1){
                if(legendStyle.color.indexOf('rgba') == -1){
                    $('#legendColorInput').val(plugin.util.RgbToHex(legendStyle.color));
                    $('#legendColor').css("background-color" , plugin.util.RgbToHex(legendStyle.color));
                }else{
                    $('#legendColorInput').val(plugin.util.RgbaToHex(legendStyle.color));
                    $('#legendColor').css("background-color" , plugin.util.RgbaToHex(legendStyle.color));
                }

			}else{
				$('#legendColorInput').val(plugin.util.RgbaToHex(legendStyle.color));
				$('#legendColor').css("background-color" , plugin.util.RgbaToHex(legendStyle.color));
			}
            
            $('#legendSize').val(legendStyle.fontSize==undefined?12:legendStyle.fontSize); 
            var fontStyle = legendStyle.fontStyle;
            if(fontStyle == 'italic'){
                $('#legendStyle').val('italic').prop("selected" , true);
            }else if(fontStyle == 'oblique'){
                $('#legendStyle').val('oblique').prop("selected" , true);
            }else{
                $('#legendStyle').val('normal').prop("selected" , true);
            }

            var fontWeight = legendStyle.fontWeight;
            if(fontWeight == 'bold'){
                $('#legendWeight').val('bold').prop("selected" , true);
            }else{
                $('#legendWeight').val('normal').prop("selected" , true);
            }
			
			if(legendStyle.fontFamily == undefined){ 				
				$('#legendFamily option:first').prop("selected" , true); 			
			}else{ 				
				$('#legendFamily').val(legendStyle.fontFamily).prop("selected" , true); 			
			} 
			
            

            var grid = json.grid[0];
			
			if(grid.backgroundColor.indexOf('RGBA')== -1){
				$('#gridBgInput').val(plugin.util.RgbToHex(grid.backgroundColor));
                $('#gridBg').css("background-color" , plugin.util.RgbToHex(grid.backgroundColor));
			}else{
				$('#gridBgInput').val(plugin.util.RgbaToHex(grid.backgroundColor));
                $('#gridBg').css("background-color" , plugin.util.RgbaToHex(grid.backgroundColor));
			}
			
            
            if(grid.show == true){
                $('#gridShow').val('1').prop("selected" , true);
            }else{
                $('#gridShow').val('0').prop("selected" , true);
            }
            if(grid.containLabel == true){
                $('#containLabel').val('1').prop("selected" , true);
            }else{
                $('#containLabel').val('0').prop("selected" , true);
            }

            var axis = json.xAxis[0];
            var axisLabel = axis.axisLabel;
            $('#xLabelRotate').val(axisLabel.rotate); //X轴旋转角度
            var xLocation = axis.position;
            if(xLocation == 'bottom'){
                $('#xPosition').val('bottom').prop("selected" , true);
            }else{
                $('#xPosition').val('top').prop("selected" , true);
            }

            var yAxis = json.yAxis[0];
            var yAxisLabel = yAxis.axisLabel;
            $('#yLabelRotate').val(yAxisLabel.rotate); //X轴旋转角度
            var yLocation = yAxis.position;
            if(yLocation == 'left'){
                $('#yPosition').val('left').prop("selected" , true);
            }else{
                $('#yPosition').val('right').prop("selected" , true);
            }

            //图例
            var series = json.series[0];
            var flag = String(series.label.show);
            $('#showLabel').val(flag).prop("selected" , true);

            var categoryData = json.categoryData;
            $('#category').val(categoryData);

            var seriesData = json.seriesData;
            $('#series').val(seriesData);

            var valueData = json.valueData;
            $('#value').val(valueData);

            $('#showTip').val(String(json.tooltip[0].show)).prop('selected' , true);

        },
        title: {
            isVisible: function (flag) { //设置标题是否显示
                if (plugin.instance) {
                    plugin.instance.setOption({
                        title: {
                            show: flag
                        }
                    })
                }
            },
            changeText: function (text) {  //修改标题文本
                if (plugin.instance) {
                    plugin.instance.setOption({
                        title: {
                            text: text,
                            show: true
                        }
                    })
                }
                console.log(plugin.instance.getOption());
                $('.json-container').jsonViewer(plugin.instance.getOption());

            },
            changeBgColor: function (color) { //修改标题背景颜色
                plugin.instance.setOption({
                    title: {
                        backgroundColor: color
                    }
                })
            },
            changeTitleColor: function (color) { //修改标题文本颜色
                plugin.instance.setOption({
                    title: {
                        textStyle: {
                            color: color
                        }
                    }
                })
            },
            changeTitleSize: function (size) { //设置标题大小
                plugin.instance.setOption({
                    title: {
                        textStyle: {
                            fontSize: size
                        }
                    }
                })
            },
            changeLeft: function (px) {
                plugin.instance.setOption({
                    title: {
                        left: px
                    }
                })
            },
            changeRight: function (px) {
                plugin.instance.setOption({
                    title: {
                        right: px
                    }
                })
            },
            changeTop: function (px) {
                plugin.instance.setOption({
                    title: {
                        top: px
                    }
                })
            },
            changeBottom: function (px) {
                plugin.instance.setOption({
                    title: {
                        bottom: px
                    }
                })
            },
            changeFontStyle: function (style) {
                plugin.instance.setOption({
                    title: {
                        textStyle: {
                            fontStyle: style
                        }
                    }
                })
            },
            changeFontWeight: function (weight) {
                plugin.instance.setOption({
                    title: {
                        textStyle: {
                            fontWeight: weight
                        }
                    }
                })
            },
            changeFont:function(val){
                plugin.instance.setOption({
                    title:{
                        textStyle:{
                            fontFamily:val
                        }
                    }
                })
            }
        },
        legend: {
            isVisible: function (flag) { //设置图例是否显示
                if (plugin.instance) {
                    plugin.instance.setOption({
                        legend: {
                            show: flag
                        }
                    })
                }
            },
            changeText: function (text) {  //修改图例文本
                if (plugin.instance) {
                    plugin.instance.setOption({
                        legend: {
                            text: text,
                            show: true
                        }
                    })
                }
            },
            changeBgColor: function (color) { //修改图例背景颜色
                plugin.instance.setOption({
                    legend: {
                        backgroundColor: color
                    }
                })
            },
            changeTitleColor: function (color) { //修改图例文本颜色
                plugin.instance.setOption({
                    legend: {
                        textStyle: {
                            color: color
                        }
                    }
                })
            },
            changeTitleSize: function (size) { //设置图例大小
                plugin.instance.setOption({
                    legend: {
                        textStyle: {
                            fontSize: size
                        }
                    }
                })
            },
            changeLeft: function (px) {
                plugin.instance.setOption({
                    legend: {
                        left: px
                    }
                })
            },
            changeRight: function (px) {
                plugin.instance.setOption({
                    legend: {
                        right: px
                    }
                })
            },
            changeTop: function (px) {
                plugin.instance.setOption({
                    legend: {
                        top: px
                    }
                })
            },
            changeBottom: function (px) {
                plugin.instance.setOption({
                    legend: {
                        bottom: px
                    }
                })
            },
            changeFontStyle: function (style) {
                plugin.instance.setOption({
                    legend: {
                        textStyle: {
                            fontStyle: style
                        }
                    }
                })
            },
            changeFontWeight: function (weight) {
                plugin.instance.setOption({
                    legend: {
                        textStyle: {
                            fontWeight: weight
                        }
                    }
                })
            },
            changeFont: function (val) {
                plugin.instance.setOption({
                    legend: {
                        textStyle: {
                            fontFamily: val
                        }
                    }
                })
            },
            changeOrient: function (orient) {
                plugin.instance.setOption({
                    legend: {
                        orient: orient
                    }
                })
            },
            changeAlign: function (align) {
                plugin.instance.setOption({
                    legend: {
                        align: align
                    }
                })
            }
        },
        grid: {
            isVisible: function (flag) {
                plugin.instance.setOption({
                    grid: {
                        show: flag
                    }
                })
                console.log(plugin.instance.getOption())
            },
            containLabel: function (flag) {
                plugin.instance.setOption({
                    grid: {
                        containLabel: flag
                    }
                })
            },
            changeBgColor: function (color) { //修改图例背景颜色
                plugin.instance.setOption({
                    grid: {
                        backgroundColor: color
                    }
                })
            }
        },
        category: {

            showX: function (val) { //是否显示x轴
                var flag;
                if (val == "true") {
                    flag = true;
                } else {
                    flag = false;
                }
                plugin.instance.setOption({
                    xAxis: {
                        show: flag
                    }
                })
            },
            xPosition: function (val) {
                plugin.instance.setOption({
                    xAxis: {
                        position: val
                    }
                })
            },
            xLabelRotate: function (val) {
                plugin.instance.setOption({
                    xAxis: {
                        axisLabel: {
                            rotate: val
                        }
                    }
                })
            }

        },
        series:{
            showLabel:function(val){
                var flag;
                if (val == "true") {
                    flag = true;
                } else {
                    flag = false;
                }
                plugin.instance.setOption({
                    series: [{
                        label:{
                            show: flag
                        }
                    }, {
                        label:{
                            show: flag
                        }
                    }]
                })
            }
        },
        value: {
            showY: function (val) { //是否显示Y轴
                var flag;
                if (val == "true") {
                    flag = true;
                } else {
                    flag = false;
                }
                plugin.instance.setOption({
                    yAxis: {
                        show: flag
                    }
                })
                console.log(JSON.stringify(plugin.instance.getOption()));
            },
            yPosition: function (val) { //Y轴显示位置
                console.log(val);
                plugin.instance.setOption({
                    yAxis: {
                        position: val
                    }
                })

            },
            yLabelRotate: function (val) {
                plugin.instance.setOption({
                    yAxis: {
                        axisLabel: {
                            rotate: val
                        }
                    }
                })
            }
        },
        toolTip:{
            show:function(val){
                var flag;
                if (val == "true") {
                    flag = true;
                } else {
                    flag = false;
                }
                plugin.instance.setOption({
                    tooltip:{
                        show:flag
                    }
                })
            }

        },
		changeBgColor:function(val){
			plugin.instance.setOption({
				backgroundColor : val
			})
		}

    }


    $(document).ready(function () {
        if(uuid == null){
            plugin.init();
        }else{
            $.ajax({
                url:base + "/plugin/getOption",
                type:"post",
                data:{"uuid":uuid , "type":type},
                success:function(res){
                    var option = res;
                    var json = JSON.parse(option);
                    console.log(json);
                    if('initTimes' in json){
                        plugin.initByDefaultJson(option);
                    }else{
                        plugin.initByJson(option);
                    }
                }
            })
        }

        $('#confirm').bind('click' , function(){
            var eOption = plugin.instance.getOption();
            var data = plugin.instance.getDataURL();
            if ('initTimes' in eOption) {
                delete eOption['initTimes'];
            }
             $.ajax({
                url:base +  "/plugin/generatePluginMixedPng",
                type:"post",
                dataType:"json",
                data:{"option":JSON.stringify(eOption),"width":width,"height":height , "realData":JSON.stringify(plugin.saveJson),"type":type},
                success:function(res){
                    var state = res.state;
                    if(state == "success"){
                        var base64 = res.imageCode; //获取图片base64编码
                        var option = res.option;
                        window.parent.parent.setDefaultImage(column,row,base64);
                        window.parent.parent.setSelCellPluginInfo(option);
                        parent.parent.layer.close(parent.parent.layer.getFrameIndex(window.parent.name));
                    }else{
                        alert("生成图片出错");

                    }

                },
                error:function(){

                }
            })
        });
        $('#dismiss').bind('click' , function(){
            parent.parent.layer.close(parent.parent.layer.getFrameIndex(window.parent.name));
        })
    });
</script>
</html>