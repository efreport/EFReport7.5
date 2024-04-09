function initShapeEvents() {
    //设置悬浮元素名
    $('#shapeName').bind('keyup', function () {
        if ($(this).val() != '') {
            let flag = canvasEvent.Shape.setSelShapeName($(this).val());
            if (!flag) {
                layer.alert('悬浮插件名重复,请重新设置');
            }
        }
    });
    //x坐标
    $('#xPost').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Shape.setSelShapeX($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }

    });
    //y坐标
    $('#yPost').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Shape.setSelShapeY($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    });
    //宽度
    $('#sWidth').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Shape.setSelShapeWidth($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    });
    //高度
    $('#sHeight').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Shape.setSelShapeHeight($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    });
    //悬浮元素文本
    $('#sText').bind('keyup', function () {
        var val = $(this).val();
        canvasEvent.Shape.setSelShapeText(val);
    });


    $('#paramX').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Param.setSelParamShapeX($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }

    });
    //y坐标
    $('#paramY').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Param.setSelParamShapeY($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    });
    //宽度
    $('#paramWidth').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Param.setSelParamShapeWidth($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    });
    //高度
    $('#paramHeight').bind('keyup', function () {
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Param.setSelParamShapeHeight($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    });
    //悬浮元素文本
    $('#paramText').bind('keyup', function () {
        var val = $(this).val();
        canvasEvent.Param.setSelParamShapeLabel(val);
    });

    $('#isSelParamVisible').bind('change', function () {
        var val = $(this).prop('checked');
        console.log(val);
        console.log(canvasEvent.Param.setSelParamShapeVisible(val));
    });

    //是否可见
    $('#isSelShapeVisible').bind('change', function () {
        var isSelShapeVisible = $(this).prop('checked');
        canvasEvent.Shape.setSelShapeVisible(isSelShapeVisible);
    });

    $('#isShowSubReportScrollBar').bind('change' , function(){
        var isShowSubReportScrollBar = $(this).prop('checked');
        canvasEvent.Shape.setSelShapeShowScrollBar(isShowSubReportScrollBar);
    })

    $('#isSubReportKeepHVRatio').bind('change' , function(){
        var isSubReportKeepHVRatio = $(this).prop('checked');
        canvasEvent.Shape.setSelShapeKeepHVRatio(isSubReportKeepHVRatio);
    })

    $('#intervalScrollV').bind('keyup' , function(){
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Shape.setSelShapeIntervalScrollV($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    })

    $('#stepScrollV').bind('keyup' , function(){
        let val = $(this).val();
        if(isNoNegativeNumber(val)){
            canvasEvent.Shape.setSelShapeStepScrollV($(this).val());
        }else{
            layer.alert('请输入正确的数值');
        }
    })

    $('#sName').bind('change', function () {
        var name = $(this).val();
        canvasEvent.Shape.setSelShapeSheetName(name);
    })


    let colors = [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
            "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
            "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
            "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ];
    //颜色插件配置
    let colorOpt = {
        allowEmpty: true, showInput: true, containerClassName: "full-spectrum", showInitial: true, showPalette: true,
        showSelectionPalette: true, showAlpha: true, maxPaletteSize: 10, preferredFormat: "hex",
        change: function (color) {
            var hexColor = "transparent";
            if (color) {
                hexColor = color.toHexString();
                $(this).find('#lineColorDiv1').css("background-color", hexColor);
                $(this).find('#lineColorText1').text(hexColor);

            }
        },
        beforeShow: function () {
            var co = '';
            var id = $(this).attr('id');
            if ('chartColor' == id || 'linecolor' == id || 'linecolor1' == id || 'bkcolor' == id || 'bkcolor1' == id || 'bkcolor2' == id || 'color' == id || 'color1' == id) {
                co = $(this).css('background-color');
            } else {
                co = $(this).css('border-bottom-color');
            }
            if (co) {
                $(this).spectrum('set', co);
            }
        },
        hide: function () {
            $("#mask").hide();
        },
        palette: colors
    };

    //绑定颜色控件
    $("#linecolor1").spectrum(colorOpt);

    $('#borders').bind('click', function (event) {
        event.stopPropagation();
        let list = $('#borderDivs');
        let X = $(this).offset().top + 20;
        let Y = $(this).offset().left;
        list.css({"top": X, "left": Y, "z-index": 100}).show();
    })


    //边框样式
    $("#ckline1").click(function () {
        var X = $(this).children(0).offset().top + 25;
        var Y = $(this).children(0).offset().left;
        $("#lines").css({"top": X, "left": Y}).show();
        $("#lines").focus();
        $("#lines").blur(function () {
            $(this).hide();
        });
    });

    //选择样式事件
    $("div[name='lineval1']").click(function () {
        var val = $(this).attr('val'),
            url = 'images/design/line/l' + val + '.png';
        var img = $("#ckline").children(0).children(0);
        img.attr('src', url);
        img.attr('val', val);
        var img1 = $("#ckline1").children(0).children(0);
        img1.attr('src', url);
        img1.attr('val', val);
        $("#lines").hide();
    });

    //点击线宽选择框
    $('#input[name="xk1"]').unbind().bind('click', function (e) {
        console.log($(this).val());
    })

    $("img[name='borders']").click(function () {
        var sidetype = $(this).attr('attr');
        if ('00' == sidetype) {
            canvasEvent.Cell.cancelSelCellLineStyle();
        } else if ('7' == sidetype) { //加粗边框
            canvasEvent.Cell.setSelCellLineStyle(5, 1, 1, '#000000');
        } else {
            canvasEvent.Cell.setSelCellLineStyle(sidetype, 1, 0, '#000000');
        }
        $('#borderDivs').hide();
    });

    //设置悬浮元素边框
    $("div[name='borderAlign_d1']").click(function () { //设置边框
        var val = $(this).children(0).attr('val');
        let color = $("#lineColorText1").text(); //边框颜色
        if (val == 5) { //设置边框
            $(this).addClass('fx');
            $(this).next().next().removeClass('fx');
            canvasEvent.Cell.setSelCellLineStyle(val, 1, 0, color);
        } else { //取消边框
            canvasEvent.Cell.cancelSelCellLineStyle();
            $(this).addClass('fx');
            $(this).prev().prev().removeClass('fx');
        }
    });


}