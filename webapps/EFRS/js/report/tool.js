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
            print('Y');
        } else if (type == 1) { //导出PDF
            exportPdf('Y');
        } else if (type == 2) {//导出EXCEL分页
            exportExcelByPage('Y')
        } else if (type == 3) {//导出EXCEL不分页
            exportExcel('Y');
        } else if (type == 4) {//导出EXCEL不分页
            exportExcelBySheet('Y');
        } else if (type == 5) {//导出EXCEL不分页
            exportWord('Y');
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


function initDropdown(){
    //普通模式预览工具栏
    layui.use('dropdown', function () {
        var dropdown = layui.dropdown
        dropdown.render({
            elem: '#export', //可绑定在任意元素中，此处以上述按钮为例
            trigger: 'hover',
            data: [
                {
                    title: 'PDF',
                    id: 1
                },
                {type: '-'},
                {
                    title: 'EXCEL(分页)',
                    id: 2
                },
                {
                    title: 'EXCEL(不分页)',
                    id: 3
                },
                {
                    title: 'EXCEL(分页转SHEET)',
                    id: 4
                },
                {type: '-'},
                {
                    title: 'WORD',
                    id: 5
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {//PDF
                    showSheetNames(1);
                } else if (obj.id == 2) { //excel分页
                    showSheetNames(2);
                } else if (obj.id == 3) { //excel不分页
                    showSheetNames(3);
                } else if (obj.id == 4) {//分页转sheet
                    showSheetNames(4);
                } else {//word
                    showSheetNames(5);
                }
            }
        });
    });
    layui.use('dropdown', function () {
        var dropdown = layui.dropdown
        dropdown.render({
            elem: '#table', //可绑定在任意元素中，此处以上述按钮为例
            trigger: 'hover',
            data: [
                {
                    title: '设置表格',
                    id: 1
                },
                {
                    title: '取消表格',
                    id: 2
                }
            ],
            id: 'demo11',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {//PDF
                   DesignModule._setSelTableRegion();
                } else if (obj.id == 2) { //excel分页
                    DesignModule._removeSelTableRegion();
                }
            }
        });
    });
    layui.use('dropdown', function () {
        var dropdown = layui.dropdown
        dropdown.render({
            elem: '#export', //可绑定在任意元素中，此处以上述按钮为例
            trigger: 'hover',
            data: [
                {
                    title: 'PDF',
                    id: 1
                },
                {type: '-'},
                {
                    title: 'EXCEL(分页)',
                    id: 2
                },
                {
                    title: 'EXCEL(不分页)',
                    id: 3
                },
                {
                    title: 'EXCEL(分页转SHEET)',
                    id: 4
                },
                {type: '-'},
                {
                    title: 'WORD',
                    id: 5
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {//PDF
                    showSheetNames(1);
                } else if (obj.id == 2) { //excel分页
                    showSheetNames(2);
                } else if (obj.id == 3) { //excel不分页
                    showSheetNames(3);
                } else if (obj.id == 4) {//分页转sheet
                    showSheetNames(4);
                } else {//word
                    showSheetNames(5);
                }
            }
        });
    });
//表格插件普通预览导出工具栏
    layui.use('dropdown', function () {
        var dropdown = layui.dropdown
        //普通预览导出下拉框
        dropdown.render({
            elem: '#offline', //可绑定在任意元素中，此处以上述按钮为例
            trigger: 'hover',
            data: [
                {
                    title: '导入',
                    id: 1
                },
                {
                    title: '导出',
                    id: 2
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {
                    $('#importU').trigger('click');
                } else if (obj.id == 2) { //excel分页
                    exportUrt();
                }
            }
        });
        //普通填报导出工具栏
        dropdown.render({
            elem: '#normal-submit-export',
            trigger: 'hover',
            data: [
                {
                    title: 'PDF',
                    id: 1
                },
                {type: '-'},
                {
                    title: 'EXCEL(分页)',
                    id: 2
                },
                {
                    title: 'EXCEL(不分页)',
                    id: 3
                },
                {
                    title: 'EXCEL(分页转SHEET)',
                    id: 4
                },
                {type: '-'},
                {
                    title: 'WORD',
                    id: 5
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {
                    showSheetNames(1);
                } else if (obj.id == 2) { //excel分页
                    showSheetNames(2);
                } else if (obj.id == 3) { //excel不分页
                    showSheetNames(3);
                } else if (obj.id == 4) {//
                    showSheetNames(4);
                } else {
                    showSheetNames(5);
                }
            }
        });
        //表格插件填报导出工具栏
        dropdown.render({
            elem: '#exportR',
            trigger: 'hover',
            data: [
                {
                    title: 'PDF',
                    id: 1
                },
                {type: '-'},
                {
                    title: 'EXCEL(分页)',
                    id: 2
                },
                {
                    title: 'EXCEL(不分页)',
                    id: 3
                },
                {
                    title: 'EXCEL(分页转SHEET)',
                    id: 4
                },
                {type: '-'},
                {
                    title: 'WORD',
                    id: 5
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {
                    showSheetNamer(1);
                } else if (obj.id == 2) { //excel分页
                    showSheetNamer(2);
                } else if (obj.id == 3) { //excel不分页
                    showSheetNamer(3);
                } else if (obj.id == 4) {//
                    showSheetNamer(4);
                } else {
                    showSheetNamer(5);
                }
            }
        });
        //表格插件普通预览导出工具栏
        dropdown.render({
            elem: '#normal-export',
            trigger: 'hover',
            data: [
                {
                    title: 'PDF',
                    id: 1
                },
                {type: '-'},
                {
                    title: 'EXCEL(分页)',
                    id: 2
                },
                {
                    title: 'EXCEL(不分页)',
                    id: 3
                },
                {
                    title: 'EXCEL(分页转SHEET)',
                    id: 4
                },
                {type: '-'},
                {
                    title: 'WORD',
                    id: 5
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {
                    showSheetNamer(1);
                } else if (obj.id == 2) { //excel分页
                    showSheetNamer(2);
                } else if (obj.id == 3) { //excel不分页
                    showSheetNamer(3);
                } else if (obj.id == 4) {//
                    showSheetNamer(4);
                } else {
                    showSheetNamer(5);
                }
            }
        });
        //增加行工具栏
        dropdown.render({
            elem: '#rowOper',
            trigger: 'hover',
            data: [
                {
                    title: '增加行',
                    id: 1
                },
                {
                    title: '复制行',
                    id: 2
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {
                    addRowR();
                } else if (obj.id == 2) { //excel分页
                    cloneRowR();
                }
            }
        });
    });
//导入excel事件
    $('#importE').bind('click', function () {
        //当前选中框是否在数据区域内
        var flag = DesignModule._isInDataArea();
        if (flag) {
            layer.open({
                type: 2,
                area: ['500px', '280px'],
                closeBtn: 0,
                maxmin: true,
                resize: false,
                title: ['导入Excel', 'height:30px;line-height:30px'],
                content: base + '/excel.html',
                btn: ['确定', '关闭'],
                btnAlign: 'c',
                end: function () {

                },
                yes: function (index, layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    //获取页面内容
                    var content = iframeWin.getContent();
                    if (content.excel == '') {
                        layer.alert('请选择excel');
                    } else if (!DesignModule._cellIndexToHCell(ParamOperator.encodeStr(content.cell))) {
                        layer.alert('请输入正确的单元格');
                    } else {
                        var rowNum = content.rowNum;
                        var reg = /^[1-9]\d*$/; //由 1-9开头 的正则表达式
                        //先判断是否为整数 在判断 是否在 1-300 整数范围之内
                        if (reg.test(rowNum)) {
                            if (parseInt(rowNum) > 0 && parseInt(rowNum) <= 300) {

                            } else {
                                layer.alert('请输入正确的行数');
                            }
                        }
                    }
                    var cellPos = DesignModule._cellChar2Pos(ParamOperator.encodeStr(content.cell));
                    var cellJson = ParamOperator.decodeStrAndFree(cellPos);
                    cellJson = JSON.parse(cellJson);
                    //导入Excel
                    DesignModule._importExcelDataFromStream(ParamOperator.encodeStr(content.excel), cellJson.x, cellJson.y, parseInt(rowNum), content.isReplace);
                    layer.closeAll();
                },
                success: function (layero, index) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(base,token);
                }
            });
        } else {
            layer.alert('当前选中框不在数据区域内');
        }

    })
    layui.use('upload', function () {
        var upload = layui.upload;
        upload.render({
            elem: '#importU'
            , url: base + '/designSys/getJsonData?token=' + token
            , accept: 'file'
            , exts: 'urt'
            , done: function (res) {
            }
            , before: function (obj) {
                var files = obj.pushFile();
                obj.preview(function (index, file, result) { //得到文件base64编码，比如图片
                    var ts = result.indexOf('base64,') + 7;
                    var tt = result.substr(ts, result.length);
                    var str = new Base64().decode(tt);
                    var t = DesignModule._loadURTFromJson(ParamOperator.encodeStr(str));
                });
            }
        });

    });
    layui.use('upload', function () {//插入图片
        var upload = layui.upload;
        upload.render({ //允许上传的文件后缀
            elem: '#fileBut'
            , url: base + '/designSys/getJsonData?token=' + token
            , accept: 'images'
            , done: function (res) {
            }
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    var t = result.substr(result.indexOf('base64,') + 7, result.length);
                    //将base64位编码保存到单元格中
                    DesignModule._setSelCellFile(ParamOperator.encodeStr(file.name), ParamOperator.encodeStr(t), isShowPic);
                });
            }
        });
    });
}

