
import {
    NodeShape,
    NodeType,
    CheckNodeMetaData,
    StartNodeMetaData,
    EndNodeMetaData,
    CommonNodeMetaData,
    NodeMetaData
} from '@lowcode/shared'

import * as _ from 'lodash';
import { Module } from './module';

import MagicString from 'magic-string'

let fse  = require('fs-extra');

import {
    checkCodeInValid, emitFile
} from '../common/util'

type Common = Record<any, any>

type CommonArray = Array<Common>

export class Compilation {
    config: Record<any, any>
    meta: NodeMetaData
    modules:Array<Module>
    options:Common
    outputPath:string
    constructor({
        options,
        outputPath
    }) {
        let { basic : {name}} = options
        this.outputPath = `${outputPath}/${name}`
        this.options = options;
        this.config = options.config;
        this.modules = [];
        let nodes = this.getNodes();
        nodes.forEach((n) => {
            new Module({
                compilation:this,
                config:n
            })
        })


    }

    addModule(m:Module) {
        if (_.find(this.modules,{ id: m.id})) return this
        this.modules.push(m)
        return this;
    }


    getNodes() {
        let { cells } = this.config;
        return cells.filter((c:Common) => {
            let values = Object.values(NodeShape);
            return values.includes(c.shape);
        })
    }

    getNextModule(module:Module,portId:string) {
        let { config ,modules} = this;
        let { cells } = config;
        let edges = cells.filter((c) => c.shape === "edge")
        let id = module.id;
        let query = { cell: id, port: portId };
        let edge = _.find(edges, { source: query })
        if (!edge) return;
        let { target } = edge;
        let { cell } = target;

        let m = _.find(modules, { id: cell })
        return m;
    }


    generateMeta() {
        let cache = {};
        let { modules } = this;
        let startModule = _.find(modules,(module) => module.isStartModule())

        const  deepMetaData = (module:Module, meta:Common) => {
            if (cache[module.id]) return;
            cache[module.id] = meta;
            if (module.isEndModule()) return;

            let rightPort = module.getRightPort();
            if (rightPort) {
                let targetModule = this.getNextModule(module, rightPort.id);
                if (targetModule) {
                    meta.next = targetModule.getDsl();
                    deepMetaData(targetModule, meta.next)
                }
            }

            if (module.isCheckModule()) {
                let downPort = module.getDownport();
                if (downPort) {
                    let targetModule = this.getNextModule(module, downPort.id);
                    if (targetModule) {
                        meta.next = targetModule.getDsl();
                        deepMetaData(targetModule, meta.next)
                    }
                }
            }
        }

        let meta = startModule.getDsl();
        deepMetaData(startModule,meta);

        return meta;

    }




    checkSource() {
        let nodes = this.getNodes();
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let { data: { code: { source }, base: { name } } } = node;
            let ret = checkCodeInValid(source)
            if (ret) {
                return `节点${name}代码错误 , 可至 https://astexplorer.net/ 转换查看`;
            }
        }

    }

    deploy() {
        let meta = this.generateMeta();
        let { outputPath,modules } = this;

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


    }


    getenrateExportNamespace() {

        let s = new MagicString(`import Pipe from "../../pipe"`)
        s.append('\n')

        let { modules,outputPath } = this;
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