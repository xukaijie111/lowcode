

import {
    NodeType
} from '@lowcode/shared'

type Common =  Record<any,any>
export class  Pipe {
    meta:Common
    map:Common
    constructor(options:Pipe.options) {
        this.map = options.map;
        this.meta = options.meta
    }

    async run() {
        let meta = this.meta;

        let result 

        while(true) {

            let { name }  = meta;
            let exec  = this.getFunctionByName(name)
            if (!exec) break;
            console.log(`\n\n开始运行节点${name}`)
            let ret:unknown = await exec(this,result)
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
                break;
            } 

        }

    }


    getFunctionByName(name:string) {

        return this.map[name]
    }

    isCheckNode(meta:Common) {
        return meta.type === NodeType.CHECK
    }
}

export namespace Pipe {
    export type options = {
        meta:Common
        map:Common
    }
}