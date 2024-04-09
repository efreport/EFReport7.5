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

function creatList_onepicker(obj, list) {
    obj.forEach(function (item, index, arr) {
        var temp = new Object();
        temp.text = item.name;
        temp.val = item.val;
        temp.value = index;
        list.push(temp);
    })
}

function creatList_mypicker(obj, list) {
    obj.forEach(function (item, index, arr) {
        var temp = new Object();
        temp.text = item.name;
        temp.val = item.value;
        temp.value = index;
        list.push(temp);
    })
}

function creatList(obj, list) {
    obj.forEach(function (item, index, arr) {
        var temp = new Object();
        temp.text = item.name;
        temp.val = item.value;
        temp.value = index;
        list.push(temp);
    })
}


//初始化参数工具栏（huangkun,改造成h5页面可以使用的）
function initParams(xml, isSpreadRpt , paramData) {
    let paramObj;
    let paramXml = JSON.parse(xml);
    if (isSpreadRpt) { //表格插件预览模板
        paramObj = $('#p_div_param1');
        paramObj.empty(); //清空参数工具栏
    } else {
        paramObj = $('#param');
        paramObj.empty(); //清空参数工具栏
    }
    let paramOption = paramXml['ParamOption']; //参数配置
    let paramDesc = []; //控件联动参数信息
    //let rowCount = paramXml.find("ParamCountByRow").text(); //每行数量
    let rowCount = paramOption['ParamCountByRow']
    let left = paramOption['LeftMargin'];
    ; //左边间隔
    paramLeft = left;
    let leftNum = parseInt(left);
    //let top = paramXml.find("TopMargin").text(); //上方间隔
    let top = paramOption['TopMargin'];
    paramTop = top;
    let topNum = parseInt(top);
    //let interval = paramXml.find("ParamInterval").text(); //参数间隔
    let interval = paramOption['ParamInterval'];
    //intervalP = interval;
    let row = parseInt(rowCount); //每行显示的参数个数
    //autoSearch = paramXml.find("SearchByDefaultParam").text(); //是否自动查询
    autoSearch = paramOption['SearchByDefaultParam'];
    //设置参数的左边边距和上方边距
    $('#param').css("padding-top", topNum + 'px');
    $('#param').css("padding-left", leftNum + 'px');

    let paramHtml = "";
    let formHtml = '<form class="layui-form" lay-filter="paramForm" action="">';
    paramHtml = paramHtml + formHtml;
    let paramIndex = 0; //统计显示的模板参数个数

    let paramsHtmlStr = "";

    let showColumnAry = []; // 用于设置显示列的控件数组

    let serarch_show_btn_strhtml = '<div style="display: none;"><input class="searchBtn" style="margin-left: 10px;" type="button" id="btn_setting_search" name="btn_setting_search" value="高级查询" /></div>';
    paramObj.append(serarch_show_btn_strhtml);


    $("#div_search_form").remove(); // 删除元素
    $("body").append("<div id='div_search_form' class='myDivSearchForm' style='padding-top: 20px; padding-bottom: 20px;' ><form id='paramForm' action=''></form></div>");


    $("#btn_setting_search").click(function () {
        $("#div_search_form").show();
        $("#bgDiv").show();
    });


    let reportParams = paramXml['ReportParam'];

    /*paramXml.find("ReportParam").each(function () {*/
    $.each(reportParams, function (i, e) {

        $("#div_to_search").show();

        let paramName = e["ParamName"]; //参数名称
        let paramType = e["ParamType"]; //参数类型
        //1字符串 2整型 3浮点 4日期时间 5布尔,,,,当2,3时，必须要输入数据
        let dataType = e["DataType"];
        let labelName = e["labelName"]; //参数标签
        let isAffectParams = e["IsAffectParams"]; //是否联动参数
        let paramWidth = e["Width"];
        let isShow = e["IsShow"]; //是否显示
        let defaultValue = e["DefaultValue"];

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
        // paramObj.show();


        if (paramWidth == 0) {
            hiddenObj[paramName] = defaultValue;
        } else {

            if (paramType == 1) { //文本编辑框

                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input class='myinput' type='text' id='" + paramName + "' name='" + paramName + "' placeholder='请输入' autocomplete='off' value='" + defaultValue + "' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";

                $("#paramForm").append(str);

            } else if (paramType == 2) {
                // 单选下拉（对应单选picker）
                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input type='hidden' name='" + paramName + "' value='" + defaultValue + "' />";
                str += "<input class='myinput' type='text' id='" + paramName + "' readonly='true' placeholder='请选择' autocomplete='off' value='" + defaultValue + "' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";
                $("#paramForm").append(str);
                let nameEl_onepicker = document.getElementById(paramName);

                let title_onepicker = "请选择" + labelName;
                let array_onepicker = [
                    {name: "AAA", val: "", type: 0}
                ];

                array_onepicker = [];
                let data = e["Node"];
                $.each(data, function (ii, ee) { //遍历生成option
                    let value = ee['ActualFieldData'];
                    let text = ee['ShowFieldData'];
                    let obj = {name: text, val: value, type: 0};
                    array_onepicker.push(obj);
                });

                for (let k = 0; k < array_onepicker.length; k++) {
                    let objItem = array_onepicker[k];
                    if (objItem.val === defaultValue) {
                        $("#" + paramName).val(objItem.name);
                    }
                }


                let first_onepicker = []; /* 第一列元素 */
                let selectedIndex_onepicker = [0]; /* 默认选中的 元素 */
                let checked_onepicker = [0]; /* 已选选项 */

                creatList_onepicker(array_onepicker, first_onepicker);

                let picker_onepicker = new Picker({
                    data: [first_onepicker],
                    selectedIndex: selectedIndex_onepicker,
                    title: title_onepicker
                });

                picker_onepicker.on('picker.select', function (selectedVal, selectedIndex) {
                    let text1 = first_onepicker[selectedIndex[0]].text;
                    let val = first_onepicker[selectedIndex[0]].val;
                    nameEl_onepicker.value = text1 === '--无--' ? '' : text1;
                    $("input[name='" + paramName + "']").val(val);
                });

                picker_onepicker.on('picker.change', function (index, selectedIndex) {
                    if (index === 0) {
                        firstChange();
                    }

                    function firstChange() {
                        checked_onepicker[0] = selectedIndex;
                    }
                });

                picker_onepicker.on('picker.valuechange', function (selectedVal, selectedIndex) {

                });

                nameEl_onepicker.addEventListener('click', function () {
                    picker_onepicker.show();
                });

            } else if (paramType == 3) {
                // 多选下拉框，对应 多选checkbox选项框
                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input type='hidden' name='" + paramName + "' value='" + defaultValue + "' />";
                str += "<input class='myinput' type='text' id='" + paramName + "' readonly='true' placeholder='请选择' autocomplete='off' value='" + defaultValue + "' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";
                $("#paramForm").append(str);

                let data = e["Node"];
                let dataArray = [];
                if (defaultValue != "") { //存在默认值
                    let defaultShowTextAry = [];
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
                            defaultShowTextAry.push(text);
                        } else {
                            let dataObj = {
                                name: text,
                                value: value,
                                selected: false
                            }
                            dataArray.push(dataObj);
                        }

                    });

                    $("#" + paramName).val(defaultShowTextAry.join(","));

                } else {
                    $.each(data, function (ii, ee) { //生成xmSelect渲染下拉多选所需的数据
                        let value = ee["ActualFieldData"]; //值
                        let text = ee["ShowFieldData"]; //文本
                        let dataObj = {
                            name: text,
                            value: value,
                            selected: false
                        }
                        dataArray.push(dataObj);
                    });
                }

                let clsStr = ""; // paramName

                clsStr += '<div id="div_' + paramName + '" class="div_cls">';
                clsStr += '<div class="div_search">';
                clsStr += '<div class="searchDiv" style="text-align:left;">';
                clsStr += '<input class="clsBtn" type="button" name="btn_cancel" value="取消" />';
                clsStr += '</div>';
                clsStr += '<div class="searchDiv">';
                clsStr += '<input class="clsBtn" style="color:#007bff;" type="button" name="btn_search" value="确定" />';
                clsStr += '</div>';
                clsStr += '<div style="clear: both;"></div>';
                clsStr += '</div>';
                clsStr += '<div class="div_cls_checkbox">';


                for (let i = 0; i < dataArray.length; i++) {
                    let itemObj = dataArray[i];
                    if (itemObj.selected === true) {
                        clsStr += '<div class="div_cls_ele">';
                        clsStr += '<input type="checkbox" name="' + itemObj.name + '" checked="true" value="' + itemObj.value + '"><span>' + itemObj.name + '</span>';
                        clsStr += '</div>';
                    } else {
                        clsStr += '<div class="div_cls_ele">';
                        clsStr += '<input type="checkbox" name="' + itemObj.name + '" value="' + itemObj.value + '"><span>' + itemObj.name + '</span>';
                        clsStr += '</div>';
                    }
                }


                clsStr += '</div>';
                clsStr += '</div>';

                $("body").append(clsStr);

                $("#" + paramName).click(function () {
                    $("#div_" + paramName + "").show();
                });

                $("#div_" + paramName + " input[name='btn_cancel']").click(function () {
                    // 点击了取消
                    $("#div_" + paramName + "").hide();
                });


                $("#div_" + paramName + " input[name='btn_search']").click(function () {
                    // 点击了 查询（确定按钮）
                    let strval = "";
                    let strnames = "";
                    $("#div_" + paramName + " .div_cls_checkbox .div_cls_ele input:checkbox").each(function (idx, item) {
                        if ($(this).attr('checked') || item.checked === true) {
                            strval += $(this).val() + ",";
                            strnames += item.name + ",";
                        }
                        $("#div_" + paramName + "").hide();
                    });
                    $("#" + paramName).val(strnames.length > 0 ? strnames.substring(0, strnames.length - 1) : "");
                    $("input[name='" + paramName + "']").val(strval.length > 0 ? strval.substring(0, strval.length - 1) : "");
                });
            } else if (paramType == 4) {
                //单选下拉树(对应picker,二列或者三列)
                let data = paramData[paramName];
                let levelVal = 1; //树的层级
                $.each(data, function(i,e){
                    if(e.children != undefined){
                        levelVal = 2;
                        $.each(e.children , function(ii,ee){
                            if(ee.children != undefined){
                                levelVal = 3;
                            }
                        })
                    }
                })

                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input type='hidden' name='" + paramName + "' value='" + defaultValue + "' />";
                str += "<input class='myinput' type='text' id='" + paramName + "' readonly='true' placeholder='请选择' autocomplete='off' value='" + defaultValue + "' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";
                $("#paramForm").append(str);

                if (levelVal === 2) {

                    for (let k = 0; k < data.length; k++) {
                        for (let kj = 0; kj < data[k].children.length; kj++) {
                            if (data[k].children[kj].value === defaultValue) {
                                let _strval = data[k].name + " " + data[k].children[kj].name;
                                $("#" + paramName).val(_strval);
                            }
                        }
                    }

                    // 这里支持2列的
                    let nameEl_mypicker = document.getElementById(paramName);
                    let title_mypicker = labelName;
                    let array_mypicker;

                    array_mypicker = data;

                    let first_mypicker = []; /* 第一列元素 */
                    let second_mypicker = []; /* 第二列元素 */
                    let selectedIndex_mypicker = [0, 0]; /* 默认选中的 元素 */

                    let checked_mypicker = [0, 0]; /* 已选选项 */

                    creatList_mypicker(array_mypicker, first_mypicker);

                    if (array_mypicker[selectedIndex_mypicker[0]].hasOwnProperty('children')) {
                        creatList_mypicker(array_mypicker[selectedIndex_mypicker[0]].children, second_mypicker);
                    } else {
                        second_mypicker = [{text: '', value: 0}];
                    }


                    let picker_mypicker = new Picker({
                        data: [first_mypicker, second_mypicker],
                        selectedIndex: selectedIndex_mypicker,
                        title: title_mypicker
                    });

                    picker_mypicker.on('picker.select', function (selectedVal, selectedIndex) {
                        let text1 = first_mypicker[selectedIndex[0]].text;
                        let text2 = second_mypicker[selectedIndex[1]].text;
                        nameEl_mypicker.value = text1 + ' ' + text2;

                        let val = second_mypicker[selectedIndex[1]].val;
                        $("input[name='" + paramName + "']").val(val);

                    });

                    picker_mypicker.on('picker.change', function (index, selectedIndex) {
                        if (index === 0) {
                            firstChange();
                        } else if (index === 1) {
                            secondChange();
                        }

                        function firstChange() {
                            second_mypicker = [];
                            checked_mypicker[0] = selectedIndex;
                            var firstAry = array_mypicker[selectedIndex];
                            if (firstAry.hasOwnProperty('children')) {
                                creatList_mypicker(firstAry.children, second_mypicker);
                                // var secondCity = array_mypicker[selectedIndex].sub[0]

                            } else {
                                second_mypicker = [{text: '', value: 0}];
                                checked_mypicker[1] = 0;
                            }

                            picker_mypicker.refillColumn(1, second_mypicker);
                            picker_mypicker.scrollColumn(1, 0)
                        }

                        function secondChange() {
                            checked_mypicker[1] = selectedIndex;
                            //   var first_index = checked_mypicker[0];
                        }

                    });

                    picker_mypicker.on('picker.valuechange', function (selectedVal, selectedIndex) {

                    });

                    nameEl_mypicker.addEventListener('click', function () {
                        picker_mypicker.show();
                    });


                    // 上面是： 二列代码
                } else if (levelVal === 3) {
                    // 这里支持三级数据

                    for (let k = 0; k < data.length; k++) {
                        for (let kj = 0; kj < data[k].children.length; kj++) {

                            for (let kjk = 0; kjk < data[k].children[kj].children.length; kjk++) {
                                if (data[k].children[kj].children[kjk].value === defaultValue) {
                                    let _strval = data[k].name + " " + data[k].children[kj].name + " " + data[k].children[kj].children[kjk].name;
                                    $("#" + paramName).val(_strval);
                                }
                            }

                        }
                    }


                    let nameEl = document.getElementById(paramName);
                    let title_mypicker = labelName;

                    let array_mypicker = [];
                    array_mypicker = data;


                    let first = []; /* 一级 */
                    let second = []; /* 二级 */
                    let third = []; /* 三级 */

                    let selectedIndex = [0, 0, 0]; /* 默认选中的 三级信息 */
                    let checked = [0, 0, 0]; /* 已选选项 */


                    creatList(array_mypicker, first);

                    if (array_mypicker[selectedIndex[0]].hasOwnProperty('children')) {
                        creatList(array_mypicker[selectedIndex[0]].children, second);
                    } else {
                        second = [{text: '', value: 0}];
                    }

                    if (array_mypicker[selectedIndex[0]].children[selectedIndex[1]].hasOwnProperty('children')) {
                        creatList(array_mypicker[selectedIndex[0]].children[selectedIndex[1]].children, third);
                    } else {
                        third = [{text: '', value: 0}];
                    }

                    // $("input[name='"+paramName+"']").val(third[0].value); // 默认取第三列数据的第一个数据作为初始值

                    let picker = new Picker({
                        data: [first, second, third],
                        selectedIndex: selectedIndex,
                        title: title_mypicker
                    });

                    picker.on('picker.select', function (selectedVal, selectedIndex) {
                        let text1 = first[selectedIndex[0]].text;
                        let text2 = second[selectedIndex[1]].text;
                        let text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';
                        nameEl.value = text1 + ' ' + text2 + ' ' + text3;

                        let val = third[selectedIndex[2]].val;
                        $("input[name='" + paramName + "']").val(val);
                    });

                    picker.on('picker.change', function (index, selectedIndex) {
                        if (index === 0) {
                            firstChange();
                        } else if (index === 1) {
                            secondChange();
                        }

                        function firstChange() {
                            second = [];
                            third = [];
                            checked[0] = selectedIndex;
                            let firstCity = array_mypicker[selectedIndex];
                            if (firstCity.hasOwnProperty('children')) {
                                creatList(firstCity.children, second);

                                var secondCity = array_mypicker[selectedIndex].children[0]
                                if (secondCity.hasOwnProperty('children')) {
                                    creatList(secondCity.children, third);
                                } else {
                                    third = [{text: '', value: 0}];
                                    checked[2] = 0;
                                }
                            } else {
                                second = [{text: '', value: 0}];
                                third = [{text: '', value: 0}];
                                checked[1] = 0;
                                checked[2] = 0;
                            }

                            picker.refillColumn(1, second);
                            picker.refillColumn(2, third);
                            picker.scrollColumn(1, 0);
                            picker.scrollColumn(2, 0);
                        }

                        function secondChange() {
                            third = [];
                            checked[1] = selectedIndex;
                            let first_index = checked[0];
                            if (array_mypicker[first_index].children[selectedIndex].hasOwnProperty('children')) {
                                let secondCity = array_mypicker[first_index].children[selectedIndex];
                                creatList(secondCity.children, third);
                                picker.refillColumn(2, third);
                                picker.scrollColumn(2, 0)
                            } else {
                                third = [{text: '', value: 0}];
                                checked[2] = 0;
                                picker.refillColumn(2, third);
                                picker.scrollColumn(2, 0)
                            }
                        }

                    });


                    picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
                    });

                    nameEl.addEventListener('click', function () {
                        picker.show();
                    });

                }

            } else if (paramType == 5) {
                let treeData = paramData[paramName];
                // 多选下拉树，（对应：多选树tabpicker）
                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input type='hidden' name='" + paramName + "' value='" + defaultValue + "' />";
                str += "<input class='myinput' type='text' id='" + paramName + "' readonly='true' placeholder='请选择' autocomplete='off' value='" + defaultValue + "' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";

                $("#paramForm").append(str);

                let default_show_val_ary = []; // 显示的默认值
                let defaultArr = defaultValue.split(',');
                $.each(defaultArr , function(i,e){
                    default_show_val_ary.push(e);
                })
                let levelVal = 1; //树的层级
                $.each(treeData, function(i,e){
                    if(e.children != undefined){
                        levelVal = 2;
                        $.each(e.children , function(ii,ee){
                            if(ee.children != undefined){
                                levelVal = 3;
                            }
                        })
                    }
                })

                $("#" + paramName).val(default_show_val_ary.join(","));

                let tabAry;

                tabAry = treeData;

                if (levelVal === 2) { //两层树形结构
                    let tabpickerHtml = "";
                    tabpickerHtml += '<div id="div_' + paramName + '" class="tabpicker">';
                    tabpickerHtml += '<div class="header">';
                    tabpickerHtml += '<div class="one">取消</div>';
                    tabpickerHtml += '<div class="two">' + labelName + '</div>';
                    tabpickerHtml += '<div class="three">确定</div>';
                    tabpickerHtml += '<div style="clear:both;"></div>';
                    tabpickerHtml += '</div>';
                    tabpickerHtml += '';
                    tabpickerHtml += '<div style="height: 10px;"></div>';
                    tabpickerHtml += '<div class="content" style="top: 0px;">';
                    tabpickerHtml += '<div class="left">';

                    // 加入循环（左侧tab标题页）
                    for (let i = 0; i < tabAry.length; i++) {
                        tabpickerHtml += '<div class="tabEle" data="' + (i + 1) + '">';
                        tabpickerHtml += '' + tabAry[i].name;
                        tabpickerHtml += '</div>';
                    }

                    tabpickerHtml += '</div>';
                    tabpickerHtml += '';

                    tabpickerHtml += '<div class="right">';
                    // 加入循环（右侧内容页）
                    for (let i = 0; i < tabAry.length; i++) {
                        tabpickerHtml += '<div class="bodyEle" data="' + (i + 1) + '">';
                        for (let j = 0; j < tabAry[i].children.length; j++) {
                            tabpickerHtml += '<div class="bodyEleContent">';
                            tabpickerHtml += '<input type="checkbox" name="chk_' + paramName + '" data-name="' + tabAry[i].children[j].name + '" value="' + tabAry[i].children[j].value + '" /><span style="margin-left: 10px;">' + tabAry[i].children[j].name + '</span>';
                            tabpickerHtml += '</div>';
                        }
                        tabpickerHtml += '</div>';
                    }
                    tabpickerHtml += '</div>';

                    tabpickerHtml += '<div style="clear: both;"></div>';
                    tabpickerHtml += '</div>';

                    tabpickerHtml += '</div>';

                    $("body").append(tabpickerHtml);

                    // tabpickerHtml += '';

                    $("#paramForm #" + paramName).click(function () {
                        $("#div_" + paramName + " .tabEle").removeClass("tabSelect");
                        $("#div_" + paramName + " .bodyEle").removeClass("bodySelect");
                        $("#div_" + paramName + " .tabEle:eq(0)").addClass("tabSelect");
                        $("#div_" + paramName + " .bodyEle:eq(0)").addClass("bodySelect");

                        $("input:checkbox[name='chk_" + paramName + "']").each(function (idx, item) {
                            // 所有元素默认为不选中状态
                            $(this).attr('checked', false);
                        });

                        $("#bgDiv").show();
                        $("#div_" + paramName).show();
                    });

                    $("#div_" + paramName + " .header .one").click(function () {
                        // 点击了取消
                        $("#bgDiv").hide();
                        $(".tabpicker").hide();
                    });

                    $("#div_" + paramName + " .header .three").click(function () {
                        let strVal = "";
                        let strNameVal = "";
                        $("input:checkbox[name='chk_" + paramName + "']").each(function (idx, item) {
                            if ($(this).attr('checked') || item.checked === true) {
                                strNameVal += $(this).attr("data-name") + ",";
                                strVal += $(this).val() + ",";
                            }
                        });

                        $("#" + paramName).val(strNameVal.substring(0, strNameVal.length - 1));
                        $("input[name='" + paramName + "']").val(strVal.substring(0, strVal.length - 1));
                        $("#bgDiv").hide();
                        $(".tabpicker").hide();
                    });


                    $("#div_" + paramName + " .content .left .tabEle").click(function () {
                        $(".tabEle").each(function (idx, item) {
                            $(this).removeClass("tabSelect");
                        });
                        $(this).addClass("tabSelect");

                        let d = $(this).attr("data");

                        $(".bodyEle").removeClass("bodySelect");
                        $(".bodyEle").each(function (idx, item) {
                            let body_data = $(this).attr("data");
                            if (d === body_data) {
                                $(this).addClass("bodySelect");
                            }
                        });

                    });

                } else if (levelVal === 3) { //三层树形结构

                    let tabpickerHtml = "";

                    tabpickerHtml += '<div id="div_' + paramName + '" class="tabpicker">';

                    tabpickerHtml += '<div class="header">';
                    tabpickerHtml += '<div class="one">取消</div>';
                    tabpickerHtml += '<div class="two">' + labelName + '</div>';
                    tabpickerHtml += '<div class="three">确定</div>';
                    tabpickerHtml += '<div style="clear:both;"></div>';
                    tabpickerHtml += '</div>';
                    tabpickerHtml += '<div style="height: 10px;"></div>';
                    tabpickerHtml += '<div class="content" style="top: 0px;">';
                    tabpickerHtml += '<div class="left">';

                    // left的循环
                    // 加入循环（左侧tab标题页）
                    for (let i = 0; i < tabAry.length; i++) {
                        tabpickerHtml += '<div class="tabEle" data="' + (i + 1) + '">';
                        tabpickerHtml += '' + tabAry[i].name;
                        tabpickerHtml += '</div>';
                    }
                    tabpickerHtml += '';

                    tabpickerHtml += '</div>';


                    tabpickerHtml += '<div class="right">';

                    // right 的循环

                    for (let i = 0; i < tabAry.length; i++) {
                        tabpickerHtml += '<div class="bodyEle" data="' + (i + 1) + '">';
                        tabpickerHtml += '<div class="bodyEleLeft">';
                        for (let j = 0; j < tabAry[i].children.length; j++) {
                            let dataStr = (i + 1) + "-" + (j + 1);
                            tabpickerHtml += '<div class="tabEle" data="' + dataStr + '">' + tabAry[i].children[j].name + '</div>';
                        }
                        tabpickerHtml += '</div>';

                        tabpickerHtml += '<div class="bodyEleRight">';
                        for (let j = 0; j < tabAry[i].children.length; j++) {
                            let dataStr = (i + 1) + "-" + (j + 1);
                            tabpickerHtml += '<div class="rightBodyEle" data="' + dataStr + '">';

                            for (let k = 0; k < tabAry[i].children[j].children.length; k++) {
                                tabpickerHtml += '<div class="bodyEleRightContent">';
                                tabpickerHtml += '<input type="checkbox" name="chk_' + paramName + '" data-name="' + tabAry[i].children[j].children[k].name + '" value="' + tabAry[i].children[j].children[k].value + '" /><span style="margin-left: 10px;">' + tabAry[i].children[j].children[k].name + '</span>';
                                tabpickerHtml += '</div>';
                            }

                            tabpickerHtml += '</div>';
                        }
                        tabpickerHtml += '</div>';
                        tabpickerHtml += '<div style="clear:both;"></div>';

                        tabpickerHtml += '</div>';
                    }

                    tabpickerHtml += '</div>';
                    tabpickerHtml += '<div style="clear: both;"></div>';
                    tabpickerHtml += '</div>';
                    tabpickerHtml += '</div>';
                    tabpickerHtml += '';

                    $("body").append(tabpickerHtml);

                    $("#" + paramName).click(function () {
                        $("#bgDiv").show();
                        $("#div_" + paramName).show();
                        //debugger;
                        $(".tabEle").removeClass("tabSelect");
                        //debugger;
                        $("#div_" + paramName + " > .bodyEle > .bodyEleLeft > .tabEle").hide();
                        $("#div_" + paramName + " > .bodyEle > .bodyEleLeft > .tabEle").removeClass("tabSelect");
                        //debugger;
                        $("#div_" + paramName + " > .content > .left > .tabEle:eq(0)").addClass("tabSelect"); // 选中第一列的第一行数据为默认选中项
                        //debugger;
                        $("#div_" + paramName + " > .content > .right > .bodyEle").hide();
                        $("#div_" + paramName + " > .content > .right > .bodyEle:eq(0)").show();
                        //debugger;
                        $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleLeft > .tabEle:eq(0)").show();
                        $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleLeft > .tabEle:eq(0)").addClass("tabSelect");
                        //debugger;
                        $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleRight > .rightBodyEle").hide();
                        $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleRight > .rightBodyEle:eq(0)").show();
                        //debugger;
                        $("input:checkbox[name='chk_" + paramName + "']").each(function (idx, item) {
                            // 所有元素默认为不选中状态
                            $(this).attr('checked', false);
                        });
                    });

                    $("#div_" + paramName + " .header .one").click(function () {
                        // 点击了取消
                        $("#bgDiv").hide();
                        $(".tabpicker").hide();
                    });

                    $("#div_" + paramName + " .header .three").click(function () {
                        let strVal = "";
                        let strNameVal = "";
                        $("input:checkbox[name='chk_" + paramName + "']").each(function (idx, item) {
                            if ($(this).attr('checked') || item.checked === true) {
                                strNameVal += $(this).attr("data-name") + ",";
                                strVal += $(this).val() + ",";
                            }
                        });


                        $("#" + paramName).val(strNameVal.substring(0, strNameVal.length - 1));
                        $("input[name='" + paramName + "']").val(strVal.substring(0, strVal.length - 1));
                        $("#bgDiv").hide();
                        $(".tabpicker").hide();
                    });


                    $("#div_" + paramName + " > .content > .left > .tabEle").click(function () {
                        $("#div_" + paramName + " > .content > .left > .tabEle").removeClass("tabSelect");
                        $(this).addClass("tabSelect");
                        let first_tab_data = $(this).attr("data");

                        // 隐藏所有的 二级  tab
                        $("#div_" + paramName + " > .content > .right > .bodyEle").hide();

                        $("#div_" + paramName + " > .content > .right > .bodyEle").each(function (idx, ele) {
                            let bodyEleData = $(this).attr("data");
                            if (first_tab_data === bodyEleData) {
                                $(this).show();

                                let second_tab_data = first_tab_data + "-1";

                                $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleLeft > .tabEle").removeClass("tabSelect");
                                $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleLeft > .tabEle").each(function (idxx, item) {
                                    let bodyEleData = $(this).attr("data");
                                    if (second_tab_data === bodyEleData) {
                                        // $(this).show();
                                        $(this).addClass("tabSelect");
                                    }
                                });

                                $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleRight > .rightBodyEle").hide();
                                $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleRight > .rightBodyEle").each(function (idxx, itm) {
                                    let bodyEleData = $(this).attr("data");
                                    if (second_tab_data === bodyEleData) {
                                        $(this).show();
                                    }
                                });

                            }
                        });

                    });


                    $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleLeft > .tabEle").click(function () {
                        $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleLeft > .tabEle").removeClass("tabSelect");
                        $(this).addClass("tabSelect");

                        let second_tab_data = $(this).attr("data");

                        $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleRight > .rightBodyEle").hide();
                        $("#div_" + paramName + " > .content > .right > .bodyEle > .bodyEleRight > .rightBodyEle").each(function (idx, itm) {
                            let bodyEleData = $(this).attr("data");
                            if (second_tab_data === bodyEleData) {
                                $(this).show();
                            }
                        });
                    });

                }

            } else if (paramType == 6) {
                // 日期
                let dateType = $(this).find("DateType").text(); //时间类型
                let formatval = "YYYY-MM-DD";
                if (dateType == '0') { //yyyy-MM-dd
                    formatval = "YYYY-MM-DD";
                } else if (dateType == '1') {//yyyy/MM/dd
                    formatval = "YYYY/MM/DD";
                } else if (dateType == '2') {// yyyyMMdd
                    formatval = "YYYYMMDD";
                }

                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input class='myinput' type='text' id='" + paramName + "' name='" + paramName + "' readonly='true' placeholder='请选择' autocomplete='off' value='" + defaultValue + "' />";
                // str+="<input class='myinput' type='text' id='"+paramName+"' name='"+paramName+"' placeholder='请输入' autocomplete='off' value='20220101' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";

                // $(".ztmc").append(str);

                // paramObj.append(str);

                $("#paramForm").append(str);

                let dVal = $("#" + paramName).val();
                if (dVal.trim() === "") {
                    new Jdate({
                        el: '#' + paramName,
                        format: formatval,
                        beginYear: 1980,
                        endYear: 2050,
                        init: function () {
                            $(".spancontent:eq(0)").focus();
                        }
                    });
                } else {
                    new Jdate({
                        el: '#' + paramName,
                        format: formatval,
                        beginYear: 1980,
                        endYear: 2050,
                        value: dVal,
                        init: function () {
                            $(".spancontent:eq(0)").focus();
                        }
                    });
                }

                if (dateType == '2') {
                    $("#" + paramName).bind("change", function () {
                    });
                }

            } else if (paramType == 12) {
                // 日期时间 2010-02-03 11:30:30
                let format;
                let dateType = $(this).find("DateType").text(); //时间类型
                if (dateType == '0') { //yyyy-MM-dd
                    format = "YYYY-MM-DD hh:mm:ss";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "YYYY/MM/DD hh:mm:ss";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "YYYYMMDD hh:mm:ss";
                }

                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input class='myinput' type='text' id='" + paramName + "' name='" + paramName + "' readonly='true' placeholder='请选择' autocomplete='off' value='" + defaultValue + "' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";
                $("#paramForm").append(str);

                let dVal = $("#" + paramName).val();
                if (dVal.trim() === "") {
                    new Jdate({
                        el: '#' + paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050,
                        init: function () {
                            $(".spancontent:eq(0)").focus();
                        }
                    });
                } else {
                    new Jdate({
                        el: '#' + paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050,
                        value: dVal,
                        init: function () {
                            $(".spancontent:eq(0)").focus();
                        }
                    });
                }


            } else if (paramType == 13) {
                // 日期 2010-02
                let format;
                let dateType = $(this).find("DateType").text(); //时间类型
                if (dateType == '0') { //yyyy-MM-dd
                    format = "YYYY-MM";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "YYYY/MM";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "YYYYMM";
                } else if (dateType == '3') {// yyyyMMdd
                    format = "YYYY";
                }

                let str = "<div class='div_search_item'>";
                str += "<span class='spanLabel'>" + (labelName !== "" ? labelName : "参数") + "</span>";
                str += "<span class='spancontent'>";
                str += "<input class='myinput' type='text' id='" + paramName + "' name='" + paramName + "' readonly='true' placeholder='请选择' autocomplete='off' value='" + defaultValue + "' />";
                str += "</span>";
                str += "<div style='clear:both;'></div>";
                str += "</div>";
                str += "<div style='height: 10px;'></div>";

                $("#paramForm").append(str);

                let dVal = $("#" + paramName).val();
                if (dVal.trim() === "") {
                    new Jdate({
                        el: '#' + paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050,
                        init: function () {
                            $(".spancontent:eq(0)").focus();
                        }
                    });
                } else {
                    new Jdate({
                        el: '#' + paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050,
                        value: dVal,
                        init: function () {
                            $(".spancontent:eq(0)").focus();
                        }
                    });
                }

            } else if (paramType == 7) {
                let objEle = {
                    label: labelName,
                    name: paramName,
                    value: defaultValue
                };
                showColumnAry.push(objEle);
            }

        }
    });


    if (showColumnAry.length > 0) {

        let str = "<div class='div_search_item'>";
        str += "<span class='spanLabel'>参数</span>";
        str += "<span class='spancontent'>";

        str += "<input type='hidden' id='hid_showcolumn' name='hid_showcolumn' value='' />";

        // 筛选列 button 按钮(复选参数) --<之前叫：筛选列查询>
        str += '<input class="searchBtn2" type="button" id="btn_showcolumn" value="复选参数" /> ';
        // str+="<input class='myinput' type='text' id='"+paramName+"' name='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";

        str += "</span>";
        str += "<div style='clear:both;'></div>";
        str += "</div>";
        str += "<div style='height: 10px;'></div>";

        // $(".ztmc").append(str);
        // paramObj.append(str);

        $("#paramForm").append(str);


        let clsStr = ""; // paramName

        clsStr += '<div id="div_showcolumn" class="div_cls">';
        clsStr += '<div class="div_search">';
        clsStr += '<div class="searchDiv" style="text-align:left;">';
        clsStr += '<input class="clsBtn" type="button" name="btn_cancel" value="关闭" />';
        clsStr += '</div>';
        clsStr += '<div class="searchDiv">';
        clsStr += '<input class="clsBtn" style="color:#007bff;" type="button" name="btn_search" value="确定" />';
        clsStr += '</div>';
        clsStr += '<div style="clear: both;"></div>';
        clsStr += '</div>';
        clsStr += '<div class="div_cls_checkbox">';

        for (let i = 0; i < showColumnAry.length; i++) {
            let itemObj = showColumnAry[i];
            if (itemObj.value === 'true') {
                clsStr += '<div class="div_cls_ele">';
                clsStr += '<input type="checkbox" name="' + itemObj.name + '" value="' + itemObj.label + '" checked="true"><span>' + itemObj.label + '</span>';
                clsStr += '</div>';
            } else {
                clsStr += '<div class="div_cls_ele">';
                clsStr += '<input type="checkbox" name="' + itemObj.name + '" value="' + itemObj.label + '"><span>' + itemObj.label + '</span>';
                clsStr += '</div>';
            }
        }

        clsStr += '</div>';
        clsStr += '</div>';

        $("body").append(clsStr);


        $("#div_showcolumn input:checkbox").change(function (event) {
            if ($(this)[0].checked === true) {
                $(this).attr("checked", "true");
            } else {
                $(this).removeAttr("checked");
            }
        });


        $("#btn_showcolumn").click(function () {
            $("#div_showcolumn").show();
        });

        $("#div_showcolumn input[name='btn_cancel']").click(function () {
            // 点击了取消
            $("#div_showcolumn").hide();
        });


        $("#div_showcolumn input[name='btn_search']").click(function () {
            // 点击了 查询(确定按钮)
            let strval = "";
            $("#div_showcolumn input:checkbox").each(function (idx, item) {
                if ($(this).attr('checked') || item.checked === true) {
                    strval += item.name + "=" + decodeURIComponent(true) + ";";
                } else {
                    strval += item.name + "=" + decodeURIComponent(true) + ";";
                }
                $("#div_showcolumn").hide();
            });
            $("#hid_showcolumn").val(strval);
        });
    }


    function getCheckboxParamStr() {
        let strval = "";
        $("#div_showcolumn input:checkbox").each(function (idx, item) {
            if ($(this).attr('checked') || item.checked === true) {
                strval += item.name + "=" + decodeURIComponent(true) + ";";
            } else {
                strval += item.name + "=" + decodeURIComponent(false) + ";";
            }
        });
        return strval;
    }


    let btnSearchHtml = "<div style='text-align:center;'>";
    btnSearchHtml += "<input class='searchBtn3' type='button' id='page_btn_search' value='查询' />"
    btnSearchHtml += "</div>";
    // paramObj.append(btnSearchHtml);

    $("#paramForm").append(btnSearchHtml);

    function initParamPage() {
        let formData = new FormData($("#paramForm")[0]);
        let formData2 = $("#paramForm").serialize();
        let formJson = $("#paramForm").serializeArray();

        let paramStr = "";

        for (let i = 0; i < formJson.length; i++) {
            let jObj = formJson[i];
            if (jObj.value !== null && jObj.value !== '') {
                if (jObj.name === 'hid_showcolumn') {
                    paramStr += jObj.value;
                } else {
                    paramStr += jObj.name + "=" + encodeURIComponent(jObj.value) + ";";
                }
            } else {

                if (jObj.name === 'hid_showcolumn') {
                } else {
                    paramStr += jObj.name + "=" + ";";
                }

            }
        }
        paramStr += getCheckboxParamStr();

        let temp_id = $("#page_temp_id").val();
        let token = $("#page_token").val();
        let base = $("#page_base").val();

        processDParam(paramStr);

        let url = base + "/report/query?isLoaded=1&templateId=" + temp_id + "&sheetName=&params=" + encodeURIComponent(paramStr) + "&token=" + token;

        $('#loadgif').show();
        $("#div_search_form").hide();

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
                            $('#content').css('top', $('#param').height() + $('#tool').height() + parseInt(paramTop) + 'px');
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
                            }
                        } else { //画布预览
                            if (wcp == 0) { //非自适应Form
                                initForm('_tb_0', sheetInfos[0]);
                            } else { //自适应Form
                                initWcpForm();
                            }
                        }
                    }
                    setContentHeight(reportJson.IsShowCenterReport);
                    $('#loadgif').hide();
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
                    // $("#submit").show();
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
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css('top', 0);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                $('.x-canvas-container').css('top', $('#p_div_param1').height());
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#p_div_param1').height()
                                })
                            }
                        } else { //显示工具栏
                            $('#normal-buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css('top', 0);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#normal-buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                $('#p_div_param1').css('top', $('#normal-buttonDiv').height());
                                let paramHeight;
                                if ($('#p_div_param1').height() == 0) {
                                    paramHeight = 0;
                                    $('#p_div_param1').css('padding', 0);
                                } else {
                                    paramHeight = $('#p_div_param1').height();
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
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                $('.x-canvas-container').css('top', $('#p_div_param1').height() + paramTop);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#p_div_param1').height() - paramTop
                                })
                            }
                        } else { //显示工具栏
                            $('#buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('.x-canvas-container').css('top', $('#buttonDiv').height());
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                let paramHeight;
                                if ($('#p_div_param1').height() == 0) {
                                    paramHeight = 0;
                                    $('#p_div_param1').css('padding', 0);
                                } else {
                                    paramHeight = $('#p_div_param1').height() + paramTop;
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
                        Design.init(base + "/wasm/WebDesigner_7.4");
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

                $('#loadgif').hide();

            },
            error: function () {

            }
        })
    }

    if (autoSearch === "1" || autoSearch === 1) {
        initParamPage();
    } else {
        $("#div_search_form").show();
        $("#bgDiv").show();
    }


    $("#page_btn_search").click(function () {
        curPageUploadIdAry.length = 0;
        let formData = new FormData($("#paramForm")[0]);
        let formData2 = $("#paramForm").serialize();
        let formJson = $("#paramForm").serializeArray();

        let paramStr = "";

        for (let i = 0; i < formJson.length; i++) {
            let jObj = formJson[i];
            if (jObj.value !== null && jObj.value !== '') {
                if (jObj.name === 'hid_showcolumn') {
                } else {
                    paramStr += jObj.name + "=" + encodeURIComponent(jObj.value) + ";";
                }
            } else {

                if (jObj.name === 'hid_showcolumn') {
                } else {
                    paramStr += jObj.name + "=" + ";";
                }

            }
        }

        paramStr += getCheckboxParamStr();


        //手机端点击查询按钮时，我们要将显示出来的参数信息（选择参数相关操作的信息）隐藏起来
        $("#float_card").attr("data-tar", "add");
        $("#cardImage").attr("src", "image/mobile/menu_addchar.png");
        $("#float_card_menu").hide();
        $(".pageCard").hide();
        $("#div_search_form").hide();
        $("#bgDiv").hide();
        $(".tabpicker").hide();
        $(".div_cls").hide();
        $(".jdate-container").hide();

        /////////////////////////////////////////////////////////////////////////////


        let temp_id = $("#page_temp_id").val();
        let token = $("#page_token").val();
        let base = $("#page_base").val();

        processDParam(paramStr);

        let url = base + "/report/query?isLoaded=1&templateId=" + temp_id + "&sheetName=&params=" + encodeURIComponent(paramStr) + "&token=" + token;

        $('#loadgif').show();
        $("#div_search_form").hide();
        $("#bgDiv").hide();

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
                            $('#content').css('top', $('#param').height() + $('#tool').height() + parseInt(paramTop) + 'px');
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
                                initForm('_tb_0', sheetInfos[0]);
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
                    // $("#submit").show();
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
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css('top', 0);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                $('.x-canvas-container').css('top', $('#p_div_param1').height());
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#p_div_param1').height()
                                })
                            }
                        } else { //显示工具栏
                            $('#normal-buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css('top', 0);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#normal-buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                $('#p_div_param1').css('top', $('#normal-buttonDiv').height());
                                let paramHeight;
                                if ($('#p_div_param1').height() == 0) {
                                    paramHeight = 0;
                                    $('#p_div_param1').css('padding', 0);
                                } else {
                                    paramHeight = $('#p_div_param1').height();
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
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                $('.x-canvas-container').css('top', $('#p_div_param1').height() + paramTop);
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#p_div_param1').height() - paramTop
                                })
                            }
                        } else { //显示工具栏
                            $('#buttonDiv').show();
                            if (!ShowParamToolBar) { //不显示参数工具栏
                                $('.x-canvas-container').css('top', $('#buttonDiv').height());
                                $('#p_div_param1').hide();
                                $('.x-canvas-container').css({
                                    width: $('body').width(),
                                    height: $('body').height() - $('#buttonDiv').height()
                                })
                            } else { // 显示参数工具栏
                                $('#p_div_param1').show();
                                let paramHeight;
                                if ($('#p_div_param1').height() == 0) {
                                    paramHeight = 0;
                                    $('#p_div_param1').css('padding', 0);
                                } else {
                                    paramHeight = $('#p_div_param1').height() + paramTop;
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
                        Design.init(base + "/wasm/WebDesigner_7.4");
                        $("#editInput").bind('keydown', keyDownF);
                        $("#loadgif").hide();
                        isCanvasLoaded = 1;
                    } else {
                        Module._setTabDisplay(false);
                        var dataStr = ParamOperator.encodeStr(JSON.stringify(reportJson));
                        Module._loadReportModelFromJsonStream(dataStr)

                        $("#loadgif").hide();
                    }
                }

                $('#loadgif').hide();

            },
            error: function () {

            }
        });


    });

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