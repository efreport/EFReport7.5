/**
 *
 * 生成普通Form表单
 *
 * **/

function initForm(tableId , sheetInfo) {

    let tableHtml =
        "<div class='x-data-bg_block show'>"+
        "<table id='" + tableId + "' stable='1' class='x-table' sheetname='" + sheetInfo.SheetName + "'" + "cellspacing='0'  cellpadding='0'>"
        +"</table>"
        +"</div>";
    $('#content').append(tableHtml);

    $('#' + tableId).hide(); //隐藏DOM元素，渲染效率更高



    let pages = reportJson.Pages;
    let page0 = pages[0];

    let totalFWidth = page0.FormW; //form的总宽度
    let totalFHeight = page0.FormH;//form的总高度
    //设置背景图片
    if (reportJson.hasOwnProperty("WebBKImage")) {
        bgImg = reportJson.WebBKImage.split("/");
        $('#content').css({
            "background-image": "url('" + (base + "/export/" + bgImg[bgImg.length - 2]) + "/" + bgImg[bgImg.length - 1] + "')",
            "background-repeat": "no-repeat",
            "background-position": "0 0",
            "background-size": "100% 100%"
        });
    } else {//无背景图片时，设置背景颜色
        if (reportJson.hasOwnProperty("WebBKColor")) { //whj
            $('body').css("background-color", reportJson.WebBKColor);
            $('#content').css("background-color", reportJson.WebBKColor); //whj
        }
    }
    //显示参数工具栏
    if(reportJson.ShowParamToolBar){
        $('#param').show();
    }
    //显示普通工具栏
    if(reportJson.ShowToolBar){
        $('#tool').show();
    }


    let shapes = page0.Shapes; //所有的悬浮元素
    initShapes(shapes, 1, 1 , tableId);
    setContentHeight(); //设置内容区高度

    $('#' + tableId).show();
}

//生成悬浮元素
function initShapes(shapes, hRatio, vRatio , tableId) {
    //遍历悬浮元素
    $.each(shapes, function (index, element) {
        //随机生成悬浮元素ID
        let id = randomUUID();
        let width = element.Width * hRatio; //悬浮元素宽度
        let height = element.Height * vRatio; //悬浮元素高度
        let HtmlFile = element.HtmlFile; //Html文件
        let x = element.X * hRatio; //x轴位置
        let y = element.Y * vRatio; //y轴位置
        let text = element.Text; //悬浮元素文本
        let html;
        let borderStyle = '';
        let visible = element.Visible; //悬浮元素是否可见
        let display = 'flex';
        if (visible != undefined) {
            display = 'none';
        }

        if (element.BW != undefined) { //边框
            borderStyle = 'border-style:solid;border-width:' + element.BW + 'px;border-color:' + element.BC + ';box-sizing:border-box;';
        }
        //有插件
        if (element.HtmlFile != undefined) {
            html = '<div type="plugin" id="' + id + '"class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z - 200) + ';display:' + display + ';">' +
                '       <iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base + '/export/' + HtmlFile + '" style="width:' + width + 'px;height:' + height + 'px;" frameborder=0 scrolling=no>' +
                '       </iframe>' +
                '   </div>'
        } else { //没有插件
            if (element.SN != undefined) {//包含子表单
                let sheetName = element.SN;
                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z - 200) + ';display:' + display + ';">' +
                    '<table id="_tb_sheet_' + id + '" stable="1" class="x-table" sheetname="' + sheetName + '"style="border-collapse:collapse;border:none;border-spacing:2px;-webkit-border-horizontal-spacing: 2px;' +
                    '-webkit-border-vertical-spacing: 2px;table-layout: fixed;"  cellspacing="0"  cellpadding="0">' +
                    '</table></div>'
                //获取sheet数据并且渲染
                $.getJSON(base + '/report/loadJSON?' + "t=" + new Date().getTime() + "&token=" + token + '&serverId=' + serverId , {
                    file: sheetName, //子sheet名
                    pathId: pathId,
                    serverId: serverId
                }, function (data) {
                    //生成子表单
                    generateShapeSheet("_tb_sheet_" + id, data, element, width, height);
                });

            } else {//不包含子表单
                let cssText = '';
                //文本大小
                cssText += ('font-size:' + element.Font.Size + 'px;');
                //文本样式
                cssText += ('font-family:' + element.Font.Name + ';');
                //文本颜色
                cssText += ('color:' + element.Font.FC + ';');
                if (element.Font.Italic) {
                    cssText += 'font-style:italic;';
                }
                if (element.Font.Bold) {
                    cssText += 'font-weight:bold;';
                }
                if (element.Font.Underline) {
                    cssText += 'text-decoration:underline;';
                }
                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';' + cssText + 'display:flex;justify-content:center;align-items:center;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z - 200) + ';display:' + display + ';">' + (text==undefined?'':text) + '</div>'
            }
        }

        $('#' + tableId).parent().append(html);
        //背景图片
        if(element.BKPic != undefined){
            let bgImg = element.BKPic.split("/");
            let url = base + '/export/' + bgImg[bgImg.length - 2] + '/' + bgImg[bgImg.length - 1];
            $('#' + id).css({
                "background-image":"url('"+ url + "?token="+ token +"')",
                "background-size":"100% 100%"
            })
        }

         if (element.Hyperlink != undefined) {
             $('#' + id).bind('click', function () {
                 let hyperlink = JSON.parse(element.Hyperlink);
                 Link.Fn.hyperlink(hyperlink);
             })
         }
    })
}

function randomUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}

function generateShapeSheet(tableId, data, element, width, height) {
    let table = $('#' + tableId); //表单table对象
    table.hide();
    let page = data.Pages[0];
    let rows = page.Rows; //行对象
    let columns = page.Columns;//列对象

    let rowNumber = rows.RowArray.length; //行数
    let columnNumber = columns.ColumnArray.length; //列数

    /**
     * 生成悬浮插件表单时，需要使用的是当前sheet JSON里面的ColorList，此时主Form的JSON数据中ColorList为空
     * **/
    let shapeSheetColorList = data.ColorList;
    let shapeFontList = data.FontList;

    let isSubReportKeepHVRatio = element.HVR; //是否保持横纵比
    let isShowScroll = element.SS; //是否显示滚动条
    let intervalScrollV = element.ISV; //垂直滚动间隔
    let stepScrollV = element.SV; //垂直滚动距离

    let scrollData = {
        StepScrollV: stepScrollV,
        IntervalScrollV: intervalScrollV
    };

    let totalTWidth = totalWidth(columns); //原始宽度
    let totalTHeight = totalHeight(rows); //原始高度
    let hRatio = horizontalFormRatio(totalTWidth , width , isSubReportKeepHVRatio , columnNumber); //水平方向拉升比例
    let vRatio = verticalFormRatio(totalTHeight , height , isSubReportKeepHVRatio , rowNumber); //垂直方向拉升比例

    if(isSubReportKeepHVRatio){ //保持横纵比
        vRatio = hRatio;
    }

    table.parent().css("overflow", "hidden"); //table的父级元素不显示滚动条
    //生成子报表Table


    let html = '';
    //生成报表Table
    for (let i = 0; i < rows.Count; i++) { //遍历行
        let trId = tableId + "_r_" + (i + 1); // 生成行ID
        let oh = rows.RowArray[i].H; //原始行高度
        let nh = oh * vRatio; //自适应后高度
        // 生成行tr
        html += "<tr oh='" + oh + "' attr='" + oh + "' style='height: " + nh + "px;overflow:auto;" + (0 === oh ? "display: none;" : "block") + "' id='" + trId + "'>";
        //生成单元格td
        for (let j = 0; j < columns.Count; j++) { //
            let ow = columns.ColumnArray[j].W; //单元格原始宽度
            let nw = ow * hRatio; //自适应后宽度
            let tdId = tableId + "_" + (i + 1) + "_" + (j + 1);//单元格ID
            // 动态生成单元格TD,高度和宽度是自适应后的高度和宽度
            html += "<td  hr='" + hRatio + "' vr='"+ vRatio +"' oh='" + oh + "' ow='" + ow + "' attr='" + ow + "' style='table-layout:fixed;width: " + nw + "px;height:" + nh + "px;padding: 0;" + (0 === ow ? "display: none;" : "") + "' id='" + tdId + "' idx='" + (j + 1) + "'></td>";
        }
        html += "</tr>";
    }
    table.html(html); //渲染Table
    table.attr('rows', rows.Count);//为Table添加总行数信息
    //渲染table的每个单元格
    $.each(page.Cells, function (i, cell) {
        let cellProp = cell.N; //单元格属性
        let tdId = tableId + "_" + (cellProp[1]) + "_" + (cellProp[0]); //单元格ID
        let td = $('#' + tdId);
        let pSheetName = table.attr('sheetname'); //table对应的表单
        //存在合并单元格，先合并
        if (cell.hasOwnProperty("G")) {
            mergeWcpCell(cell, td, tableId, cellProp[0], cellProp[1], hRatio , vRatio);
        }
        initWcpFormSheetCell(td, cell, tableId , hRatio , vRatio , shapeSheetColorList , shapeFontList);//根据单元格内容来渲染单元格
    });

    table.show();
    if (isSubReportKeepHVRatio) { //保持横纵比
        //显示垂直滚动条
        if(isShowScroll){
            table.parent().css('overflow-y', 'auto');
        }else{
            table.parent().css('overflow-y', 'hidden');
        }
        if (intervalScrollV > 0) { //垂直滚动时间
            contentShapeMarquee(table.parent(), scrollData);
        }
    }
}

