//@ts-nocheck
import cartManagePipe from "./dsl/cartManage/index"
import dataflowPipe from "./dsl/dataflow/index"
import getProductsPipe from "./dsl/getProducts/index"
import testPipe from "./dsl/test/index"
let map = {
"cartManage":cartManagePipe,
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