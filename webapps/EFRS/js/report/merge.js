/**
 * 报表单元格合并 JS
 *
 * */

/**
 * 合并单元格
 * cell 单元格属性
 * td 有合并属性的单元格
 * colCount colspan 合并列
 * rowCount rowspan 合并行
 * oid 表格ID
 * x 单元格x坐标
 * y 单元格y坐标
 * globalRatio 报表放大比率
 * */
function mergeCell(cell, td, tableId, x, y) {

    let G = cell.G;
    let colCount = G[0]; // colspan 列合并数
    let rowCount = G[1]; // rowspan 行合并数
    let width = G[2]; //原始高度
    let height = G[3]; //原始宽度
    let colSpan = colCount;
    let rowSpan = rowCount;
    if (colCount > 1) { //有列合并时
        let spanCell = null;
        let totalWidth = td.width(); //单元格实际宽度
        let totalOWidth = parseInt(td.attr('ow'));//单元格原始宽度

        for (let m = 1; m < colCount; m++) { //0
            let tdId = tableId + '_' + y + '_' + (x+m); //当前TD 的id
            spanCell = $('#' + tdId);
            let display = spanCell.css('display'); //此单元格是否隐藏
            //隐藏时，合并列数需要减1
            if (display == 'none' || (spanCell.attr('ow') == 0)) {
                colSpan--;
            } else { //统计合并后单元格的高度和宽度
                totalWidth = totalWidth + parseInt(spanCell.attr('ow'));
                totalOWidth = totalOWidth + parseInt(spanCell.attr('ow'));
            }
            //被合并的单元格需要从表格中删除掉
            for (let n = 0; n < rowCount; n++) {
                let id = tableId + '_' + (y+n) + '_' + (x+m);
                $('#' + id).remove();
            }
        }
        td.attr("colspan", colSpan).css("width", totalWidth).attr("ow", totalOWidth);
        td.find('div').css("width", totalWidth); //修改合并后单元格的宽度
        td.find('div').find('span').css("width", totalWidth); //如果有合并属性，需要重新给td下的span赋值 ， whj
        td.find('div').find('span').find('iframe').attr('ow', totalWidth); //如果是插件的话，需要重新赋予ow值
    }
    if (rowCount > 1) { //有行合并时
        let spanCell;
        //let totalHeight = parseInt(td.attr('oh')); //合并后的高度
        let totalHeight = td.height();//单元格实际高度
        let totalOHeight = parseInt(td.attr('oh'));//单元格原始高度
        for (let m = 1; m < rowCount; m++) {
            let tdId = tableId + '_' + (y+m) + '_' + x; //当前TD 的id
            spanCell = $('#' + tdId);

            let display = spanCell.css('display'); //此单元格是否隐藏
            if (display == 'none' || (spanCell.attr('oh') == 0)) {
                rowSpan--;
            } else {
                totalHeight = totalHeight + parseInt(spanCell.attr('oh'));
                totalOHeight = totalOHeight + parseInt(spanCell.attr('oh'));
            }
            for (let n = 0; n < colCount; n++) {
                let id = tableId + '_' + (y+m) + '_' + (x+n); //当前TD 的id
                $('#' + id).remove();
            }
        }
        td.attr("rowspan", rowSpan).css("height", totalHeight).attr("oh", totalOHeight);
        td.find('div').css("height", totalHeight); //如果有合并属性，需要重新给td下的span赋值 ， whj
        td.find('div').find('span').css("height", totalHeight);
        td.find('div').find('span').find('iframe').attr('oh', totalHeight); //如果是插件的话，需要重新赋予ow值

    }

}

function mergeWcpCell(cell, td, tableId, x, y , horizontalRatio , verticalRatio) {
    let G = cell.G;
    let colCount = G[0]; // colspan 列合并数
    let rowCount = G[1]; // rowspan 行合并数
    let width = G[2]; //原始高度
    let height = G[3]; //原始宽度
    let colSpan = colCount;
    let rowSpan = rowCount;
    if (colCount > 1) { //有列合并时
        let spanCell = null;
        let totalWidth = td.width(); //单元格实际宽度
        let totalOWidth = parseInt(td.attr('ow'));//单元格原始宽度

        for (let m = 1; m < colCount; m++) { //0
            let tdId = tableId + '_' + y + '_' + (x+m); //当前TD 的id
            spanCell = $('#' + tdId);
            let display = spanCell.css('display'); //此单元格是否隐藏
            //隐藏时，合并列数需要减1
            if (display == 'none' || (spanCell.attr('ow') == 0)) {
                colSpan--;
            } else { //统计合并后单元格的高度和宽度
                totalWidth = totalWidth + parseInt(spanCell.width());
                totalOWidth = totalOWidth + parseInt(spanCell.attr('ow'));
            }
            //被合并的单元格需要从表格中删除掉
            for (let n = 0; n < rowCount; n++) {
                let id = tableId + '_' + (y+n) + '_' + (x+m);
                $('#' + id).remove();
            }
        }
        td.attr("colspan", colSpan).css("width", totalWidth).attr("ow", totalOWidth);
        td.find('div').css("width", totalWidth); //修改合并后单元格的宽度
        td.find('div').find('span').css("width", totalWidth); //如果有合并属性，需要重新给td下的span赋值 ， whj
        td.find('div').find('span').find('iframe').attr('ow', totalWidth); //如果是插件的话，需要重新赋予ow值
    }
    if (rowCount > 1) { //有行合并时
        let spanCell;
        //let totalHeight = parseInt(td.attr('oh')); //合并后的高度
        let totalTDHeight = td.height();//单元格实际高度
        let totalTDOHeight = parseInt(td.attr('oh'));//单元格原始高度
        for (let m = 1; m < rowCount; m++) {
            let tdId = tableId + '_' + (y+m) + '_' + x; //当前TD 的id
            spanCell = $('#' + tdId);
            let display = spanCell.css('display'); //此单元格是否隐藏
            if (display == 'none' || (spanCell.attr('oh') == 0)) {
                rowSpan--;
            } else {
                totalTDHeight = totalTDHeight + parseInt(spanCell.height());
                totalTDOHeight = totalTDOHeight + parseInt(spanCell.attr('oh'));
            }
            for (let n = 0; n < colCount; n++) {
                let id = tableId + '_' + (y+m) + '_' + (x+n); //当前TD 的id
                $('#' + id).remove();
            }
        }
        td.attr("rowspan", rowSpan).css("height", totalTDHeight).attr("oh", totalTDOHeight);
        td.find('div').css("height", totalTDHeight); //如果有合并属性，需要重新给td下的span赋值 ， whj
        td.find('div').find('span').css("height", totalTDHeight);
        td.find('div').find('span').find('iframe').attr('oh', totalHeight); //如果是插件的话，需要重新赋予ow值

    }

}

