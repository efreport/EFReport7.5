//新建模板
function newTemplate() {
    let index = layer.open({
        type: 2,
        area: ['350px', '180px'],
        closeBtn: 0,
        resize: false,
        title: ['新建模板名称', 'height:30px;line-height:30px'],
        content: ['pages/menus/newTemp.html', 'no'],
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {},
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let name = iframeWin.getPage();
            if (name != "") {
                $.ajax({
                    url: ip + "/designSys/checkTempName?token=" + token + "&name=" + name + "&id=0",
                    type: 'get',
                    success: function (res) {
                        if (res.state == 'success') {
                            let b = canvasEvent.Template.checkOpenTempName(name);
                            if (!b) {
                                canvasEvent.Template.loadTemplate2(name, 0);
                                layer.close(index);
                            } else {
                                layer.alert('模板名称已经存在');
                            }

                        } else {
                            layer.msg(res.message);
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
            let iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.setVal('');
            // MainEditor.setCurSpreadSheetEnabled(0);
            this.enterConfirm = function (event) {
                if (event.keyCode === 13) {
                    $(".layui-layer-btn0").click();
                    return false; //阻止系统默认回车事件
                }
            };
            iframeWin.addEventListener('keydown', this.enterConfirm);
        }
    });
}

//保存模板
function saveTemplate() {
    if(isOpenTemp()) {
        beforeSave();
    }
}



//模板另存为
function saveAsTo() {
    let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
    if(production != 'true'){
        layer.msg('演示环境不允许保存');
        return;
    }
    let index = layer.open({
        type: 2,
        area: ['350px', '180px'],
        closeBtn: 0,
        resize: false,
        title: ['另存为模板名称', 'height:30px;line-height:30px'],
        content: ['pages/menus/newTemp.html', 'no'],
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let name = iframeWin.getPage();
            if (name != "") {
                $.ajax({
                    url: ip + "/designSys/checkTempName?token=" + token + "&name=" + name + "&id=0",
                    type: 'get',
                    success: function (res) {
                        if (res.state == 'success') { //没有同名的模板

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
                                    let templateId = 0; //新增模板，id为0
                                    let templateContent = canvasEvent.Template.getCurTemplateContent(); //获取当前模板内容
                                    let blob = new Blob([templateContent], {type: 'application/json'});
                                    let formdata = new FormData();
                                    formdata.append('file', blob);
                                    formdata.append('id', templateId);
                                    formdata.append('fileName', name);
                                    //保存模板
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
                                                //加载另存为的模板
                                                canvasEvent.Template.loadSaveAsTemplate(name , templateContent , templateId);
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



                        } else {
                            layer.msg(res.message);
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
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let tempalateName = canvasEvent.Template.getCurrentTemplateName(); //当前打开模板名
            iframeWin.setVal(tempalateName);
            this.enterConfirm = function (event) {
                if (event.keyCode === 13) {
                    $(".layui-layer-btn0").click();
                    return false; //阻止系统默认回车事件
                }
            };
            iframeWin.addEventListener('keydown', this.enterConfirm);
        }
    });
}

//关闭模板
function closeTemplate() {
    var index = canvasEvent.Template.getCurrentSpreadSheetIndex();
    SpreadsheetEvent.removeSpreadSheetEvt(index);
}


//导出模板
function exportTemplate() {
    let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex(); //当前模板索引值
    //遍历获取模板的templateId
    let templateId = 0;
    $.each(templateMap, function(i,e){
        if(e.index == templateIndex){
            templateId = e.templateId;
        }
    })
    if(templateId == 0){ //尚未保存的模板
        layer.alert("请先保存模板!");
    }else{
        let expTempFunc = ip + '/designSys/exportTemp?id=' + templateId + "&token=" + token;
        window.open(expTempFunc);
    }

}

//导入Excel
function importExcel() {

}

//历史文件恢复
function recoverHistory() {
    var index = layer.open({
        type: 2,
        area: ['360px', '480px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['历史模板文件', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/history.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let res = iframeWin.getDateAndName();
            let templateName = res.templateName;
            let date = res.date;
            $.ajax({
                url: ip + '/designSys/loadHistoryTemp?token=' + token + '&templateName=' + templateName + '&date=' + date,
                type: 'get',
                success:function(res){
                    let templateName = encodeStr(res.name);
                    let templateContent = encodeStr(res.data);
                    let t = DesignModule._addSpreadSheet(templateName, templateContent); //模板在设计器的索引值，从1开始
                    let templateObj = {
                        templateId: 0,
                        templateName: res.name,
                        index:t
                    };
                    templateMap.push(templateObj);
                    layer.closeAll();
                },
                error:function(){

                }
            })

        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
        }
    });
}

//预览模板
function viewTemplate() {
    //获取当前模板内容
    let template = canvasEvent.Template.getCurTemplateContent();
    //当前模板名
    let templateName = canvasEvent.Template.getCurrentTemplateName();
    //模板ID
    let templateId = 0;
    let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
    $.each(templateMap, function (i, e) {
        if (e.index == templateIndex) {
            templateId = e.templateId;
        }
    })

    let blob = new Blob([template], {type: 'application/json'});
    let formdata = new FormData();
    let isshowico = window.sessionStorage.getItem("isshowico");
    formdata.append('file', blob);
    formdata.append('fileName', templateName);
    //保存临时文件
    $.ajax({
        url: ip + '/designSys/saveTemp?token=' + token + '&id=' + templateId,
        type: 'post',
        processData: false,
        contentType: false,
        dataType: "json",
        data: formdata,
        success: function (data) {
            window.open(ip + '/report.html?token=' + token + '&id='+ templateId +'&templateName=' + templateName + '&sysname=' + sysname + '&isAlert=' + isAlert + '&production=' + isProduction + '&isshowico=' + isshowico)
        },
        error: function () {

        }
    });

}

//重命名
function rename() {

}

//模板管理
function templateConfig() {
    var index = layer.open({
        type: 2,
        area: ['1000px', '700px'],
        closeBtn: 0,
        resize: false,
        title: ['模板管理', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/templateConfig.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            window.parent.initTree();
            layer.closeAll();
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
        }
    });
}

//模板管理
function sqlLog() {
    var index = layer.open({
        type: 2,
        area: ['1000px', '700px'],
        closeBtn: 0,
        resize: false,
        title: ['SQL日志', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/sqlLog.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            layer.closeAll();
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
        }
    });
}

//模板分享
function templateShare() {
    var index = layer.open({
        type: 2,
        area: ['1000px', '700px'],
        closeBtn: 0,
        resize: false,
        title: ['分享模板', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/templateShare.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            layer.closeAll();
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
        }
    });
}


//模板参数
function templateParams() {
    $('.paramItem').css('background-color' , '#FFFFFF');
    canvasEvent.Param.removeParamDeisgnSheet();
    var index = layer.open({
        type: 2,
        area: ['850px', '760px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['模板参数', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/tempcondition.html',
        btn: ['确定', '关闭','参数布局'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage();
            if (page) {
                let res = JSON.stringify(page);
                let t = DataObjSetter.setReportParams(res);
                DesignModule._setParamCountByRow(page.count);
                DesignModule._setLeftMarginParamBar(page.left);
                DesignModule._setTopMarginParamBar(page.top);
                DesignModule._setParamInterval(page.spa);
                layer.close(index);
            }
        },
        btn3:function(index, layero){
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage();
            if (page) {
                let res = JSON.stringify(page);
                let t = DataObjSetter.setReportParams(res);
                DesignModule._setParamCountByRow(page.count);
                DesignModule._setLeftMarginParamBar(page.left);
                DesignModule._setTopMarginParamBar(page.top);
                DesignModule._setParamInterval(page.spa);
                layer.close(index);
            }
           canvasEvent.Param.showParamDeisgnSheet();
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let json = DataObjGetter.getReportParams();
            let count = DesignModule._paramCountByRow(); //获取每行数量
            let left = DesignModule._leftMarginParamBar(); //左边留白
            let top = DesignModule._topMarginParamBar(); //上方留白
            let interval = DesignModule._paramInterval(); //间隔像素
            let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
            let dss = getCurTempDsArray();
            iframeWin.initDs(templateIndex , dss , dsMap);
            iframeWin.initData(json);
            iframeWin.initSetting(count, left, top, interval);
        }
    });
}

//模板属性
function templateProps() {
    let random = Date.parse(new Date());
    let propIndex = layer.open({
        type: 2,
        title: '模板属性',
        area: ['1000px', '700px'],
        btn: ['确认', '取消'],
        btnAlign: 'c',
        maxmin: true,
        //content: 'pages/menus/templateProps.html?v=' + random,
        content: 'pages/menus/templateProps.html?',
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let props = iframeWin.getProps();
            //设置模板属性
            canvasEvent.Template.setCurSpreadSheetProperty(JSON.stringify(props));
            layer.close(index);
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let options = $('select[name="fontfamily"]').find('option'); //字体
            let optionArr = [];
            $.each(options, function (i, e) {
                optionArr.push($(e).val());
            })
            //获取模板的模板属性
            let property = canvasEvent.Template.getCurSpreadSheetProperty();
            let sheetPrintExpr = canvasEvent.Template.sheetPrintExpr();
            let shapes = canvasEvent.Template.getAllShapeNames();//所有悬浮插件名
            let sheets = canvasEvent.Template.getAllSheetName(); //所有sheet名
            let align = canvasEvent.Template.isShowCenterReport(); //模板居中属性
            iframeWin.initProps(property , sheets , shapes , propIndex , optionArr);

        }
    })
}

//页面属性
function pageProps() {
    var index = layer.open({
        type: 2,
        area: ['770px', '650px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['页面属性', 'height:36px;line-height:36px'],
        content: 'pages/menus/pagepro.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var page = iframeWin.getPage();
            DesignModule._setSheetPrintExpr(ParamOperator.encodeStr(page.sheetPrintExpr));
            DesignModule._setSheetReportEvent(ParamOperator.encodeStr(page.sheetReportEvent));
            DesignModule._setSheetReportBeforeEvent(ParamOperator.encodeStr(page.sheetReportEvent0));
            DesignModule._setCurrSheetAllowedEdit(page.allowEdit); //当前sheet是否锁定
            layer.close(index);
        },
        success: function (layero, index) {
            // MainEditor.setCurSpreadSheetEnabled(0);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var sheetPrintExpr = ParamOperator.decodeStrAndFree(DesignModule._sheetPrintExpr());
            var sheetReportEvent = ParamOperator.decodeStrAndFree(DesignModule._sheetReportEvent());
            var sheetReportEvent0 = ParamOperator.decodeStrAndFree(DesignModule._sheetReportBeforeEvent());
            var allowEdit = DesignModule._isCurrSheetAllowedEdit(); //是否锁定
            iframeWin.init(sheetPrintExpr, sheetReportEvent, allowEdit, sheetReportEvent0 , index);
        }
    });
}

//数据填报
function dataSubmit() {
    var index = layer.open({
        type: 2,
        area: ['850px', '720px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['数据填报', 'height:36px;line-height:36px;font-size: 16px; font-weight: 400;'],
        content: 'pages/menus/dataupload.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            if (1 == $("#design").val()) {
                layer.alert('演示环境不能修改');
                return false;
            }

            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage();
            let tb = JSON.stringify(page.tb);
            let t = DataObjSetter.setUploadInfoList(tb);
            let jy = JSON.stringify(page.jy);
            let s = DataObjSetter.setDataCheckInfoList(jy);
            layer.close(index);


        },
        success: function (layero, index) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            let templatename =  canvasEvent.Template.getCurrentTemplateName();
            iframeWin.setTmp(templatename);
            var sheetName = ParamOperator.decodeStrAndFree(DesignModule._getCurrentSheetName()); //当前sheet名
            iframeWin.setSheetName(sheetName);
            var fields = DataObjGetter.getFieldCellChain();
            iframeWin.initF(fields);
            var json = DataObjGetter.uploadInfoList();
            iframeWin.init(json);
            var json2 = DataObjGetter.dataCheckInfoList();
            iframeWin.init2(json2);
            iframeWin.setCurPageIndex(index);
        }
    });
}
//自定义数据填报
function selfDataSubmit() {

    var index = layer.open({
        type: 2,
        area: ['850px', '650px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['自定义数据填报', 'height:36px;line-height:36px;font-size: 16px; font-weight: 400;'],
        content: 'pages/menus/datauploadS.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            if (1 == $("#design").val()) {
                layer.alert('演示环境不能修改');
                return false;
            }
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var page = iframeWin.getPage();
            var tb = JSON.stringify(page.tb);
            var t = DesignModule._setCustomUploadInfo(ParamOperator.encodeStr(tb));
            //var t = DataObjSetter.setUploadInfoList(tb);
            var jy = JSON.stringify(page.jy);
            var s = DataObjSetter.setDataCheckInfoList(jy);
            layer.close(index);
        },
        success: function (layero, index) {
            // MainEditor.setCurSpreadSheetEnabled(0);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            let templatename =  canvasEvent.Template.getCurrentTemplateName();
            iframeWin.setTmp(templatename);
            var sheetName = ParamOperator.decodeStrAndFree(DesignModule._getCurrentSheetName()); //当前sheet名
            iframeWin.setSheetName(sheetName);
            var json = ParamOperator.decodeStrAndFree(DesignModule._customUploadInfo());
            iframeWin.init(json);
        }
    });


}
//页面设置
function pageSetting() {

    var index = layer.open({
        type: 2,
        area: ['800px', '565px'],
        closeBtn: 0,
        resize: false,
        title: ['页面设置', 'height:36px;line-height:36px'],
        content: 'pages/menus/pageSetting.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var page = iframeWin.getPage();
            var t = DataObjSetter.setPageSetupInfo(JSON.stringify(page));
            layer.close(index);
        },
        success: function (layero, index) {
            // MainEditor.setCurSpreadSheetEnabled(0);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var json = DataObjGetter.getPageSetupInfo();
            iframeWin.init(json);
        }
    });

}




//页眉设置
function pageHeaderSetting() {
    $('img[name="footer"]').parent().removeClass('item-bottom-item-hover');
    canvasEvent.Template.removePageFooterSheet();
    let hide = canvasEvent.Template.isPageHeaderShowed();
    if (hide) {
        canvasEvent.Template.removePageHeaderSheet();
        $('img[name="header"]').parent().removeClass('item-bottom-item-hover');
    } else {
        canvasEvent.Template.showPageHeaderSheet();
        $('img[name="header"]').parent().addClass('item-bottom-item-hover');
    }
}
//页脚设置
function pageFooterSetting() {
    canvasEvent.Template.removePageHeaderSheet();
    $('img[name="header"]').parent().removeClass('item-bottom-item-hover');
    let hide = canvasEvent.Template.isPageFooterShowed();
    if (hide) {
        $('img[name="footer"]').parent().removeClass('item-bottom-item-hover');
        canvasEvent.Template.removePageFooterSheet();
    } else {
        $('img[name="footer"]').parent().addClass('item-bottom-item-hover');
        canvasEvent.Template.showPageFooterSheet();
    }
}

// 插入公式
function insertFormula() {

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
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var expr = iframeWin.getExpr();
            if (expr.indexOf('=') != 0) {
                expr = "=" + expr;
            }

            // 设置单元格文本
            canvasEvent.Cell.setSelCellText(expr);
            layer.close(index);
        },
        success: function (layero, index) {
            // MainEditor.setCurSpreadSheetEnabled(0);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            //获取当前单元格文本
            var val = canvasEvent.Cell.getSelCellText();
            var valArr = val.split('');
            if (valArr[0] == '=') {
                val = val.replace('=', '');
            }
            iframeWin.setExpr(val);
        }
    });


}

// 插入插件
function insertPlugin() {
    //form
    if(canvasEvent.Sheet.currSheetType() == 4){
        addFormChart();
    }else{
        addChart();
    }
}

function insertCustomPlugin(){
    addCustomChart();
}

// 插入图片
function insertImage() {
    $("#addImg").trigger("click");
}

// 插入斜线
function insertDiagonal() {
    canvasEvent.Cell.setSelCellsType(9);
}

var condIndex;
function fullCond() {
    layer.full(condIndex);
}

function restoreCond() {
    layer.restore(condIndex);
}

// 条件属性
function conditionProps() {
    var conds = layer.open({
        type: 2,
        maxmin: true,
        area: ['1040px', '760px'],
        closeBtn: 0,
        resize: false,
        title: ['条件属性', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/condproperty.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage();
            if (page) {
                let res = JSON.stringify(page);
                let t = DataObjSetter.setCondPropertys(res);
                layer.close(index);
            }
        },
        success: function (layero, index) {
            condIndex = conds;
            // MainEditor.setCurSpreadSheetEnabled(0);
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let sel = [];
            $('select[name="fontfamily"]').children('option').each(function () {
                sel.push($(this).val());
            });
            
            iframeWin.initFont(sel, Design.fontMapVK);
            let json = DataObjGetter.getCondPropertysPtr();
            iframeWin.init(json);
        }
    });
}

// 超级链接
function hyperLink() {

    var index = layer.open({
        type: 2,
        area: ['900px', '610px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['超级链接', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/hyperlink.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var page = iframeWin.getPage();
            if (false != page) {
                if (page != '1') {
                    page = JSON.stringify(page);
                } else {
                    page = '';
                }
                var t = canvasEvent.Cell.setSelCellHyperlink(page);
                layer.close(index);
            }
        },
        success: function (layero, index) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var json = canvasEvent.Cell.getSelCellHyperlink();
            iframeWin.init(json , index);
        }
    });

}


