/**
 * 处理所有设计器上的事件
 * **/
let SpreadsheetEvent = {
        showEvt: function () {
            DesignModule._setLogicalZoom(Design.getRatio());
        },
        /*
         悬浮元素鼠标按下事件
         Param:   1:int[out]鼠标坐标x
         2:int[out]鼠标坐标y
         3:int[out]左右键:1左键2右键*/
        mousePressEventOfShape: function (x, y, lor) {

        },
        /*
         悬浮元素鼠标弹起事件
         Param:   1:int[out]鼠标坐标x
         2:int[out]鼠标坐标y
         3:int[out]左右键:1左键2右键*/
        mouseRelaseEventOfShape: function (a, b, lor) {
            let flag = DesignModule._isSelectedShape(); //当前选中的是否是悬浮元素
            if (flag) {
                if (2 == lor) { //右键点击
                    let x = a,
                        y = b;
                    $("#shapeMenu").css({left: x, top: y}).show();
                    $('#formMenu').hide();
                    $("#shapeMenu").mouseover();
                    DesignModule._cancelShapeOperationState(); //取消焦点
                }
            }
            return;
        },
        //剪切板复制事件 DesignModule._copy() , DesignModule._cut() 时调用
        clipboardCopyEvt: function (str) {
            let newStr = decodeStrAndFree(str);
            $("#cp").val(newStr);
            $("#cp").select();
            copyContent = $('#cp').val();
            // DesignModule._clearSpreadFocus();
        },
        //剪切板粘贴事件
        clipboardPasteEvt: function () {
            $('#EFTextInput').focus();
        },
        focusInEvt: function () {
        },
        focusOutEvt: function () {
        },
        mousePressHyperlinkCell: function (nX, nY, nButton, x, y, pHyperlink) {
            let link = decodeStrAndFree(pHyperlink);
        },
        mouseMoveHyperlinkCell: function (nX, nY, nButton, x, y, pHyperlink) {
            let link = decodeStrAndFree(pHyperlink);
        },
        //设计器鼠标右键事件
        mouseReleaseEvt: function (a, b, c) {
            let sheetType = canvasEvent.Sheet.currSheetType(); //获取当前sheet类型 1:grid 2:form
            let isShape = canvasEvent.Shape.isSelectedShape(); //
            if (!isShape) { //点击的不是悬浮元素
                if (c == 2) {//鼠标右键事件
                    if (sheetType == 1) { //表单类型
                        if (isColClick) { //点击的列标签事件
                            $('#rightRowClickMenu').find('#rowHeight').show(); //显示行操作
                            $('#rightRowClickMenu').find('#rows').show();
                            $('#repeat').show();
                            $('#repeatLine').show();

                            $('#rightRowClickMenu').find('#lineWidth').hide(); //显示列操作
                            $('#rightRowClickMenu').find('#cells').hide();
                            isColClick = false;
                        } else {
                            if (isRowClick) { //点击的列标签事件

                                $('#rightRowClickMenu').find('#rowHeight').hide(); //显示行操作
                                $('#rightRowClickMenu').find('#rows').hide();
                                $('#repeat').hide();
                                $('#repeatLine').hide();

                                $('#rightRowClickMenu').find('#lineWidth').show(); //显示列操作
                                $('#rightRowClickMenu').find('#cells').show();
                                isRowClick = false;
                            } else {
                                $('#rightRowClickMenu').find('#rowHeight').show(); //显示行操作
                                $('#rightRowClickMenu').find('#rows').show();
                                $('#repeat').hide();
                                $('#repeatLine').hide();

                                $('#rightRowClickMenu').find('#lineWidth').show(); //显示列操作
                                $('#rightRowClickMenu').find('#cells').show();
                            }
                        }

                        var height = $("#rightRowClickMenu").height();
                        if (b + height > $('#canvas').height()) {
                            $("#rightRowClickMenu").css({left: a, top: b - height + 20}).show();
                        } else {
                            $("#rightRowClickMenu").css({left: a, top: b}).show();
                        }
                        //$("#rightRowClickMenu").css({left: a, top: b}).show();
                        $('#insertMenu').hide();
                        $("#rightRowClickMenu").mouseover();
                    } else if (sheetType == 4) { //form
                        $('#shapeMenu').hide();
                        $('#contextMenu6').hide();
                        $('#contextMenu7').hide();
                        $('#contextMenu8').hide();
                        $("#formMenu").css({left: a, top: b}).show();
                    }
                } else { //设计器上鼠标左键事件

                    let sheetType = canvasEvent.Sheet.currSheetType(); //获取当前sheet页类型
                    if (sheetType == 4) { //form  6 param
                        $('#borderDivs').hide();
                        let isShape = canvasEvent.Shape.isSelectedShape(); //是否是悬浮元素
                        if (isShape) { //点击的是悬浮元素
                            $('#shape').show();
                            $('#normal').hide();
                            $('#params').hide();
                            $('#shapeLi').show();
                            $('#cellLi').hide();
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
                        } else {

                        }
                        let selCell = canvasEvent.Cell.getSelCellRect(); //获取当前点击的单元格
                        let pos = decodeStrAndFree(canvasEvent.Cell.getSelBeginCell());//获取单元格位置信息
                        $("#EFTextInputDiv").css({ //在canvas上显示文本编辑框DIV
                            "display": "block",
                            "border": "0px solid #44B4FF",
                            //"top": selCell.top + 25, //25是设计器tab的高度
                            //"left": selCell.left,
                            "width": 0,
                            "height": 0,
                            "z-index": 10000
                        });
                        //设置文本输入框的大小
                        $("#EFTextInput").css({ //在canvas上显示文本编辑框DIV
                            "width": 0,
                            "height": 0,
                            "border": 0,
                            "z-index": 10000
                        });
                        $('#EFTextInput').focus();

                    } else if (sheetType == 6) { //params
                        $('#shape').hide();
                        $('#normal').hide();
                        $('#params').show();
                        let isLabel = canvasEvent.Param.isParamLabelShape(); //是否参数标签
                        if (isLabel) {
                            $('#paramLabel').show();
                            let label = canvasEvent.Param.selParamShapeLabel();
                            $('#paramText').val(label);
                        } else {
                            $('#paramLabel').hide();
                        }
                        let x = canvasEvent.Param.selParamShapeX();
                        let y = canvasEvent.Param.selParamShapeY();
                        let width = canvasEvent.Param.selParamShapeWidth();
                        let height = canvasEvent.Param.selParamShapeHeight();
                        let isVisible = canvasEvent.Param.isSelParamShapeVisible();

                        $('#paramX').val(x);
                        $('#paramY').val(y);
                        $('#paramWidth').val(width);
                        $('#paramHeight').val(height);
                        $('#isSelParamVisible').prop('checked', isVisible);

                    } else { //sheet
                        $('#shape').hide();
                        $('#normal').show();
                        $('#params').hide();
                        let isShape = canvasEvent.Shape.isSelectedShape(); //是否是悬浮元素
                        //单元格
                        if (!isShape) {
                            $('#shapeLi').hide();
                            $('#cellLi').show();
                            $('#borderDiv').hide();

                            let text = canvasEvent.Cell.getSelCellText(); //获取当前单元格文本
                            $('#EFTextInput').val(text); //设置文本值
                            $('#editArea').val(text); //设置编辑框值
                            let cellPos = canvasEvent.Util.getCellPos();
                            $('#cellPos').val(cellPos);

                            resetCellTool(); //重置单元格工具栏
                            initCellProp(); //重置右侧属性数据
                        }
                    }
                    hideAllMenus();
                }
            } else { //点击悬浮元素事件
                let sheetType = canvasEvent.Sheet.currSheetType(); //获取当前sheet页类型
                if (c == 1) { //左键
                    if (sheetType == 4) { //form
                        $('#borderDivs').hide();
                        $('#shape').show();
                        $('#normal').hide();
                        $('#params').hide();
                        $('#shapeLi').show();
                        $('#cellLi').hide();
                        $('#textInput').focus();
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


                    } else if (sheetType == 6) { //params
                        $('#shape').hide();
                        $('#normal').hide();
                        $('#params').show();
                        let isLabel = canvasEvent.Param.isParamLabelShape(); //是否参数标签
                        if (isLabel) {
                            $('#paramLabel').show();
                            let label = canvasEvent.Param.selParamShapeLabel();
                            $('#paramText').val(label);
                        } else {
                            $('#paramLabel').hide();
                        }
                        let x = canvasEvent.Param.selParamShapeX();
                        let y = canvasEvent.Param.selParamShapeY();
                        let width = canvasEvent.Param.selParamShapeWidth();
                        let height = canvasEvent.Param.selParamShapeHeight();
                        let isVisible = canvasEvent.Param.isSelParamShapeVisible();

                        $('#paramX').val(x);
                        $('#paramY').val(y);
                        $('#paramWidth').val(width);
                        $('#paramHeight').val(height);
                        $('#isSelParamVisible').prop('checked', isVisible);

                    } else { //sheet
                        $('#shape').hide();
                        $('#normal').show();
                        $('#params').hide();

                        //获取文本输入框焦点,用来处理键盘事件
                        $('#shape').show();
                        $('#normal').hide();
                        $('#textInput').focus();
                        $('#cellLi').hide();
                        $('#shapeLi').show();
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

                    }
                    hideAllMenus();
                } else { //右键

                }

            }
            //重新获取焦点，解决设计器行列Tag获取焦点的问题
            $('#EFTextInput').focus();
        },
        tabBarMousePressEvt: function (a, b, c) {
            if (c == 2) {
                let y = 25 + b,
                    x = a + $('.left').width();
                $("#sheetMenu").css({left: x, top: $(window).height() - $("#sheetMenu").height() - 25}).show();
                $("#sheetMenu").mouseover();
            }
        }
        ,
//单击模板标签事件，type 1 左键 2 右键
        tabBarClickedEvt: function (x, y, type) {
            if (type == 1) {
                let templateId = canvasEvent.Template.getCurrentTemplateID();
                curId = templateId;
            }
            let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
            if (production != 'true') {
                return;
            }
            //找到当前模板的树节点
            if (2 == type) { //右键事件
                let left = x;
                let top = 25;
                $(".rightmenu").css({left: left, top: top}).show();
                $(".rightmenu").mouseover();
            }
        }
        ,
//模板关闭,模板索引  whj
        removeSpreadSheetEvt: function (index) { //index是索引值
            let names = canvasEvent.Template.getAllSpreadSheetNames();
            names = JSON.parse(names);
            let isChange = canvasEvent.Template.isChanged();
            if (1 == isChange) {
                layer.confirm('是否保存模板?', {
                    btn: ['是', '否', '取消']
                }, function () {//是

                    let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
                    if (production != 'true') {
                        layer.msg('演示环境不允许保存');
                        return;
                    }

                    let result = checkUploadInfo(); //检查填报信息
                    //填报信息正确
                    if (result) {
                        //判断是否有重复的模板名
                        $.ajax({
                            url: ip + "/designSys/checkTempName?token=" + token + "&name=" + name + "&id=0",
                            type: 'get',
                            success: function (res) {
                                //没有重复的模板名
                                if (res.state == 'success') {
                                    //模板ID
                                    let templateId = 0;
                                    //获取模板索引
                                    let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
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
                                                            //刷新树结构
                                                            initTree();
                                                            //移除模板
                                                            canvasEvent.Template.removeSpreadSheet(templateIndex);
                                                            let pos;
                                                            $.each(templateMap, function (i, e) {
                                                                if (e.index == templateIndex) {
                                                                    pos = $.inArray(e, templateMap);
                                                                }
                                                            })
                                                            templateMap.splice(pos, 1)
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
                                    } else { //已有模板
                                        let templateName = canvasEvent.Template.getCurrentTemplateName(); //获取当前模板名称
                                        let templateContent = canvasEvent.Template.getCurTemplateContent(); //获取当前模板内容
                                        let templateId = canvasEvent.Template.getCurrentTemplateID();
                                        let blob = new Blob([templateContent], {type: 'application/json'});
                                        let formdata = new FormData();
                                        formdata.append('file', blob);
                                        formdata.append('fileName', templateName);
                                        formdata.append("id", templateId);

                                        $.ajax({
                                            url: ip + '/designSys/saveExistTemplate?token=' + token,
                                            type: 'post',
                                            processData: false,
                                            contentType: false,
                                            dataType: "json",
                                            data: formdata,
                                            success: function (data) {
                                                if (data.state == 'success') { //保存成功
                                                    //刷新树结构
                                                    initTree();
                                                    //移除模板
                                                    canvasEvent.Template.removeSpreadSheet(templateIndex);
                                                    let pos;
                                                    //遍历
                                                    $.each(templateMap, function (i, e) {
                                                        if (e.index == templateIndex) {
                                                            pos = $.inArray(e, templateMap);
                                                        }
                                                    })
                                                    templateMap.splice(pos, 1)
                                                    layer.closeAll();
                                                } else {
                                                    layer.alert("保存失败");
                                                }
                                            },
                                            error: function () {

                                            }
                                        });
                                    }
                                } else {
                                    layer.alert(res.message);
                                }
                            },
                            error: function () {
                            }
                        })
                    }

                }, function () {//不保存模板
                    let t = canvasEvent.Template.removeSpreadSheet(index); //根据索引值删除模板
                    let pos;
                    //遍历
                    $.each(templateMap, function (i, e) {
                        if (e.index == index) {
                            pos = $.inArray(e, templateMap);
                        }
                    })
                    templateMap.splice(pos, 1)
                    $('#EFTextInputDiv').hide(); //隐藏文本输入框
                    if (names.length == 1) { //最后一个模板关闭时，需要清空ds栏
                        $('.dsval').find('ul').empty();
                    }
                    layer.closeAll();
                }, function () {//取消
                });
            } else { //模板内容没有修改
                let t = canvasEvent.Template.removeSpreadSheet(index); //根据索引值删除模板
                let pos;
                //遍历
                $.each(templateMap, function (i, e) {
                    if (e.index == index) {
                        pos = $.inArray(e, templateMap);
                    }
                })
                templateMap.splice(pos, 1)
                //delete templateMap[index]; //清除模板Map中当前索引的内容
                //removeDs(index);
            }
        }
        ,
        /*** 鼠标双击事件
         *  x 鼠标横坐标 y 鼠标纵坐标 sheetIndex 当前sheet索引:0  单元格列值row 单元格行值
         */
        mouseDoubleClickedEvt: function (x, y, sheetIndex, column, row) { //whj
            let type = canvasEvent.Sheet.currSheetType(); //当前Sheet类型
            let flag = canvasEvent.Cell.isSelCellPluginInfo();//判断当前单元格是否是插件;
            let cell = canvasEvent.Cell.getSelCellRect(); //获取当前单元格
            let width = cell.width; //单元格宽度
            let height = cell.height; //单元格高度
            if (flag) {
                let pluginInfo = canvasEvent.Cell.getPluginInfo(); //获取插件属性
                let pluginType = canvasEvent.Cell.getPluginType(); //获取插件类型
                let pluginName = canvasEvent.Cell.getPluginName(); //获取插件名称
                let option = decodeStrAndFree(pluginInfo); //获取插件内容
                let name = canvasEvent.Template.getCurrentTemplateName(); //当前模板名
                let url = 'pages/plugins/' + pluginType + '.html';
                if (option == "") { //无插件内容
                    //获取插件默认配置
                    $.ajax({
                        url: ip + "/plugin/generateOption",
                        type: "post",
                        data: {"type": pluginType},
                        dataType: "json",
                        success: function (res) {
                            if (res.state == 'failed') {
                                layer.alert(res.message);
                            } else {
                                option = res.option;
                                layer.open({
                                    type: 2,
                                    area: ['820px', '600px'],
                                    fix: false, //不固定
                                    shadeClose: true,
                                    shade: 0.4,
                                    title: '插件_' + pluginName,
                                    content: url,
                                    btn: ['确定', '关闭'],
                                    btnAlign: 'c',
                                    end: function () {
                                    },
                                    success: function (layero, index) {
                                        let iframeWin = window[layero.find('iframe')[0]['name']];
                                        let options = $('select[name="fontfamily"]').find('option');
                                        let optionArr = [];
                                        $.each(options, function (i, e) {
                                            optionArr.push($(e).val());
                                        })
                                        let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
                                        let dataSourceArr = canvasEvent.Template.dataSourceArray();
                                        let dataSource = JSON.parse(dataSourceArr);
                                        let dsNameArr = [];
                                        $.each(dataSource, function (i, e) {
                                            dsNameArr.push(e.DSName);
                                        });
                                        iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, option, true);
                                    },
                                    yes: function (index, layero) {
                                        let iframeWin = window[layero.find('iframe')[0]['name']];
                                        let plugin = iframeWin.getOptions()
                                        layer.msg('生成插件中..', {
                                            icon: 16
                                            , shade: 0.01
                                        });
                                        let option;
                                        if ($.isEmptyObject(plugin.instance)) { //非Echarts控件
                                            option = plugin;
                                        } else {
                                            option = plugin.instance.getOption();
                                        }
                                        $.ajax({
                                            url: ip + "/plugin/generatePluginMixedPng?token=" + token,
                                            type: "post",
                                            dataType: "json",
                                            data: {
                                                "option": JSON.stringify(option),
                                                "width": width,
                                                "height": height,
                                                "realData": JSON.stringify(plugin.saveJson),
                                                "type": pluginType
                                            },
                                            success: function (res) {
                                                var state = res.state;
                                                if (state == "success") {
                                                    var base64 = res.imageCode; //获取图片base64编码
                                                    var option = res.option;
                                                    let isShape = canvasEvent.Shape.isSelectedShape(); //
                                                    if (!isShape) {//非悬浮元素
                                                        canvasEvent.Cell.setCellPluginDefaultImage(column, row, base64)
                                                        canvasEvent.Cell.setSelCellPluginInfo(option);
                                                        layer.closeAll();
                                                    } else {
                                                        canvasEvent.Shape.setSelShapePluginInfo(option, pluginType, base64);
                                                        layer.closeAll();
                                                    }

                                                } else {
                                                    layer.alert('生成插件失败!错误编码' + res.code);
                                                }

                                            },
                                            error: function () {

                                            }
                                        })


                                    }
                                });
                            }
                        },
                        error: function () {
                            layer.alert("初始化Echart模板出错!");
                        }

                    })
                } else { //存在插件内容
                    if (pluginType == 'CustomPlugin_Echarts') { //自定义插件类型
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
                                let iframeWin = window[layero.find('iframe')[0]['name']];
                                let info = canvasEvent.Cell.getPluginInfo(); //获取插件属性
                                let option = decodeStrAndFree(info); //获取插件内容
                                iframeWin.initPluginInfos(option);
                            }
                        });
                    } else if (pluginType == "Grid") { //分页表格控件
                        let ds = [];
                        let postUrl = ip + "/designSys/getConnInfo?token=" + token;
                        $.ajax({
                            url: postUrl,
                            type: "get",
                            timeout: 5000,
                            contentType: "application/json;charset=UTF-8",
                            success: function (data) {
                                if (data.state === "success") {
                                    let datasources = data.data;
                                    $.each(datasources, function (i, e) {
                                        ds.push(e.name);
                                    })
                                }

                                layer.open({
                                    type: 2,
                                    area: ['820px', '600px'],
                                    fix: false, //不固定
                                    shadeClose: true,
                                    shade: 0.4,
                                    title: '插件_' + pluginName,
                                    content: url,
                                    btn: ['确定', '关闭'],
                                    btnAlign: 'c',
                                    end: function () {
                                    },
                                    success: function (layero, index) {
                                        let iframeWin = window[layero.find('iframe')[0]['name']];
                                        let optionJson = JSON.parse(option);
                                        iframeWin.init(ds, optionJson);
                                    },
                                    yes: function (index, layero) {
                                        let iframeWin = window[layero.find('iframe')[0]['name']];
                                        let option = iframeWin.getOptions()
                                        layer.msg('生成插件中..', {
                                            icon: 16
                                            , shade: 0.01
                                        });
                                        let isShape = canvasEvent.Shape.isSelectedShape(); //
                                        if (!isShape) {//非悬浮元素
                                            canvasEvent.Cell.setSelCellPluginInfo(JSON.stringify(option));
                                            layer.closeAll();
                                        } else {
                                            canvasEvent.Shape.setSelShapePluginInfo(option, pluginType, pluginName, '');
                                            layer.closeAll();
                                        }
                                    }
                                });
                            },
                            complete: function (XMLHttpRequest, textStatus) {

                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {

                            }
                        });
                    } else {
                        layer.open({
                            type: 2,
                            area: ['820px', '600px'],
                            fix: false, //不固定
                            shadeClose: true,
                            shade: 0.4,
                            title: '插件_' + pluginName,
                            content: url,
                            btn: ['确定', '关闭'],
                            btnAlign: 'c',
                            end: function () {
                            },
                            success: function (layero, index) {
                                let options = $('select[name="fontfamily"]').find('option');
                                let optionArr = [];
                                $.each(options, function (i, e) {
                                    optionArr.push($(e).val());
                                })
                                let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
                                let dataSourceArr = canvasEvent.Template.dataSourceArray();
                                let dataSource = JSON.parse(dataSourceArr);
                                let dsNameArr = [];
                                $.each(dataSource, function (i, e) {
                                    dsNameArr.push(e.DSName);
                                });

                                let iframeWin = window[layero.find('iframe')[0]['name']];
                                let optionJson = JSON.parse(option);
                                if (optionJson.hasInit == undefined || optionJson.initTimes == undefined) { //第一次修改插件
                                    if (optionJson.initTimes == undefined) { //为了兼容旧版本的模板
                                        iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, JSON.stringify(optionJson), false);
                                    } else {
                                        iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, optionJson, true);
                                    }
                                } else {
                                    $.ajax({
                                        url: ip + "/plugin/getOption?token=" + token,
                                        type: "post",
                                        data: {"option": option, "type": pluginType},
                                        success: function (res) {
                                            var option = res;
                                            iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, option, false);
                                            //plugin.initTheme(json.theme);
                                        }
                                    })
                                }

                            },
                            yes: function (index, layero) {
                                let iframeWin = window[layero.find('iframe')[0]['name']];
                                let plugin = iframeWin.getOptions();
                                let option;
                                if ($.isEmptyObject(plugin.instance)) { //非Echarts控件
                                    option = plugin;
                                } else {
                                    option = plugin.instance.getOption();
                                }
                                layer.msg('生成插件中..', {
                                    icon: 16
                                    , shade: 0.01
                                });
                                $.ajax({
                                    url: ip + "/plugin/generatePluginMixedPng?token=" + token,
                                    type: "post",
                                    dataType: "json",
                                    data: {
                                        "option": JSON.stringify(option),
                                        "width": width,
                                        "height": height,
                                        "realData": JSON.stringify(plugin.saveJson),
                                        "type": pluginType
                                    },
                                    success: function (res) {
                                        var state = res.state;
                                        if (state == "success") {
                                            var base64 = res.imageCode; //获取图片base64编码
                                            var option = res.option;
                                            let isShape = canvasEvent.Shape.isSelectedShape(); //
                                            if (!isShape) {//非悬浮元素
                                                canvasEvent.Cell.setCellPluginDefaultImage(column, row, base64)
                                                canvasEvent.Cell.setSelCellPluginInfo(option);
                                                layer.closeAll();
                                            } else {
                                                canvasEvent.Shape.setSelShapePluginInfo(option, pluginType, pluginName, base64);
                                                layer.closeAll();
                                            }

                                        } else {
                                            layer.alert('生成插件失败!错误编码' + res.code);
                                        }

                                    },
                                    error: function () {

                                    }
                                })
                            }
                        });
                    }

                }
            } else { //不是插件
                //单元格是否允许编辑
                let isAllowEdit = canvasEvent.Cell.isAllowEditCurrCell();
                if (isAllowEdit) { //允许编辑
                    let selCell = canvasEvent.Cell.getSelCellRect(); //获取当前点击的单元格
                    let pos = decodeStrAndFree(canvasEvent.Cell.getSelBeginCell());//获取单元格位置信息
                    $("#EFTextInputDiv").attr('width', selCell.width); //设置文本编辑框宽度
                    $("#EFTextInputDiv").attr('height', selCell.height);//设置文本编辑框高度

                    $("#EFTextInputDiv").css({ //在canvas上显示文本编辑框DIV
                        "display": "block",
                        "border": "1px solid #44B4FF",
                        "top": selCell.top + 25, //25是设计器tab的高度
                        "left": selCell.left,
                        "width": selCell.width - 1,
                        "height": selCell.height - 1,
                        "z-index": 10000
                    }).show();
                    //设置文本输入框的大小
                    $("#EFTextInput").css({ //在canvas上显示文本编辑框DIV
                        "width": selCell.width - 1,
                        "height": selCell.height - 1,
                        "border": 0,
                        "z-index": 10000
                    }).show();

                    let text = canvasEvent.Cell.getSelCellText(); //获取当前单元格文本
                    /* $('#EFTextInput').val(text); //设置文本值*/
                    //获取编辑焦点
                    setTimeout(function () {
                        $("#EFTextInput").focus().val("").val(text); //光标跳到末尾
                    }, 50)

                }

            }

        }
        ,
        mousePressEvt: function (a, b, c) {  //canvas左键单击事件
            if (c == 1) {
                let sheetType = canvasEvent.Sheet.currSheetType(); //获取当前sheet页类型
                let selCell = canvasEvent.Cell.getSelCellRect(); //获取当前点击的单元格
                if (sheetType == 4) { //form  6 param
                    $("#EFTextInputDiv").css({ //在canvas上显示文本编辑框DIV
                        "display": "block",
                        "border": "0px solid #44B4FF",
                        /* "top": selCell.top + 25, //25是设计器tab的高度
                         "left": selCell.left,*/
                        "width": 0,
                        "height": 0,
                        "z-index": 10000
                    });
                    //设置文本输入框的大小
                    $("#EFTextInput").css({ //在canvas上显示文本编辑框DIV
                        "width": 0,
                        "height": 0,
                        "border": 0,
                        "z-index": 10000
                    });
                    $('#EFTextInput').focus();

                } else if (sheetType == 6) { //params
                    $('#shape').hide();
                    $('#normal').hide();
                    $('#params').show();
                    let isLabel = canvasEvent.Param.isParamLabelShape(); //是否参数标签
                    if (isLabel) {
                        $('#paramLabel').show();
                        let label = canvasEvent.Param.selParamShapeLabel();
                        $('#paramText').val(label);
                    } else {
                        $('#paramLabel').hide();
                    }
                    let x = canvasEvent.Param.selParamShapeX();
                    let y = canvasEvent.Param.selParamShapeY();
                    let width = canvasEvent.Param.selParamShapeWidth();
                    let height = canvasEvent.Param.selParamShapeHeight();
                    let isVisible = canvasEvent.Param.isSelParamShapeVisible();

                    $('#paramX').val(x);
                    $('#paramY').val(y);
                    $('#paramWidth').val(width);
                    $('#paramHeight').val(height);
                    $('#isSelParamVisible').prop('checked', isVisible);

                } else { //sheet
                    let isShape = canvasEvent.Shape.isSelectedShape(); //
                    //单元格
                    if (!isShape) {
                        $('#EFTextInputDiv').hide();
                        let selCell = canvasEvent.Cell.getSelCellRect(); //获取当前点击的单元格
                        let pos = decodeStrAndFree(canvasEvent.Cell.getSelBeginCell());//获取单元格位置信息
                        $("#EFTextInputDiv").css({ //在canvas上显示文本编辑框DIV
                            "display": "block",
                            "border": "0px solid #44B4FF",
                            /* "top": selCell.top + 25, //25是设计器tab的高度
                             "left": selCell.left,*/
                            "width": 0,
                            "height": 0,
                            "z-index": 10000
                        });
                        //设置文本输入框的大小
                        $("#EFTextInput").css({ //在canvas上显示文本编辑框DIV
                            "width": 0,
                            "height": 0,
                            "border": 0,
                            "z-index": 10000
                        });
                        $('#cp').blur();
                        //获取编辑焦点
                        setTimeout(function () {

                            $('#EFTextInput').focus();
                        }, 100)
                    } else { //点击的是悬浮元素
                        //获取文本输入框焦点,用来处理键盘事件
                        $('#EFTextInput').focus();
                    }
                }
            }
        }
        ,
        /*
         * 双击悬浮元素事件
         * */
        doubleClickedShapePlugin: function (x, y, sheetIndex, pluginName) {
            let pluginInfo = canvasEvent.Shape.getSelShapePluginInfo();//获取插件属性
            if (pluginInfo == 0) {
                DesignModule._cancelShapeOperationState(); //取消焦点
                return;
            }
            let size = canvasEvent.Shape.getSelShapeSize();
            let sizeJ = JSON.parse(size);
            let width = sizeJ.width;
            let height = sizeJ.height;

            let pluginType = canvasEvent.Shape.getSelShapePluginType(); //获取插件类型
            let pName = canvasEvent.Shape.getSelShapePluginName(); //获取插件名称


            let name = canvasEvent.Template.getCurrentTemplateName(); //当前模板名
            let url = 'pages/plugins/' + pluginType + '.html';
            if (pluginInfo == "") { //无插件内容
                //获取插件默认配置
                $.ajax({
                    url: ip + "/plugin/generateOption",
                    type: "post",
                    data: {"type": pluginType},
                    dataType: "json",
                    success: function (res) {
                        if (res.state == 'failed') {
                            layer.alert(res.message);
                        } else {
                            option = res.option;
                            layer.open({
                                type: 2,
                                area: ['820px', '600px'],
                                fix: false, //不固定
                                shadeClose: true,
                                shade: 0.4,
                                title: '插件_' + pName,
                                content: url,
                                btn: ['确定', '关闭'],
                                btnAlign: 'c',
                                end: function () {
                                },
                                success: function (layero, index) {
                                    let iframeWin = window[layero.find('iframe')[0]['name']];
                                    let options = $('select[name="fontfamily"]').find('option');
                                    let optionArr = [];
                                    $.each(options, function (i, e) {
                                        optionArr.push($(e).val());
                                    })
                                    let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
                                    let dataSourceArr = canvasEvent.Template.dataSourceArray();
                                    let dataSource = JSON.parse(dataSourceArr);
                                    let dsNameArr = [];
                                    $.each(dataSource, function (i, e) {
                                        dsNameArr.push(e.DSName);
                                    });
                                    iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, option, true);
                                },
                                yes: function (index, layero) {
                                    let iframeWin = window[layero.find('iframe')[0]['name']];
                                    let plugin = iframeWin.getOptions()
                                    layer.msg('生成插件中..', {
                                        icon: 16
                                        , shade: 0.01
                                    });
                                    let option;
                                    if ($.isEmptyObject(plugin.instance)) { //非Echarts控件
                                        option = plugin;
                                    } else {
                                        option = plugin.instance.getOption();
                                    }
                                    $.ajax({
                                        url: ip + "/plugin/generatePluginMixedPng?token=" + token,
                                        type: "post",
                                        dataType: "json",
                                        data: {
                                            "option": JSON.stringify(option),
                                            "width": width,
                                            "height": height,
                                            "realData": JSON.stringify(plugin.saveJson),
                                            "type": pluginType
                                        },
                                        success: function (res) {
                                            let state = res.state;
                                            if (state == "success") {
                                                let base64 = res.imageCode; //获取图片base64编码
                                                let option = res.option;
                                                let isShape = canvasEvent.Shape.isSelectedShape();
                                                if (!isShape) {//非悬浮元素
                                                    canvasEvent.Cell.setCellPluginDefaultImage(column, row, base64)
                                                    canvasEvent.Cell.setSelCellPluginInfo(option);
                                                    layer.closeAll();
                                                } else {
                                                    canvasEvent.Shape.setSelShapePluginInfo(option, pluginType, pName, base64);
                                                    layer.closeAll();
                                                }

                                            } else {
                                                layer.alert('生成插件失败!错误编码' + res.code);
                                            }

                                        },
                                        error: function () {

                                        }
                                    })


                                }
                            });
                        }
                    },
                    error: function () {
                        layer.alert("初始化Echart模板出错!");
                    }

                })
            } else { //存在插件内容
                if (pluginType == 'CustomPlugin_Echarts') { //自定义插件类型
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
                            let iframeWin = window[layero.find('iframe')[0]['name']];
                            let info = canvasEvent.Shape.getSelShapePluginInfo();//获取插件属性
                            iframeWin.initPluginInfos(info);
                        }
                    });
                } else if (pluginType == "Grid") { //分页表格控件
                    let ds = [];
                    let url = ip + "/designSys/getConnInfo?token=" + token;
                    $.ajax({
                        url: url,
                        type: "get",
                        timeout: 5000,
                        contentType: "application/json;charset=UTF-8",
                        success: function (data) {
                            if (data.state === "success") {
                                let datasources = data.data;
                                $.each(datasources, function (i, e) {
                                    ds.push(e.name);
                                })

                                layer.open({
                                    type: 2,
                                    area: ['820px', '600px'],
                                    fix: false, //不固定
                                    shadeClose: true,
                                    shade: 0.4,
                                    title: '插件_' + pName,
                                    content: 'pages/plugins/Grid.html',
                                    btn: ['确定', '关闭'],
                                    btnAlign: 'c',
                                    end: function () {
                                    },
                                    success: function (layero, index) {
                                        let iframeWin = window[layero.find('iframe')[0]['name']];
                                        let info = canvasEvent.Shape.getSelShapePluginInfo();//获取插件属性
                                        let optionJson = JSON.parse(info);
                                        iframeWin.init(ds, optionJson);
                                    },
                                    yes: function (index, layero) {
                                        let iframeWin = window[layero.find('iframe')[0]['name']];
                                        let option = iframeWin.getOptions();
                                        layer.msg('生成插件中..', {
                                            icon: 16
                                            , shade: 0.01
                                        });
                                        let isShape = canvasEvent.Shape.isSelectedShape(); //
                                        if (!isShape) {//非悬浮元素
                                            canvasEvent.Cell.setSelCellPluginInfo(JSON.stringify(option));
                                            layer.closeAll();
                                        } else {
                                            $.ajax({
                                                url: ip + "/plugin/generatePluginMixedPng?token=" + token,
                                                type: "post",
                                                dataType: "json",
                                                data: {
                                                    "option": JSON.stringify(option),
                                                    "width": width,
                                                    "height": height,
                                                    "type": pluginType
                                                },
                                                success: function (res) {
                                                    var state = res.state;
                                                    if (state == "success") {
                                                        var base64 = res.imageCode; //获取图片base64编码
                                                        var option = res.option;
                                                        canvasEvent.Shape.setSelShapePluginInfo(option, pluginType, pName, base64);
                                                        layer.closeAll();
                                                    } else {
                                                        layer.alert('生成插件失败!错误编码' + res.code);
                                                    }

                                                },
                                                error: function () {

                                                }
                                            })
                                            /* canvasEvent.Shape.setSelShapePluginInfo(JSON.stringify(option), pluginType, pName, '');
                                             layer.closeAll();*/
                                        }
                                    }
                                });
                            }

                        },
                        complete: function (XMLHttpRequest, textStatus) {

                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {

                        }
                    });
                } else {
                    layer.open({
                        type: 2,
                        area: ['820px', '600px'],
                        fix: false, //不固定
                        shadeClose: true,
                        shade: 0.4,
                        title: '插件_' + pName,
                        content: url,
                        btn: ['确定', '关闭'],
                        btnAlign: 'c',
                        end: function () {
                        },
                        success: function (layero, index) {
                            let options = $('select[name="fontfamily"]').find('option');
                            let optionArr = [];
                            $.each(options, function (i, e) {
                                optionArr.push($(e).val());
                            })
                            let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
                            let dataSourceArr = canvasEvent.Template.dataSourceArray();
                            let dataSource = JSON.parse(dataSourceArr);
                            let dsNameArr = [];
                            $.each(dataSource, function (i, e) {
                                dsNameArr.push(e.DSName);
                            });

                            let iframeWin = window[layero.find('iframe')[0]['name']];
                            let optionJson = JSON.parse(pluginInfo);
                            if (optionJson.hasInit == undefined) { //第一次修改插件
                                if (optionJson.initTimes == undefined) { //为了兼容旧版本的模板
                                    $.ajax({
                                        url: ip + "/plugin/getOption?token=" + token,
                                        type: "post",
                                        data: {"option": pluginInfo, "type": pluginType},
                                        success: function (res) {
                                            var option = res;
                                            iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, option, false);
                                            //plugin.initTheme(json.theme);
                                        }
                                    })
                                    //iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, JSON.stringify(optionJson) , false);
                                } else {
                                    iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, optionJson, true);
                                }
                            } else {
                                $.ajax({
                                    url: ip + "/plugin/getOption?token=" + token,
                                    type: "post",
                                    data: {"option": pluginInfo, "type": pluginType},
                                    success: function (res) {
                                        var option = res;
                                        iframeWin.init(ip, dsNameArr, templateIndex, optionArr, dsMap, option, false);
                                        //plugin.initTheme(json.theme);
                                    }
                                })
                            }

                        },
                        yes: function (index, layero) {
                            let iframeWin = window[layero.find('iframe')[0]['name']];
                            let plugin = iframeWin.getOptions()
                            layer.msg('生成插件中..', {
                                icon: 16
                                , shade: 0.01
                            });
                            let option;
                            if ($.isEmptyObject(plugin.instance)) { //非Echarts控件
                                option = plugin;
                            } else {
                                option = plugin.instance.getOption();
                            }
                            $.ajax({
                                url: ip + "/plugin/generatePluginMixedPng?token=" + token,
                                type: "post",
                                dataType: "json",
                                data: {
                                    "option": JSON.stringify(option),
                                    "width": width,
                                    "height": height,
                                    "realData": JSON.stringify(plugin.saveJson),
                                    "type": pluginType
                                },
                                success: function (res) {
                                    var state = res.state;
                                    if (state == "success") {
                                        var base64 = res.imageCode; //获取图片base64编码
                                        var option = res.option;
                                        let isShape = canvasEvent.Shape.isSelectedShape(); //
                                        if (!isShape) {//非悬浮元素
                                            canvasEvent.Cell.setCellPluginDefaultImage(column, row, base64)
                                            canvasEvent.Cell.setSelCellPluginInfo(option);
                                            layer.closeAll();
                                        } else {
                                            canvasEvent.Shape.setSelShapePluginInfo(option, pluginType, pName, base64);
                                            layer.closeAll();
                                        }

                                    } else {
                                        layer.alert('生成插件失败!错误编码' + res.code);
                                    }

                                },
                                error: function () {

                                }
                            })
                        }
                    });
                }


            }
            DesignModule._cancelShapeOperationState(); //取消焦点
        }
        ,
        /**
         * 鼠标点击事件
         */
        mouseClickEvt: function (x, y, sheetIndex, column, row, type) {

        }
        ,
