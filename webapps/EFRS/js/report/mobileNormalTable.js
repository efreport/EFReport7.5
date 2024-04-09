/***
 * 生成常规报表的js文件
 * */
let normalUploadIdArray = [];
let normalDateIdArray = []; //时间控件ID集合
//初始化报表内容
function initNormalReport(tableId , sheetInfo){
    curSheet = sheetInfo.SheetName; //当前选择的sheet页
    // 生成table的HTML
    let tableHtml =
        "<div class='x-data-bg_block show'>"+
        "<table id='" + tableId + "' stable='1' class='x-table' sheetname='" + sheetInfo.SheetName + "'" + "cellspacing='0'  cellpadding='0'>"
        +"</table>"
        +"</div>";
    $('#content').append(tableHtml);

    $('#' + tableId).hide(); //隐藏DOM元素，渲染效率更高


    if (reportJson.SheetUploadInfos.length>0) {
        $("#div_btn_data_submit").show();
    } else {
        $("#div_btn_data_submit").hide();
    }

    //校验信息
    let sheetDataCheckInfos = reportJson.SheetDataCheckInfos;
    //是否显示校验按钮
    if (sheetDataCheckInfos != undefined && sheetDataCheckInfos.length > 0) {
        $("#div_btn_data_validate").show();
    } else {
        $("#div_btn_data_validate").hide();
    }

   

    let page = reportJson.Pages[0]; //页面信息
    let rows = page.Rows; //页面行信息
    let columns = page.Columns; //页面列信息
    let shapes = page.Shapes; //悬浮元素

    let table = $('#' + tableId);
    let html = '';
    //生成报表Table
    for (let i = 0; i < rows.Count; i++) { //遍历行
        let trId = tableId + "_r_" + (i+1); // 生成行ID
        let oh = rows.RowArray[i].H; //行高度
        // 生成行tr
        html += "<tr oh='" + oh + "' attr='" + oh + "' style='height: " + oh  + "px;overflow:auto;" + (0 === oh ? "display: none;" : "block") + "' id='" + trId + "'>";
        //生成单元格td
        for (let j = 0; j < columns.Count; j++) { //
            let ow = columns.ColumnArray[j].W; //单元格原始宽度
            let tdId = tableId + "_" + (i+1) + "_" + (j+1);//单元格ID
            // 动态生成单元格TD
            //html += "<td  hr='1' vr='1' oh='" + oh + "' ow='" + ow + "' attr='" + ow + "' style='table-layout:fixed;width: " + ow  + "px;height:" + oh  + "px;padding: 0;" + (0 === ow ? "display: none;" : "") + "' id='" + tdId + "' idx='" + (j + 1) + "'></td>";
            html += "<td  oh='" + oh + "' ow='" + ow + "' attr='" + ow + "' style='table-layout:fixed;width: " + ow  + "px;height:" + oh  + "px;padding: 0;" + (0 === ow ? "display: none;" : "") + "' id='" + tdId + "' idx='" + (j + 1) + "'></td>";
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
        initNormalCell(td, cell ,tableId , reportJson.ColorList);//根据单元格内容来渲染单元格
    });

    //渲染轮播图
    $.each(carouselMap , function(k,v){
        //渲染轮播
        carousel.render({
            elem: '#' + k,
            width: '100%', //设置容器宽度
            arrow: 'hover', //始终显示箭头
            interval: v['interval'],
            height:v['height']
        });

    });

    if(shapes != undefined){ //存在悬浮元素
        initShapes(shapes , 1, 1 , tableId);
    }
    setNormalChangeEvent();
    $('#' + tableId).show(); //显示DOM元素
}

//分页更新报表内容
function initNormalReportByPage(tableId){
    

    $('#' + tableId).hide(); //隐藏DOM元素，渲染效率更高

    let page = reportJson.Pages[0]; //页面信息
    let rows = page.Rows; //页面行信息
    let columns = page.Columns; //页面列信息

    let table = $('#' + tableId);
    let html = '';
    //生成报表Table
    for (let i = 0; i < rows.Count; i++) { //遍历行
        let trId = tableId + "_r_" + (i+1); // 生成行ID
        let oh = rows.RowArray[i].H; //行高度
        // 生成行tr
        html += "<tr oh='" + oh + "' attr='" + oh + "' style='height: " + oh  + "px;overflow:auto;" + (0 === oh ? "display: none;" : "block") + "' id='" + trId + "'>";
        //生成单元格td
        for (let j = 0; j < columns.Count; j++) { //
            let ow = columns.ColumnArray[j].W; //单元格原始宽度
            let tdId = tableId + "_" + (i+1) + "_" + (j+1);//单元格ID
            // 动态生成单元格TD
            html += "<td  hr='1' vr='1' oh='" + oh + "' ow='" + ow + "' attr='" + ow + "' style='table-layout:fixed;width: " + ow  + "px;height:" + oh  + "px;padding: 0;" + (0 === ow ? "display: none;" : "") + "' id='" + tdId + "' idx='" + (j + 1) + "'></td>";
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
        initNormalCell(td, cell ,tableId , reportJson.ColorList);//根据单元格内容来渲染单元格
    });
    $('#' + tableId).show(); //显示DOM元素
}

