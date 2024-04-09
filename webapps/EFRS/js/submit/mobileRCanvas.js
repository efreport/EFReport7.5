let isSelectShow = false;
let isSelect = false;
let prevVal = ''; //前一个单元格的值
let isPreAllowNull = true;
let hasNullFlag = false;
let isShowPic; //是否显示图片

function exportUrt() {
    //导出内容
    let sval = Module._saveURTToJson();
    let text = ParamOperator.decodeStrAndFree(sval);

    let blob = new Blob([text], {type: 'text/plain'});
    let formdata = new FormData();
    formdata.append('file', blob);
    $.ajax({
        url: base + '/designSys/saveUrt',
        type: 'post',
        processData: false,
        contentType: false,
        dataType: "json",
        data: formdata,
        success: function (data) {
            if (data.state == 'success') {
                //打开下载urt页面
                let expTempFunc = base + '/designSys/exportUrt?name=' + data.name + '&fileName=' + tpl;
                window.open(expTempFunc);
            } else {
                layer.alert("导出失败,失败原因:" + data.message);
            }
        },
        error: function () {
            let url = base + "/login.jsp";
            window.location.href = url;
        }
    });


}

function sql() {
    let data = ParamOperator.decodeStrAndFree(Module._getAllUpdateDataInfo());
    //获取自定义填报
    let json = ParamOperator.decodeStrAndFree(Module._customUploadInfo());
    let obj = JSON.parse(json);
    let isJSUpload = true;
    if (obj.length == 1) {
        //自定义js填报
        if (obj[0].JSUploadStr != "") {
            let result = executeFunction(obj[0].JSUploadStr);
            let html = '';
            let sqlStrs = result.split(";");
            $.each(sqlStrs, function (ii, ee) {
                let sql = ee;
                html += '<div style="padding:5px;">' + sql + '</div>';
            })
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: true,
                content: html
            });
        } else {
            isJSUpload = false;
        }
    }

    if (!isJSUpload) {
        let data = ParamOperator.decodeStrAndFree(Module._getAllUpdateDataInfo());
        let json = JSON.parse(data);
        let curSheet = '';
        let customFlag = false;
        $.each(json, function (index, element) {
            if (element.customRecords != undefined) {
                customFlag = true;
                return true;
            }
        })

        if (!customFlag) {
            layer.alert('非自定义填报，无法查看SQL');
        } else {
            let html = '';
            $.each(json, function (index, element) {
                let records = element.customRecords;
                $.each(records, function (i, e) {
                    let sqlStrs = e.sqlStrs;
                    $.each(sqlStrs, function (ii, ee) {
                        let sql = ee;
                        html += '<div style="padding:5px;">' + sql + '</div>';
                    })
                });
            })

            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: true,
                content: html
            });
        }
    }
}

/**
 * type = 2 提交
 * type = 1 数据校验
 * */
function submitR(type) {
    Module._clearInvaildCellInfos();
    if (!isShowExpress) {
        layer.alert('公式状态下不能提交和数据校验!')
        return false;
    }
    //最终提交的数据
    let json;
    let customFlag = false;

    //获取自定义填报信息
    let cusJson = ParamOperator.decodeStrAndFree(Module._customUploadInfo());
    let obj = JSON.parse(cusJson);
    let isJSUpload = true;
    if (obj.length >= 1) {
        //自定义js填报
        if (obj[0].JSUploadStr != "") {
            let result = executeFunction(obj[0].JSUploadStr);
            let sqlStrs = result.split(";");
            //填充sql内容
            //"[{\"customRecords\":[{\"conn\":\"demo\",\"sqlStrs\":[],\"uploadName\":\"\"}],\"sheetName\":\"sheet1\"}]"
            let data = ParamOperator.decodeStrAndFree(Module._getAllUpdateDataInfo());
            let sqlStrArray = [];
            $.each(sqlStrs, function (ii, ee) {
                let sql = ee;
                if (sql != '') {
                    sqlStrArray.push(sql);
                }
            })
            let dataJson = JSON.parse(data);
            dataJson[0].customRecords[0].sqlStrs = sqlStrArray;
            json = dataJson;
            customFlag = true;
        } else {
            isJSUpload = false;
        }
    }

    let curSheet = '';
    //非自定义js填报
    if (!isJSUpload) {
        //填报数据
        let data = ParamOperator.decodeStrAndFree(Module._getAllUpdateDataInfo());
        json = JSON.parse(data);
        //判断是否自定义sql填报
        $.each(json, function (index, element) {
            if (element.customRecords != undefined) {
                customFlag = true;
                return true;
            }
        })
    }
    //非自定义填报
    if (!customFlag) {
        let data = ParamOperator.decodeStrAndFree(Module._getAllUpdateDataInfo());
        json = JSON.parse(data);
        $.ajax({
            url: encodeURI(base + "/report/updateData?" + "templateId=" + id + "&params="  + "&type=" + type + "&sheetName=" + curSheet + "&uploadInfo=" + uploadInfos + '&token=' + token + '&pathId=' + pathId + '&templateName=' + templateName),
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(json),
            beforeSend: function () {
                /*  $('#export').css('z-index', '0');
                 $('#export').find('ul').css('z-index', '0');*/
                $('.rowOper').parent().parent().css('z-index', 0);
                $('.export').parent().parent().css('z-index', 0);
                $('.normal-export').parent().parent().css('z-index', 0);
                $('.offline').parent().parent().css('z-index', 0);
                $("#loadgif").show();
            },
            complete: function () {
                $("#loadgif").hide();
            },
            success: function (resp) {
                if (resp.code == 1) {//数据校验成功
                    layer.alert(resp.text, function (index) {
                        $('.rowOper').parent().parent().css('z-index', 999);
                        $('.export').parent().parent().css('z-index', 999);
                        $('.normal-export').parent().parent().css('z-index', 999);
                        $('.offline').parent().parent().css('z-index', 999);
                        if(type == 2){
                            window.location.reload();
                        }
                        layer.close(index);
                    });
                } else if (resp.code == 2) {//数据校验失败
                    $('.rowOper').parent().parent().css('z-index', 999);
                    $('.export').parent().parent().css('z-index', 999);
                    $('.normal-export').parent().parent().css('z-index', 999);
                    $('.offline').parent().parent().css('z-index', 999);
                    layer.alert('数据校验不通过，请检查数据');
                    Module._loadInvaildCellInfosFromStream(ParamOperator.encodeStr(resp.text));
                } else {
                    if (resp.code == undefined) {//whj 填报信息有误
                        $('.rowOper').parent().parent().css('z-index', 999);
                        $('.export').parent().parent().css('z-index', 999);
                        $('.normal-export').parent().parent().css('z-index', 999);
                        $('.offline').parent().parent().css('z-index', 999);
                        layer.alert('填报信息有误');
                    } else {
                        $('.rowOper').parent().parent().css('z-index', 999);
                        $('.export').parent().parent().css('z-index', 999);
                        $('.normal-export').parent().parent().css('z-index', 999);
                        $('.offline').parent().parent().css('z-index', 999);
                        layer.alert(resp.text);
                    }

                }
            },
            error: function () {
                $('#export').css('z-index', '1200');
                $('#export').find('ul').css('z-index', '1200');
                $('.offline').parent().parent().css('z-index', 999);
                layer.alert('填报异常,请检查模板!')
            }
        });
    } else {
        //+是特殊符号，加密时会被干掉，需要做特殊替换
        let data = JSON.stringify(json);
        data = data.replace(/\+/g, "%2B");
        let postParam = encodeURI(data);
        postParam = encodeBase64(postParam);
        $.ajax({
            url: encodeURI(customUpdateFunc + "tpl=" + _g_tpl + "&params=" + Param.Fn.getParams() + "&type=" + type + "&sheetName=" + curSheet + "&uploadInfo=" + uploadInfos),
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: postParam,
            beforeSend: function () {
                $('#export').css('z-index', '0');
                $('#export').find('ul').css('z-index', '0');
                $("#loadgif").show();
            },
            complete: function () {
                $("#loadgif").hide();
            },
            success: function (resp) {
                if (resp.code == 1) {//数据校验成功
                    layer.alert(resp.text, function (index) {
                        if (type == 2) {
                            window.location.reload();
                        }
                        layer.close(index);
                    });
                } else if (resp.code == 2) {//数据校验失败
                    $('#export').css('z-index', '1200');
                    $('#export').find('ul').css('z-index', '1200');
                    layer.alert('数据校验不通过，请检查数据！')
                    Module._loadInvaildCellInfosFromStream(ParamOperator.encodeStr(resp.text));
                } else {
                    if (resp.code == undefined) {//whj 填报信息有误
                        $('#export').css('z-index', '1200');
                        $('#export').find('ul').css('z-index', '1200');
                        layer.alert('填报信息有误!');
                    } else {
                        $('#export').css('z-index', '1200');
                        $('#export').find('ul').css('z-index', '1200');
                        layer.alert(resp.text);
                    }

                }
            },
            error: function () {
                $('#export').css('z-index', '1200');
                $('#export').find('ul').css('z-index', '1200');
                layer.alert('填报异常,请检查模板!');
            }
        });
    }


}

