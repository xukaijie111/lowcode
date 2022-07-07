


import {
    emitFile
} from '../../common/util'
import { Compilation } from '../compilation'

import MagicString from 'magic-string'

const fse = require('fs-extra')
/**
 * 
 * [{
 *  src:'',
 *  dest:'',
 * },{
 *  src:''
 *  dest:''
 * }]
 */
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
        let m_name = module.getName();
        let source = module.getSource();
        emitFile(`${outputPath}/${m_name}.js`,source)
       })

       this.getenrateExportNamespace();
      })
    }


    getenrateExportNamespace() {

        let s = new MagicString(`import Pipe from "../../pipe"`)
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
  
  
        emitFile(`${outputPath}/index.js`,s.toString())
  
    }

}

module.exports = generateCode;