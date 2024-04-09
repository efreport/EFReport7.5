let selectHeightMap = {};
let singleParamMap = {}; //单选下拉
let singleObj = {};
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
let levelsTreeMap = {}; //无限极下拉树
let levelsTreeObj = {};
let checkBoxObj = []; //复选框控件集合,用来解决checkbox未选中时提交无参数值问题
let autoSearch;
let hiddenObj = {};
let paramTop = 0;
let paramLeft;
let paramMap = {}; // 全局变量用来保存当前模板预览时的实时参数
let influenceMap = {}; //联动参数Map
let dataIndex = 0;
let dpv = {}; //参数默认值
let dpt = {}; //参数类型
let paramLDMap = {}; //参数联动
let dateRef = {};
let deParamMap;
let requireArray = {};
let originData = {};
let isNewFlag;
let pTypeMap = {};

//初始化参数工具栏
function initParams(xml, isSpreadRpt, paramData) {
    originData = $.extend(true ,{}, paramData);
    deParamMap = {};
    //处理通过url传过来的参数
    if (dParam != undefined) {
        let deParam = decodeURIComponent(dParam);
        let deParams = deParam.split(";");
        $.each(deParams, function (i, e) {
            let kav = e.split("=");
            if (kav[0] != "") {
                deParamMap[kav[0]] = kav[1];
            }
        })
    }
    let paramObj;
    let paramJson = JSON.parse(xml);
    if (isSpreadRpt) { //表格插件预览模板
        paramObj = $('#ef-grid-param');
        paramObj.empty(); //清空参数工具栏
    } else {
        paramObj = $('#ef-normal-param');
        paramObj.empty(); //清空参数工具栏
    }
    paramObj.hide();
    let paramDesc = []; //控件联动参数信息
    let paramOption = paramJson['ParamOption']; //参数配置
    let rowCount = paramOption['ParamCountByRow']; //每行数量
    let left = paramOption['LeftMargin']; //左边间隔
    let paramTool = paramJson['ParamToolbar']; //布局查询按钮
    if (paramTool == undefined) {
        isNewFlag = false;
        paramLeft = left;
        let leftNum = parseInt(left);
        let top = paramOption['TopMargin']; //上方间隔
        paramTop = top;
        let topNum = parseInt(top);
        let interval = paramOption['ParamInterval']; //参数间隔
        //intervalP = interval;
        let row = parseInt(rowCount); //每行显示的参数个数
        autoSearch = paramOption['SearchByDefaultParam']; //是否自动查询
        let isShowParamToolBar = paramOption['IsShowParamToolBar']; //是否显示参数工具栏
        //设置参数的左边边距和上方边距
        $('#ef-normal-param').css("padding-top", topNum + 'px');
        $('#ef-normal-param').css("padding-left", leftNum + 'px');

        let paramHtml = "";
        let formHtml = '<form class="layui-form" lay-filter="paramForm" action="">';
        paramHtml = paramHtml + formHtml;
        let paramIndex = 0; //统计显示的模板参数个数
        let totalWidth = 0;
        /**
         * 解决模板参数只有1个文本编辑框时，回车会触发表单提交的问题
         * **/
        paramHtml += '<input id="hidden" type="text" style="display:none" />';
        let reportParams = paramJson['ReportParam'];
        $.each(reportParams, function (i, e) {
            let paramName = e["ParamName"];
            let paramType = e["ParamType"];
            //1字符串 2整型 3浮点 4日期时间 5布尔,,,,当2,3时，必须要输入数据
            let dataType = e["DataType"];
            pTypeMap[paramName] = dataType;
            let labelName = e["labelName"];
            let isAffectParams = e["IsAffectParams"];
            let paramWidth = e["Width"];
            let isShow = e["IsShow"];
            let defaultValue = e["DefaultValue"];
            if (deParamMap[paramName] != undefined) { //替换掉默认值
                defaultValue = deParamMap[paramName];
            }
            dpv[paramName] = defaultValue;
            dpt[paramName] = paramType;
            //添加联动信息
            if (isAffectParams == '1') { //联动参数
                paramLDMap[paramName] = {
                    yl: e['DependentParams'],
                    ld: e['RepaintParams']
                }
            }
            paramTypeMap[paramName] = paramType;

            if (paramWidth != 0) { //模板参数不隐藏
                paramIndex++;
                totalWidth = totalWidth + paramWidth;
            }
            //模板参数需要换行
            if (paramIndex % rowCount == 1) {
                if (paramIndex != 1) {
                    paramHtml = paramHtml + '</div>';
                }
                let paramDiv = '<div class="layui-form-item">';
                paramHtml = paramHtml + paramDiv;
            }
            //paramObj.show();

            if (paramWidth == 0) {
                hiddenObj[paramName] = defaultValue;
            } else {
                if (paramType == 1) { //文本编辑框
                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="margin-right: ' + interval + 'px">';
                    let inputHtml;
                    if (dataType == 1) { //字符串
                        if (isAffectParams == '1') {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"   placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        } else {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"   placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    } else if (dataType == 2) {//整型
                        if (isAffectParams == '1') {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        } else {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    } else if (dataType == 3) {//浮点
                        if (isAffectParams == '1') {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">>';
                        } else {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    } else if (dataType == 4) {//日期时间
                        if (isAffectParams == '1') {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        } else {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    } else if (dataType == 5) {//布尔
                        if (isAffectParams == '1') {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        } else {
                            inputHtml = '<input  type="text" style="width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    }
                    paramHtml = paramHtml + labelHtml + blockHtml + inputHtml;
                    paramHtml = paramHtml + '</div>';
                } else if (paramType == 2) { //单选下拉
                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right: ' + interval + 'px;">';
                    let selectHtml;
                    let nullHtml = '<option></option>';
                    selectHtml = '<select name="' + paramName + '"  lay-search="">';
                    selectHtml = selectHtml + nullHtml;
                    let data = e["Node"];
                    $.each(data, function (ii, ee) { //遍历生成option
                        let value = ee["ActualFieldData"]; //值
                        let text = ee["ShowFieldData"]; //文本
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
                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px">';
                    let selectHtml;
                    selectHtml = '<div name="' + paramName + '"  lay-search="" id="' + paramName + '"  style="width:' + paramWidth + 'px;">';
                    let data = e["Node"];//下拉框数据
                    let dataArray = [];
                    if (defaultValue != "") { //存在默认值
                        let defaultValueArr = defaultValue.split(',');
                        $.each(data, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                            let value = ee["ActualFieldData"]; //值
                            let text = ee["ShowFieldData"]; //文本
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
                        $.each(data, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                            let value = ee["ActualFieldData"]; //值
                            let text = ee["ShowFieldData"]; //文本
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
                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px">';
                    let selectHtml;
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="width:' + paramWidth + 'px;">';
                    let data = [];

                    selectHtml = selectHtml + "</ul>";
                    paramHtml = paramHtml + labelHtml + blockHtml + selectHtml;
                    paramHtml = paramHtml + '</div>';

                    singleTreeMap[paramName] = paramData[paramName];


                } else if (paramType == 5) { //多选下拉树，目前不做联动处理

                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px">';
                    let selectHtml;
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="width:' + paramWidth + 'px;">';
                    selectHtml = selectHtml + "</ul>";
                    paramHtml = paramHtml + labelHtml + blockHtml + selectHtml;
                    paramHtml = paramHtml + '</div>';

                    multiTreeMap[paramName] = paramData[paramName];

                } else if (paramType == 14) { //无限极下拉树

                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px">';
                    let selectHtml;
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="width:' + paramWidth + 'px;">';
                    selectHtml = selectHtml + "</ul>";
                    paramHtml = paramHtml + labelHtml + blockHtml + selectHtml;
                    paramHtml = paramHtml + '</div>';

                    levelsTreeMap[paramName] = paramData[paramName];

                } else if (paramType == 6) {//日期 2010-02-03
                    let dateType = e["DateType"]; //时间类型
                    let format;
                    if (dateType == '0') { //yyyy-MM-dd
                        format = "yyyy-MM-dd";
                    } else if (dateType == '1') {//yyyy/MM/dd
                        format = "yyyy/MM/dd";
                    } else if (dateType == '2') {// yyyyMMdd
                        format = "yyyyMMdd";
                    }
                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px">';
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
                    dateRef["param_" + paramIndex] = paramName;

                } else if (paramType == 12) {//日期时间 2010-02-03 11:30:30
                    let format;
                    let dateType = e["DateType"]; //时间类型
                    if (dateType == '0') { //yyyy-MM-dd
                        format = "yyyy-MM-dd HH:mm:ss";
                    } else if (dateType == '1') {//yyyy/MM/dd
                        format = "yyyy/MM/dd HH:mm:ss";
                    } else if (dateType == '2') {// yyyyMMdd
                        format = "yyyyMMdd HH:mm:ss";
                    }

                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px;">';
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

                    dateRef["param_" + paramIndex] = paramName;


                } else if (paramType == 13) { //日期 2010-02
                    let format;
                    let dateType = e["DateType"]; //时间类型
                    if (dateType == '0') { //yyyy-MM-dd
                        format = "yyyy-MM";
                    } else if (dateType == '1') {//yyyy/MM/dd
                        format = "yyyy/MM";
                    } else if (dateType == '2') {// yyyyMMdd
                        format = "yyyyMM";
                    } else if (dateType == '3') {// yyyyMMdd
                        format = "yyyy";
                    }

                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px;">';
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
                    dateRef["param_" + paramIndex] = paramName;

                } else if (paramType == 7) { //单选框
                    checkBoxObj.push(paramName);
                    let labelHtml = '<label class="layui-form-label" title="' + labelName + '">' + labelName + '</label>';
                    let blockHtml = '<div class="layui-input-block" style="width:' + paramWidth + 'px;margin-right:' + interval + 'px">';
                    let checkHtml;
                    if (defaultValue != '') {
                        if (defaultValue == 'true') { // true
                            if (isAffectParams == '1') { //联动
                                checkHtml = '<input type="checkbox" name="' + paramName + '" title="' + labelName + '" checked onchange="checkLink(this)">';
                            } else {
                                checkHtml = '<input type="checkbox" name="' + paramName + '" title="' + labelName + '" checked>';
                            }
                        } else { //false
                            if (isAffectParams == '1') {
                                checkHtml = '<input type="checkbox" name="' + paramName + '" title="' + labelName + '" onchange="checkLink(this)">';
                            } else {
                                checkHtml = '<input type="checkbox" name="' + paramName + '" title="' + labelName + '">';
                            }
                        }
                    } else {
                        if (isAffectParams == '1') {
                            checkHtml = '<input type="checkbox" name="' + paramName + '" title="' + labelName + '" onchange="checkLink(this)">';
                        } else {
                            checkHtml = '<input type="checkbox" name="' + paramName + '" title="' + labelName + '">';
                        }
                    }
                    //paramHtml = paramHtml + labelHtml + blockHtml + checkHtml;
                    paramHtml = paramHtml + blockHtml + checkHtml;
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
                on: function (data) {
                    let paramValue = '';
                    let arr = data.arr;
                    $.each(arr, function (i, e) {
                        if (i == arr.length - 1) {
                            paramValue += e.value;
                        } else {
                            paramValue += (e.value + ',');
                        }
                    })
                    if (paramLDMap[k] != undefined) { //有联动信息
                        linkageParam(k, k, paramValue)
                    }
                },
                show: function () {
                    $('.layui-form-selected').removeClass('layui-form-selected');
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
                    format: v,
                    done: function (value, date, endDate) {
                        let paramName = dateRef[k];
                        if (paramLDMap[paramName] != undefined) { //如果有联动事件
                            linkageParam(paramName, paramName, value);
                        }
                    }
                });
            } else {
                laydate.render({
                    elem: '#' + k, //指定元素,
                    format: formatAndValue[0],
                    value: formatAndValue[1],
                    done: function (value, date, endDate) {
                        let paramName = dateRef[k];
                        if (paramLDMap[paramName] != undefined) { //如果有联动事件
                            linkageParam(paramName, paramName, value);
                        }
                    }
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
                    format: v,
                    done: function (value, date, endDate) {
                        let paramName = dateRef[k];
                        if (paramLDMap[paramName] != undefined) { //如果有联动事件
                            linkageParam(paramName, paramName, value);
                        }
                    }
                });
            } else {
                laydate.render({
                    elem: '#' + k, //指定元素,
                    type: 'datetime',
                    format: formatAndValue[0],
                    value: formatAndValue[1],
                    done: function (value, date, endDate) {
                        let paramName = dateRef[k];
                        if (paramLDMap[paramName] != undefined) { //如果有联动事件
                            linkageParam(paramName, paramName, value);
                        }
                    }
                });
            }

        });
        //渲染年月控件
        $.each(ymMap, function (k, v) {
            let formatAndValue = v.split('@#');
            if (formatAndValue.length == 1) {
                laydate.render({
                    elem: '#' + k, //指定元素,
                    format: v,
                    type: 'month',
                    done: function (value, date, endDate) {
                        let paramName = dateRef[k];
                        if (paramLDMap[paramName] != undefined) { //如果有联动事件
                            linkageParam(paramName, paramName, value);
                        }
                    }
                });
            } else {
                laydate.render({
                    elem: '#' + k, //指定元素,
                    type: 'month',
                    format: formatAndValue[0],
                    value: formatAndValue[1],
                    done: function (value, date, endDate) {
                        let paramName = dateRef[k];
                        if (paramLDMap[paramName] != undefined) { //如果有联动事件
                            linkageParam(paramName, paramName, value);
                        }
                    }
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
                showLine: false,
                tree: {
                    show: true,
                    //非严格模式
                    strict: false,
                    //默认展开节点
                    expandedKeys: [],
                    showLine: false,
                    //点击节点是否展开
                    clickExpand: true,
                    //点击节点是否选中
                    clickCheck: true
                },
                iconfont: {
                    parent: 'hidden'
                },
                theme: {
                    color: '#0094FF',
                },
                data: [],
                model: {
                    label: {type: 'text'}
                    //, icon: 'hidden'
                },  //文本显示模式
                //处理方式
                on: function (data) {
                    let paramValue = '';
                    let arr = data.arr;
                    $.each(arr, function (i, e) {
                        if (i == arr.length - 1) {
                            paramValue += e.value;
                        } else {
                            paramValue += (e.value + ',');
                        }
                    })
                    if (paramLDMap[k] != undefined) { //有联动信息
                        linkageParam(k, k, paramValue)
                    }
                },
                show: function () {
                    $('.layui-form-selected').removeClass('layui-form-selected');
                }
            });

            treeObj.update({
                data: v,
                showLine: false
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
                    //非严格模式
                    strict: false,
                    //默认展开节点
                    expandedKeys: [],
                    showLine: false,
                    //点击节点是否展开
                    clickExpand: true,
                    //点击节点是否选中
                    clickCheck: true
                },
                iconfont: {
                    parent: 'hidden'
                },
                toolbar: {
                    show: true, //显示工具条
                    list: ['ALL', 'CLEAR']
                },
                data: [],
                model: {
                    label: {type: 'text'}
                    //, icon: 'hidden'
                },  //文本显示模式
                //处理方式
                on: function (data) { //选中事件
                    let paramValue = '';
                    let arr = data.arr;
                    $.each(arr, function (i, e) {
                        if (i == arr.length - 1) {
                            paramValue += e.value;
                        } else {
                            paramValue += (e.value + ',');
                        }
                    })
                    if (paramLDMap[k] != undefined) { //有联动信息
                        linkageParam(k, k, paramValue)
                    }
                },
                show: function () {
                    $('.layui-form-selected').removeClass('layui-form-selected');
                }
            });

            treeObj.update({
                data: v,
                autoRow: false,
            })

            multiTreeObj[k] = treeObj;
        });

        //渲染下拉多选树控件
        $.each(levelsTreeMap, function (k, v) {
            let treeObj = xmSelect.render({
                el: "#" + k,
                theme: {
                    color: '#0094FF',
                },
                //单选模式
                radio: false,
                //选中关闭
                clickClose: false,
                showLine: false,
                //树
                tree: {
                    show: true,
                    showLine: false,
                    //非严格模式
                    strict: false,
                    //默认展开节点
                    expandedKeys: [-1],
                },
                toolbar: {
                    show: true, //显示工具条
                    list: ['ALL', 'CLEAR']
                },
                data: [],
                model: {
                    label: {type: 'text'}
                    //, icon: 'hidden'
                },  //文本显示模式
                //处理方式
                on: function (data) { //选中事件
                    let paramValue = '';
                    let arr = data.arr;
                    $.each(arr, function (i, e) {
                        if (i == arr.length - 1) {
                            paramValue += e.value;
                        } else {
                            paramValue += (e.value + ',');
                        }
                    })
                    if (paramLDMap[k] != undefined) { //有联动信息
                        linkageParam(k, k, paramValue)
                    }
                },
                show: function () {
                    $('.layui-form-selected').removeClass('layui-form-selected');
                }
            });

            treeObj.update({
                data: v,
                autoRow: false,
            })

            levelsTreeObj[k] = treeObj;
        });

        //渲染form
        form.render();
        let paramHeight = paramObj.height();
        //添加查询按钮
        let buttonHtml = '<button type="button" class="layui-btn layui-btn-normal"  id="query" style="background-color: #0094FF;"><i class="layui-icon layui-icon-search"></i>查询</button>';
        let rButtonHtml = '<button type="button" class="layui-btn layui-btn-normal"  id="reset" style="background-color: #F53F3F;"><i class="layui-icon layui-icon-set"></i>重置</button>';

        if (totalWidth == 0) { //所有模板参数的宽度都为0
            paramObj.append(buttonHtml);
            $('#query').css('display', 'none');
        } else {
            paramObj.append(buttonHtml);
        }
        let marginTop = (paramHeight + parseInt(paramTop) - $('#query').height()) / 2;
        let right = 60 + parseInt(paramLeft);
        $('#query').css({
            'position': 'absolute',
            'right': (right) + 'px',
            'top': marginTop + 'px'
        })
        let paramArray = [];
        //查询按钮事件
        $('#query').unbind().bind('click', function () {
            normalUploadIdArray = [];
            uploadIdArray = [];
            //解决多选下拉树和多选下拉框没有隐藏的问题
            $('.layui-form').trigger('click');

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
                //下拉多选
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
                    //encodeURIComponent
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

                $.each(levelsTreeObj, function (k, v) {
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
            $.each(hiddenObj, function (k, v) {
                paramStr = paramStr + k + '=' + encodeURIComponent(v) + ';';
            })

            processDParam(paramStr);


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
                beforeSend: function () {
                    $('#loadgif').show();
                },
                success: function (res) {
                    $('#content').empty();

                    if (res.type == 0) {
                        $('.x-canvas-container').css('top', $('#ef-grid-param').height());
                        $('.x-canvas-container').empty();
                        $('.x-canvas-container').append("<div style='color:red;font-size: 16px;'>" + res.errorInfo + "</div>");
                        $('#loadgif').hide();
                    }


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

                        if (reportJson.AllowPluginFullScreen != undefined) {//模板属性，是否允许插件双击全屏
                            allowPluginFullScreen = reportJson.AllowPluginFullScreen;
                        }
                        if (reportJson.BKColorPluginFullScreen != undefined) {
                            bKColorPluginFullScreen = reportJson.BKColorPluginFullScreen;
                        }

                        //区域刷新
                        initRefresh(reportJson);

                        let showToolBar = reportJson.ShowToolBar;
                        let showParamToolBar = reportJson.ShowParamToolBar;
                        //不显示工具栏
                        if (!showToolBar) {
                            $('#tool').css('display', 'none');
                            $('#content').css('top', 0);
                        } else { //显示工具栏
                            if (isUploadCel) { //如果是填报模板
                                $('#tool').find('.normal').hide();
                                $('#tool').find('.submit').css('display', 'inline-flex');
                                $('#tool').show();
                                $('#content').css('top', '40px');
                            }
                        }

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
                            if (!showToolBar) {
                                //显示参数工具栏
                                if (showParamToolBar) {
                                    $('#tool').css('display', 'none');
                                    $('#content').css('top', $('#ef-normal-param').height() + 'px');
                                } else { //不显示参数工具栏
                                    $('#tool').css('display', 'none');
                                    $('#ef-normal-param').css('display', 'none');
                                    $('#content').css('top', '0px');
                                }

                            } else { //显示工具栏
                                $('#tool').show();
                                if (showParamToolBar) { //显示参数工具栏
                                    paramObj.css('top', $('#tool').height() + 'px');
                                    $('#content').css('top', $('#ef-normal-param').height() + $('#tool').height() + parseInt(paramTop) + 'px');
                                } else { //不显示参数工具栏
                                    paramObj.css('display', 'none');
                                    $('#content').css('top', $('#tool').height());
                                }

                            }
                            //初始化SHEET页
                            initSheets(sheetInfos);
                            //初始化报表区域
                            if (!isForm) {
                                if (wcp == 0) { //初始化常规报表
                                    initUploadInfo(reportJson);
                                    initNormalReport('_tb_0', sheetInfos[0]);
                                    setContentHeight();
                                } else { //初始化自适应报表
                                    initWcpReport('_tb_0', sheetInfos[0]);
                                    $(window).resize(function () {
                                        window.location.reload();
                                    });
                                }
                            } else { //画布预览
                                if (wcp == 0) { //非自适应Form
                                    initForm('_tb_0', sheetInfos[0]);
                                } else { //自适应Form
                                    initWcpForm('_tb_0', sheetInfos[0]);
                                    $(window).resize(function () {
                                        window.location.reload();
                                    });
                                }
                            }
                        }
                        setContentHeight(reportJson.IsShowCenterReport);
                        $('#loadgif').hide();
                        bindRight();
                    }
                    //生成模板参数xml文件
                    if (res.state == "success" && res.type == 1) {
                        //初始化模板参数
                        initParams(res.message);
                    }

                    //表格插件预览
                    if (res.type == 3) {
                        document.oncontextmenu = function (ev) {
                            ev.preventDefault();
                        }
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
                                    $('#ef-grid-param').hide();
                                    $('.x-canvas-container').css('top', 0);
                                    $('.x-canvas-container').css({
                                        width: $('body').width(),
                                        height: $('body').height()
                                    })
                                } else { // 显示参数工具栏
                                    $('#ef-grid-param').show();
                                    $('.x-canvas-container').css('top', $('#ef-grid-param').height());
                                    $('.x-canvas-container').css({
                                        width: $('body').width(),
                                        height: $('body').height() - $('#ef-grid-param').height()
                                    })
                                }
                            } else { //显示工具栏
                                $('#normal-buttonDiv').show();
                                if (!ShowParamToolBar) { //不显示参数工具栏
                                    $('#ef-grid-param').hide();
                                    $('.x-canvas-container').css('top', $('#normal-buttonDiv').height());
                                    $('.x-canvas-container').css({
                                        width: $('body').width(),
                                        height: $('body').height() - $('#normal-buttonDiv').height()
                                    })
                                } else { // 显示参数工具栏
                                    $('#ef-grid-param').show();
                                    $('#ef-grid-param').css('top', $('#normal-buttonDiv').height());
                                    let paramHeight;
                                    if ($('#ef-grid-param').height() == 0) {
                                        paramHeight = 0;
                                        $('#ef-grid-param').css('padding', 0);
                                    } else {
                                        paramHeight = $('#ef-grid-param').height();
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
                                    $('#ef-grid-param').hide();
                                    $('.x-canvas-container').css({
                                        width: $('body').width(),
                                        height: $('body').height()
                                    })
                                } else { // 显示参数工具栏
                                    $('#ef-grid-param').show();
                                    $('.x-canvas-container').css('top', $('#ef-grid-param').height() + paramTop);
                                    $('.x-canvas-container').css({
                                        width: $('body').width(),
                                        height: $('body').height() - $('#ef-grid-param').height() - paramTop
                                    })
                                }
                            } else { //显示工具栏
                                $('#buttonDiv').show();
                                if (!ShowParamToolBar) { //不显示参数工具栏
                                    $('.x-canvas-container').css('top', $('#buttonDiv').height());
                                    $('#ef-grid-param').hide();
                                    $('.x-canvas-container').css({
                                        width: $('body').width(),
                                        height: $('body').height() - $('#buttonDiv').height()
                                    })
                                } else { // 显示参数工具栏
                                    $('#ef-grid-param').show();
                                    let paramHeight;
                                    if ($('#ef-grid-param').height() == 0) {
                                        paramHeight = 0;
                                        $('#ef-grid-param').css('padding', 0);
                                    } else {
                                        paramHeight = parseInt($('#ef-grid-param').height()) + parseInt(paramTop);
                                    }
                                    $('.x-canvas-container').css('top', paramHeight + parseInt($('#buttonDiv').height()));
                                    $('.x-canvas-container').css({
                                        width: $('body').width(),
                                        height: parseInt(($('body').height()) - paramHeight - parseInt($('#buttonDiv').height()))
                                    })
                                    $('#ef-grid-param').css('top', parseInt($('#buttonDiv').height()));
                                }
                            }
                        }
                        $('.x-canvas-container').show();
                        if (isCanvasLoaded == 0) {//canvas未绑定过
                            Design.init(base + "/wasm/WebDesigner_7.5");
                            //$("#editInput").bind('keydown', keyDownF);
                            bindEditInput();
                            isCanvasLoaded = 1;
                        } else {
                            DesignModule._setTabDisplay(false);
                            reportJson = JSON.parse(ParamOperator.decodeStrAndFree(DesignModule._uncompressStream(ParamOperator.encodeStr(JSON.stringify(reportJson)))));
                            let dataStr = ParamOperator.encodeStr(JSON.stringify(reportJson));
                            DesignModule._loadReportModelFromJsonStream(dataStr);
                            initRpt(reportJson);
                            $("#loadgif").hide();
                        }

                        $(window).resize(function () {
                            resizeCanvas();
                        });
                    }

                },
                error: function () {

                }
            })
            paramArray = [];
            return false;
        });

        form.on('select()', function (data) {
            let name = $(data.elem).attr('name');
            let value = data.value;
            if (paramLDMap[name] != undefined) { //是联动参数
                linkageParam(data.elem, name, value);
            }
        });

        form.on('checkbox()', function (data) {
            let name = $(data.elem).attr('name');
            let value = data.elem.checked;
            if (paramLDMap[name] != undefined) { //是联动参数
                linkageParam(data.elem, name, value);
            }
        });

        //显示模板参数
        if (isShowParamToolBar == 1) {
            paramObj.show();
        }

        if (autoSearch == 1) {//自动查询
            $('#loadgif').show();
            $('#query').trigger('click');//触发查询按钮
            paramArray = [];
        } else { //没有自动查询，需要调整显示区域的top值
            if ($('#ef-grid-param').css('display') == 'none') { //普通预览
                $('.content').css('top', $('#ef-normal-param').height() + parseInt(paramTop));
            } else { //表格插件预览
                $('.x-canvas-container').css('top', $('#ef-grid-param').height() + parseInt(paramTop))
            }
            $('#loadgif').hide();
        }

    } else {
        let isShowParamToolBar = paramOption['IsShowParamToolBar']; //是否显示参数工具栏
        initNewParams(isShowParamToolBar, paramObj, isSpreadRpt, paramData, paramJson);
    }

}

//获取所有的模板参数
function getParams(refreshParam) {
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
            paramMap[k] = v;
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
        paramMap[k] = valStr;
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
        paramMap[k] = valStr;
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
        paramMap[k] = valStr;
    })

    $.each(levelsTreeObj, function (k, v) {
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
        paramMap[k] = valStr;
    })


    //处理checkbox未选中时无值的问题
    $.each(checkBoxObj, function (index, element) {
        if (paramData[element] == undefined) {
            params = params + element + '=false;';
            paramMap[element] = false;
        }
    });

    if (refreshParam != undefined) { //处理区域刷新的参数
        var curParams = refreshParams.split(';');
        for (i = 0; i < curParams.length; i++) {
            var par = curParams[i];
            var pars = par.split('=');
            paramMap[pars[0]] = pars[1];
            params = params + pars[0] + '=' + pars[1] + ';';
        }
    }
    processDParam(params);
    return params;
}

//处理第三方传过来的参数
function processDParam(param) {
    let oldMap = {};
    let params = param.substr(5, param.length);
    let paramArr = params.split(';');
    $.each(paramArr, function (i, e) {
        let kav = e.split('=');
        oldMap[kav[0]] = kav[1];
    })
}

function processData(data, defaultValue) {
    //Node - NodeData - Node
    //子数据
    let nodeData = data.find("Node");
    if (nodeData.length == 0) { //没有子数据
        return [];
    } else { //存在子数据
        $.each(nodeData, function (i, e) {
            let nodeDatas = $(e);
            if (nodeDatas.find("Node").length == 0) { //没有下级数据

                if (nodeDatas.find("ActualFieldData:eq(0)").text() == defaultValue) {
                    root.push({
                        parent: "",
                        value: $(this).find("ActualFieldData:eq(0)").text(),
                        name: $(this).find("ShowFieldData:eq(0)").text(),
                        selected: true
                    });
                } else {
                    root.push({
                        parent: "",
                        value: $(this).find("ActualFieldData:eq(0)").text(),
                        name: $(this).find("ShowFieldData:eq(0)").text()
                    });
                }

            } else { //存在下级数据
                let childrenData = {}
                let children = [];
                let nodes = nodeDatas.find("Node");
                root.push(processData(nodes, children, defaultValue));

            }

        })
    }

}

//联动参数
function linkageParam(paramObj, paramName, paramValue) {
    let ylParams = paramLDMap[paramName]; //获取参数的联动和依赖信息
    let info = {};
    info['Initiator'] = paramName;
    let paramsMap = {};
    let yl = ylParams['yl'];
    let ld = ylParams['ld'];
    paramsMap[paramName] = paramValue;
    let length = 1;
    //遍历依赖参数
    $.each(yl, function (i, e) {
        let pName = e.ParamName; //依赖的参数名
        let value = getParamValueByName(pName);
        paramsMap[pName] = value;
        length++;
    })
    //遍历联动参数
    $.each(ld, function (i, e) {
        let pName = e.ParamName; //依赖的参数名
        let value = getParamValueByName(pName);
        paramsMap[pName] = value;
        length++;
    })
    let paramStr = '';
    let index = 0;
    $.each(paramsMap, function (k, v) {
        if (index == length - 1) {
            paramStr += (k + '=' + v);
        } else {
            paramStr += (k + '=' + v + ';');
        }
        index++;
    })
    info['Params'] = paramStr;
    //传当前参数，生成新的xml文件
    let url;
    if (templateName == '') {
        url = base + "/report/geneReportParamJson?templateId=" + id + "&info=" + encodeURIComponent(JSON.stringify(info)) + "&token=" + token;
    } else {
        url = base + "/report/geneReportParamJson?templateId=" + id + "&info=" + encodeURIComponent(JSON.stringify(info)) + "&templateName=" + templateName + "&token=" + token;
    }
    $.ajax({
        url: url,
        type: "GET",
        success: function (res) {
            let resJson = res.res;
            let dataObj = res.data;
            let reportParams = resJson['ReportParam']; //获取生成的参数数据
            let paramMap = {};
            $.each(reportParams, function (i, e) {
                let paramName = e.ParamName;
                paramMap[paramName] = e;
            })
            //遍历联动参数
            $.each(ld, function (i, e) {
                let paramName = e.ParamName;
                let paramProp = paramMap[paramName];
                let type = paramProp['ParamType']; //获取联动参数类型
                let node = paramProp['Node'];
                let defaultValue = paramProp['DefaultValue'];
                if (type == 2) { //下拉框
                    if(!isNewFlag){
                        let select = $('select[name="' + paramName + '"]');
                        select.empty();
                        $.each(node, function (ii, ee) { //遍历生成option
                            let value = ee["ActualFieldData"]; //值
                            let text = ee["ShowFieldData"]; //文本
                            let optionHtml;
                            if (value == defaultValue) {
                                optionHtml = '<option value="' + value + '" selected>' + text + '</option>';
                            } else {
                                optionHtml = '<option value="' + value + '" >' + text + '</option>';
                            }
                            select.append(optionHtml);
                            form.render();
                        });
                    }else{
                        let dataArray = [];
                        if (defaultValue != "") { //存在默认值
                            let defaultValueArr = defaultValue.split(',');
                            $.each(node, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                                let value = ee["ActualFieldData"]; //值
                                let text = ee["ShowFieldData"]; //文本
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
                            $.each(node, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                                let value = ee["ActualFieldData"]; //值
                                let text = ee["ShowFieldData"]; //文本
                                let dataObj = {
                                    name: text,
                                    value: value
                                }
                                dataArray.push(dataObj);
                            });
                        }

                        let obj = singleObj[paramName];

                     /*   let obj = xmSelect.render({
                            // 这里绑定css选择器
                            el: '#' + paramName,
                            theme: {
                                color: '#0094FF',
                            },
                            clickClose: true,
                            style: {'height': (selectHeightMap[paramName] - 2) + 'px','min-height': (selectHeightMap[paramName] - 2) + 'px','line-height': (selectHeightMap[paramName] - 2) + 'px'},
                            filterable: true,
                            radio: true,
                            toolbar: {
                                show: true, //显示工具条
                                list: ['ALL', 'CLEAR']
                            },
                            on: function () {

                            },
                            show: function () {
                                $('.layui-form-selected').removeClass('layui-form-selected');
                            },
                            // 渲染的数据
                            data: dataArray,
                        })*/
                        //以参数名为键来保存多选下拉框对象，下拉框对象用来获取最终的参数值
                        /*singleObj[paramName] = obj;*/
                        obj.update({
                            data: dataArray
                        })
                    }
                }

                if (type == '3') { //多选下拉
                    let dataArray = [];
                    if (defaultValue != "") { //存在默认值
                        let defaultValueArr = defaultValue.split(',');
                        $.each(node, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                            let value = ee["ActualFieldData"]; //值
                            let text = ee["ShowFieldData"]; //文本
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
                        $.each(node, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                            let value = ee["ActualFieldData"]; //值
                            let text = ee["ShowFieldData"]; //文本
                            let dataObj = {
                                name: text,
                                value: value
                            }
                            dataArray.push(dataObj);
                        });
                    }

                  /*  let obj = xmSelect.render({
                        // 这里绑定css选择器
                        el: '#' + paramName,
                        theme: {
                            color: '#0094FF',
                        },
                        style: {'height': (selectHeightMap[paramName] - 2) + 'px','min-height': (selectHeightMap[paramName] - 2) + 'px','line-height': (selectHeightMap[paramName] - 2) + 'px'},
                        filterable: true,
                        toolbar: {
                            show: true, //显示工具条
                            list: ['ALL', 'CLEAR']
                        },
                        on: function () {

                        },
                        show: function () {
                            $('.layui-form-selected').removeClass('layui-form-selected');
                        },
                        // 渲染的数据
                        data: dataArray,
                    })*/
                    let obj = multiObj[paramName];
                    obj.update({
                        data: dataArray,
                    })
                    //以参数名为键来保存多选下拉框对象，下拉框对象用来获取最终的参数值
                    //multiObj[paramName] = obj;
                }

                if (type == '4') { //下拉树
                    let node = dataObj[paramName]; //获取更新后的数据
                    let curTree = singleTreeObj[paramName]; //获取当前树对象
                    curTree.update({
                        data: node,
                        showLine: false
                    })
                }

                if (type == '5') { //多选下拉树
                    let node = dataObj[paramName]; //获取更新后的数据
                    let curTree = multiTreeObj[paramName]; //获取当前树对象
                    curTree.update({
                        data: node,
                        showLine: false
                    })
                }

                if (type == '14') { //多选下拉树
                    let node = dataObj[paramName]; //获取更新后的数据
                    let curTree = levelsTreeObj[paramName]; //获取当前树对象
                    curTree.update({
                        data: node,
                        showLine: false
                    })
                }
            })

        }
    });
}

//根据参数名获取参数值
function getParamValueByName(paramName) {
    let paramData = form.val("paramForm");
    let value;
    $.each(paramData, function (k, v) {
        if (v == 'on') {
            value = true;
        } else if (v == 'off') {
            value = false;
        } else {
            value = v;
        }
    })

    //单选下拉框
    $.each(singleObj, function (k, v) {
        if (k == paramName) {
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
            value = valStr;
        }
    })

    //多选下拉框
    $.each(multiObj, function (k, v) {
        if (k == paramName) {
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
            value = valStr;
        }
    })

    $.each(singleTreeObj, function (k, v) {
        let valueArr = v.getValue();
        let valStr = '';
        $.each(valueArr, function (index, ele) {
            let val = ele.value;
            if (index == valueArr.length - 1) {
                valStr = valStr + (val);
            } else {
                valStr = valStr + (val) + ',';
            }
        })
        if (k == paramName) {
            value = valStr;
        }
    })

    $.each(multiTreeObj, function (k, v) {
        let valueArr = v.getValue();
        let valStr = '';
        $.each(valueArr, function (index, ele) {
            let val = ele.value;
            if (index == valueArr.length - 1) {
                valStr = valStr + (val);
            } else {
                valStr = valStr + (val) + ',';
            }
        })
        if (k == paramName) {
            value = valStr;
        }
    })

    $.each(levelsTreeObj, function (k, v) {
        let valueArr = v.getValue();
        let valStr = '';
        $.each(valueArr, function (index, ele) {
            let val = ele.value;
            if (index == valueArr.length - 1) {
                valStr = valStr + (val);
            } else {
                valStr = valStr + (val) + ',';
            }
        })
        if (k == paramName) {
            value = valStr;
        }
    })

    return value;
}


function inputLink(obj) {
    let paramObj = $(obj);
    let value = paramObj.val();
    let paramName = paramObj.attr('name');
    //联动
    linkageParam(paramName, paramName, value);
}


function checkLink(obj) {
    let paramObj = $(obj);
    let value = paramObj.prop('checked');
    let paramName = paramObj.attr('name');
    //联动
    linkageParam(paramName, paramName, value);
}

//初始化新布局参数
function initNewParams(isShowParamToolBar, paramObj, isSpreadRpt, paramData, paramJson) {
    isNewFlag = true;
    let paramOption = paramJson['ParamOption']; //参数配置
    autoSearch = paramOption['SearchByDefaultParam']; //是否自动查询
    let padding = paramOption['ParamCountByRow'];
    //paramObj.css('position', 'relative');//改变布局方式
    let paramHtml = "";
    let formHtml = '<form class="layui-form" lay-filter="paramForm" action="">';
    paramHtml = paramHtml + formHtml;
    let paramIndex = 0; //统计显示的模板参数个数
    let totalWidth = 0;
    /**
     * 解决模板参数只有1个文本编辑框时，回车会触发表单提交的问题
     * **/
    paramHtml += '<input id="hidden" type="text" style="display:none" />';
    let reportParams = paramJson['ReportParam'];
    //根据绝对布局来定位模板参数
    $.each(reportParams, function (i, e) {
        let paramName = e["ParamName"];
        let paramType = e["ParamType"];
        //1字符串 2整型 3浮点 4日期时间 5布尔,,,,当2,3时，必须要输入数据
        let dataType = e["DataType"];
        let labelName = e["LabelName"];
        let isAffectParams = e["IsAffectParams"];
        let paramWidth = Math.ceil(e["Width"] * 100 / 96); //参数宽度
        let paramHeight = Math.ceil(e["Height"] * 100 / 96); //参数高度
        let x = e["X"]; //参数X坐标
        let y = e["Y"] //参数Y坐标
        let labelWidth = Math.ceil(e["LabelWidth"] * 100 / 96);
        let labelHeight = Math.ceil(e["LabelHeight"] * 100 / 96);
        let labelX = e["LabelX"];
        let labelY = e["LabelY"];
        let isShow = e["IsShow"];
        let defaultValue = e["DefaultValue"];
        let isRequire = e['RequiredField'];
        let labelVisible = e["LabelVisible"];
        let visible = e["Visible"];
        if(isRequire){
            labelName = labelName + '*';
            requireArray[paramName] = 'Y';
        }
        if (deParamMap[paramName] != undefined) { //替换掉默认值
            defaultValue = deParamMap[paramName];
        }
        dpv[paramName] = defaultValue;
        dpt[paramName] = paramType;
        //添加联动信息
        if (isAffectParams == '1') { //联动参数
            paramLDMap[paramName] = {
                yl: e['DependentParams'],
                ld: e['RepaintParams']
            }
        }
        paramTypeMap[paramName] = paramType;

        if (paramWidth != 0) { //模板参数不隐藏
            paramIndex++;
            totalWidth = totalWidth + paramWidth;
        }

        if (paramWidth == 0) {
            hiddenObj[paramName] = defaultValue;
        } else {
            if (paramType == 1) { //文本编辑框
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let inputHtml;
                if (dataType == 1) { //字符串
                    if (isAffectParams == '1') {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"   placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"   placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }
                    } else {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"   placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"   placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    }
                } else if (dataType == 2) {//整型
                    if (isAffectParams == '1') {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }
                    } else {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    }
                } else if (dataType == 3) {//浮点
                    if (isAffectParams == '1') {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">>';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">>';
                        }
                    } else {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    }
                } else if (dataType == 4) {//日期时间
                    if (isAffectParams == '1') {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left' + x + 'px;top' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left' + x + 'px;top' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }
                    } else {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left' + x + 'px;top' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left' + x + 'px;top' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    }
                } else if (dataType == 5) {//布尔
                    if (isAffectParams == '1') {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '" onchange="inputLink(this)">';
                        }
                    } else {
                        if(visible){
                            inputHtml = '<input  type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }else{
                            inputHtml = '<input  type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '"    placeholder="请输入" autocomplete="off" class="layui-input" value="' + defaultValue + '">';
                        }
                    }
                }
                paramHtml = paramHtml + labelHtml + inputHtml;
            } else if (paramType == 2) { //单选下拉
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let selectHtml;
                if(visible){
                    selectHtml = '<div name="' + paramName + '"  lay-search="" id="' + paramName + '"  style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }else{
                    selectHtml = '<div name="' + paramName + '"  lay-search="" id="' + paramName + '"  style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }
                let data = e["Node"];//下拉框数据
                let dataArray = [];
                if (defaultValue != "") { //存在默认值
                    let defaultValueArr = defaultValue.split(',');
                    $.each(data, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                        let value = ee["ActualFieldData"]; //值
                        let text = ee["ShowFieldData"]; //文本
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
                    $.each(data, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                        let value = ee["ActualFieldData"]; //值
                        let text = ee["ShowFieldData"]; //文本
                        let dataObj = {
                            name: text,
                            value: value
                        }
                        dataArray.push(dataObj);
                    });
                }

                selectHtml = selectHtml + "</div>";
                paramHtml = paramHtml + labelHtml + selectHtml;
                singleParamMap[paramName] = dataArray;
                selectHeightMap[paramName] = paramHeight;


            } else if (paramType == 3) { //多选下拉，目前不做联动
                let labelHtml;
                if(labelVisible){
                     labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                     labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let selectHtml;
                if(visible){
                    selectHtml = '<div name="' + paramName + '"  lay-search="" id="' + paramName + '"  style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }else{
                    selectHtml = '<div name="' + paramName + '"  lay-search="" id="' + paramName + '"  style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }
                let data = e["Node"];//下拉框数据
                let dataArray = [];
                if (defaultValue != "") { //存在默认值
                    let defaultValueArr = defaultValue.split(',');
                    $.each(data, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                        let value = ee["ActualFieldData"]; //值
                        let text = ee["ShowFieldData"]; //文本
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
                    $.each(data, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                        let value = ee["ActualFieldData"]; //值
                        let text = ee["ShowFieldData"]; //文本
                        let dataObj = {
                            name: text,
                            value: value
                        }
                        dataArray.push(dataObj);
                    });
                }

                selectHtml = selectHtml + "</div>";
                paramHtml = paramHtml + labelHtml + selectHtml;
                multiParamMap[paramName] = dataArray;
                selectHeightMap[paramName] = paramHeight;

            } else if (paramType == 4) { //单选下拉树
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let selectHtml;
                if(visible){
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }else{
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }
                let data = [];

                selectHtml = selectHtml + "</ul>";
                paramHtml = paramHtml + labelHtml + selectHtml;

                singleTreeMap[paramName] = paramData[paramName];
                selectHeightMap[paramName] = paramHeight;


            } else if (paramType == 5) { //多选下拉树，目前不做联动处理
                let labelHtml;
                if(labelVisible){
                     labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                     labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let selectHtml;
                if(visible){
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }else{
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }
                selectHtml = selectHtml + "</ul>";
                paramHtml = paramHtml + labelHtml + selectHtml;

                multiTreeMap[paramName] = paramData[paramName];
                selectHeightMap[paramName] = paramHeight;

            } else if (paramType == 14) { //无限极下拉树
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let selectHtml;
                if(visible){
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }else{
                    selectHtml = '<ul name="' + paramName + '"  id="' + paramName + '"  style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">';
                }
                selectHtml = selectHtml + "</ul>";
                paramHtml = paramHtml + labelHtml + selectHtml;

                levelsTreeMap[paramName] = paramData[paramName];
                selectHeightMap[paramName] = paramHeight;

            } else if (paramType == 6) {//日期 2010-02-03
                let dateType = e["DateType"]; //时间类型
                let format;
                if (dateType == '0') { //yyyy-MM-dd
                    format = "yyyy-MM-dd";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "yyyy/MM/dd";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "yyyyMMdd";
                }
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }

                let dateHtml;
                if(visible){
                    dateHtml = '<input type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                }else{
                    dateHtml = '<input type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                }
                dateHtml = dateHtml + "</select>";
                paramHtml = paramHtml + labelHtml + dateHtml;
                if (defaultValue != '') {
                    ymdMap["param_" + paramIndex] = format + '@#' + defaultValue;
                } else {
                    ymdMap["param_" + paramIndex] = format;
                }
                dateRef["param_" + paramIndex] = paramName;
                selectHeightMap[paramName] = paramHeight;

            } else if (paramType == 12) {//日期时间 2010-02-03 11:30:30
                let format;
                let dateType = e["DateType"]; //时间类型
                if (dateType == '0') { //yyyy-MM-dd
                    format = "yyyy-MM-dd HH:mm:ss";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "yyyy/MM/dd HH:mm:ss";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "yyyyMMdd HH:mm:ss";
                }
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let dateHtml;
                if(visible){
                    dateHtml = '<input type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                }else{
                    dateHtml = '<input type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                }
                dateHtml = dateHtml + "</select>";
                paramHtml = paramHtml + labelHtml + dateHtml;

                if (defaultValue != '') {
                    timeMap["param_" + paramIndex] = format + '@#' + defaultValue;
                } else {
                    timeMap["param_" + paramIndex] = format;
                }

                dateRef["param_" + paramIndex] = paramName;
                selectHeightMap[paramName] = paramHeight;

            } else if (paramType == 13) { //日期 2010-02
                let format;
                let dateType = e["DateType"]; //时间类型
                if (dateType == '0') { //yyyy-MM-dd
                    format = "yyyy-MM";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "yyyy/MM";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "yyyyMM";
                } else if (dateType == '3') {// yyyyMMdd
                    format = "yyyy";
                }
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let dateHtml;
                if(visible){
                    dateHtml = '<input type="text" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                }else{
                    dateHtml = '<input type="text" style="display:none;position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" name="' + paramName + '" class="layui-input" id="param_' + paramIndex + '">';
                }
                dateHtml = dateHtml + "</select>";
                paramHtml = paramHtml + labelHtml + dateHtml;
                if (defaultValue != '') {
                    ymMap["param_" + paramIndex] = format + '@#' + defaultValue;
                } else {
                    ymMap["param_" + paramIndex] = format;
                }
                dateRef["param_" + paramIndex] = paramName;
                selectHeightMap[paramName] = paramHeight;
            } else if (paramType == 7) { //单选框
                checkBoxObj.push(paramName);
                let labelHtml;
                if(labelVisible){
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: flex;align-items: center;justify-content: center;">' + labelName + '</label>';
                }else{
                    labelHtml = '<label class="layui-form-label" title="' + labelName + '" style="position: absolute;left:' + labelX + 'px;top:' + labelY + 'px;width:' + labelWidth + 'px;height:' + labelHeight + 'px;padding:0px;display: none;align-items: center;justify-content: center;">' + labelName + '</label>';
                }
                let checkHtml;
                if (defaultValue != '') {
                    if (defaultValue == 'true') { // true
                        if (isAffectParams == '1') { //联动
                            checkHtml = '<input style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" type="checkbox" name="' + paramName + '" title="' + labelName + '" checked onchange="checkLink(this)">';
                        } else {
                            checkHtml = '<input style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" type="checkbox" name="' + paramName + '" title="' + labelName + '" checked>';
                        }
                    } else { //false
                        if (isAffectParams == '1') {
                            checkHtml = '<input style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" type="checkbox" name="' + paramName + '" title="' + labelName + '" onchange="checkLink(this)">';
                        } else {
                            checkHtml = '<input style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" type="checkbox" name="' + paramName + '" title="' + labelName + '">';
                        }
                    }
                } else {
                    if (isAffectParams == '1') {
                        checkHtml = '<input style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" type="checkbox" name="' + paramName + '" title="' + labelName + '" onchange="checkLink(this)">';
                    } else {
                        checkHtml = '<input style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;" type="checkbox" name="' + paramName + '" title="' + labelName + '">';
                    }
                }
                //paramHtml = paramHtml + labelHtml + blockHtml + checkHtml;
                paramHtml = paramHtml + '<div class="layui-input-block checkDiv" style="position:absolute;left:' + x + 'px;top:' + y + 'px;height:' + paramHeight + 'px;width:' + paramWidth + 'px;">' + checkHtml + '</div>';
            }
        }
    });
    paramHtml = paramHtml + '</div>';
    paramHtml = paramHtml + '</form>';
    paramObj.append(paramHtml);
    //渲染多选下拉框
    $.each(singleParamMap, function (k, v) {
        let obj = xmSelect.render({
            // 这里绑定css选择器
            el: '#' + k,
            theme: {
                color: '#0094FF',
            },
            filterable: true,
            clickClose:true,
            radio: true,
            toolbar: {
                show: true, //显示工具条
                list: ['CLEAR']
            },
            style: {'height': (selectHeightMap[k] - 2) + 'px','min-height': (selectHeightMap[k] - 2) + 'px','line-height': (selectHeightMap[k] - 2) + 'px'},
            on: function (data) {
                let paramValue = '';
                let arr = data.arr;
                $.each(arr, function (i, e) {
                    if (i == arr.length - 1) {
                        paramValue += e.value;
                    } else {
                        paramValue += (e.value + ',');
                    }
                })
                if (paramLDMap[k] != undefined) { //有联动信息
                    linkageParam(k, k, paramValue)
                }
            },
            show: function () {
                $('.layui-form-selected').removeClass('layui-form-selected');
            },
            // 渲染的数据
            data: v,
        })
        //以参数名为键来保存多选下拉框对象，下拉框对象用来获取最终的参数值
        singleObj[k] = obj;
    });
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
            style: {'height': (selectHeightMap[k] - 2) + 'px','min-height': (selectHeightMap[k] - 2) + 'px','line-height': (selectHeightMap[k] - 2) + 'px'},
            on: function (data) {
                let paramValue = '';
                let arr = data.arr;
                $.each(arr, function (i, e) {
                    if (i == arr.length - 1) {
                        paramValue += e.value;
                    } else {
                        paramValue += (e.value + ',');
                    }
                })
                if (paramLDMap[k] != undefined) { //有联动信息
                    linkageParam(k, k, paramValue)
                }
            },
            show: function () {
                $('.layui-form-selected').removeClass('layui-form-selected');
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
                format: v,
                done: function (value, date, endDate) {
                    let paramName = dateRef[k];
                    if (paramLDMap[paramName] != undefined) { //如果有联动事件
                        linkageParam(paramName, paramName, value);
                    }
                }
            });
        } else {
            laydate.render({
                elem: '#' + k, //指定元素,
                format: formatAndValue[0],
                value: formatAndValue[1],
                done: function (value, date, endDate) {
                    let paramName = dateRef[k];
                    if (paramLDMap[paramName] != undefined) { //如果有联动事件
                        linkageParam(paramName, paramName, value);
                    }
                }
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
                format: v,
                done: function (value, date, endDate) {
                    let paramName = dateRef[k];
                    if (paramLDMap[paramName] != undefined) { //如果有联动事件
                        linkageParam(paramName, paramName, value);
                    }
                }
            });
        } else {
            laydate.render({
                elem: '#' + k, //指定元素,
                type: 'datetime',
                format: formatAndValue[0],
                value: formatAndValue[1],
                done: function (value, date, endDate) {
                    let paramName = dateRef[k];
                    if (paramLDMap[paramName] != undefined) { //如果有联动事件
                        linkageParam(paramName, paramName, value);
                    }
                }
            });
        }

    });
    //渲染年月控件
    $.each(ymMap, function (k, v) {
        let formatAndValue = v.split('@#');
        if (formatAndValue.length == 1) {
            laydate.render({
                elem: '#' + k, //指定元素,
                format: v,
                type: 'month',
                done: function (value, date, endDate) {
                    let paramName = dateRef[k];
                    if (paramLDMap[paramName] != undefined) { //如果有联动事件
                        linkageParam(paramName, paramName, value);
                    }
                }
            });
        } else {
            laydate.render({
                elem: '#' + k, //指定元素,
                type: 'month',
                format: formatAndValue[0],
                value: formatAndValue[1],
                done: function (value, date, endDate) {
                    let paramName = dateRef[k];
                    if (paramLDMap[paramName] != undefined) { //如果有联动事件
                        linkageParam(paramName, paramName, value);
                    }
                }
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
            showLine: false,
            style: {'height': (selectHeightMap[k] - 2) + 'px','min-height': (selectHeightMap[k] - 2) + 'px','line-height': (selectHeightMap[k] - 2) + 'px'},
            tree: {
                show: true,
                //非严格模式
                strict: false,
                //默认展开节点
                expandedKeys: [],
                showLine: false,
                //点击节点是否展开
                clickExpand: true,
                //点击节点是否选中
                clickCheck: true
            },
            iconfont: {
                parent: 'hidden'
            },
            theme: {
                color: '#0094FF',
            },
            data: [],
            model: {
                label: {type: 'text'}
                //, icon: 'hidden'
            },  //文本显示模式
            //处理方式
            on: function (data) {
                let paramValue = '';
                let arr = data.arr;
                $.each(arr, function (i, e) {
                    if (i == arr.length - 1) {
                        paramValue += e.value;
                    } else {
                        paramValue += (e.value + ',');
                    }
                })
                if (paramLDMap[k] != undefined) { //有联动信息
                    linkageParam(k, k, paramValue)
                }
            },
            show: function () {
                $('.layui-form-selected').removeClass('layui-form-selected');
            }
        });

        treeObj.update({
            data: v,
            showLine: false
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
            style: {'height': (selectHeightMap[k] - 2) + 'px','min-height': (selectHeightMap[k] - 2) + 'px','line-height': (selectHeightMap[k] - 2) + 'px'},
            tree: {
                show: true,
                //非严格模式
                strict: false,
                //默认展开节点
                expandedKeys: [],
                showLine: false,
                //点击节点是否展开
                clickExpand: true,
                //点击节点是否选中
                clickCheck: true
            },
            iconfont: {
                parent: 'hidden'
            },
            toolbar: {
                show: true, //显示工具条
                list: ['ALL', 'CLEAR']
            },
            data: [],
            model: {
                label: {type: 'text'}
                //, icon: 'hidden'
            },  //文本显示模式
            //处理方式
            on: function (data) { //选中事件
                let paramValue = '';
                let arr = data.arr;
                $.each(arr, function (i, e) {
                    if (i == arr.length - 1) {
                        paramValue += e.value;
                    } else {
                        paramValue += (e.value + ',');
                    }
                })
                if (paramLDMap[k] != undefined) { //有联动信息
                    linkageParam(k, k, paramValue)
                }
            },
            show: function () {
                $('.layui-form-selected').removeClass('layui-form-selected');
            }
        });

        treeObj.update({
            data: v,
            autoRow: false,
        })

        multiTreeObj[k] = treeObj;
    });

    //渲染下拉多选树控件
    $.each(levelsTreeMap, function (k, v) {
        let treeObj = xmSelect.render({
            el: "#" + k,
            theme: {
                color: '#0094FF',
            },
            //单选模式
            radio: false,
            //选中关闭
            clickClose: false,
            showLine: false,
            style: {'height': (selectHeightMap[k] - 2) + 'px','min-height': (selectHeightMap[k] - 2) + 'px','line-height': (selectHeightMap[k] - 2) + 'px'},
            //树
            tree: {
                show: true,
                showLine: false,
                //非严格模式
                strict: false,
                //默认展开节点
                expandedKeys: [-1],
            },
            toolbar: {
                show: true, //显示工具条
                list: ['ALL', 'CLEAR']
            },
            data: [],
            model: {
                label: {type: 'text'}
                //, icon: 'hidden'
            },  //文本显示模式
            //处理方式
            on: function (data) { //选中事件
                let paramValue = '';
                let arr = data.arr;
                $.each(arr, function (i, e) {
                    if (i == arr.length - 1) {
                        paramValue += e.value;
                    } else {
                        paramValue += (e.value + ',');
                    }
                })
                if (paramLDMap[k] != undefined) { //有联动信息
                    linkageParam(k, k, paramValue)
                }
            },
            show: function () {
                $('.layui-form-selected').removeClass('layui-form-selected');
            }
        });

        treeObj.update({
            data: v,
            autoRow: false,
        })

        levelsTreeObj[k] = treeObj;
    });

    //渲染form
    form.render();

    /*  let checkDivs = $('.checkDiv');
      $.each(checkDivs , function(i,e){
          let div = $(e);
          let childDiv = div.find('.layui-form-checkbox');
          childDiv.css('height' , div.css('height'));
          childDiv.css('width' , div.css('width'));
          childDiv.find('i').css('height' , div.css('height'));
      })*/

    let paramHeight = paramObj.height();
    let paramToolbar = paramJson['ParamToolbar'];
    let toolWidth = paramToolbar['Width'];
    let toolHeight = paramToolbar['Height'];
    let searchButton = paramToolbar['SearchButton'];
    let butWidth = Math.ceil(searchButton['Width'] * 100 / 96);
    let butHeight = Math.ceil(searchButton['Height'] * 100 / 96);
    let x = searchButton['X'];
    let y = searchButton['Y'];
    let sVisible = searchButton['Visible']; //是否可见
    let buttonText = searchButton['Text'];
    //添加查询按钮
    let buttonHtml;
    if(sVisible){
        buttonHtml = '<button type="button" class="layui-btn layui-btn-normal"  id="query" style="background-color: #0094FF;width:'+ butWidth +'px;height:'+ butHeight +'px;"><i class="layui-icon layui-icon-search"></i>' + buttonText + '</button>';
    }else{
        buttonHtml = '<button type="button" class="layui-btn layui-btn-normal"  id="query" style="display:none;background-color: #0094FF;width:'+ butWidth +'px;height:'+ butHeight +'px;"><i class="layui-icon layui-icon-search"></i>' + buttonText + '</button>';

    }

    let resetButton = paramToolbar['ResetButton'];
    let rbutWidth = Math.ceil(resetButton['Width'] * 100 / 96);
    let rbutHeight = Math.ceil(resetButton['Height'] * 100 / 96);
    let rx = resetButton['X'];
    let ry = resetButton['Y'];
    let rbuttonText = resetButton['Text'];
    let rVisible = resetButton['Visible'];
    let rButtonHtml;
    if(rVisible){
        rButtonHtml = '<button type="button" class="layui-btn layui-btn-normal"  id="reset" style="background-color: #0094FF;width:'+ rbutWidth +'px;height:'+ rbutHeight +'px;">'+ rbuttonText +'</button>';
    }else{
        rButtonHtml = '<button type="button" class="layui-btn layui-btn-normal"  id="reset" style="display:none;background-color: #0094FF;width:'+ rbutWidth +'px;height:'+ rbutHeight +'px;">'+ rbuttonText +'</button>';
    }

    if (totalWidth == 0) { //所有模板参数的宽度都为0
        paramObj.append(buttonHtml);
        paramObj.append(rButtonHtml);
        $('#query').css('display', 'none');
    } else {
        paramObj.append(buttonHtml);
        paramObj.append(rButtonHtml);
    }
    let marginTop = (paramHeight + parseInt(paramTop) - $('#query').height()) / 2;
    let right = 60 + parseInt(paramLeft);
    $('#query').css({
        'position': 'absolute',
        'left': x + 'px',
        'top': y + 'px',
        'width': butWidth + 'px',
        'height': butHeight + 'px',
        'line-height': butHeight + 'px'
    })
    $('#reset').css({
        'position': 'absolute',
        'left': rx + 'px',
        'top': ry + 'px',
        'width': rbutWidth + 'px',
        'height': rbutHeight + 'px',
        'line-height': rbutHeight + 'px'
    })
    let paramArray = [];
    //查询按钮事件
    $('#query').unbind().bind('click', function () {
        let flag = true; //参数值全部设置标识
        normalUploadIdArray = [];
        uploadIdArray = [];
        //解决多选下拉树和多选下拉框没有隐藏的问题
        $('.layui-form').trigger('click');

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
                if (k != 'select') { //文本输入框
                    paramArray.push(k);
                    paramStr = paramStr + k + '=' + encodeURIComponent(v) + ";";
                }
                if(requireArray[k] != undefined){
                    if(v == ''){
                        flag = false;
                    }
                }
            })

            //下拉单选
            $.each(singleObj, function (k, v) {
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
                //encodeURIComponent
                paramArray.push(k);
                paramStr = paramStr + k + '=' + encodeURIComponent(valStr) + ";";
                if(requireArray[k] != undefined){
                    if(valStr == ''){
                        flag = false;
                    }
                }
            })

            //下拉多选
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
                //encodeURIComponent
                paramArray.push(k);
                paramStr = paramStr + k + '=' + encodeURIComponent(valStr) + ";";
                if(requireArray[k] != undefined){
                    if(valStr == ''){
                        flag = false;
                    }
                }
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
                if(requireArray[k] != undefined){
                    if(valStr == ''){
                        flag = false;
                    }
                }
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
                if(requireArray[k] != undefined){
                    if(valStr == ''){
                        flag = false;
                    }
                }
            })

            $.each(levelsTreeObj, function (k, v) {
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
                if(requireArray[k] != undefined){
                    if(valStr == ''){
                        flag = false;
                    }
                }
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
        $.each(hiddenObj, function (k, v) {
            paramStr = paramStr + k + '=' + encodeURIComponent(v) + ';';
        })

        processDParam(paramStr);

        if(!flag){
            layer.msg('请先设置参数值');
            return false;
        }

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
            beforeSend: function () {
                $('#loadgif').show();
            },
            success: function (res) {
                $('#content').empty();

                if (res.type == 0) {
                    $('.x-canvas-container').css('top', $('#ef-grid-param').height());
                    $('.x-canvas-container').empty();
                    $('.x-canvas-container').append("<div style='color:red;font-size: 16px;'>" + res.errorInfo + "</div>");
                    $('#loadgif').hide();
                }


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

                    if (reportJson.AllowPluginFullScreen != undefined) {//模板属性，是否允许插件双击全屏
                        allowPluginFullScreen = reportJson.AllowPluginFullScreen;
                    }
                    if (reportJson.BKColorPluginFullScreen != undefined) {
                        bKColorPluginFullScreen = reportJson.BKColorPluginFullScreen;
                    }

                    //区域刷新
                    initRefresh(reportJson);

                    let showToolBar = reportJson.ShowToolBar;
                    let showParamToolBar = reportJson.ShowParamToolBar;
                    //不显示工具栏
                    if (!showToolBar) {
                        $('#tool').css('display', 'none');
                        $('#content').css('top', 0);
                    } else { //显示工具栏
                        if (isUploadCel) { //如果是填报模板
                            $('#tool').find('.normal').hide();
                            $('#tool').find('.submit').css('display', 'inline-flex');
                            $('#tool').show();
                            $('#content').css('top', '40px');
                        }
                    }

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
                        if (!showToolBar) {
                            //显示参数工具栏
                            if (showParamToolBar) {
                                $('#tool').css('display', 'none');
                                $('#content').css('top', $('#ef-normal-param').height() + 'px');
                            } else { //不显示参数工具栏
                                $('#tool').css('display', 'none');
                                $('#ef-normal-param').css('display', 'none');
                                $('#content').css('top', '0px');
                            }

                        } else { //显示工具栏
                            $('#tool').show();
                            if (showParamToolBar) { //显示参数工具栏
                                paramObj.css('top', $('#tool').height() + 'px');
                                $('#content').css('top', $('#ef-normal-param').height() + $('#tool').height() + parseInt(paramTop) + 'px');
                            } else { //不显示参数工具栏
                                paramObj.css('display', 'none');
                                $('#content').css('top', $('#tool').height());
                            }

                        }
                        //初始化SHEET页
                        initSheets(sheetInfos);
                        //初始化报表区域
                        if (!isForm) {
                            if (wcp == 0) { //初始化常规报表
                                initUploadInfo(reportJson);
                                initNormalReport('_tb_0', sheetInfos[0]);
                                setContentHeight();
                            } else { //初始化自适应报表
                                initWcpReport('_tb_0', sheetInfos[0]);
                                $(window).resize(function () {
                                    window.location.reload();
                                });
                            }
                        } else { //画布预览
                            if (wcp == 0) { //非自适应Form
                                initForm('_tb_0', sheetInfos[0]);
                            } else { //自适应Form
                                initWcpForm('_tb_0', sheetInfos[0]);
                                $(window).resize(function () {
                                    window.location.reload();
                                });
                            }
                        }
                    }
                    setContentHeight(reportJson.IsShowCenterReport);
                    $('#loadgif').hide();
                    bindRight();
                    executeFunction(reportJson.ModelJS);
                }
                //生成模板参数xml文件
                if (res.state == "success" && res.type == 1) {
                    //初始化模板参数
                    initParams(res.message);
                }

                //表格插件预览
                if (res.type == 3) {
                    document.oncontextmenu = function (ev) {
                        ev.preventDefault();
                    }
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
                                $('#ef-grid-param').hide();
                                $('.x-canvas-container').css('top', 0);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#ef-grid-param').show();
                                $('.x-canvas-container').css('top', $('#ef-grid-param').height());
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#ef-grid-param').height()
                                })
                            }
                        } else { //显示工具栏
                            $('#normal-buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('#ef-grid-param').hide();
                                $('.x-canvas-container').css('top', $('#normal-buttonDiv').height());
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#normal-buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#ef-grid-param').show();
                                $('#ef-grid-param').css('top', $('#normal-buttonDiv').height());
                                let paramHeight;
                                if ($('#ef-grid-param').height() == 0) {
                                    paramHeight = 0;
                                    $('#ef-grid-param').css('padding', 0);
                                } else {
                                    paramHeight = $('#ef-grid-param').height();
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
                                $('#ef-grid-param').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#ef-grid-param').show();
                                $('.x-canvas-container').css('top', $('#ef-grid-param').height() + paramTop);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#ef-grid-param').height() - paramTop
                                })
                            }
                        } else { //显示工具栏
                            $('#buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('.x-canvas-container').css('top', $('#buttonDiv').height());
                                $('#ef-grid-param').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#ef-grid-param').show();
                                let paramHeight;
                                if ($('#ef-grid-param').height() == 0) {
                                    paramHeight = 0;
                                    $('#ef-grid-param').css('padding', 0);
                                } else {
                                    paramHeight = parseInt($('#ef-grid-param').height()) + parseInt(paramTop);
                                }
                                $('.x-canvas-container').css('top', paramHeight + parseInt($('#buttonDiv').height()));
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: parseInt(($('body').height()) - paramHeight - parseInt($('#buttonDiv').height()))
                                })
                                $('#ef-grid-param').css('top', parseInt($('#buttonDiv').height()));
                            }
                        }
                    }
                    $('.x-canvas-container').show();
                    if (isCanvasLoaded == 0) {//canvas未绑定过
                        Design.init(base + "/wasm/WebDesigner_7.5");
                        bindEditInput();
                        isCanvasLoaded = 1;
                    } else {
                        DesignModule._setTabDisplay(false);
                        reportJson = JSON.parse(ParamOperator.decodeStrAndFree(DesignModule._uncompressStream(ParamOperator.encodeStr(JSON.stringify(reportJson)))));
                        let dataStr = ParamOperator.encodeStr(JSON.stringify(reportJson));
                        DesignModule._loadReportModelFromJsonStream(dataStr);
                        initRpt(reportJson);
                        $("#loadgif").hide();
                    }

                    $(window).resize(function () {
                        resizeCanvas();
                    });
                    executeFunction(reportJson.ModelJS);
                }

            },
            error: function () {

            }
        })
        paramArray = [];
        return false;
    });
    $('#reset').unbind().bind('click', function (){
        paramObj.empty();
        resetData(); //重置数据集合
        //重新刷新参数
        initNewParams(isShowParamToolBar , paramObj ,isSpreadRpt , originData , paramJson);
    });

    form.on('select()', function (data) {
        let name = $(data.elem).attr('name');
        let value = data.value;
        if (paramLDMap[name] != undefined) { //是联动参数
            linkageParam(data.elem, name, value);
        }
    });

    form.on('checkbox()', function (data) {
        let name = $(data.elem).attr('name');
        let value = data.elem.checked;
        if (paramLDMap[name] != undefined) { //是联动参数
            linkageParam(data.elem, name, value);
        }
    });

    //显示模板参数
    if (isShowParamToolBar == 1) {
        paramObj.show();
        paramObj.css('height', (parseInt(toolHeight) + parseInt(padding)) + 'px');
    }

    if (autoSearch == 1) {//自动查询
        $('#loadgif').show();
        $('#query').trigger('click');//触发查询按钮
        paramArray = [];
    } else { //没有自动查询，需要调整显示区域的top值
        if ($('#ef-grid-param').css('display') == 'none') { //普通预览
            if($('#tool').css('display') != 'none'){ //查询后点击重置按钮
                $('.content').css('top', (parseInt(toolHeight) + parseInt(padding) + parseInt($('#tool').height())));
            }else{
                $('.content').css('top', (parseInt(toolHeight) + parseInt(padding)));
            }

        } else { //表格插件预览
            if($('#normal-buttonDiv').css('display') != 'none'){
                $('.x-canvas-container').css('top', (parseInt(toolHeight) + parseInt(padding) + parseInt($('#normal-buttonDiv').height())));
            }else{
                $('.x-canvas-container').css('top', (parseInt(toolHeight) + parseInt(padding)));
            }
        }
        $('#loadgif').hide();
    }
}

function resetData(){
    selectHeightMap = {};
    singleParamMap = {}; //单选下拉
    singleObj = {};
    multiParamMap = {}; //多选下拉控件ID和数据键值对
    multiObj = {};
    ymdMap = {}; //年月日控件map
    timeMap = {};//time控件Map
    ymMap = {};//年月控件Map
    paramStr = '';
    paramTypeMap = {}; //模板参数类型map
    singleTreeMap = {}; //单选下拉树控件ID和数据键值对
    singleTreeObj = {}; //单选下拉树控件ID和对象
    multiTreeMap = {}; //多选下拉树控件ID和数据键值对
    multiTreeObj = {}; //多选下拉树控件ID和对象
    levelsTreeMap = {}; //无限极下拉树
    levelsTreeObj = {};
    checkBoxObj = []; //复选框控件集合,用来解决checkbox未选中时提交无参数值问题
    hiddenObj = {};
    paramMap = {}; // 全局变量用来保存当前模板预览时的实时参数
    influenceMap = {}; //联动参数Map
    dataIndex = 0;
    dpv = {}; //参数默认值
    dpt = {}; //参数类型
    paramLDMap = {}; //参数联动
    dateRef = {};
    requireArray = {};
}




