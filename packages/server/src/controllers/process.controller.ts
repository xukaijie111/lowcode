import { Request, Response, NextFunction, Router } from 'express';
import { Mongodb } from '../mongo/index'
import { IResponse } from '../app'
import * as _ from 'lodash'
import { Controller } from './base.controller';
import {
    NodeShape,
    NodeType,
    CheckNodeMetaData,
    StartNodeMetaData,
    EndNodeMetaData,
    CommonNodeMetaData,
    NodeMetaData
} from '@lowcode/shared'

import { parseDependency, checkCodeInValid,emitFile } from '../common/util'

let path = require('path')
let dslRoot = path.resolve(__dirname,'../../../core/src/dsl')

export class ProcessController extends Controller {
    public path = "/process";
    public router: Router = Router();
    

    constructor({
        mongodb
    }: ProcessController.options) {
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

    private getProcessList = async (request: Request, response: IResponse, next: NextFunction) => {
        let res = await super.get(request.body, ['name']);
        return response.ok(res)
    }

    processEdit = async (request: Request, response: IResponse, next: NextFunction) => {
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

    private getDetail = async (request: Request, response: IResponse, next: NextFunction) => {

        let detail = await super.detail(request.body);

        return response.ok(detail)
    }

    private processDelete = async (request: Request, response: IResponse, next: NextFunction) => {

        await super.delete(request.body)
        return response.ok(null);
    }


    private deployDsl = async (request: Request, response: IResponse, next: NextFunction) => {

        let { config,basic:{name} } = request.body;

        let nodes = this.getNodes(config.cells);
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let { data: { code: { source }, base: { name } } } = node;
            let ret = checkCodeInValid(source)
            if (ret) {
                return response.fail(`节点${name} 代码错误 ${ret}`)
            }
        }


        // 元数据，供pipe使用
        let { meta } = this.destructDslMetaData(config);
        emitFile(`${dslRoot}/${name}/meta.json`,JSON.stringify(meta,'','\t'));


        // 代码生成到对应目录
        this.codeGen(request.body);

        // 保存x6 config
        await super.edit(request.body);

        return response.ok(null);
    }


    private codeGen(body) {
        let { basic:{name},config} = body;
        let { cells } = config;
        let nodes = this.getNodes(cells)
        let deps = new Set();
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            let { data: { code: { source },base:{ name:node_name}} } = node;
            parseDependency(source);
            emitFile(`${dslRoot}/${name}/${node_name}.js`,source)
        }

     



    }

    private getNodes(cells) {

        return cells.filter((c) => {
            let values = Object.values(NodeShape);
            return values.includes(c.shape);
        })
    }


    // 精简元数据
    private destructDslMetaData(config) {

        let cache = {};
        let { cells } = config;
        let edges = cells.filter((c) => c.shape === "edge")
        let nodes = this.getNodes(cells);
        let startNode = _.find(nodes, (node) => node.data.type === "start")

        function getNextNode(node, portId) {
            let query = { cell: node.id, port: portId };
            let edge = _.find(edges, { source: query })
            if (!edge) return;
            let { target } = edge;
            let { cell } = target;

            let n = _.find(nodes, { id: cell })
            return n;
        }

        function generateNodeDsl(node): NodeMetaData {

            if (cache[node.id]) return cache[node.id]
            let { data: { base, type } } = node;
            let ret: NodeMetaData = {
                name: base.name,
                description: base.description,
                type,
                next: null
            }

            if (type === NodeType.CHECK) {
                (ret as CheckNodeMetaData).elseNext = null;
            }
            return ret;
        }

        let currentNode = startNode;
        let meta = generateNodeDsl(currentNode);

        function deepMetaData(currentNode, meta) {
            if (cache[currentNode.id]) return;
            cache[currentNode.id] = meta;
            let { data } = currentNode;
            if (data.type === NodeType.END) return;
            let { ports: { items } } = currentNode;
            let rightPort = _.find(items, { group: 'right' });
            if (rightPort) {
                let targetNode = getNextNode(currentNode, rightPort.id);
                if (targetNode) {
                    meta.next = generateNodeDsl(targetNode);
                    deepMetaData(targetNode, meta.next)
                }
            }

            if (data.type === NodeType.CHECK) {
                let downPort = _.find(items, { group: 'down' });
                if (downPort) {
                    let targetNode = getNextNode(currentNode, downPort.id);
                    if (targetNode) {
                        meta.next = generateNodeDsl(targetNode);
                        deepMetaData(targetNode, meta.next)
                    }
                }
            }
        }

        deepMetaData(currentNode, meta);

        return {
            meta
        }

    }



}


export namespace ProcessController {
    export type options = {
        mongodb: Mongodb
    }
}
