/**
 * canvas 文本输入框事件
 * */

function initEvent() {
    //上下左右键盘值
    let directions = [37, 38, 39, 40, 13];

    $('body').bind('click', function (event) {
        hideAllMenus();
    })

    //7.5使用，用来使设计器界面上的input获取焦点，从而可以接收到复制粘贴的事件
    document.addEventListener('copy', (e) => {
        let id = $(e.target).attr('id');
        var explorer = navigator.userAgent.toLowerCase();
        if (explorer.indexOf("chrome") >= 0) {
            e.preventDefault();
            e.stopPropagation();
            let text = document.getSelection().toString();
            e.clipboardData.setData("text", text);
        }
    });

    document.addEventListener('cut', (e) => {
        var explorer = navigator.userAgent.toLowerCase();
        if (explorer.indexOf("chrome") >= 0) {
            e.preventDefault();
            e.stopPropagation();
            let element = document.activeElement;
            let cursorPos = $(element)[0].selectionStart; //获取光标的位置
            let text = document.getSelection().toString(); //获取截取文本长度
            let originValue = element.value; //原始位置
            let prefix = originValue.substring(0, cursorPos); //首部分
            let end = originValue.substring(cursorPos + text.length, originValue.length);
            let newValue = prefix + end;
            e.clipboardData.setData("text", text);

            element.value = newValue;
        }
    });

    document.addEventListener('paste', (e) => {
        let id = $(e.target).attr('id');

        var explorer = navigator.userAgent.toLowerCase();
        if (explorer.indexOf("chrome") >= 0) {
            e.preventDefault();
            e.stopPropagation();

            let targetType = $(e.target).prop('type');
            let targetId = $(e.target).attr('id');


            var clipboardData = e.clipboardData;
            var pastedText = clipboardData.getData('text/plain');
            // 获取你想要触发paste事件的元素
            var element = document.activeElement;
            let cursorPos = $(element)[0].selectionStart; //获取光标的位置
            let originValue = element.value; //原始值
            let prefix = originValue.substring(0, cursorPos); //首部分
            let end = originValue.substring(cursorPos, originValue.length);
            if (id == 'EFTextInput') {
                if ($(e.target).width() == 0) {
                    element.value = element.value + pastedText;
                } else {
                    if (isFullySelected($(e.target))) { //全选状态下粘贴，应该覆盖掉当前值
                        element.value = pastedText;
                    } else {
                        if (isNoneSelected($(e.target))) { //未选择文本
                            element.value = prefix + pastedText + end;
                        } else { //部分选择文本
                            let val = getPartValue($(e.target));
                            element.value = val.prefix + pastedText + val.suffix;
                        }

                    }
                    DesignModule._setSelCellText(encodeStr(element.value)); //设置当前选择的单元格文本
                    $('#editArea').val(element.value); //设置文本编辑框的值
                }
            } else {
                if (isFullySelected($(e.target))) { //全选状态下粘贴，应该覆盖掉当前值
                    element.value = pastedText;
                } else {
                    if (isNoneSelected($(e.target))) { //未选择文本
                        element.value = prefix + pastedText + end;
                    } else { //部分选择文本
                        let val = getPartValue($(e.target));
                        element.value = val.prefix + pastedText + val.suffix;
                    }
                }
            }
        }


    });


    $("#EFTextInput").bind('paste', function (event) {
        $("#EFTextInput").focus();
        let sheetType = canvasEvent.Sheet.currSheetType(); //获取当前sheet页类型
        if (sheetType == 4) { //form表单,无需判断是否允许编辑
            setTimeout(function () {
                canvasPaste(copyContent); //调用设计器事件，将文本输入框的值赋给设计器并调用paste事件
            }, 100)
        } else {
            if (canvasEvent.Cell.isAllowEditCurrCell()) { //单元格允许编辑
                if ($("#EFTextInput").width() == 0) {
                    $("#EFTextInput").val('');
                    setTimeout(function () {
                        let value = $('#EFTextInput').val();
                        canvasPaste(value); //调用设计器事件，将文本输入框的值赋给设计器并调用paste事件
                    }, 100)
                } else {

                }
            }
        }
    });

    //文本输入框修改事件
    $('#EFTextInput').bind('keyup', function (event) {
            if (!event.ctrlKey) {
                //keyup不处理复制粘贴剪切，交给keydown去处理
                //if (event.keyCode != 67 && event.keyCode != 86 && event.keyCode != 88 && event.keyCode != 90) {
                if ($.inArray(event.keyCode, directions) != -1) { //上下左右方向键
                    //文本输入框不处于编辑状态
                    if ($('#EFTextInputDiv').width() == 0) {
                        //调用canvas方法来实现单元格的上下左右移动
                        canvasKeyPress(5, event);
                        //移动后，更新文本输入框的值为当前单元格的值
                        $(this).val(canvasEvent.Cell.getSelCellText());
                        //处理上下左右按键到表格底部和最右边时丢失焦点的问题
                        setTimeout(function () {
                            let canvas = document.getElementById('canvas');
                            $(canvas).trigger('click'); //触发单击事件获取编辑框焦点 whj
                            $('#EFTextInput').focus();
                        }, 100)
                    }
                } else {
                    if (event.keyCode == 17) { //Control

                    } else {
                        if (event.keyCode == 46) { // DELETE
                            canvasEvent.Cell.removeSelCellData(); //删除单元格内容
                            canvasEvent.Shape.removeSelShapePlugin();//删除悬浮元素
                            $('#editArea').val('');
                        } else {
                            if (event.keyCode != 86) {
                                let text = $(this).val(); //获取输入框内的值
                                DesignModule._setSelCellText(encodeStr(text)); //设置当前选择的单元格文本
                                $('#editArea').val(text); //设置文本编辑框的值
                            }

                        }
                    }
                }
                //}
            } else {

            }
        }
    )
    //用keydown来监听复制粘贴剪切事件
    $('#EFTextInput').bind('keydown', function (event) {
            if (!event.ctrlKey) {
                if (event.keyCode == 86) { // v
                    let text = $(this).val(); //获取输入框内的值
                    DesignModule._setSelCellText(encodeStr(text)); //设置当前选择的单元格文本
                    $('#editArea').val(text); //设置文本编辑框的值
                }
            }
            if (event.ctrlKey && event.keyCode == 67) { //ctrl + c事件、
                if ($(this).width() == 0) { //在单元格上复制
                    canvasKeyPress(5, event); //调用设计器的keypressevent，来触发clipboardCopyEvt事件，将设计器上获取的值赋给文本输入框
                } else { //在EFTextInput内复制

                }
            } else if (event.ctrlKey && event.keyCode == 86) {//ctrl + v事件
                //event.stopPropagation(); //阻止冒泡
            } else if (event.ctrlKey && event.keyCode == 88) {//ctrl + x事件
                if ($(this).width() == 0) { //在单元格上复制
                    canvasKeyPress(5, event); //调用设计器的keypressevent，来触发clipboardCopyEvt事件，将设计器上获取的值赋给文本输入框
                } else { //在EFTextInput内复制

                }
            } else if (event.ctrlKey && event.keyCode == 65) {//ctrl + A事件
                if ($('#EFTextInput').width() == 0) { //input未显示状态下，才执行全选操作，否则默认input的全选操作
                    canvasKeyPress(5, event);
                }
            } else if (event.ctrlKey && event.keyCode == 46) { //ctrl + delete ，清空内容和样式
                canvasEvent.Cell.removeSelCell();
                canvasEvent.Shape.removeSelShapePlugin();
            } else if (event.ctrlKey && event.keyCode == 90) { //ctrl + z
                DesignModule._undo();
            } else if (event.ctrlKey && event.keyCode == 83) { //ctrl + s

                event.preventDefault(); //屏蔽浏览器默认事件
                saveC();
            }
        }
    )
}

