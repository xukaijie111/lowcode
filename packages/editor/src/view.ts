

import { Event } from './event'
import { Graph } from './graph';
import * as d3 from 'd3';
import _ from 'lodash'
import {  prefix } from './util'
import { Model } from './model'


export class View extends Event {
    private wrap:HTMLElement
    private svg: SVGElement
    private options: View.options
    model:Model
    constructor(options: View.options) {
        super();
        this.options = _.merge(View.defaultOptions, options)
        this.model = new Model({ view:this })
        this.wrap = this.createWrap();
        this.svg = this.createSvg();
        this.createGrid();
    }

    private createWrap() {
        let { ele } = this.options
        let wrap = document.createElement('div')
        d3.select(wrap)
        .attr('class','manodo-view-wrap')
        ele.append(wrap);
        return wrap
    }

    private createSvg() {
        let { width, height  } = this.options
        let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        d3.select(svg)
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'background')
        this.wrap.append(svg)
       
        return svg
    }

    private createGrid() {
        let GRID_SIZE = 20;
        let { width } = this.options
        let grid = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        d3.select(grid)
            .attr('class', 'mangodo-grid')

        let gridLayer = d3.select(grid);
        let gridTicks = [];

        for (var i = 0; i < width; i += GRID_SIZE) {
            gridTicks.push(i);
        }


        gridLayer.selectAll("line.chart-grid-h").remove();
        gridLayer.selectAll("line.chart-grid-h").data(gridTicks).enter()
            .append("line")
            .attr("class", "chart-grid-h")
            .attr('x1', 0)
            .attr('x2', width)
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
            .attr('y2', width)

        this.svg.append(grid)
    }


    public getGroup() {
        return this.svg
    }

    getModel() {
        return this.model;
    }

    public appendCompoent(g:SVGElement) {
        this.svg.append(g)
    }

    public isComponent(target:EventTarget) {
        //@ts-ignore
        let dataset = target.dataset;
        let { id } = dataset;
        let reg = new RegExp(`^${prefix}`)
        return reg.test(id);
    }

    addNode(meta:Model.addNodeMeta) {
        this.model.addNode(meta)
    }



}


export namespace View {

    export type options = {
        graph: Graph
        ele: HTMLElement,
        width: number,
        height: number,

    }

    export interface addNodeMeta {
        type:string
    }

    export const defaultOptions = {
        width: 5000,
        height: 5000,
    }
}