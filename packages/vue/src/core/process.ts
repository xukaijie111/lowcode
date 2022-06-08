
import { Request } from './request';

class Process {
    request:Request
    constructor(options:Process.options) {
        this.request = options.request;
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



export namespace Process {
    export type options = {
        request:Request
    }

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