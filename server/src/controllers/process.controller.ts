import { Request, Response, NextFunction, Router } from 'express';
import { Collection } from 'mongodb';
import { Mongodb } from '../mongo/index'
import { IResponse } from '../app'

export  class ProcessController {
    public path = "/process";
    public router:Router = Router();
    private processCollect:Collection

    constructor({
        Mongodb
    }:ProcessController.options) {
        this.processCollect = Mongodb.getCollection('process');
        this.initializeRoutes();

    }
    private initializeRoutes() {
        this.router.get(`${this.path}/list`, this.getProcessList);
        // this.router
        //   .post(this.path, authMiddleware, validationMiddleware(CreatePostDto), this.createPost);
    }

    private async getProcessList(request:Request,response:IResponse,next:NextFunction) {
        let {
            body
        } = request;
        let {
            name = "",
            pageNum,
            pageSize
        } = body
    
        pageNum = parseInt(pageNum)
        pageSize = parseInt(pageSize)
    
        let total = await this.processCollect.countDocuments();
    
        let list = await this.processCollect.find({
            name: {
                $regex: new RegExp(name)
            }
        }).skip(pageSize*(pageNum - 1)).limit(pageNum*pageSize).toArray();
        return response.ok({
            list,
            total,
    
        })
    }
}


export namespace ProcessController {
    export type options = {
        Mongodb:Mongodb
    }
}
