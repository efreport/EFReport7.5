//下一页
hasFindFlag = false;
function next(){
    let curr = parseInt($('#curr').val()); //当前页
    let total = parseInt($('#total').text()); //总页数
    if(curr == total){//当前页为最后一页时，下一页无效
        return false;
    }else{
        curr ++;
        $('#curr').val(curr); //更新当前页的值
        curMap[curSheet] = curr;
        let tableId = $('table[sheetName="'+ curSheet +'"]').attr("id"); //当前渲染数据的表格ID
        $('#' + tableId).empty(); //清空当前表格的数据
        $.ajax({
            url:base + "/report/queryBySheet?sheetName="+ curSheet +"&pathId=" + pathId + '&serverId=' + serverId +'&page=' + curr + '&token=' + token,
            type:"GET",
            success:function(res){
                reportJson = JSON.parse(res.result); //更新当前的报表JSON
                colorList = reportJson.ColorList;
                fontList = reportJson.FontList;
                initNormalReportByPage(tableId);
                /*$('#content').children('div').eq(index).removeClass('hide');
                $('#content').children('div').eq(index).addClass('show');*/
            },
            error:function(){

            }
        })


    }

}

function cur(){
    let curr = $('#curr').val();
    if (isNaN(curr)) { //非数字，默认为1
        curr = 1;
        $('#curr').val(1)
    }
    var total = parseInt($('#total').text());
    if(curr >= total){
        curr = total;
        $('#curr').val(total);
    }
    if(curr <= 1){
        curr = 1;
        $('#curr').val(1);
    }
    curMap[curSheet] = curr;
    let tableId = $('table[sheetName="'+ curSheet +'"]').attr("id"); //当前渲染数据的表格ID
    $('#' + tableId).empty(); //清空当前表格的数据
    $.ajax({
        url:base + "/report/queryBySheet?sheetName="+ curSheet +"&pathId=" + pathId + '&serverId=' + serverId + '&page=' + curr  + '&token=' + token,
        type:"GET",
        success:function(res){
            reportJson = JSON.parse(res.result); //更新当前的报表JSON
            colorList = reportJson.ColorList;
            fontList = reportJson.FontList;
            initNormalReportByPage(tableId);

            //查找功能查询到结果时，需要在加载完页面后去找到对应的单元格并渲染
            if(hasFindFlag){
                var searchId = tableId + '_' + searchY + '_' + searchX;
                $('.searchTd').removeClass('searchTd');
                $('#' + searchId).find('span').addClass('searchTd');
                hasFindFlag = false;
            }

        },
        error:function(){

        }
    })
}

