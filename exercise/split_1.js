// 华为 字符串分隔
/*•连续输入字符串，请按长度为8拆分每个字符串后输出到新的字符串数组；
•长度不是8整数倍的字符串请在后面补数字0，空字符串不处理。
连续输入字符串(输入多次,每个字符串长度小于100)
输出到长度为8的新字符串数组
*/

// Readline是Node.js里实现标准输入输出的封装好的模块，通过这个模块我们可以以逐行的方式读取数据流。
// 使用require(“readline”)可以引用模块。
var readline = require("readline");
//创建readline接口实例
const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// ‘line’事件，这个事件就是在用户输完一行，按下回车后就会触发的事件.
// 它会将用户输入的数据通过回调函数传回来，可在此方法里处理用户输入的数据
r1.on('line', function (line) {
    if (line.length <= 8) {
        let result = line
        for (let j = 0; j < 8 - (line.length); j++) {
            result = result + '0'
        }
        console.log(result)
    } else {
        let num = 0
        for (let n = 0; n < (line.length / 8 - 1); n++) {
            console.log(line.slice(n * 8, (n + 1) * 8))
            num++
        }
        let strTail = line.slice(num * 8)
        for (let k = 0; k < (8 - line.slice(num * 8).length); k++) {
            strTail = strTail + '0'
        }
        console.log(strTail)
    }
});


while (str = readline()) {
    str += '0000000';
    const len = Math.floor(str.length / 8);
    for (let i = 0; i < len; i++) {
        console.log(str.substr(i * 8, 8))
    }
}