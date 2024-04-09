let oGdsArray = [];
//初始化通用数据集
function initGDs(data) {
    let templateDs = [];
    let dul = $(".dsval ul"); //数据集ul容器
    let li = dul.children('.dsi');
    if(li.length == 0){ //模板数据集不存在
        $("#cellds").empty();
        $('#dscol').empty();
        $("#cellds").append('<option value=""></option>'); //数据单元格中的数据集
        $("#d_ds").empty();//数据单元格中的数据字典
        $("#d_ds").append('<option value=""></option>');
    }else{ //需要判断模板数据集中是否包含与通用数据集同名的DS
       /* $.each(li , function(i,e){
            let dsLi = $(e);
            let dsName = dsLi.children('a').text();
            templateDs.push(dsName);
        });*/
    }

    let gul = $(".gsval ul"); //数据集ul容器
    gul.empty();//清空数据集
    for (let i = 0; i < data.length; i++) { //遍历数据集信息
        let item = data[i];
        let dsName = item.DSName;  //数据集名称
        dsArray.push(dsName);
        if ($.inArray(dsName, gdsArray) != -1) { //通用数据集
            gul.append("<li class='dsi'><a><img src='" + closeIcon + "' style='margin-right:-3px'>" + dsName + "</a></li>");
            //给每个li绑定上数据集数据
            let li = gul.children("li:last-child");
            li.data("ds", item);
            if ($('#cellds').find('option[value="'+ dsName +'"]').length == 0){
                $("#cellds").append('<option value="' + dsName + '">' + dsName + '</option>');
                $("#cellds").children("option:last-child").data("ds", item);
                $("#d_ds").append('<option value="' + dsName + '">' + dsName + '</option>');
                $("#d_ds").children("option:last-child").data("ds", item);
            }
        }else{ //模板数据集中有与通用数据集同名的DS
            //layer.msg('添加失败，模板已有数据集:' + dsName);
        }
    }
    canvasEvent.Template.addDataSourceArray(JSON.stringify(data));
    let dsLis = $('.gsval').find(".dsi");
    $.each(dsLis, function (index, ele) { //加载列
        if (index == dsLis.length - 1) { //最后一个DS
            loadGColumns($(ele), true);
        } else {
            loadGColumns($(ele), false);
        }
    })

    //单击ds时，赋予样式
    $('.gsval').find(".dsi").children("a").click(function () {
        $('.gsval').find(".dsi").children('a').removeClass('ico_check');
        $(this).addClass('ico_check');
        dsinfo = dsName;
    });

    //双击ds时，隐藏或者显示ds
    $('.gsval').find(".dsi").children("a").find('img').bind('click', function (event) {
        let ul = $(this).parent().parent().find('ul'); //字段显示列表
        //字段可见
        if (ul.css("display") != 'none') {
            ul.hide();
            $(this).attr('src', closeIcon);
        } else { //字段不可见
            ul.show();
            $(this).attr('src', openIcon);
        }
    });
    let dsss = $('.gsval').find('dsi').eq(0);
    dsss.children('a').addClass('ico_check');
}

