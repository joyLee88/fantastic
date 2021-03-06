/*
给定一个单词列表，我们将这个列表编码成一个索引字符串 S 与一个索引列表 A。

例如，如果这个列表是 ["time", "me", "bell"]，我们就可以将其表示为 S = "time#bell#" 和 indexes = [0, 2, 5]。

对于每一个索引，我们可以通过从字符串 S 中索引的位置开始读取字符串，直到 "#" 结束，来恢复我们之前的单词列表。

那么成功对给定单词列表进行编码的最小字符串长度是多少呢？

示例：

输入: words = ["time", "me", "bell"]
输出: 10
说明: S = "time#bell#" ， indexes = [0, 2, 5] 。
 

提示：

1 <= words.length <= 2000
1 <= words[i].length <= 7
每个单词都是小写字母 。


那么！
    将重复的单词压缩，也就是先将长度长的单词拼接成字符串，然后短的字符串来判断是否已经有存在的，如果没有则继续拼接。
*/

// Solution One
 /**
 * @param {string[]} words
 * @return {number}
 */

function wordEncodeCompress(words) {
    words.sort((a,b) => { return b.length > a.length})
    console.log(words)
    let str = ""
    for(let i = 0; i < words.length; i++){
        if(str.indexOf((words[i] + "#")) === -1){
            str += words[i] + "#"
        }
    }
    console.log(str)
    return str.length
};
console.log(wordEncodeCompress(['time', 'me', 'bell']))