//@ts-nocheck
import testPipe from "./dsl/test/index"
let map = {
"test":testPipe
}

        export const dslCall = async (name:string,...args) => {

        
            try {

                return await map[name].run(...args)

            } catch (error) {

                console.log(error)

            }

        }