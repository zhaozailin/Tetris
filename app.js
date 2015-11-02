/**
 * Created by zhaozl on 2015/11/2.
 */
(function(block) {
    var curBlock = block.create();

    $(".t-wrapper").append(curBlock);

    $("body").keydown(function(e) {

        // 方向控制
        switch(e.which) {
            case 37: block.left(curBlock); break;
            case 38: block.up(curBlock); break;
            case 39: block.right(curBlock); break;
            case 40: block.down(curBlock); break;
        }
    });
})(block);