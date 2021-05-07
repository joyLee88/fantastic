/*将 rgb 颜色字符串转换为十六进制的形式，如 rgb(255, 255, 255) 转为 #ffffff
1. rgb 中每个 , 后面的空格数量不固定
2. 十六进制表达式使用六位小写字母
3. 如果输入不符合 rgb 格式，返回原始输入
*/
function rgb2hex(sRGB) {
    const reg = /^(rgb|RGB)\((\d+),\s*(\d+),\s*(\d+)\)$/;
    const ret = sRGB.match(reg);
    if (!ret) return sRGB;
    let str = '#';
    for (let i = 2; i < 5; i++) {
        const m = parseInt(ret[i]);
        if (m >= 0 && m <= 255) {
            str += (m < 16 ? '0' + m.toString(16) : m.toString(16));
        } else {
            return sRGB;
        }
    }
    return str;
}

/*封装函数 f，使 f 的 this 指向指定的对象
*/
function bindThis(f, oTarget) {
    return function() {
        return f.apply(oTarget, arguments)
    }
}
function test() {
    var r = bindThis(function(a, b){return this.test + a + b}, {test: 2})(2, 3);
    return r === 7; 
}
test();