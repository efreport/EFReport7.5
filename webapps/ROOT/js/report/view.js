/**
 * 解析JSON数据，渲染页面数据
 *
 * @param {String} oid table标签的id属性值
 */
function render(oid) {

    //获取当前sheet页面的数据总页数
    var obj = $("#" + oid);
    obj.hide();
    //执行加载页面的回调JS

    if (__data.SheetInfos == undefined) {
        return;
    }

    for (var i = 0; i < __data.SheetInfos.length; i++) {
        if (obj.attr("sheetname") == __data.SheetInfos[i].SheetName) {
            initPageInfo(__data.SheetInfos[i]);
            break;
        }
    }
    var _Page = __data.Pages[0],
        _Rows = _Page.Rows,
        _Columns = _Page.Columns;

    colorList = __data.ColorList; //颜色列表
    fontList = __data.FontList; //字体列表

    obj.html(Report.RV.initMainTableHTML(_Rows, _Columns, oid, true));


    var $table = obj,
        tableWidth = $table.width(),
        $menubar = $(".x-menubar"),
        menuBarHeight = ($menubar.is(":hidden") ? 0 : $menubar.height());


    Report.RV.frozenTable(_Page, _Columns, _Rows, obj, oid);

    if (__data.ChartTheme) {
        theme = __data.ChartTheme;
    }

    if (1 == _gudaf) { //是否允许数据上传
        Report.GI.initUploadInfo(__data); //初始化uploadInfo
    }

    // 渲染单元格
    $.each(_Page.Cells, function (i, cell) {
        var cellProp = cell.N; //单元格属性
        var tdId = oid + "_" + cellProp[1] + "_" + cellProp[0];
        var td = $('#' + tdId);
        td.css("overflow-x", "hidden");
        td.css("overflow-y", "hidden");//whj
        //修改span的高度和宽度
        var tdWidth = td.attr("ow");  //获取td的宽度 whj
        var tdHeight = td.attr("oh"); //获取td的高度 whj
        if (__data.WebCellPercent === 1) { //如果是自适应
            //计算上边框的宽度
            if (cellProp[6] * mainRatio[1] < 1) {
                cellProp[6] = 1; //高度最少为1
            } else {
                cellProp[6] = Math.floor(cellProp[6] * mainRatio[1]);
            }
            //计算下边框的宽度
            if (cellProp[12] * mainRatio[1] < 1) {
                cellProp[12] = 1; //高度最少为1
            } else {
                cellProp[12] = Math.floor(cellProp[11] * mainRatio[1]);
            }
            //计算左边框的宽度
            if (cellProp[3] * mainRatio[0] < 1) {
                cellProp[3] = 1;
            } else {
                cellProp[3] = Math.floor(cellProp[3] * mainRatio[0]);
            }
            //计算右边框的宽度
            if (cellProp[9] * mainRatio[0] < 1) {
                cellProp[9] = 1;
            } else {
                cellProp[9] = Math.floor(cellProp[9] * mainRatio[0]);
            }


            if (cellProp[1] == 1) { //对于第一行，判断上下边框，如果上下边框都有，td高度减2，如果只有一边td高度减1，否则不处理
                tdHeight = tdHeight - cellProp[12] - cellProp[6];
            } else { //对于后面的行，只判断是否有下边框，如果有，td高度减1
                tdHeight = tdHeight - cellProp[12];
            }

            //whj
            if (cellProp[0] == 1) { //对于第一列，判断左右边框，如果左右边框都有，td宽度减去左右边框的宽度，如果只有一边td宽度减右边宽度，否则不处理
                tdWidth = tdWidth - cellProp[3] - cellProp[9];
            } else { //对于后面的行，只判断是否有右边框，如果有，td高度减1
                tdWidth = tdWidth - cellProp[9];
            }

            if (cellProp[15] != undefined) {
                cellProp[15] = parseInt(cellProp[15] * mainRatio[0]);
            }

        } else {
            if (!(_Page.hasOwnProperty("FixRowCount") && _Page.hasOwnProperty("FixColumnCount"))) {
                //解决由于有td有上下border导致tr的实际高度比赋值高度大1的问题 whj
                tdHeight = tdHeight - (cellProp[12] > cellProp[6] ? cellProp[12] : cellProp[6]);
            }

        }

        if (cell.hasOwnProperty("IsShowSubReportScrollBar")) { //子表单是否有滚动条
            td.attr("IsShowSubReportScrollBar", cell.IsShowSubReportScrollBar);
        }

        if (cell.hasOwnProperty("IsShowCenterSubReport")) { //子表单是否居中显示
            td.attr("IsShowCenterSubReport", cell.IsShowCenterSubReport);
        }

        if (cell.hasOwnProperty("IsSubReportCellPercent")) { //子表单是否有滚动条
            td.attr("IsSubReportCellPercent", cell.IsSubReportCellPercent);
        }

        if (cell.hasOwnProperty("IsSubReportKeepHVRatio")) { //子表单是否居中显示
            td.attr("IsSubReportKeepHVRatio", cell.IsSubReportKeepHVRatio);
        }

        if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
            td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe id="fra" src="' + _home + exportpathApp + '/' + cell.HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span>');
        } else { //设置文本
            td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;word-break:break-word;">' + (cell.T == undefined ? "" : cell.T) + '</span>');
        }
        Report.RV.setTableCellStyle(td, cell, _Rows.RowArray, null, obj.attr("sheetname"), oid);
        Report.RV.switchFold(td, cell, oid);
        Report.RV.fillRFT(td, cell, obj.attr("sheetname"), oid);
        if (1 == _gudaf) {
            Report.RV.drawUpdateDataWidget(td, cell, __data, false, obj.attr("sheetname"));
        }
    });
    var tb = $("table[sheetname='" + obj.attr("sheetname") + "']");
    boundingEvent(tb);
    boundUpdate(tb);
    // 删除空白行
    //obj.find("tr:empty").remove();
    displayUpdateDataButton(__data);
    //填报不显示分页
    if (!isUpload) {
        $(".page").css({"display": "inline"}).show();
    }
    // 设置背景颜色
    if (__data.hasOwnProperty("WebBKColor")) { //whj
        $('body').css("background-color", __data.WebBKColor);
        $('.x-data-bg').css("background-color", __data.WebBKColor); //whj
    }
    if (__data.hasOwnProperty("WebBKImage")) { //背景图片和背景色互斥，如果有背景图片，需要将背景色去掉
        bgImg = __data.WebBKImage.split("/");
        $table.parent().css({
            "background-image": "url('" + (_home + exportpathApp + "/" + bgImg[bgImg.length - 2]) + "/" + bgImg[bgImg.length - 1] + "')",
            "background-repeat": "no-repeat",
            "background-position": "0 0",
            "background-size": "100% 100%",
            "background-color": ""
        });
    }



    if (1 === __data.WebCellPercent) {
        if (!__data.KeepHVRatio) {
            $('.x-table').css('overflow', 'hidden');
        }
    }
    //页面加载事件：：回调模板设置的JS
    if (loadJsFlag) {
        Report.GI.excuteFunc(__data.ModelJS);
        loadJsFlag = false;
    }

    // 是否显示工具条
    if (__data.ShowToolBar) {
        if ($("#_field_").is(":hidden")) {
            $("#pagination").css("top", "0px");
        }
        $("#pagination").css("top", $("#_field_").height()).show();
        $(".ef-nav").hover(function () {
            $(".x-menubar").css("overflow", "visible");
            $(".ef-nav-child").show();
        }, function () {
            $(".x-menubar").css("overflow", "hidden");
            $(".ef-nav-child").hide();
        });
    }
    obj.show();

    Report.RV.setBounds();

    if (_Page.hasOwnProperty("FixRowCount") && _Page.hasOwnProperty("FixColumnCount")) { //固定行列属性
        if (_Page.FixRowCount > 0 && _Page.FixColumnCount > 0) {
            $('.x-data-bg').css("overflow", "hidden"); //如果有固定行列，包裹容器不应出现滚动条
            menuBarHeight = ($menubar.is(":hidden") ? 0 : $menubar.height());
            $(window).resize(function () {
                Report.RV.setBounds();
                var ht = $("body").height() - 1 - menuBarHeight - $(".x-sheet").height() - $("div.top-left-fixed-container").actual("height");
                var wt = $("body").width() - 1 - $("div.top-left-fixed-container").actual("width", {clone: true});
                $("div.bottom-left-scroll-container, div.main-container").css({"height": ht});
                $("div.top-right-scroll-container, div.main-container").css({"width": wt});
                $(".main-container").css('overflow', 'scroll');

                var showPTB = __data.ShowParamToolBar;
                if (showPTB) { //显示参数工具栏
                    if ($('.main-container').height() + $('.top-right-scroll-container').height() > $('.x-panel').height() + 3) { //如果内容高度大于外层容器高度
                        $('.bottom-left-scroll-container').css("height", $('.bottom-left-scroll-container').height() - 44);
                        $('.main-container').css("height", $('.main-container').height() - 44);
                    }

                }

            });
            $(window).resize();

            var blsc = $(".bottom-left-scroll-container"),
                trsc = $(".top-right-scroll-container"),
                mc = $(".main-container");

            mc.on("scroll", function (delta, deltaX, deltaY) {
                trsc.scrollLeft(mc.scrollLeft());
                blsc.scrollTop(mc.scrollTop());
            });

        }
    }

    if (_Page.FixRowCount > 0 && _Page.FixColumnCount > 0) {
        adjustFrozen();
    }


    var shapes = __data.Shapes;
    if (shapes != undefined) { //解析悬浮元素
        Report.DW.drawShapes(shapes);
    }
}

function adjustFrozen() {

    $.each(rtIds, function (index, elem) { // 固定行列时，左上方table宽度会比右下方table宽度小，导致该现象的原因是因为左上方table的td宽度包含了border
        var td = $('#' + elem); //获取TD
        if (td.attr('colspan') == undefined) {//非合并单元格
            if (td.css('border-left-width') == '0px' && td.css('border-left-width') == '0px') {
                td.css('border-left', '1px solid white')
                td.css('border-right', '1px solid white')
            } else if (td.css('border-left-width') == 0 || td.css('border-left-width') == 0) {
                var span = td.find('span');
                td.css('border-left', '1px solid white')
            } else {
            }
        } else {
        }
    });

    $.each(lbIds, function (index, elem) { //固定行列时，左下方的table高度会比右下方table高度小，导致该现象的原因是因为合并时的高度并未包含border的高度
        var td = $('#' + elem); //获取TD
        if (td.attr('rowspan') != undefined) {//非合并单元格
            td.css('height', td.height() + (parseInt(td.attr('rowspan'))));
        }
    })


    var showPTB = __data.ShowParamToolBar;
    if (showPTB) { //显示参数工具栏
        if ($('.main-container').height() + $('.top-right-scroll-container').height() > $('.x-panel').height() + 3) { //如果内容高度大于外层容器高度
            $('.bottom-left-scroll-container').css("height", $('.bottom-left-scroll-container').height() - 44);
            $('.main-container').css("height", $('.main-container').height() - 44);
        }

    }
}

/*function refresh(oid) {
 var orgiData =  backData;
 //获取当前sheet页面的数据总页数
 var obj = $("#" + oid);
 obj.empty();
 $('.shape').remove(); //删除所有的浮动元素
 obj.hide();
 //执行加载页面的回调JS

 if(orgiData.SheetInfos == undefined){
 return;
 }

 for (var i = 0; i < backData.SheetInfos.length; i++) {
 if (obj.attr("sheetname") == orgiData.SheetInfos[i].SheetName) {
 initPageInfo(orgiData.SheetInfos[i]);
 break;
 }
 }
 var _Page = orgiData.Pages[0],
 _Rows = _Page.Rows,
 _Columns = _Page.Columns;

 colorList = orgiData.ColorList; //颜色列表
 fontList = orgiData.FontList; //字体列表

 obj.html(Report.RV.initMainTableHTML(_Rows, _Columns , oid , false));


 var $table = obj,
 tableWidth = $table.width(),
 $menubar = $(".x-menubar"),
 menuBarHeight = ($menubar.is(":hidden") ? 0 : $menubar.height());


 Report.RV.frozenTable(_Page, _Columns, _Rows, obj , oid);

 if (orgiData.ChartTheme) {
 theme = __data.ChartTheme;
 }

 if (1 == _gudaf) { //是否允许数据上传
 Report.GI.initUploadInfo(orgiData); //初始化uploadInfo
 }

 // 渲染单元格
 $.each(_Page.Cells, function (i, cell) {
 var cellProp = cell.N; //单元格属性
 var tdId =  oid + "_" + cellProp[1] + "_" + cellProp[0];
 var td = $('#' + tdId);
 td.css("overflow-x", "hidden");
 td.css("overflow-y", "hidden");//whj
 //修改span的高度和宽度
 var tdWidth = td.attr("ow");  //获取td的宽度 whj
 var tdHeight = td.attr("oh"); //获取td的高度 whj
 if (orgiData.WebCellPercent === 1) { //如果是自适应
 //计算上边框的宽度
 if (cellProp[6] * mainRatio[1] < 1) {
 cellProp[6] = 1; //高度最少为1
 } else {
 cellProp[6] = Math.floor(cellProp[6] * mainRatio[1]);
 }
 //计算下边框的宽度
 if (cellProp[12] * mainRatio[1] < 1) {
 cellProp[12] = 1; //高度最少为1
 } else {
 cellProp[12] = Math.floor(cellProp[11] * mainRatio[1]);
 }
 //计算左边框的宽度
 if (cellProp[3] * mainRatio[0] < 1) {
 cellProp[3] = 1;
 } else {
 cellProp[3] = Math.floor(cellProp[3] * mainRatio[0]);
 }
 //计算右边框的宽度
 if (cellProp[9] * mainRatio[0] < 1) {
 cellProp[9] = 1;
 } else {
 cellProp[9] = Math.floor(cellProp[9] * mainRatio[0]);
 }


 if (cellProp[1] == 1) { //对于第一行，判断上下边框，如果上下边框都有，td高度减2，如果只有一边td高度减1，否则不处理
 tdHeight = tdHeight - cellProp[12] - cellProp[6];
 } else { //对于后面的行，只判断是否有下边框，如果有，td高度减1
 tdHeight = tdHeight - cellProp[12];
 }

 //whj
 if (cellProp[0] == 1) { //对于第一列，判断左右边框，如果左右边框都有，td宽度减去左右边框的宽度，如果只有一边td宽度减右边宽度，否则不处理
 tdWidth = tdWidth - cellProp[3] - cellProp[9];
 } else { //对于后面的行，只判断是否有右边框，如果有，td高度减1
 tdWidth = tdWidth - cellProp[9];
 }

 if(cellProp[15] != undefined){
 cellProp[15] = parseInt(cellProp[15] * mainRatio[0]);
 }

 } else {
 //解决由于有td有上下border导致tr的实际高度比赋值高度大1的问题 whj
 //tdHeight = tdHeight - (cellProp[12] > cellProp[6] ? cellProp[12] : cellProp[6]);
 }

 if (cell.hasOwnProperty("IsShowSubReportScrollBar")) { //子表单是否有滚动条
 td.attr("IsShowSubReportScrollBar", cell.IsShowSubReportScrollBar);
 }

 if (cell.hasOwnProperty("IsShowCenterSubReport")) { //子表单是否居中显示
 td.attr("IsShowCenterSubReport", cell.IsShowCenterSubReport);
 }

 if (cell.hasOwnProperty("IsSubReportCellPercent")) { //子表单是否有滚动条
 td.attr("IsSubReportCellPercent", cell.IsSubReportCellPercent);
 }

 if (cell.hasOwnProperty("IsSubReportKeepHVRatio")) { //子表单是否居中显示
 td.attr("IsSubReportKeepHVRatio", cell.IsSubReportKeepHVRatio);
 }

 if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
 td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe id="fra" src="' + _home + exportpathApp + '/' + cell.HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span>');
 } else { //设置文本
 td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;word-break:break-word;">' + (cell.T == undefined?"":cell.T) + '</span>');
 }
 Report.RV.rSetTableCellStyle(td, cell, _Rows.RowArray, null, obj.attr("sheetname") , oid);
 Report.RV.switchFold(td, cell , oid);
 Report.RV.fillRFT(td, cell, obj.attr("sheetname") , oid);
 if (1 == _gudaf) {
 Report.RV.drawUpdateDataWidget(td, cell, orgiData, false, obj.attr("sheetname"));
 }

 });
 var tb = $("table[sheetname='" + obj.attr("sheetname") + "']");
 boundingEvent(tb);
 boundUpdate(tb);
 // 删除空白行
 //obj.find("tr:empty").remove();
 displayUpdateDataButton(orgiData);
 //填报不显示分页
 if (!isUpload) {
 $(".page").css({"display": "inline"}).show();
 }
 // 设置背景颜色
 if (__data.hasOwnProperty("WebBKColor")) { //whj
 $('body').css("background-color", orgiData.WebBKColor);
 $('.x-data-bg').css("background-color", orgiData.WebBKColor); //whj
 }
 if (__data.hasOwnProperty("WebBKImage")) { //背景图片和背景色互斥，如果有背景图片，需要将背景色去掉
 bgImg = backData.WebBKImage.split("/");
 $table.parent().css({
 "background-image": "url('" + (_home + exportpathApp + "/" + bgImg[bgImg.length - 2]) + "/" + bgImg[bgImg.length - 1] + "')",
 "background-repeat": "no-repeat",
 "background-position": "0 0",
 "background-size": "100% 100%",
 "background-color": ""
 });
 }
 window.clearInterval(interVal);
 if (orgiData.RepaintInterval > 0) {
 interVal = setInterval(function () {
 search();
 }, 1000 * orgiData.RepaintInterval); //区域刷新
 } else {
 var modelRepaintRegions = backData.ModelRepaintRegions; //区域刷新
 if (modelRepaintRegions != undefined) {
 var info = JSON.parse(modelRepaintRegions);
 if (info.regions != undefined && info.Interval != undefined)
 interVal = setInterval(function () {
 searchByArea(info.regions);
 }, 1000 * info.Interval); //区域刷新
 }
 }


 if (1 === orgiData.WebCellPercent) {
 if (!orgiData.KeepHVRatio) {
 $('.x-table').css('overflow', 'hidden');
 }
 }
 //页面加载事件：：回调模板设置的JS
 Report.GI.excuteFunc(orgiData.ModelJS);
 // 是否显示工具条
 if (orgiData.ShowToolBar) {
 if ($("#_field_").is(":hidden")) {
 $("#pagination").css("top", "0px");
 }
 $("#pagination").css("top", $("#_field_").height()).show();
 $(".ef-nav").hover(function () {
 $(".x-menubar").css("overflow", "visible");
 $(".ef-nav-child").show();
 }, function () {
 $(".x-menubar").css("overflow", "hidden");
 $(".ef-nav-child").hide();
 });
 }
 obj.show();

 Report.RV.setBounds();

 if (_Page.hasOwnProperty("FixRowCount") && _Page.hasOwnProperty("FixColumnCount")) { //固定行列属性
 if (_Page.FixRowCount > 0 && _Page.FixColumnCount > 0) {
 $('.x-data-bg').css("overflow", "hidden"); //如果有固定行列，包裹容器不应出现滚动条
 menuBarHeight = ($menubar.is(":hidden") ? 0 : $menubar.height());
 $(window).resize(function () {
 Report.RV.setBounds();
 var ht = $("body").height() - 1 - menuBarHeight - $(".x-sheet").height() - $("div.top-left-fixed-container").actual("height");
 var wt = $("body").width() - 1 - $("div.top-left-fixed-container").actual("width", {clone: true});
 $("div.bottom-left-scroll-container, div.main-container").css({"height": ht});
 $("div.top-right-scroll-container, div.main-container").css({"width": wt});
 $(".main-container").css('overflow' , 'scroll');
 });
 //$(window).resize();

 var blsc = $(".bottom-left-scroll-container"),
 trsc = $(".top-right-scroll-container"),
 mc = $(".main-container");

 mc.on("scroll", function (delta, deltaX, deltaY) {
 trsc.scrollLeft(mc.scrollLeft());
 blsc.scrollTop(mc.scrollTop());
 });

 }
 }

 var shapes = orgiData.Shapes;
 if (shapes != undefined) { //解析悬浮元素
 Report.DW.drawShapes(shapes);
 }


 }*/


function renderByArea(oid, info) {
    //获取当前sheet页面的数据总页数
    var obj = $("#" + oid);

    var _Page = __data.Pages[0],
        _Rows = _Page.Rows;
    var $table = obj;


    // 渲染单元格
    $.each(_Page.Cells, function (i, cell) {
        var props = cell.N;
        var x = props[0], y = props[1];
        var tdId = oid + "_" + y + "_" + x;
        $.each(info, function (i, ele) { //遍历自动刷新区域

            if (ele.x == x && ele.y == y) {
                var td = $('#' + tdId); //区域刷新ID
                var tdWidth = td.attr("ow");  //获取td的宽度 whj
                var tdHeight = td.attr("oh"); //获取td的高度 whj

                if (__data.WebCellPercent === 1) { //如果是自适应 ， 需要重新计算边框和字体
                    //计算上边框的宽度
                    if (props[6] * mainRatio[1] < 1) {
                        props[6] = 1; //高度最少为1
                    } else {
                        props[6] = Math.floor(props[6] * mainRatio[1]);
                    }
                    //计算下边框的宽度
                    if (props[12] * mainRatio[1] < 1) {
                        props[12] = 1; //高度最少为1
                    } else {
                        props[12] = Math.floor(props[11] * mainRatio[1]);
                    }
                    //计算左边框的宽度
                    if (props[3] * mainRatio[0] < 1) {
                        props[3] = 1;
                    } else {
                        props[3] = Math.floor(props[3] * mainRatio[0]);
                    }
                    //计算右边框的宽度
                    if (props[9] * mainRatio[0] < 1) {
                        props[9] = 1;
                    } else {
                        props[9] = Math.floor(props[9] * mainRatio[0]);
                    }
                    if (props[1] == 1) { //对于第一行，判断上下边框，如果上下边框都有，td高度减2，如果只有一边td高度减1，否则不处理
                        tdHeight = tdHeight - props[12] - props[6];
                    } else { //对于后面的行，只判断是否有下边框，如果有，td高度减1
                        tdHeight = tdHeight - props[12];
                    }

                    //whj
                    if (props[0] == 1) { //对于第一列，判断左右边框，如果左右边框都有，td宽度减去左右边框的宽度，如果只有一边td宽度减右边宽度，否则不处理
                        tdWidth = tdWidth - props[3] - props[9];
                    } else { //对于后面的行，只判断是否有右边框，如果有，td高度减1
                        tdWidth = tdWidth - props[9];
                    }

                    if (props[15] != undefined) {
                        props[15] = parseInt(props[15] * mainRatio[0]);
                    }

                } else {
                    //解决由于有td有上下border导致tr的实际高度比赋值高度大1的问题 whj
                    tdHeight = tdHeight - (props[12] > props[6] ? props[12] : props[6]);
                }

                if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
                    td.empty();
                    td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe id="fra" src="' + _home + exportpathApp + '/' + cell.HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span>');
                } else { //设置文本
                    td.empty();
                    td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;word-break:break-word;">' + cell.T + '</span>');
                }
                Report.RV.setTableCellStyle(td, cell, _Rows.RowArray, null, obj.attr("sheetname"), oid);
                Report.RV.switchFold(td, cell, oid);
                Report.RV.fillRFT(td, cell, obj.attr("sheetname"), oid);
                if (1 == _gudaf) {
                    Report.RV.drawUpdateDataWidget(td, cell, __data, false, obj.attr("sheetname"));
                }
            }

        });

    });
}

function initPageInfo(sheetInfo) {
    var curPage = getPage(sheetInfo.SheetName);
    curPage.pageCount = sheetInfo.PageCount;
    if (sheetInfo.SheetName == getCurrentSheetName()) {
        setPageInfo(getCurrentPageInfo());
    }
}

