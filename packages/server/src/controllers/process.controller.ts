import { Request, Response, NextFunction, Router } from 'express';
import { Mongodb } from '../mongo/index'
import { IResponse } from '../app'
import * as _ from 'lodash'
import { Controller } from './base.controller';


import {
    Compilation
} from '../codegen/compilation'

import {
    getNodes
} from '../common/util'

let path = require('path')
let dslRoot = path.resolve(__dirname, '../../../core')

export class ProcessController extends Controller {
    public path = "/process";
    public router: Router = Router();

    constructor({
        mongodb
    }: ProcessController.options) {
        super({ mongodb });
        this.collect = mongodb.getCollection('process');
        this.initializeRoutes();

    }
    private initializeRoutes() {
        this.router.post(`${this.path}/getList`, this.getProcessList);
        this.router.post(`${this.path}/edit`, this.processEdit);
        this.router.post(`${this.path}/detail`, this.getDetail);
        this.router.post(`${this.path}/delete`, this.processDelete);
        this.router.post(`${this.path}/deploy`, this.deployDsl);
        this.router.post(`${this.path}/deployById`, this.deployById);
        this.router.post(`${this.path}/otherProcessList`, this.getOtherProcessList)
    }

    private getProcessList = async (request: Request, response: IResponse, next: NextFunction) => {
        let res = await super.get(request.body, ['name']);
        return response.ok(res)
    }

    processEdit = async (request: Request, response: IResponse, next: NextFunction) => {
        let { body } = request;
        // 新增检查名称有重复的没有
        if (!body.id) {
            let { basic:{ name }  } = body;

            if (await this.collect.findOne({ name })) {
                return response.fail(`${name} 已经存在`)
            }
        }

        let id = await this.saveDsl(request.body);
        return response.ok(id);

    }

    private getDetail = async (request: Request, response: IResponse, next: NextFunction) => {

        let detail = await super.detail(request.body);

        return response.ok(detail)
    }

    private processDelete = async (request: Request, response: IResponse, next: NextFunction) => {

        await super.delete(request.body)
        return response.ok(null);
    }

    private async saveDsl(raw)  {
        if (raw.config)  {
            let { config } = raw;
            let nodesNum = getNodes(config.cells || []).length;
            raw.nodesNum = nodesNum;
        }
      
        let id = await super.edit(raw)
        return id;
    }


    private deployDsl = async (request: Request, response: IResponse, next: NextFunction) => {

        try {
            let ret = await this._depoly(request.body)
            if (!ret.success) {
                return response.fail(ret.errorMsg)
            }
              // 保存x6 config
              await this.saveDsl(request.body);

              return response.ok(null);
        } catch (error) {
            console.log(error)
            return response.fail(`部署失败`)
        }
    }


    private deployById = async (request: Request, response: IResponse, next: NextFunction) => {

        try {

            let detail = super.detail(request.body);

            let ret = await this._depoly(detail)
            if (!ret.success) {
                return response.fail(ret.errorMsg)
            }

            return response.ok(null)

        } catch (error) {
            console.log(error)
            return response.fail(`部署失败`)
        }
      

    }

    private async _depoly(raw) {
        let { config, basic } = raw

        let options = {
            config,
            basic,
        }

        try {
            let compilation = new Compilation({
                options,
                outputPath: dslRoot,
                mongodb:this.mongodb
            })

            let ret = compilation.checkSource();
            if(ret)
                return {
                    success:false,
                    errorMsg:ret
                }
           



            await compilation.run();

            return {
                success:true
            }
        } catch (err) {
            console.log(err)
           return {
            success:true
           }
        }

    }


    getOtherProcessList = async (request: Request, response: IResponse, next: NextFunction) => {

        let { body } = request;
        let { id, name } = body

        let query: Record<any, any> = {
            id:{$ne:id}
        };
        if (name) {
            query['basic.name'] = {
                $regex: new RegExp(name, 'i')
            }
        }

        let list = await this.collect.find(query).toArray();
        return response.ok(list);
    }





}


export namespace ProcessController {
    export type options = {
        mongodb: Mongodb
    }
}
