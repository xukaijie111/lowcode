
import { Request , request} from './request';

export class Process{
    request:Request
    constructor() {
        this.request = request;
    }

    getList(data:Process.getListBody) {
        let config:Process.postConfig<Process.getListBody> = {
            url:'/process/getList',
            method:'POST',
            data,
        }
        return this.request.post(config)
    }
}

export const process = new Process();


export namespace Process {

    export interface postConfig<T> {
        url:string,
        method:string,
        data:T
    }

    export type getListBody = {
        pageNum:number,
        pageSize:number
        name:string
        
    }

}