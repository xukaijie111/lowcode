
import { Graph } from './graph'
import {
    BasicNode
} from './nodes/basic.node'
import { getShapeMap} from './nodes/index'
export class Model {
    graph:Graph
    nodes:Array<unknown>
    constructor(options:{graph:Graph}) {
        this.graph = options.graph;
        this.nodes = []
    }

    addNode<T>(options:Model.addNodeMeta) {
        let shapeMap = getShapeMap();
        let Ctor = shapeMap[options.type]
        let node = new Ctor(options);
        this.nodes.push(node as T)
    }
}

export namespace Model {
    export interface addNodeMeta extends Omit<BasicNode.options,'view'> {
        type:string
    }
}