// 点击行标签事件
        clickColTagEvt: function (type) {

            isColClick = true;

            $('#contextMenu1').find('#rowHeight').show(); //隐藏行操作
            $('#contextMenu1').find('#rows').show();
            $('#repeat').show();
            $('#repeatLine').show();

            $('#contextMenu1').find('#lineWidth').hide(); //隐藏行操作
            $('#contextMenu1').find('#cells').hide();
        }
        ,
        /**
         * 鼠标状态改变
         * type 鼠标改变类型
         */
        addSheetEvt: function (type) {
        }
        ,
        keyPressEvt: function (text, a, b) {

        }
        ,
        mouseMoveEvt: function () {

        }
        ,
        //模板标签切换事件，返回 改变后的 模板索引
        tableChangeEvt: function (index) {
            hideEditor();
            //设置当前选中模板
            curTemplateIndex = index;
            let sheetType = canvasEvent.Sheet.currSheetType(); //当前sheet类型
            if (sheetType == 4) { //form表单
                $('.sheet').hide(); //sheet工具栏隐藏
                $('.form').show(); //form工具栏显示
                $('#normal').hide(); //sheet属性栏隐藏
                $('#shape').show(); //shape属性栏显示
                $('#shape').find('input').val("");

                let flag = canvasEvent.Shape.isAdsorbShape(); //是否吸附
                if (flag) {
                    $('.form').find('img[name="adsorb"]').addClass('toptoolhover');
                } else {
                    $('.form').find('img[name="adsorb"]').removeClass('toptoolhover');
                }
                tabChange(index);
            } else {
                $('.sheet').show(); //sheet工具栏显示
                $('.form').hide(); //form工具栏隐藏
                $('#normal').show(); //sheet属性栏显示
                $('#shape').hide(); //shape属性栏隐藏
                tabChange(index);
            }

        }
        ,
        //切换sheet事件
        sheetChangedEvt: function () {
            hideEditor();
            let sheetType = canvasEvent.Sheet.currSheetType(); //sheet类型
            if (sheetType == 4) {//如果是Form
                $('.sheet').hide(); //表格工具栏隐藏
                $('.form').show(); //form工具栏显示
                $('#normal').hide();
                $('#params').hide();
                $('#shape').show();
                //是否吸附
                let flag = canvasEvent.Shape.isAdsorbShape();
                if (flag) {
                    $('#shape').find('img[name="adsorb"]').addClass('toptoolhover');
                } else {
                    $('#shape').find('img[name="adsorb"]').removeClass('toptoolhover');
                }
                initShapeProp();
            } else if (sheetType == 6) { //params
                $('#normal').hide();
                $('#shape').hide();
                $('#params').show();
            } else {
                $('.sheet').show(); //表格工具栏显示
                $('.form').hide(); //form工具栏隐藏
                $('#normal').show();
                $('#shape').hide();
                initCellProp()
            }
        }
        ,
        selFrameChangedEvt: function ($0, $1, $2, $3, $4, $5, $6, $7) {
            //initCellAttr();
        }
        ,
