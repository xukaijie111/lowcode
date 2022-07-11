//@ts-nocheck
import dataflowPipe from "./dsl/dataflow/index"
import testPipe from "./dsl/test/index"
let map = {
"dataflow":dataflowPipe,
"test":testPipe,
}

        export const dslCall = async (name:string,...args) => {

        
            try {

                return await map[name].run(...args)

            } catch (error) {

                console.log(error)

            }

        }