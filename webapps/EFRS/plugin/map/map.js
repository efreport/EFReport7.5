/// <reference path="./theme/*.min.js" />
/// <reference path="./echarts-4.1.0.min.js" />
/// <reference path="./map/js/china.js" />
/// <reference path="./tools.js" />

var myChart = {
  version: '1.0'
};

/**
 * 创建地图
 */
myChart.initMap = function(td, dom, data, theme, callback, chinaMap, regions, psheetname) {
  //基础公共配置项
  var config = {
    type: 'map',
    map: data.mapType || 'china',
    label: {
      normal: {
        show: true
      }
    }
  };

  var option = {
    animation: true,
    title: {
      show: true,
      text: '',
      textStyle: { color: '#333' },
      subtextStyle: { color: '#333' },
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false,
      orient: 'vertical',
      left: 'left',
      data: []
    },
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true
    },
    series: []
  };

  var legend = [];
  var num = [];
  var series = [];

  for (var i = 0; i < data.series.length; i++) {
    //从数据中解析出最大数值
    for (var j = 0; j < data.series[i].data.length; j++) {
      num.push(data.series[i].data[j].value);
    }
    //获取图例名称集合
    legend.push(data.series[i].name);

    if ("china" === config.map) {
      var privence = [{name: "北京"}, {name: "上海"}, {name: "天津"}, {name: "重庆"}, {name: "河北"}, {name: "山西"}, {name: "内蒙古"}, {name: "辽宁"}, {name: "吉林"}, {name: "黑龙江"}, {name: "江苏"}, {name: "浙江"}, {name: "安徽"}, {name: "福建"}, {name: "江西"}, {name: "山东"}, {name: "河南"}, {name: "湖北"}, {name: "湖南"}, {name: "广东"}, {name: "广西"}, {name: "海南"}, {name: "四川"}, {name: "贵州"}, {name: "云南"}, {name: "西藏"}, {name: "陕西"}, {name: "甘肃"}, {name: "宁夏"}, {name: "青海"}, {name: "新疆"}, {name: "香港"}, {name: "澳门"}, {name: "台湾"}];
      for (var j = 0; j < privence.length; j++) {
        for (var x = 0; x < data.series[i].data.length; x++) {
          if (privence[j].name === data.series[i].data[x].name) {
            privence.splice(j, 1);
          }
        }
      }
      Array.prototype.push.apply(data.series[i].data, privence);
    }

    series.push({
      name: data.series[i].name,
      type: config.type,
      map: config.map,
      label: config.label,
      data: data.series[i].data,
      zoom: 1,
      top: 50
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);

  //从数据中解析出图例数据
  option.backgroundColor = data.backgroundColor;
  option.visualMap.max = num.max();
  option.legend.data = legend;
  option.series = series;
  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, chinaMap, regions, psheetname);
    }
  });

  return this;
}

/**
 * 创建仪表盘
 */
myChart.initGauge = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      show: true,
      text: '仪表盘实例',
      textStyle: { color: '#333' },
      subtextStyle: { color: '#333' },
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      formatter: "{b} : {c}"
    },
    series: []
  };

  var num = [];
  for (var i = 0; i < data.series.length; i++) {
    num.push(data.series[i].value);
  }

  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    var item = [];
    if (data.display == 1) {
      //数值数据
      item.push(data.series[i]);
    } else {
      item.push({
        name: data.series[i].name,
        value: (data.series[i].value / num.sum() * 100).toFixed(2)
      });
    }

    series.push({
      name: '销量',
      type: 'gauge',
      max: data.display == 1 ? num.sum() : 100,
      title: {
        show: data.series.length == 1
      },
      detail: {
        show: data.series.length == 1,
        formatter: data.display == 1 ? '{value}' : '{value}%'
      },
      data: item
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.backgroundColor = data.backgroundColor;
  option.series = series;
  option.tooltip.formatter = data.display == 1 ? '{b} : {c}' : '{b} : {c}%';

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname, 1);
    }
  });

  return this;
}

/**
 * 条形图-普通
 */
myChart.initBar1 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠条形图-普通',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    yAxis: {
      type: 'category',
      name: '类别',
      data: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六', '分类七'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    },
    xAxis: {
      type: 'value'
    },
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'bar',
      data: data.series[i].data,
      label: {
        normal: {
          show: true,
          position: 'insideRight'
        }
      }
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.yAxis.name = data.yAxis.name;
  option.yAxis.data = data.yAxis.data;
  option.yAxis.axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis.axisLabel = data.xAxis.axisLabel;
  option.xAxis.name = data.xAxis.name;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis.axisLabel.fontSize = Math.round(option.xAxis.axisLabel.fontSize * td.attr("vr"));
    option.yAxis.axisLabel.fontSize = Math.round(option.yAxis.axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele=td.find("#"+dom)[0];
  ele.style.width  = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });

  return this;
}

