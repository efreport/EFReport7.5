
// 做一个2级联动的选择的页面
var nameEl_mypicker = document.getElementById('mypicker');

var title_mypicker = "自定义标题";
var array_mypicker = [
  {name:"AAA",sub:[{name:"AAA-1"},{name:"AAA-2"},{name:"AAA-3"}],type:0},
  {name:"BBB",sub:[{name:"BBB-1"},{name:"BBB-2"},{name:"BBB-3"}],type:0},
  {name:"CCC",sub:[{name:"CCC-1"},{name:"CCC-2"},{name:"CCC-3"}],type:0}
];

var first_mypicker = []; /* 第一列元素 */
var second_mypicker = []; /* 第二列元素 */

var selectedIndex_mypicker = [0, 0]; /* 默认选中的 元素 */

var checked_mypicker = [0, 0]; /* 已选选项 */

function creatList_mypicker(obj, list){
  obj.forEach(function(item, index, arr){
    var temp = new Object();
    temp.text = item.name;
    temp.value = index;
    list.push(temp);
  })
}

creatList_mypicker(array_mypicker, first_mypicker);

if (array_mypicker[selectedIndex_mypicker[0]].hasOwnProperty('sub')) {
  creatList_mypicker(array_mypicker[selectedIndex_mypicker[0]].sub, second_mypicker);
} else {
  second_mypicker = [{text: '', value: 0}];
}

var picker_mypicker = new Picker({
	data: [first_mypicker, second_mypicker],
  selectedIndex: selectedIndex_mypicker,
	title: title_mypicker
});

picker_mypicker.on('picker.select', function (selectedVal, selectedIndex) {
  var text1 = first_mypicker[selectedIndex[0]].text;
  var text2 = second_mypicker[selectedIndex[1]].text;
  nameEl_mypicker.value = text1 + ' ' + text2;
});

picker_mypicker.on('picker.change', function (index, selectedIndex) {
  if (index === 0){
    firstChange();
  } else if (index === 1) {
    secondChange();
  }

  function firstChange() {
    console.log("first---change---exec-------->");
    second_mypicker = [];
    checked_mypicker[0] = selectedIndex;
    var firstAry = array_mypicker[selectedIndex];
    if (firstAry.hasOwnProperty('sub')) {
      creatList_mypicker(firstAry.sub, second_mypicker);

      var secondCity = array_mypicker[selectedIndex].sub[0]
      
    } else {
      second_mypicker = [{text: '', value: 0}];
      checked_mypicker[1] = 0;
    }

    picker_mypicker.refillColumn(1, second_mypicker);
    // picker.refillColumn(2, third);
    picker_mypicker.scrollColumn(1, 0)
    // picker.scrollColumn(2, 0)
  }

  function secondChange() {
    // third = [];
    checked_mypicker[1] = selectedIndex;
    var first_index = checked_mypicker[0];
  }

});

picker_mypicker.on('picker.valuechange', function (selectedVal, selectedIndex) {
  console.log(selectedVal);
  console.log(selectedIndex);
});

nameEl_mypicker.addEventListener('click', function () {
	picker_mypicker.show();
});




