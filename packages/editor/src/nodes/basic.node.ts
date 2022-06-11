import _ from 'lodash'
import { Port } from '../port'
import { View } from '../view';
import * as d3 from 'd3'

export abstract class BasicNode {
    options:BasicNode.options
    private g:SVGElement
    private body:SVGElement
    constructor(options:BasicNode.options) {
        console.log(`###this.options is `,options)
        this.options = options;
        this.createGroup();
        this.body = this.getShape();
        this.append(this.body);

    }

    public append(s:SVGElement) {
        this.g.append(s)
    }

    private createGroup() {
        let { x ,y } = this.options
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        d3.select(this.g)
        .attr('transform',`translate(${x},${y})`)

        this.options.view.appendCompoent(this.g);
    }

    get width() {
        return this.options.width as number;
    }
    get height() {
        return this.options.height as number
    }

    position(x:number,y:number) {
        this.options.x = x;
        this.options.y = y;
        d3.select(this.g)
        .attr('transform',`translate(${x},${y})`)
    }

    abstract getShape():SVGElement;




}

export namespace BasicNode {

    export type PortItem  = {
        id:string,
        rule?:(source:Port,target:Port) => boolean | boolean; //是否可以连线的规则
    }
    export type options = {
        view:View,
        x:number,
        y:number,
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