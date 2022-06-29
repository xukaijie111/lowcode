

import {
    MongoClient,
    Collection
} from 'mongodb'



export  class Mongodb {
    private CollectionMap:Partial<Record<Mongodb.Collections,Collection>>
    constructor() {
        this.CollectionMap = {}
    }
    async init() {
        try{
            let config = Mongodb.config;
            let { url ,name ,collections } = config;
            const client = new MongoClient(url);
            await client.connect();
          
            const db = client.db(name)
            for (let document of collections) {
    
                this.CollectionMap[document as Mongodb.Collections] = db.collection(document)
            }

            console.log(`数据库连接成功`)
        }
        
        catch(err) {
            console.log(111,err)
            process.exit()
        }

    }

    public getCollection(name:Mongodb.Collections) {
        return this.CollectionMap[name]
    }
}

export namespace Mongodb {
    export type Collections = "process"
    export const config = {
        name:"dataflow",
        url:'mongodb://127.0.0.1:27017',
        collections:["process"]
    }
}