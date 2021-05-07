/*
打印全排列
从n个不同的元素中取m个元素（m<=n），按照一定的顺序排列起来，

叫做从n个不同元素取出m个元素的一个排列。

当m=n时，所有的排列情况叫做全排列，比如3的全排列为：
1 2 3
1 3 2

2 1 3
2 3 1

3 1 2
3 2 1
*/
function premute(nums) {
    const result = [];
    const len = nums.length;
    for (let i = 0; i < len; i++) { // 依次每一个开头的数字去排
        rank([nums[i]]);
    }

    return result;

    function rank(arr) {
        if (arr.length === len) result.push(arr); // 排到四个数的时候，加入结果集
        for (let i = 0; i < len; i++) {
            if (arr.includes(nums[i])) continue;
            let temp = arr.slice();
            temp.push(nums[i]);
            rank(temp);
        }
    }
}
console.log(premute([1, 2,3, 4]))