// 悬浮元素超级链接
function hyperLinkS() {

    var index = layer.open({
        type: 2,
        area: ['900px', '610px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['超级链接', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'pages/menus/hyperlink.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var page = iframeWin.getPage();
            if (false != page) {
                if (page != '1') {
                    page = JSON.stringify(page);
                } else {
                    page = '';
                }
                canvasEvent.Shape.setSelShapeHyperlink(page)
                layer.close(index);
            }
        },
        success: function (layero, index) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var json = canvasEvent.Shape.getSelShapeHyperlink();
            iframeWin.init(json);
        }
    });

}

// 关联子表单
function subSheet(){
    var index = layer.open({
        type: 2,
        area: ['850px', '550px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['关联子表单', 'height:36px;line-height:36px'],
        content: 'pages/menus/joinsub.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var page = iframeWin.getPage();
            var showScrollV = page.showScrollV;
            var align = page.align;
            var t = DataObjSetter.setSubReportSheet(JSON.stringify(page));
            layer.close(index);
        },
        success: function (layero, index) {
            // MainEditor.setCurSpreadSheetEnabled(0);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var json = DataObjGetter.subReportSheet();
            iframeWin.init(json);
        }
    });

}

// 区域联动
function areaLink() {
    var index = layer.open({
        type: 2,
        area: ['750px', '630px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['区域联动', 'height:36px;line-height:36px'],
        content: 'pages/menus/sarealink.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage1();
            if (page == 1) {
                layer.alert('表达式有空值!');
            } else if (page == 2) {
                layer.alert('有错误的表达式!');
            } else if (page == 3) {
                layer.alert('有重复的表达式!');
            } else {
                let curCell = decodeStrAndFree(canvasEvent.Cell.getSelBeginCell());
                let cellJson = JSON.parse(curCell);
                page.selfX = cellJson.x;
                page.selfY = cellJson.y;
                //区域联动信息不为空时，保存
                if (page.Shapes.length != 0 || page.Regions.length != 0) {
                    if(page.Regions.length != 0){ //转化单元格数据
                        let newRegions = [];
                        $.each(page.Regions,function(i,e){
                            let value = e.value; //单元格
                            let cellJSON = canvasEvent.Util.cellChar2Pos(value);
                            let cells = JSON.parse(cellJSON);
                            let obj = {};
                            obj.ExprStr = e.ExprStr;
                            obj.X = cells.x;
                            obj.Y = cells.y;
                            newRegions.push(obj);
                        })
                        page.Regions = newRegions;
                    }
                    let t = canvasEvent.Cell.setRepaintRegions(JSON.stringify(page));
                } else {
                    let t = canvasEvent.Cell.setRepaintRegions("");
                }
                layer.close(index);
            }

        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let allShape = canvasEvent.Shape.getAllShapeNames(); //获取所有悬浮元素名
            let regionInfo = canvasEvent.Cell.getRepaintRegions();
            let mainSheetName = decodeStrAndFree(DesignModule._mainDBSheetName());
            if(regionInfo != ""){
                let regionJson = JSON.parse(regionInfo);
                if(regionJson.Regions.length != 0){ //还原X,Y值为A1单元格格式
                    let newRegions = [];
                    $.each(regionJson.Regions , function (i,e) {
                        let x = e.X;
                        let y = e.Y;
                        let cell = canvasEvent.Util.cellPos2Char(x,y);
                        let obj = {};
                        obj.value = cell;
                        if(e.ExprStr != undefined){
                            obj.ExprStr = e.ExprStr;
                        }
                        newRegions.push(obj);
                    })
                    regionJson.Regions = newRegions;
                }
                iframeWin.init(JSON.stringify(regionJson), allShape , mainSheetName);
            }else{
                iframeWin.init(regionInfo, allShape , mainSheetName);
            }

        }
    });
}

