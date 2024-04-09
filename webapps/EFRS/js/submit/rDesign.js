let fileLength;
let fileDoneFlag = 0;
let jsLength;
let jsDoneFlag = 0;
let jsMap = {};
let uploadMap = {};


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
    let paramHeight = $('#ef-grid-param').height();
    let bodyHeight = $('body').height();
    let canvasHeight = bodyHeight - paramHeight - toolHeight;
    let bodyWidth = $('body').width();

    $('#x-canvas-container').css('height', canvasHeight);
    $('#x-canvas-container').css('width', bodyWidth);

    $('#canvas').css('height', canvasHeight);
    $('#canvas').css('width', bodyWidth);

    $('#canvas').attr('height', canvasHeight);
    $('#canvas').attr('width', bodyWidth);
    DesignModule.qtResizeAllScreens(true);

}

function resizeCanvas() {
    setTimeout("ctc()", 100);
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
                        DesignModule._removeAllFonts();
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
        let buf = DesignModule._malloc(len);
        DesignModule.HEAPU8.set(data, buf);
        let res = DesignModule._loadFont(buf, len);

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
        DesignModule._setExcelExprReferences(str);
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
    let columnWidth = DesignModule._getColumnWidthByIndex(0);
    //首行高度
    let rowHeight = DesignModule._getRowHeightByIndex(0);
    //固定列宽度
    let fixColumnWidth = DesignModule._getSheetFixedColumnsWidth(index);
    //固定行高度
    let fixRowHeight = DesignModule._getSheetFixedRowsHeight(index);
    //垂直滚动条宽度
    let scrollWidth = 16;
    //水平滚动条高度
    let scrollHeight = 16;
    let toolHeight;
    //工具栏高度
    if($('#normal-buttonDiv').css('display') == 'none'){
        toolHeight = 0;
    }else{
        toolHeight = parseInt($('#normal-buttonDiv').css('height'));
    }

    let paramHeight = parseInt($('#ef-grid-param').css('height'));
    //绝对定位 left
    let left = columnWidth + 1 + fixColumnWidth;
    //绝对定位 top
    let top = rowHeight + toolHeight + paramHeight + fixRowHeight;
    //内容Div高度
    let contentDivHeight = DesignModule._getAllRowHeight();
    //内容Div宽度
    let contentDivWidth = DesignModule._getAllColumnWidth();
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
        //所有的悬浮元素
        let shapes = element.ShapesData;
        let plugins = element.PluginCells;
        addMaskDiv(index);
        if (shapes != undefined) {
            initGridShapes('contentDiv' + index, shapes);
        }
        if (plugins != undefined) {
            initGridShapes('contentDiv' + index, plugins)
        }
        if (index != 0) {
            $('#contentDiv' + index).css('display', 'none');
        }
    })
}


function loadDone() {
    let url = base + '/wasm/font/realfontname.txt';
    $.get(url, function (data) {
        DesignModule._setRealFontNameList(ParamOperator.encodeStr(data));
    });
    let timer;
    timer = setInterval(function () {
        if (jsDoneFlag == jsLength && fileDoneFlag == fileLength) {
            for (let i = 0; i < jsLength; i++) {
                let ba = jsMap[i];
                let data = new Uint8Array(ba);
                let len = data.length;
                let buf = DesignModule._malloc(len);
                DesignModule.HEAPU8.set(data, buf);
                let res = DesignModule._loadClacExpr(buf, len);
                DesignModule._free(buf);
            }
            //addContentEvent(); //绑定插件事件
            reportJson = JSON.parse(ParamOperator.decodeStrAndFree(DesignModule._uncompressStream(ParamOperator.encodeStr(JSON.stringify(reportJson)))));
            DesignModule._addSpreadSheet(ParamOperator.encodeStr("报表100000"), '');
            DesignModule._setTabDisplay(false);
            let dataStr = ParamOperator.encodeStr(JSON.stringify(reportJson));
            DesignModule._loadReportModelFromJsonStream(dataStr);
            DesignModule._setJSObjectName(ParamOperator.encodeStr('SpreadsheetEvent'));
            initRpt(reportJson);
            //生成悬浮元素遮罩层
            createMasks();
            isShowExpress = DesignModule._isShowExprValue();
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

            resizeCanvas();

            window.clearInterval(timer);
        }
    }, 200);

    layui.use('upload', function () {//插入图片
        let upload = layui.upload;
        upload.render({ //允许上传的文件后缀
            elem: '#fileBut'
            //, url: base + '/designSys/getJsonData?token=' + token
            , url: base + '/report/uploadFile?templateId=' + id + '&isRpt=true&token=' + token
            , accept: 'images'
            , done: function (res) {
                let pos = ParamOperator.decodeStrAndFree(DesignModule._getSelBeginCell());
                let posJ = JSON.parse(pos);
                let cellPos = DesignModule._cellPos2Char(posJ.x, posJ.y);
                let p = ParamOperator.decodeStrAndFree(cellPos);
                DesignModule._setSelCellFile(ParamOperator.encodeStr(id + "/" + res.message), ParamOperator.encodeStr(uploadMap[p]), isShowPic);
            }
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    let pos = ParamOperator.decodeStrAndFree(DesignModule._getSelBeginCell());
                    let posJ = JSON.parse(pos);
                    let cellPos = DesignModule._cellPos2Char(posJ.x, posJ.y);
                    let p = ParamOperator.decodeStrAndFree(cellPos);
                    let t = result.substr(result.indexOf('base64,') + 7, result.length);
                    uploadMap[p] = t;
                    //将base64位编码保存到单元格中
                    //DesignModule._setSelCellFile(ParamOperator.encodeStr(id + "/" + file.name), ParamOperator.encodeStr(t), isShowPic);

                });
            }
        });
    });
}

