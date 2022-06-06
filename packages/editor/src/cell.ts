import * as d3 from 'd3';

import {
    Event
} from './event'
import {
    Graph
} from './graph'

import {
    generateId
} from './utils'
export class Cell extends Event {

    protected graph:Graph
    protected options:Cell.Options
    protected g:SVGElement
    protected body?:SVGElement
    protected left?:SVGElement
    protected up?:SVGElement
    protected right?:SVGElement
    protected down?:SVGElement
    protected id:string
    constructor(options:Cell.Options) {
        super();
        if (!options.id) {
            options.id = generateId();
        }
        this.graph = options.graph;
        this.options = options
        this.id = options.id;
        this.g = this.drawContainer();
        this.drawBody();
        this.drawContext();
    }

    protected drawContainer() {
        let [x,y] = this.options.attrs.position
        let g = document.createElementNS("http://www.w3.org/2000/svg",'g');
        d3.select(this.g)
        .attr('transform',`translate(${x},${y})`)    
        return  g
    }

    protected append(ele:SVGElement) {
        this.g.append(ele)
    }

    protected drawBody() {

    }

    protected drawContext() {

    }

    position(x:number,y:number) {
        d3.select(this.g)
        .attr('x',x)
        .attr('y',y)
        this.setPosition([x,y]);
    
        return this;
    }

    size(width:number,height:number) {
        if (this.body) {
            d3.select(this.body)
            .attr('width',width)
            .attr('height',height)

            this.setSize([width,height]);
        }
    }

    get $width() {
        return this.options.attrs.size[0]
    }

    get $height() {
        return this.options.attrs.size[1]
    }


    protected setPosition(position:Cell.Position) {
        this.options.attrs.position = position;
    }

    protected setSize(size:Cell.Size) {
        this.options.attrs.size = size;
    }

    
    onMouseDown() {
        this.emit('cell:mousedown',{ cell: this })
    }


    onDbClick() {
        this.graph.emit('cell:dbClick')
    }



}

export namespace  Cell {
    export const CELL_WIDTH = 80;
    export const CELL_HEIGHT = 30;
    export const CELL_CIRCLE_LENGTH = 80;
    export const CELL_PORT_WIDTH = 20;
    export const CELL_PORT_HEIGHT = 20;
    export enum Shape  {
        CIRCLE = "circle", //原形
        DIAMOND = "diamond" , // 菱形
        RECTANGLE = "rectangle" // 长方形
    };
    export type Position = [number,number]
    export type Size = [number,number]
   
  
    export enum Ports  {
        left = "left",
        up = "up",
        right = "right",
        down = "down"
    }
    export type Attars = {
        position:Position,
        shape:Shape,
        size:Size,
        ports:Record<Partial<Ports>,boolean>
        customData?:Record<any,any> // 用户自定义数据
    }
    export type Options = {
        id?:string,
        graph:Graph,
        attrs:Attars
    }

    export interface IRefStyle {
        body_selected:string,
        body_unselected:string,
    
        port_selected?:string,
        port_unselected?:string
    }

    export enum EVENT_TARGET {
        BODY = "BODY",
        LEFTPORT = "LEFTPORT",
        RIGHTPORT = "RIGHTPORT",
        UPPORT = "UPPORT",
        DOWNPORT = "DOWNPORT"
    }
}