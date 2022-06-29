import { Request, Response, NextFunction, Router } from 'express';
import { Collection } from 'mongodb';
import { Mongodb } from '../mongo/index'
import { IResponse } from '../app'
import * as _ from 'lodash'
import { Controller } from './base.controller';
import * as path from 'path';

export  class ProcessController extends Controller {
    public path = "/process";
    public router:Router = Router();

    constructor({
        mongodb
    }:ProcessController.options) {
        super();
        this.collect = mongodb.getCollection('process');
        this.initializeRoutes();

    }
    private initializeRoutes() {
        this.router.post(`${this.path}/getList`, this.getProcessList);
        this.router.post(`${this.path}/edit`, this.processEdit);
        this.router.post(`${this.path}/detail`, this.getDetail);
        this.router.post(`${this.path}/delete`, this.processDelete);
        this.router.post(`${this.path}/deploy`, this.deployDsl);
    }

    private  getProcessList = async (request:Request,response:IResponse,next:NextFunction) => {
        let res = await super.get(request.body,['name']);
        return response.ok(res)
    }

    processEdit = async (request:Request,response:IResponse,next:NextFunction) => {
        let { body } = request;
        // 新增检查名称有重复的没有
        if (!body.id) {
            let { name } = body;

            if (await this.collect.findOne({ name })) {
                return response.fail(`${name} 已经存在`)
            }
        }

        let id = await super.edit(request.body);
        return response.ok(id);

    }

    private getDetail = async (request:Request,response:IResponse,next:NextFunction) => {

        let detail = await super.detail(request.body);
    
        return response.ok(detail)
    }

    private processDelete = async (request:Request,response:IResponse,next:NextFunction) => {

        await super.delete(request.body)
        return response.ok(null);
    }


    private deployDsl = async (request:Request,response:IResponse,next:NextFunction) => {

        let { config } = request.body;

        this.destructDslMetaData(config);
        await super.edit(request.body);
        
        return response.ok(null);
    }


    // 精简元数据
    private destructDslMetaData(config) {

    }



}


export namespace ProcessController {
    export type options = {
        mongodb:Mongodb
    }
}
