
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

import {
    Mongodb
} from '../mongo/index'

import MagicString from 'magic-string'

let fse  = require('fs-extra');

import {
    checkCodeInValid, emitFile
} from '../common/util'

const defaultPlugins = require('./plugins/index')

type Common = Record<any, any>

type CommonArray = Array<Common>

export class Compilation {
    config: Record<any, any>
    meta: NodeMetaData
    modules:Array<Module>
    options:Common
    outputPath:string
    plugins:Record<any,any>
    mongodb:Mongodb
    constructor({
        options,
        outputPath,
        mongodb
    }) {
        this.mongodb = mongodb;
        let { basic : {name}} = options
        this.outputPath = `${outputPath}/${name}`
        this.options = options;
        this.config = options.config;
        this.modules = [];
        this.mongodb = mongodb
        this.plugins =  { 
            'afterAddModule':[],
            'codeGen':[], // 开始生成目标文件
        };

        this.initPlugins();

        let nodes = this.getNodes();
        nodes.forEach((n) => {
            new Module({
                compilation:this,
                config:n
            })
        })

    }

    async run() {
        await this.callPlugin('codeGen')
    }


    async callPlugin(name:string,...args:Array<unknown>) {
        let plugins = this.plugins[name];
        if (!plugins) return;

        for (let p of plugins) {
        await p.call(this,...args)
        }
    }


    registerPlugin(name:string,callback:Function) {
        let plugins = this.plugins[name];
        if (!plugins) return;
        plugins.push(callback);
    }


    async initPlugins() {
        let plugins = this.options.plugins || [];
        plugins = defaultPlugins.concat(plugins)

        plugins.forEach((p)=>{
            p.apply(this)
        })
 
  }


    async addModule(m:Module) {
        if (_.find(this.modules,{ id: m.id})) return this
        this.modules.push(m)

        await this.callPlugin('afterAddModule',m);
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

}