import { Pipe } from "../../pipe"
import StartLowCode from "./start"
import ConsoleLowCode from "./console"
import CheckAgeIsBiggerLowCode from "./checkAgeIsBigger"
import meta from "./meta.json"
let map = {
"start":StartLowCode,
"console":ConsoleLowCode,
"checkAgeIsBigger":CheckAgeIsBiggerLowCode,
}


            let pipe = new Pipe({
                map,
                meta
            })
        
export default pipe