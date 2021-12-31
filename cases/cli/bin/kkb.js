#!/usr/bin/env node
console.log('cli...')

const program = require('commander')
// 直接使用package的version
program.version(require('../package.json').version)
// 定制第一个命令
program.command('init <name>')
    .description('init project') // 说明
    // .action(name => { // 功能
    //     console.log('init ' + name)
    // })
    .action(require('../lib/init'))

// 定制刷新命令
program.command('refresh')
    .description('refresh routers...')
    .action(require('../lib/refresh'))

program.parse(process.argv) //解析当前进程process的参数