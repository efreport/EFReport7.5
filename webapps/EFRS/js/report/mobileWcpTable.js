/***
 * 生成常规自适应报表的js文件
 * */
//初始化报表内容
function initWcpReport(tableId, sheetInfo) {
    curSheet = sheetInfo.SheetName; //当前选择的sheet页
    // 生成table的HTML
    let tableHtml =
        "<div class='x-data-bg_block show'>" +
        "<table id='" + tableId + "' stable='1' class='x-table' sheetname='" + sheetInfo.SheetName + "'" + " cellspacing='0'  cellpadding='0'>"
        + "</table>"
        + "</div>";
    $('#content').append(tableHtml);

    $('#' + tableId).hide(); //隐藏DOM元素，渲染效率更高

    let page = reportJson.Pages[0]; //页面信息
    let rows = page.Rows; //页面行信息
    let columns = page.Columns; //页面列信息

    let tWidth = totalWidth(columns); //根据所有列计算报表的原始总宽度
    let tHeight = totalHeight(rows); //根据所有列计算报表的原始总高度
    let hRatio = horizontalRatio(tWidth); //计算水平方向上的比例
    let vRatio = verticalRatio(tHeight); //计算垂直方向上的比例
    if(kr == 1){ //如果保持横纵比
        vRatio = hRatio; //垂直方向放大比例等于水平方向放大比例
    }
    /*obj.parent().css("overflow", "hidden"); //table的父级元素不显示滚动条
    if (keepHr == '1') {//如果保持横纵比，纵向滚动条需要显示
        obj.parent().css("overflow-y", "auto");
    }*/

    let table = $('#' + tableId);
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
           mergeWcpCell(cell, td, tableId, cellProp[0], cellProp[1], horizontalRatio , verticalRatio);
        }
        initWcpCell(td, cell, tableId , hRatio , vRatio ,reportJson.ColorList, reportJson);//根据单元格内容来渲染单元格
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

    $('#' + tableId).show(); //显示DOM元素
}

//根据所有列来计算报表宽度
function totalWidth(columns) {
    let width = 0;
    $.each(columns.ColumnArray, function (i, item) {
        width += item.W;
    });
    return width;
}

//根据所有行来计算报表高度
function totalHeight(rows) {
    // 计算表格总宽度
    var height = 0;
    $.each(rows.RowArray, function (i, item) {
        height += item.H;
    });
    return height;
}
//计算水平方向上的比例
function horizontalRatio(totalWidth){
    let bodyWidth = $('body').width(); //页面宽度
    //自适应宽度/总宽度=放大比例
    return bodyWidth/totalWidth;
}
//计算垂直方向上的比例
function verticalRatio(totalHeight){
    let bodyHeight = $('body').height(); //页面高度
    let toolHeight = $('#tool').height(); //工具栏高度
    let paramHeight = $('#param').height(); //参数工具栏高度
    let sheetHeight = $('#sheet').height(); //sheet栏高度

    if($('#tool').css('display') == 'none'){
        toolHeight = 0;
    }
    //不显示参数工具栏
    if($('#param').css('display') == 'none'){
        paramHeight = 0;
    }
    //不显示sheet栏
    if($('#sheet').css('display') == 'none'){
        sheetHeight = 0;
    }
    //自适应后报表区域高度
    let reportHeight = bodyHeight - toolHeight - paramHeight - sheetHeight;
    //自适应高度/总高度=放大比例
    return reportHeight/totalHeight;
}

//分页更新报表内容
/*function initNormalReportByPage(tableId) {

    $('#' + tableId).hide(); //隐藏DOM元素，渲染效率更高

    let page = reportJson.Pages[0]; //页面信息
    let rows = page.Rows; //页面行信息
    let columns = page.Columns; //页面列信息

    let table = $('#' + tableId);
    let html = '';
    //生成报表Table
    for (let i = 0; i < rows.Count; i++) { //遍历行
        let trId = tableId + "_r_" + (i + 1); // 生成行ID
        let oh = rows.RowArray[i].H; //行高度
        // 生成行tr
        html += "<tr oh='" + oh + "' attr='" + oh + "' style='height: " + oh + "px;overflow:auto;" + (0 === oh ? "display: none;" : "block") + "' id='" + trId + "'>";
        //生成单元格td
        for (let j = 0; j < columns.Count; j++) { //
            let ow = columns.ColumnArray[j].W; //单元格原始宽度
            let tdId = tableId + "_" + (i + 1) + "_" + (j + 1);//单元格ID
            // 动态生成单元格TD
            html += "<td  hr='1' vr='1' oh='" + oh + "' ow='" + ow + "' attr='" + ow + "' style='table-layout:fixed;width: " + ow + "px;height:" + oh + "px;padding: 0;" + (0 === ow ? "display: none;" : "") + "' id='" + tdId + "' idx='" + (j + 1) + "'></td>";
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
        initWcpCell(td, cell, tableId);//根据单元格内容来渲染单元格
    });
    $('#' + tableId).show(); //显示DOM元素
}*/

