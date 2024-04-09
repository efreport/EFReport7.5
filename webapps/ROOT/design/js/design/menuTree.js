//模板树JS
//初始化模板树
var disbleMap = []; //不可编辑的模板ID集合
var curId; //当前选中的模板ID
let treeData;
function initTree() {
    let setting = {
        view: {
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom,
            showIcon: showIconForTree,
            showLine: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        edit: {
            enable: true,
            removeTitle: "删除目录",
            renameTitle: "重命名目录",
            showRemoveBtn: showRemoveBtn,
            showRenameBtn: showRenameBtn
        },
        callback: {
            onClick: function (event, id, node) { //whj 点击左侧模板菜单时，加载模板
                $("#EFTextInputDiv").hide(); //光标跳到末尾
                if (node.isParent == false) { //模板结点
                    let id = node.id;
                    let name = node.name;
                    canvasEvent.Template.loadTemplate(id, name);
                    curNode = node;
                    if(node.isEdit != undefined){
                        if(node.isEdit == '0'){ //模板不可编辑
                            disbleMap.push(id);
                        }
                    }
                } else {
                    /* typeNode = node.id;*/
                    curNode = node;
                    curMenuName = node.name; //当前点击的目录名
                }
            },
            beforeRemove: function (treeId, treeNode) { //删除结点前触发事件
                let children = treeNode.children;
                if (children != undefined && children.length > 0) {
                    layer.msg('无法删除,该模板目录下有内容');
                    return false;
                } else {
                    let id = treeNode.id;
                    if(treeNode.isParent){ //删除目录
                        layer.confirm('确定删除模板类型?', {icon: 3, title:'提示'}, function(index){
                            $.ajax({
                                url: ip + '/templateType/delete?id=' + id + '&token=' + token,
                                type: 'get',
                                success: function (res) {
                                    if (res.state = 'success') {
                                        //手动删除目录结点,不触发回调函数
                                        treeObj.removeNode(treeNode , false);
                                        layer.msg(res.message,{time:1000} , function(){
                                            layer.closeAll()
                                        });
                                    } else {
                                        layer.msg(res.message);
                                    }
                                }
                            })
                        });
                    }
                    return false;
                }

            },
            beforeRename: function (event, id, node) { //重命名前触发事件
                return true;
            },
            onRemove: function (event, treeId, treeNode) { //删除结点事件

            },
            onRename: function (event, treeId, treeNode) { //重命名事件
                //未修改名称
                if(curNode != undefined){
                    if(curMenuName == treeNode.name){
                        return;
                    }
                }

                let parentNode = treeNode.getParentNode(); //获取父节点
                let pId = parentNode.id;
                let id = treeNode.id;
                if(!isChinese(treeNode.name)){
                    layer.alert("命名不符合规范!");
                    initTree();
                }else{
                    $.ajax({
                        url: ip + '/templateType/rename?id=' + id + '&name=' + treeNode.name + '&token=' + token + '&pId=' + pId ,
                        type: 'get',
                        success: function (res) {
                            if (res.state = 'success') {
                                layer.msg(res.message);
                            } else {
                                layer.msg(res.message);
                            }
                            initTree();

                        }
                    })
                }

            },
            beforeDrag: beforeDrag
        }
    };
    $.ajax({
        url: ip + '/designSys/getTemplateZTree?token=' + token,
        type: 'get',
        success: function (res) {
            treeObj = $.fn.zTree.init($("#tree"), setting, res);
            initTreeEvent();
        },
        error: function (res) {

        }
    })
}

function showRemoveBtn(treeId, treeNode) {

    let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
    if(production != 'true'){
        return false;
    }

    if(treeNode.isRoot != undefined){ //根目录无法删除
        if(treeNode.isRoot){
            return false;
        }else{
            return true;
        }
    }else{
        return treeNode.isParent && !treeNode.isShare;
    }
}

function showRenameBtn(treeId, treeNode) {

    let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
    if(production != 'true'){
        return false;
    }

    if(treeNode.isRoot != undefined){ //根目录无法重命名
        if(treeNode.isRoot){
            return false;
        }else{
            return true;
        }
    }else{
        return treeNode.isParent && !treeNode.isShare;
    }
}

function showIconForTree(treeId, treeNode) {
    return !treeNode.isParent;
}

//禁止拖拽
function beforeDrag(id, node){
    return false;
}

function addHoverDom(treeId, treeNode) {

    let production = window.sessionStorage.getItem("cur_production"); //是否允许保存
    if(production != 'true'){
        return false;
    }

    if (treeNode.isParent && !treeNode.isShare) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='新增目录' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn)
            btn.bind("click", function () {
                layer.open({
                    type: 2,
                    area: ['350px', '180px'],
                    closeBtn: 0,
                    resize: false,
                    title: ['新建模板类型', 'height:30px;line-height:30px'],
                    content: ['pages/menus/newTemp.html', 'no'],
                    btn: ['确定', '关闭'],
                    btnAlign: 'c',
                    end: function () {
                        // MainEditor.setCurSpreadSheetEnabled(1);
                    },
                    yes: function (index, layero) {
                        let iframeWin = window[layero.find('iframe')[0]['name']];
                        let name = iframeWin.getPage();
                        if (name == "") {
                            layer.msg('请输入模板类型名');
                            return false;
                        } else {
                            if(isChinese(name)){
                                $.ajax({
                                    url: ip + '/templateType/checkType?name=' + name + '&pId=' + treeNode.id + '&token=' + token,
                                    type: 'get',
                                    success: function (res) {
                                        if (res.state == 'success') {
                                            treeObj.addNodes(treeNode, {
                                                id: res.id,
                                                pId: treeNode.id,
                                                name: name,
                                                isParent: true
                                            });
                                            layer.msg(res.message , {time:1000} , function(){
                                                layer.close(index);
                                                initTree();
                                            });

                                        } else {
                                            layer.msg(res.message);
                                        }

                                    }
                                })
                            }else{
                                layer.alert('模板类型名称中有特殊字符!');
                                return false;
                            }

                        }

                    },
                    cancel: function () {

                    }

                });
                return false;
            });
    } else {
        return false;
    }
};

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};

