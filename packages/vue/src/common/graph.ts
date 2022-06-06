
  import { Graph  } from '@antv/x6'
  export class vGraph{
    private graph:Graph
    constructor(options:vGraph.Options) {
        this.graph = new Graph(options);
        
    }



}

export namespace vGraph {
    export interface Options extends Graph.Options {

    }
}