/**
 * Created by zhaozl on 2015/11/2.
 */
var block = (function() {

    // 创建一个随机形状的块
    var create = function() {
        var coordinateInfo = _randomCoordinate();
        var coordinate = coordinateInfo.coordinate;

        var els = [];
        for (var i = 0; i < coordinate.length; i++) {
            var el = document.createElement("div");
            el.className = "t-element";
            el.style.left =  coordinate[i].x + "px";
            el.style.top =  coordinate[i].y + "px";
            els.push(el);
        }

        return {els: els, coordinateInfo: coordinateInfo};
    };

    // 随机产生一组坐标
    _randomCoordinate = function() {
        switch(Math.floor((Math.random() * 10))) {

            // Z形
            case 0:
                return {coordinate: [{x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}, {x: 0, y: 40}], originIdx: 2};

            // 山形
            case 1:
                return {coordinate: [{x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}], originIdx: 2};

            // 短一形
            case 2:
                return {coordinate: [{x: 0, y: 0}, {x: 20, y: 0}, {x: 40, y: 0}], originIdx: 1};

            // 默认为短一形
            default:
                return {coordinate: [{x: 0, y: 0}, {x: 20, y: 0}, {x: 40, y: 0}], originIdx: 1};
        }
    };

    // 转化坐标
    // 转化逻辑：根据转动圆心的坐标算出相对圆心的相对坐标，然后通过公式：(a,b)-->(b,-a)，最后通过加上圆心坐标算出最终的坐标
    // coord：待转化的坐标
    // origin：圆心坐标
    var _transform = function(old, origin) {
        var tmp = [old[1] - origin[1], origin[0] - old[0]];

        // 最后left要-20，因为原本以x渲染block，最后以x-20渲染block，渲染基点发生变化
        return [tmp[0] + origin[0], tmp[1] + origin[1] - 20];
    };

    // 上(变形)
    var up = function(block) {

        // 原始坐标数组
        var coordinate = block.coordinateInfo.coordinate;
        console.log(coordinate);

        // 原始坐标零点索引
        var originIdx = block.coordinateInfo.originIdx;

        // 圆心坐标
        var oldOrigin = coordinate[originIdx];
        var newOrigin = [oldOrigin.y + 10, oldOrigin.x + 10];

        for (var i = 0; i < coordinate.length; i++) {
            if (i !== originIdx) {
                var old = [coordinate[i].y, coordinate[i].x];

                // 转化坐标
                var newer = _transform(old, newOrigin);

                block.els[i].style.top = newer[0] + "px";
                block.els[i].style.left = newer[1] + "px";

                // 同步坐标
                coordinate[i].x = newer[1];
                coordinate[i].y = newer[0];
            }
        }
    };

    // 向左移动
    var left = function(block) {
        var coordinate = block.coordinateInfo.coordinate;
        for (var i = 0; i < block.els.length; i++) {
            var curX = parseInt(block.els[i].style.left.slice(0, -2)) - 20;
            block.els[i].style.left = curX + "px";

            // 同步更新坐标
            coordinate[i].x = curX;
        }
    };

    // 向右移动
    var right = function(block) {
        var coordinate = block.coordinateInfo.coordinate;
        for (var i = 0; i < block.els.length; i++) {
            var curX = parseInt(block.els[i].style.left.slice(0, -2)) + 20;
            block.els[i].style.left = curX + "px";

            // 同步更新坐标
            coordinate[i].x = curX;
        }
    };

    // 向下移动
    var down = function(block, maxHeight) {
        var coordinate = block.coordinateInfo.coordinate;

        // 根据最后一个元素进行边界检查
        var lastEl = coordinate[coordinate.length - 1];
        if (lastEl.y >= maxHeight - 20) {
            return;
        }

        for (var i = 0; i < block.els.length; i++) {
            var curY = parseInt(block.els[i].style.top.slice(0, -2)) + 20;

            block.els[i].style.top = curY + "px";

            // 同步更新坐标
            coordinate[i].y = curY;
        }
    };

    return {
        create: create,
        left: left,
        up: up,
        right: right,
        down: down
    };
})();