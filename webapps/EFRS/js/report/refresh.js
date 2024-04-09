var interVal;
var refreshRule;
var shapes = []; //区域刷新的悬浮插件
function initRefresh(data) {
    window.clearInterval(interVal);
    if (data.RepaintInterval > 0) {
        interVal = setInterval(function () {
            window.location.reload();
        }, 1000 * data.RepaintInterval); //页面整体定时刷新
    } else {
        let modelRepaintRegions = data.ModelRepaintRegions; //区域刷新
        refreshRule = modelRepaintRegions;
        if (modelRepaintRegions != undefined) {
            let info = JSON.parse(modelRepaintRegions);
            try{ //解决某些模板含有空区域刷新信息的问题
                if (info.length > 0) {
                    $.each(info, function (index, elem) {
                        if (elem.regions != undefined && elem.Interval != undefined) {
                            interVal = setInterval(function () {
                                areaRefresh(index, elem.regions, elem.shapeRegions, elem.refreshParam);
                            }, 1000 * elem.Interval); //区域刷新
                        }
                    })
                }
            }catch{

            }
        }
    }
}

function areaRefresh(index, regions, shapeRegions , refreshParam) {
    let refreshRuleJson = JSON.parse(refreshRule);
    let curRefreshParam = refreshRuleJson[index].refreshParam; //获取当前刷新规则索引下的刷新参数
    refreshParams = curRefreshParam;
    let sheetName = $('.sheet').find('sheet_ck') == undefined ? '' : $('.sheet').find('sheet_ck').text(); //获取当前选中的sheet
    let params = getParams(refreshParams); //获取模板的所有参数
    let page = $('#curr').val() == '' ? 1 : $('#curr').val();//当前页
    $.ajax({
        url: base + "/report/refresh?token=" + token,
        type: "get",
        async: true,
        contentType: "application/json;charset=UTF-8",
        data: {templateId: id, sheetName: sheetName, params: encodeURIComponent(params), page: page, shapes: JSON.stringify(refreshRuleJson) , templateName: templateName},
        beforeSend: function () {

        },
        success: function (res) {
            let data = res.message;
            data = JSON.parse(data);
            refreshRule = data.ModelRepaintRegions; //更新当前模板的区域刷新规则
            let tableId = $('#content').find('.show').eq(0).find('table').attr('id'); //当前显示的Table ID
            if (regions != undefined && regions.length > 0) {
                refreshTable(tableId, data, regions); //刷新当前table指定的单元格
            }
            if (shapeRegions != undefined && shapeRegions.length > 0) {
                refreshForm(tableId, data, shapeRegions);
            }
        },
        complete: function () {
        }
    });
}

//刷新Table
function refreshTable(tableId, data, regions) {
    let _Page = data.Pages[0]
    colorList = data.ColorList, //颜色列表
        fontList = data.FontList; //字体列表
    $.each(_Page.Cells, function (i, cell) {
        let props = cell.N;
        let x = props[0], y = props[1];
        $.each(regions, function (i, ele) { //遍历自动刷新区域
            if (ele.x == x && ele.y == y) {
                let tdId = tableId + '_' + props[1] + '_' + props[0];
                let td = $('#' + tdId);
                //根据单元格内容来刷新单元格
                refreshCell(td, cell, globalRatio, colorList, fontList, "", tableId, data, false, false);
            }
        });

    });
}