//计算水平方向上的比例
function horizontalFormRatio(totalWidth , shapeWidth , isSubReportKeepHVRatio , columnNumber){
    //自适应宽度/总宽度=放大比例
    if(isSubReportKeepHVRatio){
        return shapeWidth/totalWidth;
    }else{
        return shapeWidth/(totalWidth + columnNumber);
    }
}
//计算垂直方向上的比例
function verticalFormRatio(totalHeight , shapeHeight , isSubReportKeepHVRatio , rowNumber){
    //自适应高度/总高度=放大比例
    if(isSubReportKeepHVRatio){
        return shapeHeight/totalHeight;
    }else{
        return shapeHeight/(totalHeight + rowNumber);
    }
}

function contentShapeMarquee(elem, data) {
    var _StepScrollV = parseInt(data.StepScrollV);     // 滚动像素
    var _IntervalScrollV = data.IntervalScrollV;// 滚动周期
    fn = function () {
        var totalScroll = Math.ceil(elem.scrollTop()); //防止出现小数导致无法回滚到头部的问题 whj
        //当滚动的距离大于表格高度和DIV高度的差值时，说明已经滚动到底，需要从头开始滚动
        if (totalScroll + +_StepScrollV >= (elem.children(":first").height() - elem.height())) {
            totalScroll = 0;
        } else {
            totalScroll += _StepScrollV;
        }
        elem.scrollTop(totalScroll);
    },
        clearInterval(timer);
    timer = setInterval(fn, _IntervalScrollV);
    //悬浮在子表单上时，停止上下滚动
    elem.hover(function () {
        //当元素处于滚动状态
        if (elem.attr("scl") == undefined || elem.attr("scl") == 'start') {
            clearInterval(timer);
            elem.attr("scl", 'stop');
        }
        if (elem.attr("scl") == 'stop') {
            fn();
        }
    }, function () {
        if (elem.attr('scl') == 'stop') {

        }
        // 清除定时器,解决滚动越来越快的问题
        clearInterval(timer);
        timer = setInterval(fn, _IntervalScrollV);
        elem.attr("scl", 'start');
    });
}


