function initDropDown() {
    layui.use('dropdown', function () {
        var dropdown = layui.dropdown;
        //增加行工具栏
        dropdown.render({
            elem: '#name',
            trigger: 'hover',
            data: [
                {
                    title: '修改密码',
                    id: 1
                },
                {
                    title: '退出登录',
                    id: 2
                }
            ],
            id: 'demo1',
            //菜单被点击的事件
            click: function (obj) {
                if (obj.id == 1) {

                    let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
                    if (production != 'true') {
                        layer.msg('演示环境不允许修改密码');
                        return;
                    }

                    let index = layer.open({
                        type: 2,
                        area: ['450px', '280px'],
                        closeBtn: 0,
                        title: ['修改密码', 'height:30px;line-height:30px'],
                        content: ['pages/menus/newPass.html', 'no'],
                        btn: ['确定', '关闭'],
                        btnAlign: 'c',
                        end: function () {

                        },
                        success: function (layero, index) {

                        },
                        yes: function (index, layero) {
                            let iframeWin = window[layero.find('iframe')[0]['name']];
                            let res = iframeWin.getPage();
                            if (res.state == 'success') {
                                pass = res.pass;
                                $.ajax({
                                    url: ip + '/user/pwd/resetPwd?token=' + token,
                                    type: 'post',
                                    data: {'pwd': pass},
                                    success: function (res) {
                                        if (res.code == 1) {
                                            layer.msg('修改成功,请重新登陆', {
                                                time: 1000 //2秒关闭（如果不配置，默认是3秒）
                                            }, function () {
                                                logout();
                                            });
                                            layer.close(index);
                                        } else {
                                            layer.alert(res.text);
                                        }
                                    },
                                    error: function () {

                                    }
                                })
                            } else {
                                layer.alert('两次输入的密码不一致');
                            }


                        }
                    });
                } else if (obj.id == 2) { //excel分页
                    logout();
                }
            }
        });
    })
    initThird();
}

