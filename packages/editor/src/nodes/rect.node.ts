import { BasicNode } from "./basic.node";
import * as d3 from 'd3';
import _ from 'lodash'

export class RectNode extends BasicNode {

    constructor(options:BasicNode.options) {
        super(_.merge(RectNode.defaultOptions,options))
    }

    public getShape() {
        let width = this.width;
        let height = this.height;
        let body =  document.createElementNS("http://www.w3.org/2000/svg",'rect')
        let s = d3.select(body)
        .attr('class','mangodo-node-body')
        .attr('width',width)
        .attr('height',height)
    
        let { attrs = { }} = this.options;
        for (let key in attrs) {
            let value = attrs[key]
            s.attr(key,value);
        }

        return body;
            
    }

    public onMouseDown() {
        d3.select(this.body)
        .attr('class','mangodo-node-body-selected')
    }

    public onMouseUp() {
        d3.select(this.body)
        .attr('class','mangodo-node-body')
    }
}


export namespace RectNode {
    export const defaultOptions  = {
        width:80,
        height:30,
        attrs:{
            rx:2,
            ry:2
        }
    }
}