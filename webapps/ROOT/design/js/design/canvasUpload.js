/**
 * 设计器处理填报信息
 * **/

//保存模板时，处理填报信息
function checkUploadInfo(){

    let uploadNameRepeat = canvasEvent.Upload.checkUploadNameRepeat();
    let controlNameRepeat = canvasEvent.Upload.checkControlNameRepeat();
    let addRowButtonCount = canvasEvent.Upload.checkAllAddRowButtonCount();
    let uploadCellSameChain = canvasEvent.Upload.checkUploadCellSameChain();
    if (uploadNameRepeat == '' && controlNameRepeat == '' && addRowButtonCount == '' && uploadCellSameChain == '') {
        return true;
    } else {
        if (uploadNameRepeat != '') {
            layer.msg('有重复的填报名,请修改!',{icon:2});
        } else if (controlNameRepeat != '') {
            layer.msg('有重复的控件名,请修改!',{icon:2});
        } else if (addRowButtonCount != '') {
            layer.msg('每个sheet上只能有一个增加行按钮,请修改!',{icon:2});
        } else if (uploadCellSameChain != '') {
            layer.msg('填报信息从表中存在单元格数据链交叉引用,请修改!',{icon:2});
        }
        return false;
    }
}
//保存模板前事件
function beforeSave(){
    //获取当前模板名字
    let temp = TempOperator.getCurrentTemp();
    let id = 0;
    //从模板信息Map中获取当前模板的id值
    for (let i = 0; i < iframeds.length; i++) {
        let curtmp = iframeds[i];
        if (curtmp.index == temp.index) {
            id = iframeds[i].id;
        }
    }
    //当id=0时，说明是新增模板，打开模板目录选择界面，指定存放的目录
    if (id == 0) {
        let index = layer.open({
            type: 2,
            area: ['350px', '480px'],
            closeBtn: 0,
            resize: false,
            title: ['选择模板保存目录', 'height:30px;line-height:30px'],
            content: [base + '/design/menu.jsp', 'no'],
            btn: ['确定', '关闭'],
            btnAlign: 'c',
            end: function () {

            },
            yes: function (index, layero) {
                let iframeWin = window[layero.find('iframe')[0]['name']];
                let menuId = iframeWin.getMenuId();
                if (menuId == '') {
                    efalert(layer, '请选择要保存的目录');
                } else {
                    let name = temp.name;
                    removeTempDs(name); //清除缓存中的DS whj
                    let t = TempOperator.removeTemp(temp.index);
                    let text = ParamOperator.decodeStrAndFree(t);
                    let obj = JSON.parse(text);
                    TempOperator.saveAndClose(obj.file, 0, temp, menuId);
                    getTree(tpltreeurl);
                    removeDs(temp.index);
                    hideInput();
                    layer.closeAll();
                }
            },
            success: function (layero, index) {
                let iframeWin = window[layero.find('iframe')[0]['name']];

            }
        });
    } else {

        //找到当前模板的树节点
        let curNode = treeObj.getNodeByParam("id", id, null);
        //当前模板的权限
        let authority = curNode.authority;
        //只读权限，不能保存
        if (authority == 'R') {
            efalert(layer, '没有保存的权限', 2);
            return false;
        }
        let name = temp.name;
        removeTempDs(name); //清除缓存中的DS whj
        TempOperator.saveTempl(0);
        let t = TempOperator.removeTemp(temp.index);
        removeDs(index);
    }


}