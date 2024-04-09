/**
 * 设计器工具栏事件
 * **/

//初始化工具栏某些操作
function initTool() {
    let colors = [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
            "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
            "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
            "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ];
    //颜色插件配置
    let colorOpt = {
        allowEmpty: true,
        showInput: true,
        containerClassName: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        showAlpha: true,
        maxPaletteSize: 10,
        clickoutFiresChange: false,
        preferredFormat: "hex8",
        move: function (color) {

        },
        change: function (color) {
            let hexColor = "transparent";
            if (color) {
                /*if (color.alpha == 1) {
                    hexColor = color.toHex8String();
                } else {
                    hexColor = color.toHex8String();
                }*/
                hexColor = color.toString();
                let alpha = hexColor.substring(1,3);
                let trueColor = hexColor.substring(3,9);
                let col = '#' + trueColor + alpha;
                changeColor($(this), col, true, color);
            }
        },
        beforeShow: function (color) {
              if(color == null){
                  $(this).spectrum('set', '#ffffffff');
              }else{
                  let co = '';
                  let id = $(this).attr('id');
                  if ('chartColor' == id || 'linecolor' == id || 'linecolor1' == id || 'bkcolor' == id || 'bkcolor1' == id || 'bkcolor2' == id || 'color' == id || 'color1' == id) {
                      co = $(this).css('background-color');
                  } else {
                      co = $(this).css('border-bottom-color');
                  }
                  if (co) {
                      $(this).spectrum('set', co);
                  }
              }

        },
        hide: function () {
            $("#mask").hide();
        },
        RgbaToHex: function (val) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{8})$/;
            if (/^(rgba|RGBA)/.test(val)) {
                var aColor = val.replace(/(?:\(|\)|rgba|RGBA)*/g, "").split(",");
                var strHex = "#";
                for (var i = 0; i < aColor.length; i++) {
                    if (i == 3) {
                        var hex = colorOpt.alphaToHex(Number(aColor[i]));
                        strHex += hex;
                    } else {
                        var hex = Number(aColor[i]).toString(16);
                        if (hex === "0") {
                            hex += hex;
                        }
                        strHex += hex;
                    }

                }
                return strHex;
            } else if (reg.test(val)) {
                var aNum = val.replace(/#/, "").split("");
                if (aNum.length === 6) {
                    return val;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return val;
            }
        },
        alphaToHex: function (val) {
            let num = val * 255;
            if (num == 0) {
                return '00';
            } else {
                let value = (Math.round(num)).toString(16);
                if (value.length == 1) {
                    value = '0' + value;
                }
                return value;
            }
        },
        palette: colors
    };

    $("img[name='bgcolor']").spectrum(colorOpt);
    $("img[name='ftcolor']").spectrum(colorOpt);


    //初始化字号
    for (let i = 1; i < 100; i++) {
        let opt;
        if (i == 12) {
            opt = '<option value="' + i + '" selected>' + i + '</option>';
        } else {
            opt = '<option value="' + i + '">' + i + '</option>';
        }
        $("select[name='fontsize']").append(opt);
        $("select[name='fontsizes']").append(opt);
    }
    //默认字号大小为18
    //$("select[name='fontsize']").val(18).attr("selected", true);
    //初始化边框操作
    $('#border').bind('click', function (event) {
        event.stopPropagation(); //阻止冒泡，不响应body的点击事件
        let list = $('#borderDiv');
        let X = $(this).offset().top + 20;
        let Y = $(this).offset().left;
        list.css({"top": X, "left": Y, "z-index": 100}).show();
    })
    //borderDiv中边框按钮操作
    $('img[name="borders"]').bind('click', function () {
        //点击值
        let val = $(this).attr("attr");
        $(this).siblings().removeClass('choose');
        $(this).addClass('choose');
        if (val == '00') { //取消所有样式
            canvasEvent.Cell.cancelSelCellLineStyle();
        } else if (val == '7') {//加粗边框
            canvasEvent.Cell.setSelCellLineStyle(5, 1, 1, '#000000');
        } else {
            canvasEvent.Cell.setSelCellLineStyle(val, 1, 0, '#000000');
        }
        //修改边框样式图案
        $('#border').attr('src', $(this).attr('src'));
        $('#borderDiv').hide();

    })

    //单元格位置
    $('#cellPos').unbind().bind('keypress', function (event) {
        if (event.keyCode == '13') { //回车键
            let val = $(this).val();
            let value = canvasEvent.Util.moveSelFrameToCell(val); //跳转到指定的位置
            let cellVal = canvasEvent.Cell.getSelCellText();
            $('#editArea').val(cellVal);
        }
    });
    //单元格内容
    $('#editArea').bind('keyup', function () { //单元格文本修改时，设计器上方的编辑框对应修改
        let val = $(this).val();
        canvasEvent.Cell.setSelCellText(val);
    });

}

function changeColor(obj, hexColor, ct, color) {
    var url;
    if (obj.attr("name") == "bgcolor") { //背景颜色
        url = "images/design/42_1.png";
        canvasEvent.Cell.setSelCellBKColor(hexColor);
        //canvasEvent.Cell.setSelCellBKColor(color.toString());
        //obj.attr("src", url);
        obj.css("border-bottom", "4px solid " + hexColor + "");
    } else if (obj.attr("name") == "ftcolor") { //文本颜色
        url = "images/design/43_1.png";
        var isShape = canvasEvent.Shape.isSelectedShape(); //首先判断选中的是否是悬浮元素
        if (isShape == 1) {
            canvasEvent.Shape.setSelShapeFontColor(hexColor);
        } else {
            canvasEvent.Cell.setSelCellFontColor(hexColor);
        }
        //obj.attr("src", url);
        obj.css("border-bottom", "4px solid " + hexColor + "");
    }
}

//撤销设计器操作
function undoC() {
    DesignModule._undo();
}

//恢复设计器操作
function recoverC() {
    DesignModule._comeback();
}

//格式刷
function formatC() {
    canvasEvent.Util.setFormatBrushFrame();
}

function setFilter(){
    canvasEvent.Util.setSelDesignTableRegion()
}


//修改字体
function changeFontFamily(obj) {
    let font = $(obj).val();
    let isShape = canvasEvent.Shape.isSelectedShape(); //首先判断选中的是否是悬浮元素
    if (isShape == 1) {
        DesignModule._setSelShapeFontFamily(encodeStr(font));
    } else {
        canvasEvent.Cell.setSelCellFontFamily(encodeStr(font));
    }
}

//修改字体大小
function changeFontSize(obj) {
    let isShape = canvasEvent.Shape.isSelectedShape(); //首先判断选中的是否是悬浮元素
    if (isShape == 1) {
        canvasEvent.Shape.setSelShapeFontPointSize($(obj).val());
    } else {
        canvasEvent.Cell.setSelCellFontPointSize($(obj).val());
    }
}

//加粗
function boldC() {
    let font = canvasEvent.Cell.getSelCellFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    let bold = fontJson.bold; //是否加粗
    if (bold) {
        canvasEvent.Cell.setSelCellFontBold(false);
        $('img[name="bold"]').removeClass('choose');
    } else {
        canvasEvent.Cell.setSelCellFontBold(true);
        canvasEvent.Cell.setSelCellFontWeight(700);
        $('img[name="bold"]').addClass('choose');
    }

}

//加粗
function boldS() {
    let font = canvasEvent.Shape.getSelShapeFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    let bold = fontJson.bold; //是否加粗
    if (bold) {
        canvasEvent.Shape.setSelShapeFontWeight(false);
        $('img[name="bolds"]').removeClass('choose');
    } else {
        canvasEvent.Shape.setSelShapeFontWeight(true);
        $('img[name="bolds"]').addClass('choose');
    }

}

//斜体
function italicC() {
    let font = canvasEvent.Cell.getSelCellFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    let italic = fontJson.italic;
    if (!italic) { //斜体
        $('img[name="italic"]').addClass('choose');
    } else {
        $('img[name="italic"]').removeClass('choose');
    }
    canvasEvent.Cell.setSelCellFontItalic(!italic);

}

//斜体
function italicS() {
    let font = canvasEvent.Shape.getSelShapeFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    let italic = fontJson.italic;
    if (!italic) { //斜体
        $('img[name="italics"]').addClass('choose');
    } else {
        $('img[name="italics"]').removeClass('choose');
    }
    let isShape = canvasEvent.Shape.isSelectedShape(); //首先判断选中的是否是悬浮元素
    canvasEvent.Shape.setSelShapeFontItalic(!italic);
}

//下划线
function underLineC() {
    let font = canvasEvent.Cell.getSelCellFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    let underline = fontJson.underline; //是否加粗
    if (underline) {
        canvasEvent.Cell.setSelCellFontUnderline(false);
        $('img[name="underline"]').removeClass('choose');
    } else {
        canvasEvent.Cell.setSelCellFontUnderline(true);
        $('img[name="underline"]').addClass('choose');
    }
}

function underLineS() {
    let font = canvasEvent.Shape.getSelShapeFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    let underline = fontJson.underline; //是否加粗
    if (underline) {
        canvasEvent.Shape.setSelShapeFontUnderline(false);
        $('img[name="underlines"]').removeClass('choose');
    } else {
        canvasEvent.Shape.setSelShapeFontUnderline(true);
        $('img[name="underlines"]').addClass('choose');
    }
}

//左对齐
function alignLeft() {
    $('img[name="left"]').addClass('choose');
    $('img[name="center"]').removeClass('choose');
    $('img[name="right"]').removeClass('choose');
    canvasEvent.Cell.setSelCellAlignH(1);
}

//居中
function alignCenter() {
    $('img[name="center"]').addClass('choose');
    $('img[name="left"]').removeClass('choose');
    $('img[name="right"]').removeClass('choose');
    canvasEvent.Cell.setSelCellAlignH(4);
}

//右对齐
function alignRight() {
    $('img[name="right"]').addClass('choose');
    $('img[name="center"]').removeClass('choose');
    $('img[name="left"]').removeClass('choose');
    canvasEvent.Cell.setSelCellAlignH(2);
}

//自适应行高
function adaptLineHeightC() {
    let isAdapt = canvasEvent.Cell.isSelCellAdaptTextHeight(); //是否自适应行高
    if (isAdapt) { //自适应
        $('img[name="adapt"]').removeClass('choose');
        canvasEvent.Cell.setSelCellAdaptTextHeight(false);
    } else {
        $('img[name="adapt"]').addClass('choose');
        canvasEvent.Cell.setSelCellAdaptTextHeight(true);
    }

}

//合并单元格
function mergeCell() {
    DesignModule._mergeSelCells();
}

//拆分单元格
function splitCell() {
    DesignModule._unmergeSelCells();
}

//插入行
function insertRow() {
    canvasEvent.Row.insertRow();
}

//追加行
function appendRow() {
    canvasEvent.Row.appendRow();
}

//删除行
function deleteRow() {
    canvasEvent.Row.deleteRow();
}

//插入列
function insertColumn() {
    canvasEvent.Column.insertColumn();
}

//追加列
function appendColumn() {
    canvasEvent.Column.appendColumn();
}

//删除行列
function deleteColumn() {
    canvasEvent.Column.deleteColumn();
}

//插入斜线
function addOblC() {
    canvasEvent.Cell.setSelCellsType(9);
}

//插入图片
function addImg() {

}

function setTableRegion(){
    canvasEvent.Util.setSelDesignTableRegion(); //设置表格区域
}

function removeTableRegion(){
    canvasEvent.Util.removeSelDesignTableRegion(); //取消表格区域
}



//保存模板
function saveC() {

    let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
    if (production != 'true') {
        layer.msg('演示环境不允许保存');
        return;
    }

    //判断当前模板能否修改，主要针对于被分享的模板
    if ($.inArray(curId, disbleMap) != -1) {
        layer.msg('当前模板不允许修改');
        return;
    }
    $('.paramItem').css('background-color' , '#FFFFFF');
    let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex(); //获取当前打开的模板索引
    let templateId; //当前打开的模板ID
    $.each(templateMap, function (i, e) {
        if (e.index == templateIndex) {
            templateId = e.templateId;
        }
    })
    if (templateId == 0) { //新增模板
        //弹出模板目录
        let index = layer.open({
            type: 2,
            area: ['350px', '480px'],
            closeBtn: 0,
            maxmin: true,
            title: ['模板目录', 'height:30px;line-height:30px'],
            content: ['pages/menus/menu.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            success: function (layero, index) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.init();
            },
            yes: function (index, layero) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                let menuId = iframeWin.getMenuId(); //获取模板目录ID
                if (menuId == '') { //未选择目录
                    layer.msg('请选择要保存的目录');
                    return false;
                }
                let templateName = canvasEvent.Template.getCurrentTemplateName(); //获取当前模板名称
                let templateId = 0; //新增模板，id为0
                let templateContent = canvasEvent.Template.getCurTemplateContent(); //获取当前模板内容
                let blob = new Blob([templateContent], {type: 'application/json'});
                let formdata = new FormData();
                formdata.append('file', blob);
                formdata.append('id', templateId);
                formdata.append('fileName', templateName);

                $.ajax({
                    url: ip + '/designSys/saveNewTemplate?menuId=' + menuId + '&token=' + token,
                    type: 'post',
                    processData: false,
                    contentType: false,
                    dataType: "json",
                    data: formdata,
                    success: function (data) {
                        if (data.state == 'success') { //保存成功
                            let templateId = data.templateId; //新增的模板ID
                            //更新模板Map里面的ID值
                            $.each(templateMap, function (i, e) {
                                if (e.index == templateIndex) {
                                    e.templateId = templateId;
                                }
                            })
                            initTree();
                            layer.closeAll();
                        } else {
                            layer.alert("保存失败");
                        }
                    },
                    error: function () {

                    }
                });
            }
        });
    } else {//保存现有文件
        let templateName = canvasEvent.Template.getCurrentTemplateName(); //获取当前模板名称
        let templateContent = canvasEvent.Template.getCurTemplateContent(); //获取当前模板内容
        let blob = new Blob([templateContent], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('id', templateId);
        formdata.append('fileName', templateName);

        $.ajax({
            url: ip + '/designSys/saveExistTemplate?token=' + token,
            type: 'post',
            processData: false,
            contentType: false,
            dataType: "json",
            data: formdata,
            success: function (data) {
                if (data.state == 'success') { //保存成功
                    layer.msg("保存成功",
                        {
                            time: 2000
                        });
                } else {
                    if (data.state == 'notExist') { //模板不存在
                        layer.alert("保存失败," + data.message);
                        canvasEvent.Template.removeSpreadSheet(templateIndex);
                    } else {
                        layer.alert("保存失败," + data.message);
                    }
                }
            },
            error: function () {

            }
        });
    }
}

//增加悬浮元素
function addShape() {
    $('#actIn').focus();
    canvasEvent.Shape.addNullShape();
    $('#normal').hide();
    $('#shape').show();
    $('#sheetAttr').hide();
    initShapeProp();
}

//设置吸附
function adsorbS() {
    let flag = canvasEvent.Shape.isAdsorbShape(); //是否吸附
    if (flag == 1) {
        canvasEvent.Shape.setAdsorbShape(false);
        $('img[name="adsorb"]').parent().parent().removeClass('choose');
    } else {
        canvasEvent.Shape.setAdsorbShape(true);
        $('img[name="adsorb"]').parent().parent().addClass('choose');
    }

}

//至于顶层
function toTopS() {
    canvasEvent.Shape.setTop();
}

//至于底层
function toBottomS() {
    canvasEvent.Shape.setBottom();
}

//定位悬浮元素
function searchShape() {

    let index = layer.open({
        type: 2,
        area: ['400px', '400px'],
        closeBtn: 0,
        resize: false,
        title: ['悬浮元素定位', 'height:30px;line-height:30px'],
        content: 'pages/menus/showShape.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let shapeName = iframeWin.getShapeName();
            canvasEvent.Shape.findAndSelectShape(shapeName);
            $('#shape').show();
            $('#normal').hide();
            $('#EFTextInput').focus();
            let sheetName = canvasEvent.Shape.getSelShapeSheetName(); //获取子表单名，判断当前点击的是否是悬浮插件
            if (sheetName == '') { //未关联子表单
                $('#sheetAttr').hide(); //显示子表单属性
                let pluginInfo = canvasEvent.Shape.getSelShapePluginInfo(); //获取插件信息
                if (pluginInfo == 0) { //没有插件信息

                }
            } else {//关联了子表单
                $('#sheetAttr').show(); //显示子表单属性
                $('#sName').val(sheetName); //子表单值
                var isKHV = canvasEvent.Shape.isSelShapeKeepHVRatio();//保持横纵比
                $('#isSubReportKeepHVRatio').prop('checked', isKHV);
                var isSS = canvasEvent.Shape.isSelShapeShowScrollBar();//是否显示滚动条
                $('#isShowSubReportScrollBar').prop('checked', isSS);
                var ssv = canvasEvent.Shape.selShapeStepScrollV();//滚动步长
                $('#stepScrollV').val(ssv)
                var isv = canvasEvent.Shape.selShapeIntervalScrollV();//滚动时间
                $('#intervalScrollV').val(isv)
            }
            resetShapeTool(); //重置悬浮元素工具栏
            initShapeProp(); //初始化悬浮元素属性
            layer.close(index);
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let all = DesignModule._getCurrentSheetShapeNames(); //获取当前所有的悬浮元素
            all = ParamOperator.decodeStrAndFree(all);
            all = JSON.parse(all);
            let allShape = all.allShapeNames;
            iframeWin.init(allShape);
        }
    });


}

