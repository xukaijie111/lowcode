
import { Graph } from '../graph'

import { KeyboardPlugin } from './Keyboard'
import { MousePlugin } from './mouse'

let plugins = [
    KeyboardPlugin,
    MousePlugin
]

export default plugins


export namespace Plugin {
    export type renderOptions = {
        graph:Graph,
    }
    export type Meta = {
        apply:<T  extends renderOptions>(args:T) => void 
    }
}