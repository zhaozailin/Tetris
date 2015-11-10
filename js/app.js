/**
 * Created by zzl on 2015/11/9.
 */
$(document).ready(function() {

    // 兼容IE8的indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (el) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === el) {
                    return i;
                }
            }
            return -1;
        };
    }

    border.init();
});