// 列标签点击
        clickRowTagEvt: function () {

            isRowClick = true;

            $('#contextMenu1').find('#rowHeight').hide(); //隐藏行操作
            $('#contextMenu1').find('#rows').hide();
            $('#repeat').hide();
            $('#repeatLine').hide();

            $('#contextMenu1').find('#lineWidth').show(); //隐藏行操作
            $('#contextMenu1').find('#cells').show();
        }
        ,
        /**
         *   *Description: 鼠标状态改变
         *  1: potSelectCell, arrow箭头
         *  2: potAdjustColumnWidth,改变列宽
         *  3: potAdjustRowHeight,改变行高
         *  4: potSelectColumns,选中列
         *  5: potSelectRows,选中行
         *  7: potMoveSelFrame,移动选中框 4
         *  8: potAdjustSelFrame,调整选中框
         */
        cursorChangedEvt: function (type) {
            // 获取宿主元素
            let host = document.getElementById('canvas');
            // 获取shadowRoot
            let shadow = host.shadowRoot;
            let canvas = shadow.querySelector('.qt-window-canvas-container');
            let dom = $(canvas).parent();
            if (1 == type) {
                dom.css("cursor", "url(images/design/cursor/shubiao3.png) 14 8,auto");
                //dom.css("cursor", "pointer");
            } else if (2 == type) {
                dom.css("cursor", "url(images/design/cursor/01.png) 16 16,auto");
            } else if (3 == type) {
                dom.css("cursor", "url(images/design/cursor/04.png) 16 16,auto");
            } else if (4 == type) {
                dom.css("cursor", "url(images/design/cursor/03.png) 16 16,auto");
            } else if (5 == type) {
                dom.css("cursor", "url('images/design/cursor/05.png') 18 18,auto");
            } else if (7 == type) {
                dom.css("cursor", "move");
            } else if (8 == type) {
                dom.css("cursor", "url('images/design/cursor/02.png') 16 16,auto");
            } else {
                dom.css("cursor", "default");
            }
        }
        ,