/**
 * 堆叠条形图-堆叠
 */
myChart.initBar2 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠条形图-堆叠',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    yAxis: [{
      type: 'category',
      name: '类别',
      data: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六', '分类七'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    xAxis: [{
      type: 'value'
    }],
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'bar',
      stack: 'group',
      data: data.series[i].data,
      label: {
        normal: {
          show: true,
          position: 'insideRight'
        }
      }
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].data = data.yAxis.data;
  option.yAxis[0].axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis[0].axisLabel = data.xAxis.axisLabel;
  option.xAxis[0].name = data.xAxis.name;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width  = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 堆叠条形图-堆叠百分比
 */
myChart.initBar3 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠条形图-堆叠百分比',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    yAxis: [{
      type: 'category',
      name: '类别',
      data: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六', '分类七'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    xAxis: [{
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value} %'
      }
    }],
    series: []
  };

  //获取分类下的总和值
  var _temp = [];
  for (var i = 0; i < data.yAxis.data.length; i++) {
    var num = 0;
    for (var j = 0; j < data.series.length; j++) {
      num += data.series[j].data[i];
    }
    _temp.push(num);
  }

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    var arr = [];
    for (var j = 0; j < data.series[i].data.length; j++) {
      arr.push((data.series[i].data[j] / _temp[j] * 100).toFixed(2));
    }

    series.push({
      name: data.series[i].name,
      type: 'bar',
      stack: 'group',
      data: arr,
      label: {
        normal: {
          show: true,
          position: 'insideRight',
          formatter: '{c}%'
        }
      }
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].data = data.yAxis.data;
  option.yAxis[0].axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.xAxis[0].name = data.xAxis.name;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 散列气泡图
 */
myChart.initBubble = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '散点气泡图',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      scale: true
    },
    xAxis: {
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: []
  };

  var legend = [];
  var series = [];
  var maxSymbolSize = [];
  for (var i = 0; i < data.series.length; i++) {
    for (var j = 0; j < data.series[i].data.length;j++) {
      maxSymbolSize.push(data.series[i].data[j].value[0]);
    }
  }

  for (var i = 0; i < data.series.length; i++) {
    legend.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'scatter',
      data: data.series[i].data,
      symbolSize: function(data) {
        return data[2]/(maxSymbolSize.max() / 50);
      },
      label: {
        normal: {
          formatter: '{b}',
          position: 'right',
          show: false
        },
        emphasis: {
          show: true
        }
      }
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legend;
  option.backgroundColor = data.backgroundColor;
  option.series = series;
  option.yAxis.axisLabel = data.yAxis.axisLabel;
  option.xAxis.axisLabel = data.xAxis.axisLabel;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis.axisLabel.fontSize = Math.round(option.xAxis.axisLabel.fontSize * td.attr("vr"));
    option.yAxis.axisLabel.fontSize = Math.round(option.yAxis.axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 漏斗图
 */
myChart.initFunnel = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      show: true,
      text: '漏斗图实例',
      textStyle: { color: '#333' },
      subtextStyle: { color: '#333' },
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: true,
      bottom: 0,
      data: []
    },
    series: [{
      name: '销量',
      type: 'funnel',
      left: '5%',
      right: '5%',
      width: '90%',
      height: '70%',
      sort: 'descending',
      gap: 2,
      data: []
    }]
  };

  var legend = [];
  for (var i = 0; i < data.series.length; i++) {
    //获取图例名称集合
    legend.push(data.series[i].name);
  }
  var label = {
    normal: {
      show: true,
      position: 'inside'
    },
    emphasis: {
      textStyle: {
        fontSize: 20
      }
    }
  };
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.backgroundColor = data.backgroundColor;
  option.legend.data = legend;
  option.series[0].label = label;
  option.series[0].data = data.series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname,1);
    }
  });
}

/**
 * 堆叠折线图-普通
 */
myChart.initLine1 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠折线图-普通',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'cross', // 默认为直线，可选为：'line' | 'shadow'
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '5%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      name: '',
      boundaryGap: false,
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: 'value',
      name: '',
      axisLabel: {
        formatter: '{value}'
      }
    }],
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'line',
      data: data.series[i].data
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.xAxis[0].name = data.xAxis.name;
  option.xAxis[0].data = data.xAxis.data;
  option.yAxis[0].axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.yAxis[0].name = data.yAxis.name;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 堆叠折线图-面积图
 */