//初始化单元格
function initNormalCell(td , cell , tableId , colorList){
    let cellProp = cell.N; //单元格属性
    //单元格不产生滚动条
    td.css("overflow-x", "hidden");
    td.css("overflow-y", "hidden");
    //修改span的高度和宽度
   /* let tdWidth = td.attr('ow');  //单元格原始高度
    let tdHeight = td.attr('oh'); //单元格原始宽度*/
    let tdWidth = td.width();
    let tdHeight = td.height();
    let topBdWidth = cellProp[6];//上边框宽度
    let bottomBdWidth = cellProp[12]; //下边框宽度
    let leftBdWidth = cellProp[3]; //左边框宽度
    let rightBdWidth = cellProp[9]; //右边框宽度
    let fontSize = cellProp[15] + 3; //字体大小与设计器大小有出入

    // 2023-03-17   ----看注释
    // 这里加个注释：特别要注意一下子，就是表格模板里面有一个自适应高度，当单元格中的数据没有显示全的时候，先看下，自适应高度是否开启了


    //填充单元格内容
    if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
        td.html('<div style="width:' + tdWidth + 'px;height:' + tdHeight + 'px;box-sizing:border-box;"><span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe id="fra" oh="' + tdHeight + '" ow="' + tdWidth + '" src="' + base +   '/export/' + cell.HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span></div>');
    } else { //设置文本
        let text = (cell.T == undefined ? "" : cell.T);
        //处理换行问题
        let reg = new RegExp("&e&", "g");//g,表示全部替换。
        if (text != "") {
            text = text.replace(reg, "<br>"); //处理所有的换行
        }
        //填充单元格内容
        td.html('<div><span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;word-break:break-word;white-space:pre-line;">' + text + '</span></div>');
    }
    let div = td.children(0); //div
    let span = td.children(0).children(0);//span

    //渲染水平居中属性
    if (cell.hasOwnProperty("AH")) {
        if (cell.AH == 1) { //AH = 1时，水平居左
            span.css("justify-content", "flex-start");
            span.css("text-align", "left");
        } else { //水平居右
            span.css("justify-content", "flex-end");
            span.css("text-align", "right");
        }
    } else { //没有AH属性，默认居中
        span.css("justify-content", "center");
        span.css("text-align", "center");
    }
    //渲染垂直居中属性
    if (cell.hasOwnProperty("AV")) { //垂直居中
        if (cell.AV == 16) {  //AlignmentV->AV
            span.css("align-items", "flex-start");
        } else {
            span.css("align-items", "flex-end");
        }
    } else {
        span.css("align-items", "center");
    }
    //判断单元格是否有背景颜色
    if (cell.hasOwnProperty("BC")) { //设置单元格背景颜色
        let index = cell.BC;
        td.css("background-color", colorList[index]);
    }else{ //当单元格没有背景颜色时，判断单元格所在行是否有背景颜色
        let row = cellProp[1]; //获取行号
        let rows = reportJson.Pages[0].Rows;
        let rowArray = rows.RowArray;
        let rowObj = rowArray[row-1];
        //行有颜色时
        if(rowObj != undefined && rowObj.Color != undefined){
            td.css("background-color", colorList[rowObj.Color]);
        }else{ //当行没有颜色时，判断单元格所在列是否有背景颜色
            let col = cellProp[0]; //获取列号
            let cols = reportJson.Pages[0].Columns;
            let colArray = cols.ColumnArray;
            let colObj = colArray[col-1];

            if(colObj != undefined && colObj.Color != undefined){
                td.css("background-color", colorList[colObj.Color]);
                td.css("background-color" , colorList[colObj.Color]);
            }
        }
    }

    //渲染单元格文本属性
    if (cell.hasOwnProperty("T")) { //渲染文本属性
        let colorIndex = cellProp[19]; //文本颜色索引
        let color = colorList[colorIndex];
        let fontIndex = cellProp[14]; //字体索引
        let font = fontList[fontIndex];
        span.css({
            "font-weight": (cellProp[16] == 1 ? "bold" : "normal"),
            "color": color,
            "font-style": (cellProp[17] == 1 ? "italic" : "normal"),
            "font-family": font,
            "font-size": fontSize,
            "text-decoration": (cellProp[18] == 1 ? "underline" : "none")
        });
    }
    // 渲染单元格字间距属性
    if (cell.hasOwnProperty("LS")) { //字间距
        span.css({
            "letter-spacing": cell.LS + 'px'
        });
    }
    //渲染单元格行间距属性
    if (cell.hasOwnProperty("LnS")) { //行间距
        span.css({
            "line-height": (cell.LnS + cellProp[15]) + 'px'
        });
    }
    //渲染单元格上下内边距
    if (cell.hasOwnProperty("TCM")) { //上内边距
        if (cell.hasOwnProperty("BCM")) { //上下内边距都存在
            span.css({
                "padding-bottom": cell.BCM + 'px',
                "padding-top": cell.TCM + 'px',
                "height": tdHeight - cell.BCM - cell.TCM
            });
        } else {//只有上内边距
            span.css({
                "padding-top": cell.TCM + 'px',
                "height": tdHeight - cell.TCM
            });
        }
    } else {//没有上内边距
        if (cell.hasOwnProperty("BCM")) { //只有下内边距
            span.css({
                "padding-bottom": cell.BCM + 'px',
                "height": tdHeight - cell.BCM
            });
        }
    }
    //渲染单元格左右内边距
    if (cell.hasOwnProperty("LCM")) { //左内边距
        if (cell.hasOwnProperty("RCM")) { //左右内边距都存在
            span.css({
                "padding-right": cell.RCM + 'px',
                "padding-left": cell.LCM + 'px',
                "width": tdWidth - cell.RCM - cell.LCM
            });
        } else {//只有左内边距,右边距默认为2
            span.css({
                "padding-right": '2px',
                "padding-left": cell.LCM + 'px',
                "width": tdWidth - 2 - cell.LCM
            });
        }
    } else {//没有左内边距，左内边距默认为2
        if (cell.hasOwnProperty("RCM")) { //右内边距
            span.css({
                "padding-left": '2px',
                "padding-right": cell.RCM + 'px',
                "width": tdWidth - cell.RCM - 2
            });
        } else {//左右内边距都没有时，默认都为2
            span.css({
                "padding-left": '2px',
                "padding-right": '2px',
                "width": tdWidth - 4
            });
        }
    }


    if (cell.RepaintRegions != undefined) {//有区域联动,添加下划线
        span.css({
            "cursor":"pointer" //鼠标变成手型
        });
    }

    //合并单元格
    if (cell.hasOwnProperty("G")) { //有合并单元格属性
        //区域联动时，此时的单元格已经合并，无需再做合并操作
        if(td.attr('colspan') != undefined || td.attr('rowspan') != undefined){

        }else{
            mergeCell(cell, td, tableId, cellProp[0], cellProp[1]); //合并单元格
        }
    }



    //绘制左边框样式
    if (cellProp[2] != 0) {
        let lStyle = cellProp[2] > 1 ? 'dashed' : 'solid';
        let lColorIndex = cellProp[4],
            lColor = colorList[lColorIndex];
        td.css({
            "border-left-color": lColor,
            "border-left-style": lStyle,
            "border-left-width": (leftBdWidth + "px")
        });
    }
    //绘制上边框样式
    if (cellProp[5] != 0) {
        let tStyle = cellProp[5] > 1 ? 'dashed' : 'solid';
        let tColorIndex = cellProp[7], tColor = colorList[tColorIndex];
        td.css({
            "border-top-color": tColor,
            "border-top-style": tStyle,
            "border-top-width": (topBdWidth + "px")
        });
    }
    //绘制右边框样式
    if (cellProp[8] != 0) {
        let rStyle = cellProp[8] > 1 ? 'dashed' : 'solid';
        let rColorIndex = cellProp[10], rColor = colorList[rColorIndex];
        td.css({
            "border-right-color": rColor,
            "border-right-style": rStyle,
            "border-right-width": (rightBdWidth + "px")
        });
    }
    //绘制下边框样式
    if (cellProp[11] != 0) {
        let bStyle = cellProp[11] > 1 ? 'dashed' : 'solid';
        let bColorIndex = cellProp[13], bColor = colorList[bColorIndex];
        td.css({
            "border-bottom-color": bColor,
            "border-bottom-style": bStyle,
            "border-bottom-width": (bottomBdWidth + "px")
        });
    }

    //折叠行折叠列事件
    if (cell.hasOwnProperty("RetractRow")) {
        if (cell.RetractAtInit === 1) { //默认折叠
            var height = td.parent().height(); //获取tr的高度
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + tableId + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='N'>+</a>");
            for (var m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
                $("#" + tableId + "_r_" + m).hide(); //隐藏行
                $("#" + tableId + "_r_" + m).attr('isPFold', 'N');
            }
            if (cell.G != undefined) {
                td.attr("isg", '1'); //当前单元格需要合并
                td.attr("rowspan", (parseInt(td.attr("rowspan")) - (m - cell.RetractBeginRow)));
                //td.attr("height", height); //手动修改td的高度
                td.css("height", height);
                td.find("div").eq(0).css("height", height); //手动修改td里面span的高度
                td.find("span").eq(0).css("height", height); //手动修改td里面span的高度
            } else {
                td.attr("isg", '0'); //当前单元格需要合并
            }
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + tableId + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='Y'>-</a>");
            for (var m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
                $("#" + tableId + "_r_" + m).show();
            }
            if (cell.G != undefined) {
                td.attr("isg", '1'); //当前单元格需要合并
                td.attr("rowspan", ((m - cell.RetractBeginRow + 1)));
                td.find("div").eq(0).css("height", height); //手动修改td里面span的高度
                td.find("span").eq(0).css("height", height); //手动修改td里面span的高度
            } else {
                td.attr("isg", '0'); //当前单元格需要合并
            }
        }
    }

    if (cell.hasOwnProperty("RetractCol")) {
        if (cell.RetractAtInit === 1) {
            var width = td.width(); //获取td的宽度,此时宽度是总宽度
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:5px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \'" + tableId + "\');' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>+</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + tableId + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
            td.attr("colspan", (parseInt(td.attr("colspan")) - (m - cell.RetractBeginCol)));
            td.css("width", Math.ceil(width / cell.G.C)); //获取合并的列数并且手动修改td的高度
            td.find("div").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
            td.find("span").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \"" + tableId + "\");' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>-</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + tableId + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
        }
    }

    if (cell.IsSubReportCellPercent != undefined) {//子报表是否自适应
        //为TD添加子报表是否自适应属性
        td.attr("isSubReportCellPercent", cell.IsSubReportCellPercent ? true : false);
    }
    if (cell.IsShowCenterSubReport != undefined) {//是否居中显示
        //为TD添加子报表是否自适应属性
        td.attr("isShowCenterSubReport", cell.IsShowCenterSubReport ? true : false);
    }
    if (cell.IsShowSubReportScrollBar != undefined) {//是否显示垂直滚动条
        //为TD添加子报表是否自适应属性
        td.attr("isShowSubReportScrollBar", cell.IsShowSubReportScrollBar ? true : false);
    }
    if (cell.IsSubReportKeepHVRatio != undefined) {//子报表是否保持横纵比
        //为TD添加子报表是否保持横纵比属性
        td.attr("isSubReportKeepHVRatio", cell.IsSubReportKeepHVRatio ? true : false);
    }
    if (cell.SubReportSheetNames != undefined) {//如果单元格关联了子表单，生成子表单
        //为td添加子sheet名属性
        td.attr("SubReportSheetNames", cell.SubReportSheetNames.toString());
        generateSubSheet(td, cell, isForm);
    }
    if (cell.RepaintRegions != undefined) { //单元格区域联动
        let regions = encodeURI(cell.RepaintRegions);
        if (cell.SubReportSheetNames != undefined) { //关联子表单
            let html = "<span style='cursor: pointer;' onclick=\"Link.Fn.regionLink(this,1,'" + regions + "')\">" + td.html() + "</span>"; //whj
            td.html(html);
        } else {//当前报表区域联动
            let html = td.html();
            td.html(html);
            td.find('span').unbind().bind('click', function () { //重新绑定方法
                Link.Fn.regionLink(this, 1, regions);
            })
        }
    }

    //渲染超级链接
    if (cell.hasOwnProperty("HyperLink")) { //超级链接属性
        let htm;//td 单元格的内容
        if (td.children('a').length > 0) {
            htm = td.children('a').html();
        } else {
            htm = td.html();
        }
        td.html("<a href='javascript:;' onclick='Link.Fn.hyperlink(" + cell.HyperLink + ");'>" + htm + "</a>");
    }

    //单元格背景图片
    if (cell.hasOwnProperty("Pic")) {
        let block = cell.Pic.split("/");
        let url = base + "/export" + "/" + block[block.length - 2] + "/" + block[block.length - 1] + "?token=" + token;
        td.css("background-image", "url(" + url + ")"); //whj
        if (cell.hasOwnProperty("A")) { //图片缩放
            td.css("background-repeat", "no-repeat");
            td.css("background-size", "100% 100%");
        }else{
            td.css("background-repeat", "no-repeat");
        }
    }

    initNormalControllTd(tableId , td ,cell);
}

