function sort(json, order) {
    let info = JSON.stringify(json);
    DesignModule._orderTableRegion(ParamOperator.encodeStr(info), order);
    layer.closeAll();
}

function filterByText(json) {
    let info = JSON.stringify(json);
    DesignModule._filterTableRegionText(ParamOperator.encodeStr(info));
}

function openFilter(title) {
    layer.open({
        type: 2,
        area: ['500px', '300px'],
        closeBtn: 0,
        maxmin: false,
        title: ['自定义筛选方式', 'height:30px;line-height:30px'],
        content: ['numFilter.html', 'no'],
        btn: ['确定', '关闭'],
        resize: false,
        btnAlign: 'c',
        end: function () {

        },
        success: function (layero, i) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.init(title);
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let res = iframeWin.getRules();
            let info = JSON.stringify(res);
            DesignModule._filterTableRegionTextByExpr(ParamOperator.encodeStr(info));
            layer.closeAll();
        }
    });
}

function openStrFilter(title) {
    layer.open({
        type: 2,
        area: ['500px', '300px'],
        closeBtn: 0,
        maxmin: false,
        title: ['自定义筛选方式', 'height:30px;line-height:30px'],
        content: ['strFilter.html', 'no'],
        btn: ['确定', '关闭'],
        resize: false,
        btnAlign: 'c',
        end: function () {

        },
        success: function (layero, i) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            iframeWin.init(title);
        },
        yes: function (index, layero) {
            let iframeWin = window[layero.find('iframe')[0]['name']];
            let res = iframeWin.getRules();
            let info = JSON.stringify(res);
            DesignModule._filterTableRegionTextByExpr(ParamOperator.encodeStr(info));
            layer.closeAll();
        }
    });
}

function restore(info) {
    DesignModule._restoreShowAllRowsInTableRegion(ParamOperator.encodeStr(JSON.stringify(info)));
    layer.closeAll();
}