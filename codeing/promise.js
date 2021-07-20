// 解决回调地狱
//  一个promise的当前状态有3种状态：等待pending、执行fulfilled、拒绝rejected
    // pending状态改变为fulfilled或rejected，不再改变
// 有一个成功和一个失败

const PENDING = 'pending';
const FULFILED = 'fulfilled';
const REJECTED = 'rejected';
const resolvePromise = (x, p, resolve, reject) => {
    // x是一个promise，跟上一个promise是同一个，直接return，防止循环引用
    if (x === p) {
        reject(new TypeError('循环引用'))
    }
    if (x instanceof MyPromise) {
        // 做节流
        let called;
        try {
            x.then(res => {
                if (called) return;
                called = true;
                // 递归调用，直到不是promise为止
                resolvePromise(res, p, resolve, reject);
            }, err => {
                if (called) return;
                called = true;
                reject(err)
            })
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

class MyPromise {
    constructor(executer) {
        var _this = this;
        this.onFulfilled = []; // 成功回调
        this.onRejected = []; // 失败回调
        this.state = PENDING; // 状态
        this.value = undefined; // 成功结果
        this.reason = undefined; // 失败原因

        const resolve = value => {
            if (_this.state === PENDING) {
                _this.state = FULFILED;
                _this.value = value;
                _this.onFulfilled.forEach(fn => fn(value))
            }
        }
        const reject = reason => {
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
    // then指定resolve和reject状态的回调，拿到promise内部异步操作的结果
    //  then里面函数运行时，resolve是异步执行的，可能没来得及修改state，所以把回调寄存在数组，改变state再去取出来
    // 要实现链式调用，防止循环引用，返回得是一个新得promise
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : () => { throw err };

        let p = new MyPromise((resolve, reject) => {
            if (this.state === FULFILED) {
                // 防止回调延迟添加，状态先发生改变了
                // 利用定时器实现promise得异步原理
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(x, p, resolve, reject);
                    } catch(e) {
                        reject(e)
                    }
                })
            }
            if (this.state === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, p, resolve, reject);
                    } catch(e) {
                        reject(e)
                    }
                })
            }
            if (this.state === PENDING) {
                this.onFulfilled.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(x, p, resolve, reject);
                        } catch(e) {
                            reject(e)
                        }
                    })
                });
                this.onRejected.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, p, resolve, reject);
                        } catch(e) {
                            reject(e)
                        }
                    })
                });
            }
        })
        return p;
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
    // 无论成功还是失败都会执行finally, finally的回调没有参数
    finally(onFinished) {
        return this.then(val => {
            onFinished();
            return val;
        }).catch(err => {
            onFinished();
            return err;
        })
    }
    // 返回一个成功的promise
    resolve(val) {
        return new Promise(resolve => {
            resolve(val)
        })
    }
    // 返回一个失败的promise
    reject(val) {
        return new Promise((resolve, reject) => {
            reject(val)
        })
    }
    // 并发处理：接受一个可迭代的对象for of，返回一个promise实例
    // 所有promise都resolved时resolve，如果有一个rejected，则此实例被reject
    // 成功的时候返回的是一个结果数组，而失败的时候则返回最先被reject失败状态的值。
    all(ps) {
        let resolve;
        let reject;
        const promise = new MyPromise((r, j) => {
            resolve = r;
            reject = j;
        })
        let fulfilledCount = 0;
        let index = 0;
        const ret = [];
        const wrapFufilled = i => {
            return val => {
                fulfilledCount += 1;
                ret[i] = val; // 结果
                // 所有都执行完
                if (fulfilledCount >= index) {
                    resolve(ret);
                }
            }
        }
        const wrapRejected = i => {
            return err => {
                reject(err);
            }
        }
        for (let p of ps) {
            MyPromise.resolve(p).then(wrapFufilled(index), wrapRejected(index));
            index += 1;
        }
        return promise;
    }
    // 并发处理：返回一个promise，一旦迭代器中某个promise解决或拒绝，该promise就会解决或拒绝
    race(ps) {
        let resolve;
        let reject;
        const promise = new MyPromise((r, j) => {
            resolve = r;
            reject = j;
        })
        for (let p of ps) {
            MyPromise.resolve(p).then(val => resolve(val), err => reject(err))
        }
        return promise
    }
    // 一个成功，就返回成功都promise
    // 全失败，就返回一个失败promise和AggregateError类型（Error的一个子类，单一错误的集合）的实例
    any(ps) {
        let resolve;
        let reject;
        const promise = new MyPromise((r, j) => {
            resolve = r;
            reject = j;
        })
        let errCount = 0;
        let pCount = 0;
        for (let p of ps) {
            pCount += 1;
            MyPromise.resolve(p).then(
                val => resolve(val),
                err => {
                    errCount += 1;
                    if (errCount >= pCount) {
                        reject(new AggregateError('All promises were rejected'))
                    }
                }
            )
        }
        return promise;
    }
    // 所有promise都解析，返回一个promise
    allSettled() {
        let resolve;
        let reject;
        const promise = new MyPromise((r, j) => {
            resolve = r;
            reject = j;
        })
        let finishedCount = 0;
        let index = 0;
        const ret = [];
        const wrapFufilled = i => {
            return val => {
                finishedCount += 1;
                ret[i] = {
                    status: 'fufilled',
                    value: val
                }
                if (finishedCount >= index) {
                    resolve(ret);
                }
            }
        }
        const wrapRejected = i => {
            return err => {
                finishedCount += 1;
                ret[i] = {
                    status: 'rejecte',
                    value: err
                }
                if (finishedCount >= index) {
                    resolve(ret);
                }
            }
        }
        for (let p of ps) {
            MyPromise.resolve(p).then(wrapFufilled(index), wrapRejected(index));
            index += 1;
        }
        return promise;
    }
}

// 简易版promiseAll
function promiseAll(arr) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(arr)) {
            return reject(new Error('参数错误，必须是数组'))
        }
        const res = [];
        const len = arr.length;
        const counter = 0;
        for (let i = 0; i < len; i++) {
            Promise.resolve(arr[i]).then(r => {
                counter++;
                res[i] = r;
                if (counter === len) {
                    resolve(res)
                }
            }).catch(e => reject(e));
        }
    })
}


// ES7  async、await将异步强行转换为同步处理。
// async/await与promise不存在谁代替谁的说法，因为async/await是寄生于Promise，是Generater的语法糖。
    // async 声明一个函数是异步的；
    // await：async wait，等待一个异步方法执行完成，返回一个promise；
    // async、await配对使用，await在async方法内部，否则报错
async function demo(params) {
    try {
        let res = await p;
    } catch(e) {
        console.log(e)
    }
}

// 或用then
async function demo(params) {
    return await p;
}
demo().then(res => {
    console.log(res)
})


