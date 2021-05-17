// 一个promise的当前状态有3种状态：等待pending、执行fulfilled、拒绝rejected
    // pending状态改变为fulfilled或rejected，不再改变
// 有一个成功和一个失败

const PENDING = 'pending';
const FULFILED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(executer) {
    var _this = this;
    this.onFulfilled = []; // 成功回调
    this.onRejected = []; // 失败回调
    this.state = PENDING; // 状态
    this.value = undefined; // 成功结果
    this.reason = undefined; // 失败原因

    function resolve(value) {
        if (_this.state === PENDING) {
            _this.state = FULFILED;
            _this.value = value;
            _this.onFulfilled.forEach(fn => fn(value))
        }
    }
    function reject(reason) {
        if (_this.state === PENDING) {
            _this.state = REJECTED;
            _this.reason = reason;
            _this.onRejected.forEach(fn => fn(reason))
        }
    }
    try {
        executer(resolve, reject);
    } catch (e) {
        reject(e);
    }
    
}
//  then里面函数运行时，resolve是异步执行的，可能没来得及修改state，所以把回调寄存在数组，改变state再去取出来
Promise.prototype.then = function (onFulfilled, onRejected) {
    return new Promise()
    if (this.state === FULFILED) {
        typeof onFulfilled === 'function' && onFulfilled(this.value);
    }
    if (this.state === REJECTED) {
        typeof onRejected === 'function' && onRejected(this.reason);
    }
    if (this.state === PENDING) {
        typeof onFulfilled === 'function' && this.onFulfilled.push(onFulfilled);
        typeof onRejected === 'function' && this.onRejected.push(onRejected);
    }
}
module.exports = Promise;




