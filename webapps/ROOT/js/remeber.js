// 保存Cookie
function saveInfo() {
    try {
        // 保存按键是否选中
        var isSave = document.getElementById('remember_password').checked;
        if (isSave) {
            var username = document.getElementById("account").value;
            var password = document.getElementById("password").value;
            if (username != "" && password != "") {
                SetCookie(username, password,1);
            }
        } else {
            SetCookie("", "");
        }

    } catch (e) {}
}

// 保存Cookie
function SetCookie(username, password,type) {
    if(type) {
        var Then = new Date();
        Then.setTime(Then.getTime() + 1866240000000);
        document.cookie = "username=" + username + "%%" + password + ";expires=" + Then.toGMTString();
    }else{
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

// 获取登陆的用户名和密码
function getCookie() {
    var nmpsd;
    var nm;
    var psd;
    var cookieString = new String(document.cookie);
    var cookieHeader = "username=";
    console.log(cookieString);
    var beginPosition = cookieString.indexOf(cookieHeader);
    cookieString = cookieString.substring(beginPosition);
    var ends = cookieString.indexOf(";");
    if (ends != -1) {
        cookieString = cookieString.substring(0, ends);
    }
    if (beginPosition > -1) {
        nmpsd = cookieString.substring(cookieHeader.length);
        if (nmpsd != "") {
            beginPosition = nmpsd.indexOf("%%");
            nm = nmpsd.substring(0, beginPosition);
            psd = nmpsd.substring(beginPosition + 2);
            document.getElementById("account").value=nm;
            document.getElementById("password").value=psd;
            if (nm != "" && psd != "") {
                document.getElementById('remember_password').checked = true;
                //login();
            }
        }
    }
}