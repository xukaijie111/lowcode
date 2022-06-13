

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
        position:POSITION
        id?:string,
        rule?:(source:Port,target:Port) => boolean | boolean; //是否可以连线的规则
    }

    export type POSITION = "LEFT" | "TOP" | "RIGHT" | "DOWN"
}