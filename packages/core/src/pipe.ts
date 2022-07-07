

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
            let ret:unknown = await exec(this,result)
            if (this.isCheckNode(meta)) {
                if (ret) meta = meta.next;
                else meta = meta.elseNext;
            }else {
                result = ret;
                meta = meta.next;
            }
   
            if (!meta) break;

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