/**
 * 画布所有事件
 * */
let canvasEvent = {

    setLogicalZoom: function (height) {
        DesignModule._setLogicalZoom(height)
    },
    Sheet: {
        //当前选中sheet类型
        currSheetType: function () {
            return DesignModule._currSheetType();
        },
        //获取当前sheet
        getCurrentSheet: function () {
            return DesignModule._getCurrentSheet();
        },
        //页面设置 设置
        setSheetPageSetting: function (str) {
            return DesignModule._setPageSetupInfo(encodeStr(str));
        },
        //页面设置 弹出框 返回json字符串
        getSheetPageSetting: function () {
            let val = DesignModule._getPageSetupInfo();
            return decodeStrAndFree(val);
        },
        setFixedColRow: function (a, b, c, d) {
            return DesignModule._setFixedColRow(a, b, c, d);
        },
        getFixedColRow: function () {
            let val = DesignModule._getFixedColRow();
            return decodeStrAndFree(val);
        },
        setCurrentSheetName: function (val) {
            return DesignModule._setCurrentSheetName(encodeStr(val));
        },
        getCurrentSheetName: function (val) {
            return decodeStrAndFree(DesignModule._getCurrentSheetName());
        }

    },
    Template: {
        //获取所有打开模板的名称
        getAllSpreadSheetNames: function () {
            return decodeStrAndFree(DesignModule._getAllSpreadSheetName());
        },
        isChanged: function () { //模板是否修改
            return DesignModule._isChanged();
        },
        //获取当前打开模板的索引
        getCurrentSpreadSheetIndex: function () {
            return DesignModule._getCurrentSpreadSheetIndex();
        },
        //获取当前打开模板的名字
        getCurrentTemplateName: function () {
            let index = DesignModule._getCurrentSpreadSheetIndex(); //获取打开的模板索引
            let templateName = '';
            $.each(templateMap, function (i, e) {
                if (e.index == index) {
                    templateName = e.templateName;
                }
            })
            return templateName;
        },
        //获取当前打开模板的名字
        getCurrentTemplateID: function () {
            let index = DesignModule._getCurrentSpreadSheetIndex(); //获取打开的模板索引
            let templateId = '';
            $.each(templateMap, function (i, e) {
                if (e.index == index) {
                    templateId = e.templateId;
                }
            })
            return templateId;
        },
        //根据模板索引值获取模板的ID值
        getTemplateIdByIndex: function (index) {
            let templateId;
            $.each(templateMap, function (i, e) {
                if (e.index == index) {
                    templateId = e.templateId;
                }
            })
            return templateId;
        },
        //模板是否改变
        isChanged: function () {
            return DesignModule._isChanged();
        },
        //根据索引关闭模板
        removeSpreadSheet: function (index) {
            return DesignModule._removeSpreadSheet(index)
        },
        //根据模板ID加载模板
        loadTemplate: function (id, name) {
            $.ajax({
                url: ip + "/designSys/loadCel?templateId=" + id + "&token=" + token,
                type: 'get',
                success: function (res) {
                    let templateName = encodeStr(name);
                    let templateContent = encodeStr(JSON.stringify(res));
                    let t = DesignModule._addSpreadSheet(templateName, templateContent); //模板在设计器的索引值，从1开始
                    let templateObj = {templateId: id, templateName: name};

                    templateObj.index = t;
                    let hasOpen = canvasEvent.Template.checkOpenTempName(name)
                    if (!hasOpen) {
                        templateMap.push(templateObj);
                    }
                    if (curNode.isEdit != undefined) {
                        if (curNode.isEdit == '0') { //模板不可编辑
                            disbleMap.push(curNode.id);
                        }
                    }
                    curId = curNode.id;
                    curTemplateIndex = t;
                    //初始化数据集
                    //initDs(res.DSArray);
                    $('#cellPos').val('A1');
                    //加载完模板后会触发TabChange事件，在tabchange事件中初始化数据集，重复初始化数据集会导致数据集字段无法拖拽
                    resetCellTool();
                    resetShapeTool();
                    $('#cellLi').show();
                    $('#shapeLi').hide();
                }
            })
        },
        //根据模板ID加载模板
        loadTemplateById: function (id) {
            $.ajax({
                url: ip + "/designSys/loadCelAndName?templateId=" + id + "&token=" + token,
                type: 'get',
                success: function (res) {
                    let templateName = encodeStr(res.name);
                    let templateContent = encodeStr(res.content);
                    let t = DesignModule._addSpreadSheet(templateName, templateContent); //模板在设计器的索引值，从1开始
                    let templateObj = {templateId: id, templateName: name};
                    templateObj.index = t;
                    let hasOpen = canvasEvent.Template.checkOpenTempName(name)
                    if (!hasOpen) {
                        templateMap.push(templateObj);
                    }
                    //初始化数据集
                    //initDs(res.DSArray);
                    $('#cellPos').val('A1');
                    //加载完模板后会触发TabChange事件，在tabchange事件中初始化数据集，重复初始化数据集会导致数据集字段无法拖拽
                    resetCellTool();
                    resetShapeTool();
                    $('#cellLi').show();
                    $('#shapeLi').hide();
                    $('#maskDiv').hide();
                    $('.ztree').prev().hide();
                    $('.ztree').hide();
                    $('.dsArea').css('height', '99%');
                    $('#settingLi').hide();
                }
            })
        },
        //加载空模板
        loadTemplate2: function (name, id) {
            let templateObj = {templateId: id, templateName: name};
            let t = DesignModule._addSpreadSheet(encodeStr(name), '');
            initGDs(true); //初始化服务器数据集
            templateObj.index = t;
            templateMap.push(templateObj);
            curTemplateIndex = t;
            dsinfo = null;
            console.log(plateformProp);
            //设置平台属性
            DesignModule._setShowCenterReport(plateformProp.center);
            DesignModule._setSearchByDefaultParam(plateformProp.auto);
            DesignModule._setAutoPaperSize(plateformProp.one);
            DesignModule._setUsePixelRuler(plateformProp.pixel);
            //DesignModule._setOnlyoneSheetMode(true);
            $('#maskDiv').hide();
        },
        //加载空模板
        loadExistTemplate: function (name, str) {
            let templateObj = {templateId: 0, templateName: name};
            let t = DesignModule._addSpreadSheet(encodeStr(name), encodeStr(str));
            templateObj.index = t;
            templateMap.push(templateObj);
            curTemplateIndex = t;
            dsinfo = null;
            $('#maskDiv').hide();
        },
        //另存为时加载模板
        loadSaveAsTemplate: function (name, str, id) {
            let templateObj = {templateId: id, templateName: name};
            let t = DesignModule._addSpreadSheet(encodeStr(name), encodeStr(str));
            templateObj.index = t;
            templateMap.push(templateObj);
            curTemplateIndex = t;
            dsinfo = null;
            $('#maskDiv').hide();
        },

        //获取模板的宏
        setSqlMacroStr: function (val) {
            return DesignModule._setSqlMacroStr(encodeStr(val));
        },
        getSqlMacroStr: function () {
            let val = DesignModule._getSqlMacroStr();
            let text = decodeStrAndFree(val);
            return text;
        },
        //替换sql中的参数
        replaceParamsStr: function (str) {
            let val = DesignModule._replaceParamsStr(encodeStr(str));
            return decodeStrAndFree(val);
        },
        //获取参数字符串
        getParamsJsonStr: function () {
            let val = DesignModule._getParamsJsonStr();
            let text = decodeStrAndFree(val);
            return text;
        },
        //模板属性
        getCurSpreadSheetProperty: function () {
            let val = DesignModule._getCurSpreadSheetProperty();
            return decodeStrAndFree(val);
        },
        setCurSpreadSheetProperty: function (val) {
            return DesignModule._setCurSpreadSheetProperty(encodeStr(val));
        },
        //模板打印表达式
        sheetPrintExpr: function () {
            return decodeStrAndFree(DesignModule._sheetPrintExpr());
        },
        //模板是否居中显示
        isShowCenterReport: function () {
            return DesignModule._isShowCenterReport();
        },
        //获取模板的所有悬浮元素
        getAllShapeNames: function () {
            return decodeStrAndFree(DesignModule._getAllShapeNames());
        },
        //获取模板的所有sheet名
        getAllSheetName: function () {
            return decodeStrAndFree(DesignModule._getAllSheetName());
        },
        //清除数据源
        clearData: function (type) {
            DesignModule._clearData(type);
        },
        //添加数据源信息
        addDataSourceArray: function (ds) {
            var str = encodeStr(ds);
            return DesignModule._addDataSourceArray(str);
        },
        //删除数据源信息
        removeDataSource: function (dsName) {
            var str = encodeStr(dsName);
            return DesignModule._removeDataSource(str);
        },
        //获取数据源信息
        dataSourceArray: function () {
            var sval = DesignModule._dataSourceArray();
            return decodeStrAndFree(sval);
        },
        //检查是否已存在已经打开的模板
        checkOpenTempName: function (name) {
            let flag = false;
            $.each(templateMap, function (i, e) {
                if (name == e.templateName) {
                    flag = true;
                }
            })
            return flag;
        },
        //获取新增的数据集名称
        getNewDataSourceName: function () {
            return decodeStrAndFree(DesignModule._getNewDataSourceName());
        },
        //获取当前打开模板的内容
        getCurTemplateContent: function () {
            let sval = DesignModule._saveAsToStream();
            return decodeStrAndFree(sval);
        },
        getFieldReferenceStr: function () {
            return decodeStrAndFree(DesignModule._getFieldReferenceStr());
        },
        setFieldReferenceStr: function (val) {
            return DesignModule._setFieldReferenceStr(encodeStr(val));
        },
        //重命名模板
        renameTemplate: function (index, val) {
            DesignModule._renameSpreadSheet(index, encodeStr(val));
        },
        //导入excel
        importXlsxByName: function (name, content) {
            DesignModule._importXlsxByName(encodeStr(name), encodeStr(content));
        },
        importXlsxStream: function (content) {
            DesignModule._importXlsxStream(encodeStr(content), 1);
        },
        //是否显示页眉
        isPageHeaderShowed: function () {
            return DesignModule._isPageHeaderShowed();
        },
        //是否显示页脚
        isPageFooterShowed: function () {
            return DesignModule._isPageFooterShowed();
        },
        //删除页眉
        removePageHeaderSheet: function () {
            DesignModule._removePageHeaderSheet();
        },
        //删除页脚
        removePageFooterSheet: function () {
            DesignModule._removePageFooterSheet();
        },
        showPageHeaderSheet: function () {
            DesignModule._showPageHeaderSheet();
        },
        showPageFooterSheet: function () {
            DesignModule._showPageFooterSheet();
        }
    },
    Row: {
        //设置行高
        setRowHeight: function (val) {
            return DesignModule._setRowHeight(val);
        },
        //获取行高
        getRowHeight: function () {
            return DesignModule._getRowHeight();
        },
        //插入行
        insertRow: function () {
            let index = canvasEvent.Sheet.getCurrentSheet();
            DesignModule._insertSheetRow(index);
        },
        //追加行
        appendRow: function () {
            let index = canvasEvent.Sheet.getCurrentSheet();
            DesignModule._appendSheetRow(index);
        },
        //删除行
        deleteRow: function () {
            let index = canvasEvent.Sheet.getCurrentSheet();
            DesignModule._removeSheetRow(index);
        },
        //重复头行
        setRepeatedHeadRow: function () {
            DesignModule._setRepeatedHeadRow();
        },
        //重复行数据
        setRepeatedRowRegion: function () {
            DesignModule._setRepeatedRowRegion();
        },
        //重复尾行
        setRepeatedFootRow: function () {
            DesignModule._setRepeatedFootRow();
        },
        //取消重复行
        cancelRepeatedRow: function () {
            DesignModule._cancelRepeatedRow();
        }
    },
    Column: {
        //设置行高
        setColumnWidth: function (val) {
            return DesignModule._setColumnWidth(val);
        },
        //获取行高
        getColumnWidth: function () {
            return DesignModule._getColumnWidth();
        },
        //插入列
        insertColumn: function () {
            let index = canvasEvent.Sheet.getCurrentSheet();
            DesignModule._insertSheetColumn(index);
        },
        //追加列
        appendColumn: function () {
            let index = canvasEvent.Sheet.getCurrentSheet();
            DesignModule._appendSheetColumn(index);
        },
        //删除列
        deleteColumn: function () {
            let index = canvasEvent.Sheet.getCurrentSheet();
            DesignModule._removeSheetColumn(index);
        }
    },
    Cell: {
        //获取当前单元格字体属性集合
        /* {"family":"simsun","pointSize":9,"weight":50,"italic":true,"bold":true,"underline":false}*/
        getSelCellFont: function () {
            return decodeStrAndFree(DesignModule._getSelCellFont());
        },
        //获取当前单元格
        getSelCellRect: function () {
            let str = DesignModule._getSelCellRect();
            str = decodeStrAndFree(str);
            if (str != '') {
                selRect = JSON.parse(str);
                return selRect;
            }
        },
        //设置单元格类型，type=9时，插入斜线
        setSelCellsType: function (type) {
            return DesignModule._setSelCellsType(type);
        },
        //设置单元格样式
        setSelCellsStyle: function (type) {
            return DesignModule._setSelCellsStyle(type);
        },
        //1.获取单元格样式,return int (HCellStyle)
        getSelCellsStyle: function () {
            return DesignModule._getSelCellsStyle();
        },
        //设置二维码类型
        setSelCellsBarCodeType: function (type) {
            return DesignModule._setSelCellsBarCodeType(type);
        },
        getSelCellsBarCodeHideText: function () {
            return DesignModule._getSelCellsBarCodeHideText();
        },
        //2.获取二维码类型 return int (BarCodeType)
        getSelCellsBarCodeType: function () {
            return DesignModule._getSelCellsBarCodeType();
        },
        //当前单元格是否是插件
        isSelCellPluginInfo: function () {
            return DesignModule._isSelCellPluginInfo();
        },
        setCellPluginDefaultImage: function (col, row, base64) {
            return DesignModule._setCellPluginDefaultImage(col, row, encodeStr(base64));
        },
        setSelCellPluginInfo: function (option) {
            return DesignModule._setSelCellPluginInfo(encodeStr(option));
        },
        getPluginInfo: function () {
            return DesignModule._pluginInfo();
        },
        //获取插件类型
        getPluginType: function () {
            return decodeStrAndFree(DesignModule._pluginType());
        },
        //获取插件类型
        getPluginName: function () {
            return decodeStrAndFree(DesignModule._pluginName());
        },
        //当前单元格是否允许编辑
        isAllowEditCurrCell: function () {
            return DesignModule._isAllowEditCurrCell();
        },
        //当前单元格位置
        getSelBeginCell: function () {
            return DesignModule._getSelBeginCell();
        },
        //获取当前单元格文本
        getSelCellText: function () {
            let sval = DesignModule._getSelCellText();
            var text = decodeStrAndFree(sval);
            return text;
        },
        //设置单元格文本
        setSelCellText: function (val) {
            DesignModule._setSelCellText(encodeStr(val));
        },
        //删除当前单元格内容
        removeSelCellData: function () {
            return DesignModule._removeSelCellData(false, false);
        },
        //设置单元格注释
        setSelCellComment: function (val) {
            return DesignModule._setSelCellComment(encodeStr(val));
        },
        //设置单元格注释
        getSelCellComment: function () {
            return decodeStrAndFree(DesignModule._getSelCellComment());
        },
        //单元格注释是否隐藏
        getSelCellCommentHide: function () {
            return DesignModule._getSelCellCommentHide();
        },
        //设置单元格注释是否隐藏
        setSelCellCommentHide: function (val) {
            return DesignModule._setSelCellCommentHide(val);
        },
        setMergeExpandCellStr: function (val) {
            return DesignModule._setSelCellMergeExpandCellStr(val);
        },
        getMergeExpandCellStr: function () {
            return DesignModule._isMergeExpandCellStr();
        },
        //删除单元格内容和样式
        removeSelCell: function () {
            return DesignModule._removeSelCellData(true, true);
        },
        //设置当前单元格字体
        setSelCellFontFamily: function (val) {
            return DesignModule._setSelCellFontFamily(val);
        },
        //设置当前单元格字体大小
        setSelCellFontPointSize: function (val) {
            return DesignModule._setSelCellFontPointSize(val);
        },
        //取消所有边框样式
        cancelSelCellLineStyle: function () {
            DesignModule._cancelSelCellLineStyle();
        },
        //设置单元格边框样式
        setSelCellLineStyle: function (sideType, penStyle, widthType, color) {
            return DesignModule._setSelCellLineStyle(sideType, penStyle, widthType, encodeStr(color));
        },
        setSelCellLineStyleByPenStyle: function (sideType, penStyle) {
            DesignModule._setSelCellLineStyleByPenStyle(sideType, penStyle);
        },
        //获取单元格边框样式
        getSelCellLineStyle: function (type) {
            return DesignModule._getSelCellLineStyle(type);
        },
        //设置单元格背景颜色
        setSelCellBKColor: function (color) {
            DesignModule._setSelCellBKColor(encodeStr(color));
        },
        //设置单元格水平方向
        setSelCellAlignH: function (val) {
            return DesignModule._setSelCellAlignH(val);
        },
        //获取单元格水平方向
        getSelCellAlignH: function () {
            return DesignModule._getSelCellAlignH();
        },
        //设置单元格垂直方向
        setSelCellAlignV: function (align) {
            return DesignModule._setSelCellAlignV(align);
        },
        getSelCellAlignV: function () {
            return DesignModule._getSelCellAlignV();
        },
        //获取单元格背景颜色
        getSelCellBKColor: function () {
            return decodeStrAndFree(DesignModule._getSelCellBKColor());
        },
        //设置单元格字体颜色
        setSelCellFontColor: function (color) {
            return DesignModule._setSelCellFontColor(encodeStr(color));
        },
        //获取单元格字体颜色
        getSelCellFontColor: function () {
            return decodeStrAndFree(DesignModule._getSelCellFontColor());
        },
        //设置斜体
        setSelCellFontItalic: function (val) {
            return DesignModule._setSelCellFontItalic(val);
        },
        //设置weight
        setSelCellFontWeight: function (val) {
            return DesignModule._setSelCellFontWeight(val);
        },
        //设置字体粗体
        setSelCellFontBold: function (val) {
            return DesignModule._setSelCellFontBold(val);
        },
        //设置字体粗体
        setSelCellFontUnderline: function (val) {
            return DesignModule._setSelCellFontUnderline(val);
        },
        //设置单元格自适应高度
        setSelCellAdaptTextHeight: function (val) {
            return DesignModule._setSelCellAdaptTextHeight(val);
        },
        //单元格是否自适应高度
        isSelCellAdaptTextHeight: function () {
            return DesignModule._isSelCellAdaptTextHeight();
        },
        //获取格式化文本
        getSelCellFormatText: function () {
            return decodeStrAndFree(DesignModule._getSelCellFormatText());
        },
        //设置单元格背景图片
        setSelCellBkPic: function (val) {
            DesignModule._setSelCellBkPic(encodeStr(val));
        },
        //移除背景图片
        removeSelCellBkPic: function () {
            DesignModule._removeSelCellBkPic();
        },
        /**
         * 数据集相关属性
         * */
        //获取单元格类型
        getSelCellsType: function () {
            return DesignModule._getSelCellsType();
        },
        //1.获取单元格样式,return int (HCellStyle)
        getSelCellsStyle: function () {
            return DesignModule._getSelCellsStyle();
        },
        //2.判断是否是表结构字段 param 单元格位置X，Y
        isFieldCell: function (x, y) {
            return DesignModule._isFieldCell(x, y);
        },
        //获取当前单元格的数据集名称
        getDSName: function () {
            var val = DesignModule._getDSName();
            return decodeStrAndFree(val);
        },
        //设置当前单元格数据集名称
        setDSName: function (val) {
            return DesignModule._setSelCellDSName(encodeStr(val));
        },
        //获取当前单元格的字段名
        getFieldName: function () {
            var val = DesignModule._getFieldName();
            return decodeStrAndFree(val);
        },
        setFieldName: function (val) {
            return DesignModule._setSelCellFieldName(encodeStr(val));
        },
        //获取单元格数据类型
        getFieldDataType: function () {
            return DesignModule._getFieldDataType();
        },
        setFieldDataType: function (val) {
            return DesignModule._setSelCellFieldDataType(val);
        },
        //获取数据设置
        getDataAttribution: function () {
            return DesignModule._getDataAttribution();
        },
        setDataAttribution: function (val) {
            return DesignModule._setSelCellDataAttribution(val);
        },
        //获取汇总方式
        getDataStatisticsType: function () {
            return DesignModule._getDataStatisticsType();
        },
        //设置汇总方式
        setDataStatisticsType: function (val) {
            return DesignModule._setSelCellDataStatisticsType(val);
        },
        //获取过滤表达式
        getFilterExpr: function () {
            var val = DesignModule._getFilterExpr();
            return decodeStrAndFree(val);
        },
        //设置最小行数
        setMinRecordCount: function (count) {
            return DesignModule._setSelCellMinRecordCount(count);
        },
        //获取最小显示行数
        getMinRecordCount: function () {
            return DesignModule._getMinRecordCount();
        },
        //获取数据字典ds名称
        getDataDictDsName: function () {
            var val = DesignModule._getDataDictDsName();
            return decodeStrAndFree(val);
        },
        setDataDictDsName: function (val) {
            return DesignModule._setDataDictDsName(encodeStr(val));
        },
        setDataDict: function () {
            return DesignModule._setDataDict(ParamOperator.encodeStr(''), ParamOperator.encodeStr(''), ParamOperator.encodeStr(''));
        },
        //获取数据字典映射列
        getActualFieldName: function () {
            var val = DesignModule._getActualFieldName();
            return decodeStrAndFree(val);
        },
        //设置数据字典映射列
        setActualFieldName: function (val) {
            return DesignModule._setActualFieldName(encodeStr(val));
        },
        //获取数据字典显示列
        getShowFieldName: function () {
            var val = DesignModule._getShowFieldName();
            return decodeStrAndFree(val);
        },
        //设置数据字典显示列
        setShowFieldName: function (val) {
            return DesignModule._setShowFieldName(encodeStr(val));
        },
        //是否字段分页
        isFieldPaging: function () {
            return DesignModule._isFieldPaging();
        },
        setFieldPaging: function (flag) {
            return DesignModule._setSelCellFieldPaging(flag);
        },
        //是否行后分页
        isPagingAfterRow: function () {
            return DesignModule._isPagingAfterRow();
        },
        setPagingAfterRow: function (flag) {
            return DesignModule._setSelCellPagingAtferRow(flag);
        },
        //是否每页补齐行
        isCompleteRowForEveryPage: function () {
            return DesignModule._isCompleteRowForEveryPage();
        },
        setCompleteRowForEveryPage: function (flag) {
            return DesignModule._setSelCellCompleteRowForEveryPage(flag);
        },
        //是否尾页补齐行
        isCompleteRowForLastPage: function () {
            return DesignModule._isCompleteRowForLastPage();
        },
        setCompleteRowForLastPage: function (flag) {
            return DesignModule._setSelCellCompleteRowForLastPage(flag);
        },
        //是否图片字段
        isImageField: function () {
            return DesignModule._isImageField();
        },
        setImageField: function (flag) {
            return DesignModule._setImageField(flag);
        },
        //图片路径
        imagePathStr: function () {
            var val = DesignModule._imagePathStr();
            return decodeStrAndFree(val);
        },
        setImagePathStr: function (str) {
            return DesignModule._setImagePathStr(encodeStr(str));
        },
        //是否开启分栏
        setSelCellExpandByIsMutliColumn: function (flag) {
            return DesignModule._setSelCellExpandByIsMutliColumn(flag);
        },
        isExpandByMutliColumn: function () {
            return decodeStrAndFree(DesignModule._isExpandByMutliColumn());
        },
        //分栏数量
        setSelCellExpandByColCount: function (flag) {
            return DesignModule._setSelCellExpandByColCount(flag);
        },
        //先行后列
        setSelCellExpandByIsColumnFirst: function (flag) {
            return DesignModule._setSelCellExpandByIsColumnFirst(flag);
        },
        //开启折叠
        setRetractSubCellByRetractSubCell: function (flag) {
            return DesignModule._setRetractSubCellByRetractSubCell(flag);
        },
        //是否折叠
        isRetractSubCell: function () {
            return DesignModule._isRetractSubCell();
        },
        //显示最后行
        setRetractSubCellByShowLastSubCell: function (flag) {
            return DesignModule._setRetractSubCellByShowLastSubCell(flag);
        },
        //是否显示最后行
        isShowLastSubCell: function () {
            return DesignModule._isShowLastSubCell();
        },
        //强制允许编辑
        setSelCellForceAllowedEdit: function (flag) {
            return DesignModule._setSelCellForceAllowedEdit(flag);
        },
        isSelCellForceAllowedEdit: function () {
            return DesignModule._isSelCellForceAllowedEdit()
        },
        //拆分并拷贝
        setSelCellDemergeAndCopyCell: function (flag) {
            return DesignModule._setSelCellDemergeAndCopyCell(flag);
        },
        isDemergeAndCopyCell: function () {
            return DesignModule._isDemergeAndCopyCell();
        },
        setSelCellDataAttrListToGroup: function (flag) {
            return DesignModule._setSelCellDataAttrListToGroup(flag);
        },
        getCellDataAttrListToGroup: function () {
            return DesignModule._getCellDataAttrListToGroup();
        },
        //扩展方向
        setExpandOri: function (type) {
            return DesignModule._setExpandOri(type);
        },
        getExpandOri: function () {
            return DesignModule._getExpandOri();
        },
        setLeftParentCellFrame: function () {
            return DesignModule._setLeftParentCellFrame();
        },
        //左父格类型
        getLeftParentCellType: function () {
            return DesignModule._getLeftParentCellType();
        },
        setLeftParentCellType: function (val) {
            return DesignModule._setLeftParentCellType(val);
        },
        //左父格
        getLeftParentCell: function () {
            var val = DesignModule._leftParentCell();
            return decodeStrAndFree(val);
        },
        setLeftParentCell: function (x, y) {
            var xx=canvasEvent.Util.cellX2Int(x);
            return DesignModule._setLeftParentCell(xx, y);
        },
        //上父格类型
        getTopParentCellType: function () {
            return DesignModule._getTopParentCellType();
        },
        setTopParentCellType: function (val) {
            return DesignModule._setTopParentCellType(val);
        },
        //上父格单元格
        getTopParentCell: function () {
            var val = DesignModule._topParentCell();
            return decodeStrAndFree(val);
        },
        setTopParentCell: function (x, y) {
            var xx=canvasEvent.Util.cellX2Int(x);
            return DesignModule._setTopParentCell(xx, y);
        },
        setTopParentCellFrame: function () {
            return DesignModule._setTopParentCellFrame();
        },
        //排序类型
        setOrderType: function (type) {
            return DesignModule._setOrderType(type);
        },
        getOrderType: function () {
            return DesignModule._getOrderType();
        },
        //横向伸展
        setSelCellExtendH: function (val) {
            return DesignModule._setSelCellExtendH(val);
        },
        isSelCellExtendH: function () {
            return DesignModule._isSelCellExtendH();
        },
        setSelCellExtendV: function (val) {
            return DesignModule._setSelCellExtendV(val);
        },
        //纵向伸展
        isSelCellExtendV: function () {
            return DesignModule._isSelCellExtendV();
        },
        //设置选中单元格是否显示0值
        setSelCellShowZero: function (flag) {
            return DesignModule._setSelCellShowZero(flag);
        },
        isSelCellShowZero: function () {
            return DesignModule._isSelCellShowZero();
        },
        //空值显示值
        setSelCellNullConvertStr: function (val) {
            return DesignModule._setSelCellNullConvertStr(encodeStr(val));
        },
        getSelCellNullConvertStr: function () {
            return decodeStrAndFree(DesignModule._getSelCellNullConvertStr());
        },
        //设置选中单元格是否隐藏
        setSelCellHided: function (flag) {
            DesignModule._setSelCellHided(flag);
        },
        isSelCellHided: function () {
            return DesignModule._isSelCellHided();
        },
        //行间距
        setSelCellLineSpacing: function (val) {
            DesignModule._setSelCellLineSpacing(val);
        },
        getSelCellLineSpacing: function () {
            return DesignModule._getSelCellLineSpacing();
        },
        //字符间距
        setSelCellLetterSpacing: function (val) {
            return DesignModule._setSelCellLetterSpacing(val);
        },
        getSelCellLetterSpacing: function () {
            return DesignModule._getSelCellLetterSpacing();
        },
        //段落空格数
        setSelCellParagraphSpaceCount: function (val) {
            return DesignModule._setSelCellParagraphSpaceCount(val);
        },
        getSelCellParagraphSpaceCount: function () {
            return DesignModule._getSelCellParagraphSpaceCount();
        },
        //文本上边距
        setSelCellTopMargin: function (val) {
            return DesignModule._setSelCellTopMargin(val);
        },
        getSelCellTopMargin: function () {
            return DesignModule._getSelCellTopMargin();
        },
        //文本下边距
        setSelCellBottomMargin: function (val) {
            return DesignModule._setSelCellBottomMargin(val);
        },
        getSelCellBottomMargin: function () {
            return DesignModule._getSelCellBottomMargin();
        },
        //文本左边距
        setSelCellLeftMargin: function (val) {
            return DesignModule._setSelCellLeftMargin(val);
        },
        getSelCellLeftMargin: function () {
            return DesignModule._getSelCellLeftMargin();
        },
        //文本右边距
        setSelCellRightMargin: function (val) {
            return DesignModule._setSelCellRightMargin(val);
        },
        getSelCellRightMargin: function () {
            return DesignModule._getSelCellRightMargin();
        },
        //设置选中单元格图片水平对齐方式
        setSelCellImageAlignX: function (val) {
            return DesignModule._setSelCellImageAlignX(val);
        },
        getSelCellImageAlignX: function () {
            return DesignModule._getSelCellImageAlignX();
        },
        //设置选中单元格图片垂直对齐方式
        setSelCellImageAlignY: function (val) {
            return DesignModule._setSelCellImageAlignY(val);
        },
        getSelCellImageAlignY: function () {
            return DesignModule._getSelCellImageAlignY();
        },
        //设置选中单元格是否缩放图片
        setSelCellAdaptImageSize: function (val) {
            return DesignModule._setSelCellAdaptImageSize(val);
        },
        isSelCellAdaptImageSize: function () {
            return DesignModule._isSelCellAdaptImageSize();
        },
        //设置选中单元格图片是否保持原比例
        setSelCellRawImageScale: function (val) {
            return DesignModule._setSelCellRawImageScale(val);
        },
        isSelCellRawImageScale: function (val) {
            return DesignModule._isSelCellRawImageScale(val);
        },
        //控件属性
        setControlInfo: function (str) {
            return DesignModule._setSelCellControlInfo(encodeStr(str));
        },
        getControlInfo: function () {
            let val = DesignModule._controlInfo();
            return decodeStrAndFree(val);
        },
        setRegionInfo: function (str) {
            return DesignModule._setRegionInfo(encodeStr(str));
        },
        getRegionInfo: function () {
            let val = DesignModule._getRegionInfo();
            return decodeStrAndFree(val);
        },
        //新的区域联动属性
        setRepaintRegions: function (str) {
            return DesignModule._setRepaintRegions(encodeStr(str));
        },
        //获取新的区域联动属性
        getRepaintRegions: function () {
            return decodeStrAndFree(DesignModule._repaintRegions());
        },
        //获取单元格过滤表达式
        getFilterExpr: function () {
            return decodeStrAndFree(DesignModule._getFilterExpr());
        },
        //设置单元格过滤表达式
        setFilterExpr: function (val) {
            return DesignModule._setFilterExpr(encodeStr(val));
        },
        //将父格作为过滤条件
        getFilterDependentParent: function () {
            return DesignModule._getFilterDependentParent();
        },
        //设置超链接
        setSelCellHyperlink: function (str) {
            return DesignModule._setSelCellHyperlink(encodeStr(str));
        },
        //获取选中单元格超级链接
        getSelCellHyperlink: function () {
            var val = DesignModule._getSelCellHyperlink();
            return decodeStrAndFree(val);
        },
        setSelCellAdaptTextWidth: function (flag) {
            return DesignModule._setSelCellAdaptTextWidth(flag);
        },
        isSelCellAdaptTextWidth: function () {
            return DesignModule._isSelCellAdaptTextWidth();
        }


    },
    Shape: {
        //新增空白悬浮元素
        addNullShape: function () {
            return DesignModule._addShapePlugin_none(20, 20, 160, 160);
        },
        //当前选中是否为悬浮元素
        isSelectedShape: function () {
            return DesignModule._isSelectedShape();
        },
        //取消悬浮元素焦点
        cancelShapeOperationState: function () {
            return DesignModule._cancelShapeOperationState();
        },
        //获取当前选中悬浮元素的大小
        getSelShapeSize: function () {
            return DesignModule._getSelShapeSize();
        },
        //设置悬浮元素字体大小
        setSelShapeFontPointSize: function (size) {
            return DesignModule._setSelShapeFontPointSize(size);
        },
        //获取悬浮元素字体属性
        getSelShapeFont: function () {
            return decodeStrAndFree(DesignModule._getSelShapeFont());
        },
        //设置悬浮元素字体颜色
        setSelShapeFontColor: function (color) {
            return DesignModule._setSelShapeFontColor(encodeStr(color));
        },
        getSelShapeFontColor: function () {
            return decodeStrAndFree(DesignModule._getSelShapeFontColor());
        },
        //设置悬浮元素字体斜体
        setSelShapeFontItalic: function (val) {
            return DesignModule._setSelShapeFontItalic(val);
        },
        //设置悬浮元素字体加粗
        setSelShapeFontWeight: function (val) {
            DesignModule._setSelShapeFontWeight(700);
            DesignModule._setSelShapeFontBold(val);
        },
        //设置悬浮元素字体斜体
        setSelShapeFontUnderline: function (val) {
            return DesignModule._setSelShapeFontUnderline(val);
        },
        //设置悬浮元素名称
        setSelShapeName: function (val) {
            return DesignModule._setSelShapeName(encodeStr(val));
        },
        getSelShapeName: function () {
            return decodeStrAndFree(DesignModule._selShapeName());
        },
        //设置悬浮元素x坐标
        setSelShapeX: function (val) {
            return DesignModule._setSelShapeX(val);
        },
        getSelShapeX: function () {
            return DesignModule._selShapeX();
        },
        //设置悬浮元素y坐标
        setSelShapeY: function (val) {
            return DesignModule._setSelShapeY(val);
        },
        getSelShapeY: function () {
            return DesignModule._selShapeY();
        },
        //设置悬浮元素宽度
        setSelShapeWidth: function (val) {
            return DesignModule._setSelShapeWidth(val);
        },
        getSelShapeWidth: function () {
            return DesignModule._selShapeWidth();
        },
        //设置悬浮元素高度
        setSelShapeHeight: function (val) {
            return DesignModule._setSelShapeHeight(val);
        },
        getSelShapeHeight: function (val) {
            return DesignModule._selShapeHeight(val);
        },
        //设置悬浮元素文本
        setSelShapeText: function (val) {
            return DesignModule._setSelShapeText(encodeStr(val));
        },
        getSelShapeText: function (val) {
            return decodeStrAndFree(DesignModule._selShapeText());
        },
        //设置悬浮元素是否可见
        setSelShapeVisible: function (val) {
            return DesignModule._setSelShapeVisible(val);
        },
        isSelShapeVisible: function () {
            return DesignModule._isSelShapeVisible();
        },
        isAdsorbShape: function () {
            return DesignModule._isAdsorbShape();
        },
        setAdsorbShape: function (val) {
            return DesignModule._setAdsorbShape(val)
        },
        //至于顶层
        setTop: function () {
            return DesignModule._setSelShapeTopLevel();
        },
        //至于底层
        setBottom: function () {
            return DesignModule._setSelShapeBottomLevel();
        },
        setSelShapeSheetName: function (val) {
            return DesignModule._setSelShapeSheetName(encodeStr(val));
        },
        //获取悬浮元素关联的子表单名
        getSelShapeSheetName: function () {
            return decodeStrAndFree(DesignModule._getSelShapeSheetName());
        },
        //设置插件信息
        setSelShapePluginInfo: function (option, type, name, base64) {
            return DesignModule._setSelShapePluginInfo(encodeStr(option), encodeStr(type), encodeStr(name), encodeStr(base64));
        },
        //获取悬浮元素的插件信息
        getSelShapePluginInfo: function () {
            return decodeStrAndFree(DesignModule._selShapePluginInfo());
        },
        getSelShapePluginType: function () {
            return decodeStrAndFree(DesignModule._selShapePluginType());
        },
        getSelShapePluginName: function () {
            return decodeStrAndFree(DesignModule._selShapePluginName());
        },
        setSelShapeKeepHVRatio: function (val) {
            DesignModule._setSelShapeKeepHVRatio(val);
        },
        //子表单保持横纵比
        isSelShapeKeepHVRatio: function () {
            return DesignModule._isSelShapeKeepHVRatio();
        },
        setSelShapeShowScrollBar: function (val) {
            DesignModule._setSelShapeShowScrollBar(val)
        },
        //子表单显示滚动条
        isSelShapeShowScrollBar: function () {
            return DesignModule._isSelShapeShowScrollBar();
        },
        setSelShapeStepScrollV: function (val) {
            return DesignModule._setSelShapeStepScrollV(val);
        },
        //子表单滚动步长
        selShapeStepScrollV: function () {
            return DesignModule._selShapeStepScrollV();
        },
        setSelShapeIntervalScrollV: function (val) {
            return DesignModule._setSelShapeIntervalScrollV(val);
        },
        //子表单滚动时间
        selShapeIntervalScrollV: function () {
            return DesignModule._selShapeIntervalScrollV();
        },
        //设置悬浮元素背景图片
        setSelShapeBKPic: function (val) {
            return DesignModule._setSelShapeBKPic(encodeStr(val));
        },
        //获取悬浮元素可用子表单
        formSubReportSheet: function () {
            return decodeStrAndFree(DesignModule._formSubReportSheet());
        },
        //设置悬浮元素子表单
        setFormSubReportSheet: function (str) {
            return DesignModule._setFormSubReportSheet(encodeStr(str));
        },
        //移除悬浮元素子表单
        removeSelShapeSheetName: function () {
            return DesignModule._removeSelShapeSheetName();
        },
        //移除悬浮元素
        removeSelShapePlugin: function () {
            DesignModule._removeSelShapePlugin();
        },
        //获取所有悬浮元素列表
        getAllShapeNames: function () {
            return decodeStrAndFree(DesignModule._getAllShapeNames());
        },
        //定位并选中悬浮元素
        findAndSelectShape: function (val) {
            DesignModule._findAndSelectShape(encodeStr(val));
        },
        getSelShapeSize: function () {
            return decodeStrAndFree(DesignModule._getSelShapeSize())
        },
        //设置悬浮元素超级链接
        setSelShapeHyperlink: function (val) {
            return DesignModule._setSelShapeHyperlink(encodeStr(val));
        },
        //获取悬浮元素超级链接
        getSelShapeHyperlink: function () {
            return decodeStrAndFree(DesignModule._getSelShapeHyperlink());
        },
        //设置悬浮元素区域联动
        setSelShapeRepaintRegions: function (val) {
            return DesignModule._setSelShapeRepaintRegions(encodeStr(val));
        },
        setSelectShapeRepaintRegions: function (val) {
            return DesignModule._setSelectShapeRepaintRegions(encodeStr(val));
        },
        //设置悬浮元素区域联动
        getSelShapeRepaintRegions: function () {
            return decodeStrAndFree(DesignModule._getSelShapeRepaintRegions());
        },
        getSelectShapeRepaintRegions: function () {
            return decodeStrAndFree(DesignModule._getSelectShapeRepaintRegions());
        },
        setSelShapeVisExprStr: function (val) {
            return DesignModule._setSelShapeVisExprStr(encodeStr(val));
        },
        getSelShapeVisExprStr: function () {
            return decodeStrAndFree(DesignModule._selShapeVisExprStr());
        }

    },
    Param: {
        //是否参数标签
        isParamLabelShape: function () {
            return DesignModule._isParamLabelShape();
        },
        //设置x
        setSelParamShapeX: function (x) {
            return DesignModule._setSelParamShapeX(x);
        },
        //获取x
        selParamShapeX: function () {
            return DesignModule._selParamShapeX();
        },
        //设置Y
        setSelParamShapeY: function (y) {
            return DesignModule._setSelParamShapeY(y);
        },
        //获取Y
        selParamShapeY: function () {
            return DesignModule._selParamShapeY();
        },
        //设置宽度
        setSelParamShapeWidth: function (width) {
            return DesignModule._setSelParamShapeWidth(width);
        },
        //获取宽度
        selParamShapeWidth: function () {
            return DesignModule._selParamShapeWidth();
        },
        //设置高度
        setSelParamShapeHeight: function (height) {
            return DesignModule._setSelParamShapeHeight(height);
        },
        //获取高度
        selParamShapeHeight: function () {
            return DesignModule._selParamShapeHeight();
        },
        //设置标签文本
        setSelParamShapeLabel: function (label) {
            return DesignModule._setSelParamShapeLabel(encodeStr(label));
        },
        //获取标签文本
        selParamShapeLabel: function () {
            return decodeStrAndFree(DesignModule._selParamShapeLabel());
        },
        setSelParamShapeVisible:function(val){
            return DesignModule._setSelParamShapeVisible(val);
        },
        isSelParamShapeVisible:function(){
            return DesignModule._isSelParamShapeVisible();
        },
        isShowedParamDeisgnSheet:function(){
            return DesignModule._isShowedParamDeisgnSheet();
        },
        showParamDeisgnSheet:function(){
            return DesignModule._showParamDeisgnSheet();
        },
        removeParamDeisgnSheet:function(){
            return DesignModule._removeParamDeisgnSheet();
        }
    },
    Upload: {
        //是否有重复的填报名
        checkUploadNameRepeat: function () {
            return  decodeStrAndFree(DesignModule._checkUploadNameRepeat());
        },
        //是否有重复的填报名
        checkControlNameRepeat: function () {
            return decodeStrAndFree(DesignModule._checkControlNameRepeat());
        },
        //是否有多个增加行按钮
        checkAllAddRowButtonCount: function () {
            return decodeStrAndFree(DesignModule._checkAllAddRowButtonCount());
        },
        //存在单元格数据链交叉引用
        checkUploadCellSameChain: function () {
            return decodeStrAndFree(DesignModule._checkUploadCellSameChain());
        }
    },
    Util: {
        //将数字转换为列
        int2CellX: function (v) {
            var val = DesignModule._int2CellX(v);
            return decodeStrAndFree(val);
        },
        cellX2Int: function (v) {
            return DesignModule._cellX2Int(ParamOperator.encodeStr(v));
        },
        //移动单元格到指定位置
        moveSelFrameToCell: function (val) {
            return DesignModule._moveSelFrameToCell(encodeStr(val))
        },
        getCellPos: function () {
            let pos = decodeStrAndFree(DesignModule._getSelBeginCell());
            let posJ = JSON.parse(pos);
            let cellPos = DesignModule._cellPos2Char(posJ.x, posJ.y);
            return decodeStrAndFree(cellPos);
        },
        setFormatBrushFrame: function () {
            return DesignModule._setFormatBrushFrame();
        },
        decodeCellChar2Pos: function (str) {
            return decodeStrAndFree(DesignModule._cellChar2Pos(encodeStr(str)));
        },
        //传入1,1，返回A1
        cellPos2Char: function (x, y) {
            let val = DesignModule._cellPos2Char(x, y);
            return decodeStrAndFree(val);
        },
        //传入A1，返回{"x":1,"y":1}
        cellChar2Pos: function (position) {
            let val = decodeStrAndFree(DesignModule._cellChar2Pos(encodeStr(position)));
            return val;
        },
        setSelDesignTableRegion: function () {
            return DesignModule._setSelDesignTableRegion();
        },
        removeSelDesignTableRegion: function () {
            return DesignModule._removeSelDesignTableRegion();
        },
        //传入A，返回1
        charToInt:function(char){
            return DesignModule._stoi27(encodeStr(char))
        },
        //传入2，返回B
        intToChar:function(int){
            return decodeStrAndFree(DesignModule._itos27(int))
        }
    }

}