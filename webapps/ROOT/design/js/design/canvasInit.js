var DesignModule;
var DesignModule1;
var Design = {
    timer: '', //定时器
    fontIndex: 0, //字体索引
    jsDoneFlag: 0, //js加载完成标识
    jsLength: 0,
    fileLength: 0,
    fontFile: [], //所有字体文件
    fontMapKV: {},
    fontMapVK: {},
    jsMap: {},
    firstFontFlag: true, //第一个字体标志
    init: function (path) {
        $('#maskDiv').show();
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
                Design.afterInit();
            }

        });
        DesignModule = qtLoader.loadEmscriptenModule(path);
    },
    afterInit: function () {
        $('#loadText').html('正在加载插件文件...');
        $('#download').css('display', 'flex');

        Design.loadJavascript(); //加载js文件

        $.ajax({ //先加载平台配置文件
            url: ip + '/designSys/getPlatform?token=' + token,
            type: 'post',
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                if (res.state == 'success') {
                    var page = res.config;
                    plateformProp = page;
                    DesignModule._setInitSheetColCount((plateformProp.colNums));
                    DesignModule._setInitSheetRowCount((plateformProp.rowNums));
                    DesignModule._setInitSheetRowHeight((plateformProp.rowHeight));
                    DesignModule._setInitSheetColWidth((plateformProp.colWidth));
                    DesignModule._setDefaultCellTopMargin(plateformProp.padTop);
                    DesignModule._setDefaultCellBottomMargin(plateformProp.padBottom);
                    DesignModule._setDefaultCellLeftMargin(plateformProp.padLeft);
                    DesignModule._setDefaultCellRightMargin(plateformProp.padRight);
                    DesignModule._setDefaultFieldDataType(plateformProp.dataType);
                    DesignModule._setDefaultDataAttribution(plateformProp.dataSet);
                    DesignModule._setUsePixelRuler(plateformProp.isPixel);
                    DesignModule._setShowColIndex(plateformProp.showColIndex);
                    isAlert = page.alert;
                    Design.initFont();
                } else {
                    Design.initFont();
                }
            },
            error: function () {
                Design.initFont();
            }

        })
    },
    initFont: function () {
        $('#loadText').html('正在加载资源文件...');
        $.ajax({
            //url: 'wasm/font/font.json',
            url: ip + '/designSys/getFontList',
            type: 'get',
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                if (res.code == 1) {
                    let data = res.text;
                    if (data != null) {
                        data = JSON.parse(data);
                        let file = data.file;
                        Design.fontFile = data.file;
                        Design.fileLength = file.length;
                        if (file.length > 0) {
                            fileLength = file.length;
                            DesignModule._removeAllFonts();
                            let path = data.path;
                            fontPath = path;
                            let num = file.length;
                            for (let i = 0; i < num; i++) {
                                if ('simsun.ttc' == file[i]) {
                                    let u = ip + "/wasm/font/" + file[i];
                                    Design.loadFont(u, i);
                                }
                                $('.fontTextSpan').show();
                            }

                        } else {
                            Design.loadDone();
                        }
                    } else {
                    }
                } else {
                }
            }
        });
        let excel = ip + '/wasm/font/excelexprreference.json';
        Design.loadExcel(excel);
    },
    loadFont: function (u, num) {
        //使用fetch的方式来获取字体
        fetch(u, {
            method: 'GET',
            responseType: 'arraybuffer'
        }).then(function (response) {
            if (response.status == 200) { //首先返回数据
                return response.arrayBuffer();
            }
        }).then(function (ab) { //ab即为返回的数据
            var data = new Uint8Array(ab);
            var len = data.length;
            var buf = DesignModule._malloc(len);
            DesignModule.HEAPU8.set(data, buf);
            var res = DesignModule._loadFont(buf, len);
            Design.fontIndex++;
            //每加载一个字体后，刷新字体列表
            Design.loadDone(Design.firstFontFlag, num);
            //字体文件全部加载
            if (Design.fontIndex == Design.fontFile.length) {
                //隐藏下载资源文件的文本
                $('.fontTextSpan').hide();
            }
        });
    },

    loadExcel: function (u) {
        $.get(u, function (data) {
            var str = Design.encodeStr(JSON.stringify(data));
            DesignModule._setExcelExprReferences(str);
        });
    },

    loadDone: function (flag, num) {
        let url = ip + '/wasm/font/realfontname.txt';
        $.get(url, function (data) {
            var dataJson = JSON.parse(data);
            for (var key in dataJson) {
                Design.fontMapKV[key] = dataJson[key];
                Design.fontMapVK[dataJson[key]] = key;
            }
            DesignModule._setRealFontNameList(Design.encodeStr(data));
            var ts = DesignModule._getAllFontName();
            ts = Design.decodeStrAndFree(ts);
            ts = JSON.parse(ts).family;
            $('select[name="fontfamily"]').empty();
            $('select[name="fontfamilys"]').empty();
            $('#fontfamily').empty();
            $('#fontfamily1').empty();
            for (var x = ts.length - 1; x >= 0; x--) {
                var name = ts[x];
                $('select[name="fontfamily"]').append('<option value="' + name + '">' + (Design.fontMapVK[name] == undefined ? name : Design.fontMapVK[name]) + '</option>');
                $('select[name="fontfamilys"]').append('<option value="' + name + '">' + (Design.fontMapVK[name] == undefined ? name : Design.fontMapVK[name]) + '</option>');
                $('#fontfamily').append('<option value="' + name + '">' + (Design.fontMapVK[name] == undefined ? name : Design.fontMapVK[name]) + '</option>');
                $('#fontfamily1').append('<option value="' + name + '">' + (Design.fontMapVK[name] == undefined ? name : Design.fontMapVK[name]) + '</option>');
            }
            $('select[name="fontfamily"]').val('宋体');
        });
        if (flag) { //宋体加载完毕

            //获取时间戳
            let timestamp = Date.parse(new Date());
            //生成报表名
            let templateName = '报表_' + timestamp;
            if(templateId == null){
                let t = canvasEvent.Template.loadTemplate2(templateName, 0);
                //DesignModule._setShowRowColCountTag(false);
                DesignModule._setJSObjectName(encodeStr('SpreadsheetEvent'));
            }else{
                let t = canvasEvent.Template.loadTemplateById(templateId);
            }

            Design.firstFontFlag = false; //说明宋体已经加载完
            //判断js文件是否加载完毕
            Design.timer = setInterval(function () {
                if (Design.jsDoneFlag == Design.jsLength) {
                    for (var i = 0; i < Design.jsLength; i++) {
                        var ba = Design.jsMap[i];
                        var data = new Uint8Array(ba);
                        var len = data.length;
                        var buf = DesignModule._malloc(len);
                        DesignModule.HEAPU8.set(data, buf);
                        var res = DesignModule._loadClacExpr(buf, len);
                        DesignModule._free(buf);
                    }
                    $('#download').css('display', 'none');
                    window.clearInterval(Design.timer);
                }
                DesignModule._setExternalVersion(isEV);
                Design.resizeCanvas();
            }, 200);

            //宋体加载完毕后，再加载其他字体
            //再加载其他字体
            for (var i = 0; i < Design.fontFile.length; i++) {
                if ('simsun.ttc' != Design.fontFile[i]) {
                    var u = ip + "/wasm/font/" + Design.fontFile[i];
                    Design.loadFont(u, Design.fontFile.length);
                }
            }

        }
    },
    loadJavascript: function () {
        $.ajax({
            url: ip + '/designSys/getJSList',
            type: 'get',
            contentType: "application/json;charset=UTF-8",
            success: function (res) {
                if (res.code == 1) {
                    var data = res.text;
                    if (data != null) {
                        data = JSON.parse(data);
                        var file = data.file;
                        Design.fontFile = data.file;
                        var newFile = [];
                        for (var j = 0; j < file.length; j++) {
                            //给文件排序
                            for (var j1 = 0; j1 < file.length; j1++) {
                                var curFile = file[j1];
                                var curNumber = curFile.substring(1, 2);
                                if (curNumber == j + 1) {
                                    newFile.push(curFile);
                                }
                            }
                        }
                        if (file.length > 0) {
                            var path = data.path;
                            var num = file.length;
                            Design.jsLength = num;
                            for (var i = 0; i < num; i++) {
                                var u = ip + '/wasm' + "/javascript/" + newFile[i];
                                $.getScript(u,function(){}); //load js to html
                                Design.loadJS(u, i);
                            }
                        }
                    }
                }

            }
        });
    },
    loadJS: function (u, num) {
        //使用fetch的方式来获取字体
        fetch(u, {
            method: 'GET',
            responseType: 'arraybuffer'
        }).then(function (response) {
            if (response.status == 200) { //首先返回数据
                return response.arrayBuffer();
            }
        }).then(function (ab) { //ab即为返回的数据
            Design.jsDoneFlag++;
            Design.jsMap[num] = ab;
        });
    },
    decodeStrAndFree: function (visualIndex) {
        var str = UTF8ToString(visualIndex);
        DesignModule._free(visualIndex);
        return str;
    },
    //编码传出的字符串
    encodeStr: function (str) {
        var lengthBytes = lengthBytesUTF8(str) + 1;
        var stringOnWasmHeap = DesignModule._malloc(lengthBytes);
        stringToUTF8(str, stringOnWasmHeap, lengthBytes + 1);
        return stringOnWasmHeap;
    },
    getRatio: function () {
        var ratio = 0;
        var screen = window.screen;
        var ua = navigator.userAgent.toLowerCase();

        if (window.devicePixelRatio !== undefined) {
            ratio = window.devicePixelRatio;
        } else if (~ua.indexOf('msie')) {
            if (screen.deviceXDPI && screen.logicalXDPI) {
                ratio = screen.deviceXDPI / screen.logicalXDPI;
            }

        } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
            ratio = window.outerWidth / window.innerWidth;
        }

       /* if (ratio) {
            ratio = Math.round(ratio * 100);
        }*/
        return ratio;
    },
    resizeCanvas: function () {
        setTimeout(function () {

            let bodyHeight = $('body').height();

            let headerHeight1 = $('.header').height();
            let headerHeight = $('.header').css('height');
            let toolHeight;
            let toolHeight1;
            if ($('.sheet').css('display') == 'none') {
                toolHeight = $('.form').css('height');
                toolHeight1=$('.form').height();
            } else {
                toolHeight = $('.sheet').css('height');
                toolHeight1=$('.sheet').height();
            }
            let editAreaHeight = $('.editArea').css('height');
            let editAreaHeight1 = $('.editArea').height();
            let contentHeight = bodyHeight - parseInt(headerHeight) - parseInt(toolHeight) - parseInt(editAreaHeight);
            let middleHeight = bodyHeight - parseInt(headerHeight);
            let canvasHeight = bodyHeight - headerHeight1 - toolHeight1 - editAreaHeight1; //canvas高度


            $('.all').css('height', bodyHeight);
           /* $('.canvas-container').css('height', contentHeight);*/
            /*$('.middle').css('height', contentHeight);
            $('.content').css('height', contentHeight)*/
            $('.middle').css('height', middleHeight);
            $('.content').css('height', middleHeight);
            $('.canvas-container').css('height', canvasHeight);
            let middleWidth = $('.middle').width();


            $('#canvas').attr('width', middleWidth);
            $('#canvas').css('width', middleWidth);
            $('#canvas').attr('height', canvasHeight);
            $('#canvas').css('height', canvasHeight);
            //DesignModule._resize(middleWidth, canvasHeight);
            DesignModule.qtResizeAllScreens(true);

        }, 50);
    }


};