function refreshCell(td, cell, ratio, colorList, fontList, pSheetName, oid, data, flag, isForm) {
    let cellProp = cell.N; //单元格属性
    //单元格不产生滚动条
    td.css("overflow-x", "hidden");
    td.css("overflow-y", "hidden");

    let tdWidth = td.attr('ow') * td.attr('hr');
    let tdHeight = td.attr('oh') * td.attr('vr');
    let topBdWidth; //上边框宽度
    let bottomBdWidth; //下边框宽度
    let leftBdWidth; //左边框宽度
    let rightBdWidth; //右边框宽度
    let fontSize; //字体大小
    if (ratio[0] != 1 && ratio[1] != 1) { //自适应
        //计算上边框的宽度
        if (cellProp[6] * ratio[1] < 1) {
            topBdWidth = 1; //高度最少为1
        } else {
            topBdWidth = Math.floor(cellProp[6] * ratio[1]);
        }
        //计算下边框的宽度
        if (cellProp[12] * ratio[1] < 1) {
            bottomBdWidth = 1; //高度最少为1
        } else {
            bottomBdWidth = Math.floor(cellProp[11] * ratio[1]);
        }
        //计算左边框的宽度
        if (cellProp[3] * ratio[0] < 1) {
            leftBdWidth = 1;
        } else {
            leftBdWidth = Math.floor(cellProp[3] * ratio[0]);
        }
        //计算右边框的宽度
        if (cellProp[9] * ratio[0] < 1) {
            rightBdWidth = 1;
        } else {
            rightBdWidth = Math.floor(cellProp[9] * ratio[0]);
        }
        if (cellProp[15] != undefined) {
            fontSize = parseInt(cellProp[15] * ratio[0]);
        }
    } else {
        topBdWidth = cellProp[6];
        bottomBdWidth = cellProp[12];
        leftBdWidth = cellProp[3];
        rightBdWidth = cellProp[9];
        fontSize = cellProp[15];
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
        td.html('<div><span style="width: ' + tdWidth + 'px; height:  ' + tdHeight + 'px; display:flex;overflow:hidden;word-break:break-word;white-space:pre-line;">' + text + '</span></div>');
    }
    let div = td.children(0); //div
    let span = td.children(0).children(0);//span


    if (cell.hasOwnProperty("AH")) { //水平居中
        if (cell.AH == 1) { //AH = 1时，水平居左
            span.css("justify-content", "flex-start");
            span.css("text-align", "left");
        } else {
            span.css("justify-content", "flex-end");
            span.css("text-align", "right");
        }
    } else { //没有AH属性，默认居中
        span.css("justify-content", "center");
        span.css("text-align", "center");
    }

    if (cell.hasOwnProperty("AV")) { //垂直居中
        if (cell.AV == 16) {  //AlignmentV->AV
            span.css("align-items", "flex-start");
        } else {
            span.css("align-items", "flex-end");
        }
    } else {
        span.css("align-items", "center");
        //span.css("text-align", "center");
    }

    if (cell.hasOwnProperty("BC")) { //设置单元格背景颜色
        var index = cell.BC;
        td.css("background-color", colorList[index]);
    } else { //当没有背景颜色时
        var row = cellProp[1]; //获取行号
        var rows = data.Pages[0].Rows;
        var rowArray = rows.RowArray;
        var rowObj = rowArray[row - 1];
        //行有颜色时
        if (rowObj != undefined && rowObj.Color != undefined) {
            td.css("background-color", colorList[rowObj.Color]);
        } else {
            var col = cellProp[0]; //获取列号
            var cols = data.Pages[0].Columns;
            var colArray = cols.ColumnArray;
            var colObj = colArray[col - 1];

            if (colObj != undefined && colObj.Color != undefined) {
                td.css("background-color", colorList[colObj.Color]);
            }
        }
    }

    if (cell.hasOwnProperty("T")) { //渲染文本属性
        var colorIndex = cellProp[19]; //文本颜色索引
        var color = colorList[colorIndex];
        var fontIndex = cellProp[14]; //字体索引
        var font = fontList[fontIndex];
        span.css({
            "font-weight": (cellProp[16] == 1 ? "bold" : "normal"),
            "color": color,
            "font-style": (cellProp[17] == 1 ? "italic" : "normal"),
            "font-family": font,
            "font-size": fontSize,
            "text-decoration": (cellProp[18] == 1 ? "underline" : "none")
        });
    }

    if (cell.hasOwnProperty("LS")) { //字间距
        span.css({
            "letter-spacing": cell.LS + 'px'
        });
    }

    if (cell.hasOwnProperty("LnS")) { //行间距
        span.css({
            "line-height": (cell.LnS + cellProp[15]) + 'px'
        });
    }

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
            /*"text-decoration": "underline",*/
            "cursor": "pointer" //鼠标变成手型
        });
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

    if (flag) {
        if (cell.hasOwnProperty("G")) { //有合并单元格属性
            Merge.Fn.MergeCell(cell, td, oid, cellProp[0], cellProp[1], ratio); //合并单元格
        }
    }

    //折叠行折叠列事件
    if (cell.hasOwnProperty("RetractRow")) {
        if (cell.RetractAtInit === 1) { //默认折叠
            var height = td.parent().height(); //获取tr的高度
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='Merge.Fn.doRowSwitch(this , \"" + oid + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='N'>+</a>");
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
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='Merge.Fn.doRowSwitch(this , \"" + oid + "\");' RetractBeginRow='" + cell.RetractBeginRow + "' RetractEndRow='" + cell.RetractEndRow + "' class='switch' isFold='Y'>-</a>");
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
            td.find('span').prepend("<a title='展开' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:5px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='Merge.Fn.doColumnSwitch(this , \'" + oid + "\');' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>+</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + oid + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
            td.attr("colspan", (parseInt(td.attr("colspan")) - (m - cell.RetractBeginCol)));
            td.css("width", Math.ceil(width / cell.G.C)); //获取合并的列数并且手动修改td的高度
            td.find("div").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
            td.find("span").eq(0).css("width", Math.ceil(width / cell.G.C)); //手动修改td里面span的高度
        } else {
            td.find('span').prepend("<a title='合并' style='width:10px;height:10px;line-height:10px;text-align:center;color: #666; cursor: pointer;padding:2px;margin-right:5px;margin-left:5px;border:1px solid;' onclick='Merge.Fn.doColumnSwitch(this , \"" + oid + "\");' RetractBeginCol='" + cell.RetractBeginCol + "' RetractEndCol='" + cell.RetractEndCol + "' class='switch'>-</a>");
            for (var m = cell.RetractBeginCol; m <= cell.RetractEndCol; m++) {
                $("#" + oid + "_r_" + m).hide();
            }
            td.attr("initCs", td.attr('colspan')); //记录原始合并信息
        }
    }


    //绘制左边框样式
    if (cellProp[2] != 0) {
        var lStyle = cellProp[2] > 1 ? 'dashed' : 'solid';
        var lColorIndex = cellProp[4],
            lColor = colorList[lColorIndex];
        td.css({
            "border-left-color": lColor,
            "border-left-style": lStyle,
            "border-left-width": (leftBdWidth + "px")
        });
    }
    if (cellProp[5] != 0) {
        //绘制上边框样式
        var tStyle = cellProp[5] > 1 ? 'dashed' : 'solid';
        var tColorIndex = cellProp[7], tColor = colorList[tColorIndex];
        td.css({
            "border-top-color": tColor,
            "border-top-style": tStyle,
            "border-top-width": (topBdWidth + "px")
        });
    }
    //绘制右边框样式
    if (cellProp[8] != 0) {
        var rStyle = cellProp[8] > 1 ? 'dashed' : 'solid';
        var rColorIndex = cellProp[10], rColor = colorList[rColorIndex];
        td.css({
            "border-right-color": rColor,
            "border-right-style": rStyle,
            "border-right-width": (rightBdWidth + "px")
        });
    }
    //绘制下边框样式
    if (cellProp[11] != 0) {
        var bStyle = cellProp[11] > 1 ? 'dashed' : 'solid';
        var bColorIndex = cellProp[13], bColor = colorList[bColorIndex];
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
        td.attr("isShowCenterSubReport", cell.IsSubReportCellPercent ? true : false);
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
        refreshSubSheet(td, cell, cell.SubReportSheetNames, isForm, data.pathId);
    }
    if (cell.RepaintRegions != undefined) { //单元格区域联动
        var regions = encodeURI(cell.RepaintRegions);
        if (cell.SubReportSheetNames != undefined) { //区域联动关联子表单
            var html = "<span style='cursor: pointer;' onclick=\"Link.Fn.regionLink(this,1,'" + regions + "', true , '"+ cell.SubReportSheetNames  +"')\">" + td.html() + "</span>"; //whj
            td.html(html);
        } else {//当前报表区域联动
            var html = td.html();
            td.html(html);
            td.find('span').unbind().bind('click', function () { //重新绑定方法
                Link.Fn.regionLink(this, 1, regions , false , '');
            })
        }
    }

    if (cell.hasOwnProperty("HyperLink")) { //超级链接属性
        var htm;//td 单元格的内容
        if (td.children('a').length > 0) {
            htm = td.children('a').html();
        } else {
            htm = td.html();
        }
        td.html("<a href='javascript:;' onclick='Link.Fn.hyperlink(" + cell.HyperLink + ");'>" + htm + "</a>");
        //给文本添加下划线
        td.children('a').children('div').children('span').css({
            /*'text-decoration': 'underline',*/
            /* 'color': '#00F'*/
        });
    }

    //单元格背景图片
    if (cell.hasOwnProperty("Pic")) {

        var block = cell.Pic.split("/");
        var url = base + '/export' + "/" + block[block.length - 2] + "/" + block[block.length - 1];
        td.css("background-image", "url(" + url + ")"); //whj
        if (cell.hasOwnProperty("A")) { //图片缩放
            td.css("background-repeat", "no-repeat");
            td.css("background-size", "100% 100%");
        } else {
            td.css("background-repeat", "no-repeat");
        }
    }
    if (isUploadFlag) { //报表是填报报表，需要生成填报控件
        Submit.Fn.init(td, cell, data, colorList, fontList);
    }


}