//初始化表格插件上的悬浮元素
function initGridShapes(oid, shapes) {
    $.each(shapes, function (index, element) {
        //随机生成悬浮元素ID
        let id = randomUUID();
        let width = element.Width == undefined?element.W:element.Width; //悬浮元素宽度
        let height = element.Height == undefined?element.H:element.Height; //悬浮元素高度
        let HtmlFile = element.HtmlFile; //Html文件
        let x = element.X * 1; //x轴位置
        let y = element.Y * 1; //y轴位置
        let text = element.Text; //悬浮元素文本
        let html;
        let borderStyle = '';
        let visible = element.Visible; //悬浮元素是否可见
        let display = 'flex';
        if (visible != undefined) {
            display = 'none';
        }

        if (element.BW != undefined) { //边框
            borderStyle = 'border-style:solid;border-width:' + element.BW + 'px;border-color:' + element.BC + ';box-sizing:border-box;';
        }
        //有插件
        if (element.HtmlFile != undefined) {
            html = '<div type="plugin" id="' + id + '"class="shape" sname="' + element.Name + '" style="pointer-events:auto;' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (1000) + ';display:' + display + ';">' +
                '       <iframe id="fra" oh="' + height + '" ow="' + width + '" src="' + base + '/export/' + HtmlFile + '" style="width:' + width + 'px;height:' + height + 'px;" frameborder=0 scrolling=no>' +
                '       </iframe>' +
                '   </div>'
        } else { //没有插件
            if (element.SN != undefined) {//包含子表单
                let sheetName = element.SN;
                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="pointer-events:auto;' + borderStyle + 'background-color:' + element.BKC + ';position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (1000) + ';display:' + display + ';">' +
                    '<table id="_tb_sheet_' + id + '" stable="1" class="x-table" sheetname="' + sheetName + '"style="border-collapse:collapse;border:none;border-spacing:2px;-webkit-border-horizontal-spacing: 2px;' +
                    '-webkit-border-vertical-spacing: 2px;table-layout: fixed;"  cellspacing="0"  cellpadding="0">' +
                    '</table></div>'
                //获取sheet数据并且渲染
                $.getJSON(base + '/report/loadJSON?' + "t=" + new Date().getTime() + "&token=" + token + '&serverId=' + serverId , {
                    file: sheetName, //子sheet名
                    pathId: pathId,
                    serverId: serverId
                }, function (data) {
                    //生成子表单
                    generateShapeSheet("_tb_sheet_" + id, data, element, width, height);
                });

            } else {//不包含子表单
                if(element.Font == undefined){
                    return true;
                }
                let cssText = '';
                //文本大小
                cssText += ('font-size:' + element.Font.Size + 'px;');
                //文本样式
                cssText += ('font-family:' + element.Font.Name + ';');
                //文本颜色
                cssText += ('color:' + element.Font.FC + ';');
                if (element.Font.Italic) {
                    cssText += 'font-style:italic;';
                }
                if (element.Font.Bold) {
                    cssText += 'font-weight:bold;';
                }
                if (element.Font.Underline) {
                    cssText += 'text-decoration:underline;';
                }
                html = '<div id="' + id + '" class="shape" sname="' + element.Name + '" style="pointer-events:auto;' + borderStyle + 'background-color:' + element.BKC + ';' + cssText + 'display:flex;justify-content:center;align-items:center;position:absolute;width:' + width + 'px;height:' + height + 'px;left:' + x + 'px;top:' + y + 'px;z-index:' + (element.Z - 200) + ';display:' + display + ';">' + (text==undefined?'':text) + '</div>'
            }
        }
        $('#' + oid).append(html);
        if (element.Hyperlink != undefined) {
            $('#' + id).bind('click', function () {
                let hyperlink = JSON.parse(element.Hyperlink);
                Link.Fn.hyperlink(hyperlink);
            })
        }
    })
}

function randomUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, DesignModule.HEAPU8, outPtr, maxBytesToWrite)
}

function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && heapOrArray.buffer && DesignModule.UTF8Decoder) {
        return DesignModule.UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
    }
    var str = "";
    while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2
        } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63
        }
        if (u0 < 65536) {
            str += String.fromCharCode(u0)
        } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
        }
    }
    return str
}

function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(DesignModule.HEAPU8, ptr, maxBytesToRead) : ""
}











