
import { Request , request} from './request';
import { Graph } from '@manondo/editor'
import _ from 'lodash'


let defaultGraphOptions =  {
    width:5000,
    height:5000,
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

    public createGraph(options: Partial<Graph.Options>) {
        let graph = new Graph(_.merge(defaultGraphOptions,options) as Graph.Options)
        this.graphList.push(graph)
        return graph
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