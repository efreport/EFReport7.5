let multiParamMap = {}; //多选下拉控件ID和数据键值对
let multiObj = {};
let ymdMap = {}; //年月日控件map
let timeMap = {};//time控件Map
let ymMap = {};//年月控件Map
let paramStr = '';
let paramTypeMap = {}; //模板参数类型map
let singleTreeMap = {}; //单选下拉树控件ID和数据键值对
let singleTreeObj = {}; //单选下拉树控件ID和对象
let multiTreeMap = {}; //多选下拉树控件ID和数据键值对
let multiTreeObj = {}; //多选下拉树控件ID和对象
let checkBoxObj = []; //复选框控件集合,用来解决checkbox未选中时提交无参数值问题
let autoSearch;
let hiddenObj = {};
let paramTop;
let paramLeft;

//初始化参数工具栏(备份)
function initParams(xml, isSpreadRpt) {
    let paramObj;
    let xmlData = $.parseXML(xml);
    let paramXml = $(xmlData);
    if (isSpreadRpt) { //表格插件预览模板
        paramObj = $('#param1');
        paramObj.empty(); //清空参数工具栏
    } else {
        paramObj = $('#param');
        paramObj.empty(); //清空参数工具栏
    }

    let paramDesc = []; //控件联动参数信息
    let rowCount = paramXml.find("ParamCountByRow").text(); //每行数量
    let left = paramXml.find("LeftMargin").text(); //左边间隔
    paramLeft = left;
    let leftNum = parseInt(left);
    let top = paramXml.find("TopMargin").text(); //上方间隔
    paramTop = top;
    let topNum = parseInt(top);
    let interval = paramXml.find("ParamInterval").text(); //参数间隔
    //intervalP = interval;
    let row = parseInt(rowCount); //每行显示的参数个数
    autoSearch = paramXml.find("SearchByDefaultParam").text(); //是否自动查询
    //设置参数的左边边距和上方边距
    $('#param').css("padding-top", topNum + 'px');
    $('#param').css("padding-left", leftNum + 'px');

    let paramHtml = "";
    let formHtml = '<form class="layui-form" lay-filter="paramForm" action="">';
    paramHtml = paramHtml + formHtml;
    let paramIndex = 0; //统计显示的模板参数个数

    paramXml.find("ReportParam").each(function () {
        let paramName = $(this).find("ParamName").text(); //参数名称
        let paramType = $(this).find("ParamType").text(); //参数类型
        //1字符串 2整型 3浮点 4日期时间 5布尔,,,,当2,3时，必须要输入数据
        let dataType = $(this).find("DataType").text();
        let labelName = $(this).find("labelName").text(); //参数标签
        let isAffectParams = $(this).find("IsAffectParams").text(); //是否联动参数
        let paramWidth = $(this).find("Width").text();
        let isShow = $(this).find("IsShow").text(); //是否显示
        let defaultValue = $(this).find("DefaultValue").text(); //默认值

        paramTypeMap[paramName] = paramType;

        if (paramWidth != 0) { //模板参数不隐藏
            paramIndex++;
        }
        //模板参数需要换行
        if (paramIndex % rowCount == 1) {
            if (paramIndex != 1) {
                paramHtml = paramHtml + '</div>';
            }
            let paramDiv = '<div class="layui-form-item">';
            paramHtml = paramHtml + paramDiv;
        }
        paramObj.show();

        if (paramWidth == 0) {
            hiddenObj[paramName] = defaultValue;
        } else {


            if (paramType == 1) { //文本编辑框
                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="margin-right: '+ interval +'px">';
                let inputHtml;
                if (dataType == 1) { //字符串
                    inputHtml = '<input type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"   placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                } else if (dataType == 2) {//整型
                    inputHtml = '<input type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                } else if (dataType == 3) {//浮点
                    inputHtml = '<input type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                } else if (dataType == 4) {//日期时间
                    inputHtml = '<input type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                } else if (dataType == 5) {//布尔
                    inputHtml = '<input type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                }
                paramHtml = paramHtml + labelHtml + blockHtml + inputHtml;
                paramHtml = paramHtml + '</div>';
            } else if (paramType == 2) { //单选下拉
                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right: '+ interval +'px;">';
                let selectHtml;
                selectHtml = '<select name="' + paramName + '"  lay-search="">';
                let data = $(this).find("NodeData");//下拉框数据
                $.each(data, function () { //遍历生成option
                    let value = $(this).find("ActualFieldData").text(); //值
                    let text = $(this).find("ShowFieldData").text(); //文本
                    if (value == defaultValue) {
                        let optionHtml = '<option value="' + value + '" selected>' + text + '</option>';
                        selectHtml = selectHtml + optionHtml;
                    } else {
                        let optionHtml = '<option value="' + value + '" >' + text + '</option>';
                        selectHtml = selectHtml + optionHtml;
                    }

                });
                selectHtml = selectHtml + "</select>";
                paramHtml = paramHtml + labelHtml + blockHtml + selectHtml;
                paramHtml = paramHtml + '</div>';

            } else if (paramType == 3) { //多选下拉，目前不做联动
                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:'+ interval +'px">';
                let selectHtml;
                selectHtml = '<div name="' + paramName + '"  lay-search="" id="' + paramName + '"  style="width:' + paramWidth + 'px;">';
                let data = $(this).find("NodeData");//下拉框数据
                let dataArray = [];
                if (defaultValue != "") { //存在默认值
                    let defaultValueArr = defaultValue.split(',');
                    $.each(data, function () { //生成xmSelect渲染下拉多选所需的数据
                        let value = $(this).find("ActualFieldData").text(); //值
                        let text = $(this).find("ShowFieldData").text(); //文本
                        if ($.inArray(value, defaultValueArr) != -1) { //默认值
                            let dataObj = {
                                name: text,
                                value: value,
                                selected: true
                            }
                            dataArray.push(dataObj);
                        } else {
                            let dataObj = {
                                name: text,
                                value: value
                            }
                            dataArray.push(dataObj);
                        }

                    });
                } else {
                    $.each(data, function () { //生成xmSelect渲染下拉多选所需的数据
                        let value = $(this).find("ActualFieldData").text(); //值
                        let text = $(this).find("ShowFieldData").text(); //文本
                        let dataObj = {
                            name: text,
                            value: value
                        }
                        dataArray.push(dataObj);
                    });
                }

                selectHtml = selectHtml + "</div>";
                paramHtml = paramHtml + labelHtml + blockHtml + selectHtml;
                paramHtml = paramHtml + '</div>';

                multiParamMap[paramName] = dataArray;

            } else if (paramType == 4) { //单选下拉树
                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:'+ interval+'px">';
                let selectHtml;
                selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="width:' + paramWidth + 'px;">';
                let data = []
                //生成下拉树所需要的数据
                $(this).find("Node:eq(0)").children().each(function (ii) {
                    let children = [];
                    $(this).find("Node:eq(0)").children().each(function (iii) {
                        if ($(this).find("ActualFieldData:eq(0)").text() == defaultValue) {
                            children.push({
                                children: "",
                                parent: "",
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text(),
                                selected: true
                            });
                        } else {
                            children.push({
                                children: "",
                                parent: "",
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text()
                            });
                        }

                    });
                    //设置默认值
                    if ($(this).find("ActualFieldData:eq(0)").text() == defaultValue) {
                        data.push({
                            children: children,
                            parent: "",
                            value: $(this).find("ActualFieldData:eq(0)").text(),
                            name: $(this).find("ShowFieldData:eq(0)").text(),
                            selected: true
                        });
                    } else {
                        data.push({
                            children: children,
                            parent: "",
                            value: $(this).find("ActualFieldData:eq(0)").text(),
                            name: $(this).find("ShowFieldData:eq(0)").text()
                        });
                    }

                });

                selectHtml = selectHtml + "</ul>";
                paramHtml = paramHtml + labelHtml + blockHtml + selectHtml;
                paramHtml = paramHtml + '</div>';

                singleTreeMap[paramName] = data;


            } else if (paramType == 5) { //多选下拉树，目前不做联动处理

                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:'+ interval +'px">';
                let selectHtml;
                selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="width:' + paramWidth + 'px;">';
                let data = []
                //生成下拉树所需要的数据
                if (defaultValue != "") { //存在默认值
                    let defaultArr = defaultValue.split(',');
                    $(this).find("Node:eq(0)").children().each(function (ii) {
                        let children = [];

                        $(this).find("Node:eq(0)").children().each(function (iii) {
                            if ($.inArray($(this).find("ActualFieldData:eq(0)").text(), defaultArr) != -1) {
                                children.push({
                                    children: "",
                                    parent: "",
                                    value: $(this).find("ActualFieldData:eq(0)").text(),
                                    name: $(this).find("ShowFieldData:eq(0)").text(),
                                    selected: true
                                });
                            } else {
                                children.push({
                                    children: "",
                                    parent: "",
                                    value: $(this).find("ActualFieldData:eq(0)").text(),
                                    name: $(this).find("ShowFieldData:eq(0)").text()
                                });
                            }
                        });
                        if ($.inArray($(this).find("ActualFieldData:eq(0)").text(), defaultArr) != -1) {
                            data.push({
                                children: children,
                                parent: "",
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text(),
                                selected: true
                            });
                        } else {
                            data.push({
                                children: children,
                                parent: "",
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text()
                            });
                        }

                    });
                } else {
                    $(this).find("Node:eq(0)").children().each(function (ii) {
                        let children = [];
                        $(this).find("Node:eq(0)").children().each(function (iii) {
                            children.push({
                                children: "",
                                parent: "",
                                value: $(this).find("ActualFieldData:eq(0)").text(),
                                name: $(this).find("ShowFieldData:eq(0)").text()
                            });
                        });
                        data.push({
                            children: children,
                            parent: "",
                            value: $(this).find("ActualFieldData:eq(0)").text(),
                            name: $(this).find("ShowFieldData:eq(0)").text()
                        });
                    });
                }


                selectHtml = selectHtml + "</ul>";
                paramHtml = paramHtml + labelHtml + blockHtml + selectHtml;
                paramHtml = paramHtml + '</div>';

                multiTreeMap[paramName] = data;

            } else if (paramType == 6) {//日期 2010-02-03
                let dateType = $(this).find("DateType").text(); //时间类型
                let format;
                if (dateType == '0') { //yyyy-MM-dd
                    format = "yyyy-MM-dd";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "yyyy/MM/dd";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "yyyyMMdd";
                }
                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:'+ interval +'px">';
                let dateHtml;
                dateHtml = '<input type="text" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                dateHtml = dateHtml + "</select>";
                paramHtml = paramHtml + labelHtml + blockHtml + dateHtml;
                paramHtml = paramHtml + '</div>';
                if (defaultValue != '') {
                    ymdMap["param_" + paramIndex] = format + '@#' + defaultValue;
                } else {
                    ymdMap["param_" + paramIndex] = format;
                }

            } else if (paramType == 12) {//日期时间 2010-02-03 11:30:30
                let format;
                let dateType = $(this).find("DateType").text(); //时间类型
                if (dateType == '0') { //yyyy-MM-dd
                    format = "yyyy-MM-dd HH:mm:ss";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "yyyy/MM/dd HH:mm:ss";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "yyyyMMdd HH:mm:ss";
                }

                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:'+ interval +'px;">';
                let dateHtml;
                dateHtml = '<input type="text" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                dateHtml = dateHtml + "</select>";
                paramHtml = paramHtml + labelHtml + blockHtml + dateHtml;
                paramHtml = paramHtml + '</div>';
                if (defaultValue != '') {
                    timeMap["param_" + paramIndex] = format + '@#' + defaultValue;
                } else {
                    timeMap["param_" + paramIndex] = format;
                }

            } else if (paramType == 13) { //日期 2010-02
                let format;
                let dateType = $(this).find("DateType").text(); //时间类型
                if (dateType == '0') { //yyyy-MM-dd
                    format = "yyyy-MM";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "yyyy/MM";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "yyyyMM";
                } else if (dateType == '3') {// yyyyMMdd
                    format = "yyyy";
                }

                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:'+ interval +'px;">';
                let dateHtml;
                dateHtml = '<input type="text" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                dateHtml = dateHtml + "</select>";
                paramHtml = paramHtml + labelHtml + blockHtml + dateHtml;
                paramHtml = paramHtml + '</div>';
                if (defaultValue != '') {
                    ymMap["param_" + paramIndex] = format + '@#' + defaultValue;
                } else {
                    ymMap["param_" + paramIndex] = format;
                }


            } else if (paramType == 7) { //单选框
                checkBoxObj.push(paramName);
                let labelHtml = '<label class="layui-form-label">' + labelName + '</label>';
                let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:'+ interval +'px">';
                let checkHtml;
                if (defaultValue != '') {
                    if (defaultValue == 'true') { // true
                        checkHtml = '<input type="checkbox" name="' + paramName + '" title="选中" checked>';
                    } else { //false
                        checkHtml = '<input type="checkbox" name="' + paramName + '" title="选中">';
                    }
                } else {
                    checkHtml = '<input type="checkbox" name="' + paramName + '" title="选中">';
                }
                paramHtml = paramHtml + labelHtml + blockHtml + checkHtml;
                paramHtml = paramHtml + '</div>';
            }
        }
    });


    paramHtml = paramHtml + '</div>';
    paramHtml = paramHtml + '</form>';
    paramObj.append(paramHtml);
    //渲染多选下拉框
    $.each(multiParamMap, function (k, v) {
        let obj = xmSelect.render({
            // 这里绑定css选择器
            el: '#' + k,
            theme: {
                color: '#0094FF',
            },
            filterable: true,
            toolbar: {
                show: true, //显示工具条
                list: ['ALL', 'CLEAR']
            },
            // 渲染的数据
            data: v,
        })
        //以参数名为键来保存多选下拉框对象，下拉框对象用来获取最终的参数值
        multiObj[k] = obj;
    });
    //渲染年月日控件
    $.each(ymdMap, function (k, v) {
        let formatAndValue = v.split('@#');
        if (formatAndValue.length == 1) {
            laydate.render({
                elem: '#' + k, //指定元素,
                format: v
            });
        } else {
            laydate.render({
                elem: '#' + k, //指定元素,
                format: formatAndValue[0],
                value: formatAndValue[1]
            });
        }

    });
    //渲染年月日时间控件
    $.each(timeMap, function (k, v) {
        let formatAndValue = v.split('@#');
        if (formatAndValue.length == 1) {
            laydate.render({
                elem: '#' + k, //指定元素,
                type: 'datetime',
                format: v
            });
        } else {
            laydate.render({
                elem: '#' + k, //指定元素,
                type: 'datetime',
                format: formatAndValue[0],
                value: formatAndValue[1]
            });
        }

    });
    //渲染年月控件
    $.each(ymMap, function (k, v) {
        let formatAndValue = v.split('@#');
        if (formatAndValue.length == 1) {
            laydate.render({
                elem: '#' + k, //指定元素,
                format: v
            });
        } else {
            laydate.render({
                elem: '#' + k, //指定元素,
                format: formatAndValue[0],
                value: formatAndValue[1]
            });
        }

    });
    //渲染下拉单选树控件
    $.each(singleTreeMap, function (k, v) {
        let treeObj = xmSelect.render({
            el: "#" + k,
            clickClose: true,       //单选完关闭下拉框
            filterable: true,       //搜索
            direction: 'down',      // 展开方向 下
            radio: true,            //单选
            tree: {
                show: true,
                showFolderIcon: true,
                showLine: true,
                expandedKeys: true
            },
            theme: {
                color: '#0094FF',
            },
            height: "auto",
            data: [],
            model: {
                label: {type: 'text'}
                //, icon: 'hidden'
            },  //文本显示模式
            //处理方式
            on: function (data) {
                if (data.isAdd) {
                    return data.change.slice(0, 1)
                }
            },
        });

        treeObj.update({
            data: v,
            autoRow: true,
        })

        singleTreeObj[k] = treeObj;
    });
    //渲染下拉多选树控件
    $.each(multiTreeMap, function (k, v) {
        let treeObj = xmSelect.render({
            el: "#" + k,
            clickClose: false,       //单选完关闭下拉框
            filterable: true,       //搜索
            direction: 'down',      // 展开方向 下
            theme: {
                color: '#0094FF',
            },
            tree: {
                show: true,
                showFolderIcon: true,
                showLine: true,
                expandedKeys: true
            },
            toolbar: {
                show: true, //显示工具条
                list: ['ALL', 'CLEAR']
            },
            height: "auto",
            data: [],
            model: {
                label: {type: 'text'}
                //, icon: 'hidden'
            },  //文本显示模式
            //处理方式
            on: function (data) {

            },
        });

        treeObj.update({
            data: v,
            autoRow: false,
        })

        multiTreeObj[k] = treeObj;
    });
    //渲染form
    form.render();
    let paramHeight = paramObj.height();
    //添加查询按钮
    let buttonHtml = '<button type="button" class="layui-btn layui-btn-normal"  id="query" style="background-color: #0094FF;"><i class="layui-icon layui-icon-search"></i>查询</button>';

    paramObj.append(buttonHtml);
    let marginTop = (paramHeight + parseInt(paramTop) - $('#query').height()) / 2;
    let right = 60 + parseInt(paramLeft);
    $('#query').css({
        'position': 'absolute',
        'right': right + 'px',
        'top': marginTop + 'px'
    })
    let paramArray = [];
    //查询按钮事件
    $('#query').unbind().bind('click', function () {
        $('#loadgif').show();
        paramStr = '';
        form.submit('paramForm', function (data) {
            //遍历所有的模板参数，排除掉k='select'的参数
            $.each(data.field, function (k, v) {
                if (paramTypeMap[k] == '7') { //模板参数类型为复选框
                    //复选框的值为on和off
                    if (v == 'on') {
                        v = true;
                    }
                    if (v == 'off') {
                        v = false;
                    }
                }
                if (k != 'select') {
                    paramArray.push(k);
                    paramStr = paramStr + k + '=' + encodeURIComponent(v) + ";";
                }
            })
            $.each(multiObj, function (k, v) {
                let valueArr = v.getValue();
                let valStr = '';
                $.each(valueArr, function (index, ele) {
                    let val = ele.value;
                    if (index == valueArr.length - 1) {
                        valStr = valStr + val;
                    } else {
                        valStr = valStr + val + ',';
                    }
                })
                //enc、odeURIComponent
                paramArray.push(k);
                paramStr = paramStr + k + '=' + encodeURIComponent(valStr) + ";";
            })

            $.each(singleTreeObj, function (k, v) {
                let valueArr = v.getValue();
                let valStr = '';
                $.each(valueArr, function (index, ele) {
                    let val = ele.value;
                    if (index == valueArr.length - 1) {
                        valStr = valStr + encodeURIComponent(val);
                    } else {
                        valStr = valStr + encodeURIComponent(val) + ',';
                    }
                })
                //encodeURIComponent
                paramArray.push(k);
                paramStr = paramStr + k + '=' + (valStr) + ";";
            })

            $.each(multiTreeObj, function (k, v) {
                let valueArr = v.getValue();
                let valStr = '';
                $.each(valueArr, function (index, ele) {
                    let val = ele.value;
                    if (index == valueArr.length - 1) {
                        valStr = valStr + encodeURIComponent(val);
                    } else {
                        valStr = valStr + encodeURIComponent(val) + ',';
                    }
                })
                //encodeURIComponent
                paramArray.push(k);
                paramStr = paramStr + k + '=' + (valStr) + ";";
            })
        });

        /**
         * 解决checkbox未选中状态无参数的问题
         * **/

        $.each(checkBoxObj, function (index, element) {
            if ($.inArray(element, paramArray) == -1) {
                paramStr = paramStr + element + '=false;';
            }
        });

        /***
         * 解决width=0的参数
         */
        $.each(hiddenObj , function(k,v){
            paramStr = paramStr + k + '='+ v +';';
        })

        //根据参数查询，更新报表区域内容
        let url;
        if (templateName == '') {
            url = base + "/report/query?isLoaded=1&templateId=" + id + "&sheetName=&params=" + encodeURIComponent(paramStr) + "&token=" + token;
        } else {
            url = base + "/report/query?isLoaded=1&templateId=" + id + "&sheetName=&params=" + encodeURIComponent(paramStr) + "&templateName=" + templateName + "&token=" + token;
        }
        $.ajax({
            url: url,
            type: "GET",
            success: function (res) {
                $('#content').empty();
                if (res.state == 'success' && res.type == 2) {
                    reportJson = JSON.parse(res.message);
                    colorList = reportJson.ColorList; //初始化颜色列表
                    fontList = reportJson.FontList; //初始化字体列表
                    sheetInfos = reportJson.SheetInfos; //初始化sheet数组
                    pathId = reportJson.pathId; //初始化路径ID
                    serverId = reportJson.serverId; //初始化服务器ID
                    wcp = reportJson.WebCellPercent;
                    kr = reportJson.KeepHVRatio;
                    isAfs = (reportJson.AutoFontSize == undefined); //文本自否自适应
                    isUploadCel = res.isUploadCel; //是否填报模板
                    //区域刷新
                    initRefresh(reportJson);

                    let formH = reportJson.Pages[0].FormH; //获取页面JSON
                    let isForm = (formH != undefined); //判断是否是Form状态
                    //有背景图片时，设置背景图片
                    if (reportJson.hasOwnProperty("WebBKImage")) {
                        let bgImg = reportJson.WebBKImage.split("/");
                        $('.content').css({
                            "background-image": "url('" + (base + '/export' + "/" + bgImg[bgImg.length - 2]) + "/" + bgImg[bgImg.length - 1] + "')",
                            "background-repeat": "no-repeat",
                            "background-position": "0 0",
                            "background-size": "100% 100%"
                        });
                    } else {//无背景图片时，设置背景颜色
                        if (reportJson.hasOwnProperty("WebBKColor")) { //whj
                            $('body').css("background-color", reportJson.WebBKColor);
                            $('.x-data-block').css("background-color", reportJson.WebBKColor);
                        }
                    }
                    if (!isSpreadRpt) { //普通模式预览
                        //不显示工具栏
                        if (!reportJson.ShowToolBar) {
                            $('#tool').css('display', 'none');
                            $('#content').css('top', $('#param').height() + 'px');
                        } else {
                            $('#tool').show();
                            paramObj.css('top', $('#tool').height() + 'px');
                            $('#content').css('top', $('#param').height() + $('#tool').height()  + parseInt(paramTop) + 'px');
                        }
                        //初始化SHEET页
                        initSheets(sheetInfos);
                        //初始化报表区域
                        if (!isForm) {
                            if (wcp == 0) { //初始化常规报表
                                initNormalReport('_tb_0', sheetInfos[0]);
                                setContentHeight();
                            } else { //初始化自适应报表
                                initWcpReport('_tb_0', sheetInfos[0]);
                            }
                        } else { //画布预览
                            if (wcp == 0) { //非自适应Form
                                initForm();
                            } else { //自适应Form
                                initWcpForm();
                            }
                        }
                    }
                    setContentHeight(reportJson.IsShowCenterReport);
                    $('#loadgif').hide();
                }
                //生成模板参数xml文件
                if (res.state == "success" && res.type == 1) {
                    //初始化模板参数
                    initParams(res.message);
                }

                //表格插件预览
                if (res.type == 3) {
                    reportJson = JSON.parse(res.message);
                    isUploadFlag = res.isUploadDataAllowed;
                    pathId = res.pathId; //初始化路径ID
                    initSubmitUploadInfo(reportJson);
                    //隐藏普通报表预览DIV
                    $("#report").hide();
                    //显示表格插件预览DIV
                    $("#submit").show();
                    //初始化设计器

                    //是否显示工具栏
                    let ShowToolBar = reportJson.ShowToolBar;
                    let ShowParamToolBar = reportJson.ShowParamToolBar;
                    //初始化设计器
                    if (uploadInfos.length == 0) { //非填报模板
                        $('#buttonDiv').hide();
                        //不显示工具栏
                        if (!ShowToolBar) {
                            $('#normal-buttonDiv').hide();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('#param1').hide();
                                $('.x-canvas-container').css('top', 0);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#param1').show();
                                $('.x-canvas-container').css('top', $('#param1').height());
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#param1').height()
                                })
                            }
                        } else { //显示工具栏
                            $('#normal-buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('#param1').hide();
                                $('.x-canvas-container').css('top', 0);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#normal-buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#param1').show();
                                $('#param1').css('top', $('#normal-buttonDiv').height());
                                let paramHeight;
                                if ($('#param1').height() == 0) {
                                    paramHeight = 0;
                                    $('#param1').css('padding', 0);
                                } else {
                                    paramHeight = $('#param1').height();
                                }
                                $('.x-canvas-container').css('top', paramHeight + $('#normal-buttonDiv').height());
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - paramHeight - $('#normal-buttonDiv').height()
                                })
                            }
                        }
                    } else { //填报模板
                        $('#normal-buttonDiv').hide();
                        //不显示工具栏
                        if (!ShowToolBar) {
                            $('#buttonDiv').hide();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('.x-canvas-container').css('top', 0);
                                $('#param1').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#param1').show();
                                $('.x-canvas-container').css('top', $('#param1').height() + paramTop);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#param1').height() - paramTop
                                })
                            }
                        } else { //显示工具栏
                            $('#buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('.x-canvas-container').css('top', $('#buttonDiv').height());
                                $('#param1').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#param1').show();
                                let paramHeight;
                                if ($('#param1').height() == 0) {
                                    paramHeight = 0;
                                    $('#param1').css('padding', 0);
                                } else {
                                    paramHeight = $('#param1').height() + paramTop;
                                }
                                $('.x-canvas-container').css('top', paramHeight + $('#buttonDiv').height());
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - paramHeight - $('#buttonDiv').height()
                                })
                            }
                        }
                    }
                    $('.x-canvas-container').show();
                    if (isCanvasLoaded == 0) {//canvas未绑定过
                        Design.init(base + "/wasm/WebDesigner_7.2");
                        $("#editInput").bind('keydown', keyDownF);
                        $("#loadgif").hide();
                        isCanvasLoaded = 1;
                    } else {
                        //TempOperator.loadCel2('', "temp", 0);
                        Module._setTabDisplay(false);
                        var dataStr = ParamOperator.encodeStr(JSON.stringify(reportJson));
                        Module._loadReportModelFromJsonStream(dataStr)

                        $("#loadgif").hide();
                    }
                }

            },
            error: function () {

            }
        })
        paramArray = [];
        return false;
    });

    if (autoSearch == 1) {//自动查询
        $('#query').trigger('click');//触发查询按钮
        paramArray = [];
    }
    //显示模板参数
    paramObj.show();
}

