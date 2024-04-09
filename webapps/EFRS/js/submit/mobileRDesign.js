let fileLength;
let fileDoneFlag = 0;
let jsLength;
let jsDoneFlag = 0;
let jsMap = {};


function getTopHeight() {
    return getHeaderHeight() + $('.toptool').height();
}

function getLeftWidth() {
    if ($(".asilde").is(':hidden')) {
        return $(".left_aslide").width();
    }
    return $(".asilde").width() + $(".left_aslide").width();
}

function getHeaderHeight() {
    return $(".header").height() + 1;
}

function getMainHeight() {
    return $(".all").height() - getHeaderHeight();
}


function ctc() {

    let toolHeight = ($('#normal-buttonDiv').css('display') == 'none'?0:$('#normal-buttonDiv').height()) + ($('#buttonDiv').css('display') == 'none'?0:$('#buttonDiv').height());
    let paramHeight = $('#param1').height();
    let bodyHeight = $('body').height();
    let canvasHeight = bodyHeight - paramHeight - toolHeight;

    let bodyWidth = $('body').width();
    $('#x-canvas-container').css('height', canvasHeight);
    $('#x-canvas-container').css('width', bodyWidth);

    $('#canvas').css('height', canvasHeight);
    $('#canvas').css('width', bodyWidth);

    Module._resize(bodyWidth , canvasHeight);
}

function resizeCanvas() {
    setTimeout("ctc()", 100);
    hideInput();
}


function initFont() {
    $('#loadText').html('正在加载资源文件...');
    $.ajax({
        url: base + '/designSys/getFontList',
        type: 'get',
        contentType: "application/json;charset=UTF-8",
        success: function (res) {
            if (res.code == 1) {
                let data = res.text;
                if (data != null) {
                    data = JSON.parse(data);
                    let file = data.file;
                    fontFile = data.file;
                    if (file.length > 0) {
                        fileLength = file.length;
                        Module._removeAllFonts();
                        let path = data.path;
                        fontPath = path;
                        let num = file.length;
                        for (let i = 0; i < num; i++) {
                            let u = base + "/wasm/font/" + file[i];
                            loadFont(u, i);
                            $('.fontTextSpan').show();
                        }

                    } else {
                        loadDone();
                    }
                } else {
                }
            } else {
            }
        }
    });

    let excel = base + '/wasm/font/excelexprreference.json';
    loadExcel(excel);
}

function loadFont(u, num) {
    //使用fetch的方式来获取字体
    fetch(u, {
        method: 'GET',
        responseType: 'arraybuffer'
    }).then(function (response) {
        if (response.status == 200) { //首先返回数据
            return response.arrayBuffer();
        }
    }).then(function (ab) { //ab即为返回的数据
        let data = new Uint8Array(ab);
        let len = data.length;
        let buf = Module._malloc(len);
        HEAPU8.set(data, buf);
        let res = Module._loadFont(buf, len);
        fileDoneFlag++;
        if (fileLength == num + 1) {
            loadDone();
        }
    });
}

function loadJavascript() {
    $.ajax({
        url: base + '/designSys/getJSList',
        type: 'get',
        contentType: "application/json;charset=UTF-8",
        success: function (res) {
            if (res.code == 1) {
                let data = res.text;
                if (data != null) {
                    data = JSON.parse(data);
                    let file = data.file;
                    fontFile = data.file;
                    let newFile = [];
                    for (let j = 0; j < file.length; j++) {
                        //给文件排序
                        for (let j1 = 0; j1 < file.length; j1++) {
                            let curFile = file[j1];
                            let curNumber = curFile.substring(1, 2);
                            if (curNumber == j + 1) {
                                newFile.push(curFile);
                            }
                        }
                    }
                    if (file.length > 0) {
                        let path = data.path;
                        let num = file.length;
                        jsLength = num;
                        for (let i = 0; i < num; i++) {
                            let u = base  + "/wasm/javascript/" + newFile[i];
                            loadJS(u, i);
                        }
                    }
                }
            }
        }
    });
}

//excel导入公式
function loadExcel(u) {
    $.get(u, function (data) {
        let str = ParamOperator.encodeStr(JSON.stringify(data));
        Module._setExcelExprReferences(str);
    });
}


function loadJS(u, num) {
    //使用fetch的方式来获取字体
    fetch(u, {
        method: 'GET',
        responseType: 'arraybuffer'
    }).then(function (response) {
        if (response.status == 200) { //首先返回数据
            return response.arrayBuffer();
            //return response.text();
        }
    }).then(function (ab) { //ab即为返回的数据
        jsDoneFlag++;
        jsMap[num] = ab;
    });
}

function base64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 *
 * 在Canvas上面添加背景DIV和内容DIV
 *
 * */
