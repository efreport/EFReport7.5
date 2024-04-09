var CellConstant = {

    //图表类型
    HChartType: {
        ChartType_None: 0,                 // 未知
        ChartType_Bar: 1,                  // 柱状图-普通
        ChartType_HorizontalBar: 2,        // 条形图-普通
        ChartType_Line: 3,                 //折线图
        ChartType_Pie: 4,                  //饼图
        ChartType_StackedBar: 5,           //堆叠柱状图
        ChartType_PercentBar: 6,           // 堆叠柱状图-堆叠百分比
        ChartType_HorizontalStackedBar: 7, // 堆叠条形图-普通
        ChartType_HorizontalPercentBar: 8, // 百分比条形图-普通
        ChartType_Area: 9,                 // 面积图
        ChartType_Donuts: 10,              // 圆圈
        ChartType_LineBar: 11,             //组合图表(折线柱状图)
        ChartType_Scatter: 12,             // 散列气泡图
        ChartType_Radar: 13,               // 雷达或极点图
        ChartType_Temperature: 14,         // 温度图 正负X轴
        ChartType_Funnel: 15,              // 漏斗图
        ChartType_Gauge: 16,               // 仪表盘
        Chart_Prov: 4096
    },
    Province: {
        4097: '北京市',
        4098: '上海市',
        4099: '天津市',
        4100: '重庆市',
        4101: '河北省',
        4102: '山西省',
        4103: '内蒙古自治区',
        4104: '辽宁省',
        4105: '吉林省',
        4106: '黑龙江省',
        4107: '江苏省',
        4108: '浙江省',
        4109: '安徽省',
        4110: '福建省',
        4111: '江西省',
        4112: '山东省',
        4113: '河南省',
        4114: '湖北省',
        4115: '湖南省',
        4116: '广东省',
        4117: '广西省',
        4118: '海南省',
        4119: '四川省',
        4120: '贵州省',
        4121: '云南省',
        4122: '西藏省',
        4123: '陕西省',
        4124: '甘肃省',
        4125: '宁夏回族自治区',
        4126: '青海省',
        4127: '新疆维吾尔自治区',
        4128: '香港特别行政区',
        4129: '澳门特别行政区',
        4130: '台湾'
    },
    HChartTypeStr: {
        1: '柱状图',
        2: '条形图',
        3: '折线图',
        4: '饼图',
        5: '堆叠柱状图',
        6: '百分比柱状图',
        7: '堆叠条形图',
        8: '百分比条形图',
        //9: '曲线图',
        10: '圆环图',
        11: '折线柱状图',
        12: '散列图',
        13: '雷达图',
        14: '温度图',
        15: '漏斗图',
        16: '仪表图',
        4096: '中国地图',
        4097: '省份地图'
    },
    //边框类型值
    HSideType: {
        LeftSide: 0,
        RightSide: 1,
        TopSide: 2,
        BottomSide: 3,
        AllSide: 4,// 暂无
        OutSide: 5,
        InSide: 6
    },
    //画笔样式值
    HPenStyle: {
        NoPen: 0,
        SolidLine: 1,
        DashLine: 2,
        DotLine: 3,
        DashDotLine: 4,
        DashDotDotLine: 5
    },
    //宽度类型值
    HLineWidthType: {
        LineWidthType1: 0,                 //0.6666667   //单位：像素，0.5磅  0.5/72*96
        LineWidthType2: 1,                 //1.6                 //单位：像素，1.2磅  1.2/72*96 只有实线有后两种

        LineWidthType3: 2                  //3                    //单位：像素，1.8磅  1.8/72*96:2.4
    },
    //单元格类型
    HCellType: {
        Unknown: 0,
        Text: 1,
        Number: 2,//可以保留小数位 默认居右显示
        RichText: 3,
        DateType: 4,//包括DateTime
        TimeType: 5,
        CurrencyType: 6,//货币
        Finance: 7,//财务
        Percent: 8,//百分比
        DecliningLine: 9,//斜线
        BarCode: 10////条形码/二维码
       // ProgressBar: 11// 进度条
    },
    HCellTypeStr: {
        1: '常规', 2: '数值', 4: '日期', 5: '时间', 6: '货币', 8: '百分比', 10: '条形码'
    },
    //单元格样式，对应HCellType
    Number: {
        '0': '#0',
        '1': '#0.0#',
        '2': '#0.00',
        '3': '#,##0',
        '8': '#,##0.0#',
        '4': '#,##0.00',
        '9': '#0.0##',
        '10': '#0.00#',
        '5': '#0.000',
        '6': '#,##0.000',
        '7': '#,##0.0##',
        '11': '#,##0.00#'
    },
    DateType: {
        0: 'yyyy-MM-dd',
        1: 'yyyy/MM/dd',
        2: 'yyyy-M-d',
        3: 'yyyy/M/d',
        4: 'yyyy-MM',
        5: 'yyyy/MM',
        6: 'MM/dd/yyyy',
        7: 'dddd, MMMM dd, yyyy',
        8: 'MMMM d, yyyy',
        9: 'MM/d/yy',
        10: 'MM.dd.yyyy'
    },
    TimeType: {
        0: 'yyyy-MM-dd HH:mm:ss',
        1: 'yyyy/MM/dd hh:mm:ss',
        2: 'yyyy-M-d h:mm',
        3: 'yyyy-M-d H:mm',
        4: 'HH:mm:ss',
        5: 'hh:mm:ss',
        6: 'MM/dd/yyyy hh:mm:ss',
        7: 'MM/dd/yyyy HH:mm:ss',
        8: 'h:mm',
        9: 'H:mm',
        10: 'h:mm:ss',
        11: 'H:mm:ss',
        12: 'hh:mm',
        13: 'HH:mm'
    },
    Currency: {
        0: '¤#0',
        1: '¤#0.00',
        2: '¤#,##0',
        3: '¤#,##0.0',
        4: '¤#,##0.00',
        5: '¤#,##0;¤-#,##0',
        6: '¤#,##0.00;¤-#,##0.00',
        7: '¤#,##0.00;(¤#,##0.00)',
        8: '$#,##0;($#,##0)',
        9: '$#,##0.00;($#,##0.00)',
        10: '大写(壹贰叁...)',
        11: '大写人民币(壹贰叁...)'
    },
    Percent: {
        0: '#0%',
        1: '#0.0%',
        2: '#0.00%',
        3: '#0.000%',
        4: '#0.0000%'
    },
    //条形码,二维码 对应HCellType
    BarCodeType: {
        1: 'UPC-A'
        , 2: 'UPC-E'
        , 3: 'CODE39'
        , 4: 'CODE39+'
        , 5: 'CODE93'
        , 6: 'CODE128'
        , 7: 'CODE128B'
        , 8: 'INDUSTRIAL'
        , 9: 'EAN'
        , 10: 'EAN-13'
        , 11: 'CODABAR'
        , 12: 'PDF417'
        , 13: 'DATAMATRIX'
        , 14: 'QRCODE'
        , 15: 'CODE49'
        , 16: 'CODE16K'
    },
    //单元格对齐方式值
    HAlignFlag: {
        AlignFlagDefault: 0,
        AlignFlagLeft: 1,
        AlignFlagRight: 2,
        AlignFlagHCenter: 4,
        AlignFlagTop: 16,
        AlignFlagBottom: 32,
        AlignFlagVCenter: 64,
        AlignFlagShrink: 256,     //收缩成一行
        AlignFlagCenter: 68//AlignFlagHCenter | AlignFlagVCenter
    },
    HControlType: {
        Noknown: 0,            // 未知
        TextEdit: 1,           // 文本输入框
        ComboBox: 2,           // 单选下拉列表  1  select
        ComboBoxMultiSel: 3,   // 多选下拉列表
        ComboTree: 4,          // 单选下拉树
        ComboTreeMultiSel: 5,  // 多选下拉树
        Date: 6,               // 日历  1
        CheckBox: 7,           // 复选框  1 checkbox
        Number: 8,             // 数字
        Button: 9,             // 按钮
        RadionButtonGroup: 10, // 按钮组 radio
        File: 11               // 文件
    },
    ControlTypeStr: {
        0: '无'
        , 1: '文本编辑框'
        , 8: '数字编辑框'
        , 9: '按钮'
        , 7: '复选框'
        , 6: '日期编辑框'
        , 11: '文件'
        , 10: '单选框'
        , 2: '下拉框'
        , 3: '多选下拉框'
    },
    DSType: {
        String: 10,
        Int: 2,
        Double: 6,
        Date: 14,
        DateTime: 16,
        Bool: 1
    },
    DSTypeSTR: {
        10: '字符串',
        2: '整型',
        6: '浮点',
        14: '日期',
        16: '日期时间',
        1: '布尔'
    },

    PaperType: {
        0: 'A0 [841x1189mm]',
        1: 'A1 [594x841mm]',
        2: 'A2 [420x594mm]',
        3: 'A3 [297x420mm]',
        4: 'A4 [210x297mm]',
        5: 'A5 [148x210mm]',
        6: 'A6 [105x148mm]',
        7: 'A7 [74x105mm]',
        8: 'A8 [52x74mm]',
        9: 'A9 [37x52mm]',
        10: 'B0 [1000x1414mm]',
        11: 'B1 [707x1000mm]',
        12: 'B2 [500x707mm]',
        13: 'B3 [353x500mm]',
        14: 'B4 [250x353mm]',
        15: 'B5 [176x250mm]',
        16: 'B6 [125x176mm]',
        17: 'B7 [88x125mm]',
        18: 'B8 [62x88mm]',
        19: 'B9 [33x62mm]',
        20: 'B10 [31x44mm]',
        21: 'C5E [163x229mm]',
        22: 'Comm10E [105x229mm]',
        23: 'DLE [110x220mm]',
        24: 'Executive [190.5x254mm]',
        25: 'Folio [210x330mm]',
        26: 'Ledger [431.8x279.4mm]',
        27: 'Legal [215.9x355.6mm]',
        28: 'Letter [215.9x279.4mm]',
        29: 'Tabloid [279.4x431.8mm]',
        30: '自定义尺寸'
    },

    PropType: {
        4: '背景',
        3: '字体',
        5: '边框',
        1: '行高',
        2: '列宽',
        6: '追加字符'
    },

    //模板参数 控件类型
    ControllTypeStr1: {
        0: '不绑定控件',
        1: '文本编辑',
        2: '下拉框',
        3: '多选下拉框',
        4: '下拉树',
        5: '多选下拉树',
        6: '日期编辑',
        7: '复选框',
        222: '自定义下拉框列表'
    },

    //模板参数 数据类型
    DataTypeStr1: {
        1: '字符串',
        2: '整型',
        3: '浮点',
        4: '日期时间',
        5: '布尔'
    }

};