// 悬浮元素区域联动
function areaLinkS() {
    var index = layer.open({
        type: 2,
        area: ['750px', '630px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['区域联动', 'height:36px;line-height:36px'],
        content: 'pages/menus/sarealink.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let page = iframeWin.getPage1();
            if (page == 1) {
                layer.alert('表达式有空值!');
            } else if (page == 2) {
                layer.alert('有错误的表达式!');
            } else if (page == 3) {
                layer.alert('有重复的表达式!');
            } else {
                //区域联动信息不为空时，保存
                if (page.Shapes.length != 0 || page.Regions.length != 0) {
                    //当前悬浮元素的名称
                    let shapeName = canvasEvent.Shape.getSelShapeName();
                    if (page.Regions.length != 0) { //转化单元格数据
                        let newRegions = [];
                        $.each(page.Regions, function (i, e) {
                            let value = e.value; //单元格
                            let cellJSON = canvasEvent.Util.cellChar2Pos(value);
                            let cells = JSON.parse(cellJSON);
                            let obj = {};
                            obj.ExprStr = e.ExprStr;
                            obj.X = cells.x;
                            obj.Y = cells.y;
                            newRegions.push(obj);
                        })
                        page.Regions = newRegions;
                    }
                    page.ShapeName = shapeName;
                }
                canvasEvent.Shape.setSelectShapeRepaintRegions(JSON.stringify(page));
                layer.close(index);
            }

        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let allShape = canvasEvent.Shape.getAllShapeNames(); //获取所有悬浮元素名
            let regionInfo = canvasEvent.Shape.getSelectShapeRepaintRegions();
            let mainSheetName = decodeStrAndFree(DesignModule._mainDBSheetName());
            if(regionInfo != ""){
                let regionJson = JSON.parse(regionInfo);
                if(regionJson.Regions.length != 0){ //还原X,Y值为A1单元格格式
                    let newRegions = [];
                    $.each(regionJson.Regions , function (i,e) {
                        let x = e.X;
                        let y = e.Y;
                        let cell = canvasEvent.Util.cellPos2Char(x,y);
                        let obj = {};
                        obj.value = cell;
                        if(e.ExprStr != undefined){
                            obj.ExprStr = e.ExprStr;
                        }
                        newRegions.push(obj);
                    })
                    regionJson.Regions = newRegions;
                }
                iframeWin.init(JSON.stringify(regionJson), allShape ,mainSheetName);
            }else{
                iframeWin.init(regionInfo, allShape ,mainSheetName);
            }
            //iframeWin.init(regionInfo, allShape);
        }
    });
}

