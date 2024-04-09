function getSqlMacroStr(){ //获取宏
    return canvasEvent.Template.getSqlMacroStr();
}

function replaceParamsStr(str){
    return canvasEvent.Template.replaceParamsStr(str);
}

function getParamsJsonStr(){
    return canvasEvent.Template.getParamsJsonStr();
}

function decodeCellChar2Pos(val){
    return canvasEvent.Util.decodeCellChar2Pos(val);
}

function cellPos2Char(x,y){
    return canvasEvent.Util.cellPos2Char(x,y);
}