function detail() {
    let val = MainEditor.getSelCellText();
    layer.open({
        type: 1
        ,
        title: false //不显示标题栏
        ,
        closeBtn: true
        ,
        area: ['300px', '200px']
        ,
        shade: 0
        ,
        id: 'LAY_layuipro' //设定一个id，防止重复弹出
        ,
        resize: true
        ,
        btnAlign: 'c'
        ,
        moveType: 1 //拖拽模式，0或者1
        ,
        content: '<div style="padding: 10px; line-height: 22px; background-color: #ffffff; color: #000000; font-weight: 300;word-break:break-all;">' + val + '</div>'
        ,
        success: function (layero) {

        }
    });
}

function clearText() {
    Module._clearInvaildCellInfos();
}

function addRowR() {
    Module._addDataRow(false);
}

function cloneRowR() {
    Module._addDataRow(true);
}

function deleteRowR() {
    Module._removeDataRow();
}

function selectF() {
    let val = $("#singleSel").val();
    if ($.isArray(val)) {//复选
        let text = '';
        $.each(val, function (index, ele) {
            if (index == val.length - 1) {
                text += ele;
            } else {
                text += (ele + ',');
            }
        })
        let str = ParamOperator.encodeStr(text);
        let t = Module._setSelCellText(str);
    } else {//单选
        let str = ParamOperator.encodeStr(val);
        let t = Module._setSelCellText(str);
    }
    if ($.isArray(val)) {

    } else {
        $("#singleSel").hide();
    }


}

function setText(val) {
    //let val = $('#timeInput').val();
    let str = ParamOperator.encodeStr(val);
    let t = Module._setSelCellText(str);
    $('#timeInput').val('');
    $('#timeInput').hide();
}

function setTextD(val) {
    let str = ParamOperator.encodeStr(val);
    let t = Module._setSelCellText(str);
    $('#dateInput').val('');
    $('#dateInput').hide();
}

function showMenu(x, y) {
    MainEditor.setCurSpreadSheetEnabled(0);
    $("#contextMenu1").css({left: x, top: y}).show();
    $("#contextMenu1").mouseover();
}

function switchR() {
    let flag = Module._isShowExprValue();
    if (flag) {
        Module._setShowExprValue(false);
        isShowExpress = false;
        $('#switch').text('显示值');
        $('#normal-switch').text('显示值');
    } else {
        Module._setShowExprValue(true);
        isShowExpress = true;
        $('#switch').text('显示公式');
        $('#normal-switch').text('显示公式');
    }

}


function keyDownF(event) {
    let code = event.keyCode;
    //输入框显示的情况下
    if (isInputShow) {
        if (event.ctrlKey && (event.keyCode == 67)) {  //不拦截ctrl+c
            return true;
        } else {
            return false;
        }
    }
    let b = isEdit();

    //ctrl + c ctrl + del 不拦截
    if (event.ctrlKey && (code == 67 || code == 46)) {
        b = true;
    }
    //四个方向键不拦截
    if (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) {
        b = true;
    }
    //ctrl s不拦截
    if (event.ctrlKey && event.keyCode == 83) {
        b = true;
    }

    //Tab键不拦截
    if (event.keyCode == 9) {
        b = true;
    }

    if (b) {
        showInput(event);
    }

}

