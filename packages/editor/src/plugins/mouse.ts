import { Graph } from "../graph";
import * as d3 from 'd3';

export class MousePlugin  {
    graph:Graph 
    constructor() {
       
    }

    apply({ graph }:{ graph:Graph}) {

        this.graph = graph;
        let view = graph.getView();
        let svg = view.getGroup();

        let events = MousePlugin.events;


        for (let key in events) {
            d3.select(svg)
            //@ts-ignore
            .on(key,this[events[key]]) 
        }
        
    }

    mouseDown = (event:MouseEvent) => {

    }

    dragOver = (event:MouseEvent) => {
        event.preventDefault();
    }

    onDrop = (event:DragEvent) => {
        let { graph } = this;
        let data = event.dataTransfer?.getData("data");
        //@ts-ignore
        let formatData = JSON.parse(data)
        if (graph.checkIsValidNodeType(formatData?.type)) {
                graph.addNode({ type : formatData.type})
        }

        event.preventDefault();
        return;

    }
}

export namespace MousePlugin {

    export const events = {

        "mousedown":"mouseDown",
        "dragover":"dragOver",
        "drop":"onDrop"
    }
}