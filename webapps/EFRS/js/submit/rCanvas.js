let isSelectShow = false;
let isSelect = false;
let prevVal = ''; //前一个单元格的值
let isPreAllowNull = true;
let hasNullFlag = false;
let isShowPic; //是否显示图片
let DesignModule;

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
                loadJavascript();
                initFont();
            }
        });
        DesignModule = qtLoader.loadEmscriptenModule(path);
        //qtLoader.setFontDpi(96);
    }
};

//出参 入参 加解密
let ParamOperator = {
    //接收返回的字符串并解析
    decodeStrAndFree: function (visualIndex) {
        let str = UTF8ToString(visualIndex);
        DesignModule._free(visualIndex);
        return str;
    },
    //编码传出的字符串
    encodeStr: function (str) {
        if (isNull(str)) {
            return '';
        }
        let lengthBytes = DesignModule.lengthBytesUTF8(str) + 1;
        let stringOnWasmHeap = DesignModule._malloc(lengthBytes);
        stringToUTF8(str, stringOnWasmHeap, lengthBytes + 1);
        return stringOnWasmHeap;
    }
};

//当前点击的单元格是否可编辑
function isEdit() {
    let b = DesignModule._isAllowEditCurrCell();
    return b;
}

function isEditByXY(x, y) {
    let b = DesignModule._isAllowEditCell(x, y);
    return b;
}

function paste() {
    DesignModule._paste();
}

function getRatio() {
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
}

