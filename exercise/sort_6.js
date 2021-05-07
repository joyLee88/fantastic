// 字符串中按照字母出现字数排序
let str = 'akdKAAasIesadeksdEeaaiiii';
str = str.toLowerCase();
const json = {};
const objArr = [];
for (let i = 0; i < str.length; i++) {
    console.log(json[str[i]])
    json[str[i]] = json[str[i]] ? ++json[str[i]] : 1;
}
for (let w in json) {
    objArr.push({ key: w, time: json[w] });
}
// 从小到大排序
objArr.sort((obj1, obj2) => obj1.time - obj2.time);
console.log(objArr)
