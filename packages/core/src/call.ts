//@ts-nocheck
import dataflowPipe from "./dsl/dataflow/index"
import getProductsPipe from "./dsl/getProducts/index"
import testPipe from "./dsl/test/index"
let map = {
"dataflow":dataflowPipe,
"getProducts":getProductsPipe,
"test":testPipe,
}

        export const dslCall = async (name:string,...args) => {

        
            try {

                return await map[name].run(...args)

            } catch (error) {

                console.log(error)

            }

        }