/**
 * Created by zhaozl on 2015/11/2.
 */
var border = (function(blockFactory) {

    // 定时器
    var timer = null;

    // 总分
    var totalScore = 0;

    var config = {
        maxHeight: 380,
        minWidth: 0,
        maxWidth: 200,
        speed: 400
    };

    var activeBlock = null;

    // 存储落地方块的集合
    var fallBlocks = [];

    // 将方块对象转为fallBlocks元素
    var _insertFallBlocks = function(block) {
        var coordinate = block.coordinateInfo.coordinate;
        for (var i = 0; i < block.els.length; i++) {
            fallBlocks.push({el: block.els[i], coordinate: coordinate[i]});
        }
    };

    // 检测是否game over
    var _checkGameOver = function(block) {
        var coordinate = block.coordinateInfo.coordinate;
        for (var i = 0; i < coordinate.length; i++) {
            if (coordinate[i].y < 60) {
                return true;
            }
        }
        return false;
    };

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
            _insertFallBlocks(block);

            // 检测满行
            _handleFullRow(block);

            // 检测是否game over
            if (_checkGameOver(block)) {
                clearInterval(timer);
                alert("game over");
                return;
            }

            // 创建一个新的方块
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

    // 清理fallBlocks
    var _clearFallBlocks = function(fullBlockIdx) {
        var newFallBlocks = [];
        for (var i = 0; i < fallBlocks.length; i++) {
            var tmpBlock = fallBlocks[i];

            if (fullBlockIdx.indexOf(i) !== -1) {
                $(tmpBlock.el).remove();
            }
            else {
                newFallBlocks.push(tmpBlock);
            }
        }

        // 重置新的fallBlocks
        fallBlocks = newFallBlocks;
    };

    // 处理满行
    var _handleFullRow = function(block) {

        // 获取当前方块中所有的坐标y的集合
        var ys = [];
        var coordinate = block.coordinateInfo.coordinate;
        for (var i = 0; i < coordinate.length; i++) {
            if (ys.indexOf(coordinate[i].y) === -1) {
                ys.push(coordinate[i].y);
            }
        }

        // 满行的行数
        var rowNum = 0;

        // 满行的y坐标
        var fullYs = [];

        // 分别判断每个y是否存在满行
        for (var i = 0; i < ys.length; i++) {
            var curY = ys[i];

            // 检测y坐标是否满行
            var fullBlockIdx = _checkFullRow(curY);
            if (fullBlockIdx.length > 0) {
                rowNum++;

                // 清理fallBlocks
                _clearFallBlocks(fullBlockIdx);

                fullYs.push(curY);
            }
        }

        // 满行以上的元素下降20 * rowNum像素
        if (rowNum > 0) {

            // 首先计算出被消除el的最小的y
            var minY = Math.min.apply(window, fullYs);

            // 将y坐标小于minY的el下移20 * rowNum
            for (var i = 0; i < fallBlocks.length; i++) {
                var tmpBlock = fallBlocks[i];
                var tmpCoordinate = tmpBlock.coordinate;
                if (tmpCoordinate.y < minY) {
                    tmpCoordinate.y = tmpCoordinate.y + 20 * rowNum;
                    tmpBlock.el.style.top = tmpCoordinate.y + "px";
                }
            }

            // 累计得分
            totalScore += 10 * rowNum;
            $(".t-score").html(totalScore);
        }
    };

    // 检测y坐标是否满行
    var _checkFullRow = function(curY) {

        // 存储满行元素的索引，用于清理fallBlocks集合
        var fullBlockIdx = [];

        var span = config.maxWidth - config.minWidth;
        var elAmount = span / 20;

        // 是否满行
        var fullFlag = true;

        for (var i = 0; i < elAmount; i++) {

            // 需要检测的点
            var detectCoordinate = {x: 0 + 20 * i, y: curY};

            var existFlag = false;
            for (var j = 0; j < fallBlocks.length; j++) {
                var tmpBlock = fallBlocks[j];
                var tmpCoordinate = tmpBlock.coordinate;
                if (detectCoordinate.x === tmpCoordinate.x && detectCoordinate.y === tmpCoordinate.y) {
                    existFlag = true;
                    fullBlockIdx.push(j);
                    break;
                }
            }

            // 不存在满行
            if (!existFlag) {
                fullFlag = false;
                break;
            }
        }

        // 存在满行的索引
        if (fullFlag) {
            return fullBlockIdx;
        }

        return [];
    };

    // 检查碰撞
    var _checkEncounter = function(tryCoordinate) {
        for (var i = 0; i < fallBlocks.length; i++) {
            var coordinate = fallBlocks[i].coordinate;
            for (var k = 0; k < tryCoordinate.length; k++) {

                // 发生碰撞
                if (tryCoordinate[k].y === coordinate.y && tryCoordinate[k].x === coordinate.x) {
                    return true;
                }
            }
        }
        return false;
    };

    // 改变形状
    var changeShape = function(block) {

        // 不变形的类型
        if (block.coordinateInfo.rotate === 3) {
            return;
        }

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

        // 创建第一个方块
        blockFactory.createFirst();

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

        // 监听开始
        $("button[name=start]").click(function() {
            $(this).attr("disabled", "disabled");
            $("button[name=stop]").attr("disabled", false);
            timer = setInterval(function() {
                move(activeBlock, "down")
            }, config.speed);
        });

        // 监听暂停
        $("button[name=stop]").click(function() {
            $(this).attr("disabled", "disabled");
            $("button[name=start]").attr("disabled", false);
            clearInterval(timer);
        });
    };

    return {
        init: init
    };
})(blockFactory);