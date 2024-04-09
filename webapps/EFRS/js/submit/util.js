//noTip:是否不提示错误信息，被动情况下不用提示
function getJsonSub(url, type, data, func, noTip) {
    $.ajax({
        url: url,
        type: type,
        timeout: 5000,
        contentType: "application/json;charset=UTF-8",
        data: Util.isNull(data) ? "" : data,
        success: function (data) {
            if (data.code == 1) {
                if (func) {
                    func(data.text);
                }
            } else {
                if (!noTip) {
                    //layer.alert("操作失败:" + data.text, {icon: 2});
                    efalert(layer, "操作失败:" + data.text, 2);

                }
            }
        },
        complete: function (XMLHttpRequest, textStatus) {
            if (!noTip) {
                var st = XMLHttpRequest.getResponseHeader("sessionstatus");
                if (textStatus == 'timeout') {
                    //layer.alert("请求超时,请重试", {icon: 2});
                    efalert(layer, "请求超时,请重试", 2);
                } else {
                    reDirect(st);
                }
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
}

function randomUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}


function executeFunction(js) {
    if ('' != js && undefined != js) {
        try {
            var fun = new Function(js);
            return fun();
        } catch (e) {
            console.log("JS代码错误：" + js);
            return false;
        }
    }
}


function isNull(obj) {
    if (obj == null || obj == undefined || obj == '') {
        return true;
    }
    return false;
}

function Base64() {

    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    };

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    };

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

function bindRight(){
    $(document).off().on('contextmenu', function (event) {
        let clickedElement = event.target;
        let ele = $(clickedElement);
        if(ele.is('img')){
            let url = ele.attr('src');
            layer.open({
                type: 2,
                title: ['', 'height:1px;'],
                closeBtn: 2, //不显示关闭按钮
                shade: [0],
                area: ['500px', '500px'],
                anim: 2,
                content: 'bkImage.html',
                end: function () {

                },
                success: function (layero, index) {
                    let iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.init(url);
                },
                yes: function (index, layero) {

                }
            });
        }else{
            let type = ele.attr('class');
            let div = ele.parent();
            let td = div.parent();
            if (type != undefined && type == 'isImage') {
                let url = td.css('background-image');
                let newUrl = url.replace(/url\((['"])?(.*?)\1\)/gi, '$2').trim();
                layer.open({
                    type: 2,
                    title: ['', 'height:1px;'],
                    closeBtn: 2, //不显示关闭按钮
                    shade: [0],
                    area: ['500px', '500px'],
                    anim: 2,
                    content: 'bkImage.html',
                    end: function () {

                    },
                    success: function (layero, index) {
                        let iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.init(newUrl);
                    },
                    yes: function (index, layero) {

                    }
                });
            }
        }

        return false; //阻止右键菜单弹出
    });
}
