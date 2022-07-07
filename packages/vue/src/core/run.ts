

export async function run(processName:string,paramsList = []) {

    try{
       let exec =  await import  (`../../../core/src/dsl/${processName}/index.js`)

       console.log(`###exec is `,exec)
    }catch(err) {
        console.log(`err is `,err)
    }
   
}