function refreshNormalCell(td , cell , tableId , colorList , sheetName){
    let cellProp = cell.N; //单元格属性
    //单元格不产生滚动条
    td.css("overflow-x", "hidden");
    td.css("overflow-y", "hidden");
    //修改span的高度和宽度
    /* let tdWidth = td.attr('ow');  //单元格原始高度
     let tdHeight = td.attr('oh'); //单元格原始宽度*/
    let tdWidth = td.width();
    let tdHeight = td.height();
    let topBdWidth = cellProp[6];//上边框宽度
    let bottomBdWidth = cellProp[12]; //下边框宽度
    let leftBdWidth = cellProp[3]; //左边框宽度
    let rightBdWidth = cellProp[9]; //右边框宽度
    let fontSize = cellProp[15] + 3; //字体大小与设计器大小有出入

    // 2023-03-17   ----看注释
    // 这里加个注释：特别要注意一下子，就是表格模板里面有一个自适应高度，当单元格中的数据没有显示全的时候，先看下，自适应高度是否开启了


    //填充单元格内容
    if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
        let cellDiv = td.children(0); //div
        let cellSpan = td.children(0).children(0);//span
        let iframe = cellSpan.find('iframe')[0]; //找到iframe元素
        let file = cellProp[0] + '_' + cellProp[1];
        $.getJSON(base + '/report/loadLinkJSON?token=' + token, {//根据模板名和sheetName去后台获取生成的JSON
            serverId: serverId,
            pathId: pathId,
            file: file,
            sheetName:sheetName
        } , function (data) {
            //iframe.contents().find("body").refresh(data);
            //$(iframe).contents().find("html").get(0).refresh(data);
            if(data.state == 'success'){
                let type = data.type;
                if(type == 1){
                    if(iframe != undefined){
                        iframe.contentWindow.refresh(JSON.parse(data.json));
                    }else{
                        let fileName = data.html;
                        let iframeHtml = '<iframe id="fra" oh="' + tdHeight + '" ow="' + tdWidth + '" src="' + base + '/export' + '/' + fileName + '?token=' + token + '" style="width:' + tdWidth + 'px;height:' + tdHeight + 'px;" frameborder=0 scrolling=no></iframe>';
                        cellSpan.append(iframeHtml);
                    }
                }else{
                    if(iframe != undefined){
                        $(iframe).attr('src' , base + '/export' + '/' + data.html + '?token=' + token );
                    }else{
                        let fileName = data.html;
                        let iframeHtml = '<iframe id="fra" oh="' + tdHeight + '" ow="' + tdWidth + '" src="' + base + '/export' + '/' + fileName + '?token=' + token + '" style="width:' + tdWidth + 'px;height:' + tdHeight + 'px;" frameborder=0 scrolling=no></iframe>';
                        cellSpan.append(iframeHtml);
                    }
                }
            }
        });
    } else { //设置文本
        td.empty();
        let text = (cell.T == undefined ? "" : cell.T);
        //处理换行问题
        let reg = new RegExp("&e&", "g");//g,表示全部替换。
        if (text != "") {
            text = text.replace(reg, "<br>"); //处理所有的换行
        }
        //填充单元格内容
        td.html('<div><span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;word-break:break-word;white-space:pre-line;">' + text + '</span></div>');
    }
    let div = td.children(0); //div
    let span = td.children(0).children(0);//span

    //渲染水平居中属性
    if (cell.hasOwnProperty("AH")) {
        if (cell.AH == 1) { //AH = 1时，水平居左
            span.css("justify-content", "flex-start");
            span.css("text-align", "left");
        } else { //水平居右
            span.css("justify-content", "flex-end");
            span.css("text-align", "right");
        }
    } else { //没有AH属性，默认居中
        span.css("justify-content", "center");
        span.css("text-align", "center");
    }
    //渲染垂直居中属性
    if (cell.hasOwnProperty("AV")) { //垂直居中
        if (cell.AV == 16) {  //AlignmentV->AV
            span.css("align-items", "flex-start");
        } else {
            span.css("align-items", "flex-end");
        }
    } else {
        span.css("align-items", "center");
    }
    //判断单元格是否有背景颜色
    if (cell.hasOwnProperty("BC")) { //设置单元格背景颜色
        let index = cell.BC;
        td.css("background-color", colorList[index]);
    }else{ //当单元格没有背景颜色时，判断单元格所在行是否有背景颜色
        let row = cellProp[1]; //获取行号
        let rows = reportJson.Pages[0].Rows;
        let rowArray = rows.RowArray;
        let rowObj = rowArray[row-1];
        //行有颜色时
        if(rowObj != undefined && rowObj.Color != undefined){
            td.css("background-color", colorList[rowObj.Color]);
        }else{ //当行没有颜色时，判断单元格所在列是否有背景颜色
            let col = cellProp[0]; //获取列号
            let cols = reportJson.Pages[0].Columns;
            let colArray = cols.ColumnArray;
            let colObj = colArray[col-1];

            if(colObj != undefined && colObj.Color != undefined){
                td.css("background-color", colorList[colObj.Color]);
                td.css("background-color" , colorList[colObj.Color]);
            }
        }
    }

    //渲染单元格文本属性
    if (cell.hasOwnProperty("T")) { //渲染文本属性
        let colorIndex = cellProp[19]; //文本颜色索引
        let color = colorList[colorIndex];
        let fontIndex = cellProp[14]; //字体索引
        let font = fontList[fontIndex];
        span.css({
            "font-weight": (cellProp[16] == 1 ? "bold" : "normal"),
            "color": color,
            "font-style": (cellProp[17] == 1 ? "italic" : "normal"),
            "font-family": font,
            "font-size": fontSize,
            "text-decoration": (cellProp[18] == 1 ? "underline" : "none")
        });
    }
    // 渲染单元格字间距属性
    if (cell.hasOwnProperty("LS")) { //字间距
        span.css({
            "letter-spacing": cell.LS + 'px'
        });
    }
    //渲染单元格行间距属性
    if (cell.hasOwnProperty("LnS")) { //行间距
        span.css({
            "line-height": (cell.LnS + cellProp[15]) + 'px'
        });
    }
    //渲染单元格上下内边距
    if (cell.hasOwnProperty("TCM")) { //上内边距
        if (cell.hasOwnProperty("BCM")) { //上下内边距都存在
            span.css({
                "padding-bottom": cell.BCM + 'px',
                "padding-top": cell.TCM + 'px',
                "height": tdHeight - cell.BCM - cell.TCM
            });
        } else {//只有上内边距
            span.css({
                "padding-top": cell.TCM + 'px',
                "height": tdHeight - cell.TCM
            });
        }
    } else {//没有上内边距
        if (cell.hasOwnProperty("BCM")) { //只有下内边距
            span.css({
                "padding-bottom": cell.BCM + 'px',
                "height": tdHeight - cell.BCM
            });
        }
    }
    //渲染单元格左右内边距
    if (cell.hasOwnProperty("LCM")) { //左内边距
        if (cell.hasOwnProperty("RCM")) { //左右内边距都存在
            span.css({
                "padding-right": cell.RCM + 'px',
                "padding-left": cell.LCM + 'px',
                "width": tdWidth - cell.RCM - cell.LCM
            });
        } else {//只有左内边距,右边距默认为2
            span.css({
                "padding-right": '2px',
                "padding-left": cell.LCM + 'px',
                "width": tdWidth - 2 - cell.LCM
            });
        }
    } else {//没有左内边距，左内边距默认为2
        if (cell.hasOwnProperty("RCM")) { //右内边距
            span.css({
                "padding-left": '2px',
                "padding-right": cell.RCM + 'px',
                "width": tdWidth - cell.RCM - 2
            });
        } else {//左右内边距都没有时，默认都为2
            span.css({
                "padding-left": '2px',
                "padding-right": '2px',
                "width": tdWidth - 4
            });
        }
    }


    if (cell.RepaintRegions != undefined) {//有区域联动,添加下划线
        span.css({
            "cursor":"pointer" //鼠标变成手型
        });
    }

    //合并单元格
    if (cell.hasOwnProperty("G")) { //有合并单元格属性
        //区域联动时，此时的单元格已经合并，无需再做合并操作
        if(td.attr('colspan') != undefined || td.attr('rowspan') != undefined){

        }else{
            mergeCell(cell, td, tableId, cellProp[0], cellProp[1]); //合并单元格
        }
    }



    //绘制左边框样式
    if (cellProp[2] != 0) {
        let lStyle = cellProp[2] > 1 ? 'dashed' : 'solid';
        let lColorIndex = cellProp[4],
            lColor = colorList[lColorIndex];
        td.css({
            "border-left-color": lColor,
            "border-left-style": lStyle,
            "border-left-width": (leftBdWidth + "px")
        });
    }
    //绘制上边框样式
    if (cellProp[5] != 0) {
        let tStyle = cellProp[5] > 1 ? 'dashed' : 'solid';
        let tColorIndex = cellProp[7], tColor = colorList[tColorIndex];
        td.css({
            "border-top-color": tColor,
            "border-top-style": tStyle,
            "border-top-width": (topBdWidth + "px")
        });
    }
    //绘制右边框样式
    if (cellProp[8] != 0) {
        let rStyle = cellProp[8] > 1 ? 'dashed' : 'solid';
        let rColorIndex = cellProp[10], rColor = colorList[rColorIndex];
        td.css({
            "border-right-color": rColor,
            "border-right-style": rStyle,
            "border-right-width": (rightBdWidth + "px")
        });
    }
    //绘制下边框样式
    if (cellProp[11] != 0) {
        let bStyle = cellProp[11] > 1 ? 'dashed' : 'solid';
        let bColorIndex = cellProp[13], bColor = colorList[bColorIndex];
        td.css({
            "border-bottom-color": bColor,
            "border-bottom-style": bStyle,
            "border-bottom-width": (bottomBdWidth + "px")
        });
    }

    //折叠行折叠列事件
    if (cell.hasOwnProperty("RetractRow")) {
        if (cell.RetractAtInit === 1) { //默认折叠
            var height = td.parent().height(); //获取tr的高度
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + tableId + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='N'>+</a>");
            for (var m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
                $("#" + tableId + "_r_" + m).hide(); //隐藏行
                $("#" + tableId + "_r_" + m).attr('isPFold', 'N');
            }
            if (cell.G != undefined) {
                td.attr("isg", '1'); //当前单元格需要合并
                td.attr("rowspan", (parseInt(td.attr("rowspan")) - (m - cell.RetractBeginRow)));
                //td.attr("height", height); //手动修改td的高度
                td.css("height", height);
                td.find("div").eq(0).css("height", height); //手动修改td里面span的高度
                td.find("span").eq(0).css("height", height); //手动修改td里面span的高度
            } else {
                td.attr("isg", '0'); //当前单元格需要合并
            }
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + tableId + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='Y'>-</a>");
            for (var m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
                $("#" + tableId + "_r_" + m).show();
            }
            if (cell.G != undefined) {
                td.attr("isg", '1'); //当前单元格需要合并
                td.attr("rowspan", ((m - cell.RetractBeginRow + 1)));
                td.find("div").eq(0).css("height", height); //手动修改td里面span的高度
                td.find("span").eq(0).css("height", height); //手动修改td里面span的高度
            } else {
                td.attr("isg", '0'); //当前单元格需要合并
            }
        }
    }

    if (cell.hasOwnProperty("RetractCol")) {
        if (cell.RetractAtInit === 1) {
            var width = td.width(); //获取td的宽度,此时宽度是总宽度
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:5px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \'" + tableId + "\');' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>+</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + tableId + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
            td.attr("colspan", (parseInt(td.attr("colspan")) - (m - cell.RetractBeginCol)));
            td.css("width", Math.ceil(width / cell.G.C)); //获取合并的列数并且手动修改td的高度
            td.find("div").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
            td.find("span").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \"" + tableId + "\");' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>-</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + tableId + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
        }
    }

    if (cell.IsSubReportCellPercent != undefined) {//子报表是否自适应
        //为TD添加子报表是否自适应属性
        td.attr("isSubReportCellPercent", cell.IsSubReportCellPercent ? true : false);
    }
    if (cell.IsShowCenterSubReport != undefined) {//是否居中显示
        //为TD添加子报表是否自适应属性
        td.attr("isShowCenterSubReport", cell.IsShowCenterSubReport ? true : false);
    }
    if (cell.IsShowSubReportScrollBar != undefined) {//是否显示垂直滚动条
        //为TD添加子报表是否自适应属性
        td.attr("isShowSubReportScrollBar", cell.IsShowSubReportScrollBar ? true : false);
    }
    if (cell.IsSubReportKeepHVRatio != undefined) {//子报表是否保持横纵比
        //为TD添加子报表是否保持横纵比属性
        td.attr("isSubReportKeepHVRatio", cell.IsSubReportKeepHVRatio ? true : false);
    }
    if (cell.SubReportSheetNames != undefined) {//如果单元格关联了子表单，生成子表单
        //为td添加子sheet名属性
        td.attr("SubReportSheetNames", cell.SubReportSheetNames.toString());
        generateSubSheet(td, cell, isForm);
    }
    if (cell.RepaintRegions != undefined) { //单元格区域联动
        let regions = encodeURI(cell.RepaintRegions);
        if (cell.SubReportSheetNames != undefined) { //关联子表单
            let html = "<span style='cursor: pointer;' onclick=\"Link.Fn.regionLink(this,1,'" + regions + "')\">" + td.html() + "</span>"; //whj
            td.html(html);
        } else {//当前报表区域联动
            let html = td.html();
            td.html(html);
            td.find('span').unbind().bind('click', function () { //重新绑定方法
                Link.Fn.regionLink(this, 1, regions);
            })
        }
    }

    //渲染超级链接
    if (cell.hasOwnProperty("HyperLink")) { //超级链接属性
        let htm;//td 单元格的内容
        if (td.children('a').length > 0) {
            htm = td.children('a').html();
        } else {
            htm = td.html();
        }
        td.html("<a href='javascript:;' onclick='Link.Fn.hyperlink(" + cell.HyperLink + ");'>" + htm + "</a>");
    }

    //单元格背景图片
    if (cell.hasOwnProperty("Pic")) {
        let block = cell.Pic.split("/");
        let url = base + "/export" + "/" + block[block.length - 2] + "/" + block[block.length - 1] + "?token=" + token;
        td.css("background-image", "url(" + url + ")"); //whj
        if (cell.hasOwnProperty("A")) { //图片缩放
            td.css("background-repeat", "no-repeat");
            td.css("background-size", "100% 100%");
        }else{
            td.css("background-repeat", "no-repeat");
        }
    }

    initNormalControllTd(tableId , td ,cell);
}


