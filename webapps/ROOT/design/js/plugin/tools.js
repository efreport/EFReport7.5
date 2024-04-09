//最小值
Array.prototype.min = function () {
    var min = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] < min) {
            min = this[i];
        }
    }
    return min;
}
//最大值
Array.prototype.max = function () {
    var max = this[0];
    var len = this.length;
    for (var i = 1; i < len; i++) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
}
//求和
Array.prototype.sum = function () {
    var sum = 0;
    var len = this.length;
    for (var i = 0; i < len; i++) {
        sum += this[i];
    }
    return sum;
}
//数组去重
Array.prototype.distinct = function () {
    var self = this;
    var _a = this.concat().sort();
    _a.sort(function (a, b) {
        if (a == b) {
            var n = self.indexOf(a);
            self.splice(n, 1);
        }
    });
    return self;
}
//检查值是否存在数组中
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}