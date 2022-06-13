
import {
    BasicNode
} from './nodes/basic.node'
import {
    Component
} from './graph'
import { getShapeMap} from './nodes/index'
import { View } from './view'


export class Model {
    view:View
    nodes:Array<Component>
    history:Array<Component>
    constructor(options:{view:View}) {
        this.view = options.view;
        this.nodes = []
        this.history = [];
    }

    addNode(options:Model.addNodeMeta) {
        let shapeMap = getShapeMap();
        let view = this.view;
        let Ctor = shapeMap[options.type]
        let node = new Ctor({ ...options,view});
        this.nodes.push(node)
        this.appendtoView(node);
    }

    appendtoView(node:Component) {
        this.view.getGroup().append(node.getGroup())
    }

    removeFromView(node:Component) {
        node.remove();
        node.getGroup().remove();
    }

    getCellById(id:string) {

        for (let i = 0; i < this.nodes.length;i++) {
            let node = this.nodes[i]
            if (node.getId() === id) return node
        }
    }

    removeComponents(cells:Array<Component> | Component) {
        if (Array.isArray(cells)) {
            cells.forEach((cell) => {
                this.removeComponents(cell)
            })
        }
        let cell = cells as Component;

        //@ts-ignore
        let index = _.findIndex(this.nodes, { id: cell.id})
        if (index !== -1) {
            let removed = this.nodes.splice(index,1)[0];
            this.removeFromView(removed);
            this.history.push(removed);
        }
    }

  
}

export namespace Model {
    export interface addNodeMeta extends Omit<BasicNode.options,'view'> {
        type:string
    }

}