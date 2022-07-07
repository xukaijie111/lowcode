import { Pipe } from "../../pipe"
import StartLowCode from "./start"
import ConsoleLowCode from "./console"
import meta from "./meta.json"
let map = {
"start":StartLowCode,
"console":ConsoleLowCode,
}


            let pipe = new Pipe({
                map,
                meta
            })
        
export default pipe