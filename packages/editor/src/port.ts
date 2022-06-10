

export class Port {


    public getId() {
        
    }
}

export namespace Port {

    export type options = {
        x:number,
        y:number,
        width?:number,
        height?:number,
        attrs:Record<any,any>
        data:unknown, //用户数据
    }
}