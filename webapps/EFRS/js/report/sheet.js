let carouselMap = {}; //轮播对象MAP
let curMap = {}; //sheet当前页map
let tdTableRatioMap = {};

//初始化SHEET页
function initSheets(sheetInfos) {
    $('#total').text(sheetInfos[0].PageCount);
    $('#curr').val(1);
    $('#sheetD').empty(); //清空sheet工具栏区域
    if (sheetInfos.length == 1) {//单SHEET报表
        let info = sheetInfos[0];
        let sheetHtml = '<li onclick="changeSheet(' + 0 + ')" class="i-sheet" tbid="_tb_0" st="' + info.SheetName + '" style="padding: 0;margin: 0" id="_st_0"><span class="sheet_span sheet_ck">&nbsp;&nbsp;' + info.SheetName + '&nbsp;&nbsp;</span> </li>';
        $('#sheetD').append(sheetHtml);//填充sheet工具栏区域
        $('.x-sheet').css('display', 'none');
        curMap[info.SheetName] = 1;
    } else { //多SHEET页
        for (let i = 0; i < sheetInfos.length; i++) { //遍历sheetInfos，生成sheet页签
            let info = sheetInfos[i];
            let sheetHtml = '';
            if (i == 0) {
                //第一个sheet添加选中样式
                sheetHtml = '<li onclick="changeSheet(' + i + ')" class="i-sheet" tbid="_tb_0" st="' + info.SheetName + '" style="padding: 0;margin: 0" id="_st_0"><span class="sheet_span sheet_ck">&nbsp;&nbsp;' + sheetInfos[0].SheetName + '&nbsp;&nbsp;</span> </li>';
            } else {
                sheetHtml = '<li onclick="changeSheet(' + i + ')" class="i-sheet" tbid="_tb_' + i + '" st="' + info.SheetName + '" style="padding: 0;margin: 0" id="_st_0"><span class="sheet_span">&nbsp;&nbsp;' + info.SheetName + '&nbsp;&nbsp;</span> </li>';
            }
            $('#sheetD').append(sheetHtml);//填充sheet工具栏区域
            $('.x-sheet').css('display', 'flex');
            $('#sheet').show();//多sheet时显示sheet工具栏
        }
    }

    $(".btn_left").unbind().bind('click', function () {
        var lf = $(".x-sheet ul").offset().left;
        clearTimeout(timer);
        timer = setTimeout(function () {
            var offleft = $(".x-sheet ul li:first-child").offset().left;
            if (offleft < 20) {
                $(".x-sheet ul li").each(function () {
                    var ww = parseInt($(this).width());
                    $(".x-sheet ul").stop().animate({left: "+=" + ww + "px"}, "fast", function () {
                        var off = $(".x-sheet ul li:first-child").offset().left;
                        if (off > 0) {
                            $(".x-sheet ul").offset({left: 20});
                        }
                    });
                    return false;
                });
            }
        }, 300);
    });
    $(".btn_right").unbind().bind('click', function () {
        var body = $("body").width();
        if ($('#sheetD').width() + 20 > body) {
            var offleft = $(".x-sheet ul li:last-child").offset().left;
            var ofw = $(".x-sheet ul li:last-child").width();
            if (offleft + ofw > body) {
                $(".x-sheet ul li").each(function () {
                    var ww = $(this).offset().left;
                    ww = parseInt(ww);
                    if (ww + $(this).width() > body && ww < body) {
                        var wd = ww + $(this).width() - body;
                        $(".x-sheet ul").stop().animate({left: "-=" + wd + "px"}, "fast");
                        return false;
                    }
                    if (ww >= body) {
                        var t = $(this).width();
                        $(".x-sheet ul").stop().animate({left: "-=" + t + "px"}, "fast");
                        return false;
                    }
                });
            }
        }
    })

}

function changeSheet(index) {
    let sheetInfo = sheetInfos[index]; //当前点击的sheet页信息
    let sheetName = sheetInfo.SheetName; //sheet名
    curSheet = sheetName; //当前点击的SHEET页
    //取消所有sheet页选中样式
    $('#sheet').find('.i-sheet').find('span').removeClass('sheet_ck');
    //为当前点击的sheet页添加选中样式
    $('#sheet').find('.i-sheet').eq(index).find('span').addClass('sheet_ck');
    refreshBySheet(index, sheetName); //根据sheet来刷新报表内容

}