//根据ds信息加载列
function loadGColumns(obj, flag) {  //ds点击事件
    let li = obj;
    let dsName = li.find('a').text();
    var cls = 'li_ds_' + dsName;
    dsinfo = dsName;
    li.attr('isds', 1);
    li.addClass(cls);
    let reqParams = [];
    let item = li.data("ds"); //li对应的ds数据信息
    let templateName = canvasEvent.Template.getCurrentTemplateName(); //模板名
    let sql = item.SqlStr;
    let hong = canvasEvent.Template.getSqlMacroStr(); //获取模板的宏
    if (hong != undefined && hong != '') { //替换宏
        let hongJ = JSON.parse(hong);
        for (let i in hongJ) {
            let key = i;
            while (sql.indexOf(i) != -1) {
                sql = sql.replace(i, hongJ[i]);
            }
        }
    }
    let param = {
        sqlStr: canvasEvent.Template.replaceParamsStr(sql), //替换SQL中的参数
        dSName: item.DSName,
        connName: item.ConnName,
        tmp: templateName,
        refrence: item.refrence
    };
    reqParams.push(param);
    let templateParams = canvasEvent.Template.getParamsJsonStr();
    if (templateParams != "{}") { //参数为空
        let paramJson = JSON.parse(templateParams);
        //遍历请求的DS数据
        $.each(reqParams, function (index, reqParam) {
            reqParam.params = paramJson; //将参数添加到请求的ds数据中
        })
    }
    li.append('<div style="padding-left:10px">加载中...</div>'); //添加加载中信息
    let error = '';
    //加密请求信息
    let paramStr = JSON.stringify(reqParams);
    //+是特殊符号，加密时会被干掉，需要做特殊替换
    paramStr = paramStr.replace(/\+/g, "%2B");
    let postParam = encodeURI(paramStr);
    postParam = encodeBase64(postParam);

    let designId = 0;
    //打开的是子设计器的模板
    if (curNode != undefined && curNode.designId != undefined) {
        designId = curNode.designId;
    }
    //请求DS信息
    $.ajax({
        url: ip + "/designSys/getDsInfo?token=" + token + '&designId=' + designId,
        type: 'post',
        dataType: "json",
        timeout: 5000,
        data: {dsInfo: postParam},
        success: function (res) {
            if (res.code == 1) {
                let arr = JSON.parse(res.text); //返回的列名
                if (arr != null) {
                    $.each(arr, function (j, a) {
                        let name = li.children('a').text(); //dsName;
                        let refrence = DesignModule._getFieldReferenceStr();//获取参照字符串
                        refrence = decodeStrAndFree(refrence);//解码参数
                        let refJson = {};
                        if (refrence != "") { //参照字符串，优于共享数据集的对照
                            refJson = JSON.parse(refrence);
                        }
                        if (param.refrence != "" && param.refrence != undefined) { //共享数据集对照
                            let refre = {};
                            refre[name] = JSON.parse(param.refrence);
                            DesignModule._setFieldReferenceStr(encodeStr(JSON.stringify(refre))); //将共享数据集的对照关系设置到模板中
                            refJson = refre;
                        }
                        if (name == a.name) {
                            let ref = refJson[name]; //当前ds下的中英文对照
                            let ul = "<ul class='dsii' style='margin-top:-5px'>";
                            let dd = a.data;
                            let value = [];
                            if (dd) {
                                li.children('div').remove();
                                $.each(dd, function (jj, b) {
                                    value.push(b);
                                    if (ref != undefined && ref[b] != undefined && ref[b] != "") {
                                        ul += "<li name='" + b + "'><a attr='" + name + "'><img src='" + dsIcon + "' style='margin-right:3px'>" + b + "(" + ref[b] + ")" + "</a></li>";
                                    } else {
                                        ul += "<li name='" + b + "'><a attr='" + name + "'><img src='" + dsIcon + "' style='margin-right:3px'>" + b + "</a></li>";
                                    }
                                });
                                ul += "</ul>";
                                li.append(ul);
                                dsMap[curTemplateIndex + '@#' + a.name] = value; //将ds对象缓存到前端缓存中 报表名+ds名
                            } else {
                                li.children('div').text('无');
                                error += name + ",";
                            }
                        } else {
                            li.children('div').text('无');
                        }


                    });
                }
                drag.init(cls, 'canvas');
            } else {
                li.children('div').text('无');
                error = res.text;
            }
        },
        complete: function (XMLHttpRequest, textStatus) {
            li.children('div').text('无');
        }
    });
    obj.find("img").attr('src', openIcon); //数据集展开图标
    if (flag) {
        obj.find('a').addClass("ico_check");
    }

}