function canvasKeyPress(type, event) {

    if (event.keyCode == '86' && event.ctrlKey) {
        return;
    }
    var data = {
        type: type
        , x: (event.clientX || 0)
        , y: (event.clientY || 0)
        , ctrlKey: event.ctrlKey
        , shiftKey: event.shiftKey
        , key: event.key || ''
        , keyCode: event.keyCode || 0
        , button: event.button || 0
    };
    var d = JSON.stringify(data);
    if (type == 3 || type == 4 || type == 5) {
        DesignModule._keyMouseEvent(encodeStr(d));
    } else {
        //canvas区域内
        if (data.y > 0 && ($("canvas").width() - data.x > 16) && ($("canvas").height() - 25 - data.y > 16)) {
            DesignModule._keyMouseEvent(ParamOperator.encodeStr(d));
            if (e.button == 2) {
                showMenu(e.clientX, e.clientY);
            }
        }
    }
}

function canvasPaste(content) {
    var str = encodeStr(content);
    DesignModule._copyClipboardDataToSpreadsheet(str);
    DesignModule._paste();
}

//重置单元格工具栏
function resetCellTool() {
    let font = canvasEvent.Cell.getSelCellFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    if (fontJson.bold) {
        $('img[name="bold"]').addClass('choose');
    } else {
        $('img[name="bold"]').removeClass('choose');
    }
    if (fontJson.italic) {
        $('img[name="italic').addClass('choose');
    } else {
        $('img[name="italic"]').removeClass('choose');
    }
    if (fontJson.underline) {
        $('img[name="underline').addClass('choose');
    } else {
        $('img[name="underline"]').removeClass('choose');
    }
    $('select[name="fontfamily"]').val(fontJson.family).prop("selected", true);//字体
    $('select[name="fontsize"]').val(fontJson.pointSize).prop("selected", true);//字体大小

    let color = canvasEvent.Cell.getSelCellFontColor(); //文本颜色
    //$("img[name='ftcolor']").attr("src", "images/design/43_1.png");
    $("img[name='ftcolor']").css("border-bottom", "4px solid " + color);

    let bkColor = canvasEvent.Cell.getSelCellBKColor(); //背景颜色
    $("img[name='bgcolor']").css("border-bottom", "4px solid " + bkColor);

    let alignH = canvasEvent.Cell.getSelCellAlignH(); //水平方向
    if (alignH == 1) {//left
        $('img[name="left"]').addClass('choose');
        $('img[name="center"]').removeClass('choose');
        $('img[name="right"]').removeClass('choose');
    } else if (alignH == 4) {//center
        $('img[name="center"]').addClass('choose');
        $('img[name="left"]').removeClass('choose');
        $('img[name="right"]').removeClass('choose');
    } else if (alignH == 2) {//right
        $('img[name="right"]').addClass('choose');
        $('img[name="left"]').removeClass('choose');
        $('img[name="center"]').removeClass('choose');
    } else {
        $('img[name="left"]').removeClass('choose');
        $('img[name="center"]').removeClass('choose');
        $('img[name="right"]').removeClass('choose');
    }

    let isAdapt = canvasEvent.Cell.isSelCellAdaptTextHeight();
    if (isAdapt) {
        $('img[name="adapt"]').addClass('choose');
    } else {
        $('img[name="adapt"]').removeClass('choose');
    }

    let isHide = canvasEvent.Cell.isSelCellHided();
    if (isHide) {
        $('img[name="hide"]').addClass('choose');
    } else {
        $('img[name="hide"]').removeClass('choose');
    }
}

