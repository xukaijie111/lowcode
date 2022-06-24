import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig,AxiosRequestHeaders } from "axios"

import { ElMessage, ElLoading } from "element-plus";
import { LoadingInstance } from "element-plus/lib/components/loading/src/loading"


let loadingInstance: LoadingInstance | undefined

function showLoading(text = '') {
    if (!loadingInstance) {
        loadingInstance = ElLoading.service({ fullscreen: true, background: 'rgba(0,0,0,0.2)' ,text})
    }
}

function hideLoading() {
    if (loadingInstance) {
        loadingInstance.close();
        loadingInstance = undefined;
    }
}


const HOST = 'http://localhost:3456'


export class Request {
    private instance: AxiosInstance

    post(config:AxiosRequestConfig){
        return this.instance(config) as AxiosPromise<unknown>
    }
    constructor() {
        this.instance = axios.create({
            baseURL:HOST,
            headers:{
              'Content-type': 'application/json;charset=UTF-8'
            },
            // process.env.NODE_ENV === 'development' 来判断是否开发环境
            // easy-mock服务挂了，暂时不使用了
            // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
            withCredentials:true,
            timeout: 5000,
        })


        this.instance.interceptors.request.use(
            (config: Request.IAxiosReuqetConfig) => {
                let content = config?.options?.loadingContent
                showLoading(content);
                return config;
            },
            error => {
                console.log(error);
                return Promise.reject();
            }
        );

        this.instance.interceptors.response.use(
            response => {
                hideLoading();
                if (response.status === 200) {
                    var result = response.data;
                    if (result && result.success) return result.data
                    else {
                        // if (result.errorMsg) {
                        //     ElMessage.error(result.errorMsg);
                        // }
                        return Promise.reject(result);
                    } 

                } else {
                    return Promise.reject();
                }
            },
            error => {
                hideLoading();

                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            // 返回 401 清除token信息并跳转到登录页面
                            ElMessage.warning('登录过期,请重新登录')
                            setTimeout(() => {
                            }, 2000);

                    }
                }

                return Promise.reject();
            }
        );
    }


}

export const request = new Request();

export namespace Request {
    export type options = {
        baseURL: string,
        headers: AxiosRequestHeaders,

        withCredentials: boolean,
        timeout: number,
    }

export interface IAxiosReuqetConfig extends AxiosRequestConfig {
    options?: {
        loadingContent: string
    }
}
}