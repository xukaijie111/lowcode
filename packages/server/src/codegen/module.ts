
import {
    Compilation
} from './compilation'

import {
    generateId,
    getAst,
    parseDependency
} from '../common/util'


import {
    NodeShape,
    NodeType,
    CheckNodeMetaData,
    StartNodeMetaData,
    EndNodeMetaData,
    CommonNodeMetaData,
    NodeMetaData
} from '@lowcode/shared'

import type { ParseResult } from '@babel/parser'
import * as _ from 'lodash';

export class Module {
    compilation:Compilation
    config:Record<any,any>
    id:string
    ast:ParseResult<unknown>
    deps:Array<string>
    meta:NodeMetaData
    source:string
    constructor({
        compilation,
        config
    }) {
        this.source = "";
        this.id = config.id;
        this.compilation = compilation;
        this.config = _.cloneDeep(config);
        this.init();
        
        this.compilation.addModule(this);
        this.ast = getAst(this.getSource());
        this.deps = parseDependency(this.getSource())

    }

    isStartModule() {
        return this.config.data.type === NodeType.START
    }

    isEndModule() {
        return this.config.data.type === NodeType.END
    }

    isCheckModule() {
        return this.config.data.type === NodeType.CHECK
    }

    init() {
        // let { config } = this;
        // let { data :{code : { source }} }= config;
        // config.data.code.raw_source = source;
    }

    getSource() {
       return this.source

    }

    getName() {
         return this.config.data.base.name;
    }

    getDsl(): NodeMetaData {   
        let { config ,meta } = this;
        if (meta) return meta;
        
        let { data: { base, type } } = config;
        let ret: NodeMetaData = {
            name: base.name,
            description: base.description,
            type,
            next: null
        }

        if (type === NodeType.CHECK) {
            (ret as CheckNodeMetaData).elseNext = null;
        }
        return (meta = ret);
    }

    getRightPort() {
        let { config } = this;
        let { ports: { items } } = config;
        let rightPort = _.find(items, { group: 'right' });
        return rightPort;
    }


    getDownport() {
        let { config } = this;
        let { ports: { items } } = config;
        let rightPort = _.find(items, { group: 'down' });
        return rightPort;
    }

    getFunctionName() {
        let name = this.getName();
        return name.slice(0, 1).toUpperCase() + name.slice(1) +'LowCode';
    }


}