
import {
    Event
} from './event'
import {
    Graph
} from './graph'

import * as d3 from 'd3';
import { generateId } from './utils';

export class View extends Event {
    svg: SVGElement
    grid: SVGElement
    graph:Graph
    id:string
    constructor(options:View.Options) {
        super();
        if (!options.id) {
            options.id = generateId();
        }
        this.id = options.id;
        this.graph = options.graph;
        this.svg = this.createSvg();
        this.grid = this.createGrid();

    }

    getGroup() {
        return this.svg;
    }

    private createSvg() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        d3.select(this.svg)
            .attr('width', View.VIEW_WIDTH)
            .attr('height', View.VIEW_HEIGHT)

        return svg

    }

    private createGrid() {
        let VIEW_WIDTH = View.VIEW_WIDTH
        let GRID_SIZE = View.GRID_SIZE

        let grid = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        d3.select(this.grid)
            .attr('class', 'monodo-chart-grid')


        let gridLayer = d3.select(this.grid);
        let gridTicks = [];

        for (var i = 0; i < VIEW_WIDTH; i += GRID_SIZE) {
            gridTicks.push(i);
        }


        gridLayer.selectAll("line.chart-grid-h").remove();
        gridLayer.selectAll("line.chart-grid-h").data(gridTicks).enter()
            .append("line")
            .attr("class", "chart-grid-h")
            .attr('x1', 0)
            .attr('x2', VIEW_WIDTH)
            .attr('y1', function (d) {
                return d
            })
            .attr('y2', function (d) {
                return d
            })


        gridLayer.selectAll("line.chart-grid-v").remove();
        gridLayer.selectAll("line.chart-grid-v").data(gridTicks).enter()

            .append("line")
            .attr("class", "chart-grid-v")
            .attr('x1', function (d) {
                return d;
            })
            .attr('x2', function (d) {
                return d;
            })
            .attr('y1', 0)
            .attr('y2', VIEW_WIDTH)

        return grid;
    }

}


export namespace View {
    export const VIEW_WIDTH = 5000;
    export const VIEW_HEIGHT = 5000;
    export const GRID_SIZE = 20;
    export type Options = {
        id?:string
        graph:Graph
    }
    events: {

    }
}