function printR(cflag, sheetNames) {

    let sval = Module._saveAsToStream();//临时保存
    let text = ParamOperator.decodeStrAndFree(sval);
    if (!isNull(text)) {
        let temp = randomUUID();
        let blob = new Blob([text], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('fileName', temp);
        $.ajax({
            //生成臨時文件
            url: base + '/report/generate?type=2' + '&flag=true' + '&token=' + token + "&id=" + id,
            type: 'post',
            processData: false,
            contentType: false,
            dataType: "json",
            data: formdata,
            success: function (data) {
                if (data.state == 'success') {
                    let name = data.name;//臨時文件名
                    window.open(base + '/report/printR?name=' + name + '&params=' + "&cflag=" + cflag + "&sheet=" + sheetNames + "&token=" + token + "&templateId=" + id);
                } else {

                }
            },
            error: function (info) {
                console.log(info);
            }
        });
    }
}

function exportExcelR(flag, cflag, sheetNames) {
    let sval = Module._saveAsToStream();//临时保存
    let text = ParamOperator.decodeStrAndFree(sval);
    if (!isNull(text)) {
        let temp = randomUUID();
        let blob = new Blob([text], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('fileName', temp);
        $.ajax({
            //生成臨時文件
            url: base + '/report/generate?type=2' + '&flag=true&id=' + id + '&token=' + token,
            type: 'post',
            processData: false,
            contentType: false,
            dataType: "json",
            data: formdata,
            success: function (data) {
                if (data.state == 'success') {
                    let name = data.name;//臨時文件名
                    //window.open(base + '/report/expXLSR?tpl=' + tpl + '&flag=' + flag + '&params=' + Param.Fn.getParams() + '&exportJson=' + encodeURIComponent(exportJson) + '&cel=' + tpl + "&cflag=" + cflag + "&sheet=" + sheetNames);
                    window.open(base + '/report/expExcelR?name=' + name + '&flag=' + flag + '&params='+ "&cflag=" + cflag + "&sheet=" + sheetNames + "&token=" + token + "&templateId=" + id);

                } else {

                }
            },
            error: function (info) {
                console.log(info);
            }
        });
    }
}

function exportExcelBySheetR(cflag, sheetNames) {
    let sval = Module._saveAsToStream();//临时保存
    let text = ParamOperator.decodeStrAndFree(sval);
    if (!isNull(text)) {
        let temp = randomUUID();
        let blob = new Blob([text], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('fileName', temp);
        $.ajax({
            //生成臨時文件
            url: base + '/report/generate?type=2' + '&flag=true&id=' + id + '&token=' + token,
            type: 'post',
            processData: false,
            contentType: false,
            dataType: "json",
            data: formdata,
            success: function (data) {
                if (data.state == 'success') {
                    let name = data.name;//臨時文件名
                    //window.open(base + '/report/expBySheetR?tpl=' + tpl + '&flag=true&params=' + Param.Fn.getParams() + '&exportJson=' + encodeURIComponent(exportJson) + '&cel=' + tpl + "&cflag=" + cflag + "&sheet=" + sheetNames);
                    window.open(base + '/report/expBySheetR?name=' + name + '&params='+ "&cflag=" + cflag + "&sheet=" + sheetNames + "&token=" + token + "&templateId=" + id);

                } else {

                }
            },
            error: function (info) {
                console.log(info);
            }
        });
    }
}

function exportPdfR(cflag, sheetNames) {
    let sval = Module._saveAsToStream();//临时保存
    let text = ParamOperator.decodeStrAndFree(sval);
    if (!isNull(text)) {
        let temp = randomUUID();
        let blob = new Blob([text], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('fileName', temp);
        $.ajax({
            //生成臨時文件
            url: base + '/report/generate?type=2' + '&flag=true' + '&token='  + token + '&id=' + id,
            type: 'post',
            processData: false,
            contentType: false,
            dataType: "json",
            data: formdata,
            success: function (data) {
                if (data.state == 'success') {
                    let name = data.name;//臨時文件名
                    //window.open(base + '/report/expPDFR?tpl=' + tpl + '&flag=true&params=' + Param.Fn.getParams() + '&exportJson=' + encodeURIComponent(exportJson) + '&cel=' + tpl + "&cflag="+cflag+"&sheet="+sheetNames);
                    window.open(base + '/report/expPDFR?name=' + name + '&params=' + '&cflag=' + cflag + '&sheet=' + sheetNames + '&token=' + token + '&templateId=' + id);
                } else {

                }
            },
            error: function (info) {
                console.log(info);
            }
        });
    }
}

//填报时，生成PDF作为附件
function exportTBPdf() {
    let sval = Module._saveAsToStream();//临时保存
    let text = ParamOperator.decodeStrAndFree(sval);
    let temp = randomUUID();
    if (isNull(text)) {
        let blob = new Blob([text], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('fileName', temp);
        $.ajax({
            //生成臨時文件
            url: base + '/report/generate?type=2' + '&flag=true',
            type: 'post',
            processData: false,
            contentType: false,
            dataType: "json",
            data: formdata,
            success: function (data) {
                if (data.state == 'success') {

                } else {

                }
            },
            error: function (info) {
                console.log(info);
            }
        });
    }
    return temp;
}

function exportWordR(cflag, sheetNames) {
    let sval = Module._saveAsToStream();//临时保存
    let text = ParamOperator.decodeStrAndFree(sval);
    if (!isNull(text)) {
        let temp = randomUUID();
        let blob = new Blob([text], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('fileName', temp);
        $.ajax({
            //生成臨時文件
            url: base + '/report/generate?type=2' + '&flag=true&id=' + id + '&token=' + token,
            type: 'post',
            processData: false,
            contentType: false,
            dataType: "json",
            data: formdata,
            success: function (data) {
                if (data.state == 'success') {
                    let name = data.name;//臨時文件名
                    //window.open(base + '/report/expWORDR?tpl=' + tpl + '&flag=true&params=' + Param.Fn.getParams() + '&exportJson=' + encodeURIComponent(exportJson) + '&cel=' + tpl + "&cflag=" + cflag + "&sheet=" + sheetNames);
                    window.open(base + '/report/expWordR?name=' + name + '&params=' + '&cflag=' + cflag + '&sheet=' + sheetNames + '&token=' + token + '&templateId=' + id);

                } else {

                }
            },
            error: function (info) {
                console.log(info);
            }
        });
    }
}


//canvas生命周期操作对象
let Design = {
    init: function (path) {
        $('#loadText').html('正在加载在线设计器...');
        let canvas = document.querySelector('#canvas');
        let qtLoader = QtLoader({
            canvasElements: [canvas],
            showLoader: function (loaderStatus) {
                canvas.style.display = 'none';
            },
            showError: function (errorText) {
                canvas.style.display = 'none';
            },
            showExit: function () {
                canvas.style.display = 'none';
            },
            showCanvas: function () {
                canvas.style.display = 'block';
                MainEditor.afterInit();
            }
        });
        qtLoader.loadEmscriptenModule(path);
        qtLoader.setFontDpi(100);
    }
};

//主体canvas功能操作对象
let MainEditor = {
    //替换sql中的参数
    replaceParamsStr: function (str) {
        let val = Module._replaceParamsStr(ParamOperator.encodeStr(str));
        return ParamOperator.decodeStrAndFree(val);
    },
    //1 有效 0 无效
    setCurSpreadSheetEnabled: function (type) {
        ///return Module._setCurSpreadSheetEnabled(type);
    },
    afterInit: function () {
       /* let w = $('.x-canvas-container').width();
        let h = $('.x-canvas-container').height();
        $('#canvas').attr('width', w);
        $('#canvas').attr('height', h);*/

        loadJavascript();
        initFont();

    },
    setSelCellText: function (val) {
        let str = ParamOperator.encodeStr(val);
        let t = Module._setSelCellText(str);
    },
    //4 获取当前选择单元格
    getSelCellRect: function () {
        let str = Module._getSelCellRect();
        str = ParamOperator.decodeStrAndFree(str);
        if (str != '') {
            selRect = JSON.parse(str);
            return selRect;
        }
    },
    //5 获取选择单元格文本
    getSelCellText: function () {
        let sval = Module._getSelCellText();
        let text = ParamOperator.decodeStrAndFree(sval);
        return text;
    },
    //6 获取当前打开的模板索引集合
    getAllSpreadSheetIndex: function () {
        return ParamOperator.decodeStrAndFree(Module._getAllSpreadSheetIndex());
    },
    //7 关闭所有未修改的模板 -1 所有 其他 当前,return:返回剩余个数
    closeAllSpreadSheet: function (index) {
        return Module._closeAllSpreadSheet(index);
    },
    getAllSpreadSheetIndex: function () {
        let val = Module._getAllSpreadSheetIndex();
        let text = ParamOperator.decodeStrAndFree(val);
        return text;
    },
    getParamsJsonStr: function () {
        let val = Module._getParamsJsonStr();
        let text = ParamOperator.decodeStrAndFree(val);
        return text;
    },
    getSqlMacroStr: function () {
        let val = Module._getSqlMacroStr();
        let text = ParamOperator.decodeStrAndFree(val);
        return text;
    }
};

//出参 入参 加解密
let ParamOperator = {
    //接收返回的字符串并解析
    decodeStrAndFree: function (visualIndex) {
        let str = UTF8ToString(visualIndex);
        Module._free(visualIndex);
        return str;
    },
    //编码传出的字符串
    encodeStr: function (str) {
        if (isNull(str)) {
            return '';
        }
        let lengthBytes = lengthBytesUTF8(str) + 1;
        let stringOnWasmHeap = _malloc(lengthBytes);
        stringToUTF8(str, stringOnWasmHeap, lengthBytes + 1);
        return stringOnWasmHeap;
    }
};
//模板文件操作类
let TempOperator = {
    //加载模板
    loadCel2: function (url, name, id) {
        if (url == "") {
            $.get(url, {"time": new Date().getTime()}, function (data, status) {
                let info = {url: url, name: name, id: id};
                name = ParamOperator.encodeStr(name);
                let str = ParamOperator.encodeStr(data);
                let t = Module._addSpreadSheet(name, str);
                initGDs();
            }).fail(function (XMLHttpRequest) {
                let st = XMLHttpRequest.getResponseHeader("sessionstatus");
                if (st) {
                    reDirect(st);
                } else {
                    layer.alert('模板不存在!')
                }
            });
        } else {
            addContentEvent();
            let t = Module._addSpreadSheet(ParamOperator.encodeStr(name), '');
        }
    }
};

function hideInput() {
    $("#editIframe").css({"border": "none", "width": "0", "height": "0"});
    $("#iframe").attr('width', 0);
    $("#iframe").attr('height', 0);
}

//canvas鼠标点击事件输入文本
function addContentEvent() {
    let mycanva = document.getElementsByTagName('canvas')[0];
    mycanva.onclick = function (event) {
        $('#contextMenu1').hide();
        event.preventDefault();
        MainEditor.setCurSpreadSheetEnabled(1);
        let cellRect = MainEditor.getSelCellRect();
        if (!cellRect) {
            return;
        }
        if (isSelect) { //触发了下拉框事件
            isSelect = false;
        } else {
            if ($('#singeSelDiv').css('display') != 'none') {
                $('#singeSelDiv').hide();
            }
            isSelect = false;
        }
        //控件不能为空且初始值为空时，双击未编辑值
        if (!isPreAllowNull && prevVal == '') {
            layer.alert('该控件不能为空');
            isPreAllowNull = true;
        }

        $("#editInput").css({
            "display": "block",
            "border": "none",
            "position": "absolute",
            "top": cellRect.top + $('#buttonDiv').height() + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height()),
            "left": cellRect.left,
            "width": "0",
            "height": "0"
        }).focus();
        $("#editInput").val(''); //清除输入框内容
        $("#editInput").unbind().bind('keydown', keyDownF);
    };
    mycanva.ondblclick = function (event) {
        let cellRect = MainEditor.getSelCellRect();
        let pos = ParamOperator.decodeStrAndFree(Module._getSelBeginCell());
        let posJ = JSON.parse(pos);
        $("#singleSel").hide();
        //可编辑状态下
        if (isEdit()) {
            $("#editInput").css({
                "position": "absolute",
                "display": "block",
                "border": "1px solid #44B4FF",
                "top": cellRect.top + $('#buttonDiv').height() + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height()),
                "left": cellRect.left,
                "width": cellRect.width - 1,
                "height": cellRect.height - 1,
                "z-index": 1001
            }).focus();

            let val = MainEditor.getSelCellText();
            prevVal = val;
            let control = ParamOperator.decodeStrAndFree(Module._getCellControlInfo(posJ.x, posJ.y));
            if (control != "") {
                let prop = JSON.parse(control);
                isPreAllowNull = prop.AllowNull;
            }
            $('#editInput').val(val);
            $("#editInput").unbind().bind('change', function () {
                let val = $(this).val();
                prevVal = val;
                let json = {
                    "x": posJ.x,
                    "y": posJ.y,
                    "text": val
                }
                $(this).val('');
                let controlInfo = ParamOperator.decodeStrAndFree(Module._getCellControlInfo(posJ.x, posJ.y));
                if (controlInfo != "") {
                    let props = JSON.parse(controlInfo);
                    let type = props.ControlType; //控件类型
                    //不允许为空
                    if (!props.AllowNull) {
                        if (val == '') {
                            layer.alert('该控件不能为空');
                            return false;
                        }
                    }
                    if (type == 1) {
                        //判断文本输入框的最大长度
                        if (0 !== props.MaxLength && props.MaxLength < val.length) {
                            layer.alert("该控件最多允许输入" + props.MaxLength + "个字符");
                            Module._releaseMouse();
                            $('#editInput').hide();
                            return false;
                        }
                        //判断文本输入框的最小长度
                        if (0 !== props.MinLength && props.MinLength > val.length) {
                            layer.alert("该控件至少须输入" + props.MinLength + "个字符");
                            Module._releaseMouse();
                            $('#editInput').hide();
                            return false;
                        }
                    }

                    if (type == 8) {//小数控件
                        if (isNaN(val)) {
                            layer.alert("该控件只允许输入数字");
                            Module._releaseMouse();
                            $('#editInput').hide();
                            return false;
                        }
                        //不允许小数
                        if (!props.AllowDecimal) {
                            if (val.indexOf(".") > -1) {
                                layer.alert("该控件值不允许小数");
                                Module._releaseMouse();
                                $('#editInput').hide();
                                return false;
                            }
                        } else {
                            if (val.indexOf(".") != -1) {//小数
                                //判断允许多少位小数
                                if (0 < props.decimalPlace && val.substring(val.indexOf(".") + 1).length > props.decimalPlace) {
                                    layer.alert("该控件值最多允许" + props.decimalPlace + "位小数");
                                    Module._releaseMouse();
                                    $('#editInput').hide();
                                    return false;
                                }
                            }
                        }

                        //判断是否能为负数
                        if (!props.AllowNegative && val.indexOf("-") > -1) {
                            layer.alert("该控件值不允许负数");
                            Module._releaseMouse();
                            $('#editInput').hide();
                            return false;
                        }
                        //判断最大值
                        if (0 !== props.MaxValue && Number(val) > props.MaxValue) {
                            layer.alert("该控件值允许的最大值为" + props.MaxValue);
                            Module._releaseMouse();
                            $('#editInput').hide();
                            return false;
                        }
                        //判断最小值
                        if (0 !== props.MinValue && Number(val) < props.MinValue) {
                            layer.alert("该控件值允许的最小值为" + props.MinValue);
                            Module._releaseMouse();
                            $('#editInput').hide();
                            return false;
                        }
                    }
                }
                Module._setCellText(ParamOperator.encodeStr(JSON.stringify(json)));

            })
        }

    };

}

//当前点击的单元格是否可编辑
function isEdit() {
    let b = Module._isAllowEditCurrCell();
    return b;
}

function isEditByXY(x, y) {
    let b = Module._isAllowEditCell(x, y);
    return b;
}

function isField() {
    return isColumn || isChart;
}

function inputChange(val) {
    MainEditor.setSelCellText(val);
}


function inputChange1(val) {
    let text = JSON.stringify(val);
    Module._setCellText(ParamOperator.encodeStr(text));
}

function editAreaChange(val) {
    $('#editArea').val(val);
}

function getV() {
    let v = $('#copyArea').val();
    showa(v);
}


//显示编辑框
function showInput(event) {
    let key = event.keyCode;
    if (event.ctrlKey) {
        if (key == 46) {
            $('#editInput').val(''); //删除输入框里面的内容
        }
        canvasData(5, event);
    } else {
        if ("36,37,38,39,40".indexOf(key) > -1) {
            canvasData(5, event);
            if ("37,38,39,40".indexOf(key) > -1) { //上下左右键 whj
                let val = MainEditor.getSelCellText(); //获取单元格文本 whj
                ////打开的话，初始化编辑栏的值 whj
                $('#editInput').val(val);
                let cellRect = MainEditor.getSelCellRect();

                $("#editInput").css({
                    "border": "none",
                    "position": "absolute",
                    "top": cellRect.top + $('#buttonDiv').height() + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height()),
                    "left": cellRect.left,
                    "width": "0",
                    "height": "0"
                });
                let canvas = document.getElementsByTagName('canvas')[0];
                $(canvas).trigger('click'); //触发单击事件获取编辑框焦点 whj
            }
            if (key == 9) {//Tab键，阻止系统默认事件
                event.preventDefault();
            }
        }
        //ESC
        if (key == 27) {
            $("#editInput").hide();
        }

        if (keysNone.indexOf(key) > 0) {
            return false;
        }
        if ((event.ctrlKey) && (key == 67)) {
            return false;
        }
        if ((event.ctrlKey) || (event.altKey)) {
            return false;
        }

        if (key == 46) {//delete 快捷键
            //Module._removeSelCellData(false, false);
            Module._setSelCellText("");
            $('#editInput').val(''); //删除输入框里面的内容
            return false;
        }
        $('canvas').trigger('dblclick');
    }
}


//button:0左 1中 2右
function canvasData(type, e) {
    // 此处屏蔽ctrl+V事件，由于浏览器不能读取剪切板内容
    //通过编辑框paste事件，setTimeout进行取值，然后通过_copyClipboardDataToSpreadsheet发送给c++控件的剪切板,再手动调用_paste函数进行粘贴操作，clipboardPaste事件不再进行响应

    if (e.keyCode == '67' && e.ctrlKey) {
        let text = ParamOperator.decodeStrAndFree(Module._getSelCellFormatText());
        $('#copyArea').val(text);
        $('#copyArea').select();
        document.execCommand("Copy"); //复制输入框的内容到剪切板
        return;
    }


    if (e.keyCode == '86' && e.ctrlKey) {
        //copyArea可以粘贴有格式的内容
        $('#copyArea').select();
        document.execCommand("paste"); //复制输入框的内容到剪切板
        setTimeout('getV()', 150);
        return;
    }

    let top = $('#buttonDiv').height(),
        left = 0;
    let data = {
        type: type
        , x: (e.clientX || 0) - left
        , y: (e.clientY || 0) - top
        , ctrlKey: e.ctrlKey
        , shiftKey: e.shiftKey
        , key: e.key || ''
        , keyCode: e.keyCode || 0
        , button: e.button || 0
    };
    let d = JSON.stringify(data);

    if (type == 3 || type == 4 || type == 5) {
        Module._keyMouseEvent(ParamOperator.encodeStr(d));
    } else {
        //canvas区域内
        if (data.y > 0 && ($("canvas").width() - data.x > 16) && ($("canvas").height() - 25 - data.y > 16)) {
            Module._keyMouseEvent(ParamOperator.encodeStr(d));
            if (e.button == 2) {
                showMenu(e.clientX, e.clientY);
            }
        }
    }
}

function showa(a) {
    let str = ParamOperator.encodeStr(a);
    Module._copyClipboardDataToSpreadsheet(str);
    Module._paste();
}

function paste() {
    Module._paste();
}

function encodeBase64(mingwen, times) {
    let code = "";
    let num = 1;
    if (typeof times == 'undefined' || times == null || times == "") {
        num = 1;
    } else {
        let vt = times + "";
        num = parseInt(vt);
    }
    if (typeof mingwen == 'undefined' || mingwen == null || mingwen == "") {
    } else {
        $.base64.utf8encode = true;
        code = mingwen;
        for (let i = 0; i < num; i++) {
            code = $.base64.btoa(code);
        }
    }
    return code;
};

//内核主动调用，必须要实现
let SpreadsheetEvent = {
    showEvt: function () {
        let height = $('#canvas').attr('height'); //获取canvas高度
        if (height <= 1000) {
            height = parseInt(height);
            //Module._setLogicalZoom(height);
        }
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
        return;
    },
    //剪切板复制事件
    clipboardCopyEvt: function (str) {
        $("#copyArea").val(ParamOperator.decodeStrAndFree(str));
        $("#copyArea").select();
        document.execCommand("Copy");
    },
    //剪切板粘贴事件
    clipboardPasteEvt: function () {
        //console.log($("#cp").val()+'...');
        //let ss = ParamOperator.encodeStr($("#cp").val());
        //console.log('粘贴回调' + ss);
        //Module._copyClipboardDataToSpreadsheet(ss);
    },
    focusInEvt: function () {
    },
    focusOutEvt: function () {
    },
    //画布鼠标右键点击事件
    mouseReleaseEvt: function (a, b, c) {
        let sheetType = Module._currSheetType(); //获取当前sheet类型
        let flag = Module._isSelectedShape(); //当前选中的是否是悬浮元素
        let toolHeight = $('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height(); //参数工具栏高度
        let expandHeight = Module._getFoldPanelXHeight();
        let expandWidth = Module._getFoldPanelYWidth();
        if (expandHeight == -1) {
            expandHeight = 0;
        }
        if (expandWidth == -1) {
            expandWidth = 0;
        }
        if (!flag) {
            if (2 == c) {//鼠标右键点击画布事件
                let x = 25 + b + toolHeight + expandHeight, y = a + expandWidth;
                showMenu(y, x);
            }
        }
    },
    tabBarMousePressEvt: function (a, b, c) {
        if (c == 2) {
            let x = 25 + getTopHeight() + b,
                y = getLeftWidth() + a;
            showBottomeMenu(y, b);
        }
    },
    //单击模板标签事件，type 1 左键 2 右键
    tabBarClickedEvt: function (x, y, type) {
        if (2 == type) {
            MainEditor.setCurSpreadSheetEnabled(0);
            let left = x + getLeftWidth();
            let top = 25 + getTopHeight() + $('.editArea').height();
            $(".rightmenu").css({left: left, top: top}).show();
            $(".rightmenu").mouseover();
        }
    },
    //模板关闭,模板索引  whj
    removeSpreadSheetEvt: function (index) {
        let isChange = Module._isChanged();
        if (1 == isChange) {
            layer.confirm('是否保存模板?', {
                btn: ['是', '否', '取消']
            }, function () {//是
                if (1 == $("#design").val()) {
                    layer.alert("演示环境不能修改", {icon:2});
                    return false;
                }
                let temp = TempOperator.getCurrentTemp();
                getJson(base + "/designSys/checkTempName?name=" + temp.name + "&id=" + temp.id, "get", "", function (data) {
                    if (isNull(data) && $.inArray(temp.name, allTempName) == -1) {
                        layer.alert('模板名称已经存在');
                    } else {
                        let res = _checkUploadNameRepeat();//重复填报名
                        let res1 = _checkControlNameRepeat(); // 重复控件名
                        let res2 = _checkAllAddRowButtonCount(); //
                        let res3 = _checkUploadCellSameChain(); //
                        if (res == '' && res1 == '' && res2 == '' && res3 == '') {

                            let name = temp.name;
                            removeTempDs(name); //清除缓存中的DS whj
                            let t = TempOperator.removeTemp(index);
                            let text = ParamOperator.decodeStrAndFree(t);
                            let obj = JSON.parse(text);
                            TempOperator.save(obj.file, 0, temp);
                            removeDs(index);
                            hideInput();

                        } else {
                            if (res != '') {
                                layer.alert('有重复的填报名,请修改!');
                            } else if (res1 != '') {
                                layer.alert('有重复的控件名,请修改!');
                            } else if (res2 != '') {
                                layer.alert('每个sheet上只能有一个增加行按钮,请修改');
                            } else if (res3 != '') {
                                layer.alert('填报信息从表中存在单元格数据链交叉引用,请修改!');
                            }

                        }


                    }
                });
            }, function () {//否
                let all = Module._getAllSpreadSheetName();
                let name = TempOperator.getCurrentTemp().name;
                removeTempDs(name); //清除缓存中的DS whj
                let t = TempOperator.removeTemp(index);
                let text = ParamOperator.decodeStrAndFree(t);
                removeDs(index);
                hideInput();
            }, function () {//取消
            });
        } else {
            let t = TempOperator.removeTemp(index);
            let text = ParamOperator.decodeStrAndFree(t);
            removeDs(index);
        }
    },
    /*** 鼠标双击事件
     *  x 鼠标横坐标 y 鼠标纵坐标 sheetIndex 当前sheet索引:0  单元格列值row 单元格行值
     */
    mouseDoubleClickedEvt: function (x, y, sheetIndex, column, row) { //whj
        let flag = _isSelCellPluginInfo(); //判断当前单元格是否是插件;

        let cell = MainEditor.getSelCellRect(); //获取当前单元格
        let width = cell.width; //单元格宽度
        let height = cell.height; //单元格高度
        if (flag) {
            let pluginInfo = _pluginInfo(); //获取插件属性
            let type = ParamOperator.decodeStrAndFree(_pluginType()); //获取插件类型
            let option = ParamOperator.decodeStrAndFree(pluginInfo);
            let name = TempOperator.getCurrentTemp().name; //当前模板名
            $.ajax({
                url: base + "/plugin/storageOption",
                type: "post",
                dataType: "json",
                data: {"option": option, "type": type},
                success: function (res) {
                    let uuid = res.uuid;
                    let url = res.url;
                    x_admin_show("图表插件", base + "/plugin/toTemplate?column=" + column + "&row=" + row + "&width=" + width + "&height=" + height + "&uuid=" + uuid + "&type=" + type + "&url=" + url + "&name=" + name + "&isShape=N", 820, 563);

                },
                error: function () {
                }

            })

        }

    },
    /*
     * 双击悬浮元素事件
     * */
    doubleClickedShapePlugin: function (x, y, sheetIndex, pluginName) {
        let pluginInfo = _selShapePluginInfo(); //获取插件属性
        if (pluginInfo == 0) {
            Module._cancelShapeOperationState(); //取消焦点
            return;
        }
        let size = ParamOperator.decodeStrAndFree(_getSelShapeSize());
        let sizeJ = JSON.parse(size);
        let width = sizeJ.width;
        let height = sizeJ.height;

        let type = ParamOperator.decodeStrAndFree(_selShapePluginType()); //获取插件类型
        let option = ParamOperator.decodeStrAndFree(pluginInfo);
        let name = TempOperator.getCurrentTemp().name; //当前模板名
        $.ajax({
            url: base + "/plugin/storageOption",
            type: "post",
            dataType: "json",
            data: {"option": option, "type": type},
            success: function (res) {
                let uuid = res.uuid;
                let url = res.url;
                x_admin_show("图表插件", base + "/plugin/toTemplate?column=" + 1 + "&row=" + 1 + "&width=" + width + "&height=" + height + "&uuid=" + uuid + "&type=" + type + "&url=" + url + "&name=" + name + "&isShape=Y", 820, 563);
            },
            error: function () {
            }

        })
        Module._cancelShapeOperationState(); //取消焦点
    },
    /**
     * 鼠标点击事件
     */
    mouseClickEvt: function (x, y, sheetIndex, column, row, type) {

    },
    mousePressEvt: function (a, b, c) {  //canvas左键单击事件
        //隐藏所有菜单

    },
    clickColTagEvt: function (type) {

        $('#contextMenu1').find('#rowHeight').show(); //隐藏行操作
        $('#contextMenu1').find('#rows').show();

        $('#contextMenu1').find('#lineWidth').hide(); //隐藏行操作
        $('#contextMenu1').find('#cells').hide();
    },
    /**
     * 鼠标状态改变
     * type 鼠标改变类型
     */
    addSheetEvt: function (type) {
    },
    keyPressEvt: function (text, a, b, c) {

    },
    mouseMoveEvt: function () {

    },
    //模板标签切换事件，返回 改变后的 模板索引
    tableChangeEvt: function (index) {

        //tabChange(index);
    },
    //切换sheet事件
    sheetChangedEvt: function () {
        let index = Module._getCurrentSheet();
        $('div[id^="backgroundDiv"]').hide();
        $('#backgroundDiv' + index).show();
        $('#backgroundDiv' + index).children('div').show();
    },
    selFrameChangedEvt: function ($0, $1, $2, $3) {
        //initCellAttr();
    },
    clickRowTagEvt: function () {

    },
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
        if (1 == type) {
            $("canvas").css("cursor", "url(" + base + "/images/design/shubiao3.png) 14 8,auto");
        } else if (2 == type) {
            $("canvas").css("cursor", "url(" + base + "/images/design/cursor/01.png) 16 16,auto");
        } else if (3 == type) {
            $("canvas").css("cursor", "url(" + base + "/images/design/cursor/04.png) 16 16,auto");
        } else if (4 == type) {
            $("canvas").css("cursor", "url(" + base + "/images/design/cursor/03.png) 16 16,auto");
        } else if (5 == type) {
            $("canvas").css("cursor", "url(" + base + "/images/design/cursor/05.png) 18 18,auto");
        } else if (7 == type) {
            $("canvas").css("cursor", "move");
        } else if (8 == type) {
            $("canvas").css("cursor", "url(" + base + "/images/design/cursor/02.png) 16 16,auto");
        } else {
            $("canvas").css("cursor", "default");
        }
    },

    /**
     *  *Description: 设计器滚动条滚动事件
     *  1: type, 类型 0水平 , 1垂直
     *  2: curPos,当前位置
     *  3: total,总值
     *  4: offsetX,水平偏移值
     *  5: offsetY,垂直偏移值
     */
    scrollBarEvt: function (type, curPos, total, offsetX, offsetY) {

        let index = Module._getCurrentSheet(); //获取当前sheet索引值

        //设计器滚动条滚动的时候，设置contentDiv的偏移值
        $('#contentDiv' + index).css('left', parseInt($('#contentDiv' + index).css('left')) + offsetX);
        $('#contentDiv' + index).css('top', parseInt($('#contentDiv' + index).css('top')) + offsetY);
    },
    leftParentChangedEvt: function ($0, $1, $2, $3) {

    },
    topParentChangedEvt: function ($0, $1, $2, $3) {

    },
    removeSheetEvt: function () {
    },
    /*********************************************************************************
     *Function:    EM_ASM_({SpreadsheetEvent.comboBoxClicked($0,$1,$2,$3,$4,$5,$6,$7,$8);},
     nX,nY,nButton,sheetIndex,col,row,pRect,pList,isShowEditBox);
     *Description: comboBox点击事件
     *Param:   1:int[out]鼠标坐标x
     *             2:int[out]鼠标坐标y
     *             3:int[out]左右键:1左键2右键
     *             4:int[out]sheet页索引
     *             5.int[out]单元格列
     *             6.int[out]单元格行
     *             7.const char*[out]矩形位置大小{"X":100.0,"Y":"100.0","Width":40.0,"Height":"20.0"}
     *             8.const char*[out]下拉值["A","B","C",...]
     *             9.bool[out]是否可编辑
     *Return:
     *Others:
     **********************************************************************************/
    comboBoxClicked: function (nX, nY, nButton, sheetIndex, col, row, pRect, pList, sList, isMulti, isShowEditBox) {

        isSelect = true;
        var rect = JSON.parse(ParamOperator.decodeStrAndFree(pRect));
        var data = JSON.parse(ParamOperator.decodeStrAndFree(pList));
        var text = JSON.parse(ParamOperator.decodeStrAndFree(sList));
        $('#singeSelDiv').empty();
        var val = ParamOperator.decodeStrAndFree(Module._getSelCellText());
        $.each(data, function (index, element) {
            if (isMulti) {
                var valArr = val.split(',');
                if ($.inArray(element, valArr) != -1) {
                    $("#singeSelDiv").append('<div style="width:100%;height:20px;line-height:20px;"><input type="checkbox" style="pointer-events: none;" name="checkInput" checked value="' + element + '"><span>' + text[index] + '</span></div>');
                } else {
                    $("#singeSelDiv").append('<div style="width:100%;height:20px;line-height:20px;"><input type="checkbox" style="pointer-events: none;" name="checkInput" value="' + element + '"><span>' + text[index] + '</span></div>');
                }
            } else {
                if (val == element) {
                    $("#singeSelDiv").append('<div style="width:100%;height:20px;line-height:20px;"><input type="radio" name="radioInput" checked value="' + element + '"><span>' + text[index] + '</span></div>');
                } else {
                    $("#singeSelDiv").append('<div style="width:100%;height:20px;line-height:20px;"><input type="radio" name="radioInput" value="' + element + '"><span>' + text[index] + '</span></div>');
                }
            }

        });

        if (isMulti) {
            $("#singeSelDiv").css({
                "position": "absolute",
                "border": "1px solid #44B4FF",
                "top": rect.Y + $('#buttonDiv').height() + rect.Height + 1 + $('#_field_').height(),
                "left": rect.X + 1,
                "width": rect.Width - 1,
                "height": 20 * data.length + 1,
                "background-color": 'white',
                "z-index": 1007
            }).show();

            $('input[name="checkInput"]').bind('checked', function () {
                var text = '';
                var length = $('input[name="checkInput"]:checked').length;
                $.each($('input[name="checkInput"]:checked'), function (index, element) {
                    if (index == length - 1) {
                        text += $(this).val();
                    } else {
                        text += ($(this).val() + ',');
                    }
                });

                var str = ParamOperator.encodeStr(text);
                var t = Module._setSelCellText(str);
            });

            $("#singeSelDiv").children('div').bind('click', function () {
                var checkbox = $(this).children('input[type="checkbox"]');
                if (checkbox.prop('checked')) {
                    checkbox.prop('checked', false);
                } else {
                    checkbox.prop('checked', true);
                }
                checkbox.trigger('checked');
            })

        } else {

            $("#singeSelDiv").css({
                "position": "absolute",
                "border": "1px solid #44B4FF",
                "top": rect.Y + $('#buttonDiv').height() + rect.Height + 1 + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height()),
                "left": rect.X + 1,
                "width": rect.Width - 1,
                "height": 20 * data.length + 1,
                "background-color": 'white',
                "z-index": 1007
            }).show();

            $('input[name="radioInput"]').bind('change', function () {
                var checkVal = $('input[name="radioInput"]:checked').val()
                var str = ParamOperator.encodeStr(checkVal);
                var t = Module._setSelCellText(str);
                $("#singeSelDiv").empty().hide();
            });

            $("#singeSelDiv").children('div').bind('click', function () {
                var radio = $(this).children('input[type="radio"]');
                radio.prop('checked', true);
                radio.trigger('change');
            })
        }


            /* isSelect = true;
            let rect = JSON.parse(ParamOperator.decodeStrAndFree(pRect));
            let data = JSON.parse(ParamOperator.decodeStrAndFree(pList));
            let text = JSON.parse(ParamOperator.decodeStrAndFree(sList));
            $('#singeSelDiv').empty();
            let val = ParamOperator.decodeStrAndFree(Module._getSelCellText());
            var valArr = val.split(',');
            let dataArray = [];
            $.each(data, function (index, element) {
                let dataObj = {};
                dataObj.name = text[index];
                dataObj.value = element;
                if ($.inArray(element, valArr) != -1) {
                    dataObj.selected = true;
                }
                dataArray.push(dataObj);
            });

            if (isMulti) { //多选
                $("#singeSelDiv").css({
                    "position": "absolute",
                    "top": rect.Y + $('#buttonDiv').height() + rect.Height + 1 + $('#_field_').height(),
                    "left": rect.X + 1,
                    "width": rect.Width - 1,
                    "height": 20 * data.length + 1,
                    "z-index": 1007
                }).show();

                xmSelect.render({
                    el: '#singeSelDiv',
                    clickClose: true,
                    data: dataArray,
                    on: function(data){
                        //arr:  当前多选已选中的数据
                        var arr = data.arr;
                        //change, 此次选择变化的数据,数组
                        var change = data.change;
                        //isAdd, 此次操作是新增还是删除
                        var isAdd = data.isAdd;

                        //可以return一个数组, 代表想选中的数据
                        //return []
                    },
                })
            } else {

                $("#singeSelDiv").css({
                    "position": "absolute",
                    "top": rect.Y + $('#buttonDiv').height()  + 1 + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height()),
                    "left": rect.X + 1,
                    "width": rect.Width - 1,
                    "height": 20 * data.length + 1,
                    "z-index": 1007
                }).show();

                xmSelect.render({
                    el: '#singeSelDiv',
                    radio: true,
                    clickClose: true,
                    data: dataArray,
                    on: function(data){
                        //arr:  当前多选已选中的数据
                        var arr = data.arr;
                        //change, 此次选择变化的数据,数组
                        var change = data.change;
                        //isAdd, 此次操作是新增还是删除
                        var isAdd = data.isAdd;

                        //可以return一个数组, 代表想选中的数据
                        //return []
                    },
                })*/

           /* $('input[name="radioInput"]').bind('change', function () {
                let checkVal = $('input[name="radioInput"]:checked').val()
                let str = ParamOperator.encodeStr(checkVal);
                let t = Module._setSelCellText(str);
                $("#singeSelDiv").empty().hide();
            });

            $("#singeSelDiv").children('div').bind('click', function () {
                let radio = $(this).children('input[type="radio"]');
                radio.prop('checked', true);
                radio.trigger('change');
            })*/
    },
    /**
     * 设置是否控件显示
     * */
    setSpreadReport: function (flag) {


    },
    /**
     * 获取是否控件显示
     * */
    isSpreadReport: function () {

    },
    /*********************************************************************************
     *Function:    int addDataRow(bool isCopyData)
     *Description: 添加数据添
     *Param:  bool[in]是否拷贝上一数据行
     *Return:  0,无意义;-１失败
     *Others:
     **********************************************************************************/
    addDataRow: function (flag) {

    },
    /*********************************************************************************
     *Function:    EM_ASM_({SpreadsheetEvent.comboBoxClicked($0,$1,$2,$3,$4,$5,$6,$7,$8);},
     nX,nY,nButton,sheetIndex,col,row,pRect,pList,isShowEditBox);
     *Description: 时间控件点击事件
     *Param:   1:int[out]鼠标坐标x
     *             2:int[out]鼠标坐标y
     *             3:int[out]左右键:1左键2右键
     *             4:int[out]sheet页索引
     *             5.int[out]单元格列
     *             6.int[out]单元格行
     *             7.const char*[out]矩形位置大小{"X":100.0,"Y":"100.0","Width":40.0,"Height":"20.0"}
     *             8.const char*[out]日期值
     *             9.bool[out]是否有时间
     *Return:
     *Others:
     **********************************************************************************/
    dateControlClicked: function (nX, nY, nButton, sheetIndex, col, row, pRect, hasTime) {
        let rect = JSON.parse(ParamOperator.decodeStrAndFree(pRect));
        if (hasTime) {
            $("#timeInput").css({
                "position": "absolute",
                "top": rect.Y + $('#buttonDiv').height() + 1 + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height()),
                "left": rect.X + 1,
                "width": 1,
                "height": rect.Height - 1,
                "z-index": 1008
            }).show().focus();
        } else {
            $("#dateInput").css({
                "position": "absolute",
                "top": rect.Y + $('#buttonDiv').height() + 1 + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height()),
                "left": rect.X + 1,
                "width": 1,
                "height": rect.Height - 1,
                "z-index": 1008
            }).show().focus();
        }

        if (hasTime) { //日期时间
            $("#timeInput").unbind().bind('click', function () {
                laydate.render({
                    elem: '#timeInput'  , //指定元素,
                    format:'yyyy-MM-dd HH:mm:ss',
                    show:true,
                    done: function(value, date, endDate) {
                        setText(value);
                    }
                });
            });
            $("#timeInput").trigger('click');
        } else {//日期
            $("#dateInput").unbind().bind('click', function () {
                laydate.render({
                    elem: '#dateInput'  , //指定元素,
                    format:'yyyy-MM-dd',
                    shwo:true,
                    done: function(value, date, endDate) {
                        setTextD(value);
                    }
                });
            });
            $("#dateInput").trigger('click');
        }
    },

    /*********************************************************************************
     *Function:    int removeDataRow()
     *Description: 删除数据行
     *Param:
     *Return:  0,无意义;-１失败
     *Others:
     **********************************************************************************/
    removeDataRow: function () {

    },
    /*********************************************************************************
     *Function:    const char* getAllUpdateDataInfo()
     *Description: 获取填报数据信息
     *Param:
     *Return:  空;填报数据信息
     *Others:
     **********************************************************************************/
    getAllUpdateDataInfo: function () {

    },
    /*********************************************************************************
     *Function:    int loadReportModelFromJsonStream(const char* byteArray)
     *Description: 加载数据填报模板数据
     *Param:  const char*[in]模板数据
     *Return:
     *Others:
     **********************************************************************************/
    loadReportModelFromJsonStream: function (byteArray) {

    },
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
     *             7.上传后是否显示图片
     * Return:
     * Others:
     *
     * */
    fileUploadClicked: function ($0, $1, $2, $3, $4, $5, $6) {
        //是否显示图片
        isShowPic = $6;
        $('#fileBut').trigger('click');
    },
    /**
     *
     *
     * Description: sheet标签拖拽事件
     * Param:      1:int[from]
     *             2:int[to]
     * Return:
     * Others:
     *
     * */
    sheetMoved: function (from, to) {


        let fromBgDiv = $('#backgroundDiv' + from);
        let toBgDiv = $('#backgroundDiv' + to);

        toBgDiv.attr("id", "backgroundDivTemp");
        fromBgDiv.attr("id", 'backgroundDiv' + to);
        toBgDiv.attr("id", 'backgroundDiv' + from);

        let fromDiv = $('#contentDiv' + from);
        let toDiv = $('#contentDiv' + to);

        toDiv.attr("id", "contentDivTemp");
        fromDiv.attr("id", 'contentDiv' + to);
        toDiv.attr("id", 'contentDiv' + from);


    }

};


