//初始化单元格属性
function initCellProp() {

    let text = canvasEvent.Cell.getSelCellText(); //获取当前单元格文本
    $('#editArea').val(text); //设置编辑框值

    /**
     * 单元格数据开始
     * **/

    //边框图片恢复原始状态
    $('#border').attr("src", "images/design/tool/line.png");
    $('img[name="borders"]').removeClass('choose');

    let cellType = canvasEvent.Cell.getSelCellsType(); //单元格类型
    let cellStyle = canvasEvent.Cell.getSelCellsStyle(); //单元格样式
    let line = canvasEvent.Cell.getSelCellLineStyle();
    let dsName = canvasEvent.Cell.getDSName(); //数据集名称
    let columnName = canvasEvent.Cell.getFieldName(); //获取字段名
    let dataType = canvasEvent.Cell.getFieldDataType(); //获取数据类型
    let dataAttribution = canvasEvent.Cell.getDataAttribution(); //获取数据设置
    let dataStatisticsType = canvasEvent.Cell.getDataStatisticsType(); //获取汇总方式
    let minRecordCount = canvasEvent.Cell.getMinRecordCount();
    //数据集字段
    if (dsName != "") {
        let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex(); //获取当前模板索引值
        let key = templateIndex + '@#' + dsName; //获取键值
        let columns = dsMap[key]; //获取列值
        $('#dscol').empty();
        $('#cellds').val(dsName).prop("selected", true);
        $('#dscol').attr('disabled', false);
        //遍历列并设置选中状态
        if (columns != undefined) {
            $.each(columns, function (i, e) {
                if (e == columnName) {
                    $('#dscol').append("<option selected>" + e + "</option>");
                } else {
                    $('#dscol').append("<option>" + e + "</option>");
                }
            })
        }

    } else { //非数据集字段
        $('#cellds').val("").prop("selected", true);
        $("#dscol").val("").prop("selected", true);
        $('#dscol').attr('disabled', true);
    }
    //设置数据类型
    $('#dstype').val(dataType).prop("selected", true);
    //数据设置
    $('#attri').val(dataAttribution).prop("selected", true);
    if (dataAttribution == 3) { //汇总
        //汇总类型
        $('#statistics').val(dataStatisticsType).prop("selected", true);
        $('#statistics').attr("disabled", false);
    } else {
        $('#statistics').val("0").prop("selected", true);
        $('#statistics').attr("disabled", true);
    }

    //设置最小行数
    $('#minr').val(minRecordCount);

    //处理数据字典
    let dictDsName = canvasEvent.Cell.getDataDictDsName();
    if (dictDsName == "") {
        $('#d_dict').prop('checked', false);
        $('#d_ds').attr('disabled', true);
        $('#d_af').attr('disabled', true);
        $('#d_sf').attr('disabled', true);
        $('#d_ds').val("").prop("selected", true);
        $('#d_sf').val("").prop("selected", true);
        $('#d_af').val("").prop("selected", true);
    } else {
        $('#d_dict').prop('checked', true);
        $('#d_ds').attr('disabled', false);
        $('#d_af').attr('disabled', false);
        $('#d_sf').attr('disabled', false);
        $('#d_ds').val(dictDsName).prop("selected", true);

        let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex(); //获取当前模板索引值

        let key = templateIndex + '@#' + dictDsName;
        let columns = dsMap[key];

        $('#d_af').empty();
        $('#d_sf').empty();
        $('#d_af').append("<option></option>");
        $('#d_sf').append("<option></option>");
        $.each(columns, function (i, e) {
            $('#d_af').append("<option value='" + e + "'>" + e + "</option>");
            $('#d_sf').append("<option value='" + e + "'>" + e + "</option>");
        })

        //映射字段
        let actualField = canvasEvent.Cell.getActualFieldName();
        $('#d_af').val(actualField).prop("selected", true);
        //显示字段
        let showField = canvasEvent.Cell.getShowFieldName();
        $('#d_sf').val(showField).prop("selected", true);
    }

    let fieldPaging = canvasEvent.Cell.isFieldPaging();//分页
    $('#fg').prop('checked', fieldPaging);

    let pagingAfterRow = canvasEvent.Cell.isPagingAfterRow(); //行后分页
    $('#far').prop('checked', pagingAfterRow);

    let completeRowForEveryPage = canvasEvent.Cell.isCompleteRowForEveryPage(); //每页补齐行
    $('#crfs').prop('checked', completeRowForEveryPage);

    let completeRowForLastPage = canvasEvent.Cell.isCompleteRowForLastPage(); //尾页补齐行
    $('#crfl').prop('checked', completeRowForLastPage);

    let imageField = canvasEvent.Cell.isImageField(); //图片字段
    $('#imageField').prop('checked', imageField);

    if (imageField) {
        $('#imagePathStr').attr('disabled', false);
        let imagePathStr = canvasEvent.Cell.imagePathStr();
        $('#imagePathStr').val(imagePathStr);
    } else {
        $('#imagePathStr').attr('disabled', true);
        $('#imagePathStr').val("");
    }

    let expandByIsMutliColumn = canvasEvent.Cell.isExpandByMutliColumn(); //是否分栏
    let json = JSON.parse(expandByIsMutliColumn);
    let ismulti = json.isMutliColumn;
    let isColumnFirst = json.isColumnFirst;
    let num = json.colCount;
    $('#multi').prop('checked', ismulti);
    if (ismulti) {
        $('#cf').attr('disabled', false);
        $('#cf').prop('checked', isColumnFirst);
        $('#num').attr('disabled', false);
        $('#num').val(num);
    } else {
        $('#cf').attr('disabled', true);
        $('#cf').prop('checked', false);
        $('#num').attr('disabled', true);
        $('#num').val("");
    }

    // 开启折叠
    let isRetractSubCell = canvasEvent.Cell.isRetractSubCell();
    $('#zd').prop('checked', isRetractSubCell);
    // 显示最后行
    let isShowLastSubCell = canvasEvent.Cell.isShowLastSubCell();
    $('#lasts').prop('checked', isShowLastSubCell);
    // 允许编辑
    let isSelCellForceAllowedEdit = canvasEvent.Cell.isSelCellForceAllowedEdit();
    $('#lockCell').prop('checked', isSelCellForceAllowedEdit);
    // 拆分并拷贝
    let isDemergeAndCopyCell = canvasEvent.Cell.isDemergeAndCopyCell();
    $('#demergeAndCopyCell').prop('checked', isDemergeAndCopyCell);

    let mergeExpandCellStr = canvasEvent.Cell.getMergeExpandCellStr();
    $('#mergeExpandCellStr').prop('checked', mergeExpandCellStr);

    let selCellDataAttrListToGroup = canvasEvent.Cell.getCellDataAttrListToGroup();
    $('#listToGroup').prop('checked', selCellDataAttrListToGroup);

    let autoHiddenComment = canvasEvent.Cell.getSelCellCommentHide();
    $('#autoHiddenComment').prop('checked', autoHiddenComment);
    /**
     * 高级开始
     * **/
        //扩展方向
    let expandOri = canvasEvent.Cell.getExpandOri();
    $('button[name="fx"]').each(function () {
        $(this).addClass('noChooseBtn');
        $(this).removeClass('chooseBtn');
    });
    $('button[name="fx"][value="' + expandOri + '"]').removeClass('noChooseBtn').addClass('chooseBtn');
    //获取上父格类型
    let TopParentCellType = canvasEvent.Cell.getTopParentCellType();
    $('#sfg').val(TopParentCellType).prop('selected', true);
    if (2 == TopParentCellType) {
        let topParentCell = canvasEvent.Cell.getTopParentCell(); //获取左父格单元格
        topParentCell = JSON.parse(topParentCell);
        $("#sfgS").show();
        $("#sfgA").val(canvasEvent.Util.int2CellX(topParentCell.x));
        $("#sfg1").val(topParentCell.y == 0 ? '' : topParentCell.y);
    } else {
        $("#sfgS").hide();
        $("#sfgA").val('');
        $("#sfg1").val('');
    }

    //获取左父格类型
    let leftParentCellType = canvasEvent.Cell.getLeftParentCellType();
    $('#zfg').val(leftParentCellType).prop('selected', true);
    if (2 == leftParentCellType) {
        let leftParentCell = canvasEvent.Cell.getLeftParentCell(); //获取左父格单元格
        leftParentCell = JSON.parse(leftParentCell);
        $("#zfgS").show();
        $("#zfgA").val(canvasEvent.Util.int2CellX(leftParentCell.x));
        $("#zfg1").val(leftParentCell.y == 0 ? '' : leftParentCell.y);
    } else {
        $("#zfgS").hide();
        $("#zfgA").val('');
        $("#zfg1").val('');
    }

    //排序
    let orderType = canvasEvent.Cell.getOrderType();
    $('button[name="fxg"]').each(function () {
        $(this).addClass('noChooseBtn');
        $(this).removeClass('chooseBtn');
    });
    $('button[name="fxg"][value="' + orderType + '"]').removeClass('noChooseBtn').addClass('chooseBtn');

    //横向扩展
    let hxkz = canvasEvent.Cell.isSelCellExtendH();
    $('#hxkz').prop("checked", hxkz);
    //纵向扩展
    let zxkz = canvasEvent.Cell.isSelCellExtendV();
    $('#zxkz').prop("checked", zxkz);
    //显示0值
    let showZero = canvasEvent.Cell.isSelCellShowZero();
    $('#showZero').prop("checked", showZero);
    //隐藏单元格
    let hidec = canvasEvent.Cell.isSelCellHided();
    $('#hidec').prop("checked", hidec);
    //空值显示值
    let nullConvertValue = canvasEvent.Cell.getSelCellNullConvertStr();
    $('#nullConvertValue').val(nullConvertValue);

    //水平对齐方式
    let alignH = canvasEvent.Cell.getSelCellAlignH();
    $("img[name='texthAlign']").each(function () {
        if ($(this).attr('val') == alignH) {
            $(this).addClass('choose');
        } else {
            $(this).removeClass('choose');
        }
    });
    //垂直对齐方式
    let alignV = canvasEvent.Cell.getSelCellAlignV();
    $("img[name='textvAlign']").each(function () {
        if ($(this).attr('val') == alignV) {
            $(this).addClass('choose');
        } else {
            $(this).removeClass('choose');
        }
    });
    //是否自适应行高
    let isAdaptTextHeight = canvasEvent.Cell.isSelCellAdaptTextHeight();
    if (isAdaptTextHeight) {
        $("img[name='adapt']").addClass('choose');
        $("img[name='adapt1']").addClass('choose');
    } else {
        $("img[name='adapt1']").removeClass('choose');
        $("img[name='adapt']").removeClass('choose');
    }

    //是否自适应列宽
    let isAdaptTextWidth = canvasEvent.Cell.isSelCellAdaptTextWidth();
    if (isAdaptTextWidth) {
        $("img[name='adaptColumn']").addClass('choose');
    } else {
        $("img[name='adaptColumn']").removeClass('choose');
    }

    //行间距
    let lineSpacing = canvasEvent.Cell.getSelCellLineSpacing();
    $('#lineSpacing').val(lineSpacing == 0 ? "" : lineSpacing);
    //字符间距
    let letterSpacing = canvasEvent.Cell.getSelCellLetterSpacing();
    $('#letterSpacing').val(letterSpacing == 0 ? "" : letterSpacing);
    //段落空格数
    let paragraphSpaceCount = canvasEvent.Cell.getSelCellParagraphSpaceCount();
    $('#paragraphSpaceCount').val(paragraphSpaceCount == 0 ? "" : paragraphSpaceCount);
    //上边距
    let topMargin = canvasEvent.Cell.getSelCellTopMargin();
    $('#topMargin').val(topMargin == 0 ? "" : topMargin);
    //下边距
    let bottomMargin = canvasEvent.Cell.getSelCellBottomMargin();
    $('#bottomMargin').val(bottomMargin == 0 ? "" : bottomMargin);
    //左边距
    let leftMargin = canvasEvent.Cell.getSelCellLeftMargin();
    $('#leftMargin').val(leftMargin == 0 ? "" : leftMargin);
    //右边距
    let rightMargin = canvasEvent.Cell.getSelCellRightMargin();
    $('#rightMargin').val(rightMargin == 0 ? "" : rightMargin);
    //图片水平
    let imgalignH = canvasEvent.Cell.getSelCellImageAlignX()
    $("img[name='imghAlign']").each(function () {
        if ($(this).attr('val') == imgalignH) {
            $(this).addClass('choose');
        } else {
            $(this).removeClass('choose');
        }
    });
    //图片垂直
    let imgalignV = canvasEvent.Cell.getSelCellImageAlignY()
    $("img[name='imgvAlign']").each(function () {
        if ($(this).attr('val') == imgalignV) {
            $(this).addClass('choose');
        } else {
            $(this).removeClass('choose');
        }
    });
    //图片缩放
    let isSelCellAdaptImageSize = canvasEvent.Cell.isSelCellAdaptImageSize();
    if (isSelCellAdaptImageSize) {
        $("#imgkeep").removeAttr('disabled');
    } else {
        $("#imgkeep").attr('disabled', true);
    }
    $("#imgsf").prop("checked", isSelCellAdaptImageSize);
    //保持原比例
    let isSelCellRawImageScale = canvasEvent.Cell.isSelCellRawImageScale();
    $("#imgkeep").prop("checked", isSelCellRawImageScale);

    //重置边框属性
    $("div[name='borderAlign_d']").removeClass('fx');
    //线宽
    /* $(".xk1").css('background-color', '#FFFFFF');;
     $(".xk").css('background-color', '#9CEBDC');*/
    $('input[name="xk"][value="0"]').prop('checked', true);
    //$('#widthType').val('0'); //设置线宽类型
    //边框颜色
    $('#linecolor').css('background-color', '#F2F3F5');
    $('#lineColorDiv').css('background-color', '#000000');
    $('#lineColorText').text('#000000');
    //样式
    $('#ckline').find('div').find('img').attr('src', 'images/design/line/l1.png');
    $('#ckline').find('div').find('img').attr('val', 1);
    var dict = {};
    //控件信息初始化
    let controlInfo = canvasEvent.Cell.getControlInfo();
    if (controlInfo != '') { //存在控件信息
        let ctinfo = JSON.parse(controlInfo);
        let ctype = ctinfo.ControlType;
        $("#controlName_" + ctype).val(ctinfo.ControlName); //控件名
        $("#allowNull_" + ctype).prop('checked', ctinfo.AllowNull); //是否允许为空
        $("#affectRow_" + ctype).prop('checked', ctinfo.AffectRow); //影响行数
        $("#defaultValue_" + ctype).val(ctinfo.DefaultValue); //默认值
        $("#tip_" + ctype).val(ctinfo.Hint); //提示
        $("#expr_" + ctype).prev().val(ctinfo.ControlShowExpr); //公式
        $("select[name='control']").val(ctinfo.ControlType);
        $('table[id^="controlInfo"]').hide(); //隐藏其他属性内容
        dict = {};//数据字典还原，其他的不管
        $('#controlInfo' + ctype).show();
        //根据控件类型初始化控件属性
        if (10 == ctype || 2 == ctype || 3 == ctype) {
            dict.ComboDSType = ctinfo.ComboDSType;
            if (1 == ctinfo.ComboDSType) {
                dict.DSName = ctinfo.DSName;
                dict.KeyFieldName = ctinfo.KeyFieldName;
                dict.ShowFieldName = ctinfo.ShowFieldName;
            } else if (2 == ctinfo.ComboDSType) {
                dict.CustomComboTexts = ctinfo.CustomComboTexts;
            }
        } else if (1 == ctype) { //文本编辑框
            $("#maxsize").val(ctinfo.MaxLength == -1 ? "" : ctinfo.MaxLength);
            $("#minsize").val(ctinfo.MinLength == -1 ? "" : ctinfo.MinLength);
        } else if (8 == ctype) { //
            $('#allowDecimal').prop('checked', ctinfo.AllowDecimal);
            $('#allowNegative').prop('checked', ctinfo.AllowNegative);
            $('#maxnum').val(ctinfo.MaxValue == -1 ? "" : ctinfo.MaxValue);
            $('#minnum').val(ctinfo.MinValue == -1 ? "" : ctinfo.MinValue);
            $('#autonum').val(ctinfo.decimalPlace == -1 ? "" : ctinfo.decimalPlace);
        } else if (9 == ctype) {
            $('#btntext').val(ctinfo.ButtonText);
            $('#btntype').val(ctinfo.ButtonType);
            $('#addButJs').prev().val(ctinfo.ButtonJS);
            if (2 == ctinfo.ButtonType) {
                $('#btntype').parent().parent().next().next().hide();
                $("#addButJs").show();
            } else {
                $("#addButJs").hide();
                $('#btntype').parent().parent().next().next().show();
            }
            $('#dyg1').val(canvasEvent.Util.int2CellX(ctinfo.FirstCellX));
            $('#dyg2').val(ctinfo.FirstCellY);
        } else if (7 == ctype) {
            $('#cktext').val(ctinfo.ShowText);
        } else if (6 == ctype) {
            $('#showdate').prop('checked', ctinfo.HasTime);
            if (ctinfo.DateType == undefined) { //兼容之前的时间控件，没有时间格式
                if (ctinfo.HasTime) {
                    $('#dateTimeType').show();
                    $('#dateType').hide();
                    $('#dateTimeType').val(0).prop('selected', true);
                } else {
                    $('#dateTimeType').hide();
                    $('#dateType').show();
                    $('#dateType').val(0).prop('selected', true);
                }
            } else {
                if (ctinfo.HasTime) {
                    $('#dateTimeType').show();
                    $('#dateType').hide();
                    $('#dateTimeType').val(ctinfo.DateType).prop('selected', true);
                } else {
                    $('#dateTimeType').hide();
                    $('#dateType').show();
                    $('#dateType').val(ctinfo.DateType).prop('selected', true);
                }
            }

        } else if (11 == ctype) {
            $('#filesize').val(ctinfo.SizeLimit == -1 ? "" : ctinfo.SizeLimit);
            $('#filetype').val(ctinfo.FileType);
            $('#showPic').prop('checked', ctinfo.ShowPic);
        }
    } else {
        $('select[name="control"]').val('0').prop('selected', true);
        $('table[id^="controlInfo"]').hide();
    }

    if (cellType != 0) { //存在单元格样式
        let val = cellType;
        $('select[name="fmt"]').val(val).prop("selected", true);
        $("#fmt_val").empty();
        if (2 == val) {
            var enums = CellConstant.Number;
            for (var i in enums) {
                $("#fmt_val").append('<li val=' + i + '>' + enums[i] + '</li>');
            }
        } else if (4 == val) {
            var enums = CellConstant.DateType;
            for (var i in enums) {
                $("#fmt_val").append('<li val=' + i + '>' + enums[i] + '</li>');
            }
        } else if (5 == val) {
            var enums = CellConstant.TimeType;
            for (var i in enums) {
                $("#fmt_val").append('<li val=' + i + '>' + enums[i] + '</li>');
            }
        } else if (6 == val) {
            var enums = CellConstant.Currency;
            for (var i in enums) {
                $("#fmt_val").append('<li val=' + i + '>' + enums[i] + '</li>');
            }
        } else if (8 == val) {
            var enums = CellConstant.Percent;
            for (var i in enums) {
                $("#fmt_val").append('<li val=' + i + '>' + enums[i] + '</li>');
            }
        } else if (10 == val) {
            var enums = CellConstant.BarCodeType;
            for (var i in enums) {
                $("#fmt_val").append('<li val=' + i + '>' + enums[i] + '</li>');
            }
        }
        if (val == 10) {
            let barCode = canvasEvent.Cell.getSelCellsBarCodeType();
            $("#fmt_val").find('li[val="' + barCode + '"]').addClass('fmt_hover');
        } else {
            $("#fmt_val").find('li[val="' + cellStyle + '"]').addClass('fmt_hover');
        }


        let li = $('#fmt_val').children();
        li.click(function () {
            //移除选中状态
            li.removeClass('fmt_hover');
            //添加选中状态
            $(this).addClass('fmt_hover');

            if (val == 10) {
                //设置二维码类型
                canvasEvent.Cell.setSelCellsBarCodeType($(this).attr('val'));
            } else {
                //设置数据格式
                canvasEvent.Cell.setSelCellsStyle($(this).attr('val'));
            }
        })

    } else {
        $("#fmt_val").empty();
        $('select[name="fmt"]').val("1").prop("selected", true);
    }
}

