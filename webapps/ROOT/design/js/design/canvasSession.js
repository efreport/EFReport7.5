/**
 * 进行session操作
 * **/
//根据模板名，删除该模板的所有缓存DS
function removeTempDs(name) {
    let keys = new Array();
    let key = name + '@#';
    for (let i = 0; i < sessionStorage.length; i++) { //遍历sessionStorage
        let sKey = sessionStorage.key(i);
        if (sKey != null) {
            if (sKey.indexOf(key) != -1) {
                keys.push(sKey);
        }
        }
    }
    for (let j = 0; j < keys.length; j++) {
        window.sessionStorage.removeItem(keys[j]);
    }
}
//根据模板名，DS名来删除缓存
function removeTempByDS(name, ds) {
    let key = name + '@#' + ds;
    for (let i = 0; i < sessionStorage.length; i++) { //遍历sessionStorage
        let sKey = sessionStorage.key(i);
        if (key == sKey) {
            window.sessionStorage.removeItem(sKey);
            break;
        }
    }

}


//修改模板名时，根据旧模板名和新模板名来刷新缓存
function refreshByName(oldName, name) {
    let key = oldName + '@#'; //旧模板缓存
    let keys = new Array(); //删除的键列表
    for (let i = 0; i < sessionStorage.length; i++) { //遍历sessionStorage
        let sKey = sessionStorage.key(i);
        if (sKey != null) {
            if (sKey.indexOf(key) != -1) {
                keys.push(sKey);
                let sKeyArr = sKey.split('@#');
                let ds = sKeyArr[1];
                let newKey = name + '@#' + ds;
                sessionStorage.setItem(newKey, sessionStorage.getItem(sKey)); //更新缓存
            }
        }
    }
    //删除
    for (let j = 0; j < keys.length; j++) {
        window.sessionStorage.removeItem(keys[j]);
    }

}