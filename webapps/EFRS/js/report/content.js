/***
 * 计算报表内容高度并调整
 ***/

//设置普通预览content内容的高度
function setContentHeight(IsShowCenterReport){
    let bodyHeight = $('body').height(); //页面高度
    let toolHeight = $('#tool').height(); //工具栏高度
    let paramHeight = $('#ef-normal-param').height(); //参数工具栏高度
    let sheetHeight = $('#sheet').height(); //sheet栏高度
    //不显示工具栏
    if($('#tool').css('display') == 'none'){
        toolHeight = 0;
    }
    //不显示sheet栏
    if($('#sheet').css('display') == 'none'){
        sheetHeight = 0;
    }
    if($('#ef-normal-param').css('display') == 'none'){
        paramHeight = 0;
    }
    let tableHeight = $('.show').eq(0).find('table').height(); //当前显示table的内容高度
    let tableWidth = $('.show').eq(0).find('table').width();
    let contentHeight = bodyHeight - toolHeight - sheetHeight - paramHeight;

    if(tableHeight > contentHeight){ // 实际内容高度大于显示区域高度
      /*  if(tableWidth < $('body').width()){
            $('#content').css('width' , $('body').width());
            $('.show').css('width' , $('body').width());
        }*/
        $('#content').css('height' , contentHeight);
        $('.show').css('height' , contentHeight - paramTop); //当模板参数上方留白时，要考虑留白的高度
        $('#content').css('overflow-y' , 'auto'); //增加垂直滚动条
    }else{ //解决水平滚动条未出现在页面底部的问题
        $('#content').css('height' , contentHeight);
        $('.show').css('height' , contentHeight - paramTop); //当模板参数上方留白时，要考虑留白的高度
    }
    //是否居中显示
    if(IsShowCenterReport){
        let contentWidth = parseInt($('.show').find('table').css('width'));
        let bodyWidth = parseInt($('body').css('width'));
        if(contentWidth < bodyWidth){ //body宽度大于报表宽度
            let margin = (bodyWidth - contentWidth)/2;
            $('.show').css("padding-left" , margin + 'px');
        }
    }
}

//设置自适应预览
function setWcpContentHeight(){
    let bodyHeight = $('body').height(); //页面高度
    let toolHeight = $('#tool').height(); //工具栏高度
    let paramHeight = $('#ef-normal-param').height(); //参数工具栏高度
    let sheetHeight = $('#sheet').height(); //sheet栏高度
    //不显示工具栏
    if($('#tool').css('display') == 'none'){
        toolHeight = 0;
    }
    //不显示sheet栏
    if($('#sheet').css('display') == 'none'){
        sheetHeight = 0;
    }
    if($('#ef-normal-param').css('display') == 'none'){
        paramHeight = 0;
    }
    let tableHeight = $('.show').eq(0).find('table').height(); //当前显示table的内容高度
    let tableWidth = $('.show').eq(0).find('table').width();
    let contentHeight = bodyHeight - toolHeight - sheetHeight - paramHeight;

    if(tableHeight > contentHeight){ // 实际内容高度大于显示区域高度
        $('#content').css('height' , contentHeight);
        $('.show').css('height' , contentHeight);
        $('.show').css('overflow-x' , 'hidden');
        $('#content').css('overflow-y' , 'auto'); //增加垂直滚动条
        $('#content').css('overflow-x' , 'hidden'); //增加垂直滚动条
    }
}

function setSubmitContentHeight(){
    let bodyHeight = $('body').height(); //页面高度
    let toolHeight = $('#tool').height(); //工具栏高度
    let paramHeight = $('#ef-normal-param').height(); //参数工具栏高度
    let sheetHeight = $('#sheet').height(); //sheet栏高度

    //不显示工具栏
    if($('#tool').css('display') == 'none'){
        toolHeight = 0;
    }
    //不显示sheet栏
    if($('#sheet').css('display') == 'none'){
        sheetHeight = 0;
    }

    if($('#ef-normal-param').css('display') == 'none'){
        paramHeight = 0;
    }

    $('#content').css('height' , bodyHeight - toolHeight - sheetHeight - paramHeight);
    //对于填报报表，高度会动态变化
    let dataHeight = $('.x-data-bg_block').css('height'); //报表内容高度
    let contentHeight = $('#content').css('height');
    //如果内容高度小于容器高度，将内容高度设置为容器高度
    if(dataHeight < contentHeight){
        $('.x-data-bg_block').css('height' , contentHeight);
    }
}