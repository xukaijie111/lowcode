import { Pipe } from "../../pipe"
import StartLowCode from "./start"
import OperateCartLowCode from "./operateCart"
import meta from "./meta.json"
let map = {
"start":StartLowCode,
"operateCart":OperateCartLowCode,
}


            let pipe = new Pipe({
                map,
                meta
            })
        
export default pipe