//重置悬浮元素工具栏
function resetShapeTool() {
    let font = canvasEvent.Shape.getSelShapeFont(); //获取字体属性
    let fontJson = JSON.parse(font);
    if (fontJson.bold) {
        $('img[name="bolds"]').addClass('choose');
    } else {
        $('img[name="bolds"]').removeClass('choose');
    }
    if (fontJson.italic) {
        $('img[name="italics').addClass('choose');
    } else {
        $('img[name="italics"]').removeClass('choose');
    }
    if (fontJson.underline) {
        $('img[name="underlines').addClass('choose');
    } else {
        $('img[name="underlines"]').removeClass('choose');
    }
    $('select[name="fontfamilys"]').val(fontJson.family).prop("selected", true);//字体
    $('select[name="fontsizes"]').val(fontJson.pointSize).prop("selected", true);//字体大小

    let color = canvasEvent.Shape.getSelShapeFontColor(); //文本颜色
    //$("img[name='ftcolor']").attr("src", "images/design/43_1.png");
    $("img[name='ftcolor']").css("border-bottom", "4px solid " + color);

    let bkColor = canvasEvent.Cell.getSelCellBKColor(); //背景颜色
    //$("img[name='bgcolor']").attr("src", "images/design/42_1.png");
    $("img[name='bgcolor']").css("border-bottom", "4px solid " + bkColor);

    let isAdsorb = canvasEvent.Shape.isAdsorbShape();
    if (isAdsorb) {
        $('img[name="adsorb"]').parent().parent().addClass('choose');
    } else {
        $('img[name="adsorb"]').parent().parent().removeClass('choose');
    }

}

//隐藏所有设计器弹出菜单
function hideAllMenus() {
    $('.rightmenu').hide();
    $('#rightRowClickMenu').hide();
    $('#insertMenu').hide();
    $('#columnMenu').hide();
    $('#rowMenu').hide();
    $('#repeatMenu').hide();
    $('#sheetMenu').hide();
    $('#shapeMenu').hide();
    $('#contextMenu6').hide();
    $('#contextMenu7').hide();
    $('#contextMenu8').hide();
    $('#formMenu').hide();
    $('#borderDiv').hide();
    $('#borderDivs').hide();

}

function isFullySelected(obj) {
    var text = obj.val();
    var start = obj.prop('selectionStart');
    var end = obj.prop('selectionEnd');
    return start === 0 && end === text.length;
}


function getPartValue(obj) {
    var text = obj.val();
    var start = obj.prop('selectionStart');
    var end = obj.prop('selectionEnd');
    let prefix = text.substring(0, start); //首部分
    let suffix = text.substring(end, text.length);
    return {prefix: prefix, suffix: suffix};
}

function isNoneSelected(obj) {
    var text = obj.val();
    var start = obj.prop('selectionStart');
    var end = obj.prop('selectionEnd');
    return start == end;
}

