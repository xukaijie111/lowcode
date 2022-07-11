
let data = {}

export default async function(pipe,key,value){
    if (value === undefined) return data[key]
  else return data[key] = value
}