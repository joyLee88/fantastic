// 冒泡排序
// 1.比较相邻的两个元素，如果前一个比后一个大，则交换位置。
// 2.第一轮的时候最后一个元素应该是最大的一个。
function bubSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) { // 后面的数已拍过序; j和j+1比较
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    console.log(arr);
}

// 快速排序
// 快速排序是对冒泡排序的一种改进，第一趟排序时将数据分成两部分，一部分比另一部分的所有数据都要小。然后递归调用，在两边都实行快速排序。
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    var index = Math.floor(arr.length / 2);
    var item = arr.splice(index, 1)[0];
    var left = [];
    var right = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < item) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([item], quickSort(right));
}