/**
 * 绘制内嵌套表格
 *
 * @param {String} divClassName 内部 DIV 元素的 class 属性值
 * @param {Number} rowStart     开始行
 * @param {Number} rowEnd       终止行
 * @param {Number} columnStart  开始列
 * @param {Number} columnEnd    终止列
 * @param {Array}  cells        单元格宽度数组
 * @param {Array}  rows         行高度数组
 *
 * @return {String} 表格字符串
 */
function initNestTable(divClassName, rowStart, rowEnd, columnStart, columnEnd, cells, rows, oid) {
    //lbIds = [];
    //rtIds = [];
    var html = '<div class="' + divClassName + '"><table class="x-table"';
    if ('top-right-scroll-container' === divClassName) {
        html += ' style="table-layout: auto;">';
    } else {
        html += '>';
    }
    for (var i = rowStart; i <= rowEnd; i++) {
        html += '<tr oh="' + rows.RowArray[i - 1].H + '" style="height: ' + rows.RowArray[i - 1].H + 'px;">';
        for (var j = columnStart; j <= columnEnd; j++) {
            // 固定行列，处理列重叠问题
            /*if ('top-right-scroll-container' === divClassName && rowStart === i) {
             html += '<td id="'+ oid +'_' + i + '_' + j + '" oh="' + rows.RowArray[i - 1].H + '" ow="' + (cells.ColumnArray[j - 1].W + 1) + '" style="width: ' + (cells.ColumnArray[j - 1].W + 1) + 'px;"></td>';
             } else*/
            {
                html += '<td id="' + oid + '_' + i + '_' + j + '" oh="' + rows.RowArray[i - 1].H + '" ow="' + cells.ColumnArray[j - 1].W + '" style="width: ' + cells.ColumnArray[j - 1].W + 'px;"></td>';
                if (divClassName == 'bottom-left-scroll-container' && j == columnEnd) { //左下DIV
                    lbIds.push(oid + "_" + i + "_" + j); //初始化ID集合
                }
            }

            if (divClassName == 'top-right-scroll-container' && i == rowEnd) {
                rtIds.push(oid + "_" + i + "_" + j); //初始化ID集合
            }

        }
        html += '</tr>';
    }
    html += '</table></div>';

    return html;
}

/**
 * 控制行展开(合并)
 *
 * @param {Element} e 当前触发事件元素
 */
function doRowSwitch(e, oid) {
    var ele = $(e);
    if (ele.html() === "+") {
        ele.html("-");
        ele.attr("title", "合并");
        var arr = [];
        for (var i = parseInt(ele.attr("RetractBeginRow")); i <= parseInt(ele.attr("RetractEndRow")); i++) {//遍历管理的所有行
            var tr = $("#" + oid + "_r_" + i); //tr
            tr.show();//先显示行
            tr.attr('pId', ele.attr('id'));
            var a = tr.find('a[class="switch"]'); //找到所有有折叠属性的a
            if (a.length > 0) { //添加到折叠数组
                arr.push(a);
            }
        }
        $.each(arr, function (index, element) { //遍历折叠数组
            tr.show();//显示自己
            if ($(element).attr('isFold') == undefined) { //初始化没有展开属性，统一默认折叠
                for (var j = parseInt(element.attr("RetractBeginRow")); j <= parseInt(element.attr("RetractEndRow")); j++) {
                    var tr1 = $("#" + oid + "_r_" + j); //tr
                    tr1.hide();
                }
            } else {
                if ($(element).attr('isFold') == 'Y') { //如果为展开属性，不做任何操作，因为前面已经展开
                    //$(element).trigger('click');
                } else {//如果为折叠属性，需要隐藏前面已经展开的属性
                    for (var j = parseInt(element.attr("RetractBeginRow")); j <= parseInt(element.attr("RetractEndRow")); j++) {
                        var tr1 = $("#" + oid + "_r_" + j); //tr
                        tr1.hide();
                    }//遍历管理的所有行
                }
            }
        })

        var td = ele.parent().parent();

        if (td.attr('isg') == 1 && isNaN(td.attr('rowspan')) != true) {
            ele.parent().parent().attr("rowspan", (parseInt(ele.parent().parent().attr("rowspan")) + (i - parseInt(ele.attr("RetractBeginRow")))));
        }
        //标记展开属性
        ele.attr("isFold", "Y");

    } else {
        ele.html("+");
        ele.attr("title", "展开");
        var height;
        for (var i = parseInt(ele.attr("RetractBeginRow")); i <= parseInt(ele.attr("RetractEndRow")); i++) {
            if (i == parseInt(ele.attr("RetractBeginRow"))) {
                height = $("#" + oid + "_r_" + i).height();
            }
            $("#" + oid + "_r_" + i).hide();

        }
        //ele.parent().attr("rowspan", (parseInt(ele.parent().attr("rowspan")) - (i - parseInt(ele.attr("RetractBeginRow")))));
        var td = ele.parent().parent();
        if (td.attr('isg') == 1 && isNaN(td.attr('rowspan')) != true) {
            ele.parent().parent().attr("rowspan", 1);
            ele.parent().parent().css("height", height); //手动修改td的高度
            ele.parent().parent().find("span").eq(0).css("height", height); //手动修改td里面span的高度
        }
        //标记折叠属性
        ele.attr('isFold', 'N');

    }
}

/**
 * 控制列展开(合并)
 *
 * @param {Element} e 当前触发事件元素
 */
function doColumnSwitch(e, oid) {
    var ele = $(e);
    if (ele.html() === "+") {
        ele.html("-");
        ele.attr("title", "合并");
        for (var i = parseInt(ele.attr("RetractBeginCol")); i <= parseInt(ele.attr("RetractEndCol")); i++) {
            $("td[idx=" + i + "]").show();
        }
        ele.parent().parent().attr("colspan", (parseInt(ele.parent().parent().attr("colspan")) + (i - parseInt(ele.attr("RetractBeginCol")))));
    } else {
        ele.html("+");
        ele.attr("title", "展开");
        var width;
        for (var i = parseInt(ele.attr("RetractBeginCol")); i <= parseInt(ele.attr("RetractEndCol")); i++) {
            if (i == parseInt(ele.attr("RetractBeginCol"))) {
                width = $("td[idx=" + i + "]").width();
            }
            $("td[idx=" + i + "]").hide();
        }
        //ele.parent().attr("colspan", (parseInt(ele.parent().attr("colspan")) - (i - parseInt(ele.attr("RetractBeginCol")))));
        ele.parent().parent().attr("colspan", 1);
        ele.parent().parent().css("width", width); //手动修改td的高度
        ele.parent().parent().find("span").eq(0).css("width", width); //手动修改td里面span的高度
    }
}

/**
 * 解析子报表 JSON 数据
 *
 * @param {Element} elem       单元格容器元素
 * @param {Object}  data       json对象
 * @param {String}  swwiper    轮播容器ID
 * @param {Number}  index      下标
 * @param {String}  sheetName  报表名称
 * @param {String}  psheetname Sheet名称
 */
function
renderSubSheet(elem, data, swiper, index, sheetName, psheetname, isSubReportCellPercent, isSubReportKeepHVRatio, width, height) {

    //var _id_ = !!!swiper ? elem.attr("id") : (elem.attr("id") + "_" + index), //当前单元格ID
    var _id_ = elem.attr("id") + '_' + index,
        _html = "<table id='" + _id_ + "_content_' style='margin: auto; border: 0; border-collapse: collapse; border-spacing: 0;' index='" + index + "' sheetname='" + sheetName + "'>", //子报表ID _id_ + "_content_"
        _Page = data.Pages[0],
        _Rows = _Page.Rows,
        _Columns = _Page.Columns,
        i = 0,
        j = 0,
        subTbId = _id_ + "_content_",
        subColorList = data.ColorList, //子报表颜色索引
        subFontList = data.FontList,  //子报表字体索引
        radios = [1, 1];

    if (1 === __data.WebCellPercent) { //父报表是否自适应
        if (isSubReportCellPercent) {//子报表自适应，需要重新计算高度和宽度
            radios = Report.RV.reCalSubTableWidthAndHeight(elem, data, isSubReportKeepHVRatio);
        } else {
            radios = [1, 1];
        }
    } else { //如果父报表非自适应
        if (isSubReportCellPercent) {//子报表自适应
            radios = Report.RV.reCalSubTableWidthAndHeight(elem, data, isSubReportKeepHVRatio);
        }
    }


    for (i = 0; i < _Rows.Count; i++) {
        _html += "<tr style='height: " + _Rows.RowArray[i].H + "px;" + (0 === _Rows.RowArray[i].H ? "display: none;" : "") + "' id='" + subTbId + "r_" + (i + 1) + "'>";
        for (j = 0; j < _Columns.Count; j++) {
            //whj 渲染子报表时，为span添加高度和宽度
            _html += "<td hr='" + radios[0] + "' vr='" + radios[1] + "' oh='" + _Rows.RowArray[i].H + "' ow='" + _Columns.ColumnArray[j].W + "' style='padding:0px;width: " + _Columns.ColumnArray[j].W + "px;height:" + _Rows.RowArray[i].H + "px;" + (0 === _Columns.ColumnArray[j].W ? "display: none;" : "") + "' id='" + subTbId + (i + 1) + "_" + (j + 1) + "' idx='" + subTbId + (j - 0 + 1) + "'><span style='width: " + _Columns.ColumnArray[j].W + "px; height:" + _Rows.RowArray[i].H + "px;display:flex;overflow:hidden;'></span></td>";
        }
        _html += "</tr>";
    }
    _html += "</table>";
    if (swiper) {
        if (1 === __data.WebCellPercent) { //如果保持自适应，不会出现横向滚动条 whj
            swiper.append("<div class='swiper-slide' style='overflow-x:hidden;overflow-y:auto;margin: 0 auto'>" + _html + "</div>");
        } else {
            swiper.append("<div class='swiper-slide' style='overflow: auto;margin: 0 auto'>" + _html + "</div>");
        }

    } else {
        elem.html(_html);
    }
    // 渲染单元格
    $.each(_Page.Cells, function (i, cell) {
        var props = cell.N;
        var table = $("table[sheetname='" + sheetName + "']");
        var tdId = table.attr('id') + props[1] + "_" + props[0];
        var td = $("#" + tdId);
        td.css("overflow-x", "hidden");
        td.css("overflow-y", "hidden"); //whj

        var tdWidth = td.attr("ow");  //获取td的宽度 whj
        var tdHeight = td.attr("oh"); //获取td的高度 whj

        if (1 === __data.WebCellPercent) { //处理单元格边框
            //计算左边框线
            props[3] = props[3] * mainRatio[0];
            if (props[3] * mainRatio[0] < 1) {
                props[3] = 1;
            } else {
                props[3] = Math.floor(props[3] * mainRatio[0]);
            }
            //计算上边框线
            props[6] = props[6] * mainRatio[0];
            if (props[6] * mainRatio[0] < 1) {
                props[6] = 1;
            } else {
                props[6] = Math.floor(props[6] * mainRatio[0]);
            }

            //计算右边框线
            props[9] = props[9] * mainRatio[0];
            if (props[9] * mainRatio[0] < 1) {
                props[9] = 1;
            } else {
                props[9] = Math.floor(props[9] * mainRatio[0]);
            }

            //计算下边框线
            props[12] = props[12] * mainRatio[0];
            if (props[12] * mainRatio[0] < 1) {
                props[12] = 1;
            } else {
                props[12] = Math.floor(props[12] * mainRatio[0]);
            }

            if (props[15] != undefined) {
                props[15] = parseInt(props[15] * mainRatio[0]);
            }
        } else {
            if (isSubReportCellPercent) {//子报表自适应，需要重新计算高度和宽度
                props[15] = parseInt(props[15] * radios[0]);
            }
        }

        //whj
        if (props[1] == 1) { //对于第一行，判断上下边框，如果上下边框都有，td高度减2，如果只有一边td高度减1，否则不处理
            tdHeight = tdHeight - props[12] - props[6];
        } else { //对于后面的行，只判断是否有下边框，如果有，td高度减1
            tdHeight = tdHeight - props[12];
        }

        //whj
        if (props[0] == 1) { //对于第一列，判断左右边框，如果左右边框都有，td宽度减去左右边框的宽度，如果只有一边td宽度减右边宽度，否则不处理
            tdWidth = tdWidth - props[3] - props[9];
        } else { //对于后面的行，只判断是否有下边框，如果有，td高度减1
            tdWidth = tdWidth - props[9];
        }
        if (cell.hasOwnProperty("HtmlFile")) {
            td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe src="' + _home + exportpathApp + '/' + cell.HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span>');
        } else {
            td.html('<span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;word-break:break-word;">' + (cell.T == undefined ? "" : cell.T) + '</span>');
        }

        /*if (data.hasOwnProperty("WebBKImage")) { //背景图片和背景色互斥，如果有背景图片，需要将背景色去掉
         bgImg = data.WebBKImage.split("/");
         $('#' + subTbId).parent().css({
         "background-image": "url('" + (_home + exportpathApp + "/" + bgImg[bgImg.length - 2]) + "/" + bgImg[bgImg.length - 1] + "')",
         "background-repeat": "no-repeat",
         "background-position": "0 0",
         "background-size": "100% 100%",
         "background-color": ""
         });
         }*/

        Report.RV.setSubTableCellStyle(td, cell, _Rows.RowArray, (_id_ + "_"), sheetName, radios, subTbId, subColorList, subFontList);

        if (!cell.hasOwnProperty("T")) {
            if (cell.hasOwnProperty("Pic")) {

                var block = cell.Pic.split("/");
                var url = _home + exportpathApp + "/" + block[block.length - 2] + "/" + block[block.length - 1];
                td.css("background-image", "url(" + url + ")"); //whj
                if (cell.hasOwnProperty("A")) { //图片缩放
                    td.css("background-repeat", "no-repeat");
                    td.css("background-size", "100% 100%");
                }
            }
            if (cell.hasOwnProperty("SubReportSheetNames")) {
                Report.RV.drawSubReportWidget(td, cell, psheetname);
            }
        } else { //既有文本又有背景图片时
            if (cell.hasOwnProperty("Pic")) {
                var block = cell.Pic.split("/");
                var url = _home + exportpathApp + "/" + block[block.length - 2] + "/" + block[block.length - 1];
                td.css("background-image", "url(" + url + ")"); //whj
                if (cell.hasOwnProperty("A")) { //图片缩放
                    td.css("background-repeat", "no-repeat");
                    td.css("background-size", "100% 100%");
                }
            }
        }

        if ("1" === _gudaf) {
            Report.RV.drawUpdateDataWidget(td, cell, data, true, psheetname);
        }
        ;
    });
    // 删除子报表的空白行
    $("#" + _id_ + "_content_ tr:empty").remove();
}


/**
 * 解析子报表 JSON 数据
 *
 * @param {Element} elem       单元格容器元素
 * @param {Object}  data       json对象
 * @param {String}  swwiper    轮播容器ID
 * @param {Number}  index      下标
 * @param {String}  sheetName  报表名称
 * @param {String}  psheetname Sheet名称
 */
function renderMainSheetTD(elem, data, psheetname, swiper) {
    var _id_ = elem.attr("id"),
        _Page = data.Pages[0];
    var _ids_ = _id_.split('_');
    var length = _ids_.length;
    // 渲染单元格
    $.each(_Page.Cells, function (i, cell) {
        var td = $("#" + _id_);
        var props = cell.N;
        if (props[0] == _ids_[length - 1] && props[1] == _ids_[length - 2]) {
            if (cell.hasOwnProperty("HtmlFile")) {
                td.find('span').empty();
                var width = td.width();
                var height = td.height();
                td.find('span').append('<iframe src="' + _home + exportpathApp + '/' + cell.HtmlFile + '" style="width:' + width + 'px;height:' + height + 'px;" frameborder=0 scrolling=no></iframe>');
            } else {
                var val = cell.T;
                if (val != undefined) {
                    val = val.replace(/&nbsp;/ig, " ");
                    //单元格有区域联动时 <td><span><span></span></span></td>
                    //普通单元格 <td><span></span></td>
                    if (td.find('span').find('span').length > 0) {
                        td.find('span').find('span').text(val);
                    } else {
                        td.find('span').text(val);
                    }
                }
            }
            Report.RV.setMainTableCellStyle(td, cell);
            Report.RV.fillRFT(td, cell, psheetname, true);
            if ("1" === _gudaf) {
                Report.RV.drawUpdateDataWidget(td, cell, data, true, psheetname);
                //下拉多选
                var sel3 = td.find("select[sel='3']");
                if (undefined != sel3) {
                    sel3.each(function () {
                        var data = {
                            width: "100%",
                            language: 'zh-CN',
                            placeholder: '请搜索',
                            multiple: true,
                            allowClear: true,
                            title: sel3.attr('title')
                        };
                        $(this).val('').select2(data); //不设置默认值
                    });
                }

                var sel2 = td.find("select[sel='2']");
                if (undefined != sel2) {
                    sel2.each(function () {
                        var data = {
                            width: "100%",
                            language: 'zh-CN',
                            placeholder: '请搜索',
                            multiple: false,
                            allowClear: true,
                            title: sel2.attr('title')
                        };
                        $(this).val('').select2(data);
                    });
                }
                td.find("select,input[type='text'],input[type='file'],input[type='checkbox'],input[type='radio']").change(function () {
                    var regions = $(this).attr("reg");
                    if ($(this).is("select")) {
                        Report.GI.doControllLink(this, 2, regions, psheetname);
                    }
                    if ($(this).attr("type") == "radio") {
                        Report.GI.doControllLink(this, 10, regions, psheetname);
                    }
                    if ($(this).attr("checkbox") == 1) {
                        Report.GI.doComboBoxSel(this, 7, regions, psheetname);
                    }
                });

            }
            ;
        }
    });
    // 删除子报表的空白行
    $("#" + _id_ + "_content_ tr:empty").remove();
}

function boundingEvent(tb, width) {
    if (typeof(tb) == 'string') {
        tb = $("#" + tb);
    }
    //下拉多选
    var sel3 = tb.find("select[sel='3']");
    if (undefined != sel3) {
        sel3.each(function () {
            var data = {
                width: width ? width : "100%",
                language: 'zh-CN',
                placeholder: '请搜索',
                multiple: true,
                allowClear: true,
                title: sel3.attr('title')
            };
            $(this).select2(data);
            if (!isNull($(this).attr('vs'))) {
                $(this).val($(this).attr('vs').split(',')).trigger('change');
            } else {
                //$(this).select2("val", "");无效
                $(this).val("").select2(data);
            }
            $(this).change(function () {
                $(this).attr("vs", isNull($(this).select2('val')) ? '' : $(this).select2('val').join());
                $(this).prev().val(isNull($(this).select2('val')) ? '' : $(this).select2('val').join());
            });
        });
    }
    //下拉单选
    var sel2 = tb.find("select[sel='2']");
    if (undefined != sel2) {
        sel2.each(function () {
            var data = {
                width: width ? width : "100%",
                language: 'zh-CN',
                placeholder: '请搜索',
                allowClear: true,
                title: sel2.attr('title')
            };
            $(this).select2(data);
            if (!isNull($(this).attr('vs'))) {
                //$(this).val($(this).attr('vs')).trigger('change');
                $(this).val($(this).attr('vs')).select2(data);//不会触发change事件
            } else {
                $(this).val("").select2(data);
            }
            $(this).change(function () {
                if (isNull($(this).val())) {
                    $(this).val("");
                } else {
                    $(this).attr("vs", $(this).val());
                }
            });
        });
    }
}
//type true 表示是查询栏
function boundUpdate(tb, isFile) {
    if (typeof(tb) == 'string') {
        tb = $("#" + tb);
    }
    var psheetname = tb.attr("sheetname");
    tb.find("input[type='text']").each(function () {
        if ($(this).attr("date") == 1) {
            var regions = $(this).attr("reg");
            $(this).click(function () {
                var fmt = eval($(this).attr("hasTime")) ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
                WdatePicker({
                    dateFmt: fmt,
                    readOnly: true,
                    onpicked: function (dp) {
                        Report.GI.doControllLink(dp, 6, regions, psheetname);
                        if (!isFile) {
                            var tableId = $(this).parent().parent().parent().parent().attr("id");
                            Report.GI.setUpdateFlag(tableId, this.parentElement);
                        }
                    }
                });
            });
        }
    });
    tb.find("select,input[type='text'],input[type='file'],input[type='checkbox'],input[type='radio']").change(function () {
        var regions = $(this).attr("reg");
        if ($(this).is("select")) {
            Report.GI.doControllLink(this, 2, regions, psheetname);
        }
        if ($(this).attr("type") == "radio") {
            Report.GI.doControllLink(this, 10, regions, psheetname);
        }
        if ($(this).attr("checkbox") == 1) {
            Report.GI.doComboBoxSel(this, 7, regions, psheetname);
        }
        if (!isFile) {
            var tableId = $(this).parent().parent().parent().parent().attr("id");
            Report.GI.setUpdateFlag(tableId, this.parentElement);
        }
    });
}
//根据sheetName获取唯一dom TODO
function getSheetObj(x, y, sheetName, oid) {  //whj 根据Id获取单元格
    var id = "#" + oid + "_" + y + "_" + x;
    var td = $(id);
    return td;
}

function getSheetObjBySheetName(x, y, sheetName) {  //whj 根据Id获取单元格
    var table = $("table[sheetname='" + sheetName + "']");
    var oid = table.attr("id");
    var id = "#" + oid + "_" + y + "_" + x;
    var td = $(id);
    return td;
}

/**
 * 下拉多选查询单击事件
 *
 * @param {Element} e 当前触发事件元素
 */
function doComboBoxMultiSel(ele) {
    var $ele = $(ele),
        val = $("#" + $ele.attr("ref")).val(),
        key = $("input[name='" + $ele.attr("ref") + "']").val(),
        vals = null,
        keys = null,
        idx = -1;

    if (val.trim().length > 0) {
        vals = val.split(",");
        keys = key.split(",");
        idx = vals.indexOf($ele.attr("text"));

        if (-1 === idx) {
            vals.push($ele.attr("text"));
            keys.push($ele.val());
        } else {
            vals.splice(idx, 1);
            keys.splice(idx, 1);
        }
        $("#" + $ele.attr("ref")).val(vals.join(","));
        $("input[name='" + $ele.attr("ref") + "']").val(keys.join(","));
    } else {
        $("#" + $ele.attr("ref")).val($ele.attr("text"));
        $("input[name='" + $ele.attr("ref") + "']").val($ele.val());
    }
}

/**
 * 动态列查询控制
 *
 * @param {Element} e 当前触发事件元素
 */
function doCheck(e) {
    var ele = $(e.previousElementSibling), val = ele.val();
    ele.val((val === "true") ? "false" : "true");
}


//用于控件联动，刷新子sheet页面，由于有参数变动，需要重新调用load用以刷新json文件
function doControllFresh(params, tt) {
    setParam(params, tt);
    doSearchOnly();
}

function setParam(params, tt) {
    var data = params.split(";");
    for (var i = 0; i < data.length; i++) {
        if (data[i].indexOf("=") > -1) {
            var p = data[i].split("=");
            var obj;
            if (tt) { //区域刷新标志，用于区分工具栏
                obj = $("[name=" + p[0] + "]");
            } else {

            }
            // var
            if (obj == undefined || obj.length <= 0) {
                var input = '<input type="text" name="' + p[0] + '" value="' + p[1].split(";")[0] + '" style="display:none;" />';
                $("#_field_").append(input);
            } else {
                obj.val(p[1].split(";")[0]);
            }
        }
    }
}

