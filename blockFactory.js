/**
 * Created by zhaozl on 2015/11/2.
 * 方块工厂类
 */
var blockFactory = (function(Block) {

    // 随机产生一组坐标
    // rotate：旋转方式，0-不转，1-正常顺时针，2-先顺再逆
    var _randomCoordinate = function() {
        switch(Math.floor((Math.random() * 10))) {

            // Z形
            case 0:
                return {
                    coordinate: [{x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}, {x: 0, y: 40}],
                    originIdx: 2,
                    rotate: 2
                };

            // 山形
            case 1:
                return {
                    coordinate: [{x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}],
                    originIdx: 2,
                    rotate: 1
                };

            // 短一形
            case 2:
                return {
                    coordinate: [{x: 0, y: 0}, {x: 20, y: 0}, {x: 40, y: 0}],
                    originIdx: 1,
                    rotate: 1
                };

            // 长一形
            case 3:
                return {
                    coordinate: [{x: 0, y: 0}, {x: 20, y: 0}, {x: 40, y: 0}, {x: 60, y: 0}],
                    originIdx: 2,
                    rotate: 2
                };

            // 小正方形
            case 4:
                return {
                    coordinate: [{x: 0, y: 0}, {x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}],
                    originIdx: 0,
                    rotate: 3
                };

            // 大正方形
            case 5:
                return {
                    coordinate: [{x: 0, y: 0}, {x: 20, y: 0}, {x: 40, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}, {x: 0, y: 40}, {x: 20, y: 40}, {x: 40, y: 40}],
                    originIdx: 4,
                    rotate: 1
                };

            // 点
            case 6:
                return {
                    coordinate: [{x: 0, y: 0}],
                    originIdx: 0,
                    rotate: 3
                };

            // L形
            case 7:
                return {
                    coordinate: [{x: 0, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}],
                    originIdx: 2,
                    rotate: 1
                };

            // 默认为短一形
            default:
                return {
                    coordinate: [{x: 0, y: 0}, {x: 20, y: 0}, {x: 40, y: 0}],
                    originIdx: 1,
                    rotate: 1
                };
        }
    };

    // 随机产生一个颜色
    var _randomColor = function() {
        console.log(Math.floor((Math.random() * 1000)));
        return "#" + Math.floor((Math.random() * 1000));
    };

    // 创建一个随机形状的块(工厂模式)
    var create = function() {
        var coordinateInfo = _randomCoordinate();
        var coordinate = coordinateInfo.coordinate;

        var els = [];
        for (var i = 0; i < coordinate.length; i++) {
            var el = document.createElement("div");
            el.className = "t-element";
            el.style.left =  coordinate[i].x + "px";
            el.style.top =  coordinate[i].y + "px";
            var x = _randomColor();
            console.log(x);
            $(el).css("background", x);
            els.push(el);
        }

        return new Block(els, coordinateInfo);
    };

    return {
        create: create
    };
})(Block);