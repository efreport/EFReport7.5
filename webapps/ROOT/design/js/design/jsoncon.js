/**
 *json操作 弹出框
 **/
 var DataObjGetter = {

    //页面设置 弹出框 返回json字符串
    getPageSetupInfo: function () {
        var val = DesignModule._getPageSetupInfo();
        return ParamOperator.decodeStrAndFree(val);
    },

    //模板属性
    getCurSpreadSheetProperty: function () {
        var val = DesignModule._getCurSpreadSheetProperty();
        return ParamOperator.decodeStrAndFree(val);
    },
    //固定行列
    getFixedColRow: function () {
        var val = DesignModule._getFixedColRow();
        return ParamOperator.decodeStrAndFree(val);
    },
    //关联子表单  获取子报表JSON格式 {"unusedSheetNames":["sheet3","sheet4"],"subReportSheetNames": ["sheet2","sheet5"], "intervalScrollH":1000}
    subReportSheet: function () {
        var val = DesignModule._subReportSheet();
        return ParamOperator.decodeStrAndFree(val);
    },
    formSubReportSheet:function(){
        var val = DesignModule._formSubReportSheet();
        return ParamOperator.decodeStrAndFree(val);
    },
    //获取主表单区域联动信息JSON格式{  "allRegions":["E5","A2","D4"],"regions": ["E5","A2"],"params":"CATEGORY=A4;param1=CONTROLVALUE"}
    //allRegions全部的子报表区域，可为空
    //regions已经关联的联动区域,可为空
    getRegionInfo: function () {
        var val = DesignModule._getRegionInfo();
        return ParamOperator.decodeStrAndFree(val);
    },

    //获取选中单元格超级链接
    getSelCellHyperlink:function(){
        var val = DesignModule._getSelCellHyperlink();
        return ParamOperator.decodeStrAndFree(val);
    },

    getSelShapeHyperlink:function(){
        var val = DesignModule._getSelShapeHyperlink();
        return ParamOperator.decodeStrAndFree(val);
    },

    //条件属性
    getCondPropertysPtr:function(){
        var val = DesignModule._getCondPropertysPtr();
        return ParamOperator.decodeStrAndFree(val);
    },

    //取得填报信息
    uploadInfoList:function(){
        var val = DesignModule._uploadInfoList();
        return ParamOperator.decodeStrAndFree(val);
    },

    /*
     * 数据填报自动添加字段
     * JSON格式[
     * [{"fieldCellX":1,"fieldCellY":1,"fieldCell":"A1","fieldName":"t",fieldType":6}],
     * [{"fieldCellX":2,"fieldCellY":1,"fieldCell":"B1","fieldName":"t",fieldType":6}]
     * ]
     */
    getFieldCellChain:function(){
        var val=DesignModule._getFieldCellChain();
        return ParamOperator.decodeStrAndFree(val);
    },

    //取得填报信息
    dataCheckInfoList:function(){
        var val = DesignModule._dataCheckInfoList();
        return ParamOperator.decodeStrAndFree(val);
    },

    getReportParams:function(){
        var val = DesignModule._getReportParams();
        return ParamOperator.decodeStrAndFree(val);
    }

};

