import { Pipe } from "../../pipe"
import StartLowCode from "./start"
import ConsoleLowCode from "./console"
import CheckAgeIsBiggerLowCode from "./checkAgeIsBigger"
import SaveAgeLowCode from "./saveAge"
import meta from "./meta.json"
let map = {
"start":StartLowCode,
"console":ConsoleLowCode,
"checkAgeIsBigger":CheckAgeIsBiggerLowCode,
"saveAge":SaveAgeLowCode,
}


            let pipe = new Pipe({
                map,
                meta
            })
        
export default pipe