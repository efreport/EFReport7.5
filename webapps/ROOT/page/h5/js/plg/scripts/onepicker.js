
// 做一个2级联动的选择的页面
var nameEl_onepicker = document.getElementById('onepicker');

var title_onepicker = "单列选择";
var array_onepicker = [
  {name:"AAA",type:0},
  {name:"BBB",type:0},
  {name:"CCC",type:0},
  {name:"DDD",type:0},
  {name:"EEE",type:0}
];

var first_onepicker = []; /* 第一列元素 */

var selectedIndex_onepicker = [0]; /* 默认选中的 元素 */

var checked_onepicker = [0]; /* 已选选项 */

function creatList_onepicker(obj, list){
  obj.forEach(function(item, index, arr){
    var temp = new Object();
    temp.text = item.name;
    temp.value = index;
    list.push(temp);
  })
}

creatList_onepicker(array_onepicker, first_onepicker);


var picker_onepicker = new Picker({
	data: [first_onepicker],
  selectedIndex: selectedIndex_onepicker,
	title: title_onepicker
});

picker_onepicker.on('picker.select', function (selectedVal, selectedIndex) {
  var text1 = first_onepicker[selectedIndex[0]].text;
  nameEl_onepicker.value = text1;
});

picker_onepicker.on('picker.change', function (index, selectedIndex) {
  if (index === 0){
    firstChange();
  }

  function firstChange() {
    console.log("first---change---exec-------->");
    checked_onepicker[0] = selectedIndex;
    var firstAry = array_onepicker[selectedIndex];
  }

});

picker_onepicker.on('picker.valuechange', function (selectedVal, selectedIndex) {
  console.log(selectedVal);
  console.log(selectedIndex);
});

nameEl_onepicker.addEventListener('click', function () {
	picker_onepicker.show();
});




