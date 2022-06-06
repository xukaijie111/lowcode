


export function generateId(len = 10){
    let s = ""
    while(len--) {
        s+=Math.round(Math.random()*10);
    }
    return s
}