//单元格内包含控件时，初始化单元格内的控件
//为单元格加载控件
function initNormalControllTd(tableId, td, cell) {
    let cellProps = cell.N; //单元格属性
    let table = $('#' + tableId); //单元格所在TABLE
    let sheetName = table.attr('sheetname'); //获取table所代表的sheetname
    let tdId = td.attr("id");

    // 单选按钮 radio 在移动端要换为  单选 picker 控件
    let radio_data = [];

    //初始化单元格填报属性
    if (cell.hasOwnProperty("FirstCellRelation")) {
        /**
         * 格式:2,5;4,5;5,5;6,5;7,5;8,5;9,5;10,5;11,5;12,5;
         * 代表该单元格关联的数据位置
         * 第五行第2列，第五行第4列，第五行第6列...
         * **/
        td.attr("firstcellrelation", cell.FirstCellRelation);
        //该单元格及其关联的数据对应的填报名
        td.attr("FirstCellUploadName", cell.FirstCellUploadName);
        /**
         * 格式:2,5;4,5;5,5;6,5;7,5;8,5;9,5;10,5;11,5;12,5;
         * 填报字段在设计器上的初始位置
         * **/
        td.attr("FirstCellRelationRawLoc", cell.FirstCellRelationRawLoc);
        //单元格的原始位置
        td.attr("rawLoc", cell.R); //格式为3,5 代表第五行第三列
    }



    // 非数据链上单元格填报属性
    if (cell.hasOwnProperty("NoFieldUploadCellRelation")) {
        td.attr("NoFieldUploadCellRelation", cell.NoFieldUploadCellRelation.Relation);
        td.attr("firstcelluploadname", cell.NoFieldUploadCellRelation.UploadName);
        td.addClass('noChain');
    }

    // 分散多行关联到主要单元格
    if (cell.hasOwnProperty("CellRelation")) {
        td.attr("CellRelation", cell.CellRelation);

    }

    if (cell.hasOwnProperty("NullRecord")) {
        //空白记录
        td.parent().data("NullRecord", cell.NullRecord);
    }


    if (!cell.hasOwnProperty("IsAllowEdit")) {//一般对应主键
        if (cell.hasOwnProperty("R")) { //RawLocation -> R
            //填充单元格文本
            td.data("text", cell.T);
            //为单元格填充元信息
            td.data("meta", tdMetaInfo(cell.R.split(","), reportJson));
        }

    } else {//剩余可以编辑的列
        let coordinate = cell.R.split(","); //原始位置坐标
        let props = tdControllInfo(parseInt(coordinate[0]), parseInt(coordinate[1]), reportJson, sheetName); //根据原始位置坐标获取控件信息
        let widgetHtml = '';
        let hint = props.Hint; //控件提示
        let regions = '';//控件联动专用
        if (cell.hasOwnProperty("RepaintRegions")) {
            regions = encodeURI(cell.RepaintRegions);
        }
        td.data("text", (cell.hasOwnProperty("V") ? cell.V : cell.T)); //文本值
        td.data("meta", tdMetaInfo(coordinate, reportJson)); //填报元信息
        td.data("props", props); //控件元信息
        td.attr("controlType", props.ControlType); // 给单元格打上控件类型属性，方便后续克隆行操作生成控件
        //IsAllowEdit代表控件不可编辑，直接不添加控件即可
        if (!cell.IsAllowEdit) {//判断控件是否展示
            return false;
        }
        //控件名称
        let controlName = props.ControlName;
        let showName = controlName;
        if (controlName != undefined && controlName != '') {
            //如果控件名称数组中不包括当前控件名
            if ($.inArray(controlName, controlNames) == -1) {
                //初始化当前控件的计数信息
                controlNameInfo[controlName] = 0;
                //将控件名添加到控件名数组中
                controlNames.push(controlName);
            } else {
                //控件名称数组中已经包括当前控件名,获取当前控件名称的计数信息
                let number = controlNameInfo[controlName];
                //更新计数信息
                let newNum = parseInt(number + 1);
                controlNameInfo[controlName] = newNum;
                //控件对应的name，根据控件名和计数信息可以保证控件命名的唯一性
                showName = controlName + '_' + newNum;
                pluginIndex = newNum + 1; //页面计数器自增
            }
        }

        //单元格样式信息
        let align;
        if (!cell.hasOwnProperty('AH')) {
            align = 'center';
        } else {
            if (cell.AH == 1) {
                align = 'left';
            } else {
                align = 'right';
            }
        }
        let weight = (cellProps[16] == 1 ? "bold" : "normal");
        let colorIndex = cellProps[19];
        let color = colorList[colorIndex];
        let style = (cellProps[17] == 1 ? "italic" : "normal");
        let decoration = (cellProps[18] == 1 ? "underline" : "none");
        let fontSize = cellProps[15];
        let fontFamily = fontList[cellProps[14]];


        //文本编辑框
        if (1 === props.ControlType) {
            let id = tdId + '_input';
            td.empty();
            td.css({"position": "relative"});
            if (controlName != undefined && controlName != '') {
                widgetHtml = '<div><input onchange="changeRowStatus(\''+ tdId +'\')" id="'+ id +'" class="ef-tb-textfield layui-input" type="text" name="' + showName + '" rawname="' + controlName + '" title="' + hint + '" value="' + (cell.T == undefined ? "" : cell.T) + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';background-color:transparent;"/></div>';
            } else {
                widgetHtml = '<div><input onchange="changeRowStatus(\''+ tdId +'\')" id="'+ id +'" class="ef-tb-textfield layui-input" type="text"  title="' + hint + '" value="' + (cell.T == undefined ? "" : cell.T) + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';background-color:transparent;"/></div>';
            }
            td.html(widgetHtml);
        } else if (2 === props.ControlType) {//单选下拉列表
            //将id加入到下拉列表ID集合中，用于最终渲染select
            selectIdArray.push(tdId + '_sel');
            let obj = {};
            obj['cell'] = cell;
            obj['props'] = props;
            selectIdMap[tdId] = obj;
            td.empty();
            td.css({"text-align": ""});
            td.css('overflow', 'visible');
            let actualValue = '';
            if (cell.hasOwnProperty("V")) {  //ActualValue->V
                actualValue = cell.V; //ActualValue->V
            } else {
                actualValue = cell.T;
            }
            td.data("V", actualValue);

            // --------------------------------old---start
            // widgetHtml = '<div class="layui-form"><select ctype="2" onchange="controlEvent(this)" lay-search="" id="' + tdId + '_sel"  title="' + hint + '" sel="2" vs="' + actualValue + '" reg="' + regions + '" name="' + showName + '">';
            // //为单选下拉框添加option选项
            // $.each(props.DataDict, function (_i, _n) {
            //     if (actualValue == _n.Key) { //设置默认值
            //         widgetHtml += '<option selected value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + _n.Value + '</option>';
            //     } else {
            //         widgetHtml += '<option value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + _n.Value + '</option>';
            //     }
            // });
            // widgetHtml += '</select></div>';
            // --------------------------------old---end

            let cur_data = [];
            let valuesAry = [];
            let keysAry = [];
            let newId = tdId + '_sel';

            let showValue = "";

            $.each(props.DataDict, function (_i, _n) {
                valuesAry.push(_n.Value);
                keysAry.push(_n.Key);
                let obj =  { name: _n.Value, val: _n.Key, type: 0 };
                cur_data.push(obj);
                if (actualValue === _n.Key) {
                    showValue = _n.Value;
                }
            });

            radio_data.push({ eleName: newId, eleItems: cur_data });
            htmlStr = valuesAry.join(",") + ";" + keysAry.join(",");
            widgetHtml = '<div class="layui-form">';
            widgetHtml += '<input data-val="' + htmlStr + '" placeholder="请选择" style="text-align: center;" class="ef-tb-textfield layui-input" readonly="true" id="'+newId+'" name="' + newId + '" reg="' + regions + '" type="text" hint="' + hint + '" value="' + showValue + '" ' + '/>'; //ActualValue->V
            widgetHtml+='</div>';
            td.html(widgetHtml);


        } else if (3 === props.ControlType) {//下拉多选
            td.css({"position": "relative"});
            td.css({"text-align": ""});
            td.css('overflow', 'visible');
            td.empty();
            let selectId = td.attr("id") + '_multi';
            let dataArray = [];
            let selectValue = []; //选中的值
            if (cell.hasOwnProperty("V")) { //V代表实际值
                let v = cell.V;
                if(v != ''){ //有值
                    selectValue = v.split(',');
                }
            }

            // // --------------------old--------start
            // widgetHtml = '<div>'; //ActualValue->V
            // widgetHtml += '<div reg="' + regions + '" id="'+ selectId +'" style="background-color: transparent;"  title="' + hint + '"  reg="' + regions + '" name="' + showName + '" style = "width:100%"></div>';
            // //初始化下拉多选数据
            // $.each(props.DataDict, function (_i, _n) {
            //     let dataObj = {
            //         name:_n.Value,
            //         value:_n.Key
            //     }
            //     //被选中
            //     if($.inArray(_n.Key , selectValue) != -1){
            //         dataObj['selected'] = true;
            //     }
            //     dataArray.push(dataObj);
            // });
            // widgetHtml += '</select></div>';
            // multiSelectIdArray[selectId] = dataArray;
            // // --------------------old----------end


            let showAry = [];

             //初始化下拉多选数据
             $.each(props.DataDict, function (_i, _n) {
                let dataObj = {
                    name:_n.Value,
                    value:_n.Key
                }
                //被选中
                if($.inArray(_n.Key , selectValue) != -1){
                    dataObj['selected'] = true;
                    showAry.push(_n.Value);
                }
                dataArray.push(dataObj);
            });

            let showVal = showAry.join(",");

            multiSelectIdArray[selectId] = dataArray;


            widgetHtml = '<div>';
            widgetHtml += '<input placeholder="请选择" style="text-align: center;" class="ef-tb-textfield layui-input myRptInput" readonly="true" id="'+selectId+'" reg="' + regions + '" type="text" hint="' + hint + '" value="' + showVal + '" ' + '/>'; //ActualValue->V
            widgetHtml += "<input type='hidden' name='"+selectId+"' value='"+selectValue+"' />";
            widgetHtml += '</div>';


            td.html(widgetHtml);

            let clsStr = ""; // paramName
                 
            clsStr += '<div id="div_'+selectId+'" class="div_cls">';
            clsStr += '<div class="div_search">';
            clsStr += '<div class="searchDiv" style="text-align:left;">';
            clsStr += '<input class="clsBtn" type="button" name="btn_cancel" value="取消" />';
            clsStr += '</div>';
            clsStr += '<div class="searchDiv">';
            clsStr += '<input class="clsBtn" style="color:#007bff;" type="button" name="btn_search" value="确定" />';
            clsStr += '</div>';
            clsStr += '<div style="clear: both;"></div>';
            clsStr += '</div>';
            clsStr += '<div class="div_cls_checkbox">';
            

            // 接下来是复选框列表
            // clsStr += '';

            for (let i=0; i < dataArray.length; i++) {
                let itemObj = dataArray[i];
                if (itemObj.selected === true) {
                    clsStr += '<div class="div_cls_ele">';
                    clsStr += '<input type="checkbox" name="'+itemObj.name+'" checked="true" value="'+itemObj.value+'"><span>'+itemObj.name+'</span>';
                    clsStr += '</div>';
                } else {
                    clsStr += '<div class="div_cls_ele">';
                    clsStr += '<input type="checkbox" name="'+itemObj.name+'" value="'+itemObj.value+'"><span>'+itemObj.name+'</span>';
                    clsStr += '</div>';
                }
            }

            
            clsStr += '</div>';
            clsStr += '</div>';

            $("body").append(clsStr);

            $("#"+selectId).click(function(){
                $("#div_"+selectId+"").show();
                $("#bgDiv").show();
            });

            $("#div_"+selectId+" input[name='btn_cancel']").click(function(){
                // 点击了取消
                $("#div_"+selectId+"").hide();
                $("#bgDiv").hide();
            });

            $("#div_"+selectId+" input[name='btn_search']").click(function(){
                // 点击了 查询（确定按钮）
                let strval = "";
                let strnames = "";
                $("#div_"+selectId+" .div_cls_checkbox .div_cls_ele input:checkbox").each(function(idx, item){

                    if ($(this)['context'].checked) {
                        strval += $(this).val()+",";
                        strnames += item.name+",";
                    }
                    $("#div_"+selectId+"").hide();
                    $("#bgDiv").hide();
                });
                $("#"+selectId).val(strnames.length>0 ? strnames.substring(0, strnames.length-1): "");
                $("input[name='"+selectId+"']").val(strval.length>0 ? strval.substring(0, strval.length-1): "");
            });



        } else if (6 === props.ControlType) { //日期控件
            let widgetValue = cell.hasOwnProperty("V") ? cell.V : cell.T;
            let dateType = (props.DateType == undefined) ? "0" : props.DateType; //日期类型
            let hasTime = props.HasTime; //是否有时间
            let id = tdId + "_date";
            let propMap = {
                id: id,
                dateType: dateType,
                hasTime: hasTime,
                fontSize: fontSize,
                fontFamily: fontFamily,
                align: align,
                weight: weight,
                color: color,
                style: style,
                decoration: decoration,
                hint: hint,
                regions: regions
            }
            normalDateIdArray.push(propMap);
            dateIdMap[id] = propMap;
            td.data("V", widgetValue); //设置实际值
            widgetHtml = '<div><input  id="' + id + '" name="' + showName + '" class="ef-tb-textfield layui-input" type="text" title="' + hint + '"'
                + ' value="' + widgetValue + '" reg="' + regions + '" dateType="' + dateType + '" hasTime="' + hasTime + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';background-color:transparent;"/></div>'; //ActualValue->V
            td.html(widgetHtml);
            } else if (7 === props.ControlType) { //复选框
            td.css({"text-align": ""});
            let name =  td.attr("id") + '_checkbox';
            widgetHtml += '<div class="layui-form">';
            $.each(props.DataDict, function (_i, _n) {
                widgetHtml += '<input ctype="7" reg="' + regions + '" type="checkbox"  title="' + _n.Value + '" value="' + _n.Key + '"  name="' + name + '" ' + ($.inArray(_n.Key, cell.V) != -1 ? 'checked="checked"' : '') + ' />';
            });
            widgetHtml += '</div>';
            td.html(widgetHtml);
        } else if (8 === props.ControlType) { //数字
            td.css({"position": "relative"});
            widgetHtml = '<div class="layui-form"><input  onchange="changeRowStatus(\''+ tdId +'\')" class="ef-tb-textfield layui-input" lay-verify="number" type="text" title="' + hint + '" value="' + (cell.T == undefined ? "" : cell.T) + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';background-color:transparent;" name="' + showName + '"/></div>';
            td.html(widgetHtml);
        }
        //按钮
        else if (9 === props.ControlType) {
            //增加行按钮
            if (0 === props.ButtonType) {
                let text = props.ButtonText;
                if ('' == text || undefined == text) {
                    text = '增加';
                }
                widgetHtml = '<button class="layui-btn"  name="addButton"  onclick="triggerAdd(this);"  style="background-color: white;width:100%;height:100%;padding:0px;font-size:' + 14 + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';"><i class="layui-icon" style="font-size: 14px; color: #0094FF;font-weight:bold;">&#xe61f;'+ text +'</i></button>';
            }
            //删除行按钮
            else if (1 === props.ButtonType) {
                let text = props.ButtonText;
                if ('' == text || undefined == text) {
                    text = '删除';
                }
                widgetHtml = '<button class="layui-btn"  onclick="deleteRow(this);" style="background-color: white;width:100%;height:100%;padding:0px;"><i class="layui-icon" style="font-size: 14px; color: #0094FF;font-weight:bold;">&#xe640;'+ text +'</i></button>';
            }
            //普通按钮
            else if (2 === props.ButtonType) {
                widgetHtml = '<div><button  class="layui-btn" name="' + showName + '" rawname="' + controlName + '" style="background-color:#0094FF;font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + props.ButtonText + '</button></div>';
            }
            td.html(widgetHtml);
        } else if (10 === props.ControlType) { //单选框
            td.data("V", cell.V); //ActualValue->V

            widgetHtml += '<div class="layui-form">';
            let name = td.attr("id") + '_radio';

            var defaultval= "";
            
            let cur_data = [];

            let value_ary= [];
            let key_ary=[];

            $.each(props.DataDict, function (_i, _n) {
                value_ary.push(_n.Value);
                key_ary.push(_n.Key);
                let obj =  { name: _n.Value, val: _n.Key, type: 0 };
                cur_data.push(obj);
                if (_n.Key === cell.V) {
                    defaultval = _n.Value;
                }
            });

            let valuesStr = value_ary.join(",");
            let keysStr = key_ary.join(",");

            let htmlStr = valuesStr+";" +keysStr;


            radio_data.push({ eleName: name, eleItems: cur_data });

            widgetHtml += '<input data-val="' + htmlStr + '" placeholder="请选择" style="text-align: center;" class="ef-tb-textfield layui-input" readonly="true" id="'+name+'" name="' + name + '" reg="' + regions + '" type="text" hint="' + hint + '" value="' + defaultval + '" ' + '/>'; //ActualValue->V

            widgetHtml += '</div>';
            td.css({"text-align": ""});
            td.html(widgetHtml);

        } else if (11 === props.ControlType) { //文件
            let uploadId = tdId + '_upload';
            normalUploadIdArray.push(uploadId);
            if (cell.hasOwnProperty("V") && cell.V != "") {
                td.css("background", "none"); //PIC为背景图片时，移除该属性
                let random = randomUUID();
                let _src = base + '/uploadimages/' + id + '/' + cell.V + '?id=' + random;
                let _H = cell.hasOwnProperty("IH") ? getAlignStyleValue(cell.IH) : 'left';//ImageAlignH->IH
                let _V = cell.hasOwnProperty("IV") ? getAlignStyleValue(cell.IV) : 'top'; //ImageAlignV->IV
                //ActualValue->V
                //widgetHtml += '<div>';
                widgetHtml += '  <button type="button" class="layui-btn" style="background-color:#0094FF;display:none;padding:0px;" id="'+ uploadId +'">';
                widgetHtml += '    <i class="layui-icon">&#xe67c;</i>上传图片';
                widgetHtml += '  </button>';
                widgetHtml += '  <div>';
                widgetHtml += '    <input style="display: none;" type="text" value="' + cell.V + '"/>';
                widgetHtml += '    <img src="' + _src + '" title="' + hint + '" onclick="uploadImg(this)" style="width:' + td.width() + 'px;height:' + td.height() + 'px;background-size:cover;">';
                widgetHtml += '  </div>';
                //widgetHtml += '</div>';
                td.data("V", cell.V).css({"text-align": _H, "vertical-align": _V});//ActualValue->V
                td.html(widgetHtml);
            } else {
                //widgetHtml += '<div><input type="hidden" /><input type="file" title="' + hint + '" accept="' + Submit.Fn.processFileMime(props.FileType) + '" onchange="Submit.Fn.doUploadFile(this,\'' + props.FileType + '\',' + props.SizeLimit + ',' + props.ShowPic + ')" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';"/></div>';
                widgetHtml += '<button type="button" class="layui-btn" style="padding:0px;" id="'+ uploadId +'">';
                widgetHtml += '   <i class="layui-icon">&#xe67c;</i>上传图片';
                widgetHtml += '</button>';
                td.html(widgetHtml);
            }
        }
        // td.html(widgetHtml);


        if (radio_data.length>0) {

            // radio_data.push({ eleName: name, eleItems: cur_data });

            for (let i = 0; i < radio_data.length; i++) {
                let curObj = radio_data[i];



                let nameEl_onepicker = document.getElementById(curObj.eleName);

                let title_onepicker = "请选择";
                let array_onepicker = [
                    { name: "AAA", val: "", type: 0 }
                ];

                array_onepicker = [];
                array_onepicker = curObj.eleItems;

                let first_onepicker = []; /* 第一列元素 */
                let selectedIndex_onepicker = [0]; /* 默认选中的 元素 */
                let checked_onepicker = [0]; /* 已选选项 */

                creatList_onepicker(array_onepicker, first_onepicker);

                let picker_onepicker = new Picker({
                    data: [first_onepicker],
                    selectedIndex: selectedIndex_onepicker,
                    title: title_onepicker
                });

                picker_onepicker.on('picker.select', function (selectedVal, selectedIndex) {
                    let text1 = first_onepicker[selectedIndex[0]].text;
                    let val = first_onepicker[selectedIndex[0]].val;
                    nameEl_onepicker.value = text1 === '--无--' ? '' : text1;
                    // $("input[name='"+curObj.eleName+"']").val(val);

                    $("input[name='"+curObj.eleName+"']").val(text1);


                    let id = curObj.eleName; //获取当前控件的ID
                    let tdId = id.substr(0 , id.length - 6);//获取单元格ID
                    changeRowStatus(tdId);

                });

                picker_onepicker.on('picker.change', function (index, selectedIndex) {
                    if (index === 0){
                      firstChange();
                    }
                    function firstChange() {
                      checked_onepicker[0] = selectedIndex;
                    }
                });

                picker_onepicker.on('picker.valuechange', function (selectedVal, selectedIndex) {

                });

                nameEl_onepicker.addEventListener('click', function () {
                    picker_onepicker.show();
                });



            }


        }





        // //渲染下拉多选树控件
        // $.each(multiSelectIdArray, function (k, v) {
        //     let treeObj = xmSelect.render({
        //         el: "#" + k,
        //         clickClose: false,       //单选完关闭下拉框
        //         filterable: true,       //搜索
        //         direction: 'down',      // 展开方向 下
        //         theme: {
        //             color: '#0094FF',
        //         },
        //         tree: {
        //             show: true,
        //             //非严格模式
        //             strict: false,
        //             //默认展开节点
        //             expandedKeys: [],
        //             showLine:false,
        //             //点击节点是否展开
        //             clickExpand: true,
        //             //点击节点是否选中
        //             clickCheck: true
        //         },
        //         iconfont:{
        //             parent:'hidden'
        //         },
        //         toolbar: {
        //             show: true, //显示工具条
        //             list: ['ALL', 'CLEAR']
        //         },
        //         data: [],
        //         model: {
        //             label: {type: 'text'}
        //             //, icon: 'hidden'
        //         },  //文本显示模式
        //         //处理方式
        //         on: function (data) {
        //             let array = data.arr; //选中的数据
        //             let controlValue = '';
        //             $.each(array , function(ii,ee){
        //                 if(ii == array.length - 1){
        //                     controlValue += ee.name ;
        //                 }else{
        //                     controlValue += (ee.name + ',') ;
        //                 }
        //             })
        //             let reg = $('#' + k).attr('reg');
        //             Link.Fn.regionLink(treeObj , 3 , reg , false ,'',controlValue);
        //         },
        //     });

        //     treeObj.update({
        //         data: v,
        //         autoRow: false,
        //     })

        //     multiTreeObj[k] = treeObj;
        // });

        /**
         * 给控件绑定事件
         * */
        form.render();

        form.on('select()', function(data){
            let control = $(data.elem);
            let controlType = control.attr('ctype'); //获取控件的type
            let reg = control.attr('reg');
            Link.Fn.regionLink(control , controlType , reg , false ,'');
        });

        form.on('radio()', function(data){
            let control = $(data.elem);
            let controlType = control.attr('ctype'); //获取控件的type
            let reg = control.attr('reg');
            Link.Fn.regionLink(control , controlType , reg , false ,'');
        });

        form.on('checkbox()', function(data){
            let control = $(data.elem);
            let controlType = control.attr('ctype'); //获取控件的type
            let reg = control.attr('reg');
            Link.Fn.regionLink(control , controlType , reg , false ,'');
        });

        form.on('switch()', function(data){
            let control = $(data.elem);
            let controlType = control.attr('ctype'); //获取控件的type
            let reg = control.attr('reg');
            Link.Fn.regionLink(control , controlType , reg , false ,'');
        });


    }

}

