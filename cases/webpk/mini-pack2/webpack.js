const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const babel = require('@babel/core');

/**
 * 模块分析
 * @param {*} file 
 */
function getModuleInfo(file) {
    // 读取文件
    const body = fs.readFileSync(file, 'utf-8');
    // 转换AST语法树: 将代码字符串转换为对象
    // Abstract Syntax Tree抽象语法树在计算机科学中，简称语法树，是源代码以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中都一种结构。
    // ‘var a = 1’ 转换为  一个对象 {}
    const ast = parser.parse(body, {
        sourceType: 'module' // ES模块
    })
    // 依赖
    const depts = {};
    tranverse(ast, {
        ImportDeclaration({node}) {
            const dirname = path.dirname(file);
            const abspath = './' + path(dirname, node.source.value)
            deps[node.source.value] = abspath;
        }
    })

    // es5转es6
}