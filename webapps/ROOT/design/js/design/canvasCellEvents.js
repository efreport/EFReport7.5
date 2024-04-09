//初始化单元格事件
function initCellEvents() {

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
        allowEmpty: true, showInput: true, containerClassName: "full-spectrum", showInitial: true, showPalette: true,
        showSelectionPalette: true, showAlpha: true, maxPaletteSize: 10, preferredFormat: "hex",
        change: function (color) {
            let hexColor = "transparent";
            if (color) {
                hexColor = color.toHexString();
                //changeLineColor($(this), hexColor, true, color);
                $(this).find('#lineColorDiv').css("background-color", hexColor);
                $(this).find('#lineColorText').text(hexColor);
            }
        },
        beforeShow: function () {
            //MainEditor.setCurSpreadSheetEnabled(0);
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
        },
        hide: function () {
            $("#mask").hide();
        },
        palette: colors
    };


    /**
     * 单元格数据开始
     * **/

    $('#cellds').unbind().bind('change', function () {
        $('#dscol').empty();
        $('#dscol').append("<option></option>");
        $('#dscol').attr('disabled', false);
        let val = $(this).val();
        if (val == "") {//未选中ds时
            canvasEvent.Cell.setDSName(val);
        } else {
            canvasEvent.Cell.setDSName(val);
            let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex(); // 获取当前模板的索引值
            let key = templateIndex + '@#' + val; //键
            let columns = dsMap[key]; //获取ds对应的列
            $.each(columns, function (i, e) {
                if (i == 0) { //默认选中第一个字段
                    $('#dscol').append("<option value='" + e + "' selected>" + e + "</option>");
                    canvasEvent.Cell.setFieldName(e);
                } else {
                    $('#dscol').append("<option value='" + e + "'>" + e + "</option>");
                }
            })

        }
    })

    //字段列选择事件
    $('#dscol').unbind().bind("change", function () {
        let val = $(this).val();
        canvasEvent.Cell.setFieldName(val);
    })
    //数据类型选择事件
    $('#dstype').unbind().bind("change", function () {
        let val = $(this).val();
        canvasEvent.Cell.setFieldDataType(val);
    })
    //数据设置选择事件
    $('#attri').unbind().bind("change", function () {
        let val = $(this).val();
        canvasEvent.Cell.setDataAttribution(val);
        if (val == 3) { //汇总
            $('#statistics').attr("disabled", false);
        } else {
            $('#statistics').attr("disabled", "disabled");
        }
    })

    $('#minr').unbind().bind("change", function () {
        let val = $(this).val();
        try {
            val = parseInt(val);
            let g = /^[1-9]*[1-9][0-9]*$/;
            if (!g.test(val)) {
                if (val == -1 || val == 0) {
                    canvasEvent.Cell.setMinRecordCount(val);
                } else {
                    $(this).val('');
                }
            } else {
                $(this).val(val);
                canvasEvent.Cell.setMinRecordCount($(this).val());
            }

        } catch (err) {
            $(this).val('');
        }
    })

    $('#statistics').unbind().bind("change", function () {
        let val = $(this).val();
        val = parseInt(val);
        canvasEvent.Cell.setDataStatisticsType(val);
    })

    //数据字典
    $('#d_dict').unbind().bind("change", function () {
        let checked = $(this).prop("checked"); //是否选中
        if (checked) { //选中
            $('#d_ds').attr('disabled', false);
            $('#d_af').attr('disabled', false);
            $('#d_sf').attr('disabled', false);
        } else {
            $('#d_ds').attr('disabled', true);
            $('#d_af').attr('disabled', true);
            $('#d_sf').attr('disabled', true);
            canvasEvent.Cell.setDataDict();
        }
    })
    //数据字典ds
    $('#d_ds').unbind().bind("change", function () {
            let dsName = $(this).val();
            canvasEvent.Cell.setDataDictDsName(dsName);
            let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
            let key = templateIndex + '@#' + dsName;
            let columns = dsMap[key];

            $('#d_af').empty();
            $('#d_sf').empty();
            $('#d_af').append("<option></option>");
            $('#d_sf').append("<option></option>");
            $.each(columns, function (i, e) {
                $('#d_af').append("<option value='" + e + "'>" + e + "</option>");
                $('#d_sf').append("<option value='" + e + "'>" + e + "</option>");
            })
        }
    )
    //过滤筛选
    $("#filterExpr").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '550px'],
            maxmin: true,
            closeBtn: 0,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/menus/cellFilter.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var data = iframeWin.getRules();
                data = JSON.parse(data);
                var rules = data.rules;
                var parent = data.parent;
                if (rules.length == 0) {//未设置规则
                    canvasEvent.Cell.setFilterExpr('');
                } else {
                    canvasEvent.Cell.setFilterExpr(JSON.stringify(rules));
                }

                DesignModule._setFilterDependentParent(parent);
                layer.close(index);
            },
            success: function (layero, index) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                //获取当前单元格上的ds信息
                let dsName = canvasEvent.Cell.getDSName();
                let tmp = canvasEvent.Template.getCurrentSpreadSheetIndex();
                let dsInfo = dsMap[tmp + '@#' + dsName]; //获取ds对应的数据列
                let rules = canvasEvent.Cell.getFilterExpr(); //获取过滤规则
                let parent = canvasEvent.Cell.getFilterDependentParent();
                iframeWin.init(dsInfo, rules, parent);
            }
        });
    });
    //悬浮元素是否可见
    $("#shapeExpr").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:36px;line-height:36px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
                // MainEditor.setCurSpreadSheetEnabled(1);
            },
            yes: function (index, layero) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                let expr = iframeWin.getExpr();
                if(expr == ""){ //没有设置公式
                    canvasEvent.Shape.setSelShapeVisExprStr("");
                }else{
                    if (expr.indexOf('=') != 0) {
                        expr = "=" + expr;
                        // 设置单元格文本
                        canvasEvent.Shape.setSelShapeVisExprStr(expr);
                    }else{
                        canvasEvent.Shape.setSelShapeVisExprStr(expr);
                    }
                }
                layer.close(index);
            },
            success: function (layero, index) {
                // MainEditor.setCurSpreadSheetEnabled(0);
                let iframeWin = window[layero.find('iframe')[0]['name']];
                //获取当前单元格文本
                let val = canvasEvent.Shape.getSelShapeVisExprStr();
                let valArr = val.split('');
                if (valArr[0] == '=') {
                    val = val.replace('=', '');
                }
                iframeWin.setExpr(val);
            }
        });
    });

    //映射列
    $('#d_af').unbind().bind("change", function () {
        let actualField = $(this).val();
        canvasEvent.Cell.setActualFieldName(actualField);
    })

    //实际显示列
    $('#d_sf').unbind().bind("change", function () {
        let showField = $(this).val();
        canvasEvent.Cell.setShowFieldName(showField);
    })

    //字段分页
    $('#fg').unbind().bind("change", function () {
        let checked = $(this).prop("checked"); //是否选中
        canvasEvent.Cell.setFieldPaging(checked);
    })

    //行后分页
    $('#far').unbind().bind("change", function () {
        let checked = $(this).prop("checked"); //是否选中
        canvasEvent.Cell.setPagingAfterRow(checked);
    })

    //每页补齐行
    $('#crfs').unbind().bind("change", function () {
        let checked = $(this).prop("checked"); //是否选中
        canvasEvent.Cell.setCompleteRowForEveryPage(checked);
    })

    //尾页补齐行
    $('#crfl').unbind().bind("change", function () {
        let checked = $(this).prop("checked"); //是否选中
        canvasEvent.Cell.setCompleteRowForLastPage(checked);
    })

    //是否图片
    $('#imageField').unbind().bind("change", function () {
        let checked = $(this).prop("checked"); //是否选中
        canvasEvent.Cell.setImageField(checked);
        if (checked) {
            canvasEvent.Cell.setImagePathStr('@{serverImages}');
            $('#imagePathStr').val('@{serverImages}');
            $('#imagePathStr').attr('disabled', false);
        }else{
            $('#imagePathStr').val('');
            $('#imagePathStr').attr('disabled', 'disabled');
        }
    })

    //图片地址
    $('#imagePathStr').unbind().bind("change", function () {
        let val = $(this).val();
        canvasEvent.Cell.setImagePathStr(val);
    })
    //是否分栏
    $('#multi').unbind().bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setSelCellExpandByIsMutliColumn(checked);
        if (checked) {
            $('#cf').attr('disabled', false);
            $('#num').attr('disabled', false);
        } else {
            $('#cf').attr('disabled', true);
            $('#num').attr('disabled', true);
        }
    })
    //先行后列
    $('#cf').unbind().bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setSelCellExpandByIsColumnFirst(checked);
    })
    //分栏数量
    $('#num').unbind().bind("change", function () {
        let val = $(this).val();
        canvasEvent.Cell.setSelCellExpandByColCount(val);
    })
    //开启折叠
    $('#zd').unbind().bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setRetractSubCellByRetractSubCell(checked);
    })
    //显示最后行
    $('#lasts').unbind().bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setRetractSubCellByShowLastSubCell(checked);
    })
    //强制允许编辑
    $('#lockCell').unbind().bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setSelCellForceAllowedEdit(checked);
    })
    //拆分并拷贝
    $('#demergeAndCopyCell').bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setSelCellDemergeAndCopyCell(checked);
    })
    //强制分组
    $('#listToGroup').bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setSelCellDataAttrListToGroup(checked);
    })

    //合并扩展单元格
    $('#mergeExpandCellStr').bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setMergeExpandCellStr(checked);
    })

    //强制分组
    $('#autoHiddenComment').bind("change", function () {
        let checked = $(this).prop("checked");
        canvasEvent.Cell.setSelCellCommentHide(checked);
    })

    /**
     * 高级开始
     * **/
    //扩展方向
    $('button[name="fx"]').click(function () {
        $('button[name="fx"]').each(function () {
            $(this).addClass('noChooseBtn');
            $(this).removeClass('chooseBtn');
        });
        $(this).removeClass('noChooseBtn').addClass('chooseBtn');
        canvasEvent.Cell.setExpandOri(parseInt($(this).attr('value')));
    });
    //左父格
    $('#zfg').unbind().bind('change', function () {
        canvasEvent.Cell.setLeftParentCellType(parseInt($(this).val()));
        if ($(this).val() == 2) { //自定义
            $('#zfgS').show();
        } else {
            $('#zfgS').hide();
        }
    })

    $("#zfgBtn").click(function () {
        canvasEvent.Cell.setLeftParentCellFrame();
    });

    $("#zfgA").unbind().bind('keyup' , function () {
        canvasEvent.Cell.setLeftParentCell($(this).val(), $("#zfg1").val());
    });

    $("#zfg1").unbind().bind('keyup' ,function () {
        canvasEvent.Cell.setLeftParentCell($("#zfgA").val(), $(this).val());
    });

    //上父格
    $('#sfg').unbind().bind('change', function () {
        canvasEvent.Cell.setTopParentCellType(parseInt($(this).val()));
        if ($(this).val() == 2) { //自定义
            $('#sfgS').show();
        } else {
            $('#sfgS').hide();
        }
    })
    //上父格单元格选择按钮
    $("#sfgBtn").click(function () {
        canvasEvent.Cell.setTopParentCellFrame();
    });

    $("#sfgA").unbind().bind('keyup' , function () {
        canvasEvent.Cell.setTopParentCell($(this).val(), $("#sfg1").val());
    });

    $("#sfg1").unbind().bind('keyup' , function () {
        canvasEvent.Cell.setTopParentCell($("#sfgA").val(), $(this).val());
    });




    //扩展方向
    $('button[name="fxg"]').click(function () {
        $('button[name="fxg"]').each(function () {
            $(this).addClass('noChooseBtn');
            $(this).removeClass('chooseBtn');
        });
        $(this).removeClass('noChooseBtn').addClass('chooseBtn');
        canvasEvent.Cell.setOrderType(parseInt($(this).attr('value')));
    });
    //横向扩展
    $('#hxkz').unbind().bind('change', function () {
        canvasEvent.Cell.setSelCellExtendH($(this).prop("checked") ? 1 : 0);
    })
    //纵向扩展
    $('#zxkz').unbind().bind('change', function () {
        canvasEvent.Cell.setSelCellExtendV($(this).prop("checked") ? 1 : 0);
    })
    //是否显示0值
    $('#showZero').unbind().bind('change', function () {
        canvasEvent.Cell.setSelCellShowZero($(this).prop("checked") ? 1 : 0);
    })
    //空值显示值
    $('#nullConvertValue').unbind().bind('change', function () {
        canvasEvent.Cell.setSelCellNullConvertStr($(this).val());
    })
    //隐藏单元格
    $('#hidec').unbind().bind('change', function () {
        canvasEvent.Cell.setSelCellHided($(this).prop("checked") ? 1 : 0);
    })

    /**
     * 样式开始
     * **/
    //水平对齐
    $("img[name='texthAlign']").click(function () {
        $("img[name='texthAlign']").each(function () {
            $(this).removeClass('choose');
        });
        $(this).addClass('choose');
        canvasEvent.Cell.setSelCellAlignH($(this).attr('val'));
        let val = $(this).attr('val');
        //工具栏对齐按钮
        $("img[type='align']").each(function () {
            if (val == $(this).attr('val')) {
                $(this).addClass('choose');
            } else {
                $(this).removeClass('choose');
            }
        });
    });
    //垂直对齐
    $("img[name='textvAlign']").click(function () {
        $("img[name='textvAlign']").each(function () {
            $(this).removeClass('choose');
        });
        $(this).addClass('choose');
        canvasEvent.Cell.setSelCellAlignV($(this).attr('val'));
    });

    //自适应
    $("img[name='adapt1']").click(function () {
        let isAdapt = canvasEvent.Cell.isSelCellAdaptTextHeight(); //是否自适应
        if (isAdapt) {
            $(this).removeClass('choose');
            $("img[name='adapt']").removeClass('choose');
            canvasEvent.Cell.setSelCellAdaptTextHeight(!isAdapt);
            //canvasEvent.Cell.setSelCellAdaptTextWidth(isAdapt);
        } else {
            $(this).addClass('choose');
            $("img[name='adaptColumn']").removeClass('choose');
            $("img[name='adapt']").addClass('choose');
            canvasEvent.Cell.setSelCellAdaptTextHeight(!isAdapt);
            canvasEvent.Cell.setSelCellAdaptTextWidth(isAdapt);
        }
    });

    //自适应
    $("img[name='adaptColumn']").click(function () {
        let isAdapt = canvasEvent.Cell.isSelCellAdaptTextWidth(); //是否自适应列宽
        if (isAdapt) {
            $(this).removeClass('choose');
            canvasEvent.Cell.setSelCellAdaptTextWidth(!isAdapt);
            //canvasEvent.Cell.setSelCellAdaptTextHeight(isAdapt);
        } else {
            $(this).addClass('choose');
            $("img[name='adapt']").removeClass('choose');
            $("img[name='adapt1']").removeClass('choose');
            canvasEvent.Cell.setSelCellAdaptTextWidth(!isAdapt);
            canvasEvent.Cell.setSelCellAdaptTextHeight(isAdapt);
        }
    });

    $("#lineSpacing").bind('change', function () { //行间距
        let val = $(this).val();
        let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(val) || val == 0) {
            canvasEvent.Cell.setSelCellLineSpacing(val);
        } else {
            $(this).val(0);
            canvasEvent.Cell.setSelCellLineSpacing(val);
        }

    });

    $("#letterSpacing").bind('change', function () { //字符间距
        let val = $(this).val();
        let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(val) || val == 0) {
            canvasEvent.Cell.setSelCellLetterSpacing(val);
        } else {
            $(this).val(0);
            canvasEvent.Cell.setSelCellLetterSpacing(0);
        }
    });

    $("#paragraphSpaceCount").bind('change', function () { //段落空格数
        let val = $(this).val();
        let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(val) || val == 0) {
            canvasEvent.Cell.setSelCellParagraphSpaceCount(val);
        } else {
            $(this).val(0);
            canvasEvent.Cell.setSelCellParagraphSpaceCount(0);
        }
    });

    $("#topMargin").bind('change', function () { //文本上边距
        let val = $(this).val();
        let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(val) || val == 0) {
            canvasEvent.Cell.setSelCellTopMargin(val);
        } else {
            $(this).val(0);
            canvasEvent.Cell.setSelCellTopMargin(0);
        }
    });

    $("#bottomMargin").bind('change', function () { //文本下边距
        let val = $(this).val();
        let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(val) || val == 0) {
            canvasEvent.Cell.setSelCellBottomMargin(val);
        } else {
            $(this).val(0);
            canvasEvent.Cell.setSelCellBottomMargin(0);
        }
    });

    $("#leftMargin").bind('change', function () { //文本左边距
        let val = $(this).val();
        let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(val) || val == 0) {
            canvasEvent.Cell.setSelCellLeftMargin(val);
        } else {
            $(this).val(0);
            canvasEvent.Cell.setSelCellLeftMargin(0);
        }
    });

    $("#rightMargin").bind('change', function () { //文本右边距
        let val = $(this).val();
        let reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(val) || val == 0) {
            canvasEvent.Cell.setSelCellRightMargin(val);
        } else {
            $(this).val(0);
            canvasEvent.Cell.setSelCellRightMargin(0);
        }
    });
    // 图片水平对齐
    $("img[name='imghAlign']").click(function () {
        $("img[name='imghAlign']").each(function () {
            $(this).removeClass('choose');
        });
        $(this).addClass('choose');
        canvasEvent.Cell.setSelCellImageAlignX($(this).attr('val'));
    });

    // 图片垂直对齐
    $("img[name='imgvAlign']").click(function () {
        $("img[name='imgvAlign']").each(function () {
            $(this).removeClass('choose');
        });
        $(this).addClass('choose');
        canvasEvent.Cell.setSelCellImageAlignY($(this).attr('val'));
    });
    //图片缩放
    $("#imgsf").change(function () {
        let val = $(this).prop('checked');
        canvasEvent.Cell.setSelCellAdaptImageSize(val);
        if (val) {
            //保持原比例
            $("#imgkeep").removeAttr('disabled');
            $('#tz2_tb').find('img').attr('disabled', true);
        } else {
            $('#tz2_tb').find('img').removeAttr('disabled');
            $("#imgkeep").attr('disabled', true);
        }
    });
    //保持原比例
    $("#imgkeep").change(function () {
        canvasEvent.Cell.setSelCellRawImageScale($(this).prop('checked'));
    });

    //边框样式
    $("#ckline").click(function () {
        let X = $(this).children(0).offset().top + 25;
        let Y = $(this).children(0).offset().left;
        $("#lines").css({"top": X, "left": Y}).show();
        $("#lines").focus();
        $("#lines").blur(function () {
            $(this).hide();
        });
    });

    //选择样式事件
    $("div[name='lineval']").click(function () {
        let val = $(this).attr('val'),
            url = 'images/design/line/l' + val + '.png';
        let img = $("#ckline").children(0).children(0);
        img.attr('src', url);
        img.attr('val', val);
        let img1 = $("#ckline1").children(0).children(0);
        img1.attr('src', url);
        img1.attr('val', val);
        $("#lines").hide();
    });

    $("#linecolor").spectrum(colorOpt);

    //设置边框
    $("div[name='borderAlign_d']").click(function () { //设置边框
        let val = $(this).children(0).attr('val'); //边框类型
        $("img[name='borders']").each(function () { //设置工具栏的边框样式
            if (val == $(this).attr('attr')) {
                $("img[name='border']").attr('src', $(this).attr('src'));
            }
        });

        let color = $("#lineColorText").text(); //当前选中的颜色
        //let widthType = $('#widthType').val(); //线框
        let widthType = $('input[name="xk"]:checked').val();
        ; //线宽
        let penStyle = $("#ckline").children(0).children(0).attr('val'); //
        if (val < 5) {
            if ($(this).hasClass('fx')) {
                $(this).removeClass('fx');
                canvasEvent.Cell.setSelCellLineStyleByPenStyle(val, 0);
            } else {
                $(this).addClass('fx');
                let t = canvasEvent.Cell.setSelCellLineStyle(val, penStyle, widthType, color);
            }
        } else {
            if ($(this).hasClass('fx')) {
                $(this).removeClass('fx');
            } else {
                $(this).addClass('fx');
            }
            if ($(this).hasClass('fx')) {
                canvasEvent.Cell.setSelCellLineStyle(val, penStyle, widthType, color);
                $("img[name='borderAlign']").each(function () {
                    if ($(this).attr('val') < 5) {
                        $(this).parent().addClass('fx');
                    }
                });
            } else {
                canvasEvent.Cell.setSelCellLineStyle(val, 0, widthType, color);
                if (val == 6) {
                    $("img[name='borderAlign']").each(function () {
                        if ($(this).attr('val') < 5) {
                            $(this).parent().removeClass('fx');
                            canvasEvent.Cell.setSelCellLineStyleByPenStyle($(this).attr('val'), 0);
                        }
                    });
                }
            }
        }
    });

    let dict = {};
    //控件信息事件
    $("select[name='control']").change(function () { //选择控件类型
        let type = $(this).val();
        $('table[id^="controlInfo"]').hide();
        let id = 'controlInfo' + type;
        $('#' + id).show();
        $('#' + id).find('input[type="text"]').val('');
        $('#' + id).find('input[type="checkbox"]').prop('checked', false);
        //设置单元格类型为图片
        if (11 == $(this).val()) {
            DesignModule._setSelCellsType(264);
        }
        canvasEvent.Cell.setControlInfo(''); //清空控件信息
        //canvasEvent.Cell.setSelCellText('');
        if (0 == $(this).val()) {

        } else if (6 == $(this).val()) { //初始化日期时间
            $('#showdate').prop('checked', false);
            $('#dateType').show();
            $('#dateType').val(0).prop('selected', true);
            $('#dateTimeType').hide();
            updateControl();
        } else {
            updateControl();
        }
    });
    $("input[id^='controlName']").keyup(function () {
        updateControl();
    });
    $("input[id^='allowNull']").change(function () {
        updateControl();
    });
    $("input[id^='tip']").keyup(function () {
        updateControl();
    });
    $("input[id^='defaultValue']").keyup(function () { //设置默认值时，填充单元格文本
        canvasEvent.Cell.setSelCellText($(this).val());
        updateControl();
    });
    $("input[id^='affectRow']").change(function () {
        updateControl();
    });
    $("#maxsize").keyup(function () {
        updateControl();
    });
    $("#minsize").keyup(function () {
        updateControl();
    });

    $("#allowDecimal").change(function () {
        updateControl();
    });
    $("#allowNegative").change(function () {
        updateControl();
    });
    $("#maxnum").change(function () {
        if (isNaN($(this).val())) {
            efalert(layer, "该控件只允许输入数字", 2);
            $(this).val('');
            return false;
        }
        updateControl();
    });
    $("#minnum").change(function () {
        if (isNaN($(this).val())) {
            efalert(layer, "该控件只允许输入数字", 2);
            $(this).val('');
            return false;
        }
        updateControl();
    });
    $("#autonum").keyup(function () {
        updateControl();
    });
    //$("#btntext").change(function(){updateControl();});
    $("#btntext").keyup(function () {
        updateControl();
    });

    $("#btntype").change(function () {
        updateControl();
    });
    $("#dyg1").change(function () {
        updateControl();
    });
    $("#dyg2").change(function () {
        updateControl();
    });

    $("#sdygBtn").click(function () {
        canvasEvent.Cell.setLeftParentCellFrame();
        canvasEvent.Cell.setLeftParentCellType(2);
    });

    $("#cktext").keyup(function () {
        updateControl();
    });
    $("#showdate").change(function () {
        if ($('#showdate').prop('checked')) {
            $('#dateTimeType').show();
            $('#dateType').hide();
        } else {
            $('#dateTimeType').hide();
            $('#dateType').show();
        }
        updateControl();
    });
    $("#dateType").change(function () {
        updateControl();
    });
    $("#dateTimeType").change(function () {
        updateControl();
    });
    //$("#filesize").change(function(){updateControl();});
    $("#filesize").keyup(function () {
        updateControl();
    });
    $("#addButJs").click(function () {
        let index = layer.open({
            type: 2,
            area: ['500px', '500px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['Javascript代码编辑器', 'height:30px;line-height:30px'],
            content: [base + '/design/scriptEdit.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
                MainEditor.setCurSpreadSheetEnabled(1);
            },
            yes: function (index, layero) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                let expr = iframeWin.getPage();
                $("#addButJs").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                MainEditor.setCurSpreadSheetEnabled(0);
                let iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setVal($("#addButJs").prev().val());
            }
        });
    });
    $("#filetype").change(function () {
        updateControl();
    });
    $("#showPic").change(function () {
        updateControl();
    });


    $("select[name='fmt']").change(function () {
        let val = $(this).val();
        canvasEvent.Cell.setSelCellsType(val);
        $("#fmt_val").empty();
        if (2 == val) {
            var enums = CellConstant.Number;
            console.log(enums);
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

        $('#fmt_val').children().eq(0).addClass('fmt_hover');
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


        /* setFmt(val);
         cellTypeEvent();
         //切换类型时给默认值
         if (val != 11) {
             $("#fmt_val li:eq(0)").addClass('fx');
             if (val == 10) {
                 CellAttrSetter.BarCodeCellAttr.setSelCellsBarCodeType(1);
             } else {
                 CellAttrSetter.ExtendAttr.setSelCellsStyle(0);
             }
         }*/
    });


    $("#expr_1").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_1").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_1").prev().val());
            }
        });
    });

    $("#expr_2").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_2").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_2").prev().val());
            }
        });
    });

    $("#expr_3").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_3").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_3").prev().val());
            }
        });
    });

    $("#expr_6").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_6").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_6").prev().val());
            }
        });
    });

    $("#expr_7").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_7").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_7").prev().val());
            }
        });
    });

    $("#expr_8").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_8").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_8").prev().val());
            }
        });
    });

    $("#expr_9").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_9").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_9").prev().val());
            }
        });
    });

    $("#expr_10").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_10").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_10").prev().val());
            }
        });
    });

    $("#expr_11").click(function () {
        var index = layer.open({
            type: 2,
            area: ['700px', '650px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['公式编辑', 'height:30px;line-height:30px'],
            content: ['pages/design/expr.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#expr_11").prev().val(expr);
                updateControl();
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.setExpr($("#expr_11").prev().val());
            }
        });
    });

    $("#init").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(1);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 1) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });

    $("#before").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑前事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(2);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 2) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#after").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑后事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(3);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r\}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 3) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });


    $("#relateCell").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: [ 'pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });

    $("#init_2").click(function () { //下拉框初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(5);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                //iframeWin.setExpr($("#expr").prev().val());
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 5) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });


    $("#after_2").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑后事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(6);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r\}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 6) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });


    $("#relateCell_2").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: ['pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });


    $("#init_3").click(function () { //多选下拉框初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(7);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 7) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });

    $("#after_3").click(function () { //多选下拉框修改函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(8);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 8) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });

    $("#relateCell_3").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: ['pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });
    $("#init_6").click(function () { //检查框初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(14);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 14) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#after_6").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑后事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(15);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r\}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 15) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#relateCell_6").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: [ 'pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });
    $("#init_7").click(function () { //检查框初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(12);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 12) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#after_7").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑后事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(13);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r\}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 13) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#relateCell_7").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: ['pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });
    $("#init_8").click(function () { //多选下拉框初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(9);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 9) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#before_8").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑前事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(10);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 10) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#after_8").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑后事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(11);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r\}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 11) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#relateCell_8").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: ['pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });
    $("#init_9").click(function () { //检查框初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(12);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 12) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#after_9").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑后事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(13);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r\}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 13) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#relateCell_9").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: ['pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });
    $("#init_10").click(function () { //检查框初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(16);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined || events.length == 0) { //无事件
                    iframeWin.setExpr('function(){\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 16) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#after_10").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['编辑后事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(17);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function(){\n\r\}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 17) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function(){\n\r}');
                        }
                    })
                }
            }
        });
    });
    $("#relateCell_10").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['关联单元格', 'height:30px;line-height:30px'],
            content: ['pages/design/relateCell.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.getPage();
                updateControl(result);
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var curCell = $('#dscol').val();
                var json = JSON.parse(controlInfo); //解析controlInfo
                var effectCellTexts = json.EffectCellTexts; //关联数据
                var lis = $('.dsi'); //所有的ds
                var dsMap = {};
                //遍历ds li
                $.each(lis, function (i, e) {
                    var className = $(e).attr('class');
                    var classArray = className.split("_");
                    var dsName = classArray[2]; //ds名
                    var columnsUl = $(e).children('ul'); //列名列表
                    var columnsLi = columnsUl.children('li'); //列名
                    var columns = [];
                    $.each(columnsLi, function (ii, ee) {
                        columns.push($(ee).attr('name'));
                    })
                    dsMap[dsName] = columns;
                });
                iframeWin.init(effectCellTexts, dsMap, curCell);
            }
        });
    });

    $("#click").click(function () { //初始化函数
        var index = layer.open({
            type: 2,
            area: ['800px', '600px'],
            closeBtn: 0,
            maxmin: true,
            resize: false,
            title: ['初始化事件', 'height:30px;line-height:30px'],
            content: ['pages/design/script.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.getExpr();
                $("#eventType").val(4);
                $("#eventCode").val(expr);
                updateControl();
                $("#eventType").val('');
                $("#eventCode").val('');
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo
                var json = JSON.parse(controlInfo); //解析controlInfo
                var events = json.Events; // 事件
                if (events == undefined) {
                    iframeWin.setExpr('function() {\n\r}');
                } else {
                    $.each(events, function (index, element) {
                        if (element.Type == 4) {
                            iframeWin.setExpr(element.Code);
                            return false;
                        } else {
                            iframeWin.setExpr('function() {\n\r}');
                        }
                    })
                }
            }
        });
    });


    $("button[name='dictPage']").click(function () {
        var index = layer.open({
            type: 2,
            area: ['600px', '500px'],
            closeBtn: 0,
            resize: false,
            title: ['数据字典', 'height:30px;line-height:30px'],
            content: ['pages/design/dict.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {},
            yes: function (index, layero) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var expr = iframeWin.save();
                var ctype = $("select[name='control']").val();
                if (!Util.isNull(expr)) {
                    var dsT = expr.ComboDSType;
                    var ctype = $("select[name='control']").val();
                    var con = getBaseControl(ctype);
                    var orgiInfo = JSON.parse(canvasEvent.Cell.getControlInfo()); //原始控件信息
                    con.ComboDSType = dsT;
                    if (dsT == 1) {
                        con.Events = orgiInfo.Events;
                        con.DSName = expr.DSName;
                        con.KeyFieldName = expr.KeyFieldName;
                        con.ShowFieldName = expr.ShowFieldName;
                        con.CustomComboTexts = [];
                    } else if (dsT == 2) {
                        con.Events = orgiInfo.Events;
                        con.DSName = '';
                        con.KeyFieldName = '';
                        con.ShowFieldName = '';
                        con.CustomComboTexts = expr.CustomComboTexts;
                    }
                    if (orgiInfo.EffectCellTexts != undefined) {
                        con.EffectCellTexts = orgiInfo.EffectCellTexts;
                    }
                    var t = canvasEvent.Cell.setControlInfo(JSON.stringify(con));
                    dict = con;
                } else {
                    var con = getBaseControl(ctype);
                    var orgiInfo = JSON.parse(canvasEvent.Cell.getControlInfo());
                    con.Events = orgiInfo.Events;
                    var t = canvasEvent.Cell.setSelCellControlInfo(JSON.stringify(con));
                    dict = con;
                }
                layer.close(index);
            },
            success: function (layero, index) {
                var iframeWin = window[layero.find('iframe')[0]['name']];
                //控件信息
                var ct = canvasEvent.Cell.getControlInfo();
                //当前模板的数据级
                let dataSourceArr = canvasEvent.Template.dataSourceArray();
                let dataSource = JSON.parse(dataSourceArr);
                let dsNameArr = [];
                $.each(dataSource , function(i,e){
                   dsNameArr.push(e.DSName);
                });
                //当前模板的索引值
                let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
                let controlInfo = JSON.parse(ct);
                //初始化数据集信息
                iframeWin.setDs(dsNameArr , templateIndex , controlInfo , dsMap);

            }
        });
    });




}

function changeLineColor(obj, hexColor, ct, color) {
    obj.css("background-color", hexColor);
    obj.children(0).val(hexColor);
}

//根据属性的变化更新控件信息
function updateControl(relateCell) {
    let ctype = $("select[name='control']").val(); //获取控件类型
    let con = getBaseControl(parseInt(ctype)); //获取基础属性
    let controlInfo = canvasEvent.Cell.getControlInfo(); //获取controlInfo

    if (controlInfo !== "") {
        let json = JSON.parse(controlInfo);
        let events = json.Events; //获取事件
        if (events == undefined) { //事件为空时，添加事件
            if ($('#eventType').val() != '') {
                let eventType = $('#eventType').val(); //事件类型
                let eventCode = $('#eventCode').val(); //事件代码
                eventType = parseInt(eventType);
                let Events = [];
                let event = {};
                event.Type = eventType;
                event.Code = eventCode;
                Events.push(event);
                con.Events = Events; //初始化事件属性
                //dict.Events = Events;
            }
        } else { //控件事件存在
            let eventType = $('#eventType').val(); //事件类型
            let eventCode = $('#eventCode').val(); //事件代码
            eventType = parseInt(eventType);
            $.each(events, function (index, element) { //遍历现有事件
                let type = element.Type; //事件类型
                if (type == eventType) {//已有事件
                    events.splice(index, 1); //删除当前对象
                    return false;
                }
            })
            if (eventCode != '') { //事件编码不为空
                let event = {};
                event.Type = eventType;
                event.Code = eventCode;
                events.push(event); //添加新事件
            }
            con.Events = events;
           //dict.Events = events;
            //遍历当前控件存在的事件
            if (ctype == 1) { //文本编辑框
                $.each(events, function (index, element) {
                    if (element.Type == 1) {//初始化事件
                        $('#init').css("border-color", "#009688");
                    } else if (element.Type == 2) {//编辑前
                        $('#before').css("border-color", "#009688");
                    } else if (element.Type == 3) {//编辑后
                        $('#after').css("border-color", "#009688");
                    }
                })
            } else if (ctype == 2) { //单选下拉

                $.each(events, function (index, element) {
                    if (element.Type == 5) {//初始化事件
                        $('#init_2').css("border-color", "#009688");
                    } else if (element.Type == 6) {//编辑后
                        $('#after_2').css("border-color", "#009688");
                    }
                })
            } else if (ctype == 3) { //单选下拉

                $.each(events, function (index, element) {
                    if (element.Type == 7) {//初始化事件
                        $('#init3').css("border-color", "#009688");
                    } else if (element.Type == 8) {//编辑后
                        $('#after3').css("border-color", "#009688");
                    }
                })
            } else if (ctype == 8) { //文本编辑框

                $.each(events, function (index, element) {
                    if (element.Type == 9) {//初始化事件
                        $('#init8').css("border-color", "#009688");
                    } else if (element.Type == 10) {//编辑前
                        $('#before8').css("border-color", "#009688");
                    } else if (element.Type == 11) {//编辑后
                        $('#after8').css("border-color", "#009688");
                    }
                })
            } else if (ctype == 9) {

                $.each(events, function (index, element) {
                    if (element.Type == 4) {//点击事件
                        $('#click').css("border-color", "#009688");
                    }
                })
            } else if (ctype == 7) { //单选下拉

                $.each(events, function (index, element) {
                    if (element.Type == 12) {//初始化事件
                        $('#init7').css("border-color", "#009688");
                    } else if (element.Type == 13) {//编辑后
                        $('#after7').css("border-color", "#009688");
                    }
                })
            } else if (ctype == 6) { //单选下拉
                $('#init6').css("border-color", "white");
                $('#after6').css("border-color", "white");
                $.each(events, function (index, element) {
                    if (element.Type == 14) {//初始化事件
                        $('#init6').css("border-color", "#009688");
                    } else if (element.Type == 15) {//编辑后
                        $('#after6').css("border-color", "#009688");
                    }
                })
            } else if (ctype == 10) {

                $.each(events, function (index, element) {
                    if (element.Type == 16) {//初始化事件
                        $('#init10').css("border-color", "#009688");
                    } else if (element.Type == 17) {//编辑后
                        $('#after10').css("border-color", "#009688");
                    }
                })
            }

        }
        //关联单元格信息
        if (relateCell != undefined) {
            if (relateCell.length == 0) {//无关联单元格信息
                delete relateCell['EffectCellTexts'];
            } else {
                con.EffectCellTexts = relateCell;
            }
        } else {
            if (json.EffectCellTexts != undefined) {
                con.EffectCellTexts = json.EffectCellTexts
            }
        }
    }


    if (1 == ctype) {
       // con.MaxLength = parseInt($("#maxsize").val());
       // con.MinLength = parseInt($("#minsize").val());
        con.MaxLength = $("#maxsize").val() == ""?-1:parseInt($("#maxsize").val());
        con.MinLength = $("#minsize").val() == ""?-1:parseInt($("#minsize").val());
    } else if (8 == ctype) {
        con.AllowDecimal = $('#allowDecimal').prop('checked');
        con.AllowNegative = $('#allowNegative').prop('checked');
        //con.MaxValue = parseInt($('#maxnum').val());
        con.MaxValue = $("#maxnum").val() == ""?-1:parseInt($("#maxnum").val());
        //con.MinValue = parseInt($('#minnum').val());
        con.MinValue = $("#minnum").val() == ""?-1:parseInt($("#minnum").val());
        //con.decimalPlace = parseInt($('#autonum').val());
        con.decimalPlace = $("#autonum").val() == ""?-1:parseInt($("#autonum").val());

    } else if (9 == ctype) {
        con.ButtonText = $('#btntext').val();
        con.ButtonType = parseInt($('#btntype').val());
        if (2 == $('#btntype').val()) {
            $('#btntype').parent().parent().next().next().hide();
            $("#addButJs").show();
            con.ButtonJS = $("#addButJs").prev().val();
        } else {
            $("#addButJs").hide();
            $('#btntype').parent().parent().next().next().show();
            con.FirstCellX = canvasEvent.Util.cellX2Int($('#dyg1').val());
            con.FirstCellY = parseInt($('#dyg2').val() == ''?0:$('#dyg2').val());
        }
    } else if (7 == ctype) {
        if(controlInfo != ''){
            let controlJson = JSON.parse(controlInfo);
            let dsType = controlJson.ComboDSType;
            if(dsType != undefined){
                if (dsType == 1) {
                    con.ComboDSType = dsType;
                    con.DSName = controlJson.DSName;
                    con.KeyFieldName = controlJson.KeyFieldName;
                    con.ShowFieldName = controlJson.ShowFieldName;
                    con.CustomComboTexts = [];
                } else if (dsType == 2) {
                    con.ComboDSType = dsType;
                    con.DSName = '';
                    con.KeyFieldName = '';
                    con.ShowFieldName = '';
                    con.CustomComboTexts = controlJson.CustomComboTexts;
                }
            }
        }

    } else if (6 == ctype) {
        con.HasTime = $('#showdate').prop('checked');
        if ($('#showdate').prop('checked')) { //显示时间
            con.DateType = parseInt($('#dateTimeType').val());
        } else {
            con.DateType = parseInt($('#dateType').val());
        }
    } else if (11 == ctype) {
        con.SizeLimit = $("#filesize").val() == ""?-1:parseInt($('#filesize').val());
        con.FileType = $('#filetype').val();
        con.ShowPic = $('#showPic').prop('checked');
    } else if (2 == ctype || 10 == ctype || 3 == ctype) {
        if(controlInfo != ''){
            let controlJson = JSON.parse(controlInfo);
            let dsType = controlJson.ComboDSType;
            if(dsType != undefined){
                if (dsType == 1) {
                    con.ComboDSType = dsType;
                    con.DSName = controlJson.DSName;
                    con.KeyFieldName = controlJson.KeyFieldName;
                    con.ShowFieldName = controlJson.ShowFieldName;
                    con.CustomComboTexts = [];
                } else if (dsType == 2) {
                    con.ComboDSType = dsType;
                    con.DSName = '';
                    con.KeyFieldName = '';
                    con.ShowFieldName = '';
                    con.CustomComboTexts = controlJson.CustomComboTexts;
                }
            }
        }
    }
    let str = JSON.stringify(con);
    canvasEvent.Cell.setControlInfo(str);
}

//获取基本属性
function getBaseControl(type) {
    let control = {};
    control.ControlName = $("#controlName_" + type).val();
    control.AllowNull = $("#allowNull_" + type).prop('checked');
    control.Hint = $("#tip_" + type).val();
    control.ControlShowExpr = $("#expr_" + type).prev().val();
    control.ControlType = parseInt(type);
    control.AffectRow = $("#affectRow_" + type).prop('checked');
    control.DefaultValue = $('#defaultValue_' + type).val();
    return control;
}