function initUpload() {
    layui.use('upload', function () {//插入图片
        var upload = layui.upload;
        upload.render({ //允许上传的文件后缀
            elem: '#addImg'
            , url: ip + '/designSys/getJsonData?token=' + token
            , accept: 'images'
            , done: function (res) {
            }
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    var t = result.substr(result.indexOf('base64,') + 7, result.length);
                    canvasEvent.Cell.setSelCellBkPic(t);
                    let a = canvasEvent.Cell.isSelCellAdaptImageSize();
                    var b = canvasEvent.Cell.isSelCellRawImageScale();
                    $("#imgsf").prop("checked", a == 1 ? true : false);
                    $("#imgkeep").prop("checked", b == 1 ? true : false);
                    if (a) {
                        $("#imgkeep").removeAttr('disabled');
                    }
                });
            }
        });
    });
    layui.use('upload', function () {//插入图片
        var upload = layui.upload;
        upload.render({ //允许上传的文件后缀
            elem: '#addShapeImage'
            , url: ip + '/designSys/getJsonData?token=' + token
            , accept: 'images'
            , done: function (res) {
            }
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    var t = result.substr(result.indexOf('base64,') + 7, result.length);
                    canvasEvent.Shape.setSelShapeBKPic(t);
                    $('#shapeMenu').hide();
                    $('#contextMenu6').hide();
                    $('#contextMenu7').hide();
                });
            }
        });
    });
    layui.use('upload', function () {//插入图片
        var upload = layui.upload;
        upload.render({ //允许上传的文件后缀
            elem: '#addPicture'
            , url: ip + '/designSys/getJsonData'
            , accept: 'images'
            , done: function (res) {
            }
            , before: function (obj) {
                obj.preview(function (index, file, result) {
                    var t = result.substr(result.indexOf('base64,') + 7, result.length);
                    canvasEvent.Shape.setSelShapeBKPic(t);
                    $('#shapeMenu').hide();
                    $('#contextMenu6').hide();
                    $('#contextMenu7').hide();
                });
            }
        });
    });
    layui.use('upload', function () {
        $("#mask").hide();
        let upload = layui.upload;
        upload.render({
            elem: '#saveCell'
            , url: ip + '/designSys/getJsonData?token=' + token
            , accept: 'file'
            , done: function (res) {
            }
            , before: function (obj) {
                /* $("#importTempl").parent().parent().hide();*/
                let files = obj.pushFile();
                obj.preview(function (index, file, result) { //得到文件base64编码，比如图片
                    let ts = result.indexOf('base64,') + 7;
                    let tt = result.substr(ts, result.length);
                    let str = new Base64().decode(tt);
                    DesignModule._setCellsTextByJson(encodeStr(str), true);
                });
            }
        });
    });
    layui.use('upload', function () {
        $("#mask").hide();
        let upload = layui.upload;
        upload.render({
            elem: '#importTempl'
            , url: ip + '/designSys/getJsonData?token=' + token
            , accept: 'file'
            , exts: 'cel'
            , done: function (res) {
            }
            , before: function (obj) {
                /* $("#importTempl").parent().parent().hide();*/
                let files = obj.pushFile();
                obj.preview(function (index, file, result) { //得到文件base64编码，比如图片
                    let ts = result.indexOf('base64,') + 7;
                    let tt = result.substr(ts, result.length);
                    let str = new Base64().decode(tt);
                    let name = file.name.substr(0, file.name.indexOf('.cel'));

                    $.ajax({
                        url: ip + "/designSys/checkTempName?token=" + token + "&name=" + name + "&id=0",
                        type: 'get',
                        success: function (res) {
                            if (res.state == 'success') {
                                var b = canvasEvent.Template.checkOpenTempName(name);
                                if (!b) {
                                    //打开模板
                                    //DesignModule._restoreFromJsonStream(encodeStr(str));
                                    let index = canvasEvent.Template.loadExistTemplate(name, str);
                                    let celJson = JSON.parse(str);
                                    let ds = celJson.DSArray;
                                    //此时会执行tabChange方法里面的initDs方法
                                    //初始化数据集
                                    //initDs(ds);
                                    layer.close(index);
                                } else {
                                    layer.msg("模板名称已经存在", {time: 1000});
                                }

                            } else {
                                layer.msg(res.message);
                            }
                        },
                        error: function () {
                        }
                    })

                });
            }
        });
    });
    layui.use('upload', function () {
        $("#mask").hide();
        let upload = layui.upload;
        upload.render({
            elem: '#importExcel'
            , url: ip + '/designSys/getJsonData?token=' + token
            , accept: 'file'
            , exts: 'xlsx'
            , done: function (res) {
            }
            , before: function (obj) {
                obj.preview(function (index, file, result) { //得到文件base64编码，比如图片
                    let ts = result.indexOf('base64,') + 7;
                    let t = result.substr(ts, result.length);
                    let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
                    let name = file.name.substr(0, file.name.lastIndexOf('.'));
                    if (-1 == templateIndex) {
                        let ts = canvasEvent.Template.importXlsxByName(name, t);
                    } else {
                        canvasEvent.Template.importXlsxStream(t);
                    }
                });
            }
        });
    });

    layui.use('upload', function () {
        $("#mask").hide();
        let upload = layui.upload;
        upload.render({
            elem: '#saveCell', url: ip + '/designSys/getJsonData?token=' + token, accept: 'file', done: function (res) {
            }, before: function (obj) {
                /* $("#importTempl").parent().parent().hide();*/
                let files = obj.pushFile();
                obj.preview(function (index, file, result) { //得到文件base64编码，比如图片
                    let ts = result.indexOf('base64,') + 7;
                    let tt = result.substr(ts, result.length);
                    let str = new Base64().decode(tt);
                    DesignModule._setCellsTextByJson_test(encodeStr(str), true);
                });
            }
        });
    });

    layui.use('upload', function () {
        $("#mask").hide();
        let upload = layui.upload;
        upload.render({
            elem: '#saveCellNS',
            url: ip + '/designSys/getJsonData?token=' + token,
            accept: 'file',
            done: function (res) {
            },
            before: function (obj) {
                /* $("#importTempl").parent().parent().hide();*/
                let files = obj.pushFile();
                obj.preview(function (index, file, result) { //得到文件base64编码，比如图片
                    let ts = result.indexOf('base64,') + 7;
                    let tt = result.substr(ts, result.length);
                    let str = new Base64().decode(tt);
                    DesignModule._setCellsTextByJsonMultiSheet_NS(encodeStr(str));
                });
            }
        });
    });

    layui.use('upload', function () {
        $("#mask").hide();
        let upload = layui.upload;
        upload.render({
            elem: '#saveCellZZTZ',
            url: ip + '/designSys/getJsonData?token=' + token,
            accept: 'file',
            done: function (res) {
            },
            before: function (obj) {
                /* $("#importTempl").parent().parent().hide();*/
                let files = obj.pushFile();
                obj.preview(function (index, file, result) { //得到文件base64编码，比如图片
                    let ts = result.indexOf('base64,') + 7;
                    let tt = result.substr(ts, result.length);
                    let str = new Base64().decode(tt);
                    DesignModule._setCellsTextByJsonMultiSheet_ZZTZJT(encodeStr(str));
                });
            }
        });
    });
}

