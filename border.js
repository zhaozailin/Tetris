/**
 * Created by zhaozl on 2015/11/2.
 */
var border = (function(blockFactory) {

    var config = {
        maxHeight: 280,
        minWidth: 0,
        maxWidth: 400
    };

    var activeBlock = null;

    // 存储落地方块的集合
    var fallBlocks = [];

    // 触发移动
    var move = function(block, direction) {

        // 尝试移动一位
        var tryCoordinate = block.tryMove(direction);

        // 移动方向不同，边界检查条件不同
        var boundaryCheck = false;
        switch(direction) {
            case "left":
                boundaryCheck = block.leftCoordinate.x <= config.minWidth; break;
            case "right":
                boundaryCheck = block.rightCoordinate.x >= config.maxWidth - 20; break;
            case "down":
                boundaryCheck = block.bottomCoordinate.y >= config.maxHeight - 20; break;
        }

        // 向下移动到达底线或发生碰撞时创建新的方块实例
        if (direction === "down" && (boundaryCheck || _checkEncounter(tryCoordinate))) {
            fallBlocks.push(block);
            _renderBlock();
            return;
        }

        // 向其他方向移动or变化到达底线或发生碰撞时直接return
        if (direction !== "down" && (boundaryCheck || _checkEncounter(tryCoordinate))) {
            return;
        }

        // 开始移动
        block.move(tryCoordinate, direction);
    };

    // 检查碰撞
    var _checkEncounter = function(tryCoordinate) {
        for (var i = 0; i < fallBlocks.length; i++) {
            var coordinate = fallBlocks[i].coordinateInfo.coordinate;
            for (var j = 0; j < coordinate.length; j++) {
                var tmp = coordinate[j];
                for (var k = 0; k < tryCoordinate.length; k++) {

                    // 发生碰撞
                    if (tryCoordinate[k].y === tmp.y && tryCoordinate[k].x === tmp.x) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // 改变形状
    var changeShape = function(block) {

        // 尝试改变
        var tryCoordinate = block.tryChange();

        var boundaryCheck = false;
        for (var i = 0; i < tryCoordinate.length; i++) {

            // 是否穿过左边界、右边界、下边界
            if (tryCoordinate[i].x < config.minWidth || tryCoordinate[i].x >= config.maxWidth || tryCoordinate[i].y >= config.maxHeight) {
                boundaryCheck = true;
                break;
            }
        }

        if (boundaryCheck || _checkEncounter(tryCoordinate)) {
            return;
        }

        // 变形
        block.changeShape(tryCoordinate);
    };

    // 渲染一个方块
    var _renderBlock = function() {
        activeBlock = blockFactory.create();
        $(".t-wrapper").append(activeBlock.els);
    };

    // 初始化
    var init = function() {

        // 渲染一个方块实例
        _renderBlock();

        $("body").keydown(function(e) {

            // 方向控制
            switch(e.which) {
                case 37:
                    move(activeBlock, "left"); break;
                case 38:
                    changeShape(activeBlock); break;
                case 39:
                    move(activeBlock, "right"); break;
                case 40:
                    move(activeBlock, "down"); break;
            }
        });
    };

    return {
        init: init
    };
})(blockFactory);