//上一页
function prev(){
    let curr = parseInt($('#curr').val()); //当前页
    if(curr == 1){ //已经是第一页
        return false;
    }else{
        curr --;
        $('#curr').val(curr); //更新当前页的值
        curMap[curSheet] = curr;
        let tableId = $('table[sheetName="'+ curSheet +'"]').attr("id"); //当前渲染数据的表格ID
        $('#' + tableId).empty(); //清空当前表格的数据
        $.ajax({
            url:base + "/report/queryBySheet?sheetName="+ curSheet +"&pathId=" + pathId + '&serverId=' + serverId + '&page=' + curr  + '&token=' + token,
            type:"GET",
            success:function(res){
                reportJson = JSON.parse(res.result); //更新当前的报表JSON
                colorList = reportJson.ColorList;
                fontList = reportJson.FontList;
                initNormalReportByPage(tableId);
                /*$('#content').children('div').eq(index).removeClass('hide');
                $('#content').children('div').eq(index).addClass('show');*/
            },
            error:function(){

            }
        })
    }
}
//首页
function first(){
    let curr = parseInt($('#curr').val()); //当前页
    if(curr == 1){ //已经是首页
        return false;
    }else{
        curr = 1;
        $('#curr').val(curr); //更新当前页的值
        curMap[curSheet] = curr;
        let tableId = $('table[sheetName="'+ curSheet +'"]').attr("id"); //当前渲染数据的表格ID
        $('#' + tableId).empty(); //清空当前表格的数据
        $.ajax({
            url:base + "/report/queryBySheet?sheetName="+ curSheet +"&pathId=" + pathId  + '&serverId=' + serverId + '&page=' + curr + '&token=' + token,
            type:"GET",
            success:function(res){
                reportJson = JSON.parse(res.result); //更新当前的报表JSON
                colorList = reportJson.ColorList;
                fontList = reportJson.FontList;
                initNormalReportByPage(tableId);
               /* $('#content').children('div').eq(index).removeClass('hide');
                $('#content').children('div').eq(index).addClass('show');*/
            },
            error:function(){

            }
        })
    }
}
//末页
function last(){
    let curr = parseInt($('#curr').val()); //当前页
    let total = parseInt($('#total').text()); //总页数
    if(curr == total){//当前页为最后一页时，下一页无效
        return false;
    }else{
        curr = total;
        $('#curr').val(curr); //更新当前页的值
        curMap[curSheet] = curr;
        let tableId = $('table[sheetName="'+ curSheet +'"]').attr("id"); //当前渲染数据的表格ID
        $('#' + tableId).empty(); //清空当前表格的数据
        $.ajax({
            url:base + "/report/queryBySheet?sheetName="+ curSheet +"&pathId=" + pathId + '&serverId=' + serverId + '&page=' + curr + '&token=' + token,
            type:"GET",
            success:function(res){
                reportJson = JSON.parse(res.result); //更新当前的报表JSON
                colorList = reportJson.ColorList;
                fontList = reportJson.FontList;
                initNormalReportByPage(tableId);
                /*$('#content').children('div').eq(index).removeClass('hide');
                $('#content').children('div').eq(index).addClass('show');*/
            },
            error:function(){

            }
        })
    }
}
function print(flag , sheetNames) {
    let url = base +  '/report/print?templateId=' + id + '&params=' + encodeURIComponent(paramStr) + '&token=' + token+ '&cflag=' + flag + "&sheetNames=" + sheetNames + "&templateName=" + templateName;
    window.open(url);
}
//导出PDF
function exportPdf(flag, sheetNames){
    let url = base +  '/report/expPDF?templateId=' + id + '&params=' + encodeURIComponent(paramStr) + '&token=' + token+ '&cflag=' + flag + "&sheetNames=" + sheetNames + "&templateName=" + templateName;
    // top.window.open(url);
    window.open(url);


}
//导出Excel
function exportExcel(flag, sheetNames){
    let url = base +  '/report/expXLS?templateId=' + id + '&params=' + encodeURIComponent(paramStr) + '&flag=0' + '&token=' + token + '&cflag=' + flag + "&sheetNames=" + sheetNames+ "&templateName=" + templateName;
    // top.window.open(url);
    window.open(url);
}
//导出Excel分页
function exportExcelByPage(flag, sheetNames){
    let url = base +  '/report/expXLS?templateId=' + id + '&params=' + encodeURIComponent(paramStr) + '&flag=1' + '&token=' + token+ '&cflag=' + flag + "&sheetNames=" + sheetNames+ "&templateName=" + templateName;
    // top.window.open(url);
    window.open(url);
}
//导出Excel分页转Sheet
function exportExcelBySheet(flag, sheetNames){
    let url = base +  '/report/expXLSBySheet?templateId=' + id + '&params=' + encodeURIComponent(paramStr) + '&token=' + token+ '&cflag=' + flag + "&sheetNames=" + sheetNames+ "&templateName=" + templateName;
    // top.window.open(url);
    window.open(url);
}
//导出Word
function exportWord(flag, sheetNames){
    let url = base +  '/report/expWord?templateId=' + id + '&params=' + encodeURIComponent(paramStr) + '&token=' + token+ '&cflag=' + flag + "&sheetNames=" + sheetNames+ "&templateName=" + templateName;
    window.open(url);
}
//弹框
function showSheetNames(type) {
    if (isAlert == 'true') {
        let sheet = $('.i-sheet');
        if (sheet.length == 1) { //只有一个sheet页时，不弹框
            if (type == 0) { //打印
                print('Y');
            } else if (type == 1) { //导出PDF
                exportPdf('Y');
            } else if (type == 2) {//导出EXCEL分页
                exportExcelByPage('Y');
            } else if (type == 3) {//导出EXCEL不分页
                exportExcel('Y');
            } else if (type == 4) {//导出EXCEL不分页
                exportExcelBySheet('Y');
            } else if (type == 5) {//导出EXCEL不分页
                exportWord('Y');
            }
        } else {
            let index = layer.open({
                type: 2,
                area: ['500px', '500px'],
                closeBtn: 0,
                maxmin: true,
                title: ['选择sheet', 'height:30px;line-height:30px'],
                content: [base + '/sheetName.html', 'no'],
                btn: ['全选', '确定', '关闭'],
                resize: false,
                btnAlign: 'c',
                end: function () {

                },
                success: function (layero, index) {
                    let others = [];
                    let sheets = $('.i-sheet');
                    $.each(sheets, function (i, e) {
                        let sheetName = $(e).attr('st');//获取sheet名
                        others.push(sheetName);
                    })
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(others);
                    $('.layui-layer-btn0').text('全不选');
                },
                yes: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.chooseAll();
                    let text = $('.layui-layer-btn0').text();
                    if(text == '全选'){
                        iframeWin.chooseAll(1);
                        $('.layui-layer-btn0').text('全不选');
                    }else{
                        iframeWin.chooseAll(0);
                        $('.layui-layer-btn0').text('全选');
                    }
                    return false;
                },
                btn2: function (index, layero) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    let res =iframeWin.getSheetNames(); //获取所有sheet名称
                    let sheetNames = '';
                    let flag = res.chooseAll; //是否全选
                    if(flag == 'N'){
                        $.each(res.sheet , function(i,e){
                            if(i == res.length - 1){
                                sheetNames += e;
                            }else{
                                sheetNames += (e + ',');
                            }
                        })
                    }
                    if (type == 0) { //打印
                        print(flag , sheetNames);
                    } else if (type == 1) { //导出PDF
                        exportPdf(flag , sheetNames);
                    } else if (type == 2) {//导出EXCEL分页
                        exportExcelByPage(flag ,sheetNames)
                    } else if (type == 3) {//导出EXCEL不分页
                        exportExcel(flag ,sheetNames);
                    } else if (type == 4) {//导出EXCEL不分页
                        exportExcelBySheet(flag,sheetNames);
                    } else if (type == 5) {//导出EXCEL不分页
                        exportWord(flag,sheetNames);
                    }
                }
            });
        }

    } else {
        if (type == 0) { //打印
            print();
        } else if (type == 1) { //导出PDF
            exportPdf();
        } else if (type == 2) {//导出EXCEL分页
            exportExcelByPage()
        } else if (type == 3) {//导出EXCEL不分页
            exportExcel();
        } else if (type == 4) {//导出EXCEL不分页
            exportExcelBySheet();
        } else if (type == 5) {//导出EXCEL不分页
            exportWord();
        }
    }


}