function addMaskDiv(index) {
    //首列宽度
    let columnWidth = Module._getColumnWidthByIndex(0);
    //首行高度
    let rowHeight = Module._getRowHeightByIndex(0);
    //固定列宽度
    let fixColumnWidth = Module._getSheetFixedColumnsWidth(index);
    //固定行高度
    let fixRowHeight = Module._getSheetFixedRowsHeight(index);
    //垂直滚动条宽度
    let scrollWidth = 16;
    //水平滚动条高度
    let scrollHeight = 16;
    //工具栏高度
    let toolHeight = parseInt($('#buttonDiv').css('height'));

    let paramHeight = parseInt($('#_field_').css('height'));
    //绝对定位 left
    let left = columnWidth + 1 + fixColumnWidth;
    //绝对定位 top
    let top = rowHeight + toolHeight + paramHeight + fixRowHeight;
    //内容Div高度
    let contentDivHeight = Module._getAllRowHeight();
    //内容Div宽度
    let contentDivWidth = Module._getAllColumnWidth();
    //背景DIV高度
    let backgroundDivHeight = parseInt($('body').css('height')) - top - scrollHeight;
    //背景DIV宽度
    let backgroundDivWidth = parseInt($('body').css('width')) - left - scrollWidth;
    //添加背景DIV
    $('body').append('<div id="backgroundDiv' + index + '" style="overflow:hidden;pointer-events:none;background-color:transparent;width:' + backgroundDivWidth + 'px;height:' + backgroundDivHeight + 'px;position:absolute;top:' + top + 'px;left:' + left + 'px;"></div>')
    //添加内容DIV
    $('#backgroundDiv' + index).append('<div id="contentDiv' + index + '"style="word-wrap:break-word;position:absolute;top:0px;left:0px;width:' + contentDivWidth + 'px;height:' + contentDivHeight + 'px;background-color: transparent;"></div>');
}


//创建所有sheet的遮罩层
function createMasks() {
    //SHEET数组
    let sheetArrays = reportJson.SheetArray;
    //遍历数组生成遮罩层
    $.each(sheetArrays, function (index, element) {
        console.log(element);
        //所有的悬浮元素
        let shapes = element.ShapesData;
        let plugins = element.PluginCells;
        addMaskDiv(index);
        if (shapes != undefined) {
            Shape.Fn.initGridShapes('contentDiv' + index, shapes);
        }
        if (plugins != undefined) {
            Shape.Fn.initGridShapes('contentDiv' + index, plugins)
        }
        if (index != 0) {
            $('#contentDiv' + index).css('display', 'none');
        }
    })


}


function loadDone() {
    let url = base + '/wasm/font/realfontname.txt';
    $.get(url, function (data) {
        Module._setRealFontNameList(ParamOperator.encodeStr(data));
    });
    let timer;
    timer = setInterval(function () {
        if (jsDoneFlag == jsLength && fileDoneFlag == fileLength) {
            for (let i = 0; i < jsLength; i++) {
                let ba = jsMap[i];
                let data = new Uint8Array(ba);
                let len = data.length;
                let buf = Module._malloc(len);
                HEAPU8.set(data, buf);
                let res = Module._loadClacExpr(buf, len);
                Module._free(buf);
            }
            addContentEvent(); //绑定插件事件
            Module._addSpreadSheet(ParamOperator.encodeStr("报表100000"), '');
            Module._setTabDisplay(false);
            let dataStr = ParamOperator.encodeStr(JSON.stringify(reportJson));
            Module._loadReportModelFromJsonStream(dataStr);
            //生成悬浮元素遮罩层
            //createMasks();
            isShowExpress = Module._isShowExprValue();
            if (isShowExpress) {
                $('#switch').text('显示公式');
                $('#normal-switch').text('显示公式');
            } else {
                $('#switch').text('显示值');
                $('#normal-switch').text('显示值');
            }
            $("#loadgif").hide();
            $('.rowOper').parent().parent().css('z-index', 999);
            $('.export').parent().parent().css('z-index', 999);
            //$('.normal-export').parent().parent().css('z-index', 999);
            $('.offline').parent().parent().css('z-index', 999);

            window.clearInterval(timer);
        }
    }, 200);

    layui.use('upload', function () {//插入图片
        let upload = layui.upload;
        upload.render({ //允许上传的文件后缀
            elem: '#fileBut'
            , url: base + '/designSys/getJsonData'
            , accept: 'images'
            , done: function (res) {
            }
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    let t = result.substr(result.indexOf('base64,') + 7, result.length);
                    //将base64位编码保存到单元格中
                    Module._setSelCellFile(ParamOperator.encodeStr(file.name), ParamOperator.encodeStr(t), isShowPic);
                });
            }
        });
    });


}