var DataObjSetter = {

    //页面设置 设置
    setPageSetupInfo: function (str) {
        return DesignModule._setPageSetupInfo(ParamOperator.encodeStr(str));
    },

    //模板属性
    setCurSpreadSheetProperty: function (str) {
        return DesignModule._setCurSpreadSheetProperty(ParamOperator.encodeStr(str));
    },

    //固定行列 int nFixColumnCount,int nFixRowCount,int nFixFootRowCount fixFootBeginRow
    setFixedColRow: function (a, b, c,d) {
        return DesignModule._setFixedColRow(a, b, c,d);
    },

    /*设置子报表JSON格式
     {"subReportSheetNames": ["sheet2","sheet5"],"intervalScrollH":1000}
     subReportSheetNames已经关联的子报表,可为空,
     intervalScrollH水平滚动时间ms
     */
    setSubReportSheet: function (str) {
        return DesignModule._setSubReportSheet(ParamOperator.encodeStr(str));
    },
    setFormSubReportSheet:function(str){
        return DesignModule._setFormSubReportSheet(ParamOperator.encodeStr(str));
    },

    /*设置主表单区域联动JSON格式
     {
     "regions": ["E5","A2"],
     "params":"CATEGORY=A4;param1=CONTROLVALUE"
     }
     regions已经关联的联动区域,可为空
     params参数
     */
    setRegionInfo: function (str) {
        return DesignModule._setRegionInfo(ParamOperator.encodeStr(str));
    },

    /**
     * 设置选中单元格超级链接
     * @param str
     *  OpterationType值说明:
     *  enumLinkOperateType{
            //无操作OpterationType_None,
            //模板跳转OpterationType_Templet, 1
            //网页链接跳转OpterationType_UrlLink, 2
        };
         WindowStyle值说明:
         enumLinkWindowType{
                //当前窗口打开Window_this=1,
                //新窗口Window_new, 2
            }
     json格式：
        [{
            "LinkName": "模板链接3",
            "OpterationType": 1,
            "Params": "P1 = B1",
            "SortNum": 2,
            "Templet": "123",
            "WindowStyle": 1
        },
         {
             "LinkName": "网页链接2",
             "OpterationType": 2,
             "SortNum": 1,
             "Url": "www.163.com",
             "WindowStyle": 2
         },
         {
             "LinkName": "网页链接1",
             "OpterationType": 2,
             "SortNum": 0,
             "Url": "www.baidu.com",
             "WindowStyle": 1
         }]
     */
    setSelCellHyperlink:function(str){
        return DesignModule._setSelCellHyperlink(ParamOperator.encodeStr(str));
    },

    //设置条件属性
    /*JSON格式
     {
         "CondPropertys": [{
         "CondStr": "",
         "Name": "属性1",
         "Items": [{
                     "BKColor": "#FFFFFF",
                     "BKColorType": 0,
                     "CondPropertyType": 4
                 },
                {
                     "CondPropertyType": 3,
                     "NewFont": {
                         "Bold": 0,
                         "Color": "#FFFFFF",
                         "Italic": 0,
                         "Name": "新宋体",
                         "Size": 9,
                         "Underline": 0
                     }
             },
             {
                 "CondPropertyType": 5,
                 "FrameColor": "#FFFFFF",
                 "FrameWidth": 0
             },
             {
                 "CondPropertyType": 1,
                 "NewRowHeight": 1
             },
             {
                 "CondPropertyType": 2,
                 "NewColWidth": 1
             },
             {
                 "CondPropertyType": 6,
                 "FirstStr": "",
                 "SecondStr": ""
             }]
         }]
     }
     */
    setCondPropertys:function(str){
        return DesignModule._setCondPropertys(ParamOperator.encodeStr(str));
    },

    /**设置填报信息
     *QJsonArray格式
        [{
            "ConnName": "demo",
            "DatabaseType": "SQLITE",
            "TableName": "员工信息",
            "UploadInfoName": "填报SQL语句1",
            "UploadItems": [{
                //"FieldCellX": 3,
                //"FieldCellY": 5,
                "fieldCell":'A1',
                "FieldName": "编码",
                //"FieldType": "String",
                "MainKey": false
            }]
        }]
     **/
    setUploadInfoList:function(str){
        return DesignModule._setUploadInfoList(ParamOperator.encodeStr(str));
    },

    setDataCheckInfoList:function(str){
        return DesignModule._setDataCheckInfoList(ParamOperator.encodeStr(str));
    },

    setReportParams:function(str){
        return DesignModule._setReportParams(ParamOperator.encodeStr(str));
    }

};