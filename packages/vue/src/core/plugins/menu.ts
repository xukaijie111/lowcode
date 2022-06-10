

import { createApp } from 'vue'
import Menu from './menu.vue'
import { Graph } from '@manondo/editor'

export class MenuPlugin {


    apply({ graph}:{graph:Graph}) {
        let div = document.createElement('div')
        div.className = "manodo-menu-wrap"
        let app = createApp(Menu,{
            graph
        })
        app.mount(div)
        let root = graph.getRoot();
        root.append(div);
        
    }
}