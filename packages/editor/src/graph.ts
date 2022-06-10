
import _ from 'lodash'
import { View } from './view'

import {
    Event
} from './event'
import { Plugin } from './plugins';

export class Graph extends Event{
        private options:Graph.Options
        view:View
        constructor(options:Graph.Options) {
            super();
            this.options = options;
            this.view = new View({ graph : this,...this.options })
            this.installPlugins()
        }


        private installPlugins() {
            let { plugins = [] } = this.options;
            for (let plugin of plugins) {
                plugin.apply({ graph : this as Graph })
            }
        }

        public getRoot() {
            return this.options.ele;
        }

        public getView() {
            return this.view
        }
}

export namespace Graph {
    export interface  Options extends Omit<View.options,'graph'>{
        plugins?:Array<Plugin.Meta>
    }

}