//Param:   1.int[out]滚动条类型0:水平,1:垂直 2.int[out]当前位置值 3.int[out]总值
        scrollBarEvt: function ($0, $1, $2) {
        }
        ,
        leftParentChangedEvt: function ($0, $1, $2, $3) { //左父格修改事件
            let t = $("#lay_expend").children('.layui-this').text();
            let char = canvasEvent.Util.int2CellX($2);
            if ('高级' == t) {
                $("#zfgA").val(char);
                $("#zfg1").val($3 == 0 ? '' : $3);
            } else if ('控件' == t) {
                $("#dyg1").val(char).trigger('change');
                $("#dyg2").val($3).trigger('change');
            }
        }
        ,
        topParentChangedEvt: function ($0, $1, $2, $3) {//上父格修改事件
            let char = canvasEvent.Util.int2CellX($2);
            $("#sfgA").val(char);
            $("#sfg1").val($3 == 0 ? '' : $3);
        }
        ,
        removeSheetEvt: function () {
        }
        ,
        /**
         *
         * nX,nY,nButton,sheetIndex,col,row);
         * Description: 文件控件点击事件
         * Param:   1:int[out]鼠标坐标x
         *             2:int[out]鼠标坐标y
         *             3:int[out]左右键:1左键2右键
         *             4:int[out]sheet页索引
         *             5.int[out]单元格列
         *             6.int[out]单元格行
         * Return:
         * Others:
         *
         * */
        fileUploadClicked: function ($0, $1, $2, $3, $4, $5) {

        }
        ,
        sheetMoved: function (from, to) {

        }
        ,
        mousePressTableRegion: function (info) {

        }

    }
;

function tabChange(index) {
    let templateId = canvasEvent.Template.getCurrentTemplateID();
    curId = templateId; //切换当前展示的模板ID
    /**
     * 点击模板树，打开新模板时，先执行tabChange事件，然后才加载模板内容
     * **/
    let dul = $(".dsval ul");
    dul.empty();

    let gul = $('.gsval ul');
    gul.empty();

    dsinfo = null;
    let ds = canvasEvent.Template.dataSourceArray(); //获取当前选中模板的数据集
    if (ds != '' && ds != '[]') {
        let data = JSON.parse(ds);
        initDs(data);
        initGDs(data);
        initCellProp(); //初始化单元格
    } else { //无数据集时，清空右侧工具栏数据集
        $('#cellds').empty();
        $('#dscol').empty();
        $('#dscol').attr('disabled', true);
        initCellProp(); //初始化单元格
    }

    return false;
}

function showEditor() {

}

function hideEditor() {
    $('#EFTextInputDiv').hide();
    /*$('#EFTextInput').hide();*/
}