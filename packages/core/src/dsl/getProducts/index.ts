import { Pipe } from "../../pipe"
import StartLowCode from "./start"
import GetGoodsListLowCode from "./getGoodsList"
import meta from "./meta.json"
let map = {
"start":StartLowCode,
"getGoodsList":GetGoodsListLowCode,
}


            let pipe = new Pipe({
                map,
                meta
            })
        
export default pipe