//点击sheet页时，刷新数据
function refreshBySheet(index, sheetName) {
    let length = $('#_tb_' + index).length;//渲染的DOM元素是否存在
    //当前页数
    if (curMap[sheetName] == undefined) {
        $('#curr').val(1);
    } else {
        $('#curr').val(curMap[sheetName]);
    }
    $('#total').text(sheetInfos[index].PageCount); //修改总页数
    //数据已经渲染
    if (length == 1) {
        let divs = $('#content').children('div');
        $.each(divs, function (i, ele) {
            let e = $(ele);
            if (e.find('table').eq(0).attr('sheetname') == sheetName) {
                e.removeClass('hide');//当前DIV移除hide Class
                e.show();
                e.addClass('show');//当前DIV添加show Class
            } else {
                e.removeClass('show');//当前DIV移除hide Class
                e.hide();
                e.addClass('hide');//当前DIV添加show Class
            }
        })
    } else {
        let divs = $('#content').children('div');
        $.each(divs, function (i, ele) { //先隐藏其他数据表格
            let e = $(ele);
            e.removeClass('show');
            e.addClass('hide');//当前DIV添加show Class
        })
        $.ajax({
            url: base + "/report/queryBySheet?sheetName=" + sheetName + "&pathId=" + pathId + "&token=" + token,
            type: "GET",
            success: function (res) {
                reportJson = JSON.parse(res.result); //更新当前的报表JSON
                colorList = reportJson.ColorList;
                fontList = reportJson.FontList;
                let formH = reportJson.Pages[0].FormH; //获取页面JSON
                isForm = (formH != undefined); //判断是否是Form状态
                if (isForm) { //如果是form，渲染form
                    initForm('_tb_' + index, sheetInfos[index]);
                } else {
                    initNormalReport('_tb_' + index, sheetInfos[index]);
                    //设置滚动条
                    setContentHeight(reportJson.IsShowCenterReport);
                }
                let divs = $('#content').children('div');
                $.each(divs, function (i, ele) {
                    let e = $(ele);
                    if (e.find('table').eq(0).attr('sheetname') == sheetName) {
                        e.removeClass('hide');//当前DIV移除hide Class
                        e.addClass('show');//当前DIV添加show Class
                    } else {
                        e.removeClass('show');//当前DIV移除hide Class
                        e.addClass('hide');//当前DIV添加show Class
                    }
                })
            },
            error: function () {

            }
        })
    }
}

/***
 * 生成单元格子表单
 * */