// 合并单元格
function mergeCell() {
    DesignModule._mergeSelCells();
    $('.layui-show').hide();
}

// 拆分单元格
function splitCell() {
    DesignModule._unmergeSelCells();
}

// 数据链接
function dataSource() {

    var index = layer.open({
        type: 2,
        maxmin: true,
        area: ['930px', '580px'],
        closeBtn: 0,
        title: ["数据库连接设置", 'height:36px;line-height:36px'],
        content: ['pages/menus/datasource.html', 'no'],
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var str = iframeWin.save(index);
        },
        success: function (layero, index) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.setData($("#design").val());
        }
    });

}


function sysDs() {

    let index = layer.open({
        type: 2,
        maxmin: true,
        area: ['1100px', '780px'],
        closeBtn: 0,
        title: ["通用数据集", 'height:36px;line-height:36px'],
        content: ['pages/menus/sysDs.html', 'no'],
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            window.parent.initGdsData();
            layer.closeAll();

        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
        }
    });

}

// 全局JS函数 globalJs()
function globalJs() {
    base = ip;
    let token = window.sessionStorage.getItem("cur_token");
    var index = layer.open({
        type: 2,
        area: ['700px', '700px'],
        closeBtn: 0,
        maxmin: true,
        resize: false,
        title: ['全局js函数', 'height:36px;line-height:36px'],
        content: 'pages/menus/globalJS.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var p = iframeWin.getExpr();
            $.ajax({
                url: base + "/designSys/saveGlobalJS?token=" + token,
                type: 'post',
                data: {'script': p},
                dataType: 'json',
                success: function (res) {
                    if (res.state == 'success') {
                        layer.alert('修改成功');
                    } else {
                        layer.alert('修改失败,错误原因:' + res.message);
                    }
                },
                error: function () {
                }
            })
            layer.close(index);
        },
        success: function (layero, index) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
        }
    });
}

