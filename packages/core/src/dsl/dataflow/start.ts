
let data = {}

export default async function(pipe,key,value){
    if (value === undefined)  data[key]
  else  data[key] = value

  console.log(`data is`,data)
}