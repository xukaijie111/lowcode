
import { Request , request} from './request';
import { Graph } from '@antv/x6'
import _ from 'lodash'

import { GraphMenu } from './menu'

let defaultGraphOptions:Graph.Options = {
    scroller: {
        enabled:true
    },
    width:5000,
    height:5000,
    grid: {
        size: 20,
        visible: true,
        type: 'mesh', // 'dot' | 'fixedDot' | 'mesh'
        args: {
            color: '#eee', // 网格线/点颜色
            thickness: 1,     // 网格线宽度/网格点大小
        },
    },
}


export class Process{
    graphList:Array<Graph>
    request:Request
    constructor() {
        this.request = request;
        this.graphList = [];
    }

    public getList(data:Process.getListBody) {
        let config:Process.postConfig<Process.getListBody> = {
            url:'/process/getList',
            method:'POST',
            data,
        }
        return this.request.post(config)
    }

    public createGraph(options: Graph.Options) {
        let graph = new Graph(_.merge(defaultGraphOptions,options))
        this.graphList.push(graph)
        return graph
    }

    public addNode(graph:Graph,cell:unknown | GraphMenu.CellItem,point:Process.point) {
        let config = this.getNodeConfig(cell,point)
        graph.addNode(config)
        return 
    }

    getNodeConfig(cell:unknown,point:Process.point) {
        let _cell = cell as GraphMenu.CellItem
        let [x,y] = point
        let config = {
            shape:_cell.shape,
            x,
            y,
            width:80,
            height:30,
            attrs:_cell.attrs

        }

        return config
    }

}



export namespace Process {

    export type point = Array<number>
    export interface postConfig<T> {
        url:string,
        method:string,
        data:T
    }

    export type getListBody = {
        pageNum:number,
        pageSize:number
        name:string
        
    }

}