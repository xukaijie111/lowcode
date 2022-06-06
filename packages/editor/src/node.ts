



import { Cell } from './cell'
import * as d3 from 'd3'


export class Node extends Cell {
    constructor(options: Node.Options) {
        super(options);
        this.drawBody();
    }

    protected drawBody() {
        let { attrs } = this.options;
        let { shape } = attrs;


        if (shape === Cell.Shape.CIRCLE || shape === Cell.Shape.RECTANGLE) {
            let radius = 5;
            if (shape === Cell.Shape.CIRCLE) {
                this.setSize([Cell.CELL_CIRCLE_LENGTH, Cell.CELL_CIRCLE_LENGTH]);
                radius = Cell.CELL_CIRCLE_LENGTH / 2
            }
            let width = this.$width
            let height = this.$height
            this.body = document.createElementNS("http://www.w3.org/2000/svg", 'rect')
            d3.select(this.body)
                .attr('width', width)
                .attr('height', height)
                .attr('rx', radius)
                .attr('ry', radius)

        }

        // 菱形
        if (shape === Cell.Shape.DIAMOND) {
            this.setSize([Cell.CELL_WIDTH, Cell.CELL_HEIGHT]);
            let width = this.$width
            this.body = document.createElementNS("http://www.w3.org/2000/svg", 'polygon')
            let leftPoint = `${0},${width / 2}`
            let upPoint = `${width / 2},0`
            let rightPoint = `${width},${width / 2}`
            let downPoint = `${width / 2},${width}`
            d3.select(this.body)
                .attr('points', `${leftPoint} ${upPoint} ${rightPoint} ${downPoint}`)
        }

        d3.select(this.body as SVGElement)
            .attr('class', Node.refStyle.body_unselected)
            .attr('data-id', `${this.id}-${Cell.EVENT_TARGET.BODY}`)
        
        this.append(this.body as SVGElement)
    }


    protected drawPorts() {
        let { ports = {} } = this.options.attrs
        let port_width = Cell.CELL_PORT_WIDTH;
        let port_height = Cell.CELL_PORT_HEIGHT
        for (let _key in ports) {
            let key = _key as Cell.Ports;
            let position = this.getPortPosition(key)
            this[key as Cell.Ports] = document.createElementNS("http://www.w3.org/2000/svg",'rect')
            d3.select(this[key as Cell.Ports] as SVGElement)
                .attr('width',port_width)
                .attr('height',port_height)
                .attr('x',position[0])
                .attr('y',position[1])
                .attr('class',Node.refStyle.port_unselected)
                .attr('data-id',`${this.id}-${key}`)
                .attr('rx',2)
                .attr('ry',2)
           this.append(this[key] as SVGElement)
        }
    }

    protected getPortPosition(type:Cell.Ports) :Cell.Position {
        
        let width = this.$width 
        let height =this.$height
        let port_width = Cell.CELL_PORT_WIDTH;
        let port_height = Cell.CELL_PORT_HEIGHT
        let x = 0,y = 0
        if (type === Cell.Ports.right) {
            x =   width - port_width/2;
            y =  (height - port_height)/2;
        }else if (type === Cell.Ports.up){
            x =    (width-port_width)/2;
            y = -port_height/2;
        }else if (type === Cell.Ports.down) {
            x =   (width - port_width)/2;
            y =  height - (port_height)/2;
        }else if (type === Cell.Ports.left) {
            x =   -port_width/2;
            y =  (height - port_height)/2;
        }
        return [x,y]
    }
}


export namespace Node {
    export interface Options extends Cell.Options { };
    export const refStyle = {
        body_selected: "chart-node-body chart-node-body-selected",
        body_unselected: "chart-node-body",
        port_selected: "cahrt-node-port cahrt-node-port-selected",
        port_unselected: "cahrt-node-port"
    }
}