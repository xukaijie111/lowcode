
import { DeepPartial } from 'utility-types'

import {
    Event
} from './event'

export class Graph extends Event{

        constructor(options:DeepPartial<Graph.options>) {
            super();

        }
}

export namespace Graph {
    export type GridOptions = {
        // 线条颜色
        stroke:string

        // 线条宽度
        'stroke-width':string

        // 线条间隔
        gridSize:number
    }
    export type options = {
        width:number,
        height:number,
        grid:boolean | GridOptions

    }
}