function controlEvent(obj){
    let control = $(obj);
    let type = contorl.attr('ctype'); // 控件类型
    let reg = control.attr("reg");
    if(reg != undefined){ //存在区域联动
        Link.Fn.regionLink(control , type , reg , false ,'');
    }
}


function setNormalChangeEvent(){
    //动态渲染下拉单选控件
    $.each(selectIdArray, function (i, e) {
        form.render($('#' + e));
    });
    $.each(normalDateIdArray, function (i, e) {
        let id = e.id;
        let dateType = e.dateType; //日期类型
        let hasTime = e.hasTime;
        let format;
        if (dateType == 0) {
            format = 'yyyy-MM-dd';
        } else if (dateType == 1) {
            format = 'yyyy/MM/dd';
        } else if (dateType == 2) {
            format = 'yyyyMMdd';
        } else if (dateType == 3) {
            format = 'yyyy-MM';
        } else if (dateType == 4) {
            format = 'yyyy/MM';
        } else {
            format = 'yyyyMM';
        }

        format = format.toUpperCase();

        if(hasTime){ //日期时间
            // laydate.render({
            //     elem: '#' + id, //指定元素
            //     format: format,
            //     type: 'datetime',
            //     done:function(){
            //         let tdId = id.substr(0 , id.length - 5);//获取单元格ID
            //         changeRowStatus(tdId);
            //     }
            // });

            new Jdate({
                el:'#'+id,
                format: format,
                beginYear: 1980,
                endYear: 2050,
                confirm: function(date) {
                    let tdId = id.substr(0 , id.length - 5);//获取单元格ID
                    changeRowStatus(tdId);
                }
            });

        }else{
            // laydate.render({
            //     elem: '#' + id, //指定元素
            //     format: format,
            //     done:function(){
            //         let tdId = id.substr(0 , id.length - 5);//获取单元格ID
            //         changeRowStatus(tdId);
            //     }
            // });

            new Jdate({
                el:'#'+id,
                format: format,
                beginYear: 1980,
                endYear: 2050,
                confirm: function(date) {
                    let tdId = id.substr(0 , id.length - 5);//获取单元格ID
                    changeRowStatus(tdId);
                }
            });
        }

    });
    // $.each(multiSelectIdArray , function(k,v){
    //     let obj = xmSelect.render({
    //         // 这里绑定css选择器
    //         el: '#' + k,
    //         filterable: true,
    //         theme: {
    //             color: '#0094FF',
    //         },
    //         toolbar: {
    //             show: true, //显示工具条
    //             list: ['ALL', 'CLEAR']
    //         },
    //         // 渲染的数据
    //         data:v,
    //         on: function(data){
    //             let tdId = k.substr(0 , k.length - 6);//获取单元格ID
    //             changeRowStatus(tdId);
    //         }
    //     })
    //     //以参数名为键来保存多选下拉框对象，下拉框对象用来获取最终的参数值
    //     multiSelectObj[k] = obj;
    // });
    //渲染上传文件按钮
    $.each(normalUploadIdArray , function(i,e){
        renderNormalUpload(e);
    });
    //修改单选下拉框事件
    form.on('select' , function(data){
        let id = $(data.elem).attr("id"); //获取当前控件的ID
        let tdId = id.substr(0 , id.length - 4);//获取单元格ID
        changeRowStatus(tdId);
    })
    //修改单选框事件
    form.on('radio' , function(data){
        let id = $(data.elem).attr("name"); //获取当前控件的ID
        let tdId = id.substr(0 , id.length - 6);//获取单元格ID
        changeRowStatus(tdId);
    })
    //修改复选框事件
    form.on('checkbox' , function(data){
        let id = $(data.elem).attr("name"); //获取当前控件的ID
        let tdId = id.substr(0 , id.length - 9);//获取单元格ID
        changeRowStatus(tdId);
    })
    form.render();
}

