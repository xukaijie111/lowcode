import _ from 'lodash'
import { View } from '../view';
import * as d3 from 'd3'
import { generateId, prefix } from '../util'
import { Component } from "../graph";
import {
    Event
} from '../event'


export const defaultPortRule = (s:Component,t:Component,sPort:BasicNode.Port,tPort:BasicNode.Port) => s.getId() !== t.getId() && sPort.id !== tPort.id


export abstract class BasicNode extends Event{
    options: BasicNode.options
    g: SVGElement
    body: SVGElement
    id: string
    selected: boolean
    ports:Array<BasicNode.Port> & { ele?: SVGRectElement}

    constructor(options: BasicNode.options) {
        super();
        this.options = options;

        if (!this.options.id) {
            this.options.id = generateId();
        }
        this.id = this.options.id;
        this.ports = [];
        this.createGroup();
        this.createBody();
        this.append(this.body);
        this.createPorts();
        this.initEvents();

    }

    initEvents() {
        for (let name in BasicNode.viewEvents) {
            //@ts-ignore
            let handler = BasicNode.viewEvents[name]
            //@ts-ignore
            this.options.view.on(name,this[handler])
        }
    }

    onBlankMouseDown = () => {
        this.shapeUnSelected();
        this.setSelected(false);
    }
    get isNode() {
        return true;
    }

    public append(s: SVGElement) {
        this.g.append(s)
    }

    private createBody() {
        this.body = this.getShape();
        d3.select(this.body)
            .attr('data-id', `${prefix}-${this.id}-body`)
    }


    private createGroup() {
        let { x, y } = this.options
        this.g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        d3.select(this.g)
            .attr('transform', `translate(${x},${y})`)

    }

    get width() {
        return this.options.width as number;
    }
    get height() {
        return this.options.height as number
    }

    move(x: number, y: number) {
        let x1 = this.options.x;
        let y1 = this.options.y;
        this.position(x1+x,y1+y);
    }

    position(x: number, y: number) {
        this.options.x = x;
        this.options.y = y;
        d3.select(this.g)
            .attr('transform', `translate(${x},${y})`)
    }

    public getId() { return this.id }

    abstract getShape(): SVGElement;

   

    onMouseDown(event:MouseEvent) {
        //@ts-ignore
        let id = event.target.dataset.id;
        if (id.indexOf('body') !== -1) {
            this.shapeSelected();
            this.setSelected(true);
            this.options.view.emit('cell:mousedown',{ cell:this,event})
        }else if (id.indexOf('port') !== -1) {
            console.log(`cell port down`)
            this.options.view.emit('cell:portdown',{ cell:this,event})
        }
    }

    shapeSelected() {}
    shapeUnSelected() {}


    public setSelected(val: unknown) {
        this.selected = !!val
    }

    public remove() {
        this.g.remove();
    }

    getGroup() {
        return this.g;
    }

    createPorts() {
        if (!this.options.ports) return;
        let { ports } = this.options;
        let { items} = ports;
        let defaultOptions = _.omit(ports,'items');
        for (let item of items) {
            item = _.merge(defaultOptions,item);
            item.id = item.id || generateId();
            this.createPort(item);
        }
    }

    createPort(item:BasicNode.Port) {
        let { width:p_width = 0 ,height:p_height = 0 ,attrs = {},position} = item;
        let pt = this.getPortPosition(item) as [number,number]
        let port = document.createElementNS("http://www.w3.org/2000/svg",'rect')
        d3.select(port)
            .attr('width',p_width)
            .attr('height',p_height)
            .attr('x',pt[0])
            .attr('y',pt[1])
            .attr('class','mangodo-node-port')
            .attr('data-id', `${prefix}-${this.id}-port-${position}`)
            .attr('rx',attrs.r)
            .attr('ry',attrs.r)
        this.append(port);
        this.ports.push(_.merge(item, { ele:port}));

    }

    getPortPosition(item:BasicNode.Port) {
        let { width:p_width = 0 ,height:p_height = 0 ,position} = item;
        let width = this.width 
        let height =this.height
        if (position === BasicNode.PortPoistion.RIGHT) {
            return [
                width - p_width/2,
                (height - p_height)/2
            ]
        }else if (position === BasicNode.PortPoistion.UP){
            return [
                (width-p_width)/2,
                -p_height/2
            ]

        }else if (position === BasicNode.PortPoistion.DOWN) {
            return [
                (width - p_width)/2,
                height - (p_height)/2
            ]

        }else if (position === BasicNode.PortPoistion.LEFT) {

            return [
                -p_width/2,
                (height - p_height)/2
            ]
        }
    }

    getPositionByEvent(event:MouseEvent) {
        //@ts-ignore
        let id = event.target.dataset.id;
        let reg = new RegExp(`^${prefix}-${this.id}-port-(.+)$`)
        let match = id.match(reg)
        if (match) {

        }
    }

    getLinePosition(item:BasicNode.Port) {
        let { position,width = 0,height = 0 } = item;
        let x = this.options.x;
        let y = this.options.y;
        let { width:n_width = 0,height:n_height = 0} = this.options;
        if (position === BasicNode.PortPoistion.LEFT) {
            return [
                x - width/2,
                y+n_height/2
            ]
        }else if (position === BasicNode.PortPoistion.UP) {
            return  [
                    x+n_width/2,
                    y-height/2
                ]
            
        }else if (position === BasicNode.PortPoistion.RIGHT) {
            return [
                x+n_width+width/2,
                y+n_height/2
            ]
        }else if (position === BasicNode.PortPoistion.DOWN) {
            return [
                x+n_width/2,
                y+n_height+height/2
            ]
        }
    }

}

export namespace BasicNode {

    export enum PortPoistion  {
        "LEFT" = "LEFT",
        "UP" = "UP",
        "RIGHT" = "RIGHT",
        "DOWN" = "DOWN"
    }
    export interface Port {
        x:number,
        y:number,
        width?:number,
        height?:number,
        attrs:Record<any,any>
        data:unknown, //用户数据
        position:PortPoistion
        id?:string,
        rule?:(source:Port,target:Port) => boolean | boolean; //是否可以连线的规则
    }

    export interface Ports extends Port {
        items: Array<Port>
    }

    export type options = {
        id?: string,
        view: View,
        x: number,
        y: number,
        width?: number,
        height?: number,
        attrs?: Record<any, any> // svg rect的属性
        text?: {
            label: string,
            attrs: Record<any, any> // svg text的属性
        },
        ports?: Ports,
        data?: unknown, // 用户数据
    }

    export const viewEvents = {
        "blank:mousedown":"onBlankMouseDown"
    }


}