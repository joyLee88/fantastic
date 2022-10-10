const { promisify } = require('util')
module.exports.clone = async function (repo, desc) {
    // repo是输入的地址，desc是放到哪儿去
    const download = promisify((require('download-git-repo')))
    // ora是状态提示
    const ora = require('ora');
    const process = ora(`下载.... ${repo}`)
    // 启动， 转动标志
    process.start()
    await download(repo, desc)
    // 提示成功，成功标志
    process.succeed()
}