import _ from 'lodash'
import { Port } from '../port'
import { View } from '../view';
import * as d3 from 'd3'
import { generateId,prefix } from '../util'


export abstract class BasicNode {
    options:BasicNode.options
    private g:SVGElement
    body:SVGElement
    private id:string
    selected:boolean
    constructor(options:BasicNode.options) {
        this.options = options;

        if (!this.options.id) {
            this.options.id = generateId();
        }
        this.id = this.options.id;
        this.createGroup();
        this.createBody();
        this.append(this.body);

    }

    public append(s:SVGElement) {
        this.g.append(s)
    }

    private createBody() {
        this.body = this.getShape();
        d3.select(this.body)
        .attr('data-id',`${prefix}-${this.id}`)
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

    public getId() { return this.id }

    abstract getShape():SVGElement;

    abstract onMouseDown():unknown;
    abstract onMouseUp():unknown;


    public setSelected(val:unknown) {
        this.selected = !!val
    }

}

export namespace BasicNode {

  
    export type options = {
        id?:string,
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
            items: Array<Port.options>
        },
        data?:unknown, // 用户数据
    }


}