### 盈帆报表介绍
盈帆报表平台采用B/S模式架构部署在服务器的报表平台，其中盈帆报表在线设计器部分拥有独立知识产权。客户端无需安装任何其他软件或插件，使用浏览器就可以制作报表，并最终呈现。
### 一、报表设计

1.在线报表设计器
在线设计器包括表格式表单设计与画布式表单设计。
表格式表单支持Excel式的多行多列表格布局，支持多sheet表单，单元格的公式会跟随行列增删操作自动变化。
![设计器界面](http://download.efreport.com/downloads/images/design.png)

画布式表单自由布局，可制作可视化图形数据及大屏展示。
![画布布局](http://download.efreport.com/downloads/images/hb.png)

2.导入Excel
支持导入Excel表格样式，报表格式可快速进行调整，节省了绘制表格样式的时间。
![导入EXCEL](http://download.efreport.com/downloads/images/drexcel.png)

### 二、数据源

1.数据来源
支持SQLITE、MYSQL、POSTGRESQL、SQL SERVER、ORACLE、SYBASE、DB2、INFORMIX、ODBC、IGNITE等关系型数据库，可链接Redis、Mongodb、HIVE等非关系型数据库，还可链接Http服务、Json文件等。其它数据来源，可按照盈帆报表数据接口规范进行扩展实现。
![数据连接](http://download.efreport.com/downloads/images/sjlj.png)

2.数据集获取与展示
支持SQL查询语句查询数据库定义数据集；支持来自不同数据源的数据通过关联数据集实现，多个数据源数据在同一报表中展现；支持直接将存储过程作为数据集，可直接调用存储过程。
![数据集](http://download.efreport.com/downloads/images/sjj.png)

### 三、报表设计方式

1.表格式表单
表格式表单里的单元格可设置普通的文本、数据集字段、公式、图片、斜线、插件等内容进行展示。

1.1 数据展示
单元格设置的数据集字段可自动进行扩展，简单的属性设置可实现横向、纵向报表。数据字段可设置展现方式：分组、列表、统计（累加，平均，最大、最小、数量等）。数据字段根据父格设置，来确定数据间的关系，不同的数据集直接进行数据筛选来达到关联效果。通过属性设置，可制作出分组报表，交叉表，多层交叉表，明细表，主从报表，分维多片的报表，多sheet报表，以及其它任意不规则的报表类型。

![分组报表](http://download.efreport.com/downloads/images/fzbb.png)
（分组报表）

![交叉统计报表](http://download.efreport.com/downloads/images/jctjbb.png)
（交叉统计报表）

![多表单报表](http://download.efreport.com/downloads/images/dbdbb.png)
（多表单报表）

![公式计算同比环比](http://download.efreport.com/downloads/images/tbhb.png)
（公式计算同比环比）

![主从报表](http://download.efreport.com/downloads/images/zcbb.png)
（主从报表）

![常用条形码报表](http://download.efreport.com/downloads/images/ewmbb.png)
（常用条形码报表）

1.2 样式
支持文字对齐方式，边框，背景，字体，格式等属性的设置，其中对齐方式包括垂直居中，垂直靠上，垂直靠下，水平靠左，水平靠右，水平居中；格式包括常规，数值，日期，时间，货币，百分比，条形码。
![样式](http://download.efreport.com/downloads/images/ys.png)

1.3 条件属性
在条件属性中根据条件设置高亮显示，可改变的属性有背景，字体，边框，行高，列宽，调整文本，起到预警作用。
![条件属性](http://download.efreport.com/downloads/images/tjsx.png)

![条件属性预览](http://download.efreport.com/downloads/images/tjsxyl.png)

1.4 区域联动
支持文字与图表、文字与报表、报表与图形、报表与报表、图形与报表、图形与图形之间的联动；主表单子表单区域联动，主表单单元格区域联动。
![区域联动](http://download.efreport.com/downloads/images/qyld.png)

1.5 超级链接
支持从一个网页指向一个目标的连接，连接的目标可以是其他报表或网页链接。并且可以使用悬浮窗口显示超级链接的内容。

2.画布表单
画布表单需要使用悬浮元素，可拖拽，易布局。悬浮元素支持普通文本、文本公式、插件、图片、子表格式格表单的嵌套。同样支持区域联动与超级链接功能。
![画布设计器](http://download.efreport.com/downloads/images/hbbd.png)
（画布设计器）

![画布效果图](http://download.efreport.com/downloads/images/xgt.png)
（画布效果图）

### 四、报表展现方式
表格式表单可使用网页元素的方式展示或使用盈帆报表插件的方式展现。两种不同的方式，各有使用场景。

1.网页展示
传统方式的网页进行报表展示，报表自动分页，展现设计好的报表模板。网页元素展现默认的工具栏与参数栏（有参数设置时展现），参数栏显示报表中设置的参数控件，并可自定义设置工具栏与参数栏显示按钮。制作报表大屏时需使用此模式，根据实际屏幕大小自适应全屏显示。
![网页展示](http://download.efreport.com/downloads/images/wy.png)

2.报表插件展示
报表插件的方式展示，是表格式的显示方式，可进行编辑，并且进行二次计算，可理解为在线Excel。在报表设置中可设置折叠属性，进行折叠展示。表格插件展示不支持画布式表单展示。
![插件展示](http://download.efreport.com/downloads/images/cj.png)

### 五、数据填报与校验
设置数据库信息与数据校验信息，将数据进行校验，正确的回写到数据库中。数据填报支持网页展示与报表插件展示。在报表插件展示中，提供导出Excel数据功能，与离线填报功能。
![填报](http://download.efreport.com/downloads/images/tb.png)

### 六、图表插件

1.基本插件
支持各种常规的插件：柱形图、堆积柱形图、折线图，曲线图，面积图，堆积折线图、饼图、圆环图、南丁格尔图、折线柱状图、雷达图、双折线图、条形图、堆积条形、散列图、漏斗图、网络图片、中国地图等。
不同类型的插件有其特有的基本属性，对于特殊的属性可进行扩展。插件数据支持数据集数据字段的数据，自定义的数据。
支持图表的灵活交互，可通过点击图表系列改变同一报表中的其它图表元素，达到图表数据联动分析的效果。
![条形图](http://download.efreport.com/downloads/images/txt.png)
![折线图](http://download.efreport.com/downloads/images/zxt.png)

2.自定义插件
提供自定义图表插件二次开发，可快速开发自定义插件，并在报表系统中展示。
![自定义插件](http://download.efreport.com/downloads/images/zdy.png)

### 七、公式与参数

1.公式
提供多种兼容Excel函数类型，常用函数、字符串函数、数学函数、日期函数、逻辑函数，支持跨页取数，跨模板取数。并提供自定义函数机制，用户可以根据业务需要自己扩展定义函数。

2.参数
参数的使用既可提升报表展现速度又不必编写复杂SQL关联语句。通过注入的值对数据库中的数据进行操作，只取对应的数据，帮助分解大数据库表的关联查询的压力以提高报表性能。
![参数](http://download.efreport.com/downloads/images/cs.png)

### 八、报表输出

生成的报表可以导出Pdf、Excel、Word等方式，提供发送邮件，支持手机移动端显示。
### 九、移动端显示

支持APP、手机网页、微信公众号显示。可根据用户手机尺寸进行自适应屏幕显示。同样可支持PC上数据联动和模板跳转。
![移动端展示](http://download.efreport.com/downloads/images/yd.png) ![移动端图表](http://download.efreport.com/downloads/images/ydtb.png)
