/**
 * Created by zhaozl on 2015/11/2.
 */
var Block = function(els, coordinateInfo) {
    this.els = els;
    this.coordinateInfo = coordinateInfo;

    // 上一次旋转类型（默认为逆时针），-1：逆时针，1：顺时针
    this.lastRotateType = -1;

    // 获取最左边元素坐标
    var _getLeftCoordinate = function() {
        var coordinate = coordinateInfo.coordinate;

        var idx = 0;
        var left = coordinate[0].x;
        for (var i = 0; i < coordinate.length; i++) {
            if (coordinate[i].x < left) {
                idx = i;
                left = coordinate[i].x;
            }
        }

        return coordinate[idx];
    };

    // 获取最右边元素坐标
    var _getRightCoordinate = function() {
        var coordinate = coordinateInfo.coordinate;

        var idx = 0;
        var right = 0;
        for (var i = 0; i < coordinate.length; i++) {
            if (coordinate[i].x > right) {
                idx = i;
                right = coordinate[i].x;
            }
        }

        return coordinate[idx];
    };

    // 默认最底部的元素为方块的最后一个，每次变形重置
    this.bottomCoordinate = coordinateInfo.coordinate[coordinateInfo.coordinate.length - 1];

    // 获取最右边元素坐标
    this.rightCoordinate = _getRightCoordinate();

    // 获取最左边元素坐标
    this.leftCoordinate = _getLeftCoordinate();

    // 转化坐标
    // 转化逻辑：根据转动圆心的坐标算出相对圆心的相对坐标，然后通过公式：(a,b)-->(b,-a)，最后通过加上圆心坐标算出最终的坐标
    // coord：待转化的坐标
    // origin：圆心坐标
    // type: -1为逆时针，1为顺时针
    var _transform = function(old, origin, type) {
        if (type === 1) {
            var tmp = [old[1] - origin[1], origin[0] - old[0]];

            // 最后left要-20，因为原本以x渲染block，最后以x-20渲染block，渲染基点发生变化
            return [tmp[0] + origin[0], tmp[1] + origin[1] - 20];
        }
        else {
            var tmp = [origin[1] - old[1], old[0] - origin[0]];

            // 最后left要-20，因为原本以x渲染block，最后以x-20渲染block，渲染基点发生变化
            return [tmp[0] + origin[0] - 20, tmp[1] + origin[1]];
        }
    };

    // 变形
    this.changeShape = function(tryCoordinate) {

        // 原始坐标数组
        var coordinate = this.coordinateInfo.coordinate;

        // 原始坐标零点索引
        var originIdx = this.coordinateInfo.originIdx;

        var leftIdx = 0;
        var leftX = coordinate[0].x;

        var rightIdx = 0;
        var rightX = 0;

        var bottomIdx = 0;
        var bottomY = 0;

        for (var i = 0; i < tryCoordinate.length; i++) {
            if (i !== originIdx) {
                this.els[i].style.left = tryCoordinate[i].x + "px";
                this.els[i].style.top = tryCoordinate[i].y + "px";

                // 同步坐标
                coordinate[i].x = tryCoordinate[i].x;
                coordinate[i].y = tryCoordinate[i].y;

                if (coordinate[i].y >= bottomY) {
                    bottomIdx = i;
                    bottomY = coordinate[i].y;
                }

                if (coordinate[i].x >= rightX) {
                    rightIdx = i;
                    rightX = coordinate[i].x;
                }

                if (coordinate[i].x <= leftX) {
                    leftIdx = i;
                    leftX = coordinate[i].x;
                }
            }
        }

        // 每次变形都计算出最底部的元素坐标、最右边的元素坐标、最左边的元素坐标
        this.bottomCoordinate = coordinate[bottomIdx];
        this.rightCoordinate = coordinate[rightIdx];
        this.leftCoordinate = coordinate[leftIdx];

        // 设置最新一次的旋转类型
        if (this.coordinateInfo.rotate === 2) {
            this.lastRotateType = -this.lastRotateType;
        }
    };

    // 尝试变形
    this.tryChange = function() {
        var tryCoordinate = [];

        // 原始坐标数组
        var coordinate = this.coordinateInfo.coordinate;

        // 原始坐标零点索引
        var originIdx = this.coordinateInfo.originIdx;

        // 圆心坐标
        var oldOrigin = coordinate[originIdx];
        var newOrigin = [oldOrigin.y + 10, oldOrigin.x + 10];

        for (var i = 0; i < coordinate.length; i++) {
            if (i !== originIdx) {
                var old = [coordinate[i].y, coordinate[i].x];

                // 转化坐标
                var newer = null;

                // 正常顺时针
                if (this.coordinateInfo.rotate === 1) {
                    newer = _transform(old, newOrigin, 1);
                }

                // 先正再逆
                else if (this.coordinateInfo.rotate === 2) {
                    newer = _transform(old, newOrigin, -this.lastRotateType);
                }

                tryCoordinate.push({x: newer[1], y: newer[0]});
            }
            else {
                tryCoordinate.push({x: coordinate[i].x, y: coordinate[i].y});
            }
        }

        return tryCoordinate;
    };

    // 尝试移动
    this.tryMove = function(direction) {
        var coordinate = this.coordinateInfo.coordinate;
        var tryCoordinate = [];
        for (var i = 0; i < coordinate.length; i++) {
            switch(direction) {
                case "right":
                    tryCoordinate.push({x: coordinate[i].x + 20, y: coordinate[i].y}); break;
                case "left":
                    tryCoordinate.push({x: coordinate[i].x - 20, y: coordinate[i].y}); break;
                case "down":
                    tryCoordinate.push({x: coordinate[i].x, y: coordinate[i].y + 20}); break;
            }
        }
        return tryCoordinate;
    };

    // 发生移动
    this.move = function(tryCoordinate, direction) {
        for (var i = 0; i < tryCoordinate.length; i++) {
            switch(direction) {
                case "down":
                    this.els[i].style.top = tryCoordinate[i].y + "px"; break;
                case "left":
                    this.els[i].style.left = tryCoordinate[i].x + "px"; break;
                case "right":
                    this.els[i].style.left = tryCoordinate[i].x + "px"; break;
            }
        }

        // 同步更新坐标
        var coordinate = this.coordinateInfo.coordinate;
        for (var i = 0; i < coordinate.length; i++) {
            coordinate[i].x = tryCoordinate[i].x;
            coordinate[i].y = tryCoordinate[i].y;
        }
    };
};