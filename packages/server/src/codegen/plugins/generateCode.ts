


import {
    emitFile
} from '../../common/util'
import { Compilation } from '../compilation'

import MagicString from 'magic-string'

const relative = require('relative')

let fs = require('fs')

const fse = require('fs-extra')
class generateCode{
    compilation:Compilation
    constructor() {
       
    }

    apply(compilation) {
     this.compilation = compilation
      compilation.registerPlugin('codeGen',()=>{
        
        let meta = compilation.generateMeta();
        let { outputPath,modules } = compilation;

        // 删除整个目录
        fse.removeSync(`${outputPath}`)

        // 保存元数据
        //@ts-ignore
        emitFile(`${outputPath}/meta.json`,JSON.stringify(meta,'','\t'));

       modules.forEach((module) => {
        let source = module.getSource();
        emitFile(`${module.getOuptPutPath()}`,source)
       })

       this.getenrateExportNamespace();

       this.generateCallFile();

       console.log(`###代码生成完成`)
      })
    }


    getenrateExportNamespace() {

        let s = new MagicString(`import { Pipe } from "../../pipe"`)
        s.append('\n')
  
        let { modules,outputPath } = this.compilation;
        let map = {}
  
        // 导入模块
        modules.forEach((module) => {
            let exportName = module.getFunctionName();
            let name = module.getName();
            map[name] = exportName
            s.append(`import ${exportName} from "./${name}"\n`)
        })
  
        // 导入meta.json
  
        s.append(`import meta from "./meta.json"\n`)
  
        
        s.append(`let map = {\n`)
  
  
        for(let name in map) {
            let exportName = map[name]
            s.append(`"${name}":${exportName},\n`)
        }
        
  
        s.append('}\n')
  
        s.append('\n');
        
  
        s.append(`
            let pipe = new Pipe({
                map,
                meta
            })
        `)
        s.append('\n')
        
  
        s.append(`export default pipe`);
        

  
        emitFile(`${outputPath}/index.ts`,s.toString())
  
    }


    generateCallFile() {
        let { rootOutput } = this.compilation;
        let dslDirectory = `${rootOutput}/src/dsl`
        const callPath = `${rootOutput}/src/call.ts`

        let targets = fs.readdirSync(dslDirectory).filter(f => {
            if (!fs.statSync(`${dslDirectory}/${f}`).isDirectory()) {
              return false
            }
            

            if (!fs.statSync(`${dslDirectory}/${f}/meta.json`).isFile()) {
                return false
            }

            return true;
          })


        let s = new MagicString('//@ts-nocheck\n')

        let map = {}

        targets.forEach((t) => {
            let sourcePath = `${dslDirectory}/${t}/index`

            let rel = relative(callPath,sourcePath)
            if (!/^\./.test(rel)) rel = `./${rel}`;

            let localName = `${t}Pipe`
            s.append(`import ${localName} from "${rel}"\n`)
            map[t] = localName
        })

        s.append('let map = {\n')

        for (let key in map) {
            let value = map[key]
            s.append(`"${key}":${value},\n`)
        }

        s.append('}\n')

        s.append(`
        export const dslCall = async (name:string,...args) => {\n
        
            try {\n
                return await map[name].run(...args)\n
            } catch (error) {\n
                console.log(error)\n
            }\n
        }`)

        emitFile(`${callPath}`,s.toString())
    }

}

module.exports = generateCode;