function processToken() {
    ip = window.sessionStorage.getItem("ef_server_base_url"); //获取前端地址
    token = window.sessionStorage.getItem("cur_token"); //获取token
    base = window.sessionStorage.getItem("base");

    if (token == undefined || token == null) { //没有token
        let urlInfo = window.location.href;  //获取当前页面的url
        let len = urlInfo.split("?");//切割URL
        let base = len[0];
        base = base.substr(0, base.length - 19);
        let param = len[1];//取出参数字符串 这里会获得类似“id=1”这样的字符串
        if(param == undefined){
            logout(base);
        }else{
            let params = param.split("&");//对获得的参数字符串按照“=”进行分割
            for (let i = 0; i < params.length; i++) {
                let par = params[i];
                let kav = par.split("=");
                let key = kav[0];
                if (key == "id") {
                    id = kav[1]
                }
                if (key == "templateId") {
                    templateId = kav[1];
                }
                if (key == "token") {
                    token = par.substr(6, par.length - 6);
                }
                if (token == undefined || token == null) { //非第三方接口访问
                    logout();
                } else { //第三方接口通过token访问
                    $.ajaxSettings.async = false;
                    $.ajax({
                        url: base + '/api/config.json',
                        type: 'get',
                        success: function (res) {
                            let server_base_url = res.server_base_url;
                            if (server_base_url !== "") {
                                ip = server_base_url;
                                window.sessionStorage.setItem("ef_server_base_url", server_base_url);
                            }
                        },
                        error: function () {
                        }
                    });
                    $.ajaxSettings.async = true;
                }
            }
        }

    }else {
        let urlInfo1 = window.location.href;  //获取当前页面的url
        let len = urlInfo1.split("?");//切割URL
        let base = len[0];
        base = base.substr(0, base.length - 19);
        if(len[1] != undefined){
            let param = len[1];//取出参数字符串 这里会获得类似“id=1”这样的字符串
            let params = param.split("&");//对获得的参数字符串按照“=”进行分割
            for (let i = 0; i < params.length; i++) {
                let par = params[i];
                let kav = par.split("=");
                let key = kav[0];
                if (key == "templateId") {
                    templateId = kav[1];
                }
                if (key == "token") {
                    token = par.substr(6, par.length - 6);
                    window.sessionStorage.setItem("cur_token" , token);

                }
            }
        }

    }
}

function initSystem(){
    $.ajax({
        url: ip + '/designSys/getDesignInfo?token=' + token,
        type: 'get',
        success: function (res) {
            if (res.state === "success") {
                window.sessionStorage.setItem("cur_production", res.production);
                isProduction = res.production;
                window.sessionStorage.setItem("cur_token" , token);
                if (!res.showTestTool) {
                    $('#testTool').hide();
                }
                $('.name').text(res.user);
            }else{
                logout();
            }
        },
        error: function (res) {
        }
    })

    let efurl_oem = ip + "/oem/get";
    $.ajax({
        url: efurl_oem,
        type: 'get',
        success: function (res) {
            $("title").html(res.name);
            window.sessionStorage.setItem("isshowpcleftmenu", res.isshowpcleftmenu);
            window.sessionStorage.setItem("isshowico", res.isshowico);
            window.sessionStorage.setItem("sysname", res.name);
            sysname = res.name;

            if (res.isshowico === 1) {
                $("#iconLink").attr("href", ip+"/oem/favicon.ico?tt=" + new Date().getTime());
            }else {
                $("#iconLink").attr("href", "data:;base64,=");
            }

        },
        error: function () {
        }
    });
}

function initThird(){
    $('.nav-con').hover(function(){
        $(this).find('.third-nav').show();
    },function(){
        $(this).find('.third-nav').hide();
    })
}

