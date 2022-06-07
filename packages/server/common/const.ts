
const path = require('path')

const CELL_TYPE_COMMON = "common"
const CELL_TYPE_START = "start"
const CELL_TYPE_END = "end"
const CELL_TYPE_IF_ELSE = "if-else"

const CODING_MODE_SELF_STRING = "自定义实现"
const CODING_MODE_SELF = "self" // 自己实现

const CODING_MODE_IMPORT_STRING = "引入其他流"
const CODING_MODE_IMPORT = "import" //引入其他流

const CODING_MODE_IMPORT_CLASS_METHOD_STRING = "引入类方法"
const CODING_MODE_IMPORT_CLASS_METHOD = "import-class"

const ALL_CODING_LIST = [
    {
        name:CODING_MODE_IMPORT_CLASS_METHOD_STRING,
        value:CODING_MODE_IMPORT_CLASS_METHOD
    },
    {
        name:CODING_MODE_SELF_STRING,
        value:CODING_MODE_SELF
    },
    {
        name:CODING_MODE_IMPORT_STRING,
        value:CODING_MODE_IMPORT
    },
  
]


const DSL_BASE_URL = path.resolve(__dirname,'../../core')


module.exports = {
    CELL_TYPE_COMMON,
    CELL_TYPE_END,
    CELL_TYPE_IF_ELSE,
    CELL_TYPE_START,
    CODING_MODE_SELF,
    CODING_MODE_IMPORT,
    CODING_MODE_IMPORT_CLASS_METHOD_STRING,
    CODING_MODE_IMPORT_CLASS_METHOD,
    CODING_MODE_IMPORT_STRING,
    CODING_MODE_SELF_STRING,
    ALL_CODING_LIST,
    DSL_BASE_URL
}