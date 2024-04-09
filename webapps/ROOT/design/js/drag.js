
//拖拽
var drag = {

    class_name : null,  //允许放置的容器
    pclass:null,
    permitDrag : false,	//是否允许移动标识

    _x : 0,             //节点x坐标
    _y : 0,			    //节点y坐标
    _left : 0,          //光标与节点坐标的距离
    _top : 0,           //光标与节点坐标的距离

    old_elm : null,     //拖拽原节点
    tmp_elm : null,     //跟随光标移动的临时节点
    new_elm : null,     //拖拽完成后添加的新节点

    fields:[],
    preInit:function(){
        //$('.' + drag.class_name).unbind();
        drag.class_name = null;
        drag.pclass=null;
        drag.old_elm=null;
        drag.permitDrag=false;
        fields=[];
        $('#moveF').empty();
    },
    //初始化
    init : function (className,pclass){
        drag.preInit();
        //允许拖拽节点的父容器的classname(可按照需要，修改为id或其他)
        drag.class_name = className;
        drag.pclass=pclass;
        /*$('.' + drag.class_name).on('click', '.dsii li a', function(event){
         if($(this).hasClass('ck_a')){
         $(this).removeClass('ck_a');
         }else{
         var dsiLi=$(this).parent().parent().parent();
         var t=dsiLi.children('a').text();
         if(t!=dsinfo){
         dsiLi.children('a').trigger("click");
         }
         dsinfo=dsiLi.children('a').text();
         $(this).addClass('ck_a');
         }
         });*/

        $('.' + drag.class_name).on('mouseup', '.dsii li a', function(event){
            if(null!=dsinfo){
                if(event.shiftKey&&event.ctrlKey){
                    return false;
                }
                if(event.shiftKey){
                    var end=-1,start= 0,b=false;
                    $(this).parent().parent().children('li').each(function(){
                        if($(this).children('a').hasClass('ck_a')){
                            b=true;//如果有选中的
                            start = $(this).prevAll().length;
                            return;
                        }
                    });
                    if(!b){//如果按下shift且之前没有选中的，就设置当前为选中
                        $(this).addClass('ck_a');
                    }else{
                        end = $(this).parent().prevAll().length;
                        if(end>-1){
                            if(end>=start){
                                $(this).parent().parent().children('li').each(function(i){
                                    if(i>=start&&i<=end){
                                        var a=$(this).children('a');
                                        a.addClass('ck_a');
                                        if(fields.indexOf(a.text())==-1){
                                            fields.push(a.text());
                                        }
                                    }
                                });
                            }else{
                                $(this).parent().parent().children('li').each(function(i){
                                    if(i>=end&&i<=start){
                                        var a=$(this).children('a');
                                        a.addClass('ck_a');
                                        if(fields.indexOf(a.text())==-1){
                                            fields.push(a.text());
                                        }
                                    }
                                });
                            }
                        }
                    }
                }else if(event.ctrlKey){
                    $(this).addClass('ck_a');
                    drag.addFiled($(this),true);
                }else{
                    $('body').css("cursor", "default");
                    $('.dsii li a').each(function(){
                        $(this).removeClass('ck_a');
                    });
                    $(this).addClass('ck_a');
                    drag.permitDrag = false;
                    fields.length = 0; //清除之前的li whj
                    if(fields.indexOf($(this).text())==-1){
                        fields.push($(this).text());
                    }
                    $('#moveF').empty();
                    $('#moveF').hide();
                }
            }else{
                $('#moveF').empty();
                $('#moveF').hide();
            }
        });
        //监听鼠标按下事件，动态绑定要拖拽的节点（因为节点可能是动态添加的）
        $('.' + drag.class_name).on('mousedown', '.dsii li a', function(event){
            //获取到拖拽的原节点对象
            drag.old_elm = $(this);
            var b=true;
            var dsiLi=$(this).parent().parent().parent();
            var t=dsiLi.children('a').text();
            if(t!=dsinfo){
                fields=[];
                $('.dsii li a').each(function(){
                    $(this).removeClass('ck_a');
                });
            }
            //当在允许拖拽的节点上监听到点击事件，将标识设置为可以拖拽
            dsinfo = $(this).parent().parent().parent().children('a').text();
            if(null!=dsinfo){
                if(event.ctrlKey){
                    b=false;
                }else if(event.shiftKey){

                }else{
                    if(fields.indexOf($(this).text())==-1){
                        fields.push($(this).text());
                    }
                }
                /*var b=false;
                 $(drag.old_elm).parent().parent().children('li').each(function(){
                 if($(this).children('a').hasClass('ck_a')){
                 b=true;
                 return;
                 }
                 });*/
                if(b){
                    drag.permitDrag = true;
                    //执行开始拖拽的操作
                    drag.mousedown(event);
                    return false;
                }
            }
        });

        //监听鼠标移动
        $('.' + drag.pclass).mousemove(function(event){
            //判断拖拽标识是否为允许，否则不进行操作
            if(event.ctrlKey){
                return false;
            }
            if(drag.permitDrag) {
                //执行移动的操作
                $("body").css("cursor","move");
                drag.mousemove(event);
                return false;
            }
        });

        //监听鼠标放开
        $('.' + drag.pclass).mouseup(function(event){
            //判断拖拽标识是否为允许，否则不进行操作
            if(drag.permitDrag) {
                //拖拽结束后恢复标识到初始状态
                drag.permitDrag = false;
                //执行拖拽结束后的操作
                $('body').css("cursor", "default");
                drag.mouseup(event);
                return false;
            }else{
                $('#moveF').empty();
                $('#moveF').hide();
                fields=[];
                $('.dsii li a').each(function(){
                    $(this).removeClass('ck_a');
                });
            }
        });
    },
    addFiled:function(obj,b){
        var text=obj.text();
        if(fields.indexOf(text)==-1){
            fields.push(text);
        }else{
            obj.removeClass('ck_a');
            if(b){
                fields.splice(fields.indexOf(text),1);
            }
        }
    },
    //按下鼠标 执行的操作
    mousedown : function (event){
        //1.克隆临时节点，跟随鼠标进行移动
        drag.tmp_elm=$('#moveF');
        drag.tmp_elm.empty();
        var obj='';
        for(var i=0;i<fields.length;i++){ //添加移动框内容
            obj+='<img src="images/design/s3.png"><span>'+fields[i]+'</span><br>';
        }
        drag.tmp_elm.append(obj);
        //2.计算 节点 和 光标 的坐标
        drag._x = $(drag.old_elm).offset().left;
        drag._y = $(drag.old_elm).offset().top;
        var e = event || window.event;
        drag._left = e.pageX - drag._x;
        drag._top = e.pageY - drag._y;

        //3.修改克隆节点的坐标，实现跟随鼠标进行移动的效果
        /*$(drag.tmp_elm).css({
         'position' : 'absolute',
         'background-color' : '#FF8C69',
         'left' : drag._x,
         'top' : drag._y
         });*/
        //4.添加临时节点
        $('body').append(drag.tmp_elm);
    },

    //移动鼠标 执行的操作
    mousemove : function (event){
        //2.计算坐标
        var e = event || window.event;
        var x = e.pageX - drag._left;
        var y = e.pageY - drag._top;
        var maxL = $(document).width() - $(drag.tmp_elm).outerWidth();
        var maxT = $(document).height() - $(drag.tmp_elm).outerHeight();
        //不允许超出浏览器范围
        x = x < 0 ? 0: x;
        x = x > maxL ? maxL: x;
        y = y < 0 ? 0: y;
        y = y > maxT ? maxT: y;
        //3.修改克隆节点的坐标
        $(drag.tmp_elm).show().css({
            'position' : 'absolute',
            'background-color' : '#c5c5c5',
            'left' : e.pageX+1,
            'top' :e.pageY+1
        });

        //判断当前容器是否允许放置节点
        $.each($('.' + drag.pclass), function(index, value){

            //获取容器的坐标范围 (区域)
            var box_x = $(value).offset().left;     //容器左上角x坐标
            var box_y = $(value).offset().top;      //容器左上角y坐标
            var box_width = $(value).outerWidth();  //容器宽
            var box_height = $(value).outerHeight();//容器高

            //给可以放置的容器加背景色
            if(e.pageX > box_x && e.pageX < box_x-0+box_width && e.pageY > box_y && e.pageY < box_y-0+box_height){

                //判断是否不在原来的容器下（使用坐标进行判断：x、y任意一个坐标不等于原坐标，则表示不是原来的容器）
                if($(value).offset().left !== drag.old_elm.parent().offset().left
                    || $(value).offset().top !== drag.old_elm.parent().offset().top){

                    //$(value).css('background-color', '#FFEFD5');
                }
            }else{
                //恢复容器原背景色
                //$(value).css('background-color', '#FFFFF0');
            }
        });
    },
    //放开鼠标 执行的操作
    mouseup : function (event){
        $('#moveF').empty();
        $('#moveF').hide();
        $('.dsii li a').each(function(){
            $(this).removeClass('ck_a');
        });
        //移除临时节点
        if(event.ctrlKey){
            fields=[];
            return false;
        }
        //判断所在区域是否允许放置节点
        var e = event || window.event;
        $.each($('.' + drag.pclass), function(index, value){
            //获取容器的坐标范围 (区域)
            var box_x = $(value).offset().left;     //容器左上角x坐标
            var box_y = $(value).offset().top;      //容器左上角y坐标
            var box_width = $(value).outerWidth();  //容器宽
            var box_height = $(value).outerHeight();//容器高
            //判断放开鼠标位置是否想允许放置的容器范围内
            if(e.pageX > box_x && e.pageX < box_x-0+box_width && e.pageY > box_y && e.pageY < box_y-0+box_height){
                //判断是否不在原来的容器下（使用坐标进行判断：x、y任意一个坐标不等于原坐标，则表示不是原来的容器）
                if($(value).offset().left !== drag.old_elm.parent().offset().left
                    || $(value).offset().top !== drag.old_elm.parent().offset().top){
                    //向目标容器添加节点并删除原节点
                    //tmp = $(drag.old_elm).clone();
                    var text=$(drag.old_elm).text();
                    var dsName=$(drag.old_elm).attr("attr");
                    if(null!=dsinfo){
                        //var fields=new Array();
                        $(drag.old_elm).parent().parent().children('li').each(function(){
                            if($(this).children('a').hasClass('ck_a')){
                                var f=$(this).children('a').text();
                                //fields.push(f);
                            }
                        });
                        addCanvasField(dsinfo,fields,e.pageY-box_y-25,e.pageX-box_x);
                    }
                }
            }else{
            }
        });
        fields=[];
    }
};