myChart.initLine2 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠折线图-面积图',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'cross', // 默认为直线，可选为：'line' | 'shadow' | 'cross'
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '5%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      name: '',
      boundaryGap: false,
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: 'value',
      name: '',
      axisLabel: {
        formatter: '{value}'
      }
    }],
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'line',
      stack: '总量',
      areaStyle: { normal: {} },
      data: data.series[i].data
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.xAxis[0].name = data.xAxis.name;
  option.xAxis[0].data = data.xAxis.data;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 折线柱状混合图
 */
myChart.initLine3 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '折线柱状混合图',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'cross', // 默认为直线，可选为：'line' | 'shadow'
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '5%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      name: '',
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: 'value',
      name: '销量',
      axisLabel: {
        formatter: '{value}'
      }
    }, {
      type: 'value',
      name: '总量',
      axisLabel: {
        formatter: '{value}'
      }
    }],
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.barSeries.length; i++) {
    legendData.push(data.barSeries[i].name);
    series.push({
      name: data.barSeries[i].name,
      type: 'bar',
      data: data.barSeries[i].data
    });
  }
  for (var i = 0; i < data.lineSeries.length; i++) {
    legendData.push(data.lineSeries[i].name);
    series.push({
      name: data.lineSeries[i].name,
      type: 'line',
      yAxisIndex: 1,
      data: data.lineSeries[i].data
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.xAxis[0].name = data.xAxis.name;
  option.xAxis[0].data = data.xAxis.data;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 饼图-普通
 */
myChart.initPie1 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '饼图-普通',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: true,
      orient: 'vertical',
      left: 'left',
      data: []
    },
    series: [{
      type: 'pie',
      radius: '60%',
      data: []
    }]
  };

  var legend = [];
  for (var i = 0; i < data.data.length; i++) {
    //获取图例名称集合
    legend.push(data.data[i].name);
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.backgroundColor = data.backgroundColor;
  option.legend.data = legend;
  option.series[0].data = data.data;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname,1);
    }
  });
}

/**
 * 饼图-环形
 */
myChart.initPie2 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '饼图-环形',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: []
    },
    series: [{
      type: 'pie',
      radius: ['40%', '60%'],
      data: []
    }]
  };

  var legend = [];
  for (var i = 0; i < data.data.length; i++) {
    //获取图例名称集合
    legend.push(data.data[i].name);
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.backgroundColor = data.backgroundColor;
  option.legend.data = legend;
  option.series[0].data = data.data;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    }
    catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname,1);
    }
  });
};

/**
 * 嵌套环形图
 */
myChart.initPie3 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '嵌套环形图',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
    },
    series: [{
      type: 'pie',
      selectedMode: 'single',
      radius: '30%',
      label: {
        normal: {
          position: 'inner'
        }
      },
      data: []
    }, {
      type: 'pie',
      radius: ['40%', '60%'],
      data: [],
    }]
  };

  var legend = [];
  for (var i = 0; i < data.data.length; i++) {
    //获取图例名称集合
    legend.push(data.data[i].name);
  }
  for (var i = 0; i < data.data2.length; i++) {
    //获取图例名称集合
    legend.push(data.data2[i].name);
  }

  option.backgroundColor = data.backgroundColor;
  option.legend.data = legend;
  option.series[0].data = data.data;
  option.series[1].data = data.data2;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 基础雷达图
 */
myChart.initRadar = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '基础雷达图',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    radar: {
      // shape: 'circle',
      //name: {
      //  textStyle: {
      //    color: '#fff',
      //    backgroundColor: '#999',
      //    borderRadius: 3,
      //    padding: [3, 5]
      //  }
      //},
      //雷达图的指示器，用来指定雷达图中的多个变量（维度）
      indicator: []
    },
    series: [{
      name: '',
      type: 'radar',
      data: []
    }]
  };

  var legend = [];
  for (var i = 0; i < data.series.data.length; i++) {
    legend.push(data.series.data[i].name);
  }

  var indicator = [];
  for (var i = 0; i < data.indicator.length; i++) {
    var num = [];
    for (var j = 0; j < data.series.data.length; j++) {
      num.push(data.series.data[j].value[i]);
    }
    indicator.push({
      name: data.indicator[i],
      max: num.max()
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legend;
  option.backgroundColor = data.backgroundColor;
  option.series[0].name = data.series.name;
  option.series[0].data = data.series.data;
  option.radar.indicator = indicator;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 堆叠柱状图-普通
 */
myChart.initStack = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠柱状图-普通',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50, 
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      name: '',
      data: [],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: 'value',
      name: '',
      axisLabel: {
        formatter: '{value}'
      }
    }],
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'bar',
      data: data.series[i].data
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.xAxis[0].name = data.xAxis.name;
  option.xAxis[0].data = data.xAxis.data;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele=td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 堆叠柱状图-堆叠数值
 */
myChart.initStack2 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠柱状图-堆叠数值',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50, 
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      name: '类别',
      data: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六', '分类七'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: 'value',
      name: '销量'
    }],
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'bar',
      stack: 'group',
      data: data.series[i].data,
      label: {
        normal: {
          show: true,
          position: 'insideTop'
        }
      }
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.xAxis[0].name = data.xAxis.name;
  option.xAxis[0].data = data.xAxis.data;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].axisLabel = data.yAxis.axisLabel;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 堆叠柱状图-堆叠百分比
 */
