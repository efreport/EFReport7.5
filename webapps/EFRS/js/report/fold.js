/**
 * 折叠行列方法js
 * **/
function doColumnSwitch(e, tableId) {
    var ele = $(e);
    if (ele.html() === "+") {
        ele.html("-");
        ele.attr("title", "合并");
        for (var i = parseInt(ele.attr("RetractBeginCol")); i <= parseInt(ele.attr("RetractEndCol")); i++) {
            $("td[idx=" + i + "]").show();
        }
        var td = ele.parent().parent().parent();
        td.attr("colspan", (parseInt(td.attr("colspan")) + (i - parseInt(ele.attr("RetractBeginCol")))));
    } else {
        ele.html("+");
        ele.attr("title", "展开");
        var width;
        for (var i = parseInt(ele.attr("RetractBeginCol")); i <= parseInt(ele.attr("RetractEndCol")); i++) {
            if (i == parseInt(ele.attr("RetractBeginCol"))) {
                width = $("td[idx=" + i + "]").width();
            }
            $("td[idx=" + i + "]").hide();
        }
        var td = ele.parent().parent().parent();
        //ele.parent().attr("colspan", (parseInt(ele.parent().attr("colspan")) - (i - parseInt(ele.attr("RetractBeginCol")))));
        td.attr("colspan", 1);
        td.css("width", width); //手动修改td的高度
        td.find("div").eq(0).css("width", width); //手动修改td里面span的高度
        td.find("span").eq(0).css("width", width); //手动修改td里面span的高度
    }
}

function doRowSwitch(e, tableId) {
    var ele = $(e);
    if (ele.html() === "+") {
        ele.html("-");
        ele.attr("title", "合并");
        var arr = [];
        for (var i = parseInt(ele.attr("RetractBeginRow")); i <= parseInt(ele.attr("RetractEndRow")); i++) {//遍历管理的所有行
            var tr = $("#" + tableId + "_r_" + i); //tr
            tr.show();//先显示行
            tr.attr('pId', ele.attr('id'));
            var a = tr.find('a[class="switch"]'); //找到所有有折叠属性的a
            if (a.length > 0) { //添加到折叠数组
                arr.push(a);
            }
        }
        $.each(arr, function (index, element) { //遍历折叠数组
            tr.show();//显示自己
            if ($(element).attr('isFold') == undefined) { //初始化没有展开属性，统一默认折叠
                for (var j = parseInt(element.attr("RetractBeginRow")); j <= parseInt(element.attr("RetractEndRow")); j++) {
                    var tr1 = $("#" + tableId + "_r_" + j); //tr
                    tr1.hide();
                }
            } else {
                if ($(element).attr('isFold') == 'Y') { //如果为展开属性，不做任何操作，因为前面已经展开
                    //$(element).trigger('click');
                } else {//如果为折叠属性，需要隐藏前面已经展开的属性
                    for (var j = parseInt(element.attr("RetractBeginRow")); j <= parseInt(element.attr("RetractEndRow")); j++) {
                        var tr1 = $("#" + tableId + "_r_" + j); //tr
                        tr1.hide();
                    }//遍历管理的所有行
                }
            }
        })

        var td = ele.parent().parent().parent();

        if (td.attr('isg') == 1 && isNaN(td.attr('rowspan')) != true) {
            td.attr("rowspan", (parseInt(td.attr("rowspan")) + (i - parseInt(ele.attr("RetractBeginRow")))));
        }
        //标记展开属性
        ele.attr("isFold", "Y");

    } else {
        ele.html("+");
        ele.attr("title", "展开");
        var height;
        for (var i = parseInt(ele.attr("RetractBeginRow")); i <= parseInt(ele.attr("RetractEndRow")); i++) {
            if (i == parseInt(ele.attr("RetractBeginRow"))) {
                height = $("#" + tableId + "_r_" + i).height();
            }
            $("#" + tableId + "_r_" + i).hide();

        }
        //ele.parent().attr("rowspan", (parseInt(ele.parent().attr("rowspan")) - (i - parseInt(ele.attr("RetractBeginRow")))));
        var td = ele.parent().parent().parent();
        if (td.attr('isg') == 1 && isNaN(td.attr('rowspan')) != true) {
            td.attr("rowspan", 1);
            td.css("height", height); //手动修改td的高度
            td.find("div").css("height", height);
            td.find("span").eq(0).css("height", height); //手动修改td里面span的高度
        }
        //标记折叠属性
        ele.attr('isFold', 'N');

    }
}