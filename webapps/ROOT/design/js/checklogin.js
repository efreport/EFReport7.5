// 检查当前用户登录状态js
$(function(){
    // 每3秒钟执行一次
    window.setInterval(function() {
        // 获取当前用户的token
        let cur_token = window.sessionStorage.getItem("cur_token");
        if (cur_token === "") {
            // 当前访问页面没有找到token,所以当前页面登录失效了
            window.location.href="login.html";
        }
    }, 3000);


    // 每3分钟执行一次
    window.setInterval(function() {
        // 获取当前用户的token
        let cur_token = window.sessionStorage.getItem("cur_token");
        if (cur_token === "") {
            // 当前访问页面没有找到token,所以当前页面登录失效了
            window.location.href="login.html";
        }else{
            let server_base_url = window.sessionStorage.getItem("ef_server_base_url");
            jQuery.ajax({
                url: server_base_url + "/user/validatelogin",
                type: "POST",
                data: { curtoken: cur_token },
                success: function (resp) {
                    if (resp.state === "success") {
                        
                    } else {
                        window.alert("无权限访问，请重新登录！");
                        window.location.href="/login.html";
                    }
                },
                error: function () {
                    var url = '/login.html';
                    window.location.href = url;
                }
            });
        }
    }, 1000 * 3 * 60);
    
});

$(function(){
    // debugger;
    let cur_token = window.sessionStorage.getItem("cur_token");
    if (cur_token === "") {
        // 当前访问页面没有找到token,所以当前页面登录失效了
        window.location.href="login.html";
    }else{
        let server_base_url = window.sessionStorage.getItem("ef_server_base_url");
        jQuery.ajax({
            url: server_base_url + "/user/validatelogin",
            type: "POST",
            data: { curtoken: cur_token },
            success: function (resp) {
                // console.log("验证后----resp--->", resp);
                if (resp.state === "success") {
                    
                } else {
                    // window.alert(resp.message);
                    window.location.href="/login.html";
                }
            },
            error: function () {
                var url = '/login.html';
                window.location.href = url;
            }
        });
    }
})