function pageSetting() {
    let index = layer.open({
        type: 2,
        area: ['520px', '350px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['页面设置', 'height:30px;line-height:30px'],
        content: 'pages/design/page.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage();
            let t = canvasEvent.Sheet.setSheetPageSetting(JSON.stringify(page))
            layer.close(index);
        },
        success: function (layero, index) {
            MainEditor.setCurSpreadSheetEnabled(0);
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let json = canvasEvent.Sheet.getSheetPageSetting();
            iframeWin.init(json);
        }
    });
}

function showParams(){
    $('#shape').hide();
    $('#normal').hide();
    $('#params').show();
    let isShowParam = canvasEvent.Param.isShowedParamDeisgnSheet();
    if(isShowParam){
        $('.paramItem').css('background-color','#FFFFFF');
        canvasEvent.Param.removeParamDeisgnSheet();
    }else{
        $('.paramItem').removeClass('hover');
        canvasEvent.Param.showParamDeisgnSheet();
        $('.paramItem').css('background-color','#B7E1FF');
    }
}

//隐藏单元格
function hideCell() {
    //是否隐藏
    let hide = canvasEvent.Cell.isSelCellHided();
    if (hide) {
        $('img[name="hide"]').removeClass('choose');
    } else {
        $('img[name="hide"]').addClass('choose');
    }
    canvasEvent.Cell.setSelCellHided(!hide);
}