function initTreeEvent() {
    //搜索模板
    $("#tempName").unbind().bind('keyup',function (e) {
        var code = e.keyCode;
        if (code == 13) {
            //清除关键字前后的空格
            var tempName = $.trim($("#tempName").val());
            if (treeObj) {
                if (tempName == "") { //清空搜索框时
                    var allNode = treeObj.getNodes();
                    initTree();
                } else {
                    var nodes = treeObj.getNodesByParamFuzzy("name", tempName, null); //在树中模糊查询
                    if (nodes.length == 0) {
                        //layer.alert("模板不存在!");
                        $("#tempName").blur();
                        layer.msg('模板不存在!', {
                            time: 1000, //1s后自动关闭
                            icon: 2
                        });
                    } else {
                        var allNode = treeObj.getNodes();
                        treeObj.hideNodes(allNode);
                        var showList = new Array();
                        var nodeList = new Array(); //当所有搜索的结点都不是末级结点时，需要重新显示所有数结点
                        $.each(nodes, function (index, element) {
                            if (!element.isParent) { //是末级结点
                                treeObj.showNode(element);
                                showParent(element, nodes, showList);
                            } else {
                                nodeList.push(element);
                            }
                        });
                        if (nodeList.length == nodes.length) {
                            layer.alert("模板不存在!");
                            var allNode = treeObj.getNodes();
                            treeObj.showNodes(allNode);
                            treeObj.expandAll(false);
                        } else {
                            treeObj.expandAll(true);
                        }
                    }
                }
            }

        }
    });
}


function showParent(treeNode, nodes, showList) { //递归显示所有父节点
    showList.push(treeNode.id);
    var parentNode = treeNode.getParentNode();
    if (parentNode == null) { //如果是根节点
        return;
    } else {
        if ($.inArray(parentNode.id, showList) != -1) {  //如果父节点已经显示
            treeObj.showNode(treeNode);//显示当前节点
        } else {
            showList.push(parentNode.id); //将父节点添加到显示结点列表
            treeObj.showNode(parentNode); //显示父节点
            treeObj.hideNodes(parentNode.children);//隐藏父节点的所有子节点
            treeObj.showNode(treeNode);//显示当前节点
            showParent(parentNode, null, showList); //遍历父亲结点
        }

    }
}