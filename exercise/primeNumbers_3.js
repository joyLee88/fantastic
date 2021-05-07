/*
判断是否为质数
对于大于1的数，如果除了1和它本身，它不能再被其它正整数整除，那么我们说它是一个质数。
*/
function isPrime(num) {
    const sqrtNum = Math.sqrt(num);

    if (num < 2) {
        return false;
    }
    if (num == 2 || num == 3) {
        return true;
    }
    if (num % 2 == 0) {
        return false
    }
    for (let i = 3; i < sqrtNum; i += 2) {
        if (num % i == 0) {
            return false;
        }
    }
    return true;
}