function record() {
    let params = getParams();
    $.ajax({
        url: base + '/record/recordTemplate?templateId=' + id + '&pathId=' + pathId + '&params=' + encodeURIComponent(params) + '&token=' + token,
        type: 'post',
        success: function (data) {
            if (data.state == 'success') {
                layer.msg("记录成功");
            } else {
                layer.alert("记录失败,失败原因:" + data.message);
            }
        },
        error: function () {
            let url = base + "/login.jsp";
            window.location.href = url;
        }
    });
}

function viewRecord() {
    let index = layer.open({
        type: 2,
        area: ['1000px', '700px'],
        closeBtn: 0,
        resize: false,
        title: ['存档管理', 'height:36px;line-height:36px;background: #FCFCFC;'],
        content: base + '/viewRecord.html',
        btn: ['确定', '关闭'],
        btnAlign: 'c',
        end: function () {

        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            layer.closeAll();
        },
        success: function (layero, index) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.initTable(id, token, base);
        }
    });
}