/**
 * 打印和导出操作前，弹出sheet页列表
 * */
function showSheetNamer(type) {
    if (isAlert == 'true') { //平台属性默认弹框
        let sheet = ParamOperator.decodeStrAndFree(Module._getAllSheetName());
        sheet = JSON.parse(sheet);
        let sheetName = sheet.sheetName;
        if (sheetName.length == 1) { //只有一个sheet页时
            if (type == 0) { //打印
                printR("Y");
            } else if (type == 1) { //导出PDF
                exportPdfR("Y");
            } else if (type == 2) {//导出EXCEL分页
                exportExcelR(1, "Y");
            } else if (type == 3) {//导出EXCEL不分页
                exportExcelR(0, "Y");
            } else if (type == 4) {//导出EXCEL不分页
                exportExcelBySheetR("Y");
            } else if (type == 5) {//导出EXCEL不分页
                exportWordR("Y");
            }
        } else {
            let index = layer.open({
                type: 2,
                area: ['500px', '500px'],
                closeBtn: 0,
                maxmin: true,
                title: ['选择sheet', 'height:30px;line-height:30px'],
                content: [base + '/sheetName.html', 'no'],
                btn: ['全选', '确定', '关闭'],
                resize: false,
                btnAlign: 'c',
                end: function () {

                },
                success: function (layero, index) {
                    let others = [];
                    let sheets = ParamOperator.decodeStrAndFree(Module._getAllSheetName());
                    sheets = JSON.parse(sheets);
                    let sheetNames = sheets.sheetName;
                    $.each(sheetNames, function (i, e) {
                        let sheetName = e;//获取sheet名
                        others.push(sheetName);
                    })
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(others);
                    $('.layui-layer-btn0').text('全不选');
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
                    let res = iframeWin.getSheetNames(); //获取所有sheet名称
                    let flag = res.chooseAll; //是否全选
                    if (type == 0) { //打印
                        printR(flag, res.sheet);
                    } else if (type == 1) { //导出PDF
                        exportPdfR(flag, res.sheet);
                    } else if (type == 2) {//导出EXCEL分页
                        exportExcelR(1, flag, res.sheet);
                    } else if (type == 3) {//导出EXCEL不分页
                        exportExcelR(0, flag, res.sheet);
                    } else if (type == 4) {//导出EXCEL不分页
                        exportExcelBySheetR(flag, res.sheet);
                    } else if (type == 5) {//导出EXCEL不分页
                        exportWordR(flag, res.sheet);
                    }
                }
            });
        }

    } else {
        if (type == 0) { //打印
            printR("Y");
        } else if (type == 1) { //导出PDF
            exportPdfR("Y");
        } else if (type == 2) {//导出EXCEL分页
            exportExcelR(1, "Y");
        } else if (type == 3) {//导出EXCEL不分页
            exportExcelR(0, "Y");
        } else if (type == 4) {//导出EXCEL不分页
            exportExcelBySheetR("Y");
        } else if (type == 5) {//导出EXCEL不分页
            exportWordR("Y");
        }
    }


}
