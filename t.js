/**
 * Created by zzl on 2015/11/8.
 */
var T = function() {
    var _a = function() {
        console.log("123");
    };

    this.a = function() {
        _a();
    }
};

T.prototype.b = function() {
    console.log(321);
};

var s = [{a: 1}, {b: 2}];

for (var i = 0; i < s.length; i++) {
    console.log(11);
    //s.push({x : 1});
}

console.log(s);