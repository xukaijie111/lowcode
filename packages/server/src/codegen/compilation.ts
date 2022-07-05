
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
    checkCodeInValid
} from '../common/util'

type Common = Record<any, any>

type CommonArray = Array<Common>

export class Compilation {
    config: Record<any, any>
    meta: NodeMetaData
    modules:Array<Module>
    cache:Common
    options:Common
    constructor({
        options
    }) {
        this.options = options;
        this.config = options.config;
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

        function deepMetaData(module:Module, meta:Common) {
            if (cache[module.id]) return;
            cache[module.id] = meta;
            if (module.isEndModule()) return;

            let rightPort = module.getRightPort();
            if (rightPort) {
                let targetModule = this.getNextNode(module, rightPort.id);
                if (targetModule) {
                    meta.next = targetModule.getDsl();
                    deepMetaData(targetModule, meta.next)
                }
            }

            if (module.isCheckModule()) {
                let downPort = module.getDownport();
                if (downPort) {
                    let targetModule = this.getNextNode(module, downPort.id);
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