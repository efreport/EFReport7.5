/**
 *
 * 普通模式填报
 *
 * **/
let controlNames = new Array(); //控件名数组
let controlNameInfo = {}; //控件名计数信息
let selectIdArray = []; //下拉单选控件ID集合
let selectIdMap = {}; //下拉单选ID和单元格MAP
let dateIdArray = []; //时间控件ID集合
let dateIdMap = {}; //时间控件ID和单元格MAP
let multiSelectIdArray = {}; //下拉多选控件ID和数据MAP
let multiSelectObj = {};
let uploadIdArray = []; //上传文件按钮ID集合
let uploadImageIds = [];
function initSubmitReport(tableId, sheetInfo) {

    curSheet = sheetInfo.SheetName; //当前选择的sheet页
    // 生成table的HTML
    let tableHtml =
        "<div class='x-data-bg_block show'>" +
        "<table id='" + tableId + "' stable='1' class='x-table' sheetname='" + sheetInfo.SheetName + "'" + "cellspacing='0'  cellpadding='0'>"
        + "</table>"
        + "</div>";
    $('#content').append(tableHtml);

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
        initSubmitCell(td, cell, tableId);//根据单元格内容来渲染单元格
    });

    $('#' + tableId).show(); //显示DOM元素
    //动态渲染下拉单选控件
    $.each(selectIdArray, function (i, e) {
        form.render($('#' + e));
    });
    $.each(dateIdArray, function (i, e) {
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
    //渲染上传文件按钮
    $.each(uploadIdArray , function(i,e){
        renderUpload(e);
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
    resetStyle();

}

//初始化单元格
function initSubmitCell(td, cell, tableId) {
    let cellProp = cell.N; //单元格属性
    //单元格不产生滚动条
    td.css("overflow-x", "hidden");
    td.css("overflow-y", "hidden");
    //修改span的高度和宽度
    let tdWidth = td.attr('ow');  //单元格原始高度
    let tdHeight = td.attr('oh'); //单元格原始宽度
    let topBdWidth = cellProp[6];//上边框宽度
    let bottomBdWidth = cellProp[12]; //下边框宽度
    let leftBdWidth = cellProp[3]; //左边框宽度
    let rightBdWidth = cellProp[9]; //右边框宽度
    let fontSize = cellProp[15] + 3; //字体大小与设计器大小有出入


    //填充单元格内容
    if (cell.hasOwnProperty("HtmlFile")) { //子表单是否嵌套HTML文件
        td.html('<div style="width:' + tdWidth + 'px;height:' + tdHeight + 'px;box-sizing:border-box;"><span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;">' + '<iframe id="fra" oh="' + tdHeight + '" ow="' + tdWidth + '" src="' + _home + exportpathApp + '/' + cell.HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe>' + '</span></div>');
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
    } else { //当单元格没有背景颜色时，判断单元格所在行是否有背景颜色
        let row = cellProp[1]; //获取行号
        let rows = reportJson.Pages[0].Rows;
        let rowArray = rows.RowArray;
        let rowObj = rowArray[row - 1];
        //行有颜色时
        if (rowObj != undefined && rowObj.Color != undefined) {
            td.css("background-color", colorList[rowObj.Color]);
        } else { //当行没有颜色时，判断单元格所在列是否有背景颜色
            let col = cellProp[0]; //获取列号
            let cols = reportJson.Pages[0].Columns;
            let colArray = cols.ColumnArray;
            let colObj = colArray[col - 1];

            if (colObj != undefined && colObj.Color != undefined) {
                td.css("background-color", colorList[colObj.Color]);
                td.css("background-color", colorList[colObj.Color]);
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
            "cursor": "pointer" //鼠标变成手型
        });
    }

    // 数据链单元格关联属性
    if (cell.hasOwnProperty("CellRelation")) {
        td.attr("CellRelation", cell.CellRelation);
    }

    // 非数据链上单元格填报属性
    if (cell.hasOwnProperty("NoFieldUploadCellRelation")) {
        td.attr("NoFieldUploadCellRelation", cell.NoFieldUploadCellRelation.Relation);
        td.attr("firstcelluploadname", cell.NoFieldUploadCellRelation.UploadName);
        td.addClass('noChain');
    }


    //合并单元格
    if (cell.hasOwnProperty("G")) { //有合并单元格属性
        mergeCell(cell, td, tableId, cellProp[0], cellProp[1]); //合并单元格
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
            let height = td.parent().height(); //获取tr的高度
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + tableId + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='N'>+</a>");
            for (let m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
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

            td.find('span').append("<div></div>");
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doRowSwitch(this , \"" + tableId + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='Y'>-</a>");
            for (let m = cell.RetractBeginRow; m <= cell.RetractEndRow; m++) {
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
            let width = td.width(); //获取td的宽度,此时宽度是总宽度
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:5px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \'" + tableId + "\');' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>+</a>");
            for (let m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + tableId + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
            td.attr("colspan", (parseInt(td.attr("colspan")) - (m - cell.RetractBeginCol)));
            td.css("width", Math.ceil(width / cell.G.C)); //获取合并的列数并且手动修改td的高度
            td.find("div").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
            td.find("span").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='doColumnSwitch(this , \"" + tableId + "\");' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>-</a>");
            for (let m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
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
        let url = base + "/export" + "/" + block[block.length - 2] + "/" + block[block.length - 1];
        td.css("background-image", "url(" + url + ")"); //whj
        if (cell.hasOwnProperty("A")) { //图片缩放
            td.css("background-repeat", "no-repeat");
            td.css("background-size", "100% 100%");
        } else {
            td.css("background-repeat", "no-repeat");
        }
    }
    initControllTd(tableId, td, cell);
}

//为单元格加载控件
function initControllTd(tableId, td, cell) {
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

            // widgetHtml = '<div class="layui-form"><select lay-search="" id="' + tdId + '_sel"  title="' + hint + '" sel="2" vs="' + actualValue + '" reg="' + regions + '" name="' + showName + '">';
            // //为单选下拉框添加option选项
            // $.each(props.DataDict, function (_i, _n) {
            //     if (actualValue == _n.Key) { //设置默认值
            //         widgetHtml += '<option selected value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + _n.Value + '(A)' + '</option>';
            //     } else {
            //         widgetHtml += '<option value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + _n.Value +'(A)'+ '</option>';
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
            let selectId = td.attr("id") + '_multi';
            let dataArray = [];
            let selectValue = []; //选中的值
            if (cell.hasOwnProperty("V")) { //V代表实际值
                let v = cell.V;
                if(v != ''){ //有值
                    selectValue = v.split(',');
                }
            }


            // --------------------old--------start
            // widgetHtml = '<div>'; //ActualValue->V
            // widgetHtml += '<div id="'+ selectId +'" style="background-color: transparent;"  title="' + hint + '"  reg="' + regions + '" name="' + showName + '" style = "width:100%"></div>';
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

            // --------------------old----------end

            //---------------------------------start-------------

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
                    if (item.checked === true) {
                        strval += $(this).val()+",";
                        strnames+=item.name+",";
                    }
                });
                $("#"+selectId).val(strnames.length>0 ? strnames.substring(0, strnames.length-1): "");
                $("input[name='"+selectId+"']").val(strval.length>0 ? strval.substring(0, strval.length-1): "");
                $("#div_"+selectId+"").hide();
                $("#bgDiv").hide();
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
            dateIdArray.push(propMap);
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
                widgetHtml += '<input reg="' + regions + '" type="checkbox"  title="' + _n.Value + '" value="' + _n.Key + '"  name="' + name + '" ' + ($.inArray(_n.Key, cell.V) != -1 ? 'checked="checked"' : '') + ' />';
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
                widgetHtml = '<div><button class="layui-btn" name="' + showName + '" rawname="' + controlName + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + props.ButtonText + '</button></div>';
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
            uploadIdArray.push(uploadId);
            if (cell.hasOwnProperty("V") && cell.V != "") {
                td.css("background", "none"); //PIC为背景图片时，移除该属性
                //let _img = cell.Pic.substring(cell.Pic.indexOf("export"));
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
        /**
         * 给控件绑定事件
         * */


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

    }
}

/***
 * 根据单元格的原始位置从JSON数据中的SheetUploadInfos中找到对应的填报元信息
 * position 单元格的位置
 * json 报表生成的JSON数据
 */
function tdMetaInfo(position, json) { //获取td的元信息
    let uis = null;
    //遍历报表填报信息
    $.each(json.SheetUploadInfos, function (_i, _in) {
        //如果是当前报表的填报信息
        if (_in.SheetName == json.Pages[0].SheetName) {
            //遍历当前报表的填报信息
            $.each(_in.UploadInfos, function (_j, _jn) {
                //遍历每个单元格的填报信息
                $.each(_jn.UploadItems, function (_x, _xn) {
                    //找到对应位置的填报信息
                    if (_xn.FieldCellX == position[0] && _xn.FieldCellY == position[1]) {
                        uis = {};
                        uis["UploadInfoName"] = _jn.UploadInfoName; //填报名
                        uis["SheetName"] = _in.SheetName; //sheet名
                        uis["ConnName"] = _jn.ConnName; //填报关联的数据连接名
                        uis["DatabaseType"] = _jn.DatabaseType; //数据库类型
                        uis["TableName"] = _jn.TableName;//填报对应的表名
                        uis["FieldName"] = _xn.FieldName;//单元格对应的字段名
                        uis["FieldType"] = _xn.FieldType;//单元格对应的字段类型
                        uis["rawLocation"] = position[0] + "," + position[1];//设置当前行的xy，用于新增行参数rawLocation使用，重要！！
                        uis["MainKey"] = _xn.MainKey;//是否是主键 false or true
                        return false;
                    }
                });
            });
        }
    });
    return uis;
}

/**
 * 根据单元格的原始位置从JSON数据中获取单元格对应的控件信息
 * x x轴坐标
 * y y轴坐标
 * json 报表对应的JSON数据
 * sheetName 控件所在的sheet
 * json里面保存着多个sheet的控件信息，需要加上sheetName来获取准确的控件信息
 *
 *
 * */
function tdControllInfo(x, y, json, sheetName) {
    let cis = json.ControlInfos, //报表中的控件信息
        ci = null;
    for (let i = 0; i < cis.length; i++) {
        ci = cis[i];
        if (ci.RawX === x && ci.RawY === y && ci.SheetName === sheetName) {
            return ci;
        }
    }
}

/**
 * 添加行按钮
 * **/
function triggerAdd(ele) {
    let td = $(ele).parent(); //button所在的td
    let tr = td.parent(); //td所在的tr
    let table = tr.parent(); //tr所在的table
    let name = $(ele).attr('name');
    let buttons = table.find('button[name="' + name + '"]');
    //遍历找到最后一个添加行按钮并触发
    $.each(buttons, function (index, ele) {
        if (index == buttons.length - 1) { //触发最后一个按钮
            addRow(ele);
        }
    })
}

/**
 * 增加行
 * **/
function addRow(ele) { //增加行
    let but = $(ele); //当前按钮
    let td = but.parent(); //当前按钮所在的TD
    let tr = td.parent(); //当前按钮所在的TR
    let trId = tr.attr('id'); //当前行的ID
    let trIds = trId.split('_');
    let rowNum = trIds[trIds.length - 1]; //获得当前行的行号
   /* let tbody = tr.parent();
    let table = tbody.parent();//当前TR所在的TABLE*/
    let table = tr.parent();
    let totalRow = table.attr('rows'); //TABLE总行数
    let curRow = parseInt(totalRow) + 1; //当前行数=总行数+1
    table.attr('rows', curRow); //更新Table总行数信息
    //将TD所在的TR里面的所有TD的错误信息删除掉
    tr.children().each(function () {
        $(this).find("span[name='errorSpan']").remove();
    });
    //判断被克隆行是否是更新状态标志
    let length = tr.children(".cell-update").length;
    let clone = tr.clone(true); //复制元素及其事件
    //将下拉框的默认值设为空
    clone.attr('clone', 'true');// 标记为新纪录
    let tbId = table.attr("id"); //TABLE ID
    //给克隆行添加唯一的ID
    let cloneTrId = tbId + '_r_' + curRow;
    clone.attr("id", cloneTrId);
    //显示克隆行
    clone.show();
    //给新增行添加cell-add标识
    clone.children("td[firstcellrelation]").attr("class", "cell-add");

    let relationTd = clone.children("td[firstcellrelation]"); //保存着当前行数据链信息的TD
    let relationChain; //数据关系链

    //如果被复制的行是新增的行(新增行会打上addcellrelation属性)
    if (relationTd.attr("addcellrelation") != null) {
        relationChain = relationTd.attr("addcellrelation");
    } else { //如果被复制的行是原始行(非新增按钮添加的行)
        relationChain = relationTd.attr("firstcellrelation");
    }
    let newRelationChain = '';
    //拆分数据链信息
    let ids = relationChain.split(";");
    //根据当前行号创建一个新的数据链信息
    for (let i = 0; i < (ids.length - 1); i++) {
        let x = ids[i].split(",")[0];
        let y = ids[i].split(",")[1];
        //判断数据链上的结点是否在同一行，如果在同一行，产生新的结点
        if (y == rowNum) { //填报结点在同一行
            newRelationChain += x + "," + curRow + ";";
        } else { //不在同一行，说明当前结点指向一个固定的结点，结点不变
            newRelationChain += x + "," + y + ";";
        }
    }
    clone.children("td[firstcellrelation]").attr("addcellrelation", newRelationChain);
    //添加克隆dom
    tr.after(clone);
    //遍历每个TD
    clone.children().each(function () {
        let td = $(this); //当前单元格
        let oldId = td.attr("id");
        let oldIdArr = oldId.split("_");
        /**
         * 根据当前table ID , 当前行数 , 以及X轴坐标生成新的TD ID
         * */
        let newId = tbId + '_' + curRow + '_' + oldIdArr[oldIdArr.length - 1];
        td.attr("id", newId); //新ID
        let cellRelation = td.attr("cellRelation"); //关联的单元格属性
        //复制行时需要修改td关联的单元格
        if (cellRelation != undefined) {  //修改关联的单元格
            let cellRelations = cellRelation.split(",");
            let cols = cellRelations[0];
            let rows = cellRelations[1];
            let newCellRelation = cols + ',' + curRow;
            td.attr("cellRelation", newCellRelation);
        }
        let controlType = td.attr('controlType');
        if (0 === $(this).children().length) {//过滤掉了主键ID
            $(this).html('');
        } else {
            if (controlType == 1) { //文本编辑框
                let controlId = newId + '_input';
                let input = td.find('input'); //找到文本编辑框控件
                input.attr("id" , controlId);
                input.removeAttr("onchange"); //删除原先绑定的onchange事件
                input.unbind().bind('change', changeRowStatus(newId)); //绑定新的事件
                input.val(''); //清空文本编辑框的值
            } else if (controlType == 2) { //单选下拉框
                cloneType2(td, oldId, newId);
            } else if(controlType == 3){//多选下拉
                cloneType3(td, oldId, newId);
            } else if (controlType == 6) { //时间
                cloneType6(td, oldId, newId);
            } else if(controlType == 7){ //checkbox
                let controlId = newId + '_checkbox';
                td.find('input').attr('name' , controlId); //修改控件name
                form.render();//重新渲染
                resetStyle(); //重新设置所有控件的样式
            } else if(controlType == 8){ //数字输入框
                let controlId = newId + '_input';
                let input = td.find('input'); //找到文本编辑框控件
                input.attr("id" , controlId);
                input.removeAttr("onchange"); //删除原先绑定的onchange事件
                input.unbind().bind('change', changeRowStatus(newId)); //绑定新的事件
                input.val(''); //清空文本编辑框的值
            } else if(controlType == 10){//单选框
                let controlId = newId + '_radio';
                td.find('input').attr('name' , controlId); //修改控件name
                td.find('input').attr('id' , controlId); //修改控件name

                let dataval = td.find('input').attr('data-val');

                let tAry = dataval.split(";");
                let valsAry = tAry[0].split(",");
                let keysAry = tAry[1].split(",");

                let cur_data = [];

                for (let i=0; i< valsAry.length; i++) {
                    let obj =  { name: valsAry[i], val: keysAry[i], type: 0 };
                    cur_data.push(obj);
                }


                let nameEl_onepicker = document.getElementById(controlId);

                let title_onepicker = "请选择";
                let array_onepicker = [
                    { name: "AAA", val: "", type: 0 }
                ];

                array_onepicker = [];
                array_onepicker = cur_data;

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

                    $("input[name='"+controlId+"']").val(text1);


                    let id = controlId; //获取当前控件的ID
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
                form.render();//重新渲染
                resetStyle(); //重新设置所有控件的样式
            } else if(controlType == 11){//上传文件
                td.empty();
                let controlId = newId + '_upload';
                let html = '';
                html += '<button type="button" class="layui-btn" style="background-color:#0094FF;padding:0px;" id="'+ controlId +'">';
                html += '   <i class="layui-icon">&#xe67c;</i>上传图片';
                html += '</button>';
                td.append(html);
                renderUpload(controlId); //重新绑定上传文件按钮
                form.render();
            }
        }
    });

    //触发文本编辑框的初始化事件
    clone.children().children().each(function () {
        let input = $(this).find('input[type="text"]'); //文本编辑框
        if (input != undefined) {
            input.trigger('init');
        }
    });
    /* Submit.Fn.bindSelect(tr);
     Submit.Fn.bindSelect(clone);*/

    if (length == 0) {
        let td = tr.children();
        $.each(td, function (index, ele) {
            if ($(ele).hasClass('cell-update')) {
                $(ele).removeClass('cell-update');
            }
        })
    }
}
/**
 * 删除行
 * **/
function deleteRow (ele) {
    var but = $(ele); //删除按钮
    var td = but.parent(); //删除按钮所在TD
    var tr = td.parent(); //删除按钮所在行
    //如果该行是被克隆出来的行，直接删除
    if (tr.attr("clone")) {
        tr.remove();
    }//如果是原有行，添加删除标识，将数据传到后台去删除
    else {
        //如果不是克隆行，而是空白行，当修改时，class会变成cell-add，此时删除的话，应该直接删除行
        if (tr.children("td[firstcellrelation]").attr("class") == 'cell-add') {
            tr.remove();
        } else {
            tr.children("td[firstcellrelation]").attr("class", "cell-delete");
            tr.hide();
        }

    }
}

//克隆单选下拉框
function cloneType2(td, oldId, newId) {
    td.empty(); //清空单元格内容，重新渲染单选下拉框
    let cellObj = selectIdMap[oldId]; //获取原始TD对应的单元格数据
    selectIdMap[newId] = cellObj; //向对象里面添加新的控件信息
    let cell = cellObj['cell'];
    let props = cellObj['props'];
    let cellProps = cell.N;
    let hint = props.Hint; //控件提示
    let regions = '';//控件联动专用
    let weight = (cellProps[16] == 1 ? "bold" : "normal");
    let colorIndex = cellProps[19];
    let color = colorList[colorIndex];
    let style = (cellProps[17] == 1 ? "italic" : "normal");
    let decoration = (cellProps[18] == 1 ? "underline" : "none");
    let fontSize = cellProps[15];
    let fontFamily = fontList[cellProps[14]];
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
    if (cell.hasOwnProperty("RepaintRegions")) {
        regions = encodeURI(cell.RepaintRegions);
    }
    let actualValue = '';
    let widgetHtml = '';
    if (cell['V'] != undefined) {  //ActualValue->V
        actualValue = cell.V; //ActualValue->V
    } else {
        actualValue = cell.T;
    }
    td.data("V", actualValue);
    let selectId = newId + '_sel';


    //重新渲染单元格的select内容
    // widgetHtml = '<div class="layui-form"><select lay-search="" id="' + selectId + '"  title="' + hint + '" sel="2" vs="' + actualValue + '" reg="' + regions + '" name="">';
    // //为单选下拉框添加option选项
    // $.each(props.DataDict, function (_i, _n) {
    //     if (actualValue == _n.Key) { //设置默认值
    //         widgetHtml += '<option selected value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + _n.Value + '</option>';
    //     } else {
    //         widgetHtml += '<option value="' + _n.Key + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';">' + _n.Value + '</option>';
    //     }
    // });
    // widgetHtml += '</select></div>';



    let cur_data = [];
    let valuesAry = [];
    let keysAry = [];

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

   

    htmlStr = valuesAry.join(",") + ";" + keysAry.join(",");


    widgetHtml = '<div class="layui-form">';
    widgetHtml += '<input data-val="' + htmlStr + '" placeholder="请选择" style="text-align: center;" class="ef-tb-textfield layui-input" readonly="true" id="'+selectId+'" name="' + selectId + '" reg="' + regions + '" type="text" hint="' + hint + '" value="' + showValue + '" ' + '/>'; //ActualValue->V
    widgetHtml+='</div>';

    td.append(widgetHtml);
    form.render($('#' + selectId)); //重新绑定下拉框

    let nameEl_onepicker = document.getElementById(selectId);

    let title_onepicker = "请选择";
    let array_onepicker = [
        { name: "AAA", val: "", type: 0 }
    ];

    array_onepicker = [];
    array_onepicker = cur_data;

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

        $("input[name='"+selectId+"']").val(text1);


        let id = selectId; //获取当前控件的ID
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

//克隆时间控件
function cloneType6(td, oldId, newId) {
    let widgetHtml = '';
    let orgVal = td.find('input').val(); //被复制控件的值
    td.empty(); //清空单元格

    let dateId = newId + "_date";
    let propMap = dateIdMap[oldId + "_date"]; //获取原始时间控件的属性
    dateIdMap[dateId] = propMap;
    let hint = propMap['hint'];
    let regions = propMap['regions'];
    let dateType = propMap['dateType']; //日期类型
    let hasTime = propMap['hasTime']; //是否有时间
    let fontSize = propMap['fontSize'];
    let fontFamily = propMap['fontFamily'];
    let align = propMap['align'];
    let weight = propMap['weight'];
    let color = propMap['color'];
    let style = propMap['style'];
    let decoration = propMap['decoration'];
    widgetHtml = '<div><input id="' + dateId + '" name="" class="ef-tb-textfield layui-input" type="text" title="' + hint + '"'
        + ' value="' + orgVal + '" reg="' + regions + '" dateType="' + dateType + '" hasTime="' + hasTime + '" style="font-size:' + fontSize + 'px;font-family:' + fontFamily + ';text-align:' + align + ';font-weight:' + weight + ';color:' + color + ';fontStyle:' + style + ';text-decoration:' + decoration + ';background-color:transparent;"/></div>'; //ActualValue->V
    td.append(widgetHtml);

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
    if(hasTime){ //日期时间
        new Jdate({
            el:'#'+dateId,
            format: format.toUpperCase(),
            beginYear: 1980,
            endYear: 2050,
            confirm: function(date) {
                let tdId = dateId.substr(0 , dateId.length - 5);//获取单元格ID
                changeRowStatus(tdId);
            }
        });

    }else{
        new Jdate({
            el:'#'+dateId,
            format: format.toUpperCase(),
            beginYear: 1980,
            endYear: 2050,
            confirm: function(date) {
                let tdId = dateId.substr(0 , dateId.length - 5);//获取单元格ID
                changeRowStatus(tdId);
            }
        });

    }
}
//克隆多选下拉
function cloneType3(td, oldId, newId){
    td.empty(); //清空单元格内容，重新渲染单选下拉框
    let oldSelectId = oldId + '_multi';
    let cellObj = multiSelectIdArray[oldSelectId]; //获取原始TD对应的单元格数据
    let newSelectId = newId + '_multi'; //新的控件ID
    multiSelectIdArray[newSelectId] = cellObj; //向对象里面添加新的控件信息
    let selectId = newId + '_sel';

    let dataArray = cellObj;
    let valsAry = [];
    let showValsAry = [];

    for (let i =0; i < dataArray.length; i++) {
        if (dataArray[i].selected === true) {
            valsAry.push(dataArray[i].value);
            showValsAry.push(dataArray[i].name);
        }
    }
    widgetHtml = '<div>';
    widgetHtml += '<input placeholder="请选择" style="text-align: center;" class="ef-tb-textfield layui-input myRptInput" readonly="true" id="'+newSelectId+'" type="text" value="'+showValsAry.join(",")+'" ' + '/>'; //ActualValue->V
    widgetHtml += "<input type='hidden' name='"+newSelectId+"' value='"+valsAry.join(",")+"' />";
    widgetHtml += '</div>';
    td.html(widgetHtml);

    let clsStr = ""; // paramName
    clsStr += '<div id="div_'+newSelectId+'" class="div_cls">';
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

            $("#"+newSelectId).click(function(){
                $("#div_"+newSelectId+"").show();
                $("#bgDiv").show();
            });

            $("#div_"+newSelectId+" input[name='btn_cancel']").click(function(){
                // 点击了取消
                $("#div_"+newSelectId+"").hide();
                $("#bgDiv").hide();
            });

            $("#div_"+newSelectId+" input[name='btn_search']").click(function(){
                // 点击了 查询（确定按钮）
                let strval = "";
                let strnames = "";
                $("#div_"+newSelectId+" .div_cls_checkbox .div_cls_ele input:checkbox").each(function(idx, item){
                    if (item.checked === true) {
                        strval += $(this).val()+",";
                        strnames+=item.name+",";
                    }

                    $("#div_"+newSelectId+"").hide();
                    $("#bgDiv").hide();
                });
                $("#"+newSelectId).val(strnames.length>0 ? strnames.substring(0, strnames.length-1): "");
                $("input[name='"+newSelectId+"']").val(strval.length>0 ? strval.substring(0, strval.length-1): "");
            });





}

//填报提交
function submit(type) {
    let sheet = [],
        flag = true;//校验不通过跳出多层循环
    $(".x-table").children().each(function () {
        $(this).children().each(function () {
            $(this).find("span[name='errorSpan']").remove();
        });
    });
    $(".i-sheet").children(0).css("background", "");
    $("table[stable]").each(function () {
        let _tb = $(this);
        let name = _tb.attr("sheetname");
        let data = [];
        // 修改报表数据 td.parent().parent().parent().attr("sheetname")
        _tb.find(".noChain").each(function () { //不绑定字段填报
            let cell = $(this);
            let row = null;
            let tableId = "";
            let relations;
            let fcrs = new Array(); //数据结点数组
            let cellRelation = cell.attr('nofielduploadcellrelation'); //获取数据链上数据结点
            let uploadName = cell.attr('firstcelluploadname'); //获取数据填报名
            let tid = cell.parent().parent().parent().attr("id");
            tableId = tid + '_';
            let cellRelations = cellRelation.split(';');
            for (let i = 0; i < cellRelations.length; i++) {
                relations = cellRelations[i];
                fcrs.push(relations);
            }
            fcrs.pop();
            let _id = cell.attr("id");
            let ids = _id.split('_');
            fcrs.push(ids[ids.length - 1] + "," + ids[ids.length - 2]); //将自己加入到数据链中
            $.each(fcrs, function (_j, _jn) { //数据链上的所有节点
                let point = _jn.split(","),
                    x = "#" + tableId + point[1] + "_" + point[0],
                    td = _tb.find(x),
                    tdw = td.children().children(":first"),
                    meta = td.data("meta"),  //填报元信息
                    props = td.data("props"); //控件元信息
                //如果不是填报结点，无需处理
                if (null == meta || undefined == meta) return true;
                //如果不是控件，无需处理
                //if (null == props || undefined == props) return true;
                if (!!props && ("SPAN" != tdw[0].tagName.toUpperCase()) && !validteWidgetValue(props, tdw)) {
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
                let rawLocation = meta.rawLocation;
                let rawLocations = rawLocation.split(',');
                let originVal = td.data("V") == null ? td.data("text") : td.data("V"); //ActualValue->V
                let key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                let value = uploadInfoMap[key];
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
                    row.newVal.push(value.MainKey ? originVal : getWidgetValue(tdw , td));
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
        //处理更新的数据
        _tb.find(".cell-update").each(function () {
            let cell = $(this);
            let fcrs = cell.attr("firstcellrelationrawloc").split(";");//数据链上节点的原始位置
            let cur = cell.attr("firstcellrelation").split(";");//数据链上节点的位置
            let row = null;
            fcrs.pop();
            cur.pop();
            let tbId = _tb.attr("id"); //TABLE ID
            let id = cell.attr("id"); //当前TD ID
            let ids = id.split('_');
            let _rawId = cell.attr("rawLoc");
            let uploadName = cell.attr('firstcelluploadname'); //填报名
            let rawId = _rawId.split(',');
            //因为数据链上的结点不包括当前单元格，将当前单元格的ID添加到数据链上
            cur.push(ids[ids.length - 1] + "," + ids[ids.length - 2]);
            //因为数据链原始结点不包括当前单元格的原始结点，将当前单元格原始结点的ID添加到数据链上
            fcrs.push(rawId[0] + "," + rawId[1]);
            //遍历当前数据链的结点
            $.each(fcrs, function (index, ele) {
                let point1 = cur[index].split(","),
                    tdId = tbId + '_' + point1[1] + '_' + point1[0]; //根据结点信息找到TD的ID
                    td = $('#' + tdId), //找到TD
                    tdWidget = td.children().children(":first"), //TD里面的控件
                    meta = td.data("meta"),
                    props = td.data("props");
                //如果不是填报结点，无需处理
                if (null == meta || undefined == meta) return true;
                if (!!props && ("SPAN" != tdWidget[0].tagName.toUpperCase()) && !validteWidgetValue(props, tdWidget, meta.SheetName)) {
                    flag = false;
                    return false;
                }
                if (null == row) {
                    row = {
                        conn: null,  //连接名
                        table: null, //填报的数据库表名
                        dbType: null, //数据库类型
                        sheetName: null, //sheet名
                        columnName: [], //列名
                        columnType: [], //列类型
                        oldVal: [], //旧值
                        newVal: [], //新值
                        xy: [],  //结点当前位置
                        isPK: [], //是否主键
                        rawLocation: [], //原始位置
                        uploadInfoName: meta.UploadInfoName //填报名
                    };
                }
                let rawLocation = meta.rawLocation;
                let rawLocations = rawLocation.split(',');
                let originVal = td.data("V") == null ? td.data("text") : td.data("V"); //ActualValue->V
                let key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                let value = uploadInfoMap[key];

                row.conn = value.ConnName;
                row.table = value.TableName;
                row.dbType = value.DatabaseType;
                row.columnName.push(value.FieldName);
                row.columnType.push(value.FieldType);
                //如果单元格内没有控件
                if ("SPAN" === tdWidget[0].tagName.toUpperCase()) {
                    if (value.MainKey) {
                        // 若为主键,加在过滤条件中
                        row.oldVal.push(originVal);
                        row.newVal.push("");
                    } else {
                        // 若为普通字段,不加入到where条件中
                        row.oldVal.push("");
                        row.newVal.push(originVal);
                    }

                }
                //如果单元格内有控件
                else {
                    row.oldVal.push(originVal);
                    row.newVal.push(value.MainKey ? originVal : getWidgetValue(tdWidget , td));
                }
                row.xy.push(point1[0] + "," + point1[1]); //当前位置
                row.isPK.push(value.MainKey);
                row.rawLocation.push(rawLocation);
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
            let row = null;
            let cell = $(this); //当前TD
            let cur = cell.attr("firstcellrelationRawLoc").split(";");//数据链上数据的原始位置
            let fcrs;
            //通过添加按钮生成的新增行有addcellrelation属性
            if (cell.attr("addcellrelation") != undefined) {
                fcrs = cell.attr("addcellrelation").split(";"); //数据链当前结点的位置
            }
            //如果不是新增行按钮产生的数据，说明是空白记录填报产生的数据
            else {
                fcrs = cell.attr("firstcellrelation").split(";"); //数据链当前结点的位置
            }

            let uploadName = cell.attr('firstcelluploadname'); //数据链填报名
            fcrs.pop();
            cur.pop();
            let tbId = _tb.attr("id");
            let _id = cell.attr("id"), //当前单元格的位置
                ids = _id.split("_");
            let _rawId = cell.attr("rawLoc"); //当前单元格原始的位置
            let rawId = _rawId.split(',');
            cur.unshift(rawId[0] + "," + rawId[1]);  //将自己添加到原始数据链中
            fcrs.unshift(ids[ids.length - 1] + "," + ids[ids.length - 2]);//必须把当前单元格放在数组第一位，否则内核无法校验
            //遍历数据链上的所有结点
            $.each(fcrs, function (_j, _jn) {
                let point = _jn.split(","), //当前ID数组
                    point1 = cur[_j].split(","), //原始位置ID
                    //tdId = Rule.Fn.geneTdId(tbId, point[0], point[1]), //根据结点信息找到TD的ID
                    tdId = tbId + '_' + point[1] + '_' + point[0];
                td = $('#' + tdId); //找到TD


                // 新增行, 关联列未复制, 深度查找原始位置
                if (0 === td.length) {
                    let originCR = cell.attr("firstcellrelation").split(";");
                    originCR.pop();
                    originCR.unshift(null);
                    point = originCR[_j].split(",");
                    //tdId = Rule.Fn.geneTdId(tbId, point1[0], point1[1]);
                    tdId = tbId + '_' + point1[1] + '_' + point1[0];

                    td = $('#' + tdId); //找到TD
                }

                let tdw = td.children().children(":first");
                let meta = td.data("meta");
                let props = td.data("props");

                //如果没有元数据，需要判断该单元格是否绑定了固定的单元格,找到原始的单元格
                if (meta == null) {
                    //let curTdId = Rule.Fn.geneTdId(tbId, point1[0], point1[1]);
                    let curTdId = tbId + '_' + point1[1] + '_' + point1[0];
                    td = _tb.find(curTdId);
                    tdw = td.children().children(":first");
                    meta = td.data("meta");
                    props = td.data("props");
                }
                // 若无元数据或者为主键,丢弃
                if (null == meta || undefined == meta || meta.MainKey) return true;
                 if (!!props && !validteWidgetValue(props, tdw)) {
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
                let raw = meta.rawLocation;
                let rawLocations = raw.split(',');
                let key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                let value = uploadInfoMap[key];

                row.conn = value.ConnName;
                row.table = value.TableName;
                row.dbType = value.DatabaseType;
                row.columnName.push(value.FieldName);
                row.columnType.push(value.FieldType);
                // 若单元格内为span标签
                if ("SPAN" === tdw[0].tagName.toUpperCase()) {
                    row.newVal.push(td.data("V") == null ? td.data("text") : td.data("V")); //ActualValue->V
                } else {
                    row.newVal.push(getWidgetValue(tdw , td));
                }
                row.xy.push(point[0] + "," + point[1]);
                row.rawLocation.push(value.rawLocation);
                row.sheetName = value.SheetName;
            });
            if (!flag) return false;
            if (null != row) {
                data.push(row);
            }
        });
        if (!flag) return;
        // 删除报表数据
        _tb.find(".cell-delete").each(function () {
            let row = null;
            let cell = $(this); //当前单元格
            let fcrs = cell.attr("firstcellrelationRawLoc").split(";"); //当前数据链结点的原始位置
            let cur = cell.attr("firstcellrelation").split(";");//当前数据链结点的位置
            fcrs.pop();
            cur.pop();
            let uploadName = cell.attr('firstcelluploadname');//填报名
            let tbId = _tb.attr("id");
            let _id = cell.attr("id"), //当前单元格ID
                ids = _id.split("_");
            let _rawId = cell.attr("rawLoc");
            let rawId = _rawId.split(',');
            cur.push(ids[ids.length - 1] + "," + ids[ids.length - 2]);  //将自己添加到数据链中
            fcrs.push(rawId[1] + "," + rawId[0]);
            let firstCell = [];
            firstCell.push(ids[ids.length - 2]);
            firstCell.push(ids[ids.length - 1]);
            $.each(fcrs, function (_j, _jn) {
                let point1 = cur[_j].split(","),
                    tdId = tbId + '_' + point1[1] + '_' + point1[0], //根据结点信息找到TD的ID
                    td = $('#' + tdId),
                    tdw = td.children().children(":first"),
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
                let originVal = td.data("V") == null ? td.data("text") : td.data("V");
                let raw = meta.rawLocation;
                let rawLocations = raw.split(',');
                let key = uploadName + '_' + rawLocations[0] + '_' + rawLocations[1];
                let value = uploadInfoMap[key];
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
                        /* // 若为普通字段,丢弃*/
                        row.oldVal.push("");
                        //row.oldVal.push(originVal);
                    }
                } else {
                    row.oldVal.push(originVal);
                }
                row.sheetName = value.SheetName;
            });
            if (null != row) {
                row.xy.push(firstCell[1] + "," + firstCell[0]);
                data.push(row);
            }
        });
        if (data.length > 0) {
            let dataSheet = {
                sheetName: name,
                records: data
            };
            sheet.push(dataSheet);
        }
    });
    if (!flag) return;
    if (type == 2 && 0 === sheet.length) {
        layer.msg("请修改数据后再提交！");
        return false;
    }
    let row = {
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
        let b = false;
        let name = $(this).attr("sheetname");
        if (sheet.length > 0) {
            $.each(sheet, function () {
                let sname = this.sheetName;
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
        let dataSheet = {
            sheetName: name,
            records: null
        };
        let data = [];
        $(this).find("td").each(function () {
            let meta = $(this).data("meta");
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

    let uploadIds = "";
    $.each(uploadImageIds , function(i,e){
        if(i != uploadImageIds.length - 1){
            uploadIds += (e + ",");
        }else{
            uploadIds += e;
        }
    });
     $.ajax({
         url: encodeURI(base + "/report/updateData" + "?templateId=" + id + "&sheetName=" + curSheet + "&params=" + '' + "&type=" + type + "&uploadInfo=" + uploadInfos + "&pathId=" + pathId + "&token=" + token + '&templateName=' + templateName + '&uploadImageIds=' + uploadIds),
         type: "POST",
         contentType: "application/json;charset=UTF-8",
         data: JSON.stringify(sheet),
         beforeSend: function () {
             $('.sub-export').parent().parent().css('z-index' , 0);
             $('.print').parent().parent().css('z-index' , 0);
             $("#loadgif").show();
         },
         complete: function () {
             $('.sub-export').parent().parent().css('z-index' , 999);
             $('.print').parent().parent().css('z-index' , 999);
             $("#loadgif").hide();
         },
         success: function (resp) {
             if (resp.code == 1) {//数据校验成功
                 layer.alert(resp.text, function (index) {
                     layer.close(index);
                     if(type == 2){
                         window.location.reload();
                     }
                 });
             } else if (resp.code == 2) {//数据校验失败
                 error(resp);
             } else {
                 if (resp.code == undefined) {//whj 填报信息有误
                     layer.alert("填报信息有误!")
                 } else {
                     layer.alert(resp.text);
                 }

             }
         },
         error: function () {
             layer.alert('填报异常,请检查模板!');
         }
     });
}


function initUploadInfo(json) { //初始化uploadInfo信息
    let isShowValidate;
    //校验信息
    let sheetDataCheckInfos = json.SheetDataCheckInfos;
    //是否显示校验按钮
    if (sheetDataCheckInfos != undefined && sheetDataCheckInfos.length > 0) {
        isShowValidate = true;
    } else {
        isShowValidate = false;
    }
    //是否有校验信息
    if (!isShowValidate) {
        $('.validateP').parent().parent().hide();
        $('.validate-divider').hide();

        $("#div_btn_data_validate").hide();
        $("#div_btn_data_submit").show();
    } else {
        $("#div_btn_data_validate").show();
        $("#div_btn_data_submit").show();
    }
    $.each(json.SheetUploadInfos, function (_i, _in) {
        if (_in.SheetName == json.Pages[0].SheetName) {
            $.each(_in.UploadInfos, function (_j, _jn) {
                let uploadName = _jn.UploadInfoName; //填报名
                if ($.inArray(_jn.UploadInfoName, uploadInfos) == -1) { //不包含该填报名
                    uploadInfos.push(_jn.UploadInfoName);
                }
                $.each(_jn.UploadItems, function (_x, _xn) { //遍历UploadItems
                    let x = _xn.FieldCellX; //x坐标
                    let y = _xn.FieldCellY; //y坐标
                    let key = uploadName + '_' + x + '_' + y; //键
                    let value = {};
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

//获取控件值
function getWidgetValue(elem , td) {
    let controlType = td.attr('controlType');
    //没有控件类型，不是控件
    if(controlType == undefined){
        return "NULL";
    }else if(controlType == 1){ //文本输入框
        return elem.val(); //获取文本输入框的值
    }else if(controlType == 2){ //获取单选下拉框的值
        // return elem.val();

        let strVal = elem.attr("data-val");
        let aryOne = strVal.split(";");
        let strf = aryOne[0];
        let strs = aryOne[1];

        let aryf = strf.split(",");
        let arys = strs.split(",");

        let  eleVal = elem.val();
        let relVal = "";

        let cIdx = -1;
        for (let i=0;i<aryf.length;i++) {
            if (eleVal === aryf[i]) {
                relVal = arys[i]
            }
        }

        return relVal;

    }else if(controlType == 3){ //多选下拉
        let selectId = td.attr("id") + '_multi'; //获取当前下拉多选控件ID

        let downInputObjVal = $("input[name='"+selectId+"']").val();
        return downInputObjVal;
        // let selectObj = multiSelectObj[selectId]; //获取下拉控件对象
        // let vals=[];
        // //获取所有选中值
        // let valueArr = selectObj.getValue();
        // let valStr = '';
        // $.each(valueArr,function(index,ele){
        //     let val = ele.value;
        //     vals.push(val);
        // })
        // return vals.join();
    }else if(controlType == 6){ //时间输入框
        return elem.val();
    }else if(controlType == 7){//checkbox
        let vals = [];
        let tdId = td.attr('id'); //获取单元格ID
        let checkboxName = tdId + '_checkbox'; //获取radioName
        let boxs = td.find("input[type='checkbox'][name='" + checkboxName + "']");
        $.each(boxs, function (index, elem) {
            if (elem.checked == true) {
                vals.push(elem.value);
            }
        })
        return vals.join();
    }else if(controlType == 8){ //数字输入框
        return elem.val(); //获取文本输入框的值
    }else if(controlType == 10){ //radio
        let tdId = td.attr('id'); //获取单元格ID
        let radioName = tdId + '_radio'; //获取radioName


        // return $("input[type='radio'][name='" + radioName + "']:checked").val();

        let strVal = elem.attr("data-val");
        let aryOne = strVal.split(";");
        let strf = aryOne[0];
        let strs = aryOne[1];

        let aryf = strf.split(",");
        let arys = strs.split(",");

        let  eleVal = elem.val();
        let relVal = "";

        let cIdx = -1;
        for (let i=0;i<aryf.length;i++) {
            if (eleVal === aryf[i]) {
                relVal = arys[i]
            }
        }

        return relVal;


        // return $("#"+radioName).val();

    }else if(controlType == 11){ //上传按钮
        return td.find('div').find('input').val();
    }

}
//初始化上传文件按钮
function renderUpload(uploadId){
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
                let fileNameHtml = '<div><input type="text" value="'+ fileName +'" style="display: none;"><img onclick="uploadImg(this)" style="width:'+ width +'px;height:'+ height +'px;" src="'+ base +'/uploadimages/'+ id + '/temp/'  + fileName +'?id='+ randomId +'"></img></div>'
                td.append(fileNameHtml);//添加上传文件名
                let tr = td.parent();
              /*  let tbody = tr.parent();
                let table = tbody.parent();*/
                let table = tr.parent();
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

//统一所有控件的样式，form重新渲染时，需要重新调用
function resetStyle(){
//调整下拉框图标颜色
    $('.layui-form-select').find('.layui-edge').css('border-top-color', submitColor);
    //调整radio的宽度
    $('.layui-form-radio').css('margin','0px');
    $('.layui-form-radio').css('padding','0px');
    $('.layui-form-radio').find('i').css('margin','0px');
    $('.layui-form-radio').find('i').css('color',submitColor);

    //调整checkbox样式
    $('.layui-form-checkbox').find('i').css('display','none'); //不显示对号
    //$('.layui-form-checked').find('span').css('background-color',submitColor);
    $('.layui-form-checkbox').css({
        'padding':'2px',
        'margin':'0px',
        'height':'30px',
        'line-height':'30px'
    });

    //调整xm-select样式
    $('.xm-icon').css('border-top-color',submitColor);
    $('.xm-label-block ').css('background-color' , submitColor);
}

//上传文件
function uploadFile(){

        let path = ele.value,
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
        let fd = new FormData();
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
                let imageHtml = '<img src="' + basePath + '/uploadimages/' + resp.filename + '" onclick="this.previousElementSibling.click();" style="width:100px;height:100px;"/>';//上传后的图片
                let image = $(ele).parent().find('img'); //找到图片
                image.remove();
                if(showPic){
                    $(ele).parent().append(imageHtml)
                }else{
                    $(ele).show();
                }
                layer.msg(resp.text, {icon: 1, time: 1000});

                let div = $(ele).parent(); //上传控件的父div
                let td = div.parent(); //td
                let tr = td.parent();
                /*let tbody = tr.parent();
                let table = tbody.parent();*/
                let table = tr.parent();
                let tbId = table.attr('id');
                //上传控件上帮有填报信息
                if(td.attr('cellrelation') != undefined){
                    let point = td.attr("cellrelation").split(",");
                    //找到记载着填报信息的TD
                    let tdId = Rule.Fn.geneTdId(tbId, point[0], point[1]);
                    let cellRelationTd = $('#' + tdId);
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
        });
}

//验证控件的值
function validteWidgetValue(props, tdw) {
    //当控件不允许为空值时，需要判断值是否为空
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
                // if ($('input[type="radio"][name="' + name + '"]:checked').length == 0) {
                //     alert("该控件值不可为空");
                //     tdw.get(0).focus();
                //     return false;
                // }

                if ($("input[name='"+name+"']").val() === "") {
                    alert("该控件值不可为空");
                    tdw.get(0).focus();
                    return false;
                }

            }

        } else if(props.ControlType == 11){ //上传文件按钮
            let button = tdw.parent(); //上传文件按钮
            let td = button.parent(); //单元格
            if(td.find('div').find('img').length == 0){
                layer.msg('该控件值不可为空');
                td.focus();
                return false;
            }
        } else {
            if ("" == tdw.val() || null == tdw.val()) {
                alert("该控件值不可为空");
                tdw.get(0).focus();
                return false;
            }
        }

    }
    //文本输入框
    if (1 == props.ControlType) {
        //判断文本输入框的最大长度
        if (-1 !== props.MaxLength && 0 !== props.MaxLength && props.MaxLength < tdw.val().length) {
            alert("该控件最多允许输入" + props.MaxLength + "个字符");
            tdw.get(0).focus();
            return false;
        }
        //判断文本输入框的最小长度
        if (-1 !== props.MinLength && 0 !== props.MinLength && props.MinLength > tdw.val().length) {
            alert("该控件至少须输入" + props.MinLength + "个字符");
            tdw.get(0).focus();
            return false;
        }
    }//数字输入框
    else if (8 == props.ControlType) {
        var val = tdw.val();
        if (isNaN(val)) {
            alert("该控件只允许输入数字");
            tdw.get(0).focus();
            return false;
        }
        //不允许小数
        if (!props.AllowDecimal) {
            if(val.indexOf(".") > -1){
                alert("该控件值不允许小数");
                tdw.get(0).focus();
                return false;
            }
        }else{
            if(val.indexOf(".") != -1){//小数
                //判断允许多少位小数
                if (0 < props.decimalPlace && val.substring(val.indexOf(".") + 1).length > props.decimalPlace) {
                    alert("该控件值最多允许" + props.decimalPlace + "位小数");
                    tdw.get(0).focus();
                    return false;
                }
            }
        }
        //判断是否能为负数
        if (!props.AllowNegative && val.indexOf("-") > -1) {
            alert("该控件值不允许负数");
            tdw.get(0).focus();
            return false;
        }
        if(-1 == props.MaxValue && -1 == props.MinValue){

        }else{
            //判断最大值
            if (0 !== props.MaxValue && Number(val) > props.MaxValue) {
                alert("该控件值允许的最大值为" + props.MaxValue);
                tdw.get(0).focus();
                return false;
            }
            //判断最小值
            if (Number(val) < props.MinValue) {
                alert("该控件值允许的最小值为" + props.MinValue);
                tdw.get(0).focus();
                return false;
            }
        }

    }
    return true;
}

function getAlignStyleValue(flag){
    var value;

    switch (flag) {
        case 1:
            value = "left";
            break;
        case 2:
            value = "right";
            break;
        case 4:
            value = "center";
            break;
        case 16:
            value = "top";
            break;
        case 32:
            value = "bottom";
            break;
        case 64:
            value = "middle";
            break;
        default:
            value = "";
            break;
    }

    return value;
}

function uploadImg(obj){
    let image = $(obj);
    let div = image.parent();
    let input = div.prev();
    let button = input.prev();
    let td = div.parent();
    let tdId = td.attr("id");
    changeRowStatus(tdId);
    button.trigger('click');
}
//改变关联行状态
function changeRowStatus(tdId){
    let td = $('#' + tdId);
    let tr = td.parent();
    /*let tbody = tr.parent();
    let table = tbody.parent();*/
    let table = tr.parent();
    let tbId = table.attr('id');
    //上传控件上帮有填报信息
    if(td.attr('cellrelation') != undefined){ //原始行逻辑
        let point = td.attr("cellrelation").split(","); //获取当前单元格上的关联信息
        let idArray = tdId.split('_'); //拆分当前单元格的ID
        let relateTdId;
        if(idArray[3] != point[1]){ //cellrelation的行数和当前单元格行数不同，说明是新增行
            //relateTdId = tbId + '_' + idArray[3] + '_' + point[0];
            relateTdId = tbId + '_' + point[1] + '_' + point[0];
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

function error(resp) {  //添加错误信息 whj
    var res = resp.text;
    res = eval('{' + res + '}');
    var info = "";
    for (var x = 0; x < res.length; x++) {
        var incell = res[x];
        var sheetName = incell.sheetName;
        var cells = incell.invaildCells;
        $(".i-sheet[st='" + sheetName + "']").children(0).css("background", "#fdd899");
        for (var i = 0; i < cells.length; i++) {
            var tbId = $('table[sheetname="' + sheetName + '"]').attr("id");
            var tdId = tbId + '_' + cells[i].y + '_' + cells[i].x;
            var td = $('#' + tdId);
            td.children().children().eq(0).css("width", "80%");
            if(cells[i].type == 1){//强制提交为蓝色
                td.children().append("<span name='errorSpan' style='color: blue;margin-right:1px;text-align: right;font-size: 16px;width:20%'>*</span>");
            }else{
                td.children().append("<span name='errorSpan' style='color: red;margin-right:1px;text-align: right;font-size: 16px;width:20%'>*</span>");
            }
            info += "<p class='errortitle'>" + ((cells[i].error == '' || cells[i].error == 'undefined') ? '错误信息' : cells[i].error) + "</p>";
        }
    }
    var offset = 'rt';
    showError(info, offset);
}
//显示报表填报时数据校验的错误信息弹出框
function showError(info, offset) {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.open({
            type: 1,
            area: ['35%', '25%'],
            offset: offset,
            title: false,
            closeBtn: 0,
            shade: [0.1, '#ffffff'],
            shadeClose: true,
            skin: 'error-class',
            moveOut: true,
            move: '.errortitle',
            content: info,
            success: function (layero, index) {
            }
        });
    });
}

