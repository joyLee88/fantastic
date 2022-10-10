/*
最近想了想，怎么把十六进制按照自己的理解转换为二进制，再转换为10进制
    #ffffff  #fff
    16进制是0-9-a-f
    6位数，每2位转一个十进制数
        ff -> 11111111 -> 255
        前四位是后四位的16倍
        15*16 + 15 = 255
    
    所以由这个思路，写下逻辑代码
*/
let str = 'a1'; 
const o = {
    a: 10, A: 10, b: 11, B: 11, c: 12, C: 12, d: 13, D: 13, e: 14,E: 14, f: 15, F: 15
}
if (str.length == 1) str += str;
let num = 0;
for (let i = 0; i < str.length; i++) {
    let n = o[str[i]] ? o[str[i]] : str[i];
    n = parseInt(n);
    if (i == 0) {
        num += (n * 16);
    } else {
        num += n;
    }
} console.log(num)