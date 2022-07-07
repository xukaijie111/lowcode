import { Module } from "../module";
import MagicString from 'magic-string'



const fse = require('fs-extra')
class handleModuleCode{
    constructor() {
   
    }

    apply(compilation) {
      compilation.registerPlugin('afterAddModule',async (module:Module)=>{
          let collect = compilation.mongodb.getCollection('process');
          let { config } = module
          let { data :{code : { source,mode, other }} }= config;
          if (mode === "self") {
            module.source = source
          }else {
              let m = new MagicString("");
              let item = await collect.findOne({id:other})
              let otherName = item.basic.name;
              m.append(`import ${otherName} from '../${otherName}/index\n`)
               .append(`export default async function(pipe,...args) {\n`)
               .append(`${otherName}(pipe,...args)\n`)
               .append('}\n')

              module.source = m.toString();
          }

      })
    }




}

module.exports = handleModuleCode;