function searchKeyword(){
    layer.open({
        type: 1,
        area: ['300px', '140px'],
        closeBtn: 0,
        resize: false,
        title: ['搜索', 'height:30px;line-height:30px'],
        content: '<span style="margin-left:20px;">关键字:<span><input type="text" id="keywords" style="width:200px;height:40px;margin:5px;background-color:#F2F3F5;border:0px solid black;">',
        btn: ['确定', '取消'],
        btnAlign: 'c',
        end: function (index, layero) {
            layer.close(index);
        },
        yes: function (index, layero) {
            var keywords = $('#keywords').val();
            var page = $('#curr').val();
            var total = $('#total').text();
            var sheetName;
            if($('.x-sheet').css('display') == 'none'){//单sheet模式下
                sheetName = $('.i-sheet').eq(0).attr('st');
            }else{
                sheetName = $('.sheet_ck').eq(0).text();
            }
            sheetName = sheetName.trim();
            $.ajax({
                url: base + '/report/search',
                type: 'post',
                dataType: 'json',
                data: {"keywords": keywords, "page": page, "total": total, "sheetName": sheetName , pathId:pathId , token:token},
                success: function (res) {
                    var state = res.state;
                    if (state == 'success') {
                        var pageNum = res.page;
                        searchX = res.x;
                        searchY = res.y;
                        if (page == pageNum) {//如果是当前页
                            var tableId = $('.show').eq(0).find('table').attr('id');
                            var id = tableId + '_'  + searchY + '_'  + searchX;
                            $('.searchTd').removeClass('searchTd');
                            $('#' + id).find('span').addClass('searchTd');
                            $('#' + id).addClass('searchTd');
                        } else {//非当前页
                            $('#curr').val(pageNum);
                            $('#curr').trigger('change');
                            hasFindFlag = true;
                        }
                    } else {
                        layer.alert('未找到关键字');
                    }
                }, error: function () {
                }
            })

            layer.close(index);
        },
        success: function (layero, index) {
        }
    });
}