function setPlatform() {
    let token = window.sessionStorage.getItem("cur_token");
    layer.open({
        type: 2,
        area: ['600px', '400px'],
        closeBtn: 0,
        title: ['平台属性', 'height:36px;line-height:36px'],
        content: ['pages/menus/plateform.html', 'no'],
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {
        },
        success: function (layero, index) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            $.ajax({
                url: ip + '/designSys/getPlatform?token=' + token,
                type: 'post',
                success: function (res) {
                    if (res.state == 'success') {
                        iframeWin.init(res.config);
                    } else {

                    }
                },
                error: function () {
                }
            })
        },
        yes: function (index, layero) {

            let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
            if(production != 'true'){
                layer.msg('演示环境不允许操作');
                return;
            }

            var iframeWin = window[layero.find('iframe')[0]['name']];
            var page = iframeWin.getPage();
            $.ajax({
                url: ip + '/designSys/savePlatform?token='+token,
                type: 'post',
                data: page,
                success: function (res) {
                    if (res.state == 'success') {
                        //更新平台属性
                        platform = page;
                        DesignModule._setInitSheetColCount(parseInt(page.colNum));
                        DesignModule._setInitSheetRowCount(parseInt(page.rowNum));
                        DesignModule._setInitSheetRowHeight(parseInt(page.rowHeight));
                        DesignModule._setInitSheetColWidth(parseInt(page.colWidth));
                        DesignModule._setShowCenterReport(page.isCenter);
                        DesignModule._setSearchByDefaultParam(page.isAuto);
                        DesignModule._setAutoPaperSize(page.isOne);
                        DesignModule._setDefaultFieldDataType(page.dataType);
                        DesignModule._setDefaultDataAttribution(page.dataSet);
                        DesignModule._setDefaultCellTopMargin(page.padTop);
                        DesignModule._setDefaultCellBottomMargin(page.padBottom);
                        DesignModule._setDefaultCellLeftMargin(page.padLeft);
                        DesignModule._setDefaultCellRightMargin(page.padRight);
                        DesignModule._setUsePixelRuler(page.isPixel);
                        DesignModule._setShowColIndex(page.showColIndex);
                        isAlert = page.isAlert;
                        layer.alert('修改成功,新建的模板生效');
                    } else {
                        layer.alert(res.message);
                    }
                },
                error: function () {
                }

            })
            layer.close(index);
        }
    });
}
// 帮助
function help() {
    window.open('about/help.htm');
}

