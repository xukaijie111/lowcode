
import { Graph } from '../graph'

import { KeyboardPlugin } from './Keyboard'
import { MousePlugin } from './mouse'

export let plugins = [
    new KeyboardPlugin(),
    new MousePlugin()
]



export namespace Plugin {
    export type renderOptions = {
        graph:Graph,
    }
    export interface  Meta extends Record<any,any> {
        apply:<T  extends renderOptions>(args:T) => void 
    }
}