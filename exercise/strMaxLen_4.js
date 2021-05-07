// 最长公共字符串长度
/*
给出两个字符串，求出两个字符串公共字符串的最大长度
例如："acbbsdef","acbesdsd"
最大公共字符串长度为3；为acb
*/

function findComStr(str1, str2){
    let shorter = str1;
    let longer = str2;
    debugger
    if (str1.length > str2.length) {
        [shorter, longer] = [longer, shorter];
    }
    // 先用短字符串去遍历长字符串有没有；没有短字符串减1个，再去遍历长字符串。。。依次到一个字符
    for (let subLen = shorter.length; subLen > 0; subLen--) {
        for (let i = 0; i + subLen <= shorter.length; i++) {
            const subString = shorter.substring(i, i + subLen);
            if(longer.indexOf(subString) >= 0) {
                return subString;
            }
        }
    }
}
findComStr('sjstrlll', 'sstre');
