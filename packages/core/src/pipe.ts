

import {
    NodeType
} from '@lowcode/shared'

type Common =  Record<any,any>
export class  Pipe {
    meta:Common
    map:Common
    data:Common
    constructor(options:Pipe.options) {
        this.map = options.map;
        this.meta = options.meta
        this.data = {}
    }

    async run(...args) {
       
        let result
        const _run = async (_meta:Common) => {
            let meta = _meta;
            if (!meta) return;
            let { name }  = meta;
            let exec  = this.getFunctionByName(name)
            if (!exec) return;
            console.log(`\n\n开始运行节点${name}`)
            let ret:unknown
            if (this.isStartNode(meta)) {
                ret =  await exec(this,...args)
            }else {
                ret =  await exec(this,result)
            }
        
            console.log(`节点${name}运行结束`)
            if (this.isCheckNode(meta)) {
                if (ret) meta = meta.next;
                else meta = meta.elseNext;
            }else {
                result = ret;
                meta = meta.next;
            }
   
            if (!meta){
                console.log(`节点${name} 无下一个节点了`)
                return;
            } 

            await _run(meta)
        }

        await _run(this.meta);

        return result;
    }


    getFunctionByName(name:string) {

        return this.map[name]
    }

    isCheckNode(meta:Common) {
        return meta.type === NodeType.CHECK
    }

    isStartNode(meta:Common) {
        return meta.type === NodeType.START
    }


    setData(key:string,value:unknown) {
        if (!key) return this;
        this.data[key] = value;
        return this;
    }

    getData(key:string) {
        return this.data[key]
    }
}

export namespace Pipe {
    export type options = {
        meta:Common
        map:Common
    }
}