let curPageUploadIdAry=[]; // 记录页面当前的控件id是否绑定过上传事件



//初始化上传文件按钮
function renderNormalUpload(uploadId){
    if (curPageUploadIdAry.length>0) {
        let flag = false;
        for (let i=0;i<curPageUploadIdAry.length;i++) {
            if (curPageUploadIdAry[i] === uploadId) {
                flag = true; // 存在，则表示已经绑定过了
                break;
            }
        }

        if (flag) {
            return;
        } else {
            curPageUploadIdAry.push(uploadId);
        }
    }else {
        curPageUploadIdAry.push(uploadId);
    }

    let tdId = uploadId.substr(0 , uploadId.length - 7);
    let uploadInst = upload.render({
        elem: '#' + uploadId ,//绑定元素
        url: base + "/report/uploadFile?templateId=" + id + "&tdId=" + tdId + '&token=' + token,
        accept: 'images', // 只允许上传图片
        acceptMime: 'image/*',  // 打开文件选择器时只显示图片
        choose:function(obj){},
        done: function(res){
            //上传完毕回调
            if(res.state == 'success'){ //上传成功
                //let td = $('#' + uploadId).parent(); //控件所在单元格
                let td = $('#' + tdId);
                let fileName = res.message;
                uploadImageIds.push(fileName);
                let width = td.width(); //单元格宽度
                let height = td.height();
                td.find('div').remove(); //如果之前有图片文件，先删除
                td.find('button').hide();
                let randomId = randomUUID();
                let fileNameHtml = '<div><input type="text" value="'+ fileName +'" style="display: none;"><img onclick="uploadImg(this)" style="width:'+ width +'px;height:'+ height +'px;" src="'+ base +'/uploadimages/'+ id + '/temp/' + fileName +'?id='+ randomId +'"></img></div>'
                td.append(fileNameHtml);//添加上传文件名
                let tr = td.parent();
                let tbody = tr.parent();
                let table = tbody.parent();
                let tbId = table.attr('id');
                //上传控件上帮有填报信息
                if(td.attr('cellrelation') != undefined){
                    let point = td.attr("cellrelation").split(",");
                    let idArray = tdId.split('_');
                    //找到记载着填报信息的TD
                    let relateTdId;
                    if(idArray[3] != point[1]){ //cellrelation的行数和当前单元格行数不同，说明是新增行
                        relateTdId = tbId + '_' + idArray[3] + '_' + point[0];
                    }else{
                        //找到记载着填报信息的TD
                        relateTdId = tbId + '_' + point[1] + '_' + point[0];
                    }
                    let cellRelationTd = $('#' + relateTdId);
                    if (!cellRelationTd.hasClass("cell-add")) {
                        //当记录为空记录时，修改控件后，需要插入一条记录
                        if (!cellRelationTd.parent().data("NullRecord")) {
                            cellRelationTd.addClass('cell-update');
                        } else {
                            cellRelationTd.addClass("cell-add");
                        }
                    }
                }
            }
        },
        error: function(){
            //请求异常回调
        }
    });
}