function exportUrt() {
    //导出内容
    let sval = DesignModule._saveURTToJson();
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
    let data = ParamOperator.decodeStrAndFree(DesignModule._getAllUpdateDataInfo());
    //获取自定义填报
    let json = ParamOperator.decodeStrAndFree(DesignModule._customUploadInfo());
    let obj = JSON.parse(json);
    let isJSUpload = true;
    if (obj.length >= 1) {
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
        let data = ParamOperator.decodeStrAndFree(DesignModule._getAllUpdateDataInfo());
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
            let json1 = JSON.parse(ParamOperator.decodeStrAndFree(DesignModule._customUploadInfo()));
            $.each(json1, function (index, element) {
                let records = element.CustomUploadItems;
                $.each(records, function (i, e) {
                    let sqlStrs = e.SqlStr;
                    /* $.each(sqlStrs, function (ii, ee) {
                         let sql = ee;
                         html += '<div style="padding:5px;">' + sql + '</div>';
                     })*/
                    html += '<div style="padding:5px;">' + sqlStrs + '</div>';

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
    if (isProduction != 'true') {
        layer.msg('演示环境不允许提交');
        return;
    }
    DesignModule._clearInvaildCellInfos();
    if (!isShowExpress) {
        layer.alert('公式状态下不能提交和数据校验!')
        return false;
    }
    //最终提交的数据
    let json;
    let customFlag = false;

    //获取自定义填报信息
    let cusJson = ParamOperator.decodeStrAndFree(DesignModule._customUploadInfo());
    let obj = JSON.parse(cusJson);
    let isJSUpload = true;
    if (obj.length >= 1) {
        //自定义js填报
        if (obj[0].JSUploadStr != "") {
            let result = executeFunction(obj[0].JSUploadStr);
            let sqlStrs = result.split(";");
            //填充sql内容
            //"[{\"customRecords\":[{\"conn\":\"demo\",\"sqlStrs\":[],\"uploadName\":\"\"}],\"sheetName\":\"sheet1\"}]"
            let data = ParamOperator.decodeStrAndFree(DesignModule._getAllUpdateDataInfo());
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
        let data = ParamOperator.decodeStrAndFree(DesignModule._getAllUpdateDataInfo());
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
        let data = ParamOperator.decodeStrAndFree(DesignModule._getAllUpdateDataInfo());
        json = JSON.parse(data);
        let params = getParams(); //获取所有的模板参数
        let paramArr = params.split(';');
        let paramData = [];
        $.each(paramArr, function (i, e) {
            if (e != '') {
                let paramInfo = e.split('=');
                let key = paramInfo[0];
                let value = paramInfo[1];
                let dataType = pTypeMap[key];
                let str;
                if (dataType == '1') {
                    str = 'String';
                } else if (dataType == '2') {
                    str = 'Int';
                } else if (dataType == '3') {
                    str = 'Double';
                } else if (dataType == '4') {
                    str = 'DateTime';
                } else {
                    str = 'Boolean';
                }
                let data = {
                    'key': key,
                    'dataType': str,
                    'value': value
                }
                paramData.push(data);
            }
        })
        $.ajax({
            url: encodeURI(base + "/report/updateData?" + "templateId=" + id + "&params=" + JSON.stringify(paramData) + "&type=" + type + "&sheetName=" + curSheet + "&uploadInfo=" + uploadInfos + '&token=' + token + '&pathId=' + pathId + '&templateName=' + templateName),
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
                        if (type == 2) {
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
                    DesignModule._loadInvaildCellInfosFromStream(ParamOperator.encodeStr(resp.text));
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
        /*  data = data.replace(/\+/g, "%2B");*/
        let postParam = encodeURI(data);
        /* postParam = encodeBase64(postParam);*/
        let params = getParams(); //获取所有的模板参数
        let paramArr = params.split(';');
        let paramData = [];
        $.each(paramArr, function (i, e) {
            if (e != '') {
                let paramInfo = e.split('=');
                let key = paramInfo[0];
                let value = paramInfo[1];
                let dataType = pTypeMap[key];
                let str;
                if (dataType == '1') {
                    str = 'String';
                } else if (dataType == '2') {
                    str = 'Int';
                } else if (dataType == '3') {
                    str = 'Double';
                } else if (dataType == '4') {
                    str = 'DateTime';
                } else {
                    str = 'Boolean';
                }
                let data = {
                    'key': key,
                    'dataType': str,
                    'value': value
                }
                paramData.push(data);
            }
        })
        $.ajax({
            url: encodeURI(base + "/report/customUpdateData?" + "templateId=" + id + "&params=" + JSON.stringify(paramData) + "&type=" + type + "&sheetName=" + curSheet + "&uploadInfo=" + uploadInfos + '&token=' + token),
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
                    DesignModule._loadInvaildCellInfosFromStream(ParamOperator.encodeStr(resp.text));
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
    let val = ParamOperator.decodeStrAndFree(DesignModule._getSelCellText());
    layer.open({
        type: 1
        ,
        title: false //不显示标题栏
        ,
        closeBtn: true
        ,
        area: ['400px', '200px']
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
        content: '<div style="padding: 30px; line-height: 22px; background-color: #ffffff; color: #000000; font-weight: 300;word-break:break-all;">' + val + '</div>'
        ,
        success: function (layero) {

        }
    });
}

function clearText() {
    DesignModule._clearInvaildCellInfos();
}

function addRowR() {
    DesignModule._addDataRow(false);
}

function cloneRowR() {
    DesignModule._addDataRow(true);
}

function deleteRowR() {
    DesignModule._removeDataRow();
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
        let t = DesignModule._setSelCellText(str);
    } else {//单选
        let str = ParamOperator.encodeStr(val);
        let t = DesignModule._setSelCellText(str);
    }
    if ($.isArray(val)) {

    } else {
        $("#singleSel").hide();
    }


}

function setText(val) {
    //let val = $('#timeInput').val();
    let str = ParamOperator.encodeStr(val);
    let t = DesignModule._setSelCellText(str);
    $('#timeInput').val('');
    $('#timeInput').hide();
}

function setTextD(val) {
    let str = ParamOperator.encodeStr(val);
    let t = DesignModule._setSelCellText(str);
    $('#dateInput').val('');
    $('#dateInput').hide();
}

function showMenu(x, y) {
    $("#rightRowClickMenu").css({left: x, top: y}).show();
    $("#rightRowClickMenu").mouseover();
}

function switchR() {
    let flag = DesignModule._isShowExprValue();
    if (flag) {
        DesignModule._setShowExprValue(false);
        isShowExpress = false;
        $('#switch').text('显示值');
        $('#normal-switch').text('显示值');
    } else {
        DesignModule._setShowExprValue(true);
        isShowExpress = true;
        $('#switch').text('显示公式');
        $('#normal-switch').text('显示公式');
    }

}

function switchL() {
    let flag = DesignModule._isShowColRowShadow();
    if (flag) {
        DesignModule._setShowColRowShadow(false);
        $('#line-switch').text('显示阴影');
    } else {
        DesignModule._setShowColRowShadow(true);
        $('#line-switch').text('不显示阴影');
    }
}

function printR(cflag, sheetNames) {

    let sval = DesignModule._saveAsToStream();//临时保存
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
    let sval = DesignModule._saveAsToStream();//临时保存
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
                    window.open(base + '/report/expExcelR?name=' + name + '&flag=' + flag + '&params=' + "&cflag=" + cflag + "&sheet=" + sheetNames + "&token=" + token + "&templateId=" + id);

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
    let sval = DesignModule._saveAsToStream();//临时保存
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
                    window.open(base + '/report/expBySheetR?name=' + name + '&params=' + "&cflag=" + cflag + "&sheet=" + sheetNames + "&token=" + token + "&templateId=" + id);

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
    let sval = DesignModule._saveAsToStream();//临时保存
    let text = ParamOperator.decodeStrAndFree(sval);
    if (!isNull(text)) {
        let temp = randomUUID();
        let blob = new Blob([text], {type: 'application/json'});
        let formdata = new FormData();
        formdata.append('file', blob);
        formdata.append('fileName', temp);
        $.ajax({
            //生成臨時文件
            url: base + '/report/generate?type=2' + '&flag=true' + '&token=' + token + '&id=' + id,
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
    let sval = DesignModule._saveAsToStream();//临时保存
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

function hyperlink(data1, x, y) {
    data1 = JSON.parse(data1);
    if (data1.length > 1) { //如果有多个超级链接选项
        $('#dsMenu').empty();
        $.each(data1, function (i, e) {
            let linkName = e.LinkName;
            $('#dsMenu').append("<li><a onclick='processHyperLink(" + JSON.stringify(data1) + "," + i + ")'>" + linkName + "</a></li>");
        })
        $("#dsMenu").css({position: 'absolute', left: x, top: y}).show();
    } else {
        processHyperLink(data1, 0);
    }
}

function processHyperLink(data1, index) {
    $('#dsMenu').hide();
    let linkObj = data1[index],
        _templet = linkObj.Templet, //模板名
        _params = linkObj.Params, //参数
        _URL = linkObj.Url,
        _OT = linkObj.OpterationType,
        _WS = linkObj.WindowStyle,
        linkName = linkObj.LinkName;
    let templateId;
    if (linkObj.tempId == null) { //通过计算得到的模板ID
        templateId = _templet;
    } else {
        templateId = linkObj.tempId;
    }
    selfparam = getParams();//主页面的参数，用于返回后直接查询
    if (3 === _OT) { //sheet页面跳转
        DesignModule._setCurrentSheetByName(ParamOperator.encodeStr(linkObj.sheetName));
        return;
    }
    if (_WS === 2) {//新窗口
        if (1 === _OT) {// 打开模板
            window.open(base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname);
        } else if (2 === _OT) {// 打开http链接
            if (_URL.indexOf("http") == -1 && _URL.indexOf("https") == -1) {
                _URL = "http://" + _URL;
            }
            window.open(_URL, linkName);
        } else {
            throw new Error("Illegal Argument Error");
        }
    } else if (_WS === 1) {//当前窗口
        if (1 === _OT) {//  打开模板
            location.href = base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname;
        } else if (2 === _OT) {// 打开http链接
            if (_URL.indexOf("http") == -1 && _URL.indexOf("https") == -1) {
                _URL = "http://" + _URL;
            }
            location.href = _URL;
        } else {
            throw new Error("Illegal Argument Error");
        }
    } else if (_WS === 3) {//模态窗口

        var width = linkObj.width;
        var height = linkObj.height;

        if (width.indexOf("%") != -1) { //百分比
            width = width.substring(0, width.length - 1);
            width = $(window).width() * width / 100;
        } else {
            width = (parseInt(width) == 0 ? 1 : parseInt(width));
        }

        if (height.indexOf("%") != -1) {
            height = height.substring(0, height.length - 1);
            height = $(window).height() * height / 100;
        } else {
            height = parseInt(height) == 0 ? 1 : parseInt(height);
        }

        if (1 === _OT) {//  打开模板
            var left = linkObj.left;
            var top = linkObj.top;
            let openUrl = base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname;
            if (left == "" && top == "") { //上和左都没有填，默认居中
                layer.open({
                    type: 2,
                    title: ['', 'height:1px;'],
                    closeBtn: 2, //不显示关闭按钮
                    shade: [0],
                    area: [width + 'px', height + 'px'],
                    anim: 2,
                    content: [openUrl, 'no'] //iframe的url，no代表不显示滚动条
                });
            } else {
                if (left != "") {
                    if (left.indexOf("%") != -1) { //百分比
                        left = left.substring(0, left.length - 1);
                        left = $(window).width() * left / 100;
                    } else {
                        left = (parseInt(left) == 0 ? 1 : parseInt(left));
                    }
                } else {
                    left = 1;
                }
                if (top != "") {
                    if (top.indexOf("%") != -1) {
                        top = top.substring(0, top.length - 1);
                        top = ($(window).height() - ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) - ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height())) * top / 100 + ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height());
                    } else {
                        top = (parseInt(top) == 0 ? 1 : parseInt(top)) + ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height());
                    }
                } else {
                    top = 1 + ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height());
                }
                let openUrl = base + "/report.html?id=" + templateId + "&token=" + token + "&params=" + (_params) + '&sysname=' + sysname;
                layer.open({
                    type: 2,
                    title: ['', 'height:1px;'],
                    closeBtn: 2, //不显示关闭按钮
                    offset: [top, left],
                    shade: [0],
                    area: [width + 'px', height + 'px'],
                    anim: 2,
                    content: [url, 'no'], //iframe的url，no代表不显示滚动条
                    end: function () { //此处用于演示

                    }
                });
            }
        } else if (2 === _OT) {// 打开http链接
            if (_URL.indexOf("http") == -1 && _URL.indexOf("https") == -1) {
                _URL = "http://" + _URL;
            }
            var left = linkObj.left;
            var top = linkObj.top;
            if (left == "" && top == "") { //上和左都没有填，默认居中
                layer.open({
                    type: 2,
                    title: ['', 'height:1px;'],
                    closeBtn: 2, //不显示关闭按钮
                    shade: [0],
                    area: [width + 'px', height + 'px'],
                    anim: 2,
                    content: [_URL, 'no'], //iframe的url，no代表不显示滚动条
                    end: function () { //此处用于演示

                    }
                });
            } else {
                if (left != "") {
                    if (left.indexOf("%") != -1) { //百分比
                        left = left.substring(0, left.length - 1);
                        left = $(window).width() * left / 100;
                    } else {
                        left = (parseInt(left) == 0 ? 1 : parseInt(left));
                    }
                } else {
                    left = 1;
                }
                if (top != "") {
                    if (top.indexOf("%") != -1) {
                        top = top.substring(0, top.length - 1);
                        top = ($(window).height() - ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) - ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height())) * top / 100 + ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height());
                        ;
                    } else {
                        top = (parseInt(top) == 0 ? 1 : parseInt(top)) + ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height());
                    }
                } else {
                    top = 1 + ($('#pagination').css('display') == 'none' ? 0 : $('#pagination').height()) + ($('#_field_con').css('display') == 'none' ? 0 : $('#_field_con').height());
                }
                layer.open({
                    type: 2,
                    title: ['', 'height:1px;'],
                    closeBtn: 2, //不显示关闭按钮
                    offset: [top, left],
                    shade: [0],
                    area: [width + 'px', height + 'px'],
                    anim: 2,
                    content: [url, 'no'], //iframe的url，no代表不显示滚动条
                    end: function () { //此处用于演示
                    }
                });

            }

        } else {
            throw new Error("Illegal Argument Error");
        }
    } else {
        throw new Error("Illegal Argument Error");
    }
    return;
}

function exportWordR(cflag, sheetNames) {
    let sval = DesignModule._saveAsToStream();//临时保存
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

/**
 * 打印和导出操作前，弹出sheet页列表
 * */
function showSheetNamer(type) {
    if (isAlert == 'true') { //平台属性默认弹框
        let sheet = ParamOperator.decodeStrAndFree(DesignModule._getAllSheetName());
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
                    let sheets = ParamOperator.decodeStrAndFree(DesignModule._getAllSheetName());
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