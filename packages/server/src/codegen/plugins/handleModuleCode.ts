import { Module } from "../module";
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
class handleModuleCode{
    constructor() {
   
    }

    apply(compilation) {
      compilation.registerPlugin('afterAddModule',(module:Module)=>{
          let { config } = module
          let { data :{code : { source,type,other }} }= config;

          if (type === "self") {
            module.source = source
          }else {
              let m = new MagicString("");
              m.append(`import ${other} from '../${other}/index.js\n`)
               .append(`export default async function(pipe,...args) {\n`)
               .append(`${other}(pipe,...args)\n`)
               .append('}\n')

              module.source = m.toString();
          }

      })
    }




}

module.exports = handleModuleCode;