//获取所有的模板参数
function getParams() {
    let params = '';
    var paramData = form.val("paramForm");
    $.each(paramData, function (k, v) {
        if (v == 'on') {
            v = true;
        }
        if (v == 'off') {
            v = false;
        }
        if (k != 'select') { //多选下拉，下拉树，多选下拉树
            params += k + '=' + encodeURIComponent(v) + ';';
        }

    })
    //处理多选下拉，下拉树和多选下拉树
    $.each(multiObj, function (k, v) {
        let valueArr = v.getValue();
        let valStr = '';
        $.each(valueArr, function (index, ele) {
            let val = ele.value;
            if (index == valueArr.length - 1) {
                valStr = valStr + val;
            } else {
                valStr = valStr + val + ',';
            }
        })
        params = params + k + '=' + encodeURIComponent(valStr) + ";";
    })

    $.each(singleTreeObj, function (k, v) {
        let valueArr = v.getValue();
        let valStr = '';
        $.each(valueArr, function (index, ele) {
            let val = ele.value;
            if (index == valueArr.length - 1) {
                valStr = valStr + encodeURIComponent(val);
            } else {
                valStr = valStr + encodeURIComponent(val) + ',';
            }
        })
        params = params + k + '=' + (valStr) + ";";
    })

    $.each(multiTreeObj, function (k, v) {
        let valueArr = v.getValue();
        let valStr = '';
        $.each(valueArr, function (index, ele) {
            let val = ele.value;
            if (index == valueArr.length - 1) {
                valStr = valStr + encodeURIComponent(val);
            } else {
                valStr = valStr + encodeURIComponent(val) + ',';
            }
        })
        params = params + k + '=' + (valStr) + ";";
    })


    //处理checkbox未选中时无值的问题
    $.each(checkBoxObj, function (index, element) {
        if (paramData[element] == undefined) {
            params = params + element + '=false;';
        }
    });

    return params;
}