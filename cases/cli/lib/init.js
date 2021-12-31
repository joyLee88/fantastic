const { promisify } = require('util')
// 异步方法，把小的字符通过拼接放大
const figlet = promisify(require('figlet'))
//  清屏
const clear = require('clear')
// 用于修饰输出的命令行日志，颜色等
const chalk = require('chalk')
// 修饰log
const log = content => console.log(chalk.green(content))
const { clone } = require('./download')
const { resolve } = require('path')
// 修饰spawn
const spawn = async(...args) => {
    const { spawn } = require('child_process')
    return new Promise(resolve => {
        const proc = spawn(...args)
        // 输出流
        proc.stdout.pipe(process.stdout)
        // 错误流
        proc.stderr.pipe(process.stderr)
        proc.on('close', () => {
            resolve()
        })
    })
}

module.exports = async name => {
    // 打印欢迎界面
    clear()
    const data = await figlet('KKB welcome')
    log(data)

    log(`创建项目: ${name}`)
    // 初始化工具地址
    await clone('github:地址', name)
    // 安装依赖
    log(`安装依赖...`)
    await spawn('cnpm', ['install'], { cwd: `./${name}` }) //指定运行文件夹

    log(chalk.green(`
        安装完成：
    to get start:
    =================================
        cd ${name}
        npm run serve
    =================================    
    `))

}