var Report = {
        RV: {
            /**
             * 初始化表格HTML标签
             *
             * @param {Object} _Rows    行对象
             * @param {Object} _Columns 列对象
             *
             * @param {String} HTML字符串
             */
            initMainTableHTML: function (_Rows, _Columns, oid, flag) {
                var html = "",
                    wcp = __data.WebCellPercent,
                    ratios = [1, 1]; // 1,屏幕自适应; 0,屏幕非自适应
                if (flag) {
                    // 窗口缩放控制
                    $(window).resize(function () {
                        if (1 === wcp) {
                            document.location.reload();
                        } else if (0 === wcp) {
                            Report.RV.setBounds();
                            //document.location.reload();
                        }
                    });
                }


                if (1 === wcp) {
                    if (flag) {
                        ratios = Report.RV.reCalTableWidthAndHeight($("body"), __data);
                    } else {//resize
                        ratios = Report.RV.reCalTableWidthAndHeight($("body"), backData);
                    }

                    mainRatio = ratios;
                    //当页面为自适应时，需要修改x-container的overflow属性来确保不会产生横向滚动条
                    $(".x-container").css("overflow-x", "hidden");
                    $(".x-container").css("overflow-y", "auto");
                }
                for (var i = 0; i < _Rows.Count; i++) {
                    html += "<tr oh='" + _Rows.RowArray[i].H + "' attr='" + _Rows.RowArray[i].H + "' style='height: " + _Rows.RowArray[i].H + "px;overflow:auto;" + (0 === _Rows.RowArray[i].H ? "display: none;" : "") + "' id='" + oid + "_r_" + (i + 1) + "'>";
                    for (var j = 0; j < _Columns.Count; j++) {
                        html += "<td hr='" + ratios[0] + "' vr='" + ratios[1] + "' oh='" + _Rows.RowArray[i].H + "' ow='" + _Columns.ColumnArray[j].W + "' attr='" + _Columns.ColumnArray[j].W + "' style='width: " + _Columns.ColumnArray[j].W + "px;height:" + _Rows.RowArray[i].H + "px;padding: 0;" + (0 === _Columns.ColumnArray[j].W ? "display: none;" : "") + "' id='" + oid + "_" + (i + 1) + "_" + (j + 1) + "' idx='" + (j + 1) + "'></td>";
                    }
                    html += "</tr>";
                }

                return html;
            },
            /**
             * 获取表格总高度
             *
             * @param {Object} columns 表格列数组
             *
             * @return {Number} 总宽度
             */
            getColumnWidthTotal: function (columns) {
                // 计算表格总宽度
                var width = 0;

                $.each(columns.ColumnArray, function (i, item) {
                    width += item.W;
                });

                return width;
            },
            /**
             * 获取表格总高度
             *
             * @param {Object} rows 表格行数组
             *
             * @return {Number} 总高度
             */
            getRowHeightTotal: function (rows) {
                // 计算表格总宽度
                var height = 0;

                $.each(rows.RowArray, function (i, item) {
                    height += item.H;
                });

                return height;
            },
            /**
             * 设置单元格样式
             *
             * @param {Element} td       表格TD对象
             * @param {Object}  cell     单元格属性集
             * @param {Array}   rowArray 行数组
             * @param {String}  prefix
             * @param {String} sheetName 报表名称
             */
            setTableCellStyle: function (td, cell, rowArray, prefix, sheetName, oid) {
                var props = cell.N;
                if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                    if (cell.AH == 1) { //AH = 1时，水平居左
                        td.children(0).css("justify-content", "flex-start");
                    } else {
                        td.children(0).css("justify-content", "flex-end");
                    }
                } else { //没有AH属性，默认居中
                    td.children(0).css("justify-content", "center");
                }

                if (cell.hasOwnProperty("A")) { //图片缩放
                    td.css("text-align", "center");
                    if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                        if (cell.AH == 1) { //AH = 1时，水平居左
                            td.children(0).css("justify-content", "flex-start");
                        } else {
                            td.children(0).css("justify-content", "flex-end");
                        }
                    } else { //没有AH属性，默认居中
                        td.children(0).css("justify-content", "center");
                    }
                }

                if (cell.hasOwnProperty("AV")) { //为单元格设置垂直居中 //AlignmentV->AV
                    if (cell.AV == 16) {  //AlignmentV->AV
                        td.children(0).css("align-items", "flex-start");
                    } else {
                        td.children(0).css("align-items", "flex-end");
                    }
                } else {
                    td.children(0).css("align-items", "center");
                }

                if (cell.hasOwnProperty("BC")) { //BKColor -> BC
                    var index = cell.BC;
                    td.css("background-color", colorList[index]);
                }

                if (cell.hasOwnProperty("T")) { //如果有T,需要渲染文本属性
                    var colorIndex = props[19]; //文本颜色索引
                    var color = colorList[colorIndex];
                    var fontIndex = props[14]; //字体索引
                    var font = fontList[fontIndex];
                    td.css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                    td.children(0).css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                }

                if (cell.hasOwnProperty("LS")) { //字间距
                    td.children(0).css({
                        "letter-spacing": cell.LS + 'px'
                    });
                }

                if (cell.hasOwnProperty("LnS")) { //行间距
                    td.children(0).css({
                        "line-height": (cell.LnS + props[15]) + 'px'
                    });
                }

                if (cell.RepaintRegions != undefined) {//有区域联动,添加下划线
                    td.children(0).css({
                        "text-decoration": "underline"
                    });
                }

                if (cell.hasOwnProperty("G")) { //Group -> G
                    var G = cell.G;
                    var colCount = G[0]; //最终列合并单元格数
                    var rowCount = G[1]; //最终行合并单元格数
                    var width = G[2]; //原始高度
                    var height = G[3]; //原始宽度
                    var colSpan = colCount;
                    var rowSpan = rowCount;

                    if (__data.WebCellPercent === 1) {
                        width = Math.floor(width * mainRatio[0]);
                        height = Math.floor(height * mainRatio[1]);
                    }

                    if (colCount > 1) { //有列合并时
                        var spanCell = null;
                        for (var m = 1; m < colCount; m++) { //判断合并列中是否有隐藏列
                            spanCell = $('#' + oid + "_" + props[1] + "_" + (props[0] + m));
                            /* var display = spanCell.css('display'); //此单元格是否隐藏
                             if (display == 'none' || (spanCell.attr('ow') == 0)){
                             spanCell = getSheetObj((props[0] + m), (props[1] + n), sheetName , oid).remove();
                             }*/
                            var display = spanCell.css('display'); //此单元格是否隐藏
                            if (display == 'none' || (spanCell.attr('ow') == 0)) {
                                colSpan--;
                            }
                            for (var n = 0; n < rowCount; n++) {
                                var id = "#" + oid + "_" + (props[1] + n) + "_" + (props[0] + m);
                                spanCell = $(id).remove();
                            }
                        }
                        td.attr("colspan", colSpan).css("width", width).attr("ow", width);
                        td.find('span').css("width", width); //如果有合并属性，需要重新给td下的span赋值 ， whj
                    }
                    if (rowCount > 1) { //有行合并时
                        var spanCell;
                        for (var m = 1; m < rowCount; m++) {
                            spanCell = $('#' + oid + "_" + (props[1] + m) + "_" + props[0]);

                            var display = spanCell.css('display'); //此单元格是否隐藏
                            if (display == 'none' || (spanCell.attr('oh') == 0)) {
                                rowSpan--;
                            }
                            for (var n = 0; n < colCount; n++) {
                                spanCell = getSheetObj((props[0] + n), (props[1] + m), sheetName, oid).remove();
                            }
                        }

                        td.attr("rowspan", rowSpan).css("height", height).attr("oh", height);
                        td.find('span').css("height", height); //如果有合并属性，需要重新给td下的span赋值 ， whj

                    }
                }

                //绘制左边框样式
                if (props[2] != 0) {
                    var lStyle = props[2] > 1 ? 'dashed' : 'solid';
                    var lColorIndex = props[4],
                        lColor = colorList[lColorIndex];
                    td.css({
                        "border-left-color": lColor,
                        "border-left-style": lStyle,
                        "border-left-width": (props[3] * 1 + "px")
                    });
                }

                if (props[5] != 0) {
                    //绘制上边框样式
                    var tStyle = props[5] > 1 ? 'dashed' : 'solid';
                    var tColorIndex = props[7], tColor = colorList[tColorIndex];
                    td.css({
                        "border-top-color": tColor,
                        "border-top-style": tStyle,
                        "border-top-width": (props[6] * 1 + "px")
                    });
                }


                //绘制右边框样式
                if (props[8] != 0) {
                    var rStyle = props[8] > 1 ? 'dashed' : 'solid';
                    var rColorIndex = props[10], rColor = colorList[rColorIndex];
                    td.css({
                        "border-right-color": rColor,
                        "border-right-style": rStyle,
                        "border-right-width": (props[9] * 1 + "px")
                    });
                }


                //绘制下边框样式
                if (props[11] != 0) {
                    var bStyle = props[11] > 1 ? 'dashed' : 'solid';
                    var bColorIndex = props[13], bColor = colorList[bColorIndex];
                    td.css({
                        "border-bottom-color": bColor,
                        "border-bottom-style": bStyle,
                        "border-bottom-width": (props[12] * 1 + "px")
                    });
                }

            },

            /**
             * 设置单元格样式
             *
             * @param {Element} td       表格TD对象
             * @param {Object}  cell     单元格属性集
             * @param {Array}   rowArray 行数组
             * @param {String}  prefix
             * @param {String} sheetName 报表名称
             */
            rSetTableCellStyle: function (td, cell, rowArray, prefix, sheetName, oid) {
                var props = cell.N;
                if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                    if (cell.AH == 1) { //AH = 1时，水平居左
                        td.children(0).css("justify-content", "flex-start");
                    } else {
                        td.children(0).css("justify-content", "flex-end");
                    }
                } else { //没有AH属性，默认居中
                    td.children(0).css("justify-content", "center");
                }

                if (cell.hasOwnProperty("A")) { //图片缩放
                    td.css("text-align", "center");
                    if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                        if (cell.AH == 1) { //AH = 1时，水平居左
                            td.children(0).css("justify-content", "flex-start");
                        } else {
                            td.children(0).css("justify-content", "flex-end");
                        }
                    } else { //没有AH属性，默认居中
                        td.children(0).css("justify-content", "center");
                    }
                }

                if (cell.hasOwnProperty("AV")) { //为单元格设置垂直居中 //AlignmentV->AV
                    if (cell.AV == 16) {  //AlignmentV->AV
                        td.children(0).css("align-items", "flex-start");
                    } else {
                        td.children(0).css("align-items", "flex-end");
                    }
                } else {
                    td.children(0).css("align-items", "center");
                }

                if (cell.hasOwnProperty("BC")) { //BKColor -> BC
                    var index = cell.BC;
                    td.css("background-color", colorList[index]);
                }

                if (cell.hasOwnProperty("T")) { //如果有T,需要渲染文本属性
                    var colorIndex = props[19]; //文本颜色索引
                    var color = colorList[colorIndex];
                    var fontIndex = props[14]; //字体索引
                    var font = fontList[fontIndex];
                    td.css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                    td.children(0).css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                }

                if (cell.hasOwnProperty("LS")) { //字间距
                    td.children(0).css({
                        "letter-spacing": cell.LS + 'px'
                    });
                }

                if (cell.hasOwnProperty("LnS")) { //行间距
                    td.children(0).css({
                        "line-height": (cell.LnS + props[15]) + 'px'
                    });
                }

                if (cell.hasOwnProperty("G")) { //Group -> G
                    var G = cell.G;
                    var colCount = G[0]; //最终列合并单元格数
                    var rowCount = G[1]; //最终行合并单元格数
                    var width = G[2]; //原始高度
                    var height = G[3]; //原始宽度
                    var colSpan = colCount;
                    var rowSpan = rowCount;


                    if (colCount > 1) { //有列合并时
                        var totalWidth = parseInt(td.attr('ow'));
                        var spanCell = null;
                        for (var m = 1; m < colCount; m++) { //判断合并列中是否有隐藏列
                            spanCell = $('#' + oid + "_" + props[1] + "_" + (props[0] + m));
                            var display = spanCell.css('display'); //此单元格是否隐藏
                            if (display == 'none' || spanCell.attr('ow') == 0) {
                                colSpan--;
                            } else {
                                totalWidth = totalWidth + parseInt(spanCell.attr('ow'));
                            }
                            for (var n = 0; n < rowCount; n++) {
                                var id = "#" + oid + "_" + (props[1] + n) + "_" + (props[0] + m);
                                spanCell = $(id).remove();
                            }
                        }
                        td.attr("colspan", colSpan).css("width", totalWidth).attr("ow", totalWidth);
                        td.find('span').css("width", totalWidth); //如果有合并属性，需要重新给td下的span赋值 ， whj
                    }
                    if (rowCount > 1) { //有行合并时
                        var totalHeight = parseInt(td.attr('oh')); //合并后的高度
                        var spanCell;
                        for (var m = 1; m < rowCount; m++) {
                            spanCell = $('#' + oid + "_" + (props[1] + m) + "_" + props[0]);
                            var display = spanCell.css('display'); //此单元格是否隐藏
                            if (display == 'none' || spanCell.attr('oh') == 0) {
                                rowSpan--;
                            } else {
                                totalHeight = totalHeight + parseInt(spanCell.attr('oh'));
                            }
                            for (var n = 0; n < colCount; n++) {
                                var id = "#" + oid + "_" + (props[1] + m) + "_" + (props[0] + n);
                                spanCell = $(id).remove();

                            }
                        }

                        td.attr("rowspan", rowSpan).css("height", totalHeight).attr("oh", totalHeight);
                        td.find('span').css("height", totalHeight); //如果有合并属性，需要重新给td下的span赋值 ， whj

                    }
                }

                //绘制左边框样式
                if (props[2] != 0) {
                    var lStyle = props[2] > 1 ? 'dashed' : 'solid';
                    var lColorIndex = props[4],
                        lColor = colorList[lColorIndex];
                    td.css({
                        "border-left-color": lColor,
                        "border-left-style": lStyle,
                        "border-left-width": (props[3] * 1 + "px")
                    });
                }

                if (props[5] != 0) {
                    //绘制上边框样式
                    var tStyle = props[5] > 1 ? 'dashed' : 'solid';
                    var tColorIndex = props[7], tColor = colorList[tColorIndex];
                    td.css({
                        "border-top-color": tColor,
                        "border-top-style": tStyle,
                        "border-top-width": (props[6] * 1 + "px")
                    });
                }


                //绘制右边框样式
                if (props[8] != 0) {
                    var rStyle = props[8] > 1 ? 'dashed' : 'solid';
                    var rColorIndex = props[10], rColor = colorList[rColorIndex];
                    td.css({
                        "border-right-color": rColor,
                        "border-right-style": rStyle,
                        "border-right-width": (props[9] * 1 + "px")
                    });
                }


                //绘制下边框样式
                if (props[11] != 0) {
                    var bStyle = props[11] > 1 ? 'dashed' : 'solid';
                    var bColorIndex = props[13], bColor = colorList[bColorIndex];
                    td.css({
                        "border-bottom-color": bColor,
                        "border-bottom-style": bStyle,
                        "border-bottom-width": (props[12] * 1 + "px")
                    });
                }

            },

            //区域联动后，设置TD样式
            setMainTableCellStyle: function (td, cell) {
                var props = cell.N;
                if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                    if (cell.AH == 1) { //AH = 1时，水平居左
                        td.children(0).css("justify-content", "flex-start");
                    } else {
                        td.children(0).css("justify-content", "flex-end");
                    }
                } else { //没有AH属性，默认居中
                    td.children(0).css("justify-content", "center");
                }

                if (cell.hasOwnProperty("A")) { //图片缩放
                    td.css("text-align", "center");
                    if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                        if (cell.AH == 1) { //AH = 1时，水平居左
                            td.children(0).css("justify-content", "flex-start");
                        } else {
                            td.children(0).css("justify-content", "flex-end");
                        }
                    } else { //没有AH属性，默认居中
                        td.children(0).css("justify-content", "center");
                    }
                }

                if (cell.hasOwnProperty("AV")) { //为单元格设置垂直居中 //AlignmentV->AV
                    if (cell.AV == 16) {  //AlignmentV->AV
                        td.children(0).css("align-items", "flex-start");
                    } else {
                        td.children(0).css("align-items", "flex-end");
                    }
                } else {
                    td.children(0).css("align-items", "center");
                }

                if (cell.hasOwnProperty("BC")) { //BKColor -> BC
                    var index = cell.BC;
                    td.css("background-color", colorList[index]);
                }

                if (cell.hasOwnProperty("T")) { //如果有T,需要渲染文本属性
                    var colorIndex = props[19]; //文本颜色索引
                    var color = colorList[colorIndex];
                    var fontIndex = props[14]; //字体索引
                    var font = fontList[fontIndex];
                    td.css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                    td.children(0).css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                }

                if (cell.hasOwnProperty("LS")) { //字间距
                    td.children(0).css({
                        "letter-spacing": cell.LS + 'px'
                    });
                }

                if (cell.hasOwnProperty("LnS")) { //行间距
                    td.children(0).css({
                        "line-height": (cell.LnS + props[15]) + 'px'
                    });
                }

                if (cell.RepaintRegions != undefined) {//有区域联动,添加下划线
                    td.children(0).css({
                        "text-decoration": "underline"
                    });
                }

                //绘制左边框样式
                if (props[2] != 0) {
                    var lStyle = props[2] > 1 ? 'dashed' : 'solid';
                    var lColorIndex = props[4],
                        lColor = colorList[lColorIndex];
                    td.css({
                        "border-left-color": lColor,
                        "border-left-style": lStyle,
                        "border-left-width": (props[3] * 1 + "px")
                    });
                }

                if (props[5] != 0) {
                    //绘制上边框样式
                    var tStyle = props[5] > 1 ? 'dashed' : 'solid';
                    var tColorIndex = props[7], tColor = colorList[tColorIndex];
                    td.css({
                        "border-top-color": tColor,
                        "border-top-style": tStyle,
                        "border-top-width": (props[6] * 1 + "px")
                    });
                }


                //绘制右边框样式
                if (props[8] != 0) {
                    var rStyle = props[8] > 1 ? 'dashed' : 'solid';
                    var rColorIndex = props[10], rColor = colorList[rColorIndex];
                    td.css({
                        "border-right-color": rColor,
                        "border-right-style": rStyle,
                        "border-right-width": (props[9] * 1 + "px")
                    });
                }


                //绘制下边框样式
                if (props[11] != 0) {
                    var bStyle = props[11] > 1 ? 'dashed' : 'solid';
                    var bColorIndex = props[13], bColor = colorList[bColorIndex];
                    td.css({
                        "border-bottom-color": bColor,
                        "border-bottom-style": bStyle,
                        "border-bottom-width": (props[12] * 1 + "px")
                    });
                }

            },
            /**
             * 设置单元格样式
             *
             * @param {Element} td       表格TD对象
             * @param {Object}  cell     单元格属性集
             * @param {Array}   rowArray 行数组
             * @param {String}  prefix
             * @param {String} sheetName 报表名称
             */
            setSubTableCellStyle: function (td, cell, rowArray, prefix, sheetName, radios, oid, subColorList, subFontList) {
                var props = cell.N;
                if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                    if (cell.AH == 1) { //AH = 1时，水平居左
                        td.children(0).css("justify-content", "flex-start");
                    } else {
                        td.children(0).css("justify-content", "flex-end");
                    }
                } else { //没有AH属性，默认居中
                    td.children(0).css("justify-content", "center");
                }

                if (cell.hasOwnProperty("A")) { //图片缩放
                    td.css("text-align", "center");
                    if (cell.hasOwnProperty("AH")) { //AlignmentH->AH 设置水平居中属性
                        if (cell.AH == 1) { //AH = 1时，水平居左
                            td.children(0).css("justify-content", "flex-start");
                        } else {
                            td.children(0).css("justify-content", "flex-end");
                        }
                    } else { //没有AH属性，默认居中
                        td.children(0).css("justify-content", "center");
                    }
                }

                if (cell.hasOwnProperty("AV")) { //为单元格设置垂直居中 //AlignmentV->AV
                    if (cell.AV == 16) {  //AlignmentV->AV
                        td.children(0).css("align-items", "flex-start");
                    } else {
                        td.children(0).css("align-items", "flex-end");
                    }
                } else {
                    td.children(0).css("align-items", "center");
                }

                if (cell.hasOwnProperty("BC")) { //BKColor -> BC
                    var index = cell.BC;
                    td.css("background-color", subColorList[index]);
                }

                if (cell.hasOwnProperty("T")) { //如果有T,需要渲染文本属性
                    var colorIndex = props[19]; //文本颜色索引
                    var color = subColorList[colorIndex];
                    var fontIndex = props[14]; //字体索引
                    var font = subFontList[fontIndex];
                    td.css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                    td.children(0).css({
                        "font-weight": (props[16] == 1 ? "bold" : "normal"),
                        "color": color,
                        "font-style": (props[17] == 1 ? "italic" : "normal"),
                        "font-family": font,
                        "font-size": props[15],
                        "text-decoration": (props[18] == 1 ? "underline" : "none")
                    });
                }

                if (cell.hasOwnProperty("LS")) { //字间距
                    td.children(0).css({
                        "letter-spacing": cell.LS + 'px'
                    });
                }

                if (cell.hasOwnProperty("LnS")) { //行间距
                    td.children(0).css({
                        "line-height": (cell.LnS + props[15]) + 'px'
                    });
                }

                if (cell.hasOwnProperty("G")) { //Group -> G
                    var G = cell.G;
                    var colCount = G[0]; //最终列合并单元格数
                    var rowCount = G[1]; //最终行合并单元格数
                    var width = G[2]; //原始高度
                    var height = G[3]; //原始宽度
                    var colSpan = colCount;
                    var rowSpan = rowCount;


                    if (colCount > 1) { //有列合并时
                        var totalWidth = parseInt(td.attr('ow'));
                        var spanCell = null;
                        for (var m = 1; m < colCount; m++) { //判断合并列中是否有隐藏列
                            spanCell = $('#' + oid + props[1] + "_" + (props[0] + m));
                            var display = spanCell.css('display'); //此单元格是否隐藏
                            if (display == 'none' || spanCell.attr('ow') == 0) {
                                colSpan--;
                            } else {
                                totalWidth = totalWidth + parseInt(spanCell.attr('ow'));
                            }
                            for (var n = 0; n < rowCount; n++) {
                                var id = "#" + oid + (props[1] + n) + "_" + (props[0] + m);
                                spanCell = $(id).remove();
                            }
                        }
                        td.attr("colspan", colSpan).css("width", totalWidth).attr("ow", totalWidth);
                        td.find('span').css("width", totalWidth); //如果有合并属性，需要重新给td下的span赋值 ， whj
                    }
                    if (rowCount > 1) { //有行合并时
                        var totalHeight = parseInt(td.attr('oh')); //合并后的高度
                        var spanCell;
                        for (var m = 1; m < rowCount; m++) {
                            spanCell = $('#' + oid + (props[1] + m) + "_" + props[0]);
                            var display = spanCell.css('display'); //此单元格是否隐藏
                            if (display == 'none' || spanCell.attr('oh') == 0) {
                                rowSpan--;
                            } else {
                                totalHeight = totalHeight + parseInt(spanCell.attr('oh'));
                            }
                            for (var n = 0; n < colCount; n++) {
                                var id = "#" + oid + (props[1] + m) + "_" + (props[0] + n);
                                spanCell = $(id).remove();

                            }
                        }

                        td.attr("rowspan", rowSpan).css("height", totalHeight).attr("oh", totalHeight);
                        td.find('span').css("height", totalHeight); //如果有合并属性，需要重新给td下的span赋值 ， whj

                    }
                }

                //绘制左边框样式
                if (props[2] != 0) {
                    var lStyle = props[2] > 1 ? 'dashed' : 'solid';
                    var lColorIndex = props[4],
                        lColor = subColorList[lColorIndex];
                    td.css({
                        "border-left-color": lColor,
                        "border-left-style": lStyle,
                        "border-left-width": (props[3] * 1 + "px")
                    });
                }

                if (props[5] != 0) {
                    //绘制上边框样式
                    var tStyle = props[5] > 1 ? 'dashed' : 'solid';
                    var tColorIndex = props[7], tColor = subColorList[tColorIndex];
                    td.css({
                        "border-top-color": tColor,
                        "border-top-style": tStyle,
                        "border-top-width": (props[6] * 1 + "px")
                    });
                }


                //绘制右边框样式
                if (props[8] != 0) {
                    var rStyle = props[8] > 1 ? 'dashed' : 'solid';
                    var rColorIndex = props[10], rColor = subColorList[rColorIndex];
                    td.css({
                        "border-right-color": rColor,
                        "border-right-style": rStyle,
                        "border-right-width": (props[9] * 1 + "px")
                    });
                }


                //绘制下边框样式
                if (props[11] != 0) {
                    var bStyle = props[11] > 1 ? 'dashed' : 'solid';
                    var bColorIndex = props[13], bColor = subColorList[bColorIndex];
                    td.css({
                        "border-bottom-color": bColor,
                        "border-bottom-style": bStyle,
                        "border-bottom-width": (props[12] * 1 + "px")
                    });
                }

            },
            /**
             * 固定行列
             *
             * @param {Object}  _Page    页面属性集
             * @param {Object}  _Columns 列属性集
             * @param {Object}  _Rows    行属性集
             * @param {Element} obj      单元格容器元素
             */
            frozenTable: function (_Page, _Columns, _Rows, obj, oid) {
                if (_Page.hasOwnProperty("FixRowCount") && _Page.hasOwnProperty("FixColumnCount")) {
                    $.ajax({
                        url: _home + "/js/jquery.mousewheel.min.js",
                        dataType: "script",
                        cache: true
                    });

                    if (_Page.FixRowCount > 0 && _Page.FixColumnCount > 0) {
                        var fixRowCount = _Page.FixRowCount,
                            fixColumnCount = _Page.FixColumnCount,
                            tableWidth;

                        // 样式初始化
                        obj.css("width", "");

                        // 固定左上
                        for (i = 1; i <= fixRowCount; i++) {
                            for (j = 1; j <= fixColumnCount; j++) {
                                if (i === 1 && j === 1) {
                                    continue;
                                }
                                $('#' + oid + '_' + i + '_' + j).remove();
                            }
                        }
                        $('#' + oid + '_1_1').css({
                            "width": "",
                            "padding": "0"
                        }).removeAttr("id").html(initNestTable('top-left-fixed-container', 1, fixRowCount, 1, fixColumnCount, _Columns, _Rows, oid)).parent().css({
                            "width": "",
                            "height": ""
                        });
                        for (j = 0, tableWidth = 0; j < fixColumnCount; j++) {
                            tableWidth += _Columns.ColumnArray[j].W;
                        }
                        $("div.top-left-fixed-container>table").css({
                            "position": "relative",
                            "height": ""
                        });
                        // 固定右上
                        for (i = 1; i <= fixRowCount; i++) {
                            for (j = (fixColumnCount + 1); j <= _Columns.Count; j++) {
                                if (i === 1 && j === (fixColumnCount + 1)) {
                                    continue;
                                }
                                $('#' + oid + '_' + i + '_' + j).remove();
                            }
                        }
                        $('#' + oid + '_1_' + (fixColumnCount + 1)).css({
                            "width": "",
                            "padding": "0"
                        }).removeAttr("id").html(initNestTable('top-right-scroll-container', 1, fixRowCount, (fixColumnCount + 1), _Columns.Count, _Columns, _Rows, oid));
                        for (j = fixColumnCount, tableWidth = 0; j < _Columns.Count; j++) {
                            tableWidth += _Columns.ColumnArray[j].W;
                        }
                        $("div.top-right-scroll-container>table").css({
                            "position": "relative",
                            "width": tableWidth,
                            "height": ""
                        });

                        // 固定左下
                        for (var i = (fixRowCount + 1); i <= _Rows.Count; i++) {
                            for (j = 1; j <= fixColumnCount; j++) {
                                if (i === (fixRowCount + 1) && j === 1) {
                                    continue;
                                }
                                $('#' + oid + '_' + i + '_' + j).remove();
                            }
                        }
                        $('#' + oid + '_' + (fixRowCount + 1) + '_1').css({
                            "width": "",
                            "padding": "0"
                        }).removeAttr("id").html(initNestTable('bottom-left-scroll-container', (fixRowCount + 1), _Rows.Count, 1, fixColumnCount, _Columns, _Rows, oid)).parent().css({
                            "width": "",
                            "height": ""
                        });
                        for (j = 0, tableWidth = 0; j < fixColumnCount; j++) {
                            tableWidth += _Columns.ColumnArray[j].W;
                        }
                        $("div.bottom-left-scroll-container>table").css({
                            "position": "relative",
                            "width": tableWidth,
                            "height": ""
                        });

                        // 固定右下
                        for (i = (fixRowCount + 1); i <= _Rows.Count; i++) {
                            for (j = (fixColumnCount + 1); j <= _Columns.Count; j++) {
                                if (i === (fixRowCount + 1) && j === (fixColumnCount + 1)) {
                                    continue;
                                }
                                $('#' + oid + '_' + i + '_' + j).remove();
                            }
                        }
                        $('#' + oid + '_' + (fixRowCount + 1) + '_' + (fixColumnCount + 1)).css({
                            "width": "",
                            "padding": "0"
                        }).removeAttr("id").html(initNestTable('main-container tr-scroll-container', (fixRowCount + 1), _Rows.Count, (fixColumnCount + 1), _Columns.Count, _Columns, _Rows, oid));
                        for (j = fixColumnCount, tableWidth = 0; j < _Columns.Count; j++) {
                            tableWidth += _Columns.ColumnArray[j].W;
                        }
                        $("div.main-container>table").css({"position": "relative", "width": tableWidth, "height": ""});

                        $('#' + oid).find('tr').each(function (index, ele) {
                            if ($(ele).children('td').length == 0) {
                                $(ele).remove();
                            }
                        });
                    }
                }
            },
            /**
             * 表格展开（折叠）
             *
             * @param {Element} td     单元格容器元素
             * @param {Object}  cell   单元格属性集
             * @param {String}  prefix
             */
            switchFold: function (td, cell, oid) {

                if (cell.hasOwnProperty("RetractRow")) {
                    if (cell.RetractAtInit === 1) { //默认收缩
                        var height = td.parent().height(); //获取tr的高度
                        td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + oid + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='N'>+</a>");
                        for (var m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
                            $("#" + oid + "_r_" + m).hide(); //隐藏行
                            $("#" + oid + "_r_" + m).attr('isPFold', 'N');
                        }
                        if (cell.G != undefined) {
                            td.attr("isg", '1'); //当前单元格需要合并
                            td.attr("rowspan", (parseInt(td.attr("rowspan")) - (m - cell.RetractBeginRow)));
                            //td.attr("height", height); //手动修改td的高度
                            td.css("height", height);
                            td.find("span").eq(0).css("height", height); //手动修改td里面span的高度
                        } else {
                            td.attr("isg", '0'); //当前单元格需要合并
                        }
                    } else {
                        td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + oid + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='Y'>-</a>");
                        for (var m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
                            $("#" + oid + "_r_" + m).show();
                        }
                        if (cell.G != undefined) {
                            td.attr("isg", '1'); //当前单元格需要合并
                            td.attr("rowspan", ((m - cell.RetractBeginRow + 1)));
                            td.find("span").eq(0).css("height", height); //手动修改td里面span的高度
                        } else {
                            td.attr("isg", '0'); //当前单元格需要合并
                        }
                    }
                }

                if (cell.hasOwnProperty("RetractCol")) {
                    if (cell.RetractAtInit === 1) {
                        var width = td.width(); //获取td的宽度,此时宽度是总宽度
                        td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:5px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \'" + oid + "\');' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>+</a>");
                        for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                            $("#" + oid + "_r_" + m).hide();
                        }
                        td.attr("initCs", td.attr('colspan')); //记录原始合并信息
                        td.attr("colspan", (parseInt(td.attr("colspan")) - (m - cell.RetractBeginCol)));
                        td.css("width", Math.ceil(width / cell.G.C)); //获取合并的列数并且手动修改td的高度
                        td.find("span").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
                    } else {
                        td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \"" + oid + "\");' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>-</a>");
                        for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                            $("#" + oid + "_r_" + m).hide();
                        }
                        td.attr("initCs", td.attr('colspan')); //记录原始合并信息
                    }
                }
            },
            /**
             * 填充单元格内容
             *
             * @param {Element} td         单元格容器元素
             * @param {Object}  cell       单元格属性集
             * @param {String}  psheetname 表格名称
             */
            fillRFT: function (td, cell, psheetname, flag) {

                var regions = '';
                var repain = cell.hasOwnProperty("RepaintRegions");
                if (repain) {
                    regions = encodeURI(cell.RepaintRegions);
                }

                // 分散多行关联到主要列
                if (cell.hasOwnProperty("CellRelation")) {
                    td.attr("CellRelation", cell.CellRelation);

                }

                // 非数据链上单元格填报属性
                if (cell.hasOwnProperty("NoFieldUploadCellRelation")) {
                    td.attr("NoFieldUploadCellRelation", cell.NoFieldUploadCellRelation.Relation);
                    td.attr("firstcelluploadname", cell.NoFieldUploadCellRelation.UploadName);
                    td.addClass('noChain');
                }

                if (cell.hasOwnProperty("HyperLink")) {
                    if (cell.HyperLink) {
                        var htm;
                        if (td.children('a').length > 0) {
                            htm = td.children('a').html();
                        } else {
                            htm = td.html();
                        }
                        td.html("<a href='javascript:;' onclick='fun1click(" + cell.HyperLink + ");'>" + htm + "</a>");//参数有问题
                    } else {
                        td.html("<a href='javascript:;'>" + td.html() + "</a>");
                    }
                    td.children('a').children('span').css({'text-decoration': 'underline', 'color': '#00F'});
                }

                if (cell.hasOwnProperty("ProgressBar")) {
                    var bar = cell.ProgressBar;
                    td.html('<progress value="' + (bar.Value) + '" max="' + bar.MaxValue + '" style="width:100%"></progress>');
                }

                if (repain) {//重绘区域联动信息
                    if (flag) {//当前报表区域联动
                        var html = td.html();
                        td.html(html);
                        td.find('span').unbind().bind('click', function () { //重新绑定方法
                            Report.GI.doControllLink(this, 1, regions, psheetname);
                        })
                    } else {
                        var html = "<span style='cursor: pointer; color: #0000FF; text-decoration: underline;' onclick=\"Report.GI.doControllLink(this,1,'" + regions + "','" + psheetname + "')\">" + td.html() + "</span>"; //whj
                        td.html(html);
                        //td.find('span').css('text-decoration', 'underline');
                    }
                }

                if (!cell.hasOwnProperty("T")) {
                    if (cell.hasOwnProperty("Pic")) {

                        var block = cell.Pic.split("/");
                        var url = _home + exportpathApp + "/" + block[block.length - 2] + "/" + block[block.length - 1];
                        td.css("background-image", "url(" + url + ")"); //whj
                        if (cell.hasOwnProperty("A")) { //图片缩放
                            td.css("background-repeat", "no-repeat");
                            td.css("background-size", "100% 100%");
                        }
                    }
                    if (cell.hasOwnProperty("SubReportSheetNames")) {
                        Report.RV.drawSubReportWidget(td, cell, psheetname);
                    }
                } else { //既有文本又有背景图片时
                    if (cell.hasOwnProperty("Pic")) {
                        var block = cell.Pic.split("/");
                        var url = _home + exportpathApp + "/" + block[block.length - 2] + "/" + block[block.length - 1];
                        td.css("background-image", "url(" + url + ")"); //whj
                        if (cell.hasOwnProperty("A")) { //图片缩放
                            td.css("background-repeat", "no-repeat");
                            td.css("background-size", "100% 100%");
                        }
                    }
                }
            },
            /**
             * 绘制子报表控件
             *
             * @param {Element} td         单元格容器元素
             * @param {Object}  cell       单元格属性集
             * @param {String}  psheetname Sheet名称
             */
            drawSubReportWidget: function (td, cell, psheetname) {
                if (cell.SubReportSheetNames == undefined) { //当前报表上联动
                    $.getJSON(loadJsonFunc + "&t=" + new Date().getTime(), {
                        tpl: _g_tpl,
                        file: 'main',
                        pfile: psheetname
                    }, function (resp) {
                        renderMainSheetTD(td, resp, psheetname);
                        if ($("#po").length === 0) {
                            displayUpdateDataButton(resp);
                        }
                    });

                } else {

                    var swiperWrapperId = Util.randomUUID();
                    td.html("<div class='swiper-container' style='width: " + td.attr("ow") + "px; height: " + td.attr("oh") + "px;'>" +
                    "<div id='" + swiperWrapperId + "' class='swiper-wrapper'>" +
                    "</div>" + (cell.SubReportSheetNames.length > 1 ? "<div class='swiper-button-next'></div><div class='swiper-button-prev'></div>" : "") + "</div>");
                    td.attr("SubReportSheetNames", cell.SubReportSheetNames.toString());
                    var $swiper = $("#" + swiperWrapperId);
                    var width = td.attr("ow"); //子报表的宽度
                    var height = td.attr("oh"); //子报表的高度
                    var isSubReportCellPercent = cell.IsSubReportCellPercent; //子报表是否自适应属性
                    var isSubReportKeepHVRatio = cell.IsSubReportKeepHVRatio; //子报表是否保持横纵比属性


                    $.ajaxSettings.async = false;

                    $.each(cell.SubReportSheetNames, function (i, item) {
                        $.getJSON(loadJsonFunc + "&t=" + new Date().getTime(), {
                            tpl: _g_tpl,
                            file: item,
                            pfile: psheetname
                        }, function (resp) {
                            renderSubSheet(td, resp, $swiper, i, item, psheetname, isSubReportCellPercent, isSubReportKeepHVRatio, width, height);
                            if ($("#po").length === 0) {
                                displayUpdateDataButton(resp);
                            }
                        });
                    });
                    $.ajaxSettings.async = true;

                    if (cell.hasOwnProperty("StepScrollV") && cell.IntervalScrollV > 0) { //子报表上下滚动
                        td.attr("IntervalScrollV", parseInt(cell.IntervalScrollV));
                        td.attr("StepScrollV", parseInt(cell.StepScrollV));
                        Report.RV.contentMarquee($("#" + td.attr("id") + " .swiper-slide"), cell);
                    }


                    if (cell.hasOwnProperty("IsShowSubReportScrollBar")) {  //是否显示垂直滚动条
                        if (cell.IsShowSubReportScrollBar) {
                            td.find('.swiper-container').css('overflow-y', 'auto');
                            td.find('.swiper-slide').css('overflow-y', 'auto');
                        } else {
                            td.find('.swiper-container').css('overflow-y', 'hidden');
                            td.find('.swiper-slide').css('overflow-y', 'hidden');
                        }
                    }

                    if (cell.hasOwnProperty("IsShowCenterSubReport")) {  //子表单是否垂直居中
                        if (cell.IsShowCenterSubReport) {
                            td.find('.swiper-slide').css('align-items', 'center');
                        } else {
                            td.find('.swiper-slide').css('align-items', 'flex-start');
                            td.find('.swiper-slide').find('table').css('margin', '0');
                        }
                    }


                    // 多于一个子报表时，显示轮播
                    if (cell.SubReportSheetNames.length >= 1) {
                        $.getScript(swiperJs).done(function () {
                            var params = {
                                speed: 300,
                                navigation: {
                                    nextEl: '.swiper-button-next',
                                    prevEl: '.swiper-button-prev'
                                }
                            };
                            if (cell.hasOwnProperty("IntervalScrollH")) {
                                var val = parseInt(cell.IntervalScrollH);
                                if (val > 0) {
                                    td.attr("IntervalScrollH", cell.IntervalScrollH);
                                    params["direction"] = 'horizontal';
                                    params["autoplay"] = {
                                        disableOnInteraction: true,  // 触碰后自动停止
                                        stopOnLastSlide: false,  //轮播到最后一帧停止
                                        delay: cell.IntervalScrollH
                                    };
                                }
                            }

                            var mySwiper = new Swiper("#" + td.attr("id") + " .swiper-container", params);
                            mySwiper.navigation.$nextEl.addClass('hide');
                            mySwiper.navigation.$prevEl.addClass('hide');
                            $("#" + td.attr("id") + " .swiper-container").mouseenter(function () {
                                var scrollH = parseInt(cell.IntervalScrollH);  //是否水平滚动
                                if (scrollH > 0) {
                                    mySwiper.autoplay.stop();  //whj 解决了横向设为0时也会滚动的问题
                                }
                                mySwiper.navigation.$nextEl.removeClass('hide');
                                mySwiper.navigation.$prevEl.removeClass('hide');
                                mySwiper.navigation.$nextEl.addClass('show');
                                mySwiper.navigation.$prevEl.addClass('show');
                            }).mouseleave(function () {
                                var scrollH = parseInt(cell.IntervalScrollH);  //是否水平滚动
                                if (scrollH > 0) {
                                    mySwiper.autoplay.start();
                                }
                                mySwiper.navigation.$nextEl.removeClass('show');
                                mySwiper.navigation.$prevEl.removeClass('show');
                                mySwiper.navigation.$nextEl.addClass('hide');
                                mySwiper.navigation.$prevEl.addClass('hide');
                            });
                        });
                    }

                    if (isSubReportCellPercent) {
                        td.find('.swiper-slide').css('overflow-x', 'hidden');
                    }
                }


            },
            /**
             * 绘制填报控件
             *
             * @param {Element} td          主报表单元格容器元素
             * @param {Object}  cell        主报表单元格属性集
             * @param {Object}  reportData  子报表数据集
             * @param {Boolean} isSubReport 是否为子报表
             * @param {String}  psheetname  Sheet名称
             */
            drawUpdateDataWidget: function (td, cell, reportData, isSubReport, psheetname) {


                var cellProps = cell.N;
                if (cell.hasOwnProperty("FirstCellRelation")) {
                    td.attr("firstcellrelation", cell.FirstCellRelation);
                    td.attr("FirstCellUploadName", cell.FirstCellUploadName);
                    td.attr("FirstCellRelationRawLoc", cell.FirstCellRelationRawLoc);
                    td.attr("rawLoc", cell.R);
                }
                if (cell.hasOwnProperty("NullRecord")) {
                    // 空白页面,新增填报
                    td.parent().data("NullRecord", cell.NullRecord);
                }
                if (!cell.hasOwnProperty("IsAllowEdit")) {//一般表示主键ID不能修改
                    if (cell.hasOwnProperty("R")) { //RawLocation -> R
                        td.data("text", cell.T);
                        td.data("meta", Report.GI.getDataBaseMetaInfo(cell.R.split(","), reportData));
                    }

                } else {//剩余可以编辑的列
                    var coordinate = cell.R.split(",");
                    var props = Report.GI.getCellEditWidget(parseInt(coordinate[0]), parseInt(coordinate[1]), reportData),
                        _editWidgetHtml = '',
                        _hint = props.Hint;
                    var regions = '';//控件联动专用
                    if (cell.hasOwnProperty("RepaintRegions")) {
                        regions = encodeURI(cell.RepaintRegions);
                    }
                    td.data("text", (cell.hasOwnProperty("V") ? cell.V : cell.T)); //ActualValue->V
                    td.data("meta", Report.GI.getDataBaseMetaInfo(coordinate, reportData));
                    td.data("props", props);
                    if (!cell.IsAllowEdit) {//判断控件是否展示
                        return false;
                    }

                    var controlName = props.ControlName;
                    var showName = controlName;
                    if (controlName != undefined && controlName != '') {
                        if ($.inArray(controlName, controlNames) == -1) {
                            controlNameInfo[controlName] = 0;
                            controlNames.push(controlName);
                        } else {
                            var number = controlNameInfo[controlName];
                            var newNum = parseInt(number + 1);

                            controlNameInfo[controlName] = newNum;
                            //showName = controlName + '_@' + newNum;
                            showName = controlName + '_' + newNum;
                            pluginIndex = newNum + 1; //页面计数器自增
                        }
                    }

                    var align;
                    if (!cell.hasOwnProperty('AH')) {
                        align = 'center';
                    } else {
                        if (cell.AH == 1) {
                            align = 'left';
                        } else {
                            align = 'right';
                        }
                    }
                    var weight = (cellProps[16] == 1 ? "bold" : "normal");
                    var colorIndex = cellProps[19];
                    var color = colorList[colorIndex];
                    var style = (cellProps[17] == 1 ? "italic" : "normal");
                    var decoration = (cellProps[18] == 1 ? "underline" : "none");
                    var fontSize = cellProps[15];
                    var fontFamily = fontList[cellProps[14]];


                    if (ReportConstant.HControlType.ControlType_TextEdit === props.ControlType) {
                        td.empty();
                        td.css({"position": "relative"});
                        _editWidgetHtml = '<input class="ef-tb-textfield" type="text" name="' + showName + '" rawname="' + controlName + '" title="' + _hint + '" value="' + (cell.T == undefined ? "" : cell.T) + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';"/>';
                    } else if (ReportConstant.HControlType.ControlType_ComboBox === props.ControlType) {
                        td.empty();
                        td.css({"text-align": ""});
                        var actualValue = '';
                        if (cell.hasOwnProperty("V")) {  //ActualValue->V
                            actualValue = cell.V; //ActualValue->V
                        } else {
                            actualValue = cell.T;
                        }
                        td.data("V", actualValue);
                        _editWidgetHtml = '<select class="ef-tb-select" title="' + _hint + '" sel="2" vs="' + actualValue + '" reg="' + regions + '" name="' + showName + '">';
                        $.each(props.DataDict, function (_i, _n) {
                            _editWidgetHtml += '<option value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + _n.Value + '</option>';
                        });
                        _editWidgetHtml += '</select>';
                    } else if (ReportConstant.HControlType.ControlType_ComboBoxMultiSel === props.ControlType) {
                        td.css({"position": "relative"});
                        td.css({"text-align": ""});
                        var displayText = [];
                        if (cell.hasOwnProperty("V")) { //ActualValue->V
                            $.each(props.DataDict, function (_i, _n) {
                                if (cell.V.indexOf(_n.Key) > -1) { //ActualValue->V
                                    displayText.push(_n.Value);
                                }
                            });
                        }
                        _editWidgetHtml = '<input type="hidden" value="' + (cell.hasOwnProperty("V") ? cell.V : "") + '"/>'; //ActualValue->V
                        _editWidgetHtml += '<select class="ef-tb-select" title="' + _hint + '" sel="3" vs="' + cell.V + '" reg="' + regions + '" name="' + showName + '" style = "width:100%">';
                        $.each(props.DataDict, function (_i, _n) {
                            _editWidgetHtml += '<option value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';" >' + _n.Value + '</option>';
                        });
                        _editWidgetHtml += '</select>';
                    } else if (ReportConstant.HControlType.ControlType_Date === props.ControlType) {
                        td.css({"position": "relative"});
                        td.data("V", (cell.hasOwnProperty("V") ? cell.V : cell.T)); //ActualValue->V
                        _editWidgetHtml = '<input date="1" name="' + showName + '" class="ef-tb-textfield" type="text" title="' + _hint + '"'
                        + ' value="' + (cell.hasOwnProperty("V") ? cell.V : cell.T) + '" reg="' + regions + '" hasTime="' + props.HasTime + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';"/>'; //ActualValue->V
                    } else if (ReportConstant.HControlType.ControlType_CheckBox === props.ControlType) {
                        td.css({"text-align": ""});
                        var name = '_checkbox' + td.attr("id");
                        var valArr;
                        $.each(props.DataDict, function (_i, _n) {
                            _editWidgetHtml += '<input widget="SINGLETON_CHECKBOX" reg="' + regions + '" type="checkbox" checkbox="1" title="' + _hint + '" value="' + _n.Key + '"  name="' + name + '" ' + ($.inArray(_n.Key, cell.V) != -1 ? 'checked="checked"' : '') + ' /><label>' + _n.Value + '</label>';
                        });
                    } else if (ReportConstant.HControlType.ControlType_Number === props.ControlType) {
                        td.css({"position": "relative"});
                        _editWidgetHtml = '<input class="ef-tb-textfield" type="text" title="' + _hint + '" value="' + (cell.T == undefined ? "" : cell.T) + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';" name="' + showName + '"/>';
                    } else if (ReportConstant.HControlType.ControlType_Button === props.ControlType) {
                        if (ReportConstant.BUTTONTYPE.AddButton === props.ButtonType) {
                            var text = props.ButtonText;
                            if ('' == text || undefined == text) {
                                text = '增加行';
                            }
                            _editWidgetHtml = ' <button class="layui-btn"  name="addButton"  onclick="Report.GI.createRecordByButton(this);"  style="background-color: white;width:100%;height:100%;padding:0px;font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';"><i class="layui-icon" style="font-size: 22px; color: #009688;font-weight:bold;">&#xe61f;</i></button>';
                        } else if (ReportConstant.BUTTONTYPE.DelButton === props.ButtonType) {
                            var text = props.ButtonText;
                            if ('' == text || undefined == text) {
                                text = '删除行';
                            }
                            _editWidgetHtml = '<button class="layui-btn"  onclick="Report.GI.deleteRecord(this);" style="background-color: white;width:100%;height:100%;padding:0px;"><i class="layui-icon" style="font-size: 22px; color: #009688;font-weight:bold;">&#xe640;</i></button>';
                        } else if (ReportConstant.BUTTONTYPE.CommButton === props.ButtonType) {
                            _editWidgetHtml = '<button class="layui-btn" name="' + showName + '" rawname="' + controlName + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + props.ButtonText + '</button>';
                        }
                    } else if (ReportConstant.HControlType.ControlType_RadionButtonGroup === props.ControlType) {
                        td.data("V", cell.V); //ActualValue->V
                        var name = '_radio' + td.attr("id");
                        $.each(props.DataDict, function (_i, _n) {
                            _editWidgetHtml += '<input name="' + name + '" reg="' + regions + '" type="radio" title="' + _hint + '" value="' + _n.Key + '" ' + (_n.Key == cell.V ? 'checked="checked"' : '') + '/>' + _n.Value + '<br>'; //ActualValue->V

                        });
                        td.css({"text-align": ""});
                    } else if (ReportConstant.HControlType.ControlType_File === props.ControlType) {
                        if (cell.hasOwnProperty("Pic")) {
                            td.css("background", "none"); //PIC为背景图片时，移除该属性
                            var _img = cell.Pic.substring(cell.Pic.indexOf("export")),
                                _src = fileSrc + _img,
                                _H = cell.hasOwnProperty("IH") ? this.getAlignStyleValue(cell.IH) : 'left',//ImageAlignH->IH
                                _V = cell.hasOwnProperty("IV") ? this.getAlignStyleValue(cell.IV) : 'top'; //ImageAlignV->IV
                            //ActualValue->V
                            _editWidgetHtml += '<input type="hidden" value="' + cell.V + '"/><input style="display: none;" type="file" accept="' + Report.GI.processFileMime(props.FileType) + '" onchange="Report.GI.doUploadFile(this,\'' + props.FileType + '\',' + props.SizeLimit + ')"/><img src="' + basePath + _src + '" title="' + _hint + '" onclick="this.previousElementSibling.click();" style="width:' + td.width() + 'px;height:' + td.height() + 'px;background-size:cover;">';

                            td.data("V", cell.V).css({"text-align": _H, "vertical-align": _V});//ActualValue->V
                        } else {
                            _editWidgetHtml += '<input type="hidden" /><input type="file" title="' + _hint + '" accept="' + Report.GI.processFileMime(props.FileType) + '" onchange="Report.GI.doUploadFile(this,\'' + props.FileType + '\',' + props.SizeLimit + ')" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';"/>';
                        }
                    }
                    td.html(_editWidgetHtml);
                    if (ReportConstant.HControlType.ControlType_TextEdit === props.ControlType) { //文本编辑框
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾


                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {
                                    if (type == 3) {
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('input[type="text"][name="' + showName + '"]').bind('change', fun);
                                    }
                                    if (type == 2) {
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('input[type="text"][name="' + showName + '"]').bind('focus', fun);
                                    }
                                    if (type == 1) {
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                            td.find('input[type="text"][name="' + showName + '"]').bind('init', fun);
                                            td.find('input[type="text"][name="' + showName + '"]').trigger('init');
                                            td.find('input[type="text"][name="' + showName + '"]').attr('init', 'true');
                                            td.find('input[type="text"][name="' + showName + '"]').data('initCode', code);
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }

                                    }
                                }

                            })
                        }
                    }


                    if (ReportConstant.HControlType.ControlType_ComboBox === props.ControlType) { //单选下拉框
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾


                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {
                                    if (type == 6) { //改变事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('select[name="' + showName + '"]').bind('change', fun);
                                    }

                                    if (type == 5) { //初始化事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                            td.find('select[name="' + showName + '"]').bind('init', fun);
                                            td.find('select[name="' + showName + '"]').trigger('init');
                                            td.find('select[name="' + showName + '"]').attr('init', 'true');
                                            td.find('select[name="' + showName + '"]').data('initCode', code);
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }

                                    }
                                }

                            })
                        }
                    }

                    if (ReportConstant.HControlType.ControlType_ComboBoxMultiSel === props.ControlType) { //多选下拉框
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾


                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {
                                    if (type == 8) { //改变事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('select[name="' + showName + '"]').bind('change', fun);
                                    }

                                    if (type == 7) { //初始化事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                            td.find('select[name="' + showName + '"]').bind('init', fun);
                                            td.find('select[name="' + showName + '"]').trigger('init');
                                            td.find('select[name="' + showName + '"]').attr('init', 'true');
                                            td.find('select[name="' + showName + '"]').data('initCode', code);
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }

                                    }
                                }

                            })
                        }
                    }

                    if (ReportConstant.HControlType.ControlType_Number === props.ControlType) { //数字编辑框
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾


                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {
                                    if (type == 11) {
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('input[type="text"][name="' + showName + '"]').bind('change', fun);
                                    }
                                    if (type == 10) {
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('input[type="text"][name="' + showName + '"]').bind('focus', fun);
                                    }
                                    if (type == 9) {
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                            td.find('input[type="text"][name="' + showName + '"]').bind('init', fun);
                                            td.find('input[type="text"][name="' + showName + '"]').trigger('init');
                                            td.find('input[type="text"][name="' + showName + '"]').attr('init', 'true');
                                            td.find('input[type="text"][name="' + showName + '"]').data('initCode', code);
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }

                                    }
                                }

                            })
                        }
                    }

                    if (ReportConstant.BUTTONTYPE.CommButton === props.ButtonType) {
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾

                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {

                                    if (type == 4) {
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('button[name="' + showName + '"]').bind('click', fun);
                                    }

                                }
                            })
                        }

                    }
                    if (ReportConstant.HControlType.ControlType_CheckBox === props.ControlType) { //检查框
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾


                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {
                                    if (type == 13) { //改变事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('input[name="' + showName + '"]').bind('change', fun);
                                    }

                                    if (type == 12) { //初始化事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                            td.find('input[name="' + showName + '"]').bind('init', fun);
                                            td.find('input[name="' + showName + '"]').trigger('init');
                                            td.find('input[name="' + showName + '"]').attr('init', 'true');
                                            td.find('input[name="' + showName + '"]').data('initCode', code);
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }

                                    }
                                }

                            })
                        }
                    }

                    if (ReportConstant.HControlType.ControlType_Date === props.ControlType) { //日期
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾
                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {
                                    if (type == 15) { //改变事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        //td.find('input[name="' + showName + '"]').bind('change', fun);
                                        td.find('input[name="' + showName + '"]').click(function () {
                                            var fmt = eval($(this).attr("hasTime")) ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
                                            WdatePicker({
                                                dateFmt: fmt,
                                                readOnly: true,
                                                onpicked: fun

                                            });
                                        });
                                    }

                                    if (type == 14) { //初始化事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                            td.find('input[name="' + showName + '"]').bind('init', fun);
                                            td.find('input[name="' + showName + '"]').trigger('init');
                                            td.find('input[name="' + showName + '"]').attr('init', 'true');
                                            td.find('input[name="' + showName + '"]').data('initCode', code);
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }

                                    }
                                }

                            })
                        }
                    }

                    if (ReportConstant.HControlType.ControlType_RadionButtonGroup === props.ControlType) { //日期
                        var name = props.ControlName; //控件名
                        var events = props.Events; //控件事件
                        if (events != undefined) {
                            $.each(events, function (index, element) {
                                var type = element.Type; //类型
                                var code = element.Code; //
                                var start = code.indexOf("{");
                                var end = code.lastIndexOf("}");
                                code = code.substring(start + 1, end); //去除头尾


                                var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                                subcode = subcode.replace(/[ ]/g, ""); //删除空格；

                                if (subcode != "") {
                                    if (type == 17) { //改变事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }
                                        td.find('input[name="' + showName + '"]').bind('change', fun);
                                    }

                                    if (type == 16) { //初始化事件
                                        var fun;
                                        try {
                                            fun = new Function(code); //转化为函数
                                            td.find('input[name="' + showName + '"]').bind('init', fun);
                                            td.find('input[name="' + showName + '"]').trigger('init');
                                            td.find('input[name="' + showName + '"]').attr('init', 'true');
                                            td.find('input[name="' + showName + '"]').data('initCode', code);
                                        } catch (err) {
                                            console.log(err);
                                            return true;
                                        }

                                    }
                                }

                            })
                        }
                    }
                }


            },
            /**
             * 判断内容对齐方式
             *
             * @param {Number} flag 对齐方式数字
             *
             * @return {String} 对齐方式字符串
             */
            getAlignStyleValue: function (flag) {
                var value;

                switch (flag) {
                    case ReportConstant.AlignFlag.AlignFlagLeft:
                        value = "left";
                        break;
                    case ReportConstant.AlignFlag.AlignFlagRight:
                        value = "right";
                        break;
                    case ReportConstant.AlignFlag.AlignFlagHCenter:
                        value = "center";
                        break;
                    case ReportConstant.AlignFlag.AlignFlagTop:
                        value = "top";
                        break;
                    case ReportConstant.AlignFlag.AlignFlagBottom:
                        value = "bottom";
                        break;
                    case ReportConstant.AlignFlag.AlignFlagVCenter:
                        value = "middle";
                        break;
                    default:
                        value = "";
                        break;
                }

                return value;
            },
            setBounds: function () {
                $(".x-field-area, .x-menubar, .x-panel, .x-container").css({"width": $("body").outerWidth()});
                $(".x-panel, .x-container").css({"height": ($("body").outerHeight() - $(".x-sheet").height() - ($(".x-menubar").is(":hidden") ? 0 : $(".x-menubar").height()) - ($("#_field_").is(":hidden") ? 0 : $("#_field_").height()))});
                //whj 如果保持横纵比，进入全屏后，由于$('.x-data-bg')的高度小于table高度，尾部变成黑色，需要将高度重新设置一下
                if (__data.WebCellPercent === 1) {//如果自适应
                    if (__data.KeepHVRatio === 0) {//如果不保持横纵比
                        if ($('.x-table').height() > $('.x-panel').height()) {
                            $('.x-panel').css("height", $('.x-table').height());
                            $('.x-container').css("height", $('.x-table').height());
                        }
                    } else { //如果保持横纵比，会向下产生滚动条
                        if ($('.x-data-bg').height() <= $('.x-table').height()) { //如果表格高度大于包裹容器高度，需要将容器高度变大，以产生滚动条
                            $('.x-data-bg').css("height", $('.x-table').height());
                        } else { //如果表格高度小于包裹容器高度
                            if ($('.x-data-bg').height() > $('.x-container').height()) {//如果包裹容器高度大于container容器的高度，会产生黑色尾部
                                $('.x-data-bg').css("height", $('.x-container').height());
                            }

                        }
                    }

                } else {
                    $('.x-data-bg').css("height", $('.x-container').height());
                    if ($('.x-data-bg').height() <= $('.x-table').height()) { //如果表格高度大于包裹容器高度
                        if ($('.x-table').length == 1) {
                            $('.x-data-bg').css("height", $('.x-table').height());
                        }
                    } else {
                        if ($('.x-data-bg').height() > $('.x-container').height()) {//如果表格过度小于包裹容器高度，并且容器高度大于x-container的高度，会产生纵向滚动条
                            $('.x-data-bg').css("height", $('.x-container').height());
                        }
                    }

                }
                //如果存在固定行列的行为，该段代码主要用于修复高度偏差的问题
                if ($('.top-left-fixed-container')) {
                    $('.top-left-fixed-container').css("height", $('.top-left-fixed-container').parent().height());
                    $('.top-left-fixed-container').find('.x-table').css("height", $('.top-left-fixed-container').height())
                }

                if (__data.IsShowCenterReport) { //解决居中显示问题

                    var pWidth = $('.x-data-bg_block').width(); //x-data-bg宽度
                    var tWidth = $('.x-data-bg_block').find('.x-table').width(); //table宽度
                    var left = Math.floor((pWidth - tWidth) / 2);
                    $('.x-data-bg_block').find('.x-table').css({
                        "left": left
                    })
                }


                $('.x-table').css("white-space", "pre-line"); //解决文本换行的问题 whj

                if (_g_mobile) {

                    var showPTB = __data.ShowParamToolBar;
                    var showTB = __data.ShowToolBar;
                    if (showPTB && showTB) { //显示一般工具栏和参数工具栏
                        $('.x-menubar').show();
                        $('.x-panel').css("height", $('.x-body').height() - 94);
                        $('.x-container').css("height", $('.x-body').height() - 94);
                        $('.x-data-bg').css("height", $('.x-body').height() - 94);
                    } else {

                        if (showPTB) {
                            $('.x-menubar').show();
                            $('.x-menubar').css('min-height', 0);
                            $('.x-menubar').css('height', 73);
                            $('.x-menubar').find('.page').hide();
                            $('.x-panel').css("height", $('.x-body').height() - 73);
                            $('.x-container').css("height", $('.x-body').height() - 73);
                            $('.x-data-bg').css("height", $('.x-body').height() - 73);
                        } else if (showTB) {
                            $('.x-menubar').show();
                            $('.x-menubar').css('min-height', 0);
                            $('.x-menubar').css('height', 24);
                            $('.x-panel').css("height", $('.x-body').height() - 24);
                            $('.x-container').css("height", $('.x-body').height() - 24);
                            $('.x-data-bg').css("height", $('.x-body').height() - 24);
                        } else {
                            $('.x-menubar').css('min-height', 0);
                            $('.x-menubar').height(0);
                            $('.x-panel').css("height", $('.x-body').height());
                            $('.x-container').css("height", $('.x-body').height());
                            $('.x-data-bg').css("height", $('.x-body').height());
                        }
                    }
                }

            },
            displayFeedback: function (obj, msg) {
                $("#" + obj).html("<h3>" + msg + "</h3>");
                Report.RV.setBounds();
            },
            /**
             * 子报表内容往上滚动
             *
             * @param {Element} elem 内容父节点元素
             * @param {Object}  data 滚动属性集
             */
            contentMarquee: function (elem, data) {
                //var elemHeight = elem.parent().height();   //
                var _StepScrollV = parseInt(data.StepScrollV);     // 滚动像素
                var _IntervalScrollV = data.IntervalScrollV;// 滚动周期
                fn = function () {
                    var totalScroll = Math.ceil(elem.scrollTop()); //防止出现小数导致无法回滚到头部的问题 whj
                    if ((totalScroll + elem.parent().height()) >= elem.children(":first").height()) {
                        totalScroll = 0;
                    } else {
                        totalScroll += _StepScrollV;
                    }

                    elem.scrollTop(totalScroll);
                },
                    timer = setInterval(fn, _IntervalScrollV);

                elem.hover(function () {
                    clearInterval(timer);
                }, function () {
                    timer = setInterval(fn, _IntervalScrollV);
                });
            },
            /**
             * 缩放重计算表格宽、高值
             *
             * @param {Element} $container 缩放元素外部容器
             * @param {Object}  data       缩放元素
             *
             * @return {Array} 横、纵比率
             */
            reCalTableWidthAndHeight: function ($container, data) {
                var _Page = data.Pages[0],
                    _Rows = _Page.Rows,
                    _Columns = _Page.Columns,
                    khvr = __data.KeepHVRatio,                                                                  // 1,保持横纵比; 0,不保持横纵比
                    containerWidth = (!!$container.attr("ow") ? $container.attr("ow") : $container.width()) - __g_booboo, // 页面宽度-滚动条宽度
                    containerHeight = (!!data.ShowToolBar ? $container.height() - 29 : $container.height()) - __g_booboo,  // 页面高度
                    tableWidth = this.getColumnWidthTotal(_Columns),                                                   // 表格总宽度
                    tableHeight = this.getRowHeightTotal(_Rows),                                                     // 表格总高度
                    hRatio = containerWidth / tableWidth,
                //根据是否有横纵比来判断如何计算td的高度，如果有横纵比，用td宽度*横纵比来计算高度
                    vRatio = (0 === khvr) ? (containerHeight / tableHeight) : hRatio;

                var i, tmp = 0, total = 0;
                for (i = 0; i < _Columns.Count; i++) {
                    tmp = 0;

                    if (i === (_Columns.Count - 1)) {
                        tmp = Math.floor(_Columns.ColumnArray[i].W * hRatio); //不用四舍五入，直接向下取整 whj
                        _Columns.ColumnArray[i].W = tmp;
                    } else {
                        tmp = Math.floor(_Columns.ColumnArray[i].W * hRatio); //不用四舍五入，直接向下取整 whj
                        total += tmp;
                        _Columns.ColumnArray[i].W = tmp;
                    }
                }

                total = 0;
                for (i = 0; i < _Rows.Count; i++) {
                    tmp = 0;

                    if (i === (_Rows.Count - 1)) {
                        //_Rows.RowArray[i].Height = containerHeight - total-3;
                        tmp = Math.floor(_Rows.RowArray[i].H * vRatio); //不用四舍五入，直接向下取整 whj
                        _Rows.RowArray[i].H = tmp;
                    } else {
                        tmp = Math.floor(_Rows.RowArray[i].H * vRatio); //不用四舍五入，直接向下取整 whj
                        total += tmp;
                        _Rows.RowArray[i].H = tmp;
                    }
                }

                return [hRatio, vRatio];
            },
            reCalSubTableWidthAndHeight: function ($container, data, isKeep) {
                var _Page = data.Pages[0],
                    _Rows = _Page.Rows,
                    _Columns = _Page.Columns,
                    khvr = isKeep,                                                                  // 1,保持横纵比; 0,不保持横纵比
                    containerWidth = (!!$container.attr("ow") ? $container.attr("ow") : $container.width()) - __g_booboo, // 页面宽度-滚动条宽度
                    containerHeight = (!!data.ShowToolBar ? $container.attr("oh") - 29 : $container.attr("oh")) - __g_booboo,  // 页面高度
                    tableWidth = this.getColumnWidthTotal(_Columns),                                                   // 表格总宽度
                    tableHeight = this.getRowHeightTotal(_Rows),                                                     // 表格总高度
                    hRatio = containerWidth / tableWidth,
                //根据是否有横纵比来判断如何计算td的高度，如果有横纵比，用td宽度*横纵比来计算高度
                    vRatio = (false === khvr) ? (containerHeight / tableHeight) : hRatio;
                var i, tmp = 0, total = 0;
                for (i = 0; i < _Columns.Count; i++) {
                    tmp = 0;

                    if (i === (_Columns.Count - 1)) {
                        tmp = Math.floor(_Columns.ColumnArray[i].W * hRatio); //不用四舍五入，直接向下取整 whj
                        // total += tmp;
                        _Columns.ColumnArray[i].W = tmp;
                    } else {
                        tmp = Math.floor(_Columns.ColumnArray[i].W * hRatio); //不用四舍五入，直接向下取整 whj
                        total += tmp;
                        _Columns.ColumnArray[i].W = tmp;
                    }
                }

                total = 0;
                for (i = 0; i < _Rows.Count; i++) {
                    tmp = 0;

                    if (i === (_Rows.Count - 1)) {
                        tmp = Math.floor(_Rows.RowArray[i].H * vRatio); //不用四舍五入，直接向下取整 whj
                        // total += tmp;
                        _Rows.RowArray[i].H = tmp;
                    } else {
                        tmp = Math.floor(_Rows.RowArray[i].H * vRatio); //不用四舍五入，直接向下取整 whj
                        total += tmp;
                        _Rows.RowArray[i].H = tmp;
                    }
                }

                return [hRatio, vRatio];
            }
        },
        DW: {
            drawShapes: function (shape, ratio) {
                /*
                 *
                 * "Height": 160,
                 "HtmlFile": "10002/sheet1_悬浮插件1.html",
                 "Name": "悬浮插件1",
                 "Type": 1,
                 "Width": 160,
                 "X": 23,
                 "Y": 19
                 *
                 * */
                $.each(shape, function (index, element) {


                    if (mainRatio.length == 0) {
                        var height = element.Height; //悬浮元素高度
                        var width = element.Width; //悬浮元素宽度
                        var HtmlFile = element.HtmlFile;
                        var x = element.X; //x轴位置
                        var y = element.Y; //y轴位置
                        var html;
                        var html;
                        var borderStyle = '';
                        if (element.BW != undefined) { //边框
                            borderStyle = 'border-style:solid;border-width:' + element.BW + 'px;border-color:' + element.BC + ';box-sizing:border-box;';
                        }
                        if (element.BKPic != undefined && element.HtmlFile != undefined) { //有背景图片和插件
                            var bgImg = element.BKPic.split("/");
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (_home + exportpathApp + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"><iframe id="fra" src="' + _home + exportpathApp + '/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                        } else if (element.HtmlFile != undefined) {//只有插件
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"><iframe id="fra" src="' + _home + exportpathApp + '/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                        } else if (element.BKPic != undefined) {//只有背景图片
                            var bgImg = element.BKPic.split("/");
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (_home + exportpathApp + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"></div>'
                        } else {
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"></div>'
                        }
                        $('.x-data-bg').append(html);
                    } else {
                        var height = element.Height * mainRatio[0]; //悬浮元素高度
                        var width = element.Width * mainRatio[0]; //悬浮元素宽度
                        var HtmlFile = element.HtmlFile;
                        var x = element.X * mainRatio[0]; //x轴位置
                        var y = element.Y * mainRatio[1]; //y轴位置
                        //var html = '<div class="shape" style="position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"><iframe id="fra" src="' + _home + exportpathApp + '/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                        var html;
                        if (element.BKPic != undefined && element.HtmlFile != undefined) { //有背景图片和插件
                            var bgImg = element.BKPic.split("/");
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (_home + exportpathApp + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"><iframe id="fra" src="' + _home + exportpathApp + '/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                        } else if (element.HtmlFile != undefined) {//只有插件
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"><iframe id="fra" src="' + _home + exportpathApp + '/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                        } else if (element.BKPic != undefined) {//只有背景图片
                            var bgImg = element.BKPic.split("/");
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (_home + exportpathApp + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"></div>'
                        } else {
                            html = '<div class="shape" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;"></div>'
                        }
                        $('.x-data-bg').append(html);
                    }


                })

            }
            ,
            drawWidget: function (xml, myparam) {

                var myparam = isNull(myparam) ? "" : myparam.split(";");
                var paramDesc = [];  //控件描述参数
                //whj
                var options = $(xml).find("ParamOption");
                var rowCount = options.find("ParamCountByRow").text(); //每行数量
                var left = options.find("LeftMargin").text(); //左边间隔
                var leftNum = parseInt(left);
                var top = options.find("TopMargin").text(); //上方间隔
                var topNum = parseInt(top);
                var interval = options.find("ParamInterval").text(); //参数间隔
                var row = parseInt(rowCount);
                var searchByDefaultParam = options.find("SearchByDefaultParam").text(); //是否自动查询

                $('#_field_').css("margin-top", topNum + 'px');
                $('#_field_').css("margin-left", leftNum + 'px');

                $(xml).find("ReportParam").each(function (i) {
                    var _ParamName = $(this).find("ParamName").text(), //参数名
                        _isAffectParams = $(this).find("IsAffectParams").text(); //是否联动标志  whj
                    var paramObj = {};
                    paramObj.name = _ParamName;
                    paramObj.isAffect = _isAffectParams;
                    paramDesc.push(paramObj);

                });

                var paramStr = JSON.stringify(paramDesc);
                paramStr = paramStr.replace(/\"/g, "\\'"); //将双引号变为转义单引号

                var paramIndex = 0;
                $(xml).find("ReportParam").each(function (i) {
                    var _ParamName = $(this).find("ParamName").text(),
                        _ParamType = $(this).find("ParamType").text(),
                    //1字符串 2整型 3浮点 4日期时间 5布尔,,,,当2,3时，必须要输入数据
                        _DataType = $(this).find("DataType").text(),
                        _labelName = $(this).find("labelName").text(),
                        _isAffectParams = $(this).find("IsAffectParams").text(), //是否联动标志  whj
                        _width = $(this).find("Width").text(),
                    // _widget = "<label style='margin-left: " + leftNum + "px;margin-top:" + topNum + "px'>" + _labelName + "</label>&nbsp;";
                        _widget = "<label>" + _labelName + "</label>&nbsp;";
                    var isShow = $(this).find("IsShow").text(); //是否显示

                    if (isShow == 1) {
                        if (paramIndex % row === 0) {
                            _widget = "<br />" + _widget;
                        }
                        paramIndex++;
                    } else {
                        return;
                    }
                    $("#_field_").show();
                    var _optionHtml = ''; //select option html文本
                    var _def_val = $(this).find("DefaultValue").text();
                    if (!isNull(myparam)) {
                        for (var i = 0; i < myparam.length; i++) {
                            if (myparam[i].indexOf("=") > -1) {
                                var p = myparam[i].split("=");
                                if (p[0] == _ParamName) {
                                    _def_val = p[1].split(";")[0];
                                }
                            }
                        }
                    }
                    if (ReportConstant.HControlType.ControlType_TextEdit == _ParamType) { //文本编辑框
                        if (_isAffectParams == 1) {
                            _widget += '<input type="text"  style="margin-bottom:5px;margin-right:' + parseInt(interval) + 'px;width:' + parseInt(_width) + 'px;" datatype="' + _DataType + '" labelname="' + _labelName + '" name="' + _ParamName + '" value="' + _def_val + '" onChange = "changeSelect(' + '\'' + paramStr + '\'' + ',' + '\'' + _ParamName + '\'' + ')">';
                        } else {
                            _widget += "<input type='text'  style='margin-bottom:5px;margin-right:" + parseInt(interval) + "px;width:" + parseInt(_width) + "px;' datatype='" + _DataType + "' labelname='" + _labelName + "' name='" + _ParamName + "' value='" + _def_val + "' />";
                        }
                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }

                    } else if (ReportConstant.HControlType.ControlType_ComboBox == _ParamType) { //下拉框
                        if (_isAffectParams == 1) { //是联动控件
                            //绑定下拉事件
                            _widget += '<select  style="margin-bottom:5px;margin-right:' + parseInt(interval) + 'px;width:' + parseInt(_width) + 'px;" datatype="' + _DataType + '" labelname="' + _labelName + '"  class="ef-tb-select" name="' + _ParamName + '" id="' + _ParamName + '" sel="2" vs="' + _def_val + '" onChange = "changeSelect(' + '\'' + paramStr + '\'' + ',' + '\'' + _ParamName + '\'' + ')">';
                        } else { //非联动控件
                            _widget += '<select  style="margin-bottom:5px;margin-right:' + parseInt(interval) + 'px;width:' + parseInt(_width) + 'px;" datatype="' + _DataType + '" labelname="' + _labelName + '"  class="ef-tb-select" name="' + _ParamName + '" sel="2" vs="' + _def_val + '" >';
                        }


                        $(this).find("NodeData").each(function (_i, _n) {
                            if ($(this).find("ShowFieldData").text() == _def_val) {
                                _optionHtml += '<option value="' + $(this).find("ActualFieldData").text() + '">' + $(this).find("ShowFieldData").text() + '</option>';
                            }
                        });

                        $(this).find("NodeData").each(function (_i, _n) {
                            if ($(this).find("ShowFieldData").text() != _def_val) {
                                _optionHtml += '<option value="' + $(this).find("ActualFieldData").text() + '">' + $(this).find("ShowFieldData").text() + '</option>';
                            }
                        });

                        _widget += _optionHtml;
                        _widget += '</select>';

                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }

                        var ct = $('select[name="' + _ParamName + '"]')
                        var data = {
                            width: _width,
                            language: 'zh-CN',
                            placeholder: '请搜索',
                            allowClear: true,
                            title: ct.attr('title')
                        };

                        ct.select2(data);
                        ct.val(_def_val).select2(data);


                    } else if (ReportConstant.HControlType.ControlType_ComboBoxMultiSel == _ParamType) { //多选下拉，目前不做联动
                        _widget += "<input type='hidden'  datatype='" + _DataType + "' labelname='" + _labelName + "'  name='" + _ParamName + "' value='" + _def_val + "' />";
                        var data = $(this).find("NodeData");
                        if (_isAffectParams == 1) { //是联动控件
                            _widget += '<select style="margin-bottom:5px;margin-right:' + parseInt(interval) + 'px; width:' + parseInt(_width) + 'px;" class="ef-tb-select" id="' + _ParamName + '" sel="3" vs="' + _def_val + '" onChange = "changeSelect(' + '\'' + paramStr + '\'' + ',' + '\'' + _ParamName + '\'' + ')">';
                        } else {
                            _widget += '<select style="margin-bottom:5px;margin-right:' + parseInt(interval) + 'px; width:' + parseInt(_width) + 'px;" class="ef-tb-select" id="' + _ParamName + '" sel="3" vs="' + _def_val + '">';

                        }

                        _widget += '<option value="selAll" >全选</option>';

                        $.each(data, function (_i, _n) {
                            _widget += '<option value="' + $(this).find("ActualFieldData").text() + '" >' + $(this).find("ShowFieldData").text() + '</option>';
                        });
                        _widget += '</select>';

                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }
                        var ct = $('#' + _ParamName);
                        var data1 = {
                            width: _width,
                            language: 'zh-CN',
                            placeholder: '请搜索',
                            multiple: true,
                            allowClear: true,
                            title: ct.attr('title')
                        };
                        ct.select2(data1);
                        if (!isNull(ct.attr('vs'))) {
                            ct.val(ct.attr('vs').split(',')).trigger('change');
                        } else {
                            ct.val("").select2(data1);
                        }
                        ct.change(function () {
                            if ($.inArray("selAll", ct.select2('val')) != -1) { //增加全选功能
                                ct.val("");
                                var option_list = [];
                                $.each(data, function (_i, _n) {
                                    option_list.push($(this).find("ActualFieldData").text());
                                });
                                ct.val(option_list).trigger("change");
                                ct.attr("vs", option_list.join());
                                ct.next().css("width", ""); //自适应宽度

                            } else {
                                ct.attr("vs", isNull(ct.select2('val')) ? '' : ct.select2('val').join());
                                ct.prev().val(isNull(ct.select2('val')) ? '' : ct.select2('val').join());
                                ct.next().css("width", ""); //自适应宽度
                                ct.next().css("min-width", parseInt(_width) + 'px');
                            }

                        });

                    } else if (ReportConstant.HControlType.ControlType_ComboTree == _ParamType) { //单选下拉树
                        _widget += "<input type='hidden' datatype='" + _DataType + "' labelname='" + _labelName + "' name='" + _ParamName + "' value='" + _def_val + "' />";
                        _widget += "<input type='text' readonly='readonly' id='" + _ParamName + "' style='margin-bottom:5px;width: " + parseInt(_width) + "px; height: " + $(this).find("ControlHeight").text() + "px;margin-right:" + parseInt(interval) + "px;' value='" + _def_val + "' />";
                        _widget += "<div class='popDiv' id='div_" + _ParamName + "_tree' style='position: absolute; display: none; z-index: 9999; background-color: #F5F7F8;'><ul id='" + _ParamName + "_tree' class='ztree' style='width: 180px; height: 200px; overflow-y: auto;'></ul></div>";

                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }

                        jQuery("#" + _ParamName).click(function (event) {
                            $(".x-field-area").css("overflow-x", "visible");
                            $("div.popDiv, dl.popDiv").hide();

                            var position = $("#" + _ParamName).position();
                            $("#div_" + _ParamName + "_tree").css({
                                top: position.top + $("#" + _ParamName).height() + 10,
                                left: position.left
                            });
                            $("#div_" + _ParamName + "_tree").show();
                            event.stopPropagation();

                            $("body").click(function (e) {
                                var elem = e.target;
                                while (elem) {
                                    if (elem.tagName == 'DIV' && elem.id == ("div_" + _ParamName + "_tree")) {
                                        return;
                                    }
                                    elem = elem.parentNode;
                                }
                                $("#div_" + _ParamName + "_tree").hide();
                            });
                        });
                        var zNodes = [];
                        $(this).find("Node:eq(0)").children().each(function (ii) {
                            zNodes.push({
                                id: (ii + 1),
                                pid: 0,
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text()
                            });
                            $(this).find("Node:eq(0)").children().each(function (iii) {
                                zNodes.push({
                                    id: (((ii + 1) * 10) + (iii + 1)),
                                    pid: (ii + 1),
                                    value: $(this).find("ActualFieldData:eq(0)").text(),
                                    name: $(this).find("ShowFieldData:eq(0)").text()
                                });
                            });
                        });
                        $.fn.zTree.init($("#" + _ParamName + "_tree"), {
                            callback: {
                                onCheck: function (event, treeId, treeNode) {
                                    if (treeNode.checked) { //树节点选中事件
                                        $("input[name='" + _ParamName + "']").val(treeNode.value);
                                        $("#" + _ParamName).val(treeNode.name);
                                        if (_isAffectParams == 1) { //如果是联动控件，触发联动方法
                                            changeSelect(paramStr, _ParamName);
                                        }
                                    } else {
                                        $("input[name='" + _ParamName + "']").val("");
                                        $("#" + _ParamName).val("");
                                    }
                                }
                            },
                            view: {
                                selectedMulti: false
                            },
                            check: {
                                enable: true,
                                chkStyle: "radio",
                                radioType: "all"
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pid",
                                    rootPid: 0
                                }
                            }
                        }, zNodes);

                        // 有默认值时，选中节点
                        if (_def_val.length > 0) {
                            var __zTree = $.fn.zTree.getZTreeObj((_ParamName + "_tree"));
                            var node = __zTree.getNodeByParam("name", _def_val, null);
                            __zTree.checkNode(node, true, false);
                            node = null;
                            __zTree = null;
                        }
                    } else if (ReportConstant.HControlType.ControlType_ComboTreeMultiSel == _ParamType) { //多选下拉树，目前不做联动处理
                        _widget += "<input type='hidden' datatype='" + _DataType + "' labelname='" + _labelName + "'  name='" + _ParamName + "' value='" + _def_val + "' />";
                        _widget += "<input type='text' readonly='readonly' id='" + _ParamName + "' style='margin-bottom:5px;width: " + parseInt(_width) + "px; height: " + $(this).find("ControlHeight").text() + "px;margin-right:" + parseInt(interval) + "px;' value='" + _def_val + "' />";
                        _widget += "<div class='popDiv' id='div_" + _ParamName + "_tree' style='position: absolute; display: none; z-index: 9999; background-color: #F5F7F8;'><ul id='" + _ParamName + "_tree' class='ztree' style='width: 180px; height: 200px; overflow-y: auto;'></ul></div>";

                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }

                        jQuery("#" + _ParamName).click(function (event) {
                            $(".x-field-area").css("overflow-x", "visible");
                            $("div.popDiv, dl.popDiv").hide();

                            var position = $("#" + _ParamName).position();
                            $("#div_" + _ParamName + "_tree").css({
                                top: position.top + $("#" + _ParamName).height() + 10,
                                left: position.left
                            });
                            $("#div_" + _ParamName + "_tree").show();
                            event.stopPropagation();

                            $("body").click(function (e) {
                                var elem = e.target;
                                while (elem) {
                                    if (elem.tagName == 'DIV' && elem.id == ("div_" + _ParamName + "_tree")) {
                                        return;
                                    }
                                    elem = elem.parentNode;
                                }
                                $("#div_" + _ParamName + "_tree").hide();
                            });
                        });
                        var zNodes = [];
                        $(this).find("Node:eq(0)").children().each(function (ii) {
                            zNodes.push({
                                id: (ii + 1),
                                pid: 0,
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text()
                            });
                            $(this).find("Node:eq(0)").children().each(function (iii) {
                                zNodes.push({
                                    id: (((ii + 1) * 10) + (iii + 1)),
                                    pid: (ii + 1),
                                    value: $(this).find("ActualFieldData:eq(0)").text(),
                                    name: $(this).find("ShowFieldData:eq(0)").text()
                                });
                            });
                        });
                        $.fn.zTree.init($("#" + _ParamName + "_tree"), {
                            callback: {
                                onCheck: function (event) {
                                    var nodes = $.fn.zTree.getZTreeObj(event.target.id).getCheckedNodes(true),
                                        vals = [],
                                        texts = [];

                                    $.each(nodes, function (i, n) {
                                        if (n.isParent) return true;

                                        vals.push(n.value);
                                        texts.push(n.name);
                                    });
                                    $("#" + _ParamName).val(texts.join(","));
                                    $("input[name='" + _ParamName + "']").val(vals.join(","));
                                }
                            },
                            check: {
                                enable: true,
                                chkStyle: "checkbox"
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pid",
                                    rootPid: 0
                                }
                            }
                        }, zNodes);

                        // 有默认值时，选中节点
                        var __zTree = $.fn.zTree.getZTreeObj((_ParamName + "_tree"));
                        if (_def_val.length > 0) {
                            $.each(_def_val.split(","), function (ii, item) {
                                var node = __zTree.getNodeByParam("name", item, null);
                                node.checked = true;
                                __zTree.updateNode(node, true);
                                var parent = node.getParentNode();
                                if (parent) {
                                    parent.checked = true;
                                    __zTree.updateNode(parent, false);
                                }
                            });
                        }
                        __zTree = null;

                    } else if (ReportConstant.HControlType.ControlType_Date == _ParamType) {
                        _widget += "<input type='text'  id='" + _ParamName + "'  name='" + _ParamName + "' style='margin-bottom:5px;width: " + parseInt(_width) + "px; height: " + $(this).find("ControlHeight").text() + "px;margin-right:" + parseInt(interval) + "px;' value='" + _def_val + "' />";

                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }

                        $("#" + _ParamName).click(function () {
                            $("div.popDiv, dl.popDiv").hide();
                            WdatePicker();
                            if (_isAffectParams == 1) { //如果是联动控件，触发联动方法
                                changeSelect(paramStr, _ParamName);
                            }

                        });
                    } else if (ReportConstant.HControlType.ControlType_Date_Time == _ParamType) {
                        _widget += "<input type='text' id='" + _ParamName + "'  name='" + _ParamName + "' style='margin-bottom:5px;width: " + parseInt(_width) + "px; height: " + $(this).find("ControlHeight").text() + "px;margin-right:" + parseInt(interval) + "px' value='" + _def_val + "' />";

                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }

                        $("#" + _ParamName).click(function () {
                            $("div.popDiv, dl.popDiv").hide();
                            //WdatePicker();
                            WdatePicker({dateFmt: 'yyyy-MM-dd HH:mm:ss'})
                            if (_isAffectParams == 1) { //如果是联动控件，触发联动方法
                                changeSelect(paramStr, _ParamName);
                            }

                        });
                    } else if (ReportConstant.HControlType.ControlType_Date_No_Day == _ParamType) { //YYYY-MM
                        _widget += "<input type='text' id='" + _ParamName + "'  name='" + _ParamName + "' style='margin-bottom:5px;width: " + parseInt(_width) + "px; height: " + $(this).find("ControlHeight").text() + "px;margin-right:" + parseInt(interval) + "px' value='" + _def_val + "' />";

                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }

                        $("#" + _ParamName).click(function () {
                            $("div.popDiv, dl.popDiv").hide();
                            //WdatePicker();
                            WdatePicker({dateFmt: 'yyyy-MM'})
                            if (_isAffectParams == 1) { //如果是联动控件，触发联动方法
                                changeSelect(paramStr, _ParamName);
                            }

                        });
                    } else if (ReportConstant.HControlType.ControlType_CheckBox == _ParamType) {

                        _widget += "<input type='hidden' name='" + _ParamName + "' value='" + _def_val + "' /><input type='checkbox' " + (_def_val == "true" ? "checked='checked'" : "") + " onclick='doCheck(this);' style='margin-bottom:5px;margin-right:" + parseInt(interval) + "px;'/>";
                        if (_width != 0) {
                            $("#_field_").append(_widget);
                        }
                    }

                });

                $('.select2').css('margin-right', interval + 'px');
                if (paramIndex != 0) { //所有的参数都不显示
                    boundUpdate("_field_", true);

                    if (queryStyle.isVisible == 1) {
                        $("#_field_").append("<button class='ef-btn' type='button' onclick='doSearch(this,1);' id='searchBut' title='查询' style='padding:0 6px;background-color:" + queryStyle.bgColor + ";font-size:" + queryStyle.fontFamily + "px;'>" + queryStyle.buttonText + "</button>");
                        $('#searchBut').css('font-size', queryStyle.fontFamily + 'px');
                        $('#searchBut').css('color', queryStyle.fontColor);
                        $('#searchBut').css('background-color', queryStyle.bgColor);
                        $('#searchBut').text(queryStyle.buttonText);
                        if (queryStyle.fileName != '') {
                            var url = basePath + '/upload/tool/' + queryStyle.fileName;
                            $('#searchBut').css('background', 'url(' + url + ') no-repeat');
                            $('#searchBut').css('background-size', '100% 100%');
                        }
                        if (searchByDefaultParam == 1) { //模板自动查询
                            $('#searchBut').trigger('click');
                            $('#loadgif').removeClass('shadow');
                            $('#loadgif').show();

                        }
                    }
                    $.each(noTool, function (index, element) {
                        if (element.isVisible == 1) {
                            var eleId = element.id
                            $('#_field_').append('<button class="ef-btn-def" id="btn-' + eleId + '" style="padding:0 6px;font-size:' + element.fontFamily + 'px;background-color:' + element.bgColor + ';">' + element.buttonText + '</button>');
                            $('#btn-' + eleId).css('font-size', element.fontFamily + 'px');
                            $('#btn-' + eleId).css('color', element.fontColor);
                            $('#btn-' + eleId).css('background-color', element.bgColor);
                            $('#btn-' + eleId).text(element.buttonText);
                            if (element.fileName != '' && element.fileName != null) {
                                var url = basePath + '/upload/tool/' + element.fileName;
                                $('#btn-' + eleId).css('background', 'url(' + url + ') no-repeat');
                                $('#btn-' + eleId).css('background-size', '100% 100%');
                            }
                            var code = element.funcScript;
                            var start = code.indexOf("{");
                            var end = code.lastIndexOf("}");
                            code = code.substring(start + 1, end); //去除头尾
                            var subcode = code.replace(/[\r\n]/g, ""); //删除换行
                            subcode = subcode.replace(/[ ]/g, ""); //删除空格；
                            if (subcode != "") {
                                var fun;
                                try {
                                    fun = new Function(code); //转化为函数
                                } catch (err) {
                                    console.log(err);
                                    return true;
                                }
                                $('#btn-' + eleId).bind('click', fun);
                            }
                        }
                    })

                    var height = $('#_field_').height(); //参数栏高度
                    $('#_field_con').css("height", height + topNum + 'px');
                    $('#_field_con').css("position", 'relative');
                    $('#_field_').css("position", 'absolute');
                    var top = $('#_field_').css("top");
                    var total = top + topNum;
                    $('#_field_').css("top", total + 'px');
                } else {
                    $('#_field_').hide();
                    doSearch(1); //不显示参数工具栏，直接触发查询按钮
                }

            }
            ,
            /*
             *
             * 联动规则，前面的控件不变，后面的控件全部清空
             *
             * */
            refreshWidget: function (xml, curParam, valObj) { //联动后，根据新的xml数据来刷新控件界面 ， whj
                var paramDesc = [];  //控件描述参数
                //whj
                $(xml).find("ReportParam").each(function (i) {
                    var _ParamName = $(this).find("ParamName").text(), //参数名
                        _isAffectParams = $(this).find("IsAffectParams").text(); //是否联动标志  whj
                    var paramObj = {};
                    paramObj.name = _ParamName;
                    paramObj.isAffect = _isAffectParams;
                    paramDesc.push(paramObj);
                });
                var flag = false; //是否为下一个控件标识
                $(xml).find("ReportParam").each(function (i) {

                    var _ParamName = $(this).find("ParamName").text(),
                        _ParamType = $(this).find("ParamType").text();
                    //1字符串 2整型 3浮点 4日期时间 5布尔,,,,当2,3时，必须要输入数据
                    var _optionHtml = '';

                    if (ReportConstant.HControlType.ControlType_TextEdit == _ParamType) { //文本编辑框
                        if (_ParamName == curParam) { //如果是当前参数，为控件添加新的属性
                            $('input[name="' + _ParamName + '"]').attr("vs", valObj[_ParamName]);//设置默认值
                            flag = true;
                        } else {

                            if (flag) { //如果该控件为联动控件的下一个控件

                            } else {
                                if (valObj[_ParamName] !== undefined) {//联动控件前面的控件

                                    //$('input[name="' + _ParamName + '"]').attr("vs", valObj[_ParamName]);//设置默认值
                                } else {//联动控件后面的控件

                                }
                            }

                        }

                    } else if (ReportConstant.HControlType.ControlType_ComboBox == _ParamType) { //单选下拉列表

                        var showArr = []; //显示值数组
                        var valArr = []; //实际值数组
                        $(this).find("NodeData").each(function (_i, _n) {
                            showArr.push($(this).find("ShowFieldData").text());
                            valArr.push($(this).find("ActualFieldData").text());
                            _optionHtml += '<option value="' + $(this).find("ActualFieldData").text() + '">' + $(this).find("ShowFieldData").text() + '</option>';
                        });

                        if (_ParamName == curParam) { //如果是当前参数，为控件添加新的属性
                            //设置默认值时，按照添加顺序来决定第一个显示的值
                            var resetOptionHtml;

                            $('select[name="' + _ParamName + '"]').empty(); //清空控件
                            var defaultVal; //
                            if ($.inArray(valObj[_ParamName], showArr) != -1) { //
                                defaultVal = valObj[_ParamName];
                            }
                            if ($.inArray(valObj[_ParamName], valArr) != -1) {
                                var index = $.inArray(valObj[_ParamName], valArr);
                                var val = showArr[index];
                                defaultVal = valObj[_ParamName] = val;
                            }

                            $(this).find("NodeData").each(function (_i, _n) {
                                if ($(this).find("ShowFieldData").text() == defaultVal) {
                                    resetOptionHtml += '<option value="' + $(this).find("ActualFieldData").text() + '">' + $(this).find("ShowFieldData").text() + '</option>';
                                }
                            });

                            $(this).find("NodeData").each(function (_i, _n) {
                                if ($(this).find("ShowFieldData").text() != defaultVal) {
                                    resetOptionHtml += '<option value="' + $(this).find("ActualFieldData").text() + '">' + $(this).find("ShowFieldData").text() + '</option>';
                                }
                            });
                            $('select[name="' + _ParamName + '"]').append(resetOptionHtml);//为控件添加新选项
                            flag = true;
                        } else {

                            if (flag) { //如果该控件为联动控件的下一个控件
                                $('select[name="' + _ParamName + '"]').empty(); //清空控件
                                $('select[name="' + _ParamName + '"]').append(_optionHtml);//为控件添加新选项
                                $('select[name="' + _ParamName + '"]').val('').select2();

                                flag = false;
                            } else {
                                if (valObj[_ParamName] !== undefined) {//联动控件前面的控件
                                    /*$('select[name="' + _ParamName + '"]').empty(); //清空控件
                                     $('select[name="' + _ParamName + '"]').attr("vs", valObj[_ParamName]);//设置默认值
                                     $('select[name="' + _ParamName + '"]').append(_optionHtml);//为控件添加新选项*/
                                } else {//联动控件后面的控件
                                    $('select[name="' + _ParamName + '"]').empty(); //清空控件
                                }
                            }

                        }


                    } else if (ReportConstant.HControlType.ControlType_ComboBoxMultiSel == _ParamType) { //多选下拉框
                        var data = $(this).find("NodeData");
                        $.each(data, function (_i, _n) {
                            _optionHtml += '<option value="' + $(this).find("ActualFieldData").text() + '" >' + $(this).find("ShowFieldData").text() + '</option>';
                        });
                        if (_ParamName == curParam) { //如果是当前参数，为控件添加新的属性
                            $('select[name="' + _ParamName + '"]').empty(); //清空控件
                            $('select[name="' + _ParamName + '"]').attr("vs", valObj[_ParamName]);//设置默认值
                            $('select[name="' + _ParamName + '"]').append(_optionHtml);//为控件添加新选项
                            flag = true;
                        } else {
                            if (flag) { //如果该控件为联动控件的下一个控件
                                $('select[name="' + _ParamName + '"]').empty(); //清空控件
                                $('select[name="' + _ParamName + '"]').append(_optionHtml);//为控件添加新选项
                                flag = false;
                            } else {
                                if (valObj[_ParamName] !== undefined) {//联动控件前面的控件
                                    $('select[name="' + _ParamName + '"]').empty(); //清空控件
                                    $('select[name="' + _ParamName + '"]').attr("vs", valObj[_ParamName]);//设置默认值
                                    $('select[name="' + _ParamName + '"]').append(_optionHtml);//为控件添加新选项
                                } else {//联动控件后面的控件
                                    $('select[name="' + _ParamName + '"]').empty(); //清空控件
                                    //$('select[name="' + _ParamName + '"]').append(_optionHtml);//为控件添加新选项
                                }
                            }
                        }
                    } else if (ReportConstant.HControlType.ControlType_ComboTree == _ParamType) { //单选下拉树

                        jQuery("#" + _ParamName).click(function (event) {
                            $(".x-field-area").css("overflow-x", "visible");
                            $("div.popDiv, dl.popDiv").hide();
                            var position = $("#" + _ParamName).position();
                            $("#div_" + _ParamName + "_tree").css({
                                top: position.top + $("#" + _ParamName).height() + 10,
                                left: position.left
                            });
                            $("#div_" + _ParamName + "_tree").show();
                            event.stopPropagation();
                            $("body").click(function (e) {
                                var elem = e.target;
                                while (elem) {
                                    if (elem.tagName == 'DIV' && elem.id == ("div_" + _ParamName + "_tree")) {
                                        return;
                                    }
                                    elem = elem.parentNode;
                                }
                                $("#div_" + _ParamName + "_tree").hide();
                            });
                        });
                        var zNodes = [];
                        $(this).find("Node:eq(0)").children().each(function (ii) {
                            zNodes.push({
                                id: (ii + 1),
                                pid: 0,
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text()
                            });
                            $(this).find("Node:eq(0)").children().each(function (iii) {
                                zNodes.push({
                                    id: (((ii + 1) * 10) + (iii + 1)),
                                    pid: (ii + 1),
                                    value: $(this).find("ActualFieldData:eq(0)").text(),
                                    name: $(this).find("ShowFieldData:eq(0)").text()
                                });
                            });
                        });
                        $.fn.zTree.init($("#" + _ParamName + "_tree"), {
                            callback: {
                                onCheck: function (event, treeId, treeNode) {
                                    if (treeNode.checked) {
                                        $("input[name='" + _ParamName + "']").val(treeNode.value);
                                        $("#" + _ParamName).val(treeNode.name);
                                    } else {
                                        $("input[name='" + _ParamName + "']").val("");
                                        $("#" + _ParamName).val("");
                                    }
                                }
                            },
                            view: {
                                selectedMulti: false
                            },
                            check: {
                                enable: true,
                                chkStyle: "radio",
                                radioType: "all"
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pid",
                                    rootPid: 0
                                }
                            }
                        }, zNodes);

                        // 有默认值时，选中节点
                        if (_def_val.length > 0) {
                            var __zTree = $.fn.zTree.getZTreeObj((_ParamName + "_tree"));
                            var node = __zTree.getNodeByParam("name", _def_val, null);
                            __zTree.checkNode(node, true, false);
                            node = null;
                            __zTree = null;
                        }
                    } else if (ReportConstant.HControlType.ControlType_ComboTreeMultiSel == _ParamType) { //多选下拉树
                        jQuery("#" + _ParamName).click(function (event) {
                            $(".x-field-area").css("overflow-x", "visible");
                            $("div.popDiv, dl.popDiv").hide();

                            var position = $("#" + _ParamName).position();
                            $("#div_" + _ParamName + "_tree").css({
                                top: position.top + $("#" + _ParamName).height() + 10,
                                left: position.left
                            });
                            $("#div_" + _ParamName + "_tree").show();
                            event.stopPropagation();

                            $("body").click(function (e) {
                                var elem = e.target;
                                while (elem) {
                                    if (elem.tagName == 'DIV' && elem.id == ("div_" + _ParamName + "_tree")) {
                                        return;
                                    }
                                    elem = elem.parentNode;
                                }
                                $("#div_" + _ParamName + "_tree").hide();
                            });
                        });
                        var zNodes = [];
                        $(this).find("Node:eq(0)").children().each(function (ii) {
                            zNodes.push({
                                id: (ii + 1),
                                pid: 0,
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text()
                            });
                            $(this).find("Node:eq(0)").children().each(function (iii) {
                                zNodes.push({
                                    id: (((ii + 1) * 10) + (iii + 1)),
                                    pid: (ii + 1),
                                    value: $(this).find("ActualFieldData:eq(0)").text(),
                                    name: $(this).find("ShowFieldData:eq(0)").text()
                                });
                            });
                        });
                        $.fn.zTree.init($("#" + _ParamName + "_tree"), {
                            callback: {
                                onCheck: function (event) {
                                    var nodes = $.fn.zTree.getZTreeObj(event.target.id).getCheckedNodes(true),
                                        vals = [],
                                        texts = [];

                                    $.each(nodes, function (i, n) {
                                        if (n.isParent) return true;

                                        vals.push(n.value);
                                        texts.push(n.name);
                                    });
                                    $("#" + _ParamName).val(texts.join(","));
                                    $("input[name='" + _ParamName + "']").val(vals.join(","));
                                }
                            },
                            check: {
                                enable: true,
                                chkStyle: "checkbox"
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id",
                                    pIdKey: "pid",
                                    rootPid: 0
                                }
                            }
                        }, zNodes);
                        // 有默认值时，选中节点
                        var __zTree = $.fn.zTree.getZTreeObj((_ParamName + "_tree"));
                        if (_def_val.length > 0) {
                            $.each(_def_val.split(","), function (ii, item) {
                                var node = __zTree.getNodeByParam("name", item, null);
                                node.checked = true;
                                __zTree.updateNode(node, true);
                                var parent = node.getParentNode();
                                if (parent) {
                                    parent.checked = true;
                                    __zTree.updateNode(parent, false);
                                }
                            });
                        }
                        __zTree = null;
                    } else if (ReportConstant.HControlType.ControlType_Date == _ParamType) {
                        $("#" + _ParamName).click(function () {
                            $("div.popDiv, dl.popDiv").hide();
                            WdatePicker();
                        });
                    } else if (ReportConstant.HControlType.ControlType_CheckBox == _ParamType) {
                    }
                });

            }
        }
        ,
        GI: {
            //按钮点击事件：回调模板设置的JS
            callBackControllJs: function (obj) {
                var js = decodeURI($(obj).attr("js"));
                this.excuteFunc(js);

                var link = $(obj).attr("HyperLink");
                if (link != '' && link != undefined && link != "undefined") {
                    fun1click(JSON.parse(decodeURI(link)));
                }
            }
            ,
            excuteFunc: function (js) {
                if ('' != js && undefined != js) {
                    try {
                        var fun = new Function(js);
                        fun();
                    } catch (e) {
                        //layer.alert("JS代码错误：" + js);
                        efalert(layer, "JS代码错误：" + js);
                        return false;
                    }
                }
            }
            ,
            createRecordByButton: function (ele) {
                var td = $(ele).parent(); //button所在的td
                var tr = td.parent(); //td所在的tr
                var table = tr.parent(); //tr所在的table
                var name = $(ele).attr('name');
                var buttons = table.find('button[name="' + name + '"]');
                $.each(buttons, function (index, ele) {
                    if (index == buttons.length - 1) { //触发最后一个按钮
                        Report.GI.createRecord(ele);
                    }
                })

            }
            ,
            createRecord: function (ele) { //增加行
                //清除表单的所有错误标记$(ele.parentNode.parentNode)


                $(ele).parent().children().each(function () {
                    $(this).find("span[name='errorSpan']").remove();
                });
                var $ele = $(ele.parentNode.parentNode);

                var length = $ele.children(".cell-update").length; //判断被克隆行是否是更新状态标志

                $ele.find("select").each(function () {//find("select[sel='2']")
                    var t = $(this);
                    t.select2('destroy');
                    t.removeAttr("data-select2-id tabindex aria-hidden");
                    t.find("option").removeAttr("data-select2-id");
                });
                var clone = $ele.clone(true),
                    uuid = "_" + Util.randomUUID();
                clone.find("select").attr("vs", "");
                clone.attr('clone', 'true');// 标记为新纪录
                clone.find("[onchange]").each(function () {
                    $(this).attr("onchange", $(this).attr("onchange").replace(/'cell-update'/g, null));
                });
                clone.find("[onclick]").each(function () {
                    $(this).attr("onclick", $(this).attr("onclick").replace(/'cell-update'/g, null));
                });
                var idArr = $ele.attr("id").split('_'); //tr ID


                //clone.attr("id", $ele.attr("id") + uuid);
                clone.attr("id", idArr[0] + '_' + idArr[1] + '_' + idArr[2] + '_' + uuid);
                //clone.attr("id", idArr[0] + '_' + idArr[1] + '_' + index );
                clone.show();

                clone.children("td[firstcellrelation]").attr("class", "cell-add");//给新增行添加cell-add标识
                var cloneId = clone.children("td[firstcellrelation]").attr("addcellrelation");//新增行使用
                cloneId = cloneId == null ? clone.children("td[firstcellrelation]").attr("firstcellrelation") : cloneId;
                cloneId = cloneId == null ? clone.children("td[firstCellRelationRawLoc]").attr("firstCellRelationRawLoc") : cloneId;


                var ids = cloneId.split(";");

                var newIds = "";
                var oldIds = "";
                for (var i = 0; i < ids.length; i++) {
                    var y = ids[i].split(",")[0];
                    var x = ids[i].split(",")[1];
                    //var row = rowId[i].split(",")[1]; //用来判断是否在同一行
                    if (y != '') { //同一行数据
                        newIds += y + "," + (newIndex + parseInt(x)) + ";";
                        oldIds += y + "," + (oldIndex + parseInt(x)) + ";";
                    }
                }
                if (!$ele.children("td[firstcellrelation]").hasClass("cell-add")) {//如果克隆的源对象不是新增的列，则
                    $ele.children("td[firstcellrelation]").attr("addcellrelation", oldIds);
                }
                clone.children("td[firstcellrelation]").attr("addcellrelation", newIds);
                clone.find("input[name^='_radio_']").each(function () {
                    $(this).attr("name", $(this).attr("name") + uuid);
                });
                clone.find("input[name^='_checkbox_']").each(function () {
                    $(this).attr("name", $(this).attr("name") + uuid);
                });
                clone.find("input[type='checkbox']").each(function () {
                    $(this).attr("name", $(this).attr("name") + uuid);
                });
                clone.find("input[id^='_ComboBoxMultiSel_']").each(function () {
                    $(this).attr("id", $(this).attr("id") + uuid).val('');
                });
                clone.find("input[ref^='_ComboBoxMultiSel_']").each(function () {
                    $(this).attr("ref", $(this).attr("ref") + uuid).prop("checked", false);
                });
                var newTd = clone.children("td[firstcellrelation]").attr("addcellrelation");
                var tds = newTd.split(";");
                var newId = tds[0].split(",")[1];//获取新增行的x，由于是不变的这里单独取出
                var tableId = "";
                var _tb = $ele.parent().parent();
                var tableId2 = _tb.attr("id");
                tableId = tableId2 + '_';
                clone.children().each(function () {
                    if (0 === $(this).children().length) {//过滤掉了主键ID
                        $(this).html('');
                    } else {
                        var oldId = $(this).attr("id").split("_");
                        var id = tableId + (newId) + "_" + oldId[oldId.length - 1];

                        var input = $(this).find('input[type="text"]'); //文本编辑框
                        if (input != undefined && input.attr('name') != undefined) {//复制控件名
                            var name = input.attr('name');
                            if (name != undefined) { //如果有控件名
                                var names = name.split('_');
                                var length = names.length;
                                if (length == 1) { //控件名不包括下划线,说明是原始控件名
                                    input.attr('name', input.attr('name') + '_' + '@' + pluginIndex);
                                    input.attr('rawname', name); //原始控件名
                                } else {
                                    var exName = '';
                                    for (var i = 0; i < length; i++) {
                                        if (names[i].indexOf('@') == -1) { //不是扩展名
                                            exName += (names[i] + '_');
                                        }
                                    }
                                    input.attr('name', exName + '@' + pluginIndex);
                                    input.attr('rawname', input.attr('rawname'));
                                }
                            }

                            var initAttr = input.attr('init');
                            if (initAttr != undefined && initAttr == 'true') { //有初始化函数
                                var code = input.data('initCode'); //初始化函数代码
                                var fun;
                                try {
                                    fun = new Function(code); //转化为函数
                                } catch (err) {
                                    console.log(err);
                                }
                                input.bind('init', fun);
                            }
                        }
                        $(this).attr("id", id);
                        $(this).children().each(function () {
                            var that = $(this);
                            if (that.get(0).tagName == "IMG") {
                                that.prev().show();
                                that.remove();
                            } else {
                                if (that.attr("widget") === "SINGLETON_CHECKBOX") {
                                    that.prop("checked", false);
                                }
                                else if ("radio" === that.attr("type")) {
                                    that.prop("checked", false);
                                } else {
                                    that.val('');
                                }
                            }
                        });
                    }
                });
                $ele.after(clone);
                clone.children().each(function () {
                    var input = $(this).find('input[type="text"]'); //文本编辑框
                    if (input != undefined) {
                        input.trigger('init');
                    }
                })
                boundingEvent($ele, "");
                if (length == 0) {
                    $ele.children(".cell-update").removeClass("cell-update"); //删除掉被克隆行的cell-update属性
                }
                boundingEvent(clone, "");
                newIndex += 100;
                oldIndex += 1000;
                pluginIndex++;
            }
            ,
            deleteRecord: function (ele) {
                var $ele = $(ele.parentNode.parentNode);
                if ($ele.attr("clone")) {
                    $ele.remove();
                } else {
                    $ele.children("td[firstcellrelation]").attr("class", "cell-delete");
                    $ele.hide();
                }
            }
            ,
            doUploadFile: function (ele, _FileType, _SizeLimit) {
                var path = ele.value,
                    suffix = path.substring(path.lastIndexOf(".") + 1).toLowerCase();

                if (!(_FileType.indexOf(suffix) > -1 || _FileType === "all")) {
                    alert('上传文件格式不合法，请重新选择');
                    ele.value = '';
                    ele.focus();
                    return false;
                }

                if (_SizeLimit > 0 && ele.files[0].size > (1024 * _SizeLimit)) {
                    alert('上传文件过大，请重新选择');
                    ele.value = '';
                    ele.focus();
                    return false;
                }

                var fd = new FormData();
                fd.append("mf", ele.files[0]);

                jQuery.ajax({
                    url: _home + "/report/uploadFile",
                    type: "POST",
                    data: fd,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (resp) {
                        ele.previousSibling.value = resp.filename;
                        var imageHtml = '<img src="' + basePath + '/uploadimages/' + resp.filename + '" onclick="this.previousElementSibling.click();" style="width:100px;height:100px;"/>';//上传后的图片
                        var image = $(ele).parent().find('img'); //找到图片
                        image.remove();
                        $(ele).parent().append(imageHtml)
                        layer.msg(resp.text, {icon: 1, time: 1000});
                    }
                });
            }
            ,
            mobileUploadFile: function (url) {
                var path = url,
                    suffix = path.substring(path.lastIndexOf(".") + 1).toLowerCase();
                var fd = new FormData();
                jQuery.ajax({
                    url: _home + "/report/uploadFile",
                    type: "POST",
                    data: fd,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (resp) {
                        //ele.previousSibling.value = resp.filename;
                        layer.msg(resp.text, {icon: 1, time: 1000});
                    }
                });
            }
            ,
            doComboBoxMultiSel: function (ele) {
                var $ele = $(ele),
                    val = $("#" + $ele.attr("ref")).val(),
                    key = $("#" + $ele.attr("ref")).prev().val(),
                    vals = null,
                    keys = null,
                    idx = -1;

                if (val.trim().length > 0) {
                    vals = val.split(",");
                    keys = key.split(",");
                    idx = vals.indexOf($ele.attr("text"));

                    if (-1 === idx) {
                        vals.push($ele.attr("text"));
                        keys.push($ele.val());
                    } else {
                        vals.splice(idx, 1);
                        keys.splice(idx, 1);
                    }
                    $("#" + $ele.attr("ref")).val(vals.join(","));
                    $("#" + $ele.attr("ref")).prev().val(keys.join(","));
                } else {
                    $("#" + $ele.attr("ref")).val($ele.attr("text"));
                    $("#" + $ele.attr("ref")).prev().val($ele.val());
                }
            }
            ,
            toggleComboBoxMultiSel: function (element, event) {
                var ele = $(element),
                    dl = ele.next();

                dl.css({"top": ele.position().top + 5}).show();
                event.stopPropagation();

                $("body").click(function (e) {
                    var elem = e.target;
                    while (elem) {
                        if (elem.tagName == 'DL') {
                            return;
                        }
                        elem = elem.parentNode;
                    }
                    dl.hide();
                });
            }
            ,
            doComboBoxSel: function (ele, type, regx, psheetname) {
                var $ele = $(ele);
                $ele.prev().val(($ele.is(":checked")) ? "1" : "0");
                Report.GI.doControllLink(ele, type, regx, psheetname);
            }
            ,
            //区域联动 tt:饼状图，圆环图，漏斗图   参数替换时 系列(series) 取  name
            doControllLink1: function (params, regx, psheetname, tt) {
                Report.GI.doControllLink(params, 1, regx, psheetname, tt);
            }
            ,
            //控件联动处理方法，一般都是在控件值变动后触发
            doControllLink: function (obj, type, regx, psheetname, tt) {
                if (!isNull(regx)) {
                    regx = JSON.parse(decodeURI(regx));
                    var str = '';
                    var params = regx.Params;
                    var regxArry = regx.Regions;
                    if (6 == type) {
                        str = obj.cal.getDateStr();
                    } else if (2 == type) {
                        str = $(obj).val();
                    } else if (7 == type) {
                        var name = $(obj).attr('name'); //checkbox name
                        $('input:checkbox[name="' + name + '"]:checked').each(function (i) {
                            if (0 == i) {
                                str = $(this).val();
                            } else {
                                str += ("," + $(this).val());
                            }
                        });
                    } else if (10 == type) {
                        str = $(obj).val();
                    }
                    if (type == ReportConstant.HChartType.ChartType_ChinaMap) {
                        params = params.replace('CATEGORY', str);
                    } else if (type == 1) {
                        var ser = obj.seriesName;
                        if (ser) {
                            if (ser.indexOf('series') > -1 || tt) {
                                ser = obj.name;
                            }
                            params = params.replace('SERIES', ser);

                            var ca = obj.name;
                            if (ca.indexOf('series') > -1) {
                                ca = obj.seriesName;
                            }
                            params = params.replace('CATEGORY', ca);
                            params = params.replace('VALUE', obj.value[2]);
                            params = params.replace('X-AXIS', obj.value[0]);
                            params = params.replace('Y-AXIS', obj.value[1]);
                        }
                    } else {
                        params = params.replace('CONTROLVALUE', str);
                    }
                    doControllFresh(params, tt);
                    if (!isNull(psheetname)) {
                        for (var i = 0; i < regxArry.length; i++) {
                            var $childTd = getSheetObjBySheetName(regxArry[i].X, regxArry[i].Y, psheetname);
                            //多个子报表就会存在下面2个值
                            var cell = {
                                IntervalScrollH: $childTd.attr("intervalscrollh"),
                                IntervalScrollV: $childTd.attr("IntervalScrollV"),
                                StepScrollV: $childTd.attr("StepScrollV"),
                                IsShowSubReportScrollBar: $childTd.attr("IsShowSubReportScrollBar") == 'true' ? true : false,
                                IsShowCenterSubReport: $childTd.attr("IsShowCenterSubReport") == 'true' ? true : false,
                                IsSubReportCellPercent: $childTd.attr("IsSubReportCellPercent") == 'true' ? true : false,
                                IsSubReportKeepHVRatio: $childTd.attr("IsSubReportKeepHVRatio") == 'true' ? true : false,
                                SubReportSheetNames: $childTd.attr("subreportsheetnames") == undefined ? undefined : $childTd.attr("subreportsheetnames").split(",")

                            };
                            Report.RV.drawSubReportWidget($childTd, cell, psheetname);
                        }
                    }
                }
            }
            ,
            setUpdateFlag: function (tableId, pobj) {
                // 关联列, 无cellrelation属性
                var $td = $(pobj).parent().children("[firstcellrelation]");
                if ($td.length === 0) {
                    // 非关联列
                    if (!!!pobj.hasAttribute("cellrelation")) {
                        return;
                    }

                    var point = pobj.getAttribute("cellrelation").split(",");
                    var tdId = tableId + '_' + point[1] + '_' + point[0];
                    $td = $("#" + tdId);
                }
                if (!$td.hasClass("cell-add")) {
                    if (!!!$td.parent().data("NullRecord")) {
                        $("#" + tableId).find("#" + $td.attr("id")).addClass('cell-update');
                    } else {
                        $td.addClass("cell-add");
                    }
                }
            }
            ,
            getCellEditWidget: function (x, y, gd) {
                var cis = gd.ControlInfos,
                    ci = null;

                for (var i = 0; i < cis.length; i++) {
                    ci = cis[i];
                    if (ci.RawX === x && ci.RawY === y) {
                        return ci;
                    }
                }
            }
            ,
            getUploadInfo: function (props, gd) {
                var uis = null;
                $.each(gd.SheetUploadInfos, function (_i, _in) {
                    if (_in.SheetName == props.SheetName) {
                        $.each(_in.UploadInfos, function (_j, _jn) {

                            $.each(_jn.UploadItems, function (_x, _xn) {
                                if (_xn.FieldCellX == props.RawX && _xn.FieldCellY == props.RawY) {
                                    uis = {};
                                    uis["ConnName"] = _jn.ConnName;
                                    uis["DatabaseType"] = _jn.DatabaseType;
                                    uis["TableName"] = _jn.TableName;
                                    uis["FieldName"] = _xn.FieldName;
                                    uis["FieldType"] = _xn.FieldType;
                                    uis["UploadInfoName"] = xn.UploadInfoName; //填报名 whj
                                    uis["rawLocation"] = position[0] + "," + position[1];

                                    return false;
                                }
                            });
                        });
                    }
                });

                return uis;
            }
            ,
            getDataBaseMetaInfo: function (position, gd) { //获取td的元信息
                var uis = null;

                $.each(gd.SheetUploadInfos, function (_i, _in) {
                    if (_in.SheetName == gd.Pages[0].SheetName) {
                        $.each(_in.UploadInfos, function (_j, _jn) {
                            $.each(_jn.UploadItems, function (_x, _xn) {
                                if (_xn.FieldCellX == position[0] && _xn.FieldCellY == position[1]) {
                                    uis = {};
                                    uis["SheetName"] = _in.SheetName;
                                    uis["ConnName"] = _jn.ConnName;
                                    uis["DatabaseType"] = _jn.DatabaseType;
                                    uis["TableName"] = _jn.TableName;
                                    uis["FieldName"] = _xn.FieldName;
                                    uis["FieldType"] = _xn.FieldType;
                                    uis["rawLocation"] = position[0] + "," + position[1];//设置当前行的xy，用于新增行参数rawLocation使用，重要！！
                                    uis["MainKey"] = _xn.MainKey;
                                    uis["UploadInfoName"] = _jn.UploadInfoName; //填报名 whj

                                    return false;
                                }
                            });
                        });
                    }
                });
                return uis;
            }
            ,
            initUploadInfo: function (gd) { //初始化uploadInfo信息
                $.each(gd.SheetUploadInfos, function (_i, _in) {
                    if (_in.SheetName == gd.Pages[0].SheetName) {
                        $.each(_in.UploadInfos, function (_j, _jn) {
                            var uploadName = _jn.UploadInfoName; //填报名
                            if ($.inArray(_jn.UploadInfoName, uploadInfos) == -1) { //不包含该填报名
                                uploadInfos.push(_jn.UploadInfoName);
                            }

                            $.each(_jn.UploadItems, function (_x, _xn) { //遍历UploadItems
                                var x = _xn.FieldCellX; //x坐标
                                var y = _xn.FieldCellY; //y坐标
                                var key = uploadName + '_' + x + '_' + y; //键
                                var value = {};
                                value['FieldName'] = _xn.FieldName; //控件名
                                value['FieldType'] = _xn.FieldType; //控件类型
                                value['MainKey'] = _xn.MainKey; //是否主键
                                value['TableName'] = _jn.TableName; //表名
                                value['ConnName'] = _jn.ConnName; //链接名
                                value['DatabaseType'] = _jn.DatabaseType; //链接名
                                value['SheetName'] = _in.SheetName;
                                value['UploadInfoName'] = _jn.UploadInfoName;
                                value["rawLocation"] = x + "," + y;//设置当前行的xy，用于新增行参数rawLocat
                                uploadInfoMap[key] = value;
                            });

                        });
                    }
                });
            }
            ,
            processFileMime: function (fileType) {
                if ("all" === fileType) {
                    return "";
                } else {
                    var types = fileType.split(",");
                    for (var i = 0; i < types.length; i++) {
                        types[i] = "image/" + types[i];
                    }

                    return types.join(",");
                }
            }
            ,
            validateBeforeSubmit: function (props, tdw, sheetName) {
                var b = Report.GI.validte(props, tdw);
                if (!b) {
                    $(".i-sheet[st='" + sheetName + "']").children(0).css("background", "#fdd899");
                }
                return b;
            }
            ,
            validte: function (props, tdw) {
                if (!props.AllowNull) {
                    if (props.ControlType == 7 || props.ControlType == 10) { //复选框和单选框
                        if (props.ControlType == 7) {
                            var name = tdw.attr('name');
                            if ($('input[type="checkbox"][name="' + name + '"]:checked').length == 0) {
                                alert("该控件值不可为空");
                                tdw.get(0).focus();

                                return false;
                            }
                        } else {
                            var name = tdw.attr('name');
                            if ($('input[type="radio"][name="' + name + '"]:checked').length == 0) {
                                alert("该控件值不可为空");
                                tdw.get(0).focus();

                                return false;
                            }
                        }

                    } else {
                        if ("" == tdw.val() || null == tdw.val()) {
                            alert("该控件值不可为空");
                            tdw.get(0).focus();

                            return false;
                        }
                    }

                }

                if (ReportConstant.HControlType.ControlType_TextEdit == props.ControlType) {
                    if (0 !== props.MaxLength && props.MaxLength < tdw.val().length) {
                        alert("该控件最多允许输入" + props.MaxLength + "个字符");
                        tdw.get(0).focus();

                        return false;
                    }
                    if (0 !== props.MinLength && props.MinLength > tdw.val().length) {
                        alert("该控件至少须输入" + props.MinLength + "个字符");
                        tdw.get(0).focus();

                        return false;
                    }
                } else if (ReportConstant.HControlType.ControlType_Number == props.ControlType) {
                    if (isNaN(tdw.val())) {
                        alert("该控件只允许输入数字");
                        tdw.get(0).focus();

                        return false;
                    }
                    if (!props.AllowDecimal && tdw.val().indexOf(".") > -1) {
                        alert("该控件值不允许小数");
                        tdw.get(0).focus();

                        return false;
                    }
                    if (0 < props.decimalPlace && tdw.val().substring(tdw.val().indexOf(".") + 1).length > props.decimalPlace) {
                        alert("该控件值最多允许" + props.decimalPlace + "位小数");
                        tdw.get(0).focus();

                        return false;
                    }
                    if (!props.AllowNegative && tdw.val().indexOf("-") > -1) {
                        alert("该控件值不允许负数");
                        tdw.get(0).focus();

                        return false;
                    }
                    if (0 !== props.MaxValue && Number(tdw.val()) > props.MaxValue) {
                        alert("该控件值允许的最大值为" + props.MaxValue);
                        tdw.get(0).focus();

                        return false;
                    }
                    if (0 !== props.MinValue && Number(tdw.val()) < props.MinValue) {
                        alert("该控件值允许的最小值为" + props.MinValue);
                        tdw.get(0).focus();

                        return false;
                    }
                }
                return true;
            }
            ,
            getCellEditWidgetValue: function (elem) {
                if (0 === elem.length) {//如果是不能编辑则没有长度
                    return "NULL";
                } else if ("radio" === elem.attr("type")) {
                    return $("input[type='radio'][name='" + elem.attr("name") + "']:checked").val();
                } else if ("checkbox" === elem.attr("type")) {
                    var td = elem.parent(); //找到父单元格TD
                    var val = [];
                    var boxs = td.find("input[type='checkbox'][name='" + elem.attr("name") + "']");
                    $.each(boxs, function (index, elem) {
                        if (elem.checked == true) {
                            val.push(elem.value);
                        }
                    })
                    return val.join();
                }
                else {
                    return elem.val();
                }
            }
            ,
            doSubmitData: function (type) {
                var sheet = [],
                    flag = true;//校验不通过跳出多层循环
                $(".x-table").children().each(function () {
                    $(this).children().each(function () {
                        $(this).find("span[name='errorSpan']").remove();
                    });
                });
                $(".i-sheet").children(0).css("background", "");
                $("table[stable]").each(function () {
                    var _tb = $(this);
                    var name = _tb.attr("sheetname");
                    var data = [];
                    // 修改报表数据 td.parent().parent().parent().attr("sheetname")
                    _tb.find(".noChain").each(function () { //不绑定字段填报
                        var cell = $(this);
                        var row = null;
                        var tableId = "";
                        var fcrs = new Array(); //数据结点数组
                        var cellRelation = cell.attr('nofielduploadcellrelation'); //获取数据链上数据结点
                        var uploadName = cell.attr('firstcelluploadname'); //获取数据填报名
                        var tid = cell.parent().parent().parent().attr("id");
                        tableId = tid + '_';
                        var cellRelations = cellRelation.split(';');
                        for (var i = 0; i < cellRelations.length; i++) {
                            relations = cellRelations[i];
                            fcrs.push(relations);
                        }

                        fcrs.pop();
                        var _id = cell.attr("id");
                        var ids = _id.split('_');
                        //var pst = _id.substring(_id.indexOf(tableId) + tableId.length).split("_");
                        fcrs.push(ids[ids.length - 1] + "," + ids[ids.length - 2]); //将自己加入到数据链中
                        $.each(fcrs, function (_j, _jn) { //数据链上的所有节点
                            var point = _jn.split(","),
                                x = "#" + tableId + point[1] + "_" + point[0],
                                td = _tb.find(x),
                                tdw = td.children(":first"),
                                meta = td.data("meta"),
                                props = td.data("props");
                            // 如果不是控件，不需要修改
                            if (null == meta || undefined == meta) return true;
                            // if (null == props || undefined == props) return true;
                            if (!!props && ("SPAN" != tdw[0].tagName.toUpperCase()) && !Report.GI.validateBeforeSubmit(props, tdw, meta.SheetName)) {
                                flag = false;
                                return false;
                            }
                            if (null == row) {
                                row = {
                                    conn: null,
                                    table: null,
                                    dbType: null,
                                    sheetName: null,
                                    columnName: [],
                                    columnType: [],
                                    oldVal: [],
                                    newVal: [],
                                    xy: [],
                                    isPK: [],
                                    rawLocation: [],
                                    isChain: 'false', //是否是数据链
                                    uploadInfoName: meta.UploadInfoName
                                };
                            }
                            var rawLocation = meta.rawLocation;
                            var rawLocations = rawLocation.split(',');
                            var originVal = td.data("V") == null ? td.data("text") : td.data("V"); //ActualValue->V
                            var key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                            var value = uploadInfoMap[key];
                            row.conn = value.ConnName;
                            row.table = value.TableName;
                            row.dbType = value.DatabaseType;
                            row.columnName.push(value.FieldName);
                            row.columnType.push(value.FieldType);
                            row.uploadInfoName = value.UploadInfoName; //填报名
                            // 若单元格内为span标签
                            if ("SPAN" === tdw[0].tagName.toUpperCase()) {
                                if (value.MainKey) {
                                    // 若为主键,加在过滤条件中
                                    row.oldVal.push(originVal);
                                    row.newVal.push("");
                                } else {
                                    // 若为普通字段,加入更新数据中
                                    row.oldVal.push("");
                                    row.newVal.push(originVal);
                                }
                            } else {
                                row.oldVal.push(originVal);
                                row.newVal.push(value.MainKey ? originVal : Report.GI.getCellEditWidgetValue(tdw));
                            }
                            row.xy.push(point[0] + "," + point[1]);
                            row.isPK.push(value.MainKey);
                            row.rawLocation.push(value.rawLocation);
                            row.sheetName = meta.SheetName;
                        });

                        if (!flag) return false;
                        if (null != row) {
                            data.push(row);
                        }
                    });


                    _tb.find(".cell-update").each(function () {
                        var cell = $(this);
                        var fcrs = cell.attr("firstcellrelationrawloc").split(";");//数据链上的所有节点
                        var cur = cell.attr("firstcellrelation").split(";");
                        var row = null;
                        fcrs.pop();
                        cur.pop();
                        var tableId = "";
                        var tid = cell.parent().parent().parent().attr("id");
                        tableId = tid + '_';
                        var id = cell.attr("id");
                        var ids = id.split('_');
                        var _rawId = cell.attr("rawLoc");
                        //var pst = _id.substring(_id.indexOf(tableId) + tableId.length).split("_");
                        var uploadName = cell.attr('firstcelluploadname')
                        var rawId = _rawId.split(',');
                        cur.push(ids[ids.length - 1] + "," + ids[ids.length - 2]);
                        //cur.push(pst[1] + "," + pst[0]);  //将自己添加到数据链中
                        fcrs.push(rawId[0] + "," + rawId[1]); //
                        $.each(fcrs, function (_j, _jn) {

                            var point = _jn.split(","),
                                point1 = cur[_j].split(","),
                                x = "#" + tableId + point1[1] + "_" + point1[0],
                                td = _tb.find(x),
                                tdw = td.children(":first"),
                                meta = td.data("meta"),
                                props = td.data("props");
                            // 如果不是控件，不需要修改
                            if (null == meta || undefined == meta) return true;
                            // if (null == props || undefined == props) return true;
                            if (!!props && ("SPAN" != tdw[0].tagName.toUpperCase()) && !Report.GI.validateBeforeSubmit(props, tdw, meta.SheetName)) {
                                flag = false;
                                return false;
                            }
                            if (null == row) {
                                row = {
                                    conn: null,
                                    table: null,
                                    dbType: null,
                                    sheetName: null,
                                    columnName: [],
                                    columnType: [],
                                    oldVal: [],
                                    newVal: [],
                                    xy: [],
                                    isPK: [],
                                    rawLocation: [],
                                    uploadInfoName: meta.UploadInfoName
                                };
                            }
                            var rawLocation = meta.rawLocation;
                            var rawLocations = rawLocation.split(',');
                            var originVal = td.data("V") == null ? td.data("text") : td.data("V"); //ActualValue->V
                            var key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                            var value = uploadInfoMap[key];

                            row.conn = value.ConnName;
                            row.table = value.TableName;
                            row.dbType = value.DatabaseType;
                            row.columnName.push(value.FieldName);
                            row.columnType.push(value.FieldType);
                            // 若单元格内为span标签
                            if ("SPAN" === tdw[0].tagName.toUpperCase()) {
                                if (value.MainKey) {
                                    // 若为主键,加在过滤条件中
                                    row.oldVal.push(originVal);
                                    row.newVal.push("");
                                } else {
                                    // 若为普通字段,加入更新数据中
                                    row.oldVal.push("");
                                    row.newVal.push(originVal);
                                }
                            } else {
                                row.oldVal.push(originVal);
                                row.newVal.push(value.MainKey ? originVal : Report.GI.getCellEditWidgetValue(tdw));
                            }
                            row.xy.push(point1[0] + "," + point1[1]); //当前位置
                            row.isPK.push(value.MainKey);
                            row.rawLocation.push(rawLocation);
                            //row.isChain.push(false);
                            row.sheetName = value.SheetName;
                        });
                        if (!flag) return false;
                        if (null != row) {
                            data.push(row);
                        }
                    });
                    if (!flag) return false;

                    // 新增报表数据
                    _tb.find(".cell-add").each(function () {
                        var cell = $(this),
                            ce = cell.attr("addcellrelation"),
                            row = null;
                        ce = ce == undefined ? cell.attr("firstcellrelationRawLoc") : ce;//数据链上数据的位置
                        var cur = cell.attr("firstcellrelationRawLoc").split(";");//数据链上数据的原始位置
                        //var cur = ce;
                        var fcrs = ce.split(";"); //数据链数组
                        var uploadName = cell.attr('firstcelluploadname'); //数据链填报名
                        fcrs.pop();
                        cur.pop();
                        var tableId = "";
                        var tid = cell.parent().parent().parent().attr("id");
                        tableId = tid + '_';
                        var _id = cell.attr("id"), //起始单元格的ID
                            ids = _id.split("_");
                        var _rawId = cell.attr("rawLoc"); //起始单元格对应的原始ID
                        var rawId = _rawId.split(',');
                        cur.unshift(rawId[0] + "," + rawId[1]);  //将自己添加到原始数据链中
                        fcrs.unshift(ids[ids.length - 1] + "," + ids[ids.length - 2]);
                        // fcrs.unshift(pst[1] + "," + pst[0]);//必须把ID放在数组第一位，否则内核无法校验
                        $.each(fcrs, function (_j, _jn) {
                            var point = _jn.split(","), //当前ID数组
                                point1 = cur[_j].split(","), //原始位置ID
                                x = "#" + tableId + point[1] + "_" + point[0]; //寻找到当前的单元格
                            var td = _tb.find(x);//找到当前数据元素

                            // 新增行, 关联列未复制, 深度查找原始位置
                            if (0 === td.length) {
                                var originCR = cell.attr("firstcellrelation").split(";");
                                originCR.pop();
                                originCR.unshift(null);
                                point = originCR[_j].split(",");
                                id = "#" + tableId + point1[1] + "_" + point1[0];
                                td = _tb.find(id);
                            }

                            var tdw = td.children(":first");
                            var meta = td.data("meta");
                            var props = td.data("props");

                            if (meta == null) {//如果没有元数据，需要判断该单元格是否绑定了固定的单元格,找到原始的单元格
                                id = "#" + tableId + point1[1] + "_" + point1[0];
                                td = _tb.find(id);
                                tdw = td.children(":first");
                                meta = td.data("meta");
                                props = td.data("props");
                            }


                            // 若无元数据或者为主键,丢弃
                            if (null == meta || undefined == meta || meta.MainKey) return true;
                            // if (null == props || undefined == props) return true;
                            if (!!props && !Report.GI.validateBeforeSubmit(props, tdw, meta.SheetName)) {
                                flag = false;
                                return false;
                            }
                            if (null == row) {
                                row = {
                                    conn: null,
                                    table: null,
                                    dbType: null,
                                    sheetName: null,
                                    columnName: [],
                                    columnType: [],
                                    oldVal: [],
                                    newVal: [],
                                    xy: [],
                                    rawLocation: [],
                                    uploadInfoName: meta.UploadInfoName
                                };
                            }
                            var raw = meta.rawLocation;
                            var rawLocations = raw.split(',');
                            var key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                            var value = uploadInfoMap[key];

                            row.conn = value.ConnName;
                            row.table = value.TableName;
                            row.dbType = value.DatabaseType;
                            row.columnName.push(value.FieldName);
                            row.columnType.push(value.FieldType);
                            // 若单元格内为span标签
                            if ("SPAN" === tdw[0].tagName.toUpperCase()) {
                                row.newVal.push(td.data("V") == null ? td.data("text") : td.data("V")); //ActualValue->V
                            } else {
                                row.newVal.push(Report.GI.getCellEditWidgetValue(tdw));
                            }
                            row.xy.push(point[0] + "," + point[1]);
                            row.rawLocation.push(value.rawLocation);
                            row.sheetName = value.SheetName;
                            //row.isChain.push(true);
                        });
                        if (!flag) return false;
                        if (null != row) {
                            data.push(row);
                        }
                    });
                    if (!flag) return;

                    // 删除报表数据
                    _tb.find(".cell-delete").each(function () {
                        var cell = $(this),
                            fcrs = cell.attr("firstcellrelationRawLoc").split(";"),
                            row = null;
                        var cur = cell.attr("firstcellrelation").split(";");
                        fcrs.pop();
                        cur.pop();
                        var uploadName = cell.attr('firstcelluploadname');
                        var tableId = "";
                        var tid = cell.parent().parent().parent().attr("id");
                        tableId = tid + '_';
                        var _id = cell.attr("id"),
                            ids = _id.split("_");
                        var _rawId = cell.attr("rawLoc");
                        var rawId = _rawId.split(',');
                        cur.push(ids[ids.length - 1] + "," + ids[ids.length - 2]);  //将自己添加到数据链中
                        fcrs.push(rawId[1] + "," + rawId[0]);
                        //fcrs.push(pst[1] + "," + pst[0]);
                        var firstCell = cell.attr("id").split(tableId)[1].split("_");
                        $.each(fcrs, function (_j, _jn) {
                            var point = _jn.split(","),
                                point1 = cur[_j].split(","),
                                x = "#" + tableId + point1[1] + "_" + point1[0],
                                td = _tb.find(x),
                                tdw = td.children(":first"),
                                meta = td.data("meta");

                            if (null == meta) return true;
                            if (null == row) {
                                row = {
                                    conn: null,
                                    table: null,
                                    dbType: null,
                                    sheetName: null,
                                    columnName: [],
                                    columnType: [],
                                    oldVal: [],
                                    newVal: [],
                                    xy: [],
                                    uploadInfoName: meta.UploadInfoName
                                };
                            }

                            var originVal = td.data("V") == null ? td.data("text") : td.data("V");

                            var raw = meta.rawLocation;
                            var rawLocations = raw.split(',');
                            var key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                            var value = uploadInfoMap[key];
                            row.conn = value.ConnName;
                            row.table = value.TableName;
                            row.dbType = value.DatabaseType;
                            row.columnName.push(value.FieldName);
                            row.columnType.push(value.FieldType);
                            // 若单元格内为span标签
                            if ("SPAN" === tdw[0].tagName.toUpperCase()) {
                                if (value.MainKey) {
                                    // 若为主键,加在过滤条件中
                                    row.oldVal.push(originVal);
                                } else {
                                    // 若为普通字段,丢弃
                                    row.oldVal.push("");
                                }
                            } else {
                                row.oldVal.push(originVal);
                            }
                            row.sheetName = value.SheetName;
                            //row.isChain.push(true);
                        });
                        if (null != row) {
                            row.xy.push(firstCell[1] + "," + firstCell[0]);
                            data.push(row);
                        }
                    });
                    if (data.length > 0) {
                        var dataSheet = {
                            sheetName: name,
                            records: data
                        };
                        sheet.push(dataSheet);
                    }
                });
                if (!flag) return;
                if (type == 2 && 0 === sheet.length) {
                    //layer.alert("请修改数据后再提交！");
                    efalert(layer, "请修改数据后再提交！");
                    return false;
                }
                var row = {
                    conn: null,
                    table: null,
                    dbType: null,
                    sheetName: null,
                    columnName: [],
                    columnType: [],
                    oldVal: [],
                    newVal: [],
                    xy: []
                };
                $("table[stable]").each(function () {
                    var b = false;
                    var name = $(this).attr("sheetname");
                    if (sheet.length > 0) {
                        $.each(sheet, function () {
                            var sname = this.sheetName;
                            if (sname == name) {
                                b = true;
                                return false;
                            }
                        });
                    }
                    if (b) {
                        b = false;
                        return;
                    }
                    var dataSheet = {
                        sheetName: name,
                        records: null
                    };
                    var data = [];
                    $(this).find("td").each(function () {
                        var meta = $(this).data("meta");
                        if (!isNull(meta)) {
                            row.conn = meta.ConnName;
                            row.table = meta.TableName;
                            row.dbType = meta.DatabaseType;
                            row.columnName.push(meta.FieldName);
                            row.columnType.push(meta.FieldType);
                            row.sheetName = meta.SheetName;
                            data.push(row);
                            return false;
                        }
                    });
                    dataSheet.records = data;
                    sheet.push(dataSheet);
                });
                $.ajax({
                    url: encodeURI(updateFunc + "&tpl=" + _g_tpl + "&sheetName=" + currSheetName + "&params=" + getParms() + "&type=" + type + "&uploadInfo=" + uploadInfos),
                    type: "POST",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(sheet),
                    beforeSend: function () {
                        $("#loadgif").show();
                    },
                    complete: function () {
                        $("#loadgif").hide();
                    },
                    success: function (resp) {

                        if (resp.code == 1) {//数据校验成功
                            layer.alert(resp.text, function (index) {
                                if (parent.isOpenWin && type == 2) {
                                    if (modelId != null && modelId !== "") { //如果跟流程挂钩，数据校验成功后弹出提交框 whj
                                        initiateTask();
                                    } else {
                                        parent.location.reload();
                                    }
                                    //parent.location.reload();
                                } else {
                                    if (type == 2) {
                                        if (modelId != null && modelId !== "") { //如果跟流程挂钩，数据校验成功后弹出提交框
                                            initiateTask();
                                        } else {
                                            location.reload();
                                        }
                                        //location.reload();
                                    }
                                }
                                layer.close(index);
                            });
                        } else if (resp.code == 2) {//数据校验失败
                            Report.GI.addErrorInfo(resp);
                        } else {
                            if (resp.code == undefined) {//whj 填报信息有误
                                efalert(layer, '填报信息有误!');
                            } else {
                                efalert(layer, resp.text);
                            }

                        }
                    },
                    error: function () {
                        efalert(layer, '填报异常,请检查模板!');
                    }
                });
            }
            ,
            pushData: function (ele, type) {
                Report.GI.doSubmitData(type);
            }
            ,
            addErrorInfo: function (resp) {  //添加错误信息 whj
                var res = resp.text;
                res = eval('{' + res + '}');
                var info = "";
                for (var x = 0; x < res.length; x++) {
                    var incell = res[x];
                    var sheetName = incell.sheetName;
                    var cells = incell.invaildCells;
                    $(".i-sheet[st='" + sheetName + "']").children(0).css("background", "#fdd899");
                    for (var i = 0; i < cells.length; i++) {
                        var td = getSheetObjBySheetName(cells[i].x, cells[i].y, sheetName);
                        td.children().eq(0).css("width", "80%");
                        //td.append("<span name='errorSpan' style='color: red;margin-top: 18px;margin-right:1px;float: right;text-align: right;font-size: 16px;width:20px'>*</span>");
                        //出错单元格右侧加红点
                        td.append("<span name='errorSpan' style='color: red;margin-right:1px;text-align: right;font-size: 16px;width:20%'>*</span>");
                        info += "<p class='errortitle'>" + ((cells[i].error == '' || cells[i].error == 'undefined') ? '错误信息' : cells[i].error) + "</p>";
                    }
                }
                var offset = parent.isOpenWin ? 'auto' : 'rt';
                Util.openErrorInfo(info, offset);
            }
        }
    }
    ;