//初始化悬浮元素属性
function initShapeProp() {
    let shapeName = canvasEvent.Shape.getSelShapeName();
    $('#shapeName').val(shapeName);

    let x = canvasEvent.Shape.getSelShapeX();//x坐标
    if (typeof x === 'number' && x % 1 !== 0) {
        x = parseFloat(x.toFixed(1));
    }
    $('#xPost').val(x);
    let y = canvasEvent.Shape.getSelShapeY();//y坐标
    if (typeof y === 'number' && y % 1 !== 0) {
        y = parseFloat(y.toFixed(1));
    }
    $('#yPost').val(y);
    let width = canvasEvent.Shape.getSelShapeWidth();//宽度
    if (typeof width === 'number' && width % 1 !== 0) {
        width = parseFloat(width.toFixed(1));
    }
    $('#sWidth').val(width);
    let height = canvasEvent.Shape.getSelShapeHeight();//高度
    if (typeof height === 'number' && height % 1 !== 0) {
        height = parseFloat(height.toFixed(1));
    }
    $('#sHeight').val(height);
    let sText = canvasEvent.Shape.getSelShapeText(); //悬浮元素文本
    $('#sText').val(sText);
    //颜色，字体
    let fontColor = canvasEvent.Shape.getSelShapeFontColor(); //文本颜色
    let font = canvasEvent.Shape.getSelShapeFont(); //获取文本字体
    //悬浮元素是否可见
    let isSelShapeVisible = canvasEvent.Shape.isSelShapeVisible();
    if (isSelShapeVisible == 1) {
        $('#isSelShapeVisible').prop('checked', true);
    } else {
        $('#isSelShapeVisible').prop('checked', false);
    }

    $('#lineColorDiv1').css('background-color', '#000000');
    $('#lineColorText1').text('#000000');

    $('div[name="borderAlign_d1"]').removeClass('fx');

}