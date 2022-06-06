import axios from 'axios';
import { ElMessage,ElLoading } from "element-plus";
import { LoadingInstance } from "element-plus/lib/components/loading/src/loading"

const HOST = 'http://localhost:3000'




let loadingInstance:LoadingInstance | undefined

axios.defaults.withCredentials = true
axios.defaults.timeout = 15000;

function showLoading(){
  if (!loadingInstance) {
    loadingInstance = ElLoading.service({ fullscreen: true,background:'rgba(0,0,0,0.2)'})
  }
}

function hideLoading(){
  if (loadingInstance) {
    loadingInstance.close();
    loadingInstance = undefined;
  }
}


const service = axios.create({
    baseURL:HOST,
    headers:{
      'Content-type': 'application/json;charset=UTF-8'
    },
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    withCredentials:true,
    timeout: 5000,
    // proxy:{
    //   host:'47.108.227.172',
    //   port:80
    // }
});

service.defaults.withCredentials = true


service.interceptors.request.use(
    config => {
        showLoading();
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        hideLoading();
        console.log('###respinse is ',response)
        if (response.status === 200) {
            var result = response.data;
            if (result && result.success) return result.data
            else  return Promise.reject(result);
           
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

export default service;
