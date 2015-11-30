/**
 * Created by zhaozl on 2015/11/2.
 * 方块工厂类
 */
var blockFactory = (function(Block) {

    // 随机产生一组坐标
    // rotate：旋转方式，1-正常顺时针，2-先顺再逆，3-不转
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
        return "#" + Math.floor(Math.random() * (999 - 100) + 100);
    };

    // 构建一个block块
    var _buildBlock = function() {
        var coordinateInfo = _randomCoordinate();
        var coordinate = coordinateInfo.coordinate;

        var els = [];
        for (var i = 0; i < coordinate.length; i++) {
            var el = document.createElement("div");
            el.className = "t-element";
            el.style.left =  coordinate[i].x + "px";
            el.style.top =  coordinate[i].y + "px";
            var x = _randomColor();
            $(el).css("background", x);
            els.push(el);
        }

        return new Block(els, coordinateInfo);
    };

    // 调整位置
    var _adjustPosition = function(curBlock) {
        var coordinate = curBlock.coordinateInfo.coordinate;
        var els = curBlock.els;
        for (var i = 0; i < coordinate.length; i++) {
            coordinate[i].x += 60;
            coordinate[i].y += 40;
            els[i].style.left =  coordinate[i].x + "px";
            els[i].style.top =  coordinate[i].y + "px";
        }
    };

    // 下一个方块
    var nextBlock = null;

    // 创建一个随机形状的块(工厂模式)
    var create = function() {
        var curBlock = nextBlock;

        // 调整开始位置
        _adjustPosition(curBlock);

        // 构建下一个方块
        nextBlock = _buildBlock();

        // 预览
        $(".t-preview").html(nextBlock.els);

        return curBlock;
    };

    // 创建第一个方块
    var createFirst = function() {
        nextBlock = _buildBlock();
    };

    return {
        create: create,
        createFirst: createFirst
    };
})(Block);