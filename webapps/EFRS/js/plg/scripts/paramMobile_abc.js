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

function creatList_onepicker(obj, list){
    obj.forEach(function(item, index, arr){
      var temp = new Object();
      temp.text = item.name;
      temp.val = item.val;
      temp.value = index;
      list.push(temp);
    })
}

function creatList_mypicker(obj, list){
    obj.forEach(function(item, index, arr){
      var temp = new Object();
      temp.text = item.name;
      temp.value = index;
      list.push(temp);
    })
  }


//初始化参数工具栏（huangkun,改造成h5页面可以使用的）
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

    let paramsHtmlStr = "";

    let showColumnAry = []; // 用于设置显示列的控件数组

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
                // <div>
                //     <span>开始日期</span>
                //     <span>
                //         <input class="myinput" type="text" id="add_time" name="add_time" placeholder="请选择日期" />
                //     </span>
                //     <div style="clear:both;"></div>
                // </div>

                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input class='myinput' type='text' id='"+paramName+"' name='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";

                $(".ztmc").append(str);

                // paramObj.append(str);

            } else if (paramType == 2) {
                // 单选下拉（对应单选picker）
                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input type='hidden' name='"+paramName+"' />";
                str+="<input class='myinput' type='text' id='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";

                $(".ztmc").append(str);
                // paramObj.append(str);


                let nameEl_onepicker = document.getElementById(paramName);
                let title_onepicker = "请选择" + labelName;
                let array_onepicker = [
                    { name: "AAA", val: "", type: 0 }
                ];

                array_onepicker = [];
                let data = $(this).find("NodeData");//下拉框数据
                // 需要明确在什么情况下 有这个  空选项  huangkun 2023-01-30  ???
                // array_onepicker.push({name: '--无--', val: '', type: 0});

                $.each(data, function () { //遍历生成option
                    let value = $(this).find("ActualFieldData").text(); //值
                    let text = $(this).find("ShowFieldData").text(); //文本

                    let obj = {name: text, val: value, type: 0};
                    array_onepicker.push(obj);
                });


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
                    $("input[name='"+paramName+"']").val(val);
                });

                picker_onepicker.on('picker.change', function (index, selectedIndex) {
                    if (index === 0){
                      firstChange();
                    }
                    function firstChange() {
                      checked_onepicker[0] = selectedIndex;
                    }
                });

                picker_onepicker.on('picker.valuechange', function (selectedVal, selectedIndex) {
                    console.log(selectedVal);
                    console.log(selectedIndex);
                });

                nameEl_onepicker.addEventListener('click', function () {
                    picker_onepicker.show();
                });

            } else if (paramType == 3) {
                // 多选下拉框，对应 多选checkbox选项框
                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input type='hidden' name='"+paramName+"' />";
                str+="<input class='myinput' type='text' id='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";
                // paramsHtmlStr += str;
                $(".ztmc").append(str);

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
                                value: value,
                                selected: false
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
                            value: value,
                            selected: false
                        }
                        dataArray.push(dataObj);
                    });
                }

                let clsStr = ""; // paramName
                 
                clsStr += '<div id="div_'+paramName+'" class="div_cls">';
                clsStr += '<div class="div_search">';
                clsStr += '<div class="searchDiv" style="text-align:left;">';
                clsStr += '<input class="clsBtn" type="button" name="btn_cancel" value="取消" />';
                clsStr += '</div>';
                clsStr += '<div class="searchDiv">';
                clsStr += '<input class="clsBtn" style="color:#007bff;" type="button" name="btn_search" value="查询" />';
                clsStr += '</div>';
                clsStr += '<div style="clear: both;"></div>';
                clsStr += '</div>';
                clsStr += '<div class="div_cls_checkbox">';
                

                // 接下来是复选框列表
                // clsStr += '';

                for (let i=0; i < dataArray.length; i++) {
                    let itemObj = dataArray[i];
                    if (itemObj.selected === true) {
                        clsStr += '<div class="div_cls_ele">';
                        clsStr += '<input type="checkbox" name="'+itemObj.name+'" checked="true" value="'+itemObj.value+'"><span>'+itemObj.name+'</span>';
                        clsStr += '</div>';
                    } else {
                        clsStr += '<div class="div_cls_ele">';
                        clsStr += '<input type="checkbox" name="'+itemObj.name+'" value="'+itemObj.value+'"><span>'+itemObj.name+'</span>';
                        clsStr += '</div>';
                    }
                }

                
                clsStr += '</div>';
                clsStr += '</div>';

                $("body").append(clsStr);

                $("#"+paramName).click(function(){
                    $("#div_"+paramName+"").show();
                });

                $("#div_"+paramName+" input[name='btn_cancel']").click(function(){
                    // 点击了取消
                    $("#div_"+paramName+"").hide();
                });


                $("#div_"+paramName+" input[name='btn_search']").click(function(){
                    // 点击了 查询
                    let strval = "";
                    $("#div_"+paramName+" input:checkbox").each(function(idx, item){
                        // console.log($(this));
                        // console.log($(this).attr('checked'));
                        if ($(this).attr('checked')) {
                            console.log("idx--->", idx);
                            console.log("item-->", item);
                            console.log("val--->", $(this).val());
                            strval += $(this).val()+",";
                        }

                        // 这里还要对这些元素进行操作.....此处先省略...........huangkun
        
                        $("#div_"+paramName+"").hide();
                    });
                    $("#"+paramName).val(strval.length>0 ? strval.substring(0, strval.length-1): "");
                });

                // <div class="div_cls">
                //     <div class="div_search">
                //         <div class="searchDiv" style="text-align:left;">
                //             <input class="clsBtn" type="button" name="btn_cancel" value="取消" />
                //         </div>
                //         <div class="searchDiv">
                //             <input class="clsBtn" style="color:#007bff;" type="button" name="btn_search" value="查询" />
                //         </div>
                //         <div style="clear: both;"></div>
                //     </div>
                //     <div class="div_cls_checkbox">
                //         <div class="div_cls_ele">
                //             <input type="checkbox" name="chkbox_val" value="1"><span>足球</span>
                //         </div>
                //     </div>
                // </div>

            } else if(paramType == 4) {
                //单选下拉树(对应picker,二列或者三列)

                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input type='hidden' name='"+paramName+"' />";
                str+="<input class='myinput' type='text' id='"+paramName+"' placeholder='请选择' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";
                // paramsHtmlStr += str;
                $(".ztmc").append(str);

                // 这里支持2列的

                // 做一个2级联动的选择的页面
                let nameEl_mypicker = document.getElementById(paramName);
                let title_mypicker = labelName;
                let array_mypicker = [
                    {name:"AAA",sub:[{name:"AAA-1"},{name:"AAA-2"},{name:"AAA-3"}],type:0},
                    {name:"BBB",sub:[{name:"BBB-1"},{name:"BBB-2"},{name:"BBB-3"}],type:0},
                    {name:"CCC",sub:[{name:"CCC-1"},{name:"CCC-2"},{name:"CCC-3"}],type:0}
                ];

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
                            sub: children,
                            parent: "",
                            value: $(this).find("ActualFieldData:eq(0)").text(),
                            name: $(this).find("ShowFieldData:eq(0)").text(),
                            selected: true
                        });
                    } else {
                        data.push({
                            sub: children,
                            parent: "",
                            value: $(this).find("ActualFieldData:eq(0)").text(),
                            name: $(this).find("ShowFieldData:eq(0)").text()
                        });
                    }

                });
                array_mypicker = data;

                let first_mypicker = []; /* 第一列元素 */
                let second_mypicker = []; /* 第二列元素 */
                let selectedIndex_mypicker = [0, 0]; /* 默认选中的 元素 */

                let checked_mypicker = [0, 0]; /* 已选选项 */

                creatList_mypicker(array_mypicker, first_mypicker);

                if (array_mypicker[selectedIndex_mypicker[0]].hasOwnProperty('sub')) {
                    creatList_mypicker(array_mypicker[selectedIndex_mypicker[0]].sub, second_mypicker);
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
                    $("input[name='"+paramName+"']").val(val);

                });


                picker_mypicker.on('picker.change', function (index, selectedIndex) {
                    if (index === 0){
                      firstChange();
                    } else if (index === 1) {
                      secondChange();
                    }
                  
                    function firstChange() {
                      second_mypicker = [];
                      checked_mypicker[0] = selectedIndex;
                      var firstAry = array_mypicker[selectedIndex];
                      if (firstAry.hasOwnProperty('sub')) {
                        creatList_mypicker(firstAry.sub, second_mypicker);
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
                    console.log(selectedVal);
                    console.log(selectedIndex);
                });
                  
                nameEl_mypicker.addEventListener('click', function () {
                    picker_mypicker.show();
                });


            } else if (paramType == 5) {
                // 多选下拉树，（对应：多选树tabpicker）

                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input type='hidden' name='"+paramName+"' />";
                str+="<input class='myinput' type='text' id='"+paramName+"' placeholder='请选择' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";
                // paramsHtmlStr += str; 
                $(".ztmc").append(str);

                let data = [];
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


                let tabAry = [
                    {name: "北京市",children: [{name: "朝阳区"}, {name: "东城区"}, {name: "西城区"}, {name: "崇文区"}, {name: "宣武区"}]},
                    {name: "湖北省",children: [{name: "武汉市"}, {name: "黄石市"}, {name: "黄冈市"}, {name: "武穴市"}, {name: "鄂州市"},
                    {name: "咸宁市"}, {name: "仙桃市"}, {name: "潜江市"}, {name: "荆州市"}, {name: "宜昌市"}, {name: "恩施市"}, {name: "神龙架"}, 
                    {name: "荆门市"}, {name: "孝感市"}, {name: "随州市"}, {name: "襄阳市"}, {name: "十堰市"}]}
                ];

                tabAry = data;

                let tabpickerHtml = "";
                tabpickerHtml += '<div id="div_'+paramName+'" class="tabpicker">';
                tabpickerHtml += '<div class="header">';
                tabpickerHtml += '<div class="one">取消</div>';
                tabpickerHtml += '<div class="two">'+labelName+'</div>';
                tabpickerHtml += '<div class="three">确定</div>';
                tabpickerHtml += '<div style="clear:both;"></div>';
                tabpickerHtml += '</div>';
                tabpickerHtml += '';
                tabpickerHtml += '<div style="height: 10px;"></div>';
                tabpickerHtml += '<div class="content">';
                tabpickerHtml += '<div class="left">';

                // 加入循环（左侧tab标题页）
                for (let i=0;i<tabAry.length;i++) {
                    tabpickerHtml += '<div class="tabEle" data="'+(i+1)+'">';
                    tabpickerHtml += ''+tabAry[i].name;
                    tabpickerHtml += '</div>';
                }

                tabpickerHtml += '</div>';
                tabpickerHtml += '';



                tabpickerHtml += '<div class="right">';
                // 加入循环（右侧内容页）
                for (let i=0;i<tabAry.length;i++) {
                    tabpickerHtml += '<div class="bodyEle" data="'+(i+1)+'">';
                    for(let j=0; j < tabAry[i].children.length;j++) {
                        tabpickerHtml += '<div class="bodyEleContent">';
                        tabpickerHtml += '<input type="checkbox" name="chk_'+paramName+'" value="'+tabAry[i].children[j].value+'" /><span style="margin-left: 10px;">'+tabAry[i].children[j].name+'</span>';
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

                $("#"+paramName).click(function(){
                    $(".tabEle").removeClass("tabSelect");
                    $(".bodyEle").removeClass("bodySelect");
                    $(".tabEle:eq(0)").addClass("tabSelect");
                    $(".bodyEle:eq(0)").addClass("bodySelect");
        
                    $("input:checkbox[name='chk_"+paramName+"']").each(function(idx, item){
                        // 所有元素默认为不选中状态
                        $(this).attr('checked', false);
                    });
        
                    $("#bgDiv").show();
                    $("#div_"+paramName).show();
                });
                
                $("#div_"+paramName+" .header .one").click(function(){
                    // 点击了取消
                    $("#bgDiv").hide();
                    $(".tabpicker").hide();
                });

                $("#div_"+paramName+" .header .three").click(function(){
                    let strVal = "";
                    $("input:checkbox[name='chk_"+paramName+"']").each(function(idx, item){
                        if ($(this).attr('checked')) {
                            // console.log("idx--->", idx);
                            // console.log("item-->", item);
                            console.log("val--->", $(this).val());
                            strVal+=$(this).val() + ",";
                        }
                    });
        
                    $("#"+paramName).val(strVal.substring(0, strVal.length-1));
                    $("input[name='"+paramName+"']").val(strVal.substring(0, strVal.length-1));
                    $("#bgDiv").hide();
                    $(".tabpicker").hide();
                });


                $("#div_"+paramName+" .content .left .tabEle").click(function(){
                    $(".tabEle").each(function(idx, item){
                        $(this).removeClass("tabSelect");
                    });
                    $(this).addClass("tabSelect");
        
                    let d = $(this).attr("data");
                    // console.log("d--->", d);
        
        
                    $(".bodyEle").removeClass("bodySelect");
                    $(".bodyEle").each(function(idx, item){
                        let body_data = $(this).attr("data");
                        if (d === body_data) {
                            $(this).addClass("bodySelect");
                        }
                    });
        
        
                });



            }else if(paramType == 6) {
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

                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input class='myinput' type='text' id='"+paramName+"' name='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";

                $(".ztmc").append(str);


                let dVal = $("#"+paramName).val();
                if (dVal.trim() === "") {
                    new Jdate({
                        el:'#'+paramName,
                        format: formatval,
                        beginYear: 1980,
                        endYear: 2050
                    });
                } else {
                    new Jdate({
                        el:'#'+paramName,
                        format: formatval,
                        beginYear: 1980,
                        endYear: 2050,
                        value: dVal
                    });
                }

                


            } else if(paramType == 12) {
                // 日期时间 2010-02-03 11:30:30
                let format;
                let dateType = $(this).find("DateType").text(); //时间类型
                if (dateType == '0') { //yyyy-MM-dd
                    format = "YYYY-MM-DD HH:mm:ss";
                } else if (dateType == '1') {//yyyy/MM/dd
                    format = "YYYY/MM/DD HH:mm:ss";
                } else if (dateType == '2') {// yyyyMMdd
                    format = "YYYYMMDD HH:mm:ss";
                }

                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input class='myinput' type='text' id='"+paramName+"' name='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";

                $(".ztmc").append(str);

                let dVal = $("#"+paramName).val();
                if (dVal.trim() === "") {
                    new Jdate({
                        el:'#'+paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050
                    });
                } else {
                    new Jdate({
                        el:'#'+paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050,
                        value: dVal
                    });
                }

                

            }else if(paramType == 13) {
                // 日期 2010-02
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

                let str = "<div>";
                str+="<span>"+labelName+"</span>";
                str+="<span>";
                str+="<input class='myinput' type='text' id='"+paramName+"' name='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";
                str+="</span>";
                str+="<div style='clear:both;'></div>";
                str+="</div>";
                str+="<div style='height: 10px;'></div>";

                $(".ztmc").append(str);

                let dVal = $("#"+paramName).val();
                if (dVal.trim() === "") {
                    new Jdate({
                        el:'#'+paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050
                    });
                } else {
                    new Jdate({
                        el:'#'+paramName,
                        format: format,
                        beginYear: 1980,
                        endYear: 2050,
                        value: dVal
                    });
                }

                


            }else if (paramType == 7) {
                // 单选 复选框

                // let strtitle = "<div style='width:100%;text-align: center;height: 40px;line-height:40px; font-size: 18px; font-weight: 500;'>";
                // strtitle +="选择显示列";
                // strtitle += "</div>";
                // $(".ztmc").append(strtitle);
                let objEle = {
                    label: labelName,
                    name: paramName,
                    value: defaultValue
                };

                showColumnAry.push(objEle);

                // let str = "<div style='width:241px;margin:auto;'>";
                // str+="<span>"+labelName+"</span>";
                // str+="<span style='text-align: center; height: 22.5px;padding-top: 9.5px;'>";

                // if (defaultValue != '') {
                //     if (defaultValue == 'true') { // true
                //         str += '<input type="checkbox" name="' + paramName + '" checked>';
                //     } else {
                //         //false
                //         str += '<input type="checkbox" name="' + paramName + '" >';
                //     }
                // } else {
                //     str += '<input type="checkbox" name="' + paramName + '" >';
                // }

                // str+="</span>";
                // str+="<div style='clear:both;'></div>";
                // str+="</div>";
                // str+="<div style='height: 10px;'></div>";

                // $(".ztmc").append(str);



                


            }

        }
    });


    if (showColumnAry.length > 0) {

        let str = "<div>";
        str+="<span></span>";
        str+="<span>";

        // 筛选列 button 按钮
        str+='<input class="searchBtn" type="button" id="btn_showcolumn" value="筛选列查询" /> ';
        // str+="<input class='myinput' type='text' id='"+paramName+"' name='"+paramName+"' placeholder='请输入' autocomplete='off' value='"+defaultValue+"' />";
        
        str+="</span>";
        str+="<div style='clear:both;'></div>";
        str+="</div>";
        str+="<div style='height: 10px;'></div>";

        $(".ztmc").append(str);


        let clsStr = ""; // paramName
                 
        clsStr += '<div id="div_showcolumn" class="div_cls">';
        clsStr += '<div class="div_search">';
        clsStr += '<div class="searchDiv" style="text-align:left;">';
        clsStr += '<input class="clsBtn" type="button" name="btn_cancel" value="取消" />';
        clsStr += '</div>';
        clsStr += '<div class="searchDiv">';
        clsStr += '<input class="clsBtn" style="color:#007bff;" type="button" name="btn_search" value="查询" />';
        clsStr += '</div>';
        clsStr += '<div style="clear: both;"></div>';
        clsStr += '</div>';
        clsStr += '<div class="div_cls_checkbox">';
        

        // 接下来是复选框列表
        // clsStr += '';

        // let objEle = {
        //     label: labelName,
        //     name: paramName,
        //     value: defaultValue
        // };

        console.log("showColumnAry---->", showColumnAry);

        for (let i=0; i < showColumnAry.length; i++) {
            let itemObj = showColumnAry[i];
            if (itemObj.value === 'true') {
                clsStr += '<div class="div_cls_ele">';
                clsStr += '<input type="checkbox" name="'+itemObj.name+'" value="'+itemObj.label+'" checked="true"><span>'+itemObj.label+'</span>';
                clsStr += '</div>';
            } else {
                clsStr += '<div class="div_cls_ele">';
                clsStr += '<input type="checkbox" name="'+itemObj.name+'" value="'+itemObj.label+'"><span>'+itemObj.label+'</span>';
                clsStr += '</div>';
            }
        }

        
        clsStr += '</div>';
        clsStr += '</div>';

        $("body").append(clsStr);





        $("#btn_showcolumn").click(function(){
            $("#div_showcolumn").show();
        });



        $("#div_showcolumn input[name='btn_cancel']").click(function(){
            // 点击了取消
            $("#div_showcolumn").hide();
        });


        $("#div_showcolumn input[name='btn_search']").click(function(){
            // 点击了 查询
            let strval = "";
            $("#div_showcolumn input:checkbox").each(function(idx, item){
                // console.log($(this));
                // console.log($(this).attr('checked'));
                if ($(this).attr('checked')) {
                    console.log("idx--->", idx);
                    console.log("item-->", item);
                    console.log("val--->", $(this).val());
                    strval += $(this).val()+",";
                }

                // 这里还要对这些元素进行操作.....此处先省略...........huangkun

                $("#div_showcolumn").hide();
            });
            let clsVal = strval.length > 0 ? strval.substring(0, strval.length-1): "";
            console.log("当前选中的列值为：", clsVal);
            // $("#"+paramName).val(strval.length>0 ? strval.substring(0, strval.length-1): "");
        });


        ////////////////////////////////////////////////////


    }

    



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