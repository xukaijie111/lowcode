
import { Router ,Request, Response, NextFunction,} from 'express';
import { Collection } from 'mongodb';
import { IResponse } from '../app'
import { generateId } from '../common/util';
import * as _ from 'lodash'


export class Controller {
    protected collect:Collection
    constructor(){
       
    }

    async get(body:Request["body"],keys:Array<string>)  {

        let {
            pageNum,
            pageSize
        } = body
    
        pageNum = parseInt(pageNum)
        pageSize = parseInt(pageSize)

        let query:Record<any,any> = {};
        keys.forEach((key) => {
            let value = body[key];
            query[key] = {
                $regex: new RegExp(value,'i')
            }
        })
    
        let total = await this.collect.countDocuments(query);
    
        let list = await this.collect.find(query).skip(pageSize*(pageNum - 1)).limit(pageNum*pageSize).toArray();
        return {
            list,
            total,
    
        }
    } 

    async edit(body:Request["body"]) {

        let data = _.cloneDeep(body);
        let {
            id
        } = data;

        if (!id) id = generateId();
    
        let setOnInsert = {
             ctime: Date.now(),beUsedNum:0, importOtherProcessNum:0
        }
    
        let set = _.omit(data,Object.keys(setOnInsert))
    
        await this.collect.updateOne({
            id
        }, {
            $setOnInsert: setOnInsert,
            $set: {...set ,mtime:  Date.now()}
        }, {
            upsert: true
        })

        return id;

    }


   async  detail(body:Request["body"]) {
    
        let { id } = body;
    
        let detail = await this.collect.findOne({id})
    
        return _.omit(detail,['_id'])
    }

    async delete (body:Request["body"]) {
        let {ids} = body;
        await this.collect.deleteMany({id: {$in: ids}})
    }


}

export namespace Controller {
    export type Meta = {
        path:string,
        router:Router
    }
}