//初始化ds工具栏事件
function initGDsEvents() {
    initGdsData();
    //增加通用ds
    $("div[attr=addGDs]").unbind('click').bind('click', function () {
        let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex(); //获取模板在设计器中的索引
        let isNewTemplate = false; //是否新增模板
        $.each(templateMap, function (i, e) {
            if (e.index == templateIndex) { //新增未保存模板，id为0
                let id = e.templateId;
                if (id == 0) {
                    isNewTemplate = true;
                }
            }
        });
        //打开新增ds编辑页面
        var index = layer.open({
            type: 2,
            area: ['895px', '644px'],
            closeBtn: 0,
            maxmin: true,
            title: ["通用数据集", 'height:30px;line-height:30px'],
            content: ['pages/menus/chooseDs.html', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {
            },
            success: function (layero, index) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                let gul = $(".gsval ul"); //数据集ul容器
                let li = gul.find('.dsi');
                oGdsArray = [];
                $.each(li , function(i,e){
                    let dsName = $(e).children('a').text();
                    oGdsArray.push(dsName); //记录之前的通用数据集
                })
                iframeWin.init(oGdsArray);
            },
            yes: function (index, layero) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                let ds = iframeWin.getDs();
                $.each(oGdsArray , function(i,e){
                    canvasEvent.Template.removeDataSource(e); //删除模板中的数据集
                })
                initGDs(ds);
                layer.closeAll();
            }
        });
        /* }*/
    });

    //删除DS
    $("div[attr=removeGDs]").unbind('click').bind('click', function () {
        let dsName = $('.gsval').find('.ico_check')[0].text;
        layer.confirm('确定删除：' + dsName, {icon: 3, title: '提示'}, function (index) {
            let ds = canvasEvent.Template.dataSourceArray(); //获取模板所有数据集
            let dsJson = JSON.parse(ds);
            let newDs = [];
            let curDs = {};
            //遍历生成删除当前ds后的新ds
            $.each(dsJson, function (i, e) {
                if (e.DSName != dsName) {
                    newDs.push(e);
                }
            })
            $('.gsval').find('.ico_check').parent().remove(); //删除当前数据集区域
            canvasEvent.Template.removeDataSource(dsName); //删除模板中的数据集
            let templateIndex = canvasEvent.Template.getCurrentSpreadSheetIndex();
            delete dsMap[templateIndex + '@#' + dsName]; //删除缓存中的数据
            //清空数据单元格中的数据集
            $('#cellds').find('option[value="' + dsName + '"]').remove();
            layer.close(index);
        });
    });

    $("div[attr=refreshGDs]").unbind('click').bind('click', function () {
        let ds = canvasEvent.Template.dataSourceArray(); //获取模板所有数据集
        let dsJson = JSON.parse(ds);
        //重新生成
        initGDs(dsJson);
    });

    $("#gdsName").keyup(function (e) {
        var code = e.keyCode;
        if (code == 13) {
            //清除关键字前后的空格
            let dsName = $.trim($("#gdsName").val());
            if (dsName == "") { //清空搜索框时
                $('.dsi').show(); //显示所有ds
            } else {
                let dss = $('.gsval').find('ul').find('.dsi');
                let dsIndex = 0;
                $.each(dss, function (index, element) {
                    let a = $(element).children('a');
                    let text = a.text();
                    //包含搜索关键字
                    if (text.indexOf(dsName) != -1) {
                        $(element).show();
                        dsIndex = dsIndex + 1;
                    } else {
                        let ulShowFlag = false;
                        let dsii = $(element).children('.dsii');
                        //找到字段名
                        let li = dsii.children('li');
                        $.each(li, function (i, e) {
                            let liO = $(e);
                            if (liO.text().indexOf(dsName) != -1) {
                                ulShowFlag = true;
                            }
                        })
                        if (ulShowFlag) {
                            dsIndex = dsIndex + 1;
                            $(element).show();
                        } else {
                            $(element).hide();
                        }
                    }
                })

                if (dsIndex == 0) {
                    dss.show();
                    layer.alert('未找到对应的数据集!');
                }

            }
        }


    });


}

function initGdsData(){
    let url = ip + "/ds/list?token=" + token;
    $.ajax({
        url: url,
        type: "get",
        timeout: 5000,
        contentType: "application/json;charset=UTF-8",
        success: function (data) {
            if (data.state === "success") {
                $("#ds").empty();
                let dss = data.data;
                gdsArray = [];
                $.each(dss, function (i, e) {
                    gdsArray.push(e.dsName);
                });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}