//初始化单元格
function initWcpCell(td, cell, tableId , horizontalRatio , verticalRatio , sheetColorList , subSheetData) {

    let page = subSheetData.Pages[0];
    let rows = page.Rows;
    let columns = page.Columns;
    let cellProp = cell.N; //单元格属性
    //单元格不产生滚动条
    td.css("overflow-x", "hidden");
    td.css("overflow-y", "hidden");
    //修改span的高度和宽度
    let tdWidth = td.width();  //单元格自适应后的宽度
    let tdHeight = td.height(); //单元格自适应后的高度
    let topBdWidth = cellProp[6];//上边框宽度
    let bottomBdWidth = cellProp[12]; //下边框宽度
    let leftBdWidth = cellProp[3]; //左边框宽度
    let rightBdWidth = cellProp[9]; //右边框宽度
    let fontSize = cellProp[15] + 3; //字体大小与设计器大小有出入
    //计算自适应后的边框高度和宽度
    //计算上边框的宽度
    if (cellProp[6] * verticalRatio < 1) {
        topBdWidth = 1; //高度最少为1
    } else {
        topBdWidth = Math.floor(cellProp[6] * verticalRatio);
    }
    //计算下边框的宽度
    if (cellProp[12] * verticalRatio < 1) {
        bottomBdWidth = 1; //高度最少为1
    } else {
        bottomBdWidth = Math.floor(cellProp[11] * verticalRatio);
    }
    //计算左边框的宽度
    if (cellProp[3] * horizontalRatio < 1) {
        leftBdWidth = 1;
    } else {
        leftBdWidth = Math.floor(cellProp[3] * horizontalRatio);
    }
    //计算右边框的宽度
    if (cellProp[9] * horizontalRatio < 1) {
        rightBdWidth = 1;
    } else {
        rightBdWidth = Math.floor(cellProp[9] * horizontalRatio);
    }
    if (cellProp[15] != undefined) {
        if(isAfs){ //文本自适应
            fontSize = parseInt(cellProp[15] * horizontalRatio);
        }else{
            fontSize = parseInt(cellProp[15]);
        }
    }

    //填充单元格内容
    if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
        td.html('<div style="width:' + tdWidth + 'px;height:' + tdHeight + 'px;box-sizing:border-box;"><span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe id="fra" oh="' + tdHeight + '" ow="' + tdWidth + '" src="' + base + '/export' + '/' + cell.HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span></div>');
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
        td.css("background-color", sheetColorList[index]);
    } else { //当单元格没有背景颜色时，判断单元格所在行是否有背景颜色
        let row = cellProp[1]; //获取行号
        if(rows != undefined){ //form状态下没有Rows属性
            let rowArray = rows.RowArray;
            let rowObj = rowArray[row - 1];
            //行有颜色时
            if (rowObj != undefined && rowObj.Color != undefined) {
                td.css("background-color", sheetColorList[rowObj.Color]);
            } else { //当行没有颜色时，判断单元格所在列是否有背景颜色
                let col = cellProp[0]; //获取列号
                let colArray = columns.ColumnArray;
                let colObj = colArray[col - 1];

                if (colObj != undefined && colObj.Color != undefined) {
                    td.css("background-color", sheetColorList[colObj.Color]);
                    td.css("background-color", sheetColorList[colObj.Color]);
                }
            }
        }

    }

    //渲染单元格文本属性
    if (cell.hasOwnProperty("T")) { //渲染文本属性
        let colorIndex = cellProp[19]; //文本颜色索引
        let color = sheetColorList[colorIndex];
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
            "cursor": "pointer" //鼠标变成手型
        });
    }

    //绘制左边框样式
    if (cellProp[2] != 0) {
        let lStyle = cellProp[2] > 1 ? 'dashed' : 'solid';
        let lColorIndex = cellProp[4],
            lColor = sheetColorList[lColorIndex];
        td.css({
            "border-left-color": lColor,
            "border-left-style": lStyle,
            "border-left-width": (leftBdWidth + "px")
        });
    }
    //绘制上边框样式
    if (cellProp[5] != 0) {
        let tStyle = cellProp[5] > 1 ? 'dashed' : 'solid';
        let tColorIndex = cellProp[7], tColor = sheetColorList[tColorIndex];
        td.css({
            "border-top-color": tColor,
            "border-top-style": tStyle,
            "border-top-width": (topBdWidth + "px")
        });
    }
    //绘制右边框样式
    if (cellProp[8] != 0) {
        let rStyle = cellProp[8] > 1 ? 'dashed' : 'solid';
        let rColorIndex = cellProp[10], rColor = sheetColorList[rColorIndex];
        td.css({
            "border-right-color": rColor,
            "border-right-style": rStyle,
            "border-right-width": (rightBdWidth + "px")
        });
    }
    //绘制下边框样式
    if (cellProp[11] != 0) {
        let bStyle = cellProp[11] > 1 ? 'dashed' : 'solid';
        let bColorIndex = cellProp[13], bColor = sheetColorList[bColorIndex];
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
                td.find("div").eq(0).css("height", height); //手动修改td里面span的高度
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
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:5px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \'" + oid + "\');' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>+</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + oid + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
            td.attr("colspan", (parseInt(td.attr("colspan")) - (m - cell.RetractBeginCol)));
            td.css("width", Math.floor(width / cell.G.C)); //获取合并的列数并且手动修改td的高度
            td.find("div").eq(0).css("width", Math.floor(width / cell.G.C)); //手动修改td里面span的高度
            td.find("span").eq(0).css("width", Math.floor(width / cell.G.C)); //手动修改td里面span的高度
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \"" + oid + "\");' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>-</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + oid + "_r_" + m).hide();
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
        //为单元格生成子表单
        generateSubSheet(td, cell , isForm);
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
        let url = base + '/export' + "/" + block[block.length - 2] + "/" + block[block.length - 1];
        td.css("background-image", "url(" + url + "?token="+ token +")"); //whj
        if (cell.hasOwnProperty("A")) { //图片缩放
            td.css("background-repeat", "no-repeat");
            td.css("background-size", "100% 100%");
        } else {
            td.css("background-repeat", "no-repeat");
        }
    }
}