function generateSubSheet(td, cell, isForm) {
    // 关联子表单属性
    let sheetNames = cell.SubReportSheetNames; //获取单元格关联的子表单集合
    let isSubReportCellPercent = cell.IsSubReportCellPercent; //子报表是否自适应属性
    let isSubReportKeepHVRatio = cell.IsSubReportKeepHVRatio; //子报表是否保持横纵比属性
    let isShowCenterSubReport = cell.IsShowCenterSubReport; //是否居中显示
    let isShowSubReportScrollBar = cell.IsShowSubReportScrollBar; //是否显示垂直滚动条
    let intervalScrollH = cell.IntervalScrollH; //水平滚动时间
    let stepScrollV = cell.StepScrollV; //垂直滚动像素
    let intervalScrollV = cell.IntervalScrollV;

    let scrollData = {
        StepScrollV: stepScrollV,
        IntervalScrollV: intervalScrollV
    };

    let width = td.attr('ow');  //单元格原始宽度
    let height = td.attr('oh'); //单元格原始高度
    let hr = td.attr('hr'); //水平比例
    let vr = td.attr('vr'); //垂直比例
    let tdId = td.attr("id");
    let carouselId = tdId + "_carousel";

    let tw;
    let th;

    if(isSubReportCellPercent){
        tw = width * hr;
        th = height * vr;
    }else{
        tw = width;
        th = height;
    }

    var div = td.find('div');//单元格内的DIV
    div.attr("times", 1); //第一次初始化标识
    //外层包裹容器,这里没有使用td.height()，是因为td.height()获取的是单元格合并前TD的高度
    if (sheetNames.length > 1) {//当关联多个子表单时，添加滚动DIV
        div.empty();
        //外层DIV
        let carouselHtml;
        if (isShowSubReportScrollBar) {
            carouselHtml =
                "<div id='" + carouselId + "' class='layui-carousel' style='margin:0px;padding:0px;'>" +
                "   <div carousel-item id='car'></div>" +
                "<div>";
        } else {
            carouselHtml =
                "<div id='" + carouselId + "' class='layui-carousel' style='margin:0px;padding:0px;'>" +
                "   <div carousel-item id='car'></div>" +
                "<div>";
        }


        div.append(carouselHtml);
        let carouselProp = {}; //轮播属性
        carouselProp['height'] = th;
        carouselProp['width'] = tw;
        carouselProp['interval'] = intervalScrollH;

        // 更新轮播信息
        carouselMap[carouselId] = carouselProp;
        //将DIV动态添加到轮播DIV中
        $.each(cell.SubReportSheetNames, function (i, item) {
            let itemId = carouselId + "_item_" + i;
            //轮播条目
            let carouselItemDivHtml = "<div id='" + itemId + "'></div>";
            $('#' + carouselId).find('#car').append(carouselItemDivHtml);
            $('#' + itemId).css("width", tw);
            $('#' + itemId).css("height", th);
        })
    } else { //关联一个子表单

        let itemId = carouselId + "_item_" + 0;
        div.attr("id", itemId);
        div.css("width" , tw);
        div.empty(); //清空原先的span

    }

    $.ajaxSettings.async = false;
    //遍历子报表项目
    $.each(cell.SubReportSheetNames, function (i, item) {
        let itemId = carouselId + "_item_" + i;
        $.getJSON(base + '/report/loadJSON?' + "t=" + new Date().getTime() + "&token=" + token, {
            file: item, //子sheet名
            pathId: pathId,
            serverId: serverId
        }, function (data) {
            //生成子表单Table
            generateSubSheetTable(td.attr("id"), data, itemId, i, item, isSubReportCellPercent, isSubReportKeepHVRatio, isShowSubReportScrollBar, scrollData, isShowCenterSubReport);
        });
    });
    $.ajaxSettings.async = true;
}


/**
 * 生成子表单Table
 * id 单元格ID , data 单元格关联子表单数据 , itemId ,index 子表单索引值,sheetName 关联子表单sheet名,psheetname 当前sheet名,isWcp 是否自适应 , isKr 是否保持横纵比
 * **/