function fixCell() {
    let index = layer.open({
        type: 2,
        area: ['370px', '250px'],
        closeBtn: 0,
        resize: false,
        title: ['固定行列', 'height:30px;line-height:30px'],
        content: 'pages/menus/fixcell.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage();
            let t = canvasEvent.Sheet.setFixedColRow(page.fixColumnCount, page.fixRowCount, page.fixFootRowCount, page.fixFootBeginRow);
            layer.close(index);
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let json = canvasEvent.Sheet.getFixedColRow();
            iframeWin.init(json);
        }
    });
}

function replaceC() {
    let index = layer.open({
        type: 2,
        area: ['600px', '300px'],
        closeBtn: 0,
        resize: false,
        title: ['替换', 'height:30px;line-height:30px'],
        content: 'pages/menus/replace.html',
        btn: ['替换', '全部替换', '查找', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) { // 替换
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let content = iframeWin.getOptions();
            let num = DesignModule._searchAndSelect(ParamOperator.encodeStr(content.searchContent), content.isExprOnly
                , content.isCaseSensitive, content.isCellMatch, content.isDistinguishSBCAndDBC, ParamOperator.encodeStr(content.replaceContent), true);
            if (num == 0) {
                layer.msg('未找到要替换的内容', {
                    icon: 2,
                    time: 1000
                });
            }
        },
        btn2: function (index, layero) { // 全部替换
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let content = iframeWin.getOptions();
            let num = DesignModule._replaceAll(ParamOperator.encodeStr(content.searchContent), content.isExprOnly
                , content.isCaseSensitive, content.isCellMatch, content.isDistinguishSBCAndDBC, ParamOperator.encodeStr(content.replaceContent));
            layer.msg('替换了' + num + '个单元格!', {
                icon: 1,
                time: 1000
            });
            return false;
        }
        , btn3: function (index, layero) { // 查找按钮
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let content = iframeWin.getOptions();
            let num = DesignModule._searchAndSelect(ParamOperator.encodeStr(content.searchContent), content.isExprOnly
                , content.isCaseSensitive, content.isCellMatch, content.isDistinguishSBCAndDBC, ParamOperator.encodeStr(content.replaceContent), false);
            if (num == 0) {
                layer.msg('未找到查找的内容', {
                    icon: 2,
                    time: 1000
                });
            }
            return false;
        }, btn4: function (index, layero) { // 查找按钮
            layer.close(index);
        }
    });
}

