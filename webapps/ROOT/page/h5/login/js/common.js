// JavaScript Document
$(document).ready(function(e) {
	var mobile = Zepto.os.phone || Zepto.os.tablet;
    //pageloading
	/*var pageLoading;
	$('.loading').height($(window).height() * 1.2);
	$('a:not(.no_loading)').each(function(){
		$(this).click(function(){
			if($(this).attr('href') !== '#'){
				var href = $(this).attr('href')
				$('body').addClass('page_loading');
				setTimeout(function(){
					$('body').removeClass('page_loading');
				},10000);

				setTimeout(function(){
					window.location.href = href;
				},500);

				setTimeout(function(){
					if(pageLoading = 1){
						$('body').removeClass('page_loading');
						pageLoading = 0;
					}
				},1000);
				
				pageLoading = 1;
				
				return false;
			}
		})
	});
	setTimeout(function(){
		$('.page_loading').removeClass('page_loading');
	},500);*/

	/*scrolltotop*/
	var ScrolltoTop = $(".to_top");
	$(window).scroll(function() {
		if ($(window).scrollTop() < 100) {
			ScrolltoTop.fadeOut();
		}else if(ScrolltoTop.css("display")=="none"){
			ScrolltoTop.fadeIn();
		}
	});
	/*zepto scroll采用插件*/
	ScrolltoTop.on(mobile?"tap":"click",function(){
		$.scrollTo({
			endY: 0,
			duration: 300,
			callback: function() {
			}
		});
	});


	
	/*定义body_wrap的最小高度*/
	var screen_h = $(window).height();
	$(".body_wrap").css("min-height",screen_h);

	/*footer*/
	$(".footer ul li").on(mobile?"tap":"click",function(){
		if(!$(this).hasClass("active")){
			$(this).addClass("active").siblings().removeClass("active");
		}else{
			return false;
		}	
	});

	/*计算footer的宽度*/

	var fot_len = $(".footer ul li").length;
	var per_w = Math.floor(640/fot_len);

	$(".footer ul li").width(per_w);

	/*详情页logo位置*/
	var wrap_h = $(".brand_shop .logo_wrap").height();
	var logo_imgh = $(".brand_shop .logo_wrap img").height();
	$(".brand_shop .logo_wrap img").css("margin-top",Math.floor((wrap_h-logo_imgh)/2));

});