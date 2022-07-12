import { Module } from "../module";


import traverse from "@babel/traverse"
let template = require('@babel/template').default;
let generate = require('@babel/generator').default;
const fse = require('fs-extra')

import {
    getAst
} from '../../common/util'
const relative = require('relative')
class handleModuleCode{
    constructor() {
   
    }

    apply(compilation) {
      compilation.registerPlugin('afterAddModule',async (module:Module)=>{
         // let collect = compilation.mongodb.getCollection('process');
          let { config } = module
          let { data :{code : { source,mode, other }} }= config;

          module.source = source

          let ast = getAst(source)

          let importDsls = new Set();

          traverse(ast,{
            CallExpression:(path) => {
              let { node } = path;

              if (node.callee.name === "dslProcess") {
                  let args = node.arguments;
                  let dslName = args[0].value;
                  node.arguments.shift();// 流程名去除

                  node.callee.name = `${dslName}DSL.run`
                  importDsls.add(dslName)
              }
            },

              Program:{
                exit:(path) => {
                  let impos = Array.from(importDsls);
                   if (impos.length) {
                    let mPath = module.getOuptPutPath();
                    impos.forEach((i) => {
                      let otherPath = compilation.resolveDslPath(i);

                      let rel = relative(mPath,otherPath);
                      if (!/^\./.test(rel)) rel = `./${rel}`;

                        let bodypath = path.get('body');
                        let content = `import ${i}DSL from "${rel}" `
                        let node = template(content);
                        bodypath[0].insertBefore(node())
                    })
                   }
                }
              }
          })

          if (importDsls.size) {
            let { code } = generate(ast, {});
            module.source = code;
          }

      })
    }




}

module.exports = handleModuleCode;