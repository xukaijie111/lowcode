import { request } from '../core/request';


import { ElMessage } from 'element-plus'





const apiRequest = (param,option = {showError:true})=>{
    return request.post(param)
    .then((res)=>{
        return res;
    },(err)=>{
      if (err && err.errorMsg && option.showError) {
      
        ElMessage.error(err.errorMsg);
      }
      return Promise.reject(err);
    })
}

export const getProcessList = (data) => {
  return apiRequest({
    url:'/process/getList',
    method:'POST',
    data
  })
}


export const createProcess = (data) => {
    return apiRequest({
        url:'/process/edit',
        method:'POST',
        data
      }) 
}

export const deleteProcess = (ids) => {
    return apiRequest({
        url:'/process/delete',
        method:'POST',
        data: { ids }
      }) 
}