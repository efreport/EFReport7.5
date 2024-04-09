// 检查当前用户登录状态js
$(function(){
    // 每3秒钟执行一次
    window.setInterval(function() {
        let cur = window.location.href;  //获取当前页面的url
        if(cur.endsWith('home_index.html')){
            cur = cur.substr(0, cur.length - 16);
        }else if(cur.endsWith('preview.html')){
            cur = cur.substr(0, cur.length - 13);
        }
        // 获取当前用户的token
        let cur_token = window.sessionStorage.getItem("cur_token");
        if (cur_token === "") {
            // 当前访问页面没有找到token,所以当前页面登录失效了
            logout(cur);
        }
    }, 3000);


    // 每3分钟执行一次
    window.setInterval(function() {
        // 获取当前用户的token
        let cur = window.location.href;  //获取当前页面的url
        if(cur.endsWith('home_index.html')){
            cur = cur.substr(0, cur.length - 16);
        }else if(cur.endsWith('preview.html')){
            cur = cur.substr(0, cur.length - 13);
        }
        // 获取当前用户的token
        let cur_token = window.sessionStorage.getItem("cur_token");
        if (cur_token === "") {
            // 当前访问页面没有找到token,所以当前页面登录失效了
            logout(cur);
        }else{
            let server_base_url = window.sessionStorage.getItem("ef_server_base_url");
            jQuery.ajax({
                url: server_base_url + "/user/validatelogin",
                type: "POST",
                data: { curtoken: cur_token },
                success: function (resp) {
                    if (resp.state === "success") {
                        
                    } else {
                        logout(cur);
                    }
                },
                error: function () {
                    logout(cur);
                }
            });
        }
    }, 1000 * 3 * 60);
    
});

$(function(){
    let cur = window.location.href;  //获取当前页面的url
    if(cur.endsWith('home_index.html')){
        cur = cur.substr(0, cur.length - 16);
    }else if(cur.endsWith('preview.html')){
        cur = cur.substr(0, cur.length - 13);
    }
    // 获取当前用户的token
    let cur_token = window.sessionStorage.getItem("cur_token");
    if (cur_token === "") {
        // 当前访问页面没有找到token,所以当前页面登录失效了
        logout(cur);
    }else{
        let server_base_url = window.sessionStorage.getItem("ef_server_base_url");
        jQuery.ajax({
            url: server_base_url + "/user/validatelogin",
            type: "POST",
            data: { curtoken: cur_token },
            success: function (resp) {
                if (resp.state === "success") {
                    
                } else {
                    logout(cur);
                }
            },
            error: function () {
                logout(cur);
            }
        });
    }
})