function addChart() {
    var index = layer.open({
        type: 2,
        area: ['650px', '400px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['插件类型选择', 'height:30px;line-height:30px'],
        content: 'pages/design/addchart.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var type = iframeWin.getType();
            $("#ct_type").trigger('change');
            if (DesignModule._isSelectedShape()) {
                insertChartByPluginType(type, layer, index, true);
            } else {
                insertChartByPluginType(type, layer, index, false);
            }
        },
        success: function (layero, index) {
        }
    });
}

function addFormChart() {

    if (!DesignModule._isSelectedShape()) {
        layer.msg('请选择插件');
    } else {
        var index = layer.open({
            type: 2,
            area: ['650px', '400px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['插件类型选择', 'height:30px;line-height:30px'],
            content: 'pages/design/addchart.html',
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var type = iframeWin.getType();
                $("#ct_type").trigger('change');
                insertChartByPluginType(type, layer, index, true);
            },
            success: function (layero, index) {
            }
        });
    }


}

//添加自定义插件
function addCustomChart() {
    let index = layer.open({
        type: 2,
        area: ['1000px', '800px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['自定义插件', 'height:30px;line-height:30px'],
        content: 'pages/design/CustomPlugin_Echarts.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let pluginInfo = iframeWin.getPluginInfos();
            insertCustomPlugin_Echarts("CustomPlugin_Echarts", layer, index, DesignModule._isSelectedShape(), pluginInfo)
        },
        success: function (layero, index) {
        }
    });
}

