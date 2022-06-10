import _ from 'lodash'
import { Port } from '../port'
import { View } from '../view';

export abstract class BasicNode {
    options:BasicNode.options
    constructor(options:BasicNode.options) {
        this.options = options;
    }
    abstract getShape():unknown;




}

export namespace BasicNode {

    export type PortItem  = {
        id:string,
        rule?:(source:Port,target:Port) => boolean | boolean; //是否可以连线的规则
    }
    export type options = {
        view:View,
        width?:number,
        height?:number,
        attrs?:Record<any,any> // svg rect的属性
        text?:{
            label:string,
            attrs:Record<any,any> // svg text的属性
        },
        ports?: {
            items: Array<PortItem>
        },
        data?:unknown, // 用户数据
    }


}