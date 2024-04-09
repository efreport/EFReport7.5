/**
 * 区域联动JS
 *
 * */
/*let paramMap = {};*/
let repaintJson;
var Link = {
    Fn: {
        /**
         *
         * 当前报表区域联动方法
         * obj 区域联动触发对象
         * type 控件类型
         * regx 联动JSON
         * isSubsheet 是否联动子sheet标识
         * subSheetName 联动的子sheet名
         * */
        regionLink: function (obj, type, regx, isSubsheet, subSheetName, controlValue) {
            if (!isNull(regx)) { //如果联动JSON表达式不为空
                regx = JSON.parse(decodeURI(regx));
                let params = regx.Params; //联动参数
                let regions = regx.Regions;//联动区域
                let sheetName = regx.MainSheetName == undefined ? "" : regx.MainSheetName; //sheet名
                let shapes = regx.Shapes; //悬浮插件联动
                let selfX = regx.selfX; //当前联动的单元格x
                let selfY = regx.selfY; //当前联动的单元格y
                let shapeName = regx.ShapeName; //当前联动的悬浮元素名称
                let val;
                let selfRegions;
                if (type == 3) {
                    val = controlValue;
                } else {
                    val = Link.Fn.getObjValue(type, obj);
                }
                if (1 == type) {//如果是插件类型,替换分类系列值
                    let ser = obj.seriesName;
                    if (ser) {
                        if (ser.indexOf('series') > -1 || tt) {
                            ser = obj.name;
                        }
                        params = params.replace('SERIES', ser);

                        let ca = obj.name;
                        if (ca.indexOf('series') > -1) {
                            ca = obj.seriesName;
                        }
                        params = params.replace('CATEGORY', ca);
                        params = params.replace('VALUE', obj.value[2]);
                        params = params.replace('X-AXIS', obj.value[0]);
                        params = params.replace('Y-AXIS', obj.value[1]);
                    } else { //非分类系列值插件联动
                        params = params.replace('CONTROLVALUE', val);
                    }
                } else {//转换参数
                    params = params.replace('CONTROLVALUE', val);
                }

                params = Link.Fn.processParam(params);

                Link.Fn.generateJson(params, sheetName, regx); //根据参数重新生成报表的JSON
                if (regions.length != 0) { //存在单元格刷新规则
                    Link.Fn.refresh(regions, sheetName, selfX, selfY, shapeName);
                }
                if (shapes != undefined && shapes.length != 0) {
                    Link.Fn.refreshShapes(shapes, selfX, selfY, shapeName); //刷新悬浮插件
                }
            }
        },
        /**
         * 根据区域联动源的类型获取控件值
         * */
        getObjValue: function (type, obj) {
            let val = '';
            if (6 == type) {//日历
                val = obj.cal.getDateStr();//获取日期文本
            } else if (2 == type) {//单选下拉
                val = $(obj).val();//获取单选下拉的值
            } else if (3 == type) {//多选下拉
                val = $(obj).val();//获取单选下拉的值
            } else if (7 == type) {//checkbox 复选框
                let name = $(obj).attr('name'); //checkbox name
                $('input:checkbox[name="' + name + '"]:checked').each(function (i) {
                    if (0 == i) {
                        val = $(this).val();
                    } else {
                        val += ("," + $(this).val());
                    }
                });//获取选中项的所有值
            } else if (10 == type) {//radio单选框
                let name = $(obj).attr('name'); //checkbox name
                val = $('input:radio[name="' + name + '"]:checked').val();
            } else if (1001 == type) { //树形控件
                val = obj;
            } else if (2001 == type) { //3D中国地图
                val = obj;
            }
            return val;
        },
        /**
         *
         * 根据参数重新生成新的JSON文件
         *
         * */
        generateJson: function (params, pSheetName, linkRegions) {
            let regions = JSON.stringify(linkRegions);
            isLoaded = "1";//重新加载标识
            $.ajaxSettings.async = false; //改变ajax的加载方式为同步加载
            $.getJSON(base + "/report/linkage?token=" + token, {
                templateId: id,//模板名
                sheetName: pSheetName, //sheet名
                params: encodeURIComponent(params),
                page: 1,
                isSubSheet: 'N', //是否加载子表单标识
                shapes: encodeURIComponent(JSON.stringify(linkRegions)),
                templateName: templateName
            }, function (res) {
                if (res.type == 2) {
                    pathId = res.pathId; //更新当前数据的目录ID
                    repaintJson = res.repaintJson; //联动的元素信息
                }
            });
            $.ajaxSettings.async = true;
        },
        /**
         *
         * 根据regions来刷新对应的单元格
         * regions 刷新区域
         * sheetName 主报表名
         * 遍历单元格，如果被关联的单元格没有subreportsheetnames属性，重新生成该单元格内容
         *           如果被关联的单元格有subreportsheetnames属性，根据各子表单的json内容重新生成table
         *
         *
         * */
        refresh: function (regions, sheetName, selfX, selfY, shapeName) {
            //遍历所有的关联单元格
            let table = $("table[sheetname='" + sheetName + "']");
            let repaintArray = JSON.parse(repaintJson);
            let id = table.attr("id");
            let linkRegions;
            for (let i = 0; i < regions.length; i++) { //遍历需要联动的单元格
                let tdId = id + "_" + regions[i].Y + "_" + regions[i].X;
                let expr = regions[i].X + "_" + regions[i].Y
                if ($.inArray(expr, repaintArray) == -1) { //不联动
                    return;
                }
                let linkTd = $('#' + tdId); //被关联的TD
                if (linkTd.attr("subreportsheetnames") == undefined) { //如果该TD没有关联子表单，刷新该单元格，重新生成单元格
                    $.ajaxSettings.async = false;
                    $.getJSON(base + '/report/loadJSON?token=' + token, {//根据模板名和sheetName去后台获取生成的JSON
                        serverId: serverId,
                        pathId: pathId,
                        isSubSheet: 'N',
                        file: sheetName,
                        page: parseInt(($('#curr').val() == '' || $('#curr').val() == undefined) ? 1 : $('#curr').val()) //页码
                    }, function (data) {
                        reportJson = data; //更新数据
                        let _Page = data.Pages[0]; //重新生成的JSON数据
                        // 遍历单元格
                        $.each(_Page.Cells, function (j, cell) {
                            let props = cell.N;
                            if (tdId == (id + '_' + props[1] + '_' + props[0])) {//找到指定的单元格
                                //linkTd.empty(); //清空单元格的内容
                                let hr = linkTd.attr('hr'); //单元格上存放的水平比例
                                let vr = linkTd.attr('vr'); //单元格上存放的垂直比例
                                refreshNormalCell(linkTd, cell, id, data.ColorList,sheetName);
                            }
                        });
                    });
                    $.ajaxSettings.async = true;
                } else {//区域联动的是子表单，需要重新生成子表单内容
                    let names = linkTd.attr('subreportsheetnames').split(',');
                    let swiperWrapperId = randomUUID(); //生成随机ID
                    if (names.length > 1) {//添加左右控制按钮
                        //外层包裹容器,这里没有使用td.height()，是因为td.height()获取的是单元格合并前TD的高度
                        let containerHtml = "<div class='swiper-container' style='width: " + linkTd.css('width') + "; height: " + linkTd.css('height') + ";margin:0px;padding:0px;'><div id='" + swiperWrapperId + "' class='swiper-wrapper' style=width:" + linkTd.css('width') + "px;></div><div>";
                        linkTd.html(containerHtml);
                        //内层滚动容器，当一个单元格上关联多个sheet时，要实现左右滚动效果
                        linkTd.find('.swiper-container').append("<div class='swiper-button-next'></div><div class='swiper-button-prev'></div>");
                    }
                    //为td添加子sheet名属性
                    linkTd.attr("SubReportSheetNames", linkTd.attr('subreportsheetnames').toString());
                    let swiper = $("#" + swiperWrapperId);
                    let width = linkTd.attr("ow"); //td的宽度，也是子报表的宽度
                    let height = linkTd.attr("oh"); //td的高度，也是子报表的高度
                    let isSubReportCellPercent = linkTd.attr("isSubReportCellPercent"); //子报表是否自适应属性
                    let isSubReportKeepHVRatio = linkTd.attr("isSubReportKeepHVRatio"); //子报表是否保持横纵比属性
                    let isShowCenterSubReport = linkTd.attr("isShowCenterSubReport"); //是否居中显示
                    let isShowSubReportScrollBar = linkTd.attr("isShowSubReportScrollBar");//是否显示垂直滚动条
                    if (isSubReportCellPercent == 'true') {
                        isSubReportCellPercent = true;
                    }
                    if (isSubReportCellPercent == 'false') {
                        isSubReportCellPercent = false;
                    }
                    if (isSubReportKeepHVRatio == 'true') {
                        isSubReportKeepHVRatio = true;
                    }
                    if (isSubReportKeepHVRatio == 'false') {
                        isSubReportKeepHVRatio = false;
                    }
                    if (isShowCenterSubReport == 'true') {
                        isShowCenterSubReport = true;
                    }
                    if (isShowCenterSubReport == 'false') {
                        isShowCenterSubReport = false;
                    }
                    if (isShowSubReportScrollBar == 'true') {
                        isShowSubReportScrollBar = true;
                    }
                    if (isShowSubReportScrollBar == 'false') {
                        isShowSubReportScrollBar = false;
                    }
                    $.ajaxSettings.async = false;
                    $.each(names, function (i, item) {

                        $.getJSON(base + '/report/loadJSON?token=' + token, {//根据模板名和sheetName去后台获取生成的JSON
                            serverId: serverId,
                            pathId: pathId,
                            isSubSheet: 'Y', //区域联动的是否是子表单
                            file: item,
                            page: parseInt(($('#curr').val() == '' || $('#curr').val() == undefined) ? 1 : $('#curr').val()) //页码
                        }, function (data) {
                            let slideId = randomUUID();
                            if (isSubReportCellPercent) { //如果子报表保持自适应，不会出现横向滚动条 whj
                                if (names.length > 1) {
                                    swiper.append("<div class='swiper-slide' id='" + slideId + "' style='overflow-x:hidden;overflow-y:auto;margin: 0 auto;width:" + linkTd.css('width') + ";height:" + linkTd.css('height') + ";'></div>");
                                } else {
                                    linkTd.children('div').empty();
                                    linkTd.children('div').attr("id", slideId);
                                }
                            } else {
                                if (names.length > 1) {
                                    swiper.append("<div class='swiper-slide' id='" + slideId + "' style='overflow: auto;margin: 0 auto;width:" + linkTd.css('width') + ";height:" + linkTd.css('height') + "'></div>");
                                } else {
                                    linkTd.children('div').empty();
                                    linkTd.children('div').attr("id", slideId);
                                }
                            }
                            generateSubSheetTable(linkTd.attr('id'), data, slideId, item, sheetName, isSubReportCellPercent, isSubReportKeepHVRatio, isShowSubReportScrollBar, undefined, isShowCenterSubReport);
                        });
                    });
                    $.ajaxSettings.async = true;
                    /**
                     *
                     * 子报表区域是否显示垂直滚动条
                     * */
                    if (isSubReportCellPercent) { //自适应
                        if (isSubReportKeepHVRatio) {//自适应且保持横纵比
                            if (names.length > 1) {
                                //自适应保持横纵比且显示滚动条
                                if (isShowSubReportScrollBar) {
                                    linkTd.find('.swiper-container').css('overflow', 'auto');
                                    linkTd.find('.swiper-slide').css('overflow', 'auto');
                                } else { //自适应保持横纵比且不显示滚动条
                                    linkTd.find('.swiper-container').css('overflow', 'hidden');
                                    linkTd.find('.swiper-slide').css('overflow', 'hidden');
                                }
                            } else {
                                if (isShowSubReportScrollBar) {
                                    linkTd.children('div').css('overflow', 'auto');
                                    linkTd.children('div').css('overflow', 'auto');
                                } else {
                                    linkTd.children('div').css('overflow', 'hidden');
                                    linkTd.children('div').css('overflow', 'hidden');
                                }
                            }
                        }
                    } else {//非自适应
                        if (names.length > 1) {
                            if (isShowSubReportScrollBar) {
                                linkTd.find('.swiper-container').css('overflow', 'auto');
                                linkTd.find('.swiper-slide').css('overflow', 'auto');
                            } else {
                                linkTd.find('.swiper-container').css('overflow', 'hidden');
                                linkTd.find('.swiper-slide').css('overflow', 'hidden');
                            }
                        } else {
                            if (isShowSubReportScrollBar) {
                                linkTd.children('div').css('overflow', 'auto');
                                linkTd.children('div').css('overflow', 'auto');
                            } else {
                                linkTd.children('div').css('overflow', 'hidden');
                                linkTd.children('div').css('overflow', 'hidden');
                            }
                        }
                    }
                    if (names.length > 1) {
                        if (isShowCenterSubReport) {
                            linkTd.find('.swiper-slide').css('align-items', 'center');
                            linkTd.find('.swiper-slide').css('flex-wrap', 'wrap');
                        } else {
                            linkTd.find('.swiper-slide').css('align-items', 'flex-start');
                            linkTd.find('.swiper-slide').css('justify-content', 'center');
                            linkTd.find('.swiper-slide').find('table').css('margin', '0');
                        }
                    } else {
                        if (isShowCenterSubReport) {
                            linkTd.children('div').css('align-items', 'center');
                            linkTd.children('div').css('flex-wrap', 'wrap');
                        } else {
                            linkTd.children('div').css('align-items', 'flex-start');
                            linkTd.children('div').css('justify-content', 'center');
                            linkTd.children('div').find('table').css('margin', '0');
                        }
                    }

                    $.ajaxSettings.async = true;
                }
            }
            return linkRegions;
        },
        /**
         *
         * 区域联动，更新悬浮插件
         *
         * */
        refreshShapes: function (shapesRegion, selfX, selfY, shapeName) {
            let linkShapeNames = [];
            $.each(shapesRegion , function(ii,ee){
                linkShapeNames.push(ee.Name);
            })
            let sheetName; //当前sheet
            //如果sheet工具栏隐藏。说明只有一个sheet页
            if ($('.x-sheet').css('display') == 'none') {
                sheetName = $('.i-sheet').eq(0).attr('st');
            } else {
                sheetName = $('.sheet_ck').eq(0).text();
            }
            sheetName = sheetName.trim();
            $.ajaxSettings.async = false;
            $.getJSON(base + '/report/loadJSON?token=' + token, {//根据模板名和sheetName去后台获取生成的JSON
                serverId: serverId,
                pathId: pathId,
                isSubSheet: 'N',
                file: sheetName,
                page: parseInt(($('#curr').val() == '' || $('#curr').val() == undefined) ? 1 : $('#curr').val()) //页码
            }, function (data) {
                let _Page = data.Pages[0]; //重新生成的JSON数据
                let shapes = _Page.Shapes; //悬浮插件信息
                let repaintArray = JSON.parse(repaintJson);
                // 遍历悬浮插件
                $.each(shapes, function (j, element) {
                    let isLinked = ($.inArray(element.Name, linkShapeNames) != -1); //是否联动区域
                    let isRepaint = ($.inArray(element.Name, repaintArray) != -1); //是否联动
                    let id = randomUUID();
                    //是联动悬浮插件
                    if (isLinked && isRepaint) {
                        let div = $('div[sname="' + element.Name + '"]');
                        if (element.Visible == undefined) { //联动后悬浮元素可见
                            div.show();
                            if (element.HtmlFile == undefined) {
                                div.empty(); //清空原先的悬浮元素
                            }
                            let width = element.Width * globalRatio[0];
                            let height = element.Height * globalRatio[1];
                            let x = element.X * globalRatio[0]; //x轴位置
                            let y = element.Y * globalRatio[1]; //y轴位置
                            let HtmlFile = element.HtmlFile;
                            if (element.HtmlFile != undefined) {//只有插件
                                var borderStyle;
                                if (element.BW != undefined) { //边框
                                    borderStyle = 'border-style:solid;border-width:' + element.BW + 'px;border-color:' + element.BC + ';box-sizing:border-box;';
                                }

                                if (div.length == 0) {//初始化没有页面
                                    html = '<div id="' + id + '" class="shape" type="plugin" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export' + '/' + pathId + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + element.Z + ';"><iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + _home + exportpathApp + '/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>';
                                } else {
                                    let iframe = div.find('iframe')[0]; //找到iframe元素
                                    $.getJSON(base + '/report/loadLinkJSON?token=' + token, {//根据模板名和sheetName去后台获取生成的JSON
                                        serverId: serverId,
                                        pathId: pathId,
                                        file: element.Name,
                                        sheetName:sheetName
                                    } , function (data) {
                                        if(data.state == 'success'){
                                            let type = data.type;
                                            if(type == 1){
                                                if(iframe != undefined){
                                                    iframe.contentWindow.refresh(JSON.parse(data.json));
                                                }else{
                                                    let fileName = data.html;
                                                    let iframeHtml = '<iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base + '/export' + '/' + fileName + '?token=' + token + '" style="width:' + width + 'px;height:' + height + 'px;" frameborder=0 scrolling=no></iframe>';
                                                    div.append(iframeHtml);
                                                }
                                            }else{
                                                if(iframe != undefined){
                                                    $(iframe).attr('src' , base + '/export' + '/' + data.html + '?token=' + token );
                                                }else{
                                                    let fileName = data.html;
                                                    let iframeHtml = '<iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base + '/export' + '/' + fileName + '?token=' + token + '" style="width:' + width + 'px;height:' + height + 'px;" frameborder=0 scrolling=no></iframe>';
                                                    div.append(iframeHtml);
                                                }
                                            }

                                        }

                                    });
                                }
                            } else if (element.SN != undefined) { //子表单
                                let sheetName = element.SN;
                                html = '<table id="_tb_sheet_' + id + '" stable="1" class="x-table" sheetname="' + sheetName + '"style="border-collapse:collapse;border:none;border-spacing:2px;-webkit-border-horizontal-spacing: 2px;'
                                    + '-webkit-border-vertical-spacing: 2px;table-layout: fixed;position:relative;"  cellspacing="0"  cellpadding="0"></table>'
                            } else {
                                //html = '<div class="shape"  sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;">'+ element.text +'</div>'
                                //更新悬浮元素文本
                                html = element.Text;
                            }
                            if (div.length == 0) {
                                $('.x-data-bg_block').append(html);
                            } else {
                                if (element.HtmlFile == undefined) {
                                    $('div[sname="' + element.Name + '"]').append(html);
                                }
                            }
                            if (element.SN != undefined) {
                                $.getJSON(base + "/report/loadJSON?token=" + token, {
                                    serverId: serverId,
                                    pathId: pathId, //模板名
                                    file: element.SN, //子sheet名
                                    isSubSheet: 'Y',
                                    page: parseInt($('#curr').val() == '' ? 1 : $('#curr').val())
                                }, function (data) {
                                    generateShapeSheet("_tb_sheet_" + id, data, element, width, height);
                                });
                            }
                        } else { //联动后悬浮元素不可见
                            div.hide();
                        }

                    }
                });
            });
            $.ajaxSettings.async = true;
        },

        /**
         *
         * 超级链接
         *
         * */
        hyperlink: function (data1, e) {
            if (e != undefined) {
                e.stopPropagation();
            }
            if (data1.length > 1) { //如果有多个超级链接选项
                $('#dsMenu').empty();
                $.each(data1, function (i, e) {
                    let linkName = e.LinkName;
                    $('#dsMenu').append("<li><a onclick='Link.Fn.processHyperLink(" + JSON.stringify(data1) + "," + i + ")'>" + linkName + "</a></li>");
                })
                $("#dsMenu").css({position: 'absolute', left: e.clientX, top: e.clientY}).show();
                $("#dsMenu").unbind().bind('blur', function () {
                    $("#dsMenu").hide();
                })
            } else {
                Link.Fn.processHyperLink(data1, 0);
            }
        },
        processHyperLink: function (data1, index) {
            $('#dsMenu').hide();
            let linkObj = data1[index],
                _templet = linkObj.Templet, //模板名
                _params = linkObj.Params, //参数
                _URL = linkObj.Url,
                _OT = linkObj.OpterationType,
                _WS = linkObj.WindowStyle,
                linkName = linkObj.LinkName;
                let templateId;
                if(linkObj.tempId == null || linkObj.tempId == 'null'){ //通过计算得到的模板ID
                    templateId = _templet;
                }else{
                    templateId = linkObj.tempId;
                }

                selfparam = getParams();//主页面的参数，用于返回后直接查询
            if (3 === _OT) { //sheet页面跳转
                $('.x-sheet').find('li[st="' + linkObj.sheetName + '"]').trigger('click'); //模拟点击按钮事件
                return;
            }
            if (_WS === 2) {//新窗口
                if (1 === _OT) {// 打开模板
                    window.open(base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname);
                } else if (2 === _OT) {// 打开http链接
                    if (_URL.indexOf("http") == -1 && _URL.indexOf("https") == -1) {
                        _URL = "http://" + _URL;
                    }
                    window.open(_URL, linkName);
                } else {
                    throw new Error("Illegal Argument Error");
                }
            } else if (_WS === 1) {//当前窗口
                if (1 === _OT) {//  打开模板
                    location.href = base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname;
                } else if (2 === _OT) {// 打开http链接
                    if (_URL.indexOf("http") == -1 && _URL.indexOf("https") == -1) {
                        _URL = "http://" + _URL;
                    }
                    location.href = _URL;
                } else {
                    throw new Error("Illegal Argument Error");
                }
            } else if (_WS === 3) {//模态窗口

                var width = linkObj.width;
                var height = linkObj.height;

                if (width.indexOf("%") != -1) { //百分比
                    width = width.substring(0, width.length - 1);
                    width = $(window).width() * width / 100;
                } else {
                    width = (parseInt(width) == 0 ? 1 : parseInt(width));
                }

                if (height.indexOf("%") != -1) {
                    height = height.substring(0, height.length - 1);
                    height = $(window).height() * height / 100;
                } else {
                    height = parseInt(height) == 0 ? 1 : parseInt(height);
                }

                if (1 === _OT) {//  打开模板
                    var left = linkObj.left;
                    var top = linkObj.top;
                    let openUrl = base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname;
                    if (left == "" && top == "") { //上和左都没有填，默认居中
                        layer.open({
                            type: 2,
                            title: ['', 'height:1px;'],
                            closeBtn: 2, //不显示关闭按钮
                            shade: [0],
                            area: [width + 'px', height + 'px'],
                            anim: 2,
                            content: [openUrl, 'no'] //iframe的url，no代表不显示滚动条
                        });
                    } else {
                        if (left != "") {
                            if (left.indexOf("%") != -1) { //百分比
                                left = left.substring(0, left.length - 1);
                                left = $(window).width() * left / 100;
                            } else {
                                left = (parseInt(left) == 0 ? 1 : parseInt(left));
                            }
                        } else {
                            left = 1;
                        }
                        if (top != "") {
                            let toolHeight;
                            let paramHeight;
                            if (top.indexOf("%") != -1) {
                                top = top.substring(0, top.length - 1);
                                let isReport = $('#report').css('display') != 'none';

                                if(isReport){
                                    toolHeight = $('#tool').css('display') == 'none' ? 0 : $('#tool').height();
                                    paramHeight = $('#ef-normal-param').css('display') == 'none'?0:$('#ef-normal-param').height();
                                }else{
                                    toolHeight = $('#normal-buttonDiv').css('display') == 'none' ? 0 : $('#normal-buttonDiv').height();
                                    paramHeight = $('#ef-grid-param').css('display') == 'none'?0:$('#ef-grid-param').height();

                                }
                                top = ($(window).height() - toolHeight  - paramHeight ) * top / 100
                            } else {
                                top = parseInt(top) == 0 ? 1: (toolHeight + paramHeight);
                            }
                        } else {
                            top = 1 ;
                        }
                        let openUrl = base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname;
                        layer.open({
                            type: 2,
                            title: ['', 'height:1px;'],
                            closeBtn: 2, //不显示关闭按钮
                            offset: [top, left],
                            shade: [0],
                            area: [width + 'px', height + 'px'],
                            anim: 2,
                            content: [openUrl, 'no'], //iframe的url，no代表不显示滚动条
                            end: function () { //此处用于演示

                            }
                        });
                    }
                } else if (2 === _OT) {// 打开http链接
                    if (_URL.indexOf("http") == -1 && _URL.indexOf("https") == -1) {
                        _URL = "http://" + _URL;
                    }
                    var left = linkObj.left;
                    var top = linkObj.top;
                    if (left == "" && top == "") { //上和左都没有填，默认居中
                        layer.open({
                            type: 2,
                            title: ['', 'height:1px;'],
                            closeBtn: 2, //不显示关闭按钮
                            shade: [0],
                            area: [width + 'px', height + 'px'],
                            anim: 2,
                            content: [_URL, 'no'], //iframe的url，no代表不显示滚动条
                            end: function () { //此处用于演示

                            }
                        });
                    } else {
                        if (left != "") {
                            if (left.indexOf("%") != -1) { //百分比
                                left = left.substring(0, left.length - 1);
                                left = $(window).width() * left / 100;
                            } else {
                                left = (parseInt(left) == 0 ? 1 : parseInt(left));
                            }
                        } else {
                            left = 1;
                        }
                        if (top != "") {
                            let toolHeight;
                            let paramHeight;
                            if (top.indexOf("%") != -1) {
                                top = top.substring(0, top.length - 1);
                                let isReport = $('#report').css('display') != 'none';

                                if(isReport){
                                    toolHeight = $('#tool').css('display') == 'none' ? 0 : $('#tool').height();
                                    paramHeight = $('#ef-normal-param').css('display') == 'none'?0:$('#ef-normal-param').height();
                                }else{
                                    toolHeight = $('#normal-buttonDiv').css('display') == 'none' ? 0 : $('#normal-buttonDiv').height();
                                    paramHeight = $('#ef-grid-param').css('display') == 'none'?0:$('#ef-grid-param').height();

                                }
                                top = ($(window).height() - toolHeight  - paramHeight ) * top / 100
                            } else {
                                top = (parseInt(top) == 0 ? 1 : (toolHeight + paramHeight));
                            }
                        } else {
                            top = 1 ;
                        }
                        layer.open({
                            type: 2,
                            title: ['', 'height:1px;'],
                            closeBtn: 2, //不显示关闭按钮
                            offset: [top, left],
                            shade: [0],
                            area: [width + 'px', height + 'px'],
                            anim: 2,
                            content: [_URL, 'no'], //iframe的url，no代表不显示滚动条
                            end: function () { //此处用于演示
                            }
                        });

                    }

                } else {
                    throw new Error("Illegal Argument Error");
                }
            } else {
                throw new Error("Illegal Argument Error");
            }
            return;
        },
        /**
         * 处理参数
         *
         * */
        processParam: function (params) {
            var paramStr = '';
            //param1=A;param2=B
            var paramArr = params.split(';');
            //[param1=A , param2=B]
            $.each(paramArr, function (i, e) {
                if (i != (paramArr.length - 1)) {
                    var kv = e.split('=');
                    var k = kv[0];//param1
                    var v = kv[1];//A
                    //更新paramMap里面的值
                    paramMap[k] = v;
                }
            });

            $.each(paramMap, function (i) {
                var key = i;
                var value = paramMap[i];
                paramStr += (key + "=" + value + ";");
            });
            return paramStr;
        },
        layerOpen: function (width, height, url) {
            //当前模板允许双击全屏
            if (allowPluginFullScreen) {
                if(width == null){ //form表单模式下
                    width = $('body').width() - 10;
                    height = $('body').height() - 10;
                    if ($('.layui-layer-iframe').length == 0) {
                        layer.open({
                            type: 2,
                            title: false,
                            closeBtn: 1, //不显示关闭按钮
                            shade: [0],
                            area: [width + 'px', height + 'px'],
                            anim: 2,
                            content: [url, 'no'], //iframe的url，no代表不显示滚动条
                            success: function () {
                                $('.layui-layer-content').find('iframe').css('background-color', bKColorPluginFullScreen);
                            }
                        });
                    }
                }else{
                    if ($('.layui-layer-iframe').length == 0) {
                        layer.open({
                            type: 2,
                            title: false,
                            closeBtn: 1, //不显示关闭按钮
                            shade: [0],
                            area: [width + 'px', height + 'px'],
                            anim: 2,
                            content: [url, 'no'], //iframe的url，no代表不显示滚动条
                            success: function () {
                                $('.layui-layer-content').find('iframe').css('background-color', bKColorPluginFullScreen);
                            }
                        });
                    }
                }

            }


        },
        dateLink: function (fmt, obj) {
            //获取事件输入框
            var input = $(obj);
            //获取父DIV的ID
            var div = input.parent();
            var id = div.attr('id');
            //获取缓存里面的联动信息
            var dateRegion = sessionStorage.getItem(id);
            if (fmt == 1) {
                fmt = 'yyyy-MM-dd HH:mm:ss';
            } else {
                fmt = 'yyyy-MM-dd';
            }
            WdatePicker({
                dateFmt: fmt,
                readOnly: true,
                onpicked: function (dp) {
                    Link.Fn.regionLink(dp, 6, dateRegion)
                }
            })
        }
    }
}