function insertChartByPluginType(type, layer, index, isShape) {
    let width;
    let height;
    if (isShape) {
        width = 160;
        height = 160;
    } else {
        let cell = canvasEvent.Cell.getSelCellRect(); //获取当前单元格
        width = cell.width; //单元格宽度
        height = cell.height; //单元格高度
    }
    layer.msg('生成插件中..', {
        icon: 16
        , shade: 0.01
    });
    $.ajax({
        url: ip + "/plugin/generateDefaultPluginPng?token=" + token,
        type: "post",
        data: {"width": width, "height": height, "type": type},
        dataType: "json",
        success: function (res) {
            if (res.state == "success") {
                let imageCode = res.imageCode;
                if (!isShape) { //非悬浮元素
                    DesignModule._setSelCellPluginDefaultImage(encodeStr(imageCode)); //将图片放到当前单元格
                    DesignModule._setSelCellPluginInfo(encodeStr(res.option));
                    DesignModule._setSelCellPluginType(encodeStr(type)); //设置单元格插件类型
                    DesignModule._setSelCellPluginName(encodeStr(res.chineseName));
                } else { //悬浮元素
                    canvasEvent.Shape.setSelShapePluginInfo((res.option), (type), (res.chineseName), (imageCode));
                }

                layer.close(index);
            } else {
                layer.alert("获取默认图片出错");
            }
        },
        error: function () {

        }
    })
}

