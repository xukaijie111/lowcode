

import {
    MongoClient,
    Collection
} from 'mongodb'



export  class Mongodb {
    private CollectionMap:Record<Mongodb.Collections,Collection>
    constructor() {
        
    }
    async init() {
        let config = Mongodb.config;
        let { url ,name ,collections } = config;
        const client = new MongoClient(url);
        await client.connect();
        const db = client.db(name)
        for (let name of collections) {
            this.CollectionMap[name] = db.collection(name)
        }

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