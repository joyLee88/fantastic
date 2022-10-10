// 1. 打印输入字符串的排列
// 输入一个字符串，输入保证无重复字符，取n个排列的结果
// 函数会打印字符串排列，无需考虑顺序
var result = [];
function pailFormat(start, arr) {
    if (start == arr.length - 1) {
        const s = arr.join('');
        if (!result.includes(s)) {
            result.push(s);
        }
    } else {
        for (let i = start; i < arr.length; i++) {
            [arr[i], arr[start]] = [arr[start], arr[i]];
            pailFormat(start + 1, arr);
            [arr[i], arr[start]] = [arr[start], arr[i]];
        }
    }
}
function pailie(str, n) {
    const len = str.length;
    if (len == 0) return [];
    if (len < n) n = len;
    let strArr = str.split('');
    const bak = str.split('')
    if (len == n) {
        pailFormat(0, strArr)
    } else {
        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j <= len - n + 1; j++) {
                const temp = [strArr[i]].concat(strArr.splice(j, n - 1));
                strArr = [].concat(bak);
                pailFormat(0, temp)
            }
        }
    }
    console.log(result);
}
pailie('12345', 3);



// 2. 算法题
/*描述
在可视化中，会先后添加若干个矩形到画布中，后加入的矩形会覆盖之前的矩形
当我们鼠标点击画布上的某个坐标的时候，需要判断，是否有点击到某个矩形，并且，只有最上层的那个矩形会响应，（如果点击位置没有任何矩形，返回 -1）。

所以，我们想要实现这样一个算法，对于给定数量的矩形画布上，鼠标点击一个坐标，返回应该响应当前鼠标点击的矩形下标（输入顺序下表，从0开始）
输入
先输入一个整数n，表示接下来会有几个矩形
    然后输入n个矩形，其数据格式为[[leftTopX, leftTopY], [rightBottomX, rightBottomY]]
    按照输入顺序，为该矩形的编号（0,1,2,...,n-1）

矩形输入完成后，会输入一个整数m，表示接下来会有多少次鼠标点击
    每次鼠标点击都是一个坐标点，其格式为 [x, y]

对于每次输入，返回题干描述要求的矩形下标
整个画布坐标都为 0～2000 之间的整数

样例输入
2
[[10, 10], [20, 20]]
[[15, 15], [30, 30]]
2
[12, 12]
[16, 16]

样例对应输出
0
1*/

// 3. 实现异步能力
/**
 * 提供一个异步执行调度方法
 * 该方法需要具备：
 *   1. 当调用执行方法 on，会按照 *调用的先后顺序* 执行回调 onSuccess
 *   2. （可选实现能力）执行方法 on 在调用后，会返回一个 cancel 句柄，执行后，*无论异步方法执行成功或者失败* 都不响应
 *   3. （可选实现能力）超时时间 3秒，超时需要返回 TimeoutError，并且不再响应其他状态
 */
interface IAsyncScheduler {
    on(promise: PromiseLike<any>, onSuccess?: Function, onError?: Function): () => void;
  }
  
  // 根据题干描述要求，完成该类的实现，可以任意定义成员
  class AsyncScheduler implements IAsyncScheduler {
    on(promise: PromiseLike<any>, onSuccess?: Function, onError?: Function): () => void {
          // TODO impl
    }
  }
  
  // 以下是 Demo 代码
  // 模拟一个耗时的异步
  const delay = (wait: number) => new Promise<number>((resolve) => setTimeout(() => resolve(0), wait));
  
  const scheduler = new AsyncScheduler();
  
  // 模拟1秒的异步
  const cancel1 = scheduler.on(
      delay(1000),
    () => console.log(1),
    (err: Error) => console.error(err),
  );
  
  // 模拟0.5秒的异步
  const cancel2 = scheduler.on(
    delay(500),
    () => console.log(2),
    (err: Error) => console.error(err),
  );
  
  // 模拟超时
  const cancel3 = scheduler.on(
    delay(4000),
    () => console.log(3),
    (err: Error) => console.error(err),
  );
  
  // 期望执行打印结果顺序：1 2 TimeoutError 的异常日志
  // 1秒内执行 cancel1() 的执行结果 2 TimeoutError 的异常日志
  // 0.5秒内执行 cancel2() 的执行结果 1 TimeoutError 的异常日志
  // 3秒内执行 cancel3() 的执行结果 1 2