//@ts-nocheck
import testPipe from "./dsl/test/index"
let map = {
"test":testPipe
}

        export const call = async (name:string,...args) => {

        
            try {

                return await map[name](...args)

            } catch (error) {

                console.log(error)

            }

        }