function generateSubSheetTable(tdId, data, itemId, index, sheetName, isWcp, isKr, isShowScroll, scrollData, isShowCenter) {

    let page = data.Pages[0];
    let rows = page.Rows;
    let columns = page.Columns;
    let ratios = [1, 1];
    let tableWidth; //表单table的宽度

    let subTableId = tdId + "_" + index; //子报表对应的table ID

    /*if (isWcp) {//如果子表单自适应的话
        tdWidth = $('#' + tdId).css('width'); // 子表单的宽度就是外层td的宽度
    } else {
        tdWidth = totalWidth(columns);//非自适应，子表单的宽度就是原始的宽度
    }*/
    let tdWidth = $('#' + tdId).css('width');
    let tdHeight = $('#' + tdId).css('height');

    let originWidth = $('#' + tdId).attr('ow'); //单元格原始宽度
    let originHeight = $('#' + tdId).attr('oh'); //单元格原始高度


    //子表单table html
    let html = "<table id='" + subTableId + "' style='display:table;border: 0; border-collapse: collapse; cell-spacing:0px;border-spacing: 0;width:" + tdWidth + "px' index='" + index + "' sheetname='" + sheetName + "'></table>"; //子报表Table
    let container = $('#' + itemId); //子报表容器DIV

    container.css('width', tdWidth);
    container.css('height', tdHeight);

    //将子报表Table添加到子报表容器中
    container.append(html);
    //子报表Table
    let subTableObj = $('#' + subTableId);
    subTableObj.hide();
    //区域联动时，如果之前已经算过子表单缩放比例,使用之前计算过的比例
    if (tdTableRatioMap[tdId] != undefined) {
        /*let curRatios = tdTableRatioMap[tdId];
        ratios[0] = curRatios[0];
        ratios[1] =  curRatios[1];*/
        if (isWcp == 'true' || isWcp == true) {//子报表自适应
            let tw = totalWidth(columns); //原始宽度和
            let th = totalHeight(rows); //原始高度和
            let ow = $('#' + tdId).attr('ow');
            let oh = $('#' + tdId).attr('oh');
            let hr = $('#' + tdId).attr('hr');
            let vr = $('#' + tdId).attr('vr');
            let tdWidth = Math.floor(ow * hr);
            let tdHeight = Math.floor(oh * vr);
            //计算缩放比例
            if (isKr == true || isKr == 'true') {//保持横纵比
                let hRatio = tdWidth / tw; //水平比例
                let vRatio = hRatio;
                ratios = [hRatio, vRatio];
            } else {//不保持横纵比
                let hRatio = tdWidth / (tw); // 水平比例
                let vRatio = tdHeight / (th); //垂直比例
                ratios = [hRatio, vRatio];
            }
            tableWidth = tdWidth;
        } else {
            ratios = [1, 1];
            tableWidth = totalWidth(columns);
        }
    } else {
        if (isWcp == 'true' || isWcp == true) {//子报表自适应
            let tw = totalWidth(columns); //原始宽度和
            let th = totalHeight(rows); //原始高度和
            let tdWidth = parseInt($('#' + tdId).css('width')); //单元格宽度
            let tdHeight = parseInt($('#' + tdId).css('height'));//单元格高度
            //计算缩放比例
            if (isKr == true || isKr == 'true') {//保持横纵比
                var hRatio = tdWidth / tw; //水平比例
                var vRatio = hRatio;
                ratios = [hRatio, vRatio];
            } else {//不保持横纵比
                var hRatio = tdWidth / (tw); // 水平比例
                var vRatio = tdHeight / (th); //垂直比例
                ratios = [hRatio, vRatio];
            }
            tableWidth = tdWidth;
        } else {
            ratios = [1, 1];
            tableWidth = totalWidth(columns);
        }
    }

    //生成子报表Table
    let colorList = data.ColorList; //颜色列表
    let fontList = data.FontList; //字体列表
    let sheetColorList = colorList;
    let subTableHtml = '';
    //生成报表Table
    for (let i = 0; i < rows.Count; i++) {
        let trId = subTableId + '_r_' + i; //生成TR ID
        let oh = rows.RowArray[i].H; //单元格原始高度
        let nh = Math.floor(oh * ratios[1]);
        subTableHtml += "<tr oh='" + oh + "' attr='" + oh + "' style='height: " + nh + "px;overflow:auto;" + (0 === oh ? "display: none;" : "block") + "' id='" + trId + "'>";
        for (let j = 0; j < columns.Count; j++) { //遍历生成TD
            let ow = columns.ColumnArray[j].W; //单元格原始宽度
            let nw = Math.floor(ow * ratios[0]); //单元格实际高度
            let tdId = subTableId + '_' + (i + 1) + '_' + (j + 1);
            subTableHtml += "<td  hr='" + ratios[0] + "' vr='" + ratios[1] + "' oh='" + oh + "' ow='" + ow + "' attr='" + ow + "' style='table-layout:fixed;width: " + nw + "px;height:" + nh + "px;padding: 0;" + (0 === ow ? "display: none;" : "") + "' id='" + tdId + "' idx='" + (j + 1) + "'></td>";
        }
        subTableHtml += "</tr>";
    }

    subTableObj.html(subTableHtml); //渲染Table
    subTableObj.attr('rows', rows.Count);//为Table添加总行数信息
    subTableObj.attr('cols', columns.Count);//为Table添加总行数信息
    subTableObj.attr('hr', ratios[0]);
    subTableObj.attr('vr', ratios[1]);
    //渲染table的每个单元格
    $.each(page.Cells, function (i, cell) {
        let cellProp = cell.N;
        let tdId = subTableId + '_' + (cellProp[1]) + '_' + (cellProp[0]); //td ID
        let td = $('#' + tdId);
        //let pSheetName = table.attr('sheetname'); //table对应的表单
        if (isWcp) { //初始化自适应单元格
            //存在合并单元格，先合并
            if (cell.hasOwnProperty("G")) {
                mergeWcpCell(cell, td, subTableId, cellProp[0], cellProp[1], horizontalRatio, verticalRatio);
            }
            initWcpCell(td, cell, subTableId, ratios[0], ratios[1], colorList, data);
        } else { //初始化普通单元格
            //存在合并单元格，先合并
            if (cell.hasOwnProperty("G")) {
                mergeCell(cell, td, subTableId, cellProp[0], cellProp[1]);
            }
            initNormalCell(td, cell, subTableId, colorList);
        }
    });

    subTableObj.show();
    let parentDiv = subTableObj.parent();

    /**
     * 子报表自适应时，如果保持横纵比并且显示滚动条时，显示垂直滚动条，不显示水平滚动条，
     * 如果保持横纵比且不显示滚动条时，不显示滚动条
     * **/

    if (isWcp) {
        if (isKr == 'true' || isKr == true) {//保持横纵比时，显示垂直滚动条
            if (isShowScroll) {
                parentDiv.css("overflow", "hidden");
                parentDiv.css("overflow-y" , "auto");
                //为了解决联动后overflow-x属性被overflow-y覆盖掉的问题
                parentDiv.css("padding-bottom", "10px");
                parentDiv.css("margin-bottom", "-10px");
            } else {
                parentDiv.css("overflow", "hidden");
            }
        } else {
            parentDiv.css("overflow", "hidden");
        }
    } else {
        if (isShowScroll) {
            parentDiv.css("overflow", "auto");
        } else {
            parentDiv.css("overflow", "hidden");
        }
    }


    if (scrollData != undefined) {
        if (scrollData.StepScrollV > 0) {
            contentShapeMarquee(subTableObj.parent(), scrollData);
        }
    }

    if (!isWcp) {
        if (isShowCenter) {
            let parentDivWidth = parseInt(parentDiv.css('width'));
            let parentDivHeight = parseInt(parentDiv.css('height'));
            let tableHeight = parseInt(subTableObj.css('height'));

            if (tableHeight != 0) { // 处理联动时居中的问题
                if (tableHeight > parentDivHeight) {
                    let padding = (parentDivWidth - tableWidth + 10) / 2;
                    subTableObj.css('margin-left', padding);
                } else {
                    let padding = (parentDivWidth - tableWidth) / 2;
                    subTableObj.css('margin-left', padding);
                }
            } else {
                let padding = (parentDivWidth - tableWidth) / 2;
                subTableObj.css('margin-left', padding);
            }
        }
    }

    let td = parentDiv.parent(); //td单元格
    //解决关联子表单子表单内容显示不全的问题
    if(parentDiv.attr("times") == 1){
        if(td.attr("hr") == 1 && td.attr("vr") == 1){
            parentDiv.width(td.width() + parseInt(td.attr("colspan")));
        }
        parentDiv.attr("times" , 2);
    }

    //解决区域联动时单元格里的table高度会逐渐变高的问题
    if (!wcp) {
        let divHeight = subTableObj.parent().height(); //外层div高度
        if (divHeight > originHeight) {
            subTableObj.parent().height(originHeight);
        }
    }

    //单元格是否已经初始化标识，主要用来判断区域联动时，子表单是否需要重复计算拉升比率
    if (tdTableRatioMap[tdId] == undefined) {
        tdTableRatioMap[tdId] = ratios;
    }

}


