let MenuEvent = {
    init: function () {
        $('#rightRowClickMenu a').mouseover(function (event) {
            var attr = $(this).children('img').attr('attr');
            var x = $('#rightRowClickMenu').offset().left + $('#rightRowClickMenu').width() + 4;
            var y = $(this).offset().top;
            if ('cell' == attr) {
                $("#insertMenu").css({left: x, top: y}).show(); //显示插入菜单
                $('#columnMenu').hide();
                $('#rowMenu').hide();
                $('#repeatMenu').hide();
            } else if ('cells' == attr) {
                $("#columnMenu").css({left: x, top: y}).show();
                if (!DesignModule._isSelectedAllColumns()) {
                    $("#columnMenu").children("li:eq(2)").show();
                } else {
                    $("#columnMenu").children("li:eq(2)").hide();
                }
                $('#insertMenu').hide();
                $('#rowMenu').hide();
                $('#repeatMenu').hide();
            } else if ('repeat' == attr) {
                $("#repeatMenu").css({left: x, top: y}).show();
                $('#insertMenu').hide();
                $('#columnMenu').hide();
                $('#rowMenu').hide();
            } else if ('rows' == attr) {
                $("#rowMenu").css({left: x, top: y}).show();
                if (!DesignModule._isSelectedAllRows()) {
                    $("#rowMenu").children("li:eq(2)").show();
                } else {
                    $("#rowMenu").children("li:eq(2)").hide();
                }
                $('#insertMenu').hide();
                $('#columnMenu').hide();
                $('#repeatMenu').hide();
            } else {
                $('#rowMenu').hide();
                $('#insertMenu').hide();
                $('#columnMenu').hide();
                $('#repeatMenu').hide();
            }
        });
        /**
         * sheet 工具栏事件
         * */
        $('#sheetMenu a').click(function (event) {
            var attr = $(this).children('img').attr('attr');
            if ('delSh' == attr) {
                $('#mask').trigger("click");
                DesignModule._removeCurrentSheet();
                $('#sheetMenu').hide();
            } else if ('setNameSh' == attr) { //修改sheet名称
                $('#sheetMenu').hide();
                var index = layer.open({
                    type: 2,
                    area: ['350px', '180px'],
                    closeBtn: 0,
                    resize: false,
                    title: ['sheet名称', 'height:30px;line-height:30px'],
                    content: ['pages/menus/sheetName.html', 'no'],
                    btn: ['确定', '关闭'],
                    btnAlign: 'c',
                    end: function () {
                        $('#mask').trigger("click");
                    },
                    yes: function (index, layero) {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        var res = iframeWin.getPage();
                        if (!Util.isNull(res.newVal)) {
                            if (res.oldVal != res.newVal) {
                                var t = canvasEvent.Sheet.setCurrentSheetName(res.newVal);
                                if (t == -2) {
                                    layer.alert('名称已经存在');
                                } else {
                                    layer.close(index);
                                }
                            } else {
                                layer.close(index);
                            }
                        } else {
                            layer.alert('请输入sheet名称');
                        }
                    },
                    success: function (layero, index) {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.setVal(canvasEvent.Sheet.getCurrentSheetName() , index);
                    }
                });
            } else if ('addSh' == attr) {
                $('#mask').trigger("click");
                DesignModule._appendSheet();
                $('#sheetMenu').hide();
            } else if ('copySheet' == attr) {
                $('#sheetMenu').hide();
                var index = layer.open({
                    type: 2,
                    area: ['350px', '180px'],
                    closeBtn: 0,
                    resize: false,
                    title: ['sheet名称', 'height:30px;line-height:30px'],
                    content: ['pages/menus/sheetName.html', 'no'],
                    btn: ['确定', '关闭'],
                    btnAlign: 'c',
                    end: function () {
                        $('#mask').trigger("click");
                    },
                    yes: function (index, layero) {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        var name = iframeWin.getPage();
                        if (!Util.isNull(name.newVal)) {
                            //拷贝当前sheet
                            var t = DesignModule._cloneSheetByName(encodeStr(name.newVal));
                            if (t == -2) {
                                layer.alert('拷贝失败,sheet名已存在');
                            }
                            layer.close(index);
                        } else {
                            layer.alert('请输入sheet名称');
                        }
                    },
                    success: function (layero, index) {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.setVal(decodeStrAndFree(DesignModule._getCurrentSheetName()));
                    }
                });

            }
        });

        //单元格右键插入菜单
        $('#insertMenu a').click(function (event) {
            var attr = $(this).children('img').attr('attr');
            if ('addExp' == attr) { //插入公式
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
                        if (expr.indexOf('=') != 0) {
                            expr = "=" + expr;
                        }
                        canvasEvent.Cell.setSelCellText(expr);
                        layer.close(index);
                    },
                    success: function (layero, index) {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        var val = canvasEvent.Cell.getSelCellText();
                        var valArr = val.split('');
                        if (valArr[0] == '=') {
                            val = val.replace('=', '');
                        }
                        iframeWin.setExpr(val);
                    }
                });
            } else if ('addImg' == attr) {
                insertImage();
            } else if ('cancelImg' == attr) {
                canvasEvent.Cell.removeSelCellBkPic();
            }  else if ('condition' == attr) {
                conditionProps()
            }  else if ('arealink' == attr) {
                areaLink();
            }  else if ('hyperlink' == attr) {
                hyperLink()
            }else if ('addObl' == attr) {
                addOblC();
            } else if ('setTable' == attr) {
                setTableRegion();
            } else if ('cancelTable' == attr) {
                removeTableRegion();
            } else if ('addChar' == attr){
                addChart();
            } else if("subsheet" == attr){
                subSheet();
            } else if('editComment' == attr){
                let index = layer.open({
                    type: 2,
                    area: ['400px', '300px'],
                    closeBtn: 0,
                    resize: false,
                    title: ['单元格注释', 'height:30px;line-height:30px'],
                    content: ['pages/design/comment.html', 'no'],
                    btn: ['确定', '关闭'],
                    btnAlign: 'c',
                    end: function () {

                    },
                    yes: function (index, layero) {
                        let iframeWin = window[layero.find('iframe')[0]['name']];
                        let expr = iframeWin.getExpr();
                        canvasEvent.Cell.setSelCellComment(expr) //设置单元格注释;
                        layer.close(index);
                    },
                    success: function (layero, index) {
                        let iframeWin = window[layero.find('iframe')[0]['name']];
                        let val = canvasEvent.Cell.getSelCellComment(); //获取单元格注释
                        iframeWin.setExpr(val);
                    }
                });
            } else if('delComment' == attr){
                canvasEvent.Cell.setSelCellComment('');
            } else if('autoHidden' == attr){
                let autoHidden = canvasEvent.Cell.getSelCellCommentHide();
                canvasEvent.Cell.setSelCellCommentHide(!autoHidden);
            }
            hideAllMenus();
        });

        $('#shapeMenu a').click(function (event) {
            //$('#mask').trigger("click");
            var attr = $(this).children('img').attr('attr');
            if ('addExp' == attr) {
                $("img[name='addExp']").trigger('click');
            } else if ('addChar' == attr) {
                $("img[name='addChar']").trigger('click');
            } else if ('addImg' == attr) {
                $("img[name='addImg']").trigger('click');
            } else if ('addObl' == attr) {
                $("img[name='addObl']").trigger('click');
            } else if ('deleteShape' == attr) {
                //删除悬浮元素
                canvasEvent.Shape.removeSelShapePlugin();
                $('#shapeMenu').hide();//隐藏菜单
            } else if ('copyShape' == attr) { //复制
                DesignModule._copy();
                $('#shapeMenu').hide();//隐藏菜单
            } else if ('sToTop' == attr) {
                canvasEvent.Shape.setTop();
                $('#shapeMenu').hide();//隐藏菜单
            } else if ('sToBottom' == attr) {
                canvasEvent.Shape.setBottom();
                $('#shapeMenu').hide();//隐藏菜单
            }

            $('#select[name="sfontfamily"]').show();

        });

        $('#shapeMenu a').mouseover(function (event) {
            var attr = $(this).children('img').attr('attr');
            var x = $('#shapeMenu').position().left + $('#shapeMenu').width() + 4;
            var y = $('#shapeMenu').position().top;
            if ('plugin' == attr) {
                $("#contextMenu6").css({left: x, top: y}).show();
                $('#contextMenu7').hide();
                $('#contextMenu8').hide();
            } else if ('picture' == attr) {
                $("#contextMenu7").css({left: x, top: y + 26}).show();
                $('#contextMenu6').hide();
                $('#contextMenu8').hide();
            } else if ('sheet' == attr) {
                $("#contextMenu8").css({left: x, top: y + 52}).show();
                $('#contextMenu6').hide();
                $('#contextMenu7').hide();
            } else if ('deleteShape' == attr) {
                $('#contextMenu6').hide();
                $('#contextMenu7').hide();
                $('#contextMenu8').hide();
            }
        });

        //悬浮元素右键->插件->插入插件
        $('#contextMenu6 a').click(function (event) {
            $('#mask').trigger("click");
            let attr = $(this).children('img').attr('attr');
            if ('addPlugin' == attr) {
                addChart();
                hideAllMenus();
            } else if ('cancelPlugin' == attr) {
                DesignModule._setSelShapePluginInfo(encodeStr(''), encodeStr(''), encodeStr(''));
                hideAllMenus();
            }
        });

        //悬浮元素右键->图片->插入图片/取消图片
        $('#contextMenu7 a').click(function (event) {
            var attr = $(this).children('img').attr('attr');
            if ('addPicture' == attr) {
                $('#shapeMenu').hide();
                $('#contextMenu6').hide();
                $('#contextMenu7').hide();
            } else if ('cancelPicture' == attr) {
                DesignModule._removeSelShapeBKPic();
                $('#shapeMenu').hide();
                $('#contextMenu6').hide();
                $('#contextMenu7').hide();
            }
        });
        //悬浮元素右键->子表单->插入子表单/取消子表单
        $('#contextMenu8 a').click(function (event) {
            $('#mask').trigger("click");
            let attr = $(this).children('img').attr('attr');
            if ('addSheet' == attr) {
                $('#shapeMenu').hide();
                $('#contextMenu6').hide();
                $('#contextMenu7').hide();
                $('#contextMenu8').hide();
                let index = layer.open({
                    type: 2,
                    area: ['550px', '550px'],
                    closeBtn: 0,
                    maxmin: true,
                    resize: false,
                    title: ['关联子表单', 'height:30px;line-height:30px'],
                    content: 'pages/menus/shapeSub.html',
                    btn: ['确定', '关闭'],
                    btnAlign: 'c',
                    end: function () {

                    },
                    yes: function (index, layero) {
                        let iframeWin = window[layero.find('iframe')[0]['name']];
                        let page = iframeWin.getPage();
                        if (page.subReportSheetNames == '') {
                            layer.alert("未选择子表单");
                        } else {
                            canvasEvent.Shape.setFormSubReportSheet(JSON.stringify(page));
                            layer.close(index);
                        }
                    },
                    success: function (layero, index) {
                        let iframeWin = window[layero.find('iframe')[0]['name']];
                        //获取可用的子表单
                        let json = canvasEvent.Shape.formSubReportSheet();
                        iframeWin.init(json);
                    }
                });
            } else if ('cancelSheet' == attr) {
                canvasEvent.Shape.removeSelShapeSheetName();
                $('#shapeMenu').hide();
                $('#contextMenu6').hide();
                $('#contextMenu7').hide();
                $('#contextMenu8').hide();
            }
        });

        $('#formMenu a').click(function (event) {
            $('#mask').trigger("click");
            DesignModule._cancelShapeOperationState(); //取消焦点
            let attr = $(this).children('img').attr('attr');
            if ('addShape' == attr) {
                $('#formMenu').hide();
                //添加悬浮元素
                addShape();
            } else if ('pasteShape' == attr) {
                $('#formMenu').hide();
                mainPaste();
            }
        });


        //数据集右击事件
        $('.dsval').mousedown(function (e) {
            let target = $(e.target); //点击的目标
            if (e.which == 3) {
                let targetClass = target.attr('class');
                if(targetClass == 'ico_check'){
                    //复制数据集数据
                    dsData = target.parent().data('ds');
                    dsCName = dsData.DSName;
                    $("#dsCopyMenu").css({position: 'absolute', left: e.clientX, top: e.clientY}).show();
                    $("#boMenu").mouseover();
                }else{
                    $("#dsMenu").css({position: 'absolute', left: e.clientX, top: e.clientY}).show();
                    $("#boMenu").mouseover();
                }
            } else {
                $("#dsMenu").hide();
                $("#dsCopyMenu").hide();
            }
        })

        //数据集右击事件
        $('.treeArea').mousedown(function (e) {
            if (e.which == 3) {
                $("#treeMenu").css({position: 'absolute', left: e.clientX, top: e.clientY}).show();
            } else {
                $("#treeMenu").hide();
            }
        })

    },
    tabBarRightMenu: {
        //关闭所有模板
        closeAll: function () {
            let curTemp;
            let index = layer.open({
                type: 2,
                area: ['500px', '500px'],
                closeBtn: 0,
                maxmin: true,
                title: ['选择要保存的模板', 'height:30px;line-height:30px'],
                content: ['pages/menus/tempName.html', 'no'],
                btn: ['全选', '确定', '关闭'],
                resize: false,
                btnAlign: 'c',
                end: function () {
                },
                success: function (layero, index) {
                    let sheetNames = canvasEvent.Template.getAllSpreadSheetNames(); //获取设计器上的所有模板名
                    let sheetNameJson = JSON.parse(sheetNames);
                    let others = [];
                    $.each(sheetNameJson, function (ind, element) {
                        let index = element.index;
                        //判断权限
                        let tempName = element.name; //模板名
                        others.push(element);
                    });
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(others);
                },
                yes: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    let text = $('.layui-layer-btn0').text();
                    if (text == '全选') {
                        iframeWin.chooseAll(1);
                        $('.layui-layer-btn0').text('全不选');
                    } else {
                        iframeWin.chooseAll(0);
                        $('.layui-layer-btn0').text('全选');
                    }
                    return false;
                },
                btn2: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    let temps = iframeWin.getTemps(); //获取所有模板的INDEX
                    if (temps.length != 0) {//选中需要保存的模板
                        //遍历所有需要被保存的模板
                        $.each(temps, function (ind, ele) {
                            let index = ele.index; //获取模板的索引
                            let t = canvasEvent.Template.removeSpreadSheet(index); //关闭当前模板
                            let text = decodeStrAndFree(t);
                            let obj = JSON.parse(text);
                            //TempOperator.save(obj.file, 0, ele);

                            let templateName = obj.name; //获取当前模板名称
                            let templateContent = obj.file; //获取当前模板内容
                            let templateId = canvasEvent.Template.getTemplateIdByIndex(index); //获取当前模板的ID
                            if (templateId != 0) { //非新增模板
                                let blob = new Blob([templateContent], {type: 'application/json'});
                                let formdata = new FormData();
                                formdata.append('file', blob);
                                formdata.append('id', templateId);
                                formdata.append('fileName', templateName);
                                let pos;
                                //遍历删除templateMap中的对象
                                $.each(templateMap, function (i, e) {
                                    if (e.templateId == templateId) {
                                        pos = $.inArray(e, templateMap);
                                    }
                                })
                                templateMap.splice(pos, 1);
                                //保存模板
                                $.ajax({
                                    url: ip + '/designSys/saveExistTemplate?token=' + token,
                                    type: 'post',
                                    processData: false,
                                    contentType: false,
                                    dataType: "json",
                                    data: formdata,
                                    success: function (data) {
                                        if (data.state == 'success') { //保存成功

                                        } else {

                                        }
                                    },
                                    error: function () {

                                    }
                                });

                            }
                        });
                    }
                    //获取剩下不需要保存的模板
                    let others = canvasEvent.Template.getAllSpreadSheetNames(); //获取设计器上的所有模板名
                    let otherss = JSON.parse(others);
                    $.each(otherss, function (ind, ele) {
                        let inde = ele.index;
                        if (inde != curTemp) {
                            canvasEvent.Template.removeSpreadSheet(inde); //关闭当前模板
                            let pos;
                            //遍历删除templateMap中的对象
                            $.each(templateMap, function (i, e) {
                                if (e.index == inde) {
                                    pos = $.inArray(e, templateMap);
                                }
                            })
                            templateMap.splice(pos, 1);
                        }
                    });
                    layer.close(index);
                    hideAllMenus();
                }
            });
        },
        //关闭其他模板
        closeOthers: function () {
            let curTemp;
            let index = layer.open({
                type: 2,
                area: ['500px', '500px'],
                closeBtn: 0,
                maxmin: true,
                title: ['选择要保存的模板', 'height:30px;line-height:30px'],
                content: ['pages/menus/tempName.html', 'no'],
                btn: ['全选', '确定', '关闭'],
                resize: false,
                btnAlign: 'c',
                end: function () {
                },
                success: function (layero, index) {
                    let sheetNames = canvasEvent.Template.getAllSpreadSheetNames(); //获取设计器上的所有模板名
                    let sheetNameJson = JSON.parse(sheetNames);
                    curTemp = canvasEvent.Template.getCurrentSpreadSheetIndex(); //获取当前打开模板的索引
                    let others = [];

                    $.each(sheetNameJson, function (ind, element) {
                        let index = element.index;
                        if (index != curTemp) { //非当前模板
                            //判断权限
                            let tempName = element.name; //模板名
                            others.push(element);
                        }
                    });
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(others);
                },
                yes: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    let text = $('.layui-layer-btn0').text();
                    if (text == '全选') {
                        iframeWin.chooseAll(1);
                        $('.layui-layer-btn0').text('全不选');
                    } else {
                        iframeWin.chooseAll(0);
                        $('.layui-layer-btn0').text('全选');
                    }
                    return false;
                },
                btn2: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    let temps = iframeWin.getTemps(); //获取所有模板的INDEX
                    if (temps.length != 0) {//选中需要保存的模板
                        //遍历所有需要被保存的模板
                        $.each(temps, function (ind, ele) {
                            let index = ele.index; //获取模板的索引
                            let t = canvasEvent.Template.removeSpreadSheet(index); //关闭当前模板
                            let text = decodeStrAndFree(t);
                            let obj = JSON.parse(text);
                            //TempOperator.save(obj.file, 0, ele);

                            let templateName = obj.name; //获取当前模板名称
                            let templateContent = obj.file; //获取当前模板内容
                            let templateId = canvasEvent.Template.getTemplateIdByIndex(index); //获取当前模板的ID
                            if (templateId != 0) { //非新增模板
                                let blob = new Blob([templateContent], {type: 'application/json'});
                                let formdata = new FormData();
                                formdata.append('file', blob);
                                formdata.append('id', templateId);
                                formdata.append('fileName', templateName);

                                let pos;
                                //遍历删除templateMap中的对象
                                $.each(templateMap, function (i, e) {
                                    if (e.templateId == templateId) {
                                        pos = $.inArray(e, templateMap);
                                    }
                                })
                                templateMap.splice(pos, 1)

                                //保存模板
                                $.ajax({
                                    url: ip + '/designSys/saveExistTemplate?token=' + token,
                                    type: 'post',
                                    processData: false,
                                    contentType: false,
                                    dataType: "json",
                                    data: formdata,
                                    success: function (data) {
                                        if (data.state == 'success') { //保存成功

                                        } else {

                                        }
                                    },
                                    error: function () {

                                    }
                                });

                            }
                        });
                    }
                    //获取剩下不需要保存的模板
                    let sheetInfo = canvasEvent.Template.getAllSpreadSheetNames(); //获取设计器上的所有模板名
                    let sheetInfos = JSON.parse(sheetInfo);
                    $.each(sheetInfos, function (ind, ele) {
                        let inde = ele.index;
                        if (inde != curTemp) {
                            canvasEvent.Template.removeSpreadSheet(inde); //关闭当前模板
                            let pos;
                            //遍历删除templateMap中的对象
                            $.each(templateMap, function (i, e) {
                                if (e.index == inde) {
                                    pos = $.inArray(e, templateMap);
                                }
                            })
                            templateMap.splice(pos, 1);
                        }
                    });
                    layer.close(index);
                    hideAllMenus();
                }
            });
        },
        //重命名模板
        rename: function () {

            let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
            if(production != 'true'){
                layer.msg('演示环境不允许重命名');
                return;
            }

            $('.rightmenu').hide();
            var index = layer.open({
                type: 2,
                area: ['350px', '180px'],
                closeBtn: 0,
                resize: false,
                title: ['重命名', 'height:30px;line-height:30px'],
                content: ['pages/menus/rename.html', 'no'],
                btn: ['确定', '关闭'],
                btnAlign: 'c',
                end: function () {
                    // MainEditor.setCurSpreadSheetEnabled(1);
                },
                yes: function (index, layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    var name = iframeWin.getPage();
                    if (name != "") {
                        $.ajax({
                            url: ip + "/designSys/checkTempName?token=" + token + "&name=" + name + "&id=0",
                            type: 'get',
                            success: function (res) {
                                if (res.state == 'success') {
                                    let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
                                    let templateId = 0;
                                    canvasEvent.Template.renameTemplate(templateIndex, name);
                                    $.each(templateMap, function (i, e) {
                                        if (e.index == templateIndex) {
                                            e.templateName = name;
                                            templateId = e.templateId;
                                        }
                                    })
                                    layer.close(index);
                                    if (templateId != 0) { //非新增未保存模板
                                        $.ajax({
                                            url: ip + "/designSys/rename?token=" + token + "&name=" + name + "&id=" + templateId,
                                            type: 'get',
                                            success: function (res) {
                                                if (res.state == 'success') {
                                                    layer.msg('操作成功!');
                                                    initTree();
                                                } else {
                                                    layer.alert(res.message);
                                                }
                                            },
                                            error: function () {
                                            }
                                        })
                                    }
                                } else {
                                    layer.alert(res.message);
                                }
                            },
                            error: function () {
                            }
                        })
                    } else {
                        layer.alert('请输入模板名称');
                    }
                },
                success: function (layero, index) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    let templateName = canvasEvent.Template.getCurrentTemplateName();
                    //设置模板名
                    iframeWin.setVal(templateName);
                    iframeWin.addEventListener('keydown', this.enterConfirm);
                }
            });
        },
        //保存模板
        save: function () {
            saveC();
            hideAllMenus();
        },
        //另存为模板
        saveAs: function () {
            saveAsTo();
            hideAllMenus();
        },
        //取消
        cancel: function () {
            //隐藏菜单
            $('.rightmenu').hide();
        }
    },
    rightRowClickMenu: {
        //复制
        copy: function () {
            DesignModule._copy();
            hideAllMenus();
        },
        //剪切
        cut: function () {
            DesignModule._cut();
            hideAllMenus();
        },
        //粘贴
        paste: function () {
            setTimeout(function () {
                canvasPaste(copyContent); //调用设计器事件，将文本输入框的值赋给设计器并调用paste事件
            }, 100)
            /*let a = $('#cpTa').val();
            var str = ParamOperator.encodeStr(a);
            DesignModule._copyClipboardDataToSpreadsheet(str);
            DesignModule._paste();*/
            hideAllMenus();
        },
        //清除内容
        clear: function () {
            canvasEvent.Cell.removeSelCellData();
            hideAllMenus();
        },
        //清除内容和样式
        clearAll: function () {
            canvasEvent.Cell.removeSelCell();
            hideAllMenus();
        },
        //复制到剪切板
        copyTo: function () {
            let val = canvasEvent.Cell.getSelCellFormatText();
            $("#cpTa").val(val);
            $("#cpTa").select();
            /*  copyContent = $('#cp').val();
              console.log(copyContent);*/
            document.execCommand("Copy");
            hideAllMenus();
        },
        //修改行高
        rowHeight: function () {
            layer.open({
                type: 2,
                title: '修改行高',
                area: ['300px', '200px'],
                btn: ['确认', '取消'],
                content: 'pages/canvas/rowHeight.html',
                yes: function (index, layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    let result = iframeWin.getRowHeight();
                    let rowHeight = Number(result.rowHeight);
                    let unit = result.unit;
                    var check = /^\d+(\.{0,1}\d+){0,1}$/; //非负数
                    if (!check.test(rowHeight)) {
                        layer.alert('请输入正确的高度');
                    } else {
                        if (unit == '0') {//如果是毫米
                            rowHeight = Math.round(rowHeight * 96) / 25.4; //mm转像素
                            canvasEvent.Row.setRowHeight(rowHeight);
                        } else { //如果是像素
                            canvasEvent.Row.setRowHeight(Math.round(rowHeight));
                        }
                    }
                    layer.close(index);
                },
                success: function (layero, index) {
                    let rowHeight = canvasEvent.Row.getRowHeight(); //获取行高像素值
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(rowHeight);
                }
            })
            hideAllMenus();
        },
        //修改列宽
        columnWidth: function () {
            layer.open({
                type: 2,
                title: '修改列宽',
                area: ['300px', '200px'],
                btn: ['确认', '取消'],
                content: 'pages/canvas/columnWidth.html',
                yes: function (index, layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    let result = iframeWin.getColumnWidth();
                    let columnWidth = Number(result.columnWidth);
                    let unit = result.unit;
                    var check = /^\d+(\.{0,1}\d+){0,1}$/; //非负数
                    if (!check.test(columnWidth)) {
                        layer.alert('请输入正确的高度');
                    } else {
                        if (unit == '0') {//如果是毫米
                            columnWidth = Math.round(columnWidth * 96) / 25.4; //mm转像素
                            canvasEvent.Column.setColumnWidth(columnWidth);
                        } else { //如果是像素
                            canvasEvent.Column.setColumnWidth(Math.round(columnWidth));
                        }
                    }
                    layer.close(index);
                },
                success: function (layero, index) {
                    let columnWidth = canvasEvent.Column.getColumnWidth(); //获取行高像素值
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(columnWidth);
                }
            })
            hideAllMenus();
        }
    },
    rowMenu: {
        //增加行
        insertRow: function () {
            canvasEvent.Row.insertRow();
            hideAllMenus();
        },
        //追加行
        appendRow: function () {
            canvasEvent.Row.appendRow();
            hideAllMenus();
        },
        //删除行
        deleteRow: function () {
            canvasEvent.Row.deleteRow();
            hideAllMenus();
        },
        //插入并粘贴行
        pasteRow: function () {
            DesignModule._copy();
            canvasEvent.Row.insertRow();
            mainPaste();
            hideAllMenus();
        }
    },
    columnMenu: {
        //增加行
        insertColumn: function () {
            canvasEvent.Column.insertColumn();
            hideAllMenus();
        },
        //追加行
        appendColumn: function () {
            canvasEvent.Column.appendColumn();
            hideAllMenus();
        },
        //删除行
        deleteColumn: function () {
            canvasEvent.Column.deleteColumn();
            hideAllMenus();
        },
        //插入并粘贴行
        pasteColumn: function () {
            DesignModule._copy();
            canvasEvent.Column.insertColumn();
            mainPaste();
            hideAllMenus();
        },
        colSetting: function(){
            layer.open({
                type: 2,
                area: ['400px', '280px'],
                closeBtn: 0,
                resize: false,
                title: ['总宽度设置', 'height:30px;line-height:30px'],
                content: 'pages/menus/columnSetting.html',
                btn: ['确定', '关闭'],
                btnAlign: 'c',
                end: function () {

                },
                yes: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    //获取页面内容
                    let content = iframeWin.getContent();
                    let start = content['start'];
                    let end = content['end'];
                    let total = content['total'];

                    let isStartRight = /^[A-Z]+$/.test(start);
                    let isEndRight = /^[A-Z]+$/.test(end);

                    if(!isStartRight){
                        layer.msg('请填写正确的开始位置');
                        return;
                    }

                    if(!isEndRight){
                        layer.msg('请填写正确的结束位置');
                        return;
                    }

                    let isInteger = /^[1-9]*[1-9][0-9]*$/.test(total);
                    if(!isInteger){
                        layer.msg('请填写正确的宽度');
                        return;
                    }else{
                        if(total<100 || total>3000){
                            layer.msg('宽度只能介于100到3000');
                            return;
                        }
                    }


                    let bCol = canvasEvent.Util.charToInt(start);
                    let eCol = canvasEvent.Util.charToInt(end);
                    let limitColWidth = total;
                    DesignModule._setLimitColWidthInfo(bCol, eCol, limitColWidth);
                    layer.closeAll();
                },
                success: function (layero, index) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    let info = decodeStrAndFree(DesignModule._getLimitColWidthInfo());
                    let json = JSON.parse(info);
                    if(json.bCol != -1){ //设置了列宽
                       let newInfo = {
                           start:canvasEvent.Util.intToChar((json.bCol)),
                           end:canvasEvent.Util.intToChar((json.eCol)),
                           total:json.limitColWidth
                       }
                       iframeWin.init(newInfo);
                    }
                }
            })
        },
        cancelSetting: function(){
            DesignModule._setLimitColWidthInfo(-1, -1, -1);
        }
    },
    repeatMenu: {
        repeatedHeadRow: function () {
            canvasEvent.Row.setRepeatedHeadRow();
            hideAllMenus();
        },
        repeatedRowRegion: function () {
            canvasEvent.Row.setRepeatedRowRegion();
            hideAllMenus();
        },
        repeatedFootRow: function () {
            canvasEvent.Row.setRepeatedFootRow();
            hideAllMenus();
        },
        cancelRepeatedRow: function () {
            canvasEvent.Row.cancelRepeatedRow();
            hideAllMenus();
        }
    }


}