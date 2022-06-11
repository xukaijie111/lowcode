
import _ from 'lodash'
import { View } from './view'
import { Model } from './model'

import {
    Event
} from './event'
import { Plugin, plugins as innerPlugins } from './plugins';
import {
    getShapeMap
} from './nodes/index'

export class Graph extends Event {
    private options: Graph.Options
    view: View
    private model: Model
    constructor(options: Graph.Options) {
        super();
        this.options = options;

        this.view = new View({ graph: this, ...this.options })
        this.model = new Model({ graph: this })
        this.installPlugins()
    }


    private installPlugins() {
        let { plugins = [] } = this.options;
        //@ts-ignore
        plugins = innerPlugins.concat(plugins)
        for (let plugin of plugins) {
            plugin.apply({ graph: this as Graph })
        }
    }

    public getRoot() {
        return this.options.ele;
    }

    public getView() {
        return this.view
    }

    public checkIsValidNodeType(type: string) {
        let shape = getShapeMap();
        return Object.keys(shape).includes(type)
    }

    public addNode<T = unknown>(metaData: Graph.GraphAddNodeMets) {
        console.log(`###metadata is `,metaData);
        if (!this.checkIsValidNodeType(metaData.type)) {
            console.warn(`${metaData.type} node is not in manado/editor. you can use registerNode to register first!`)
            return;
        }

        this.model.addNode<T>(metaData)
    }
}

export namespace Graph {
    export interface Options extends Omit<View.options, 'graph'> {
        plugins?: Array<Plugin.Meta>
    }

    export interface GraphAddNodeMets extends Model.addNodeMeta { }

}