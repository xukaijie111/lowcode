import { Graph } from "../graph";
import * as d3 from 'd3';

export class MousePlugin  {
    constructor() {

    }

    apply({ graph }:{ graph:Graph}) {

      
        let view = graph.getView();
        let svg = view.getGroup();

        let events = MousePlugin.events;
        console.log(`apply mouse`,events)

        for (let key in events) {
            d3.select(svg)
            //@ts-ignore
            .on(key,this[events[key]]) 
        }
        
    }

    mouseDown = (event:MouseEvent) => {

    }

    dragOver = (event:MouseEvent) => {
        console.log(`##dragover`);
        event.preventDefault();
    }

    onDrop = (event:MouseEvent) => {
        console.log(`##DROP`);
    }
}

export namespace MousePlugin {

    export const events = {

        "mousedown":"mouseDown",
        "dragover":"dragOver",
        "drop":"onDrop"
    }
}