//内核主动调用，必须要实现
let SpreadsheetEvent = {
        showEvt: function () {
            DesignModule._setLogicalZoom(getRatio());
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

        },
        focusInEvt: function () {
        },
        focusOutEvt: function () {
        },
        //画布鼠标右键点击事件
        mouseReleaseEvt: function (a, b, c) {
            let sheetType = DesignModule._currSheetType(); //获取当前sheet类型
            let flag = DesignModule._isSelectedShape(); //当前选中的是否是悬浮元素
            let toolHeight = 0;
            if ($('#buttonDiv').css('display') != 'none') {
                toolHeight += $('#buttonDiv').height();
            }
            if ($('#normal-buttonDiv').css('display') != 'none') {
                toolHeight += $('#normal-buttonDiv').height();
            }
            let expandHeight = DesignModule._getFoldPanelXHeight();
            let expandWidth = DesignModule._getFoldPanelYWidth();
            if (expandHeight == -1) {
                expandHeight = 0;
            }
            if (expandWidth == -1) {
                expandWidth = 0;
            }
            if (!flag) {

                if (2 == c) {//鼠标右键点击画布事件
                    let bk = ParamOperator.decodeStrAndFree(DesignModule._getSelCellBkPic());
                    if (bk == '') {
                        //let x = 25 + b + toolHeight + expandHeight, y = a + expandWidth;
                        let x = b + toolHeight + expandHeight, y = a + expandWidth;
                        showMenu(y, x);
                    } else {
                        $("#rightRowClickMenu").hide();
                        layer.open({
                            type: 2,
                            title: ['', 'height:1px;'],
                            closeBtn: 2, //不显示关闭按钮
                            shade: [0],
                            area: ['500px', '500px'],
                            anim: 2,
                            content: 'bkImage.html',
                            end: function () {

                            },
                            success: function (layero, index) {
                                let iframeWin = window[layero.find('iframe')[0]['name']];
                                iframeWin.init1(bk);
                            },
                            yes: function (index, layero) {

                            }
                        });
                    }

                }
            }
        },
        mousePressHyperlinkCell: function (nX, nY, nButton, x, y, pHyperlink) {
            if (nButton == 1) {
                let link = ParamOperator.decodeStrAndFree(pHyperlink);
                hyperlink(link, nX, nY);
            }
            DesignModule._cancelOperateState();
        },
        mouseMoveHyperlinkCell: function (nX, nY, nButton, x, y, pHyperlink) {

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
                let left = x + getLeftWidth();
                let top = 25 + getTopHeight() + $('.editArea').height();
                $(".rightmenu").css({left: left, top: top}).show();
                $(".rightmenu").mouseover();
            }
        },
        //模板关闭,模板索引  whj
        removeSpreadSheetEvt: function (index) {},
        /*** 鼠标双击事件
         *  x 鼠标横坐标 y 鼠标纵坐标 sheetIndex 当前sheet索引:0  单元格列值row 单元格行值
         */
        mouseDoubleClickedEvt: function (x, y, sheetIndex, column, row, isAllowEditCell) { //whj
            $('#rightRowClickMenu').hide();
            let cellRect = getSelCellRect();
            let pos = ParamOperator.decodeStrAndFree(DesignModule._getSelBeginCell());
            let posJ = JSON.parse(pos);
            $("#singleSel").hide();
            //可编辑状态下
            if (isEdit() && DesignModule._isAllowDoubleClickCurrCell()) {
                showEditor(cellRect.left, cellRect.top, cellRect.width, cellRect.height);
                let val = ParamOperator.decodeStrAndFree(DesignModule._getSelCellText());
                prevVal = val;
                let control = ParamOperator.decodeStrAndFree(DesignModule._getCellControlInfo(posJ.x, posJ.y));
                if (control != "") {
                    let prop = JSON.parse(control);
                    isPreAllowNull = prop.AllowNull;
                }
                $('#editInput').val(val);
               /* $("#editInput").unbind().bind('change', function () {
                    let val = $(this).val();
                    prevVal = val;
                    let json = {
                        "x": posJ.x,
                        "y": posJ.y,
                        "text": val
                    }
                    $(this).val('');
                    validate(posJ , val);
                    DesignModule._setCellText(ParamOperator.encodeStr(JSON.stringify(json)));

                })*/
            }

        },
        /*
         * 双击悬浮元素事件
         * */
        doubleClickedShapePlugin: function (x, y, sheetIndex, pluginName) {
        },
        /**
         * 鼠标点击事件
         */
        mouseClickEvt: function (x, y, sheetIndex, column, row, type) {
            if (isSelect) { //触发了下拉框事件
                isSelect = false;
            } else {
                if ($('#singeSelDiv').css('display') != 'none') {
                    $('#singeSelDiv').hide();
                }
                isSelect = false;
            }
            let top = 0;
            if ($('#normal-buttonDiv').css('display') != 'none') {
                top = top + $('#normal-buttonDiv').height();
            }

            if ($('#buttonDiv').css('display') != 'none') {
                top = top + $('#buttonDiv').height()
            }

            $('#rightRowClickMenu').hide();
        },
        mousePressEvt: function (a, b, c) {  //canvas左键单击事件
            //隐藏所有菜单
            hideEditor();
        },
        clickColTagEvt: function (type) {},
        /**
         * 鼠标状态改变
         * type 鼠标改变类型
         */
        addSheetEvt: function (type) {},
        keyPressEvt: function (key, text, modifiers) {
            if (modifiers == 0x04000000 && key == 0x53) { //ctrl + s
                return false;
            }

            if (modifiers != 0x00000000 && modifiers != 0x02000000) //判断组合键,不是组合键
            {
                return false;
            }
            //CTRL 上下左右 DELETE
            if (key == 0x01000021 || key == 0x04000000 || key == 0x01000012 || key == 0x01000013 || key == 0x01000014 || key == 0x01000015 || key == 0x01000007) {
                return false;
            }

            let decodeText = ParamOperator.decodeStrAndFree(text);
            //单元格是否允许编辑
            let isAllowEdit = DesignModule._isAllowEditCurrCell();
            if (isAllowEdit) { //允许编辑
                let selCell = getSelCellRect(); //获取当前点击的单元格
                let pos = ParamOperator.decodeStrAndFree(DesignModule._getSelBeginCell());//获取单元格位置信息
                let width = selCell.width;
                let height = selCell.height;
                let top = selCell.top;
                let left = selCell.left;
                showEditor(left, top, width, height);

                let curText = ParamOperator.decodeStrAndFree(DesignModule._getSelCellText()); //获取当前单元格文本
                //获取编辑焦点
                $("#editInput").focus().val("").val(curText + decodeText); //光标跳到末尾
            }
        },
        mouseMoveEvt: function () {},
        //模板标签切换事件，返回 改变后的 模板索引
        tableChangeEvt: function (index) {}
        ,
        //切换sheet事件
        sheetChangedEvt: function () {
            let index = DesignModule._getCurrentSheet();
            $('div[id^="backgroundDiv"]').hide();
            $('#backgroundDiv' + index).show();
            $('#backgroundDiv' + index).children('div').show();
        }
        ,
        selFrameChangedEvt: function ($0, $1, $2, $3) {
            //initCellAttr();
        }
        ,
        clickRowTagEvt: function () {

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
                dom.css("cursor", "url("+ base +"/images/design/shubiao3.png) 14 8,auto");
                //dom.css("cursor", "pointer");
            } else if (2 == type) {
                dom.css("cursor", "url("+ base +"/images/design/cursor/01.png) 16 16,auto");
            } else if (3 == type) {
                dom.css("cursor", "url("+ base +"/images/design/cursor/04.png) 16 16,auto");
            } else if (4 == type) {
                dom.css("cursor", "url("+ base +"/images/design/cursor/03.png) 16 16,auto");
            } else if (5 == type) {
                dom.css("cursor", "url('"+ base +"/images/design/cursor/05.png') 18 18,auto");
            } else if (7 == type) {
                dom.css("cursor", "move");
            } else if (8 == type) {
                dom.css("cursor", "url('"+ base +"/images/design/cursor/02.png') 16 16,auto");
            } else {
                dom.css("cursor", "default");
            }
        }
        ,

        /**
         *  *Description: 设计器滚动条滚动事件
         *  1: type, 类型 0水平 , 1垂直
         *  2: curPos,当前位置
         *  3: total,总值
         *  4: offsetX,水平偏移值
         *  5: offsetY,垂直偏移值
         */
        scrollBarEvt: function (type, curPos, total, offsetX, offsetY) {
            let index = DesignModule._getCurrentSheet(); //获取当前sheet索引值
            //设计器滚动条滚动的时候，设置contentDiv的偏移值
            $('#contentDiv' + index).css('left', parseInt($('#contentDiv' + index).css('left')) + offsetX);
            $('#contentDiv' + index).css('top', parseInt($('#contentDiv' + index).css('top')) + offsetY);
        }
        ,
        leftParentChangedEvt: function ($0, $1, $2, $3) {

        }
        ,
        topParentChangedEvt: function ($0, $1, $2, $3) {

        }
        ,
        removeSheetEvt: function () {
        }
        ,
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
        comboBoxClicked: function (nX, nY, nButton, sheetIndex, col, row, pRect, pList, sList, isMulti, isAllowEditCell) {
            if (isAllowEditCell) {
                isSelect = true;
                var rect = JSON.parse(ParamOperator.decodeStrAndFree(pRect));
                var data = JSON.parse(ParamOperator.decodeStrAndFree(pList));
                var text = JSON.parse(ParamOperator.decodeStrAndFree(sList));
                $('#singeSelDiv').empty();
                var val = ParamOperator.decodeStrAndFree(DesignModule._getSelCellText());
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

                let totalHeight = $('body').height(); //页面的整体高度
                let top = rect.Y + $('#buttonDiv').height() + rect.Height + 1 + ($('#ef-grid-param').css('display') == 'none' ? 0 : $('#ef-grid-param').height()); //向上位移值
                let remainHeight = totalHeight - top;
                let dataDivHeight = 20 * data.length + 1; //数据区域高度

                if (dataDivHeight > remainHeight) {
                    dataDivHeight = remainHeight - 10;
                }

                if (isMulti) {
                    $("#singeSelDiv").css({
                        "position": "absolute",
                        "border": "1px solid #44B4FF",
                        "top": rect.Y + $('#buttonDiv').height() + rect.Height + 1 + $('#ef-grid-param').height(),
                        "left": rect.X + 1,
                        "min-width": rect.Width - 1,
                        "width": "auto",
                        "height": dataDivHeight,
                        "background-color": 'white',
                        "z-index": 1007,
                        "overflow": "auto"
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
                        var t = DesignModule._setSelCellText(str);
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
                        "top": rect.Y + $('#buttonDiv').height() + rect.Height + 1 + ($('#ef-grid-param').css('display') == 'none' ? 0 : $('#ef-grid-param').height()),
                        "left": rect.X + 1,
                        "min-width": rect.Width - 1,
                        "width": "auto",
                        "height": dataDivHeight,
                        "background-color": 'white',
                        "z-index": 1007,
                        "overflow": "auto"
                    }).show();

                    $('input[name="radioInput"]').bind('change', function () {
                        var checkVal = $('input[name="radioInput"]:checked').val()
                        var str = ParamOperator.encodeStr(checkVal);
                        var t = DesignModule._setSelCellText(str);
                        $("#singeSelDiv").empty().hide();
                    });

                    $("#singeSelDiv").children('div').bind('click', function () {
                        var radio = $(this).children('input[type="radio"]');
                        radio.prop('checked', true);
                        radio.trigger('change');
                    })
                }
            }

        }
        ,
        /**
         * 设置是否控件显示
         * */
        setSpreadReport: function (flag) {


        }
        ,
        /**
         * 获取是否控件显示
         * */
        isSpreadReport: function () {

        }
        ,
        /*********************************************************************************
         *Function:    int addDataRow(bool isCopyData)
         *Description: 添加数据添
         *Param:  bool[in]是否拷贝上一数据行
         *Return:  0,无意义;-１失败
         *Others:
         **********************************************************************************/
        addDataRow: function (flag) {

        }
        ,
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
        dateControlClicked: function (nX, nY, nButton, sheetIndex, col, row, pRect, hasTime, isAllowEditCell) {
            if (isAllowEditCell) {
                let rect = JSON.parse(ParamOperator.decodeStrAndFree(pRect));
                if (hasTime) {
                    $("#timeInput").css({
                        "position": "absolute",
                        "top": rect.Y + $('#buttonDiv').height() + 1 + ($('#ef-grid-param').css('display') == 'none' ? 0 : $('#ef-grid-param').height()),
                        "left": rect.X + 1,
                        "width": 1,
                        "height": rect.Height - 1,
                        "z-index": 1008
                    }).show().focus();
                } else {
                    $("#dateInput").css({
                        "position": "absolute",
                        "top": rect.Y + $('#buttonDiv').height() + 1 + ($('#ef-grid-param').css('display') == 'none' ? 0 : $('#ef-grid-param').height()),
                        "left": rect.X + 1,
                        "width": 1,
                        "height": rect.Height - 1,
                        "z-index": 1008
                    }).show().focus();
                }

                if (hasTime) { //日期时间
                    $("#timeInput").unbind().bind('click', function () {
                        laydate.render({
                            elem: '#timeInput', //指定元素,
                            format: 'yyyy-MM-dd HH:mm:ss',
                            show: true,
                            done: function (value, date, endDate) {
                                setText(value);
                            }
                        });
                    });
                    $("#timeInput").trigger('click');
                } else {//日期
                    $("#dateInput").unbind().bind('click', function () {
                        laydate.render({
                            elem: '#dateInput', //指定元素,
                            format: 'yyyy-MM-dd',
                            shwo: true,
                            done: function (value, date, endDate) {
                                setTextD(value);
                            }
                        });
                    });
                    $("#dateInput").trigger('click');
                }
            }
        }
        ,

        /*********************************************************************************
         *Function:    int removeDataRow()
         *Description: 删除数据行
         *Param:
         *Return:  0,无意义;-１失败
         *Others:
         **********************************************************************************/
        removeDataRow: function () {

        }
        ,
        /*********************************************************************************
         *Function:    const char* getAllUpdateDataInfo()
         *Description: 获取填报数据信息
         *Param:
         *Return:  空;填报数据信息
         *Others:
         **********************************************************************************/
        getAllUpdateDataInfo: function () {

        }
        ,
        /*********************************************************************************
         *Function:    int loadReportModelFromJsonStream(const char* byteArray)
         *Description: 加载数据填报模板数据
         *Param:  const char*[in]模板数据
         *Return:
         *Others:
         **********************************************************************************/
        loadReportModelFromJsonStream: function (byteArray) {

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
         *             7.上传后是否显示图片
         * Return:
         * Others:
         *
         * */
        fileUploadClicked: function ($0, $1, $2, $3, $4, $5, $6, isAllowEditCell) {
            //是否显示图片
            isShowPic = $6;
            if (isAllowEditCell && $2 == 1) {
                $('#fileBut').trigger('click');
            }

        }
        ,
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
        ,
        mousePressTableRegion: function (info) {
            let decodeInfo = ParamOperator.decodeStrAndFree(info);
            let infoJson = JSON.parse(decodeInfo);
            let index = layer.open({
                type: 2,
                area: ['500px', '500px'],
                closeBtn: 0,
                maxmin: false,
                title: ['筛选', 'height:30px;line-height:30px'],
                content: [base + '/filter.html', 'no'],
                btn: ['确定', '关闭'],
                resize: false,
                btnAlign: 'c',
                end: function () {

                },
                success: function (layero, index) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(infoJson, index);
                    DesignModule._cancelOperateState();
                },
                yes: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    let filterInfo = iframeWin.getFilterInfo();
                    filterByText(filterInfo);
                    layer.closeAll();
                }
            });
        }

    }
