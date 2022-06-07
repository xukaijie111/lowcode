const {
    MongoClient
} = require('mongodb');

const { generateId } = require('./utils')

const {
    CELL_TYPE_COMMON,
    CELL_TYPE_IF_ELSE,
    CELL_TYPE_END,
    CELL_TYPE_START,
    CODING_MODE_SELF,
    ALL_CODING_LIST,
    CODING_MODE_SELF_STRING,
 } = require('./const')

 const {defaultCellTemplate } = require('../codegen/template')

const category = {
    common:"普通元件",
    class:"类元件",
    self:"自定义"
}


let defaultCells = [
    {
        name:"common",
        category:category.common,
        id:generateId(),
        type:CELL_TYPE_COMMON,
        shape:"rectangle",
        ports:{
            right:{ 
                link:"out"
            },

            left :{
                link:"in"
            }
        },
        codeOptions:{
            source:defaultCellTemplate[CELL_TYPE_COMMON],
            modeList:ALL_CODING_LIST,
            mode:CODING_MODE_SELF
        }
    },
    {   
        name:"start",
        id:generateId(),
        category:category.common,
        type:CELL_TYPE_START,
        shape:"circle",
        ports:{
            right:{ 
                link:"out"
            },

            left :{
                link:"in"
            }
        },
        paramsList:[]
    },

    {   
        name:"if/else",
        id:generateId(),
        category:category.common,
        type:CELL_TYPE_IF_ELSE,
        shape:"diamond", // 菱形
        ports:{
            right:{ 
                link:"out"
            },


            left :{
                link:"in"
            },
            up:{ 
                link:"in"
            },
            
            down :{
                link:"out"
            }
        },
        codeOptions:{
            source:defaultCellTemplate[CELL_TYPE_COMMON],
            modeList:ALL_CODING_LIST,
            mode:CODING_MODE_SELF
        }
    },
    {
        name:"end",
        id:generateId(),
        category:category.common,
        type:CELL_TYPE_END,
        shape:"circle",
        ports:{
            left :{
                link:"in"
            }
        },
        codeOptions:{
            source:defaultCellTemplate[CELL_TYPE_COMMON],
            modeList:[{
                name:CODING_MODE_SELF_STRING,
                value:CODING_MODE_SELF
            }],
            mode:CODING_MODE_SELF
        }
    },
    {
        id:generateId(),
        category:category.class,
        name:"class",
        type:"class",
        image:"https://dataflow.oss-cn-hangzhou.aliyuncs.com/Class.svg"
    }
]


let defaultUser = [{
        name:"admin",
        id:1,
}]

let config =  {
    name:"dataflow",
    url:'mongodb://127.0.0.1:27017',
    collections:{
        cell:{
            name:"cell",
            default:defaultCells
        },
        user:{
            name:'user',
            default:defaultUser
        },
        project:{
            name:'project',
        },
        domain:{
            name:'domain',
        },
        process:{
            name:"process"
        }
    }
}



async function initDB() {
    try {
        let { url ,name ,collections } = config;
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(name)

        for (let col in collections) {
            let item = collections[col];
            let {
              name,
              default: d
            } = item;
            const c = db.collection(name)
            if (d) {
              const count = await c.countDocuments();
      
              if (!count) {
                 await c.insertMany(d)
                 console.log(`初始化表${name} 完成`)
              }
            }
        }
       
        let cellCollect = db.collection(collections.cell.name);
        let userCollect = db.collection(collections.user.name);
        let projectCollect = db.collection(collections.project.name);
        let domainCollect =  db.collection(collections.domain.name);
        let processCollect =  db.collection(collections.process.name);
        module.exports.cellCollect = cellCollect;
        module.exports.userCollect = userCollect;
        module.exports.projectCollect = projectCollect;
        module.exports.domainCollect = domainCollect;
        module.exports.processCollect = processCollect

    } catch (err) {
        console.log(err)
        process.exit();
    }
}



module.exports = {
    initDB
}