//初始化悬浮插件子表单单元格
function initWcpFormSheetCell(td, cell, tableId , horizontalRatio , verticalRatio , sheetColorList , sheetFontList) {
    let cellProp = cell.N; //单元格属性
    //单元格不产生滚动条
    td.css("overflow-x", "hidden");
    td.css("overflow-y", "hidden");
    //修改span的高度和宽度
    let tdWidth = td.width();  //单元格自适应后的宽度
    let tdHeight = td.height(); //单元格自适应后的高度
    let topBdWidth = cellProp[6];//上边框宽度
    let bottomBdWidth = cellProp[12]; //下边框宽度
    let leftBdWidth = cellProp[3]; //左边框宽度
    let rightBdWidth = cellProp[9]; //右边框宽度
    let fontSize = cellProp[15] + 3; //字体大小与设计器大小有出入
    //计算自适应后的边框高度和宽度
    //计算上边框的宽度
    if (cellProp[6] * verticalRatio < 1) {
        topBdWidth = 1; //高度最少为1
    } else {
        topBdWidth = Math.floor(cellProp[6] * verticalRatio);
    }
    //计算下边框的宽度
    if (cellProp[12] * verticalRatio < 1) {
        bottomBdWidth = 1; //高度最少为1
    } else {
        bottomBdWidth = Math.floor(cellProp[11] * verticalRatio);
    }
    //计算左边框的宽度
    if (cellProp[3] * horizontalRatio < 1) {
        leftBdWidth = 1;
    } else {
        leftBdWidth = Math.floor(cellProp[3] * horizontalRatio);
    }
    //计算右边框的宽度
    if (cellProp[9] * horizontalRatio < 1) {
        rightBdWidth = 1;
    } else {
        rightBdWidth = Math.floor(cellProp[9] * horizontalRatio);
    }
    if (cellProp[15] != undefined) {
        if(isAfs){ //文本自适应
            fontSize = parseInt(cellProp[15] * horizontalRatio);
        }else{
            fontSize = parseInt(cellProp[15]);
        }
    }

    //填充单元格内容
    if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
        td.html('<div style="width:' + tdWidth + 'px;height:' + tdHeight + 'px;box-sizing:border-box;"><span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe id="fra" oh="' + tdHeight + '" ow="' + tdWidth + '" src="' + base + '/export' + '/' + cell.HtmlFile +'" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span></div>');
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
        td.css("background-color", sheetColorList[index]);
    } else { //当单元格没有背景颜色时，判断单元格所在行是否有背景颜色
        let row = cellProp[1]; //获取行号
        let rows = reportJson.Pages[0].Rows;
        if(rows != undefined){ //form状态下没有Rows属性
            let rowArray = rows.RowArray;
            let rowObj = rowArray[row - 1];
            //行有颜色时
            if (rowObj != undefined && rowObj.Color != undefined) {
                td.css("background-color", sheetColorList[rowObj.Color]);
            } else { //当行没有颜色时，判断单元格所在列是否有背景颜色
                let col = cellProp[0]; //获取列号
                let cols = reportJson.Pages[0].Columns;
                let colArray = cols.ColumnArray;
                let colObj = colArray[col - 1];

                if (colObj != undefined && colObj.Color != undefined) {
                    td.css("background-color", sheetColorList[colObj.Color]);
                    td.css("background-color", sheetColorList[colObj.Color]);
                }
            }
        }

    }

    //渲染单元格文本属性
    if (cell.hasOwnProperty("T")) { //渲染文本属性
        let colorIndex = cellProp[19]; //文本颜色索引
        let color = sheetColorList[colorIndex];
        let fontIndex = cellProp[14]; //字体索引
        let font = sheetFontList[fontIndex];
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
            "cursor": "pointer" //鼠标变成手型
        });
    }

    //绘制左边框样式
    if (cellProp[2] != 0) {
        let lStyle = cellProp[2] > 1 ? 'dashed' : 'solid';
        let lColorIndex = cellProp[4],
            lColor = sheetColorList[lColorIndex];
        td.css({
            "border-left-color": lColor,
            "border-left-style": lStyle,
            "border-left-width": (leftBdWidth + "px")
        });
    }
    //绘制上边框样式
    if (cellProp[5] != 0) {
        let tStyle = cellProp[5] > 1 ? 'dashed' : 'solid';
        let tColorIndex = cellProp[7], tColor = sheetColorList[tColorIndex];
        td.css({
            "border-top-color": tColor,
            "border-top-style": tStyle,
            "border-top-width": (topBdWidth + "px")
        });
    }
    //绘制右边框样式
    if (cellProp[8] != 0) {
        let rStyle = cellProp[8] > 1 ? 'dashed' : 'solid';
        let rColorIndex = cellProp[10], rColor = sheetColorList[rColorIndex];
        td.css({
            "border-right-color": rColor,
            "border-right-style": rStyle,
            "border-right-width": (rightBdWidth + "px")
        });
    }
    //绘制下边框样式
    if (cellProp[11] != 0) {
        let bStyle = cellProp[11] > 1 ? 'dashed' : 'solid';
        let bColorIndex = cellProp[13], bColor = sheetColorList[bColorIndex];
        td.css({
            "border-bottom-color": bColor,
            "border-bottom-style": bStyle,
            "border-bottom-width": (bottomBdWidth + "px")
        });
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
        //为单元格生成子表单
        generateSubSheet(td, cell , isForm);
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
        let url = base + '/export' + "/" + block[block.length - 2] + "/" + block[block.length - 1];
        td.css("background-image", "url(" + url + "?token="+ token +")"); //whj
        if (cell.hasOwnProperty("A")) { //图片缩放
            td.css("background-repeat", "no-repeat");
            td.css("background-size", "100% 100%");
        } else {
            td.css("background-repeat", "no-repeat");
        }
    }
}
