import { Component, Graph } from "../graph";
import * as d3 from 'd3';
import { View } from "../view";

export type ViewEventParam = {
    cell:Component,
    event:MouseEvent
}

export class MousePlugin {
    graph: Graph
    view: View
    constructor() {

    }

    apply({ graph }: { graph: Graph }) {

        this.graph = graph;
        let view = graph.getView();
        this.view = view;
        let svg = view.getGroup();

        let events = MousePlugin.events;


        for (let key in events) {
            d3.select(svg)
                //@ts-ignore
                .on(key, this[events[key]])
        }

        this.view.on('cell:mousedown',this.startNodeMove)
        this.view.on('cell:portdown',this.startDragLine)

    }


    mouseDown = (event: MouseEvent) => {
        event.stopPropagation();
        if (event.button !== 0) return; //右键不处理
        let target = event.target as EventTarget;
        let view = this.graph.getView();
        let model = view.getModel();

        if (view.isComponent(target)) {
            //@ts-ignore
            let id = target.dataset.id
            let cell = model.getCellById(id.split('-')[1]) as Component;
            cell.onMouseDown(event);
        } else {
            view.emit('blank:mousedown', { event })
        }
    }

    startNodeMove = ({cell, event:prevEent}:ViewEventParam) => {
        console.log(`###start move is `,cell,prevEent)
        d3.select(this.view.getGroup())
            .on('mousemove', (event) => {
                this.handleCellMove(cell, prevEent, event)

                prevEent = event;

            })
            .on('mouseup', (event) => {
                d3.select(this.view.getGroup())
                    .on('mousemove', (event) => event.stopPropagation())
            })
    }

    startDragLine = ({cell, event:prevEent}:ViewEventParam) => {

    }

    handleCellMove(cell: Component, downEent: MouseEvent, event: MouseEvent) {
        // 之前的位置
        let [x1, y1] = d3.pointer(downEent, d3.select(this.view.getGroup()).node())
        // 现在移动的位置
        let [x, y] = d3.pointer(event, d3.select(this.view.getGroup()).node())
        cell.move(x - x1, y - y1)

    }



    dragOver = (event: MouseEvent) => {
        event.preventDefault();
    }

    onDrop = (event: DragEvent) => {
        let { graph } = this;
        let view = graph.getView();
        let data = event.dataTransfer?.getData("data");
        //@ts-ignore
        let formatData = JSON.parse(data)
        if (graph.checkIsValidNodeType(formatData?.type)) {
            let svg = view.getGroup();
            let [x, y] = d3.pointer(event, d3.select(svg).node());
            graph.addNode({ type: formatData.type, x, y })
        }

        event.preventDefault();
        return;

    }
}

export namespace MousePlugin {

    export const events = {

        "mousedown": "mouseDown",
        "dragover": "dragOver",
        "drop": "onDrop",
        "mouseup": "mouseUp"
    }
}