import request from './request';


import { ElMessage } from "element-plus";


interface Param {
    url:string,
    method:string,
    data?:Record<any,any>
}

export type IResponse = any

const apiRequest = (param:Param,option = {showError:true}) => {
    return request(param)
    .then((res)=>{
        return res
    },(err)=>{
      if (err && err.errorMsg && option.showError) {
      
        ElMessage.error(err.errorMsg);
      }
      return Promise.reject(err);
    })
}


export const getCellList = () => {
  return apiRequest({
    url:'/cell/cellList',
    method:'POST'
  })
 }

// export const userLogin = (data) => {
//   return apiRequest({
//     url:'/users/login',
//     method:'POST',
//     data
//   })
// }

// export const createProject = (data) => {
//   return apiRequest({
//     url:'/project/saveProject',
//     method:'POST',
//     data
//   })
// }

// export const getProjectList = (data) => {
//   return apiRequest({
//     url:'/project/getList',
//     method:'POST',
//     data
//   })
// }


// export const createDomain = (data) => {
//   return apiRequest({
//     url:'/project/saveProject',
//     method:'POST',
//     data
//   })
// }

// export const getDomainList = (data) => {
//   return apiRequest({
//     url:'/project/getList',
//     method:'POST',
//     data
//   })
// }

// export const getProcessList = (data) => {
//   return apiRequest({
//     url:'/process/getList',
//     method:'POST',
//     data
//   })
// }

// export const checkNode = (data) => {
//   return apiRequest({
//     url:'/process/checkNode',
//     method:'POST',
//     data
//   })
// }


// export const saveDsl = (data) => {
//   return apiRequest({
//     url:'/process/saveDsl',
//     method:'POST',
//     data
//   })
// }

// export const deployDsl = (data) => {
//   return apiRequest({
//     url:'/process/deploy',
//     method:'POST',
//     data,
//     options : {
//       loading:"部署中..."
//     }
//   })
// }

// export const deleteDsl = (data) => {
//   return apiRequest({
//     url:'/process/delete',
//     method:'POST',
//     data:{
//       ids:data
//     }
//   })
// }

// export const getProcessDetail = (data) => {
//   return apiRequest({
//     url:'/process/detail',
//     method:'POST',
//     data
//   })
// }