function refreshSubSheetTable(tdId, data, itemId, index, sheetName, isWcp, isKr, isShowScroll, scrollData, isShowCenter) {

    let page = data.Pages[0];
    let rows = page.Rows;
    let columns = page.Columns;
    let ratios = [1, 1];
    let tableWidth; //表单table的宽度

    //生成子报表Table
    let colorList = data.ColorList; //颜色列表
    let fontList = data.FontList; //字体列表
    let sheetColorList = colorList;
    //渲染table的每个单元格
    $.each(page.Cells, function (i, cell) {
        let cellProp = cell.N;
        let tdCellId = tdId + '_' + itemId + '_' + (cellProp[1]) + '_' + (cellProp[0]); //td ID
        let td = $('#' + tdCellId);
        //let pSheetName = table.attr('sheetname'); //table对应的表单
        if (isWcp) { //初始化自适应单元格
            refreshWcpCell(td, cell, sheetName, ratios[0], ratios[1], colorList, data);
        } else { //初始化普通单元格
            refreshNormalCell(td, cell, sheetName, colorList,sheetName);
        }
    });

}



//刷新子表单
function refreshSubSheet(td, cell, subSheetName , isForm , pathId) {
    // 关联子表单属性
    let sheetNames = cell.SubReportSheetNames; //获取单元格关联的子表单集合
    let isSubReportCellPercent = cell.IsSubReportCellPercent; //子报表是否自适应属性
    let isSubReportKeepHVRatio = cell.IsSubReportKeepHVRatio; //子报表是否保持横纵比属性
    let isShowCenterSubReport = cell.IsShowCenterSubReport; //是否居中显示
    let isShowSubReportScrollBar = cell.IsShowSubReportScrollBar; //是否显示垂直滚动条
    let intervalScrollH = cell.IntervalScrollH; //水平滚动时间
    let stepScrollV = cell.StepScrollV; //垂直滚动像素
    let intervalScrollV = cell.IntervalScrollV;

    let scrollData = {
        StepScrollV: stepScrollV,
        IntervalScrollV: intervalScrollV
    };

    let width = td.attr('ow');  //单元格原始宽度
    let height = td.attr('oh'); //单元格原始高度
    let tdId = td.attr("id");
    let carouselId = tdId + "_carousel";

    var div = td.find('div');//单元格内的DIV
    div.attr("times", 1); //第一次初始化标识
    //外层包裹容器,这里没有使用td.height()，是因为td.height()获取的是单元格合并前TD的高度
    if (sheetNames.length > 1) {//当关联多个子表单时，添加滚动DIV
        div.empty();
        //外层DIV
        let carouselHtml;
        if (isShowSubReportScrollBar) {
            carouselHtml =
                "<div id='" + carouselId + "' class='layui-carousel' style='width:" + parseInt(width) + "px;height:" + parseInt(height) + "px;margin:0px;padding:0px;'>" +
                "   <div carousel-item id='car'></div>" +
                "<div>";
        } else {
            carouselHtml =
                "<div id='" + carouselId + "' class='layui-carousel' style='width:" + parseInt(width) + "px;height:" + parseInt(height) + "px;margin:0px;padding:0px;'>" +
                "   <div carousel-item id='car'></div>" +
                "<div>";
        }


        div.append(carouselHtml);
        let carouselProp = {}; //轮播属性
        carouselProp['height'] = height;
        carouselProp['width'] = width;
        carouselProp['interval'] = intervalScrollH;

        // 更新轮播信息
        carouselMap[carouselId] = carouselProp;
        //将DIV动态添加到轮播DIV中
        $.each(cell.SubReportSheetNames, function (i, item) {
            let itemId = carouselId + "_item_" + i;
            //轮播条目
            let carouselItemDivHtml = "<div id='" + itemId + "'></div>";
            $('#' + carouselId).find('#car').append(carouselItemDivHtml);
            $('#' + itemId).css("width", td.css("width"));
            $('#' + itemId).css("height", td.css("height"));
        })
    } else { //关联一个子表单

        let itemId = carouselId + "_item_" + 0;
        div.attr("id", itemId);
        div.css("width" , parseInt(width) + "px");
        div.empty(); //清空原先的span

    }

    $.ajaxSettings.async = false;
    //遍历子报表项目
    $.each(cell.SubReportSheetNames, function (i, item) {
        let itemId = carouselId + "_item_" + i;
        $.getJSON(base + '/report/loadJSON?' + "t=" + new Date().getTime() + "&token=" + token, {
            file: item, //子sheet名
            pathId: pathId,
            serverId: serverId
        }, function (data) {
            //生成子表单Table
            generateSubSheetTable(td.attr("id"), data, itemId, i, item, isSubReportCellPercent, isSubReportKeepHVRatio, isShowSubReportScrollBar, scrollData, isShowCenterSubReport);
        });
    });
    $.ajaxSettings.async = true;
}