myChart.initStack3 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '堆叠柱状图-堆叠数值',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      name: '类别',
      data: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六', '分类七'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: 'value',
      name: '销量',
      max: 100,
      axisLabel: {
        formatter: '{value} %'
      }
    }],
    series: []
  };

  //获取分类下的总和值
  var _temp = [];
  for (var i = 0; i < data.xAxis.data.length; i++) {
    var num = 0;
    for (var j = 0; j < data.series.length; j++) {
      num += data.series[j].data[i];
    }
    _temp.push(num);
  }

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    //处理图例
    legendData.push(data.series[i].name);

    var arr = [];
    for (var j = 0; j < data.series[i].data.length; j++) {
      arr.push((data.series[i].data[j] / _temp[j] * 100).toFixed(2));
    }

    series.push({
      name: data.series[i].name,
      type: 'bar',
      stack: 'group',
      data: arr,
      label: {
        normal: {
          show: true,
          position: 'insideTop',
          formatter: '{c}%'
        }
      }
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.xAxis[0].name = data.xAxis.name;
  option.xAxis[0].data = data.xAxis.data;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].axisLabel.fontSize = data.yAxis.axisLabel.fontSize;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}

/**
 * 温度图
 */
myChart.initStack4 = function(td, dom, data, callback, hyperstr, theme, psheetname) {
  var option = {
    animation: true,
    title: {
      text: '温度图',
      left: 'center',
      itemGap: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    legend: {
      bottom: 0,
      align: 'left',
      data: []
    },
    grid: {
      top: 50,
      bottom: 35,
      left: '2%',
      right: '2%',
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      name: '类别',
      data: ['分类一', '分类二', '分类三', '分类四', '分类五', '分类六', '分类七'],
      axisLabel: {
        interval: 0,
        rotate: 0
      }
    }],
    yAxis: [{
      type: 'value',
      name: '销量'
    }],
    series: []
  };

  var legendData = [];
  var series = [];
  for (var i = 0; i < data.series.length; i++) {
    legendData.push(data.series[i].name);
    series.push({
      name: data.series[i].name,
      type: 'bar',
      stack: 'group',
      data: data.series[i].data,
      label: {
        normal: {
          show: true,
          position: 'insideTop'
        }
      }
    });
  }
  option.legend=$.extend(option.legend, data.legend);
  option.title=$.extend(option.title, data.title);
  option.grid=$.extend(option.grid, data.grid);
  option.legend.data = legendData;
  option.backgroundColor = data.backgroundColor;
  option.xAxis[0].name = data.xAxis.name;
  option.xAxis[0].data = data.xAxis.data;
  option.yAxis[0].name = data.yAxis.name;
  option.yAxis[0].axisLabel = data.yAxis.axisLabel;
  option.xAxis[0].axisLabel.fontSize = data.xAxis.axisLabel.fontSize;
  option.series = series;

  // 缩放设置字体大小
  if (!!option.title.textStyle && !!option.title.textStyle.fontSize) {
    option.title.textStyle.fontSize = Math.round(option.title.textStyle.fontSize * td.attr("vr"));
    option.legend.textStyle.fontSize = Math.round(option.legend.textStyle.fontSize * td.attr("vr"));
    option.xAxis[0].axisLabel.fontSize = Math.round(option.xAxis[0].axisLabel.fontSize * td.attr("vr"));
    option.yAxis[0].axisLabel.fontSize = Math.round(option.yAxis[0].axisLabel.fontSize * td.attr("vr"));
  }

  //动态设置画布容器的大小
  var ele = td.find("#"+dom)[0];
  ele.style.width = Math.round(data.width * td.attr("hr")) + 'px';
  ele.style.height = Math.round(data.height * td.attr("vr")) + 'px';

  var chart = echarts.init(ele, theme);
  chart.setOption(option);
  chart.on('click', function(params) {
    var o;
    try {
      o = eval('(' + callback + ')');
    } catch (e) {
      console.log(callback + ' is undefined');
    }
    if (o) {
      o(params, hyperstr, psheetname);
    }
  });
}