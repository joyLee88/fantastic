/*
这里有 n 个航班，它们分别从 1 到 n 进行编号。
我们这儿有一份航班预订表，表中第 i 条预订记录 bookings[i] = [i, j, k] 意味着我们在从 i 到 j 的每个航班上预订了 k 个座位。
请你返回一个长度为 n 的数组 answer，按航班编号顺序返回每个航班上预订的座位数。
示例：
输入：bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5
输出：[10,55,45,25,25]
提示：
1 <= bookings.length <= 20000
1 <= bookings[i][0] <= bookings[i][1] <= n <= 20000
1 <= bookings[i][2] <= 10000
*/

function getBookings(arr) {
    let json = {};
    for (let i = 0; i < arr.length; i++) {
        const start = arr[i][0],
            end = arr[i][1],
            num = arr[i][2];
        for (let j = start; j <= end; j++) {
            json[j] = json[j] ? json[j] + num : num;
        }
    }
    let objArr = [];
    for (let key in json) {
        objArr.push({key: key, num: json[key]});
    }
    objArr.sort((obj1, obj2) => obj1.key - obj2.key);
    return objArr.map(obj => obj.num);
}
console.log(getBookings([[1,2,10],[2,3,20],[2,5,25]]));