//刷新Form
function refreshForm(tableId, data, shapeRegions) {
    let ratio;
    let page = data.Pages[0]; //页面信息
    let shapes = page.Shapes;
    let totalWidth = page.FormW; //form的总宽度
    let totalHeight = page.FormH;//form的总高度
    let keepHr = data.KeepHVRatio; //是否保持横纵比
    //ratio = [1, 1];
    let _selfAdaption = data.WebCellPercent;
    if (_selfAdaption) {//报表自适应
        ratio = globalRatio;
    } else {
        ratio = [1, 1];
    }

    if (shapes != undefined) { //解析悬浮元素
        refreshShape(tableId, shapes, shapeRegions, ratio, data.pathId);
    }
}

function refreshShape(oid, shapes, regions, ratio , pathId){
    //遍历所有悬浮元素
    $.each(shapes, function (index, element) {

        var shapeName = element.Name; //悬浮插件名
        //刷新的悬浮元素
        if ($.inArray(shapeName, regions) != -1) {

            let id = randomUUID();
            let width = element.Width * globalRatio[0]; //悬浮元素宽度
            let height = element.Height * globalRatio[1]; //悬浮元素高度
            let HtmlFile = element.HtmlFile;
            let x = element.X * ratio[0]; //x轴位置
            let y = element.Y * ratio[1]; //y轴位置
            let text = element.Text; //悬浮元素文本
            let html;
            let borderStyle = '';
            
            let div = $('div[sname="' + shapeName + '"]');

            if (div.length > 0) {
                var type = div.attr("type");
                if (type != undefined && type == 'plugin') { //当前刷新的悬浮元素是插件
                    if (element.HtmlFile != undefined) {//插件正常更新
                        div.remove();

                        if (element.BW != undefined) { //边框
                            borderStyle = 'border-style:solid;border-width:' + element.BW + 'px;border-color:' + element.BC + ';box-sizing:border-box;';
                        }
                        //插件包括背景图片
                        if (element.BKPic != undefined) { //有背景图片和插件
                            var bgImg = element.BKPic.split("/");
                            html = '<div id="' + id + '" class="shape" type="plugin" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '?token='+ token +'\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base  + '/export/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                        } else {
                            html = '<div id="' + id + '"class="shape" type="plugin" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base  + '/export/' + HtmlFile + '" style="width:' + width + 'px;height:' + height + 'px;" frameborder=0 scrolling=no></iframe></div>'
                        }
                    } else {//否则的话不更新

                    }
                } else { //不是插件

                    div.remove();

                    if (element.BW != undefined) { //边框
                        borderStyle = 'border-style:solid;border-width:' + element.BW + 'px;border-color:' + element.BC + ';box-sizing:border-box;';
                    }
                    if (element.BKPic != undefined) {//是否有背景图片
                        var bgImg = element.BKPic.split("/");
                        if (element.HtmlFile != undefined) {
                            html = '<div id="' + id + '" class="shape" type="plugin" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '?token='+ token +'\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base  + '/export/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                        } else if (element.SN == undefined) {//不包含子表单
                            if (text == undefined) {//悬浮元素不包含文本
                                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base  + '/export/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '?token='+ token +'\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"></div>'
                            } else {//悬浮元素包含文本
                                var cssText = '';
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
                                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export' + '/'  + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '?token='+ token +'\');background-size:100% 100%;' + cssText + 'display:flex;justify-content:center;align-items:center;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';">' + text + '</div>'
                            }
                        } else {//包含子表单
                            var sheetName = element.SN;
                            html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export' + '/' +  bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '?token='+ token +'\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><table id="_tb_sheet_' + id + '" stable="1" class="x-table" sheetname="' + sheetName + '"style="border-collapse:collapse;border:none;border-spacing:2px;-webkit-border-horizontal-spacing: 2px;'
                                + '-webkit-border-vertical-spacing: 2px;table-layout: fixed;width:'+width+';height:'+height+';"  cellspacing="0"  cellpadding="0"></table></div>'
                        }
                    } else { //没有背景图片
                        if (element.SN == undefined) {//不包含子表单
                            if (text == undefined) {//悬浮元素不包含文本
                                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"></div>'
                            } else {
                                var cssText = '';
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
                                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';' + cssText + 'display:flex;justify-content:center;align-items:center;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';">' + text + '</div>'
                            }
                        } else {//包含子表单
                            var sheetName = element.SN;
                            html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><table id="_tb_sheet_' + id + '" stable="1" class="x-table" sheetname="' + sheetName + '"style="border-collapse:collapse;border:none;border-spacing:2px;-webkit-border-horizontal-spacing: 2px;'
                                + '-webkit-border-vertical-spacing: 2px;table-layout: fixed;"  cellspacing="0"  cellpadding="0"></table></div>'
                        }
                    }

                }
            } else {//第一次图表出现异常
                if (element.BW != undefined) { //边框
                    borderStyle = 'border-style:solid;border-width:' + element.BW + 'px;border-color:' + element.BC + ';box-sizing:border-box;';
                }
                if (element.BKPic != undefined && element.HtmlFile != undefined) { //有背景图片和插件
                    var bgImg = element.BKPic.split("/");
                    html = '<div id="' + id + '" class="shape" type="plugin" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export' + '/' + pathId + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '?token='+ token +'\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base  + '/export/' + HtmlFile + '" style="width:100%;height:100%" frameborder=0 scrolling=no></iframe></div>'
                } else if (element.HtmlFile != undefined) {//只有插件
                    html = '<div id="' + id + '"class="shape" type="plugin" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base  + '/export/' + HtmlFile + '" style="width:' + width + 'px;height:' + height + 'px;" frameborder=0 scrolling=no></iframe></div>'
                } else if (element.BKPic != undefined) {//只有背景图片
                    var bgImg = element.BKPic.split("/");
                    if (element.SN == undefined) {//不包含子表单
                        if (text == undefined) {//悬浮元素不包含文本
                            html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export' + '/' + pathId + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '?token='+ token +'\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"></div>'
                        } else {//悬浮元素包含文本
                            var cssText = '';
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
                            html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export/' +  pathId + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '\');background-size:100% 100%;' + cssText + 'display:flex;justify-content:center;align-items:center;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';">' + text + '</div>'
                        }
                    } else {//包含子表单
                        var sheetName = element.SN;
                        html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';background-image:url(\'' + (base + '/export/' + pathId + '/' + bgImg[bgImg.length - 2]) + '/' + bgImg[bgImg.length - 1] + '\');background-size:100% 100%;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><table id="_tb_sheet_' + id + '" stable="1" class="x-table" sheetname="' + sheetName + '"style="border-collapse:collapse;border:none;border-spacing:2px;-webkit-border-horizontal-spacing: 2px;'
                            + '-webkit-border-vertical-spacing: 2px;table-layout: fixed;"  cellspacing="0"  cellpadding="0"></table></div>'
                    }
                } else {
                    if (element.SN == undefined && type == undefined) {//不包含子表单
                        if (text == undefined) {//悬浮元素不包含文本
                            //html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + element.Z + ';"></div>'
                        } else {
                            var cssText = '';
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
                            html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';' + cssText + 'display:flex;justify-content:center;align-items:center;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';">' + text + '</div>'
                        }
                    } else if (type == undefined) {//包含子表单
                        var sheetName = element.SN;
                        //此处table原先有position:relative；但是在谷歌91版本中会导致表单不滚动，所以去掉
                        html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z-200) + ';"><table id="_tb_sheet_' + id + '" stable="1" class="x-table" sheetname="' + sheetName + '"style="border-collapse:collapse;border:none;border-spacing:2px;-webkit-border-horizontal-spacing: 2px;'
                            + '-webkit-border-vertical-spacing: 2px;table-layout: fixed;"  cellspacing="0"  cellpadding="0"></table></div>'
                    }
                }
            }
            //$('#' + oid).parent().append(html);
            $('#content').append(html);
            //重新设置下table的高度，解决刷新后，table高度变矮的问题
            $('#' + id).find('table').css('height' , height);
            if (element.Hyperlink != undefined) {
                $('#' + id).bind('click', function () {
                    var hyperlink = JSON.parse(element.Hyperlink);
                    Link.Fn.hyperlink(hyperlink);
                })
            }
            if (element.SN != undefined) {
                $.getJSON(base + "/report/loadJSON?token="+ token +"&pathId=" + pathId , {
                    serverId:serverId,
                    pathId: pathId,
                    isSubSheet:'Y',
                    file: element.SN,
                    page: parseInt($('#curr').val() == '' ? 1 : $('#curr').val())
                }, function (data) {
                    if(data.Pages != undefined){ //返回的json数据是正确的
                        generateWcpShapeSheet('_tb_sheet_' + id, data, element, width, height);
                        //generateShapeSheet("_tb_sheet_" + id, data, element, width, height);
                    }
                });
            }
        }
    })
}