export {}
let MagicString = require('magic-string')

const {
    CELL_TYPE_COMMON,
    CELL_TYPE_IF_ELSE,
    CELL_TYPE_END,
    CELL_TYPE_START
 } = require('../common/const')
 let  s = new MagicString('')
 

 const common_node_default_code = s.append(`export default async function(pipe){\n\n`)
                                .append(`/* you can write your code here */\n`)
                                .append('\n\n\n')
                                .append('}')
                                .toString();

s = new MagicString('')
const end_node_default_code = s.append(`export default async function(pipe){\n\n`)
                                .append(`/* pipe.res will break off the process! it is likely express res.send*/\n`)
                                .append(`return pipe.res(data)`)
                                .append('\n\n\n')
                                .append('}')
                                .toString();
                     




 let defaultCellTemplate = {
     [`${CELL_TYPE_COMMON}`]:common_node_default_code,
     [`${CELL_TYPE_IF_ELSE}`]:end_node_default_code,
     [`${CELL_TYPE_END}`]:end_node_default_code
 }


 module.exports = {
     defaultCellTemplate
 }