function insertCustomPlugin_Echarts(type, layer, index, isShape, pluginInfo) {
    let width;
    let height;
    if (isShape) {
        width = 160;
        height = 160;
    } else {
        let cell = canvasEvent.Cell.getSelCellRect(); //获取当前单元格
        width = cell.width; //单元格宽度
        height = cell.height; //单元格高度
    }
    layer.msg('生成插件中..', {
        icon: 16
        , shade: 0.01
    });
    $.ajax({
        url: ip + "/plugin/generatePluginMixedPng?token=" + token,
        type: "post",
        data: {"width": width, "height": height, "type": type, "option": JSON.stringify(pluginInfo) , realData:"{}"},
        dataType: "json",
        success: function (res) {
            if (res.state == "success") {
                let imageCode = res.imageCode;
                if (!isShape) { //非悬浮元素
                    _setSelCellPluginDefaultImage(encodeStr(imageCode)); //将图片放到当前单元格
                    _setSelCellPluginInfo(encodeStr(JSON.stringify(pluginInfo)));
                    _setSelCellPluginType(encodeStr(type)); //设置单元格插件类型
                } else { //悬浮元素
                    canvasEvent.Shape.setSelShapePluginInfo(JSON.stringify(pluginInfo), type, "", imageCode);
                }
                layer.close(index);
            } else {
                layer.alert("获取默认图片出错");
            }
        },
        error: function () {

        }
    })
}

function viewData(){
    var index = layer.open({
        type: 2,
        area: ['700px', '400px'],
        closeBtn: 0,
        resize: true,
        title: ['单元格', 'height:36px;line-height:36px'],
        content: ['pages/design/cell.html', 'no'],
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let expr = iframeWin.getExpr();
            $('#editArea').val(expr);
            canvasEvent.Cell.setSelCellText(expr);
            layer.closeAll();

        },
        success: function (layero, index) {
            // MainEditor.setCurSpreadSheetEnabled(0);
            let iframeWin = window[layero.find('iframe')[0]['name']];
            //let val = $('#editArea').val();
            let val = canvasEvent.Cell.getSelCellText();
            iframeWin.setExpr(val);
        }
    });
}