// 关于
function about() {

    var index = layer.open({
        type: 2,
        area: ['410px', '300px'],
        closeBtn: 1,
        resize: false,
        title: ['关于', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: 'about/aboat.html',
        // btn: ['关闭'],
        // btnAlign: 'r',
        end: function () {
            // MainEditor.setCurSpreadSheetEnabled(1);
        },
        success: function (layero, index) {
            // MainEditor.setCurSpreadSheetEnabled(0);
            var iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.init(ParamOperator.decodeStrAndFree(DesignModule._verNo()));
        }
    });

}

function loadCellText(){
    let content =  DesignModule._getCellsTextByJson(false);
    let str = decodeStrAndFree(content);
    let blob = new Blob([str], { type: "application/json" });
    saveAs(blob, "cell.json");
}

function loadNsCellText(){
    let content =  DesignModule._getCellsTextByJsonMultiSheet_NS_test(false);
    let str = decodeStrAndFree(content);
    let blob = new Blob([str], { type: "application/json" });
    saveAs(blob, "cell.json");
}

function loadZZTZCellText(){
    let key =  decodeStrAndFree(DesignModule._generateLocalKey());
    $.ajax({
        url: ip + "/thirdSys/generateKey?key=" + key ,
        type: 'post',
        success: function (res) {
            let content =  DesignModule._getCellsTextByJsonMultiSheet_ZZTZJT(encodeStr(res));
            let str = decodeStrAndFree(content);
            let blob = new Blob([str], { type: "application/json" });
            saveAs(blob, "cell.json");
        },
        error: function () {
        }
    })
}

function showExpr(){
    let flag = DesignModule._isShowExprValue();
    DesignModule._setShowExprValue(!flag);
}

function addNSRow(flag){
    DesignModule._insertRowInDataTable_NS(flag);
}

function delNSRow(){
    DesignModule._deleteRowInDataTable_NS();
}

function recoverNSRow(){
    DesignModule._restoreLastDeleteRow_NS();
}


function addZZTZRow(flag){
    DesignModule._insertRowInDataTable_ZZTZJT(flag);
}

function delZZTZRow(){
    DesignModule._deleteRowInDataTable_ZZTZJT();
}

function recoverZZTZRow(){
    DesignModule._restoreLastDeleteRow_ZZTZJT();
}


function expandAllDs() {
    $('.dsval').find('.dsii').css('display', 'block');
    $('#dsMenu').hide();
}

function uExpandAllDs() {
    $('.dsval').find('.dsii').css('display', 'none');
    $('#dsMenu').hide();
}

function copyDs(){
    layer.msg('复制成功');
    $('#dsCopyMenu').hide();
}

function pasteDs(){

    if(dsCName == ''){
        layer.msg('请先复制数据集');
    }else{
        let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex(); //获取模板在设计器中的索引
        let isNewTemplate = false; //是否新增模板
        $.each(templateMap, function (i, e) {
            if (e.index == templateIndex) { //新增未保存模板，id为0
                let id = e.templateId;
                if (id == 0) {
                    isNewTemplate = true;
                }
            }
        });

        let dsArray = new Array();
        dsArray.push(dsData);
        let newDsName = dsCName + "Copy";
        dsData.DSName = newDsName;
        //将数据集添加到模板中
        let i = canvasEvent.Template.addDataSourceArray(JSON.stringify(dsArray));
        if (i == 0) {
            let ds = canvasEvent.Template.dataSourceArray(); //获取模板的数据集
            initDs(JSON.parse(ds));
        }
    }

    $('#dsMenu').hide();
}

function refreshTree(){
    initTree();
    $('#treeMenu').hide();
}

