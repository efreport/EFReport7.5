
// 做一个2级联动的选择的页面
var nameEl2 = document.getElementById('picker2');



var first2 = []; /* 省，直辖市 */
var second2 = []; /* 市 */

var selectedIndex2 = [0, 0]; /* 默认选中的地区 */

var checked2 = [0, 0]; /* 已选选项 */

function creatList2(obj, list){
  obj.forEach(function(item, index, arr){
    var temp = new Object();
    temp.text = item.name;
    temp.value = index;
    list.push(temp);
  })
}

creatList2(city, first2);

if (city[selectedIndex2[0]].hasOwnProperty('sub')) {
  creatList2(city[selectedIndex2[0]].sub, second2);
} else {
  second2 = [{text: '', value: 0}];
}

var picker2 = new Picker({
	data: [first2, second2],
  selectedIndex: selectedIndex2,
	title: '省(直辖市)/市(区)'
});

picker2.on('picker.select', function (selectedVal, selectedIndex2) {
  var text1 = first2[selectedIndex2[0]].text;
  var text2 = second2[selectedIndex2[1]].text;
  nameEl2.value = text1 + ' ' + text2;
});

picker2.on('picker.change', function (index, selectedIndex2) {
  if (index === 0){
    firstChange();
  } else if (index === 1) {
    secondChange();
  }

  function firstChange() {
    console.log("first---change---exec-------->");
    second2 = [];
    checked2[0] = selectedIndex2;
    var firstCity = city[selectedIndex2];
    if (firstCity.hasOwnProperty('sub')) {
      creatList2(firstCity.sub, second2);

      var secondCity = city[selectedIndex2].sub[0]
      
    } else {
      second2 = [{text: '', value: 0}];
      checked2[1] = 0;
    }

    picker2.refillColumn(1, second2);
    // picker.refillColumn(2, third);
    picker2.scrollColumn(1, 0)
    // picker.scrollColumn(2, 0)
  }

  function secondChange() {
    // third = [];
    checked2[1] = selectedIndex2;
    var first_index = checked2[0];
  }

});

picker2.on('picker.valuechange', function (selectedVal, selectedIndex) {
  console.log(selectedVal);
  console.log(selectedIndex);
});

nameEl2.addEventListener('click', function () {
	picker2.show();
});




