import { Container } from '../container'
import { Graph } from '../graph'



export namespace Plugin {
    export type renderOptions = {
        graph:Graph,
        container:Container
    }
    export type Meta = {
        render:<T  extends renderOptions>(args:T) => void 
    }
}