;


function copy() {
    let text = ParamOperator.decodeStrAndFree(DesignModule._getSelCellFormatText());
    $('#copyArea').val(text);
    $('#copyArea').select();
    document.execCommand("Copy"); //复制输入框的内容到剪切板
    layer.msg('复制成功', {
        icon: 1,
        time: 1000 //2秒关闭（如果不配置，默认是3秒）
    });
    $('#rightRowClickMenu').hide();

}

function copyR() {
    let text = ParamOperator.decodeStrAndFree(DesignModule._getSelCellShowValueText());
    $('#copyArea').val(text);
    $('#copyArea').select();
    document.execCommand("Copy"); //复制输入框的内容到剪切板
    layer.msg('复制成功', {
        icon: 1,
        time: 1000 //2秒关闭（如果不配置，默认是3秒）
    });
    $('#rightRowClickMenu').hide();
}

function hideEditor() {
    $("#editInput").css({
        left: 0,
        top: 0
    }).val("").hide();
    DesignModule._setSpreadFocus(); //设计器获取焦点
}

function showEditor(left, top, width, height) {
    //设置文本输入框的大小
    $("#editInput").css({ //在canvas上显示文本编辑框DIV
        "position": "absolute",
        "display": "block",
        "border": "1px solid #44B4FF",
        "top": top + ($('#normal-buttonDiv').css('display') == 'none' ? 0 : $('#normal-buttonDiv').height()) + ($('#buttonDiv').css('display') == 'none' ? 0 : $('#buttonDiv').height()) + ($('#ef-grid-param').css('display') == 'none' ? 0 : $('#ef-grid-param').height()),
        "left": left + 1,
        "width": width - 1,
        "height": height - 1,
        "z-index": 1001
    }).focus().show();
    DesignModule._clearSpreadFocus(); //设计器失去焦点
}

