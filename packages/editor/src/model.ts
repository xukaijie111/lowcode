
import {
    BasicNode
} from './nodes/basic.node'
import { getShapeMap} from './nodes/index'
import { View } from './view'


export class Model {
    view:View
    nodes:Array<BasicNode>
    constructor(options:{view:View}) {
        this.view = options.view;
        this.nodes = []
        this.initEvents();
    }

    addNode(options:Model.addNodeMeta) {
        let shapeMap = getShapeMap();
        let view = this.view;
        let Ctor = shapeMap[options.type]
        let node = new Ctor({ ...options,view});
        this.nodes.push(node)
    }

    getCellById(id:string) {
       id = id.split('-')[1];

        for (let i = 0; i < this.nodes.length;i++) {
            let node = this.nodes[i]
            if (node.getId() === id) return node
        }
    }

    onMouseDown(cell:BasicNode) {
        cell.onMouseDown();
        cell.setSelected(true);
    }


    initEvents() {
       for (let name in Model.events) {
           //@ts-ignore
           let handler = Model.events[name]
           //@ts-ignore
           this.view.on(name,this[handler])
       }
    }

    onMouseDownBlankView = () => {
        this.nodes.forEach((node) => {
            node.onMouseUp();
            node.setSelected(false);
        })
    }

  
}

export namespace Model {
    export interface addNodeMeta extends Omit<BasicNode.options,'view'> {
        type:string
    }

    export const events = {
        'blank:view':"onMouseDownBlankView"
    }

}