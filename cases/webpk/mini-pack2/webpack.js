const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
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
    const deps = {};
    traverse(ast, {
        ImportDeclaration({node}) {
            const dirname = path.dirname(file);
            const abspath = './' + path.join(dirname, node.source.value)
            deps[node.source.value] = abspath;
        }
    })
    console.log('deps', deps);
    // es5转es6
    const {code} = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })
    const moduleInfo = {
        file,
        deps,
        code
    }
    return moduleInfo;
}
// 单个模块
// console.log(getModuleInfo('./src/index.js'));

function parseModules(file) {
    // 从入口开始
    const entry = getModuleInfo(file)
    const temp = [entry];
    //依赖关系图
    const depsGraph = {}

    getDeps(temp, entry)

    // 组装依赖
    temp.forEach(info => {
        depsGraph[info.file] = {
            deps: info.deps,
            code: info.code
        }
    })
    return depsGraph;
}

function getDeps(temp, {deps}) {
    Object.keys(deps).forEach(key => {
        const child = getModuleInfo(deps[key]);
        temp.push(child);
        getDeps(temp, child);
    })
}

const graph = parseModules('./src/index.js');
console.log('graph', graph);

// 将编写都执行函数和依赖图合起来，输出最后都打包文件
function bundle(file) {
    const depsGraph = JSON.stringify(parseModules(file));
    return `(function(graph){
        function require(file) {
            function absRequire(relPath) {
                return require(graph[file].deps[relPath])
            }
            var exports = {};
            (function (require, exports, code) {
                eval(code)
            })(absRequire, exports, graph[file].code)
            return exports
        }
        require('${file})
    })(${depsGraph})`
}

const content = bundle('./src/index.js');
console.log('content', content)

// 写入dist
!fs.existsSync('./dist') && fs.mkdirSync('./dist');
fs.writeFileSync('./dist/bundle.js', content);