//设计器粘贴操作
function mainPaste() {
   /* navigator.clipboard.readText()
        .then(text => {
            var str = encodeStr(text);
            DesignModule._copyClipboardDataToSpreadsheet(str);
            DesignModule._paste();
        })
        .catch(err => {

        });*/
    let v = $('#copyArea').val();
    let str = ParamOperator.encodeStr(v);
    DesignModule._copyClipboardDataToSpreadsheet(str);
    DesignModule._paste();
    $('#rightRowClickMenu').hide();
}

//获取当前单元格
function getSelCellRect() {
    let str = DesignModule._getSelCellRect();
    str = ParamOperator.decodeStrAndFree(str);
    if (str != '') {
        selRect = JSON.parse(str);
        return selRect;
    }
}


function bindEditInput(){
    $('#editInput').unbind().bind('keyup', function (event) {
            if (event.ctrlKey && event.keyCode == 86) { // v
                navigator.clipboard.readText()
                    .then(content => {
                        let text = $('#editInput').val(); //获取输入框内的值
                        let newText = text + content;
                        $('#editInput').val(newText);
                        DesignModule._setSelCellText(encodeStr(newText)); //设置当前选择的单元格文本
                    })
                    .catch(err => {

                    });
            } else if (event.ctrlKey && event.keyCode == 67) { //ctrl + c事件
                let text = $('#editInput').val(); //获取输入框内的值
                navigator.clipboard.writeText(text)
                    .then(() => {
                    })
                    .catch(err => {
                    });
            } else if (event.ctrlKey && event.keyCode == 88) {//ctrl + x事件
                let text = $('#editInput').val(); //获取输入框内的值
                navigator.clipboard.writeText(text)
                    .then(() => {
                        $('#editInput').val('');
                    })
                    .catch(err => {
                    });

            } else {
                let val = $(this).val(); //获取输入框内的值
                //判断输入的值
                let cellRect = getSelCellRect();
                let pos = ParamOperator.decodeStrAndFree(DesignModule._getSelBeginCell());
                let posJ = JSON.parse(pos);
                let json = {
                    "x": posJ.x,
                    "y": posJ.y,
                    "text": val
                }
                validate(posJ , val);
                DesignModule._setCellText(ParamOperator.encodeStr(JSON.stringify(json))); //设置当前选择的单元格文本
            }

        }
    )
}
//验证输入的值
function validate(posJ , val){
    let controlInfo = ParamOperator.decodeStrAndFree(DesignModule._getCellControlInfo(posJ.x, posJ.y));
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
            if (-1 !== props.MaxLength && 0 !== props.MaxLength && props.MaxLength < val.length) {
                layer.alert("该控件最多允许输入" + props.MaxLength + "个字符");
                DesignModule._releaseMouse();
                $('#editInput').hide();
                return false;
            }
            //判断文本输入框的最小长度
            if (-1 !== props.MinLength && 0 !== props.MinLength && props.MinLength > val.length) {
                layer.alert("该控件至少须输入" + props.MinLength + "个字符");
                DesignModule._releaseMouse();
                $('#editInput').hide();
                return false;
            }
        }

        if (type == 8) {//小数控件
            if (isNaN(val)) {
                layer.alert("该控件只允许输入数字");
                DesignModule._releaseMouse();
                $('#editInput').hide();
                return false;
            }
            //不允许小数
            if (!props.AllowDecimal) {
                if (val.indexOf(".") > -1) {
                    layer.alert("该控件值不允许小数");
                    DesignModule._releaseMouse();
                    $('#editInput').hide();
                    return false;
                }
            } else {
                if (val.indexOf(".") != -1) {//小数
                    //判断允许多少位小数
                    if (0 < props.decimalPlace && val.substring(val.indexOf(".") + 1).length > props.decimalPlace) {
                        layer.alert("该控件值最多允许" + props.decimalPlace + "位小数");
                        DesignModule._releaseMouse();
                        $('#editInput').hide();
                        return false;
                    }
                }
            }

            //判断是否能为负数
            if (!props.AllowNegative && val.indexOf("-") > -1) {
                layer.alert("该控件值不允许负数");
                DesignModule._releaseMouse();
                $('#editInput').hide();
                return false;
            }

            //不判断最大值和最小值
            if (-1 == props.MaxValue && -1 == props.MinValue) {

            } else {
                //判断最大值
                if (0 !== props.MaxValue && Number(val) > props.MaxValue) {
                    layer.alert("该控件值允许的最大值为" + props.MaxValue);
                    DesignModule._releaseMouse();
                    $('#editInput').hide();
                    return false;
                }
                //判断最小值
                if (0 !== props.MinValue && Number(val) < props.MinValue) {
                    layer.alert("该控件值允许的最小值为" + props.MinValue);
                    DesignModule._releaseMouse();
                    $('#editInput').hide();
                    return false;
                }
            }


        }
    }
}
