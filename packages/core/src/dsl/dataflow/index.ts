import { Pipe } from "../../pipe"
import StartLowCode from "./start"
import meta from "./meta.json"
let map = {
"start":StartLowCode,
}


            let pipe = new Pipe({
                map,
                meta
            })
        
export default pipe