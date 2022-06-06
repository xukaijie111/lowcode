
import {
    Event
} from './event'

import * as d3 from 'd3';

export class View extends Event {
    svg:SVGElement
    grid:SVGElement
    constructor() {
        super();
        this.createSvg();


    }

    private createSvg() {
        this.svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
        d3.select(this.svg)
        .attr('width',View.VIEW_WIDTH)
        .attr('height',View.VIEW_HEIGHT)

    }

    private createGrid() {
        
    }

}


export namespace View {
    export const VIEW_WIDTH = 5000;
    export const VIEW_HEIGHT = 5000;
    events:{

    }
}