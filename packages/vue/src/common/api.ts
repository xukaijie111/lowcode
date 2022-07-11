//@ts-nocheck

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


export const createProcess = (config) => {
    return apiRequest({
        url:'/process/edit',
        method:'POST',
        data:{
            ...config
        }
      }) 
}

export const deleteProcess = (ids) => {
    return apiRequest({
        url:'/process/delete',
        method:'POST',
        data: { ids }
      }) 
}

export const getProcessDetail = (id) => {
    return apiRequest({
        url:'/process/detail',
        method:'POST',
        data: { id }
      }) 
}


export const saveDsl = (id,config) => {
    return apiRequest({
        url:'/process/edit',
        method:'POST',
        data : {
            id,
            ...config,
        }
      }) 
}


export const deployDsl = (id,config) => {
  return apiRequest({
    url:'/process/deploy',
    method:'POST',
    data : {
        id,
        ...config,
    }
  }) 
}

export const getOtherProcessList = ({ id ,name = "" }) => {
  return apiRequest({
    url:'/process/otherProcessList',
    method:'POST',
    data : {
        id,
        name,
    }
  }) 
}

export const deployById = (id) => {
  return apiRequest({
    url:'/process/deployById',
    method:'POST',
    data : {
        id
    }
  })
}