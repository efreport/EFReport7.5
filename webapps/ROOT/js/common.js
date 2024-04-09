function isNull(obj){
    if(obj==null||obj==undefined||obj==''){
      return true;
    }
    return false;
}

 /**
  * [通过参数名获取url中的参数值]
  * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
  * @param  {[string]} queryName [参数名]
  * @return {[string]}           [参数值]
  */
function GetQueryValue(queryName) {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == queryName) { return pair[1]; }
    }
    return null;
}

function efalert(obj , msg , ico){
  obj.alert(msg, {icon:ico});
}

function efalert1(obj , msg){
  obj.alert(msg, {icon: 2, shift: 5}, function(index) {
      layer.close(index);
  });
}

function efalert2(obj , msg){
  obj.alert(msg, { shift: 5}, function(index) {
      window.location.reload();
  })
}
// 去除数组中的重复数据
function removeRepeatData(arr){
  let newsArr = [];
  for (let i = 0; i < arr.length; i++) {
   if(newsArr.indexOf(arr[i]) === -1){
    newsArr.push(arr[i]);
   }
  }
  return newsArr;
 }