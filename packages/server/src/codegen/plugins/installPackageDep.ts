
import { Compilation } from '../compilation'
import { Module } from '../module'
const execa = require('execa')

const fse = require('fs-extra')

class installPackageDeps{
    compilation:Compilation
    constructor() {
        
    }

    apply(compilation) {
     this.compilation = compilation
      compilation.registerPlugin('endCodeGen',async ()=>{
      
          let { modules ,rootOutput} = compilation;

          let deps = new Set();

          modules.forEach((m:Module) => {
            let _deps = m.deps;
            _deps.forEach((d) => {
                // import a from 'name/lib/sss'
                let index= d.indexOf('/');
                if (index !== -1) {
                    d = d.substring(0,index)
                }
                deps.add(d)
            })
          })

          //@ts-ignore
          let list = Array.from(deps)

          
          if (list.length) {
            let addDeps = [];
            let pkg = require(`${rootOutput}/package.json`)
            let pkgDeps = Object.assign({},pkg.devDependencies || {},pkg.dependencies);

            list.forEach((l:string) => {
                if (!pkgDeps[l]) addDeps.push(l)
            })

            if (addDeps.length) {

                console.log(`开始安装依赖`)
                 let  { stdout } =  await execa.command(`cnpm --prefix ${rootOutput} install ${addDeps.join(' ')} --d`);
                console.log(stdout);  
            }
          }

         
      })
    }



}

module.exports = installPackageDeps;