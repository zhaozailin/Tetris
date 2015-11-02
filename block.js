/**
 * Created by zhaozl on 2015/11/2.
 */
var block = (function() {

    // 创建一个随机形状的块
    var create = function() {
        var elCoords = [{x: 20, y: 0}, {x: 0, y: 20}, {x: 20, y: 20}, {x: 40, y: 20}];
        var elDoms = [];

        for (var i = 0; i < elCoords.length; i++) {
            var el = document.createElement("div");
            el.className = "t-element";
            el.style.left =  elCoords[i].x + "px";
            el.style.top =  elCoords[i].y + "px";
            elDoms.push(el);
        }

        return elDoms;
    };

    // 向左移动
    var left = function(block) {
        for (var i = 0; i < block.length; i++) {
            block[i].style.left = parseInt(block[i].style.left.slice(0, -2)) - 20 + "px";
        }
    };

    // 上(变形)
    var up = function(block) {
        for (var i = 0; i < block.length; i++) {
            block[i].style.top = parseInt(block[i].style.top.slice(0, -2)) + 20 + "px";
        }
    };

    // 向右移动
    var right = function(block) {
        for (var i = 0; i < block.length; i++) {
            block[i].style.left = parseInt(block[i].style.left.slice(0, -2)) + 20 + "px";
        }
    };

    // 向下移动
    var down = function(block) {
        for (var i = 0; i < block.length; i++) {
            block[i].style.top = parseInt(block[i].style.top.slice(0, -2)) + 20 + "px";
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