


<script lang="ts" setup>

import { ref } from 'vue'

import { ElMessage } from 'element-plus'

import { CirclePlus } from '@element-plus/icons-vue'

import _ from 'lodash'

    type ItemType = Record<any,any>
    let data = ref<Array<ItemType>>([])
    let typeList = ref([
        {
            name:"数字",
            key:"number",
            validate:(value:string) => {
                let reg = /\d+/;
               return reg.test(value)
            },
            transform:(value:string) => {
                return JSON.parse(value)
            }
        },
        {
            name:"布尔",
            key:"boolean",
            validate:(value:string) => {
              return value === "true" || value === "false"
            },
            transform:(value:string) => {
                return JSON.parse(value)
            }
        },
        {
            name:"字符串",
            key:"string",
            validate:()=>true,
            transform:(value:string) => value
        },
        {
            name:"对象",
            key:"object",
            validate:(value:string) => {
                return typeof JSON.parse(value) === "object"
            },

            transform:(value:string) => JSON.parse(value)
        }
    ])

    
    const addDataItem = () => {
       
        data.value.push({})
    }


    const checkParamValidate = async () => {

        let list = data.value;
        if (!list.length) return true;

        for (let i = 0;i < list.length;i++ ) {
            let item = list[i];
            let { value ,type} = item;

            if (value === undefined) {
                 ElMessage.warning(`参数${i+1}请输入值`)
                return false;
            }

            //@ts-ignore
            let { validate }  = _.find(typeList.value, { key:type })

            if (!validate) {
                  ElMessage.warning(`参数${i+1}请选择类型`)
                return false;
            }

            if (value.indexOf('=') !== -1) {
                ElMessage.warning(`参数${i+1}格式错误`)
                return false;
            }

            if (!validate(value)) {
                  ElMessage.warning(`参数${i+1}格式错误`)
                return false;
            }
        }
    }


    defineExpose({
        checkParamValidate
    })

</script>


<template>

    <div class="w-full h-full param-wrap">

    <div class="title w-full">
        <div>注：输入流程的入参，若不需要可为空</div>
        <div>例子：</div>
        <div>参数1 &nbsp;&nbsp;&nbsp; 3   &nbsp;&nbsp;&nbsp;        数字</div>
        <div>参数2  &nbsp;&nbsp;&nbsp;     {a:3}   &nbsp;&nbsp;&nbsp;    对象</div>
    </div>

    <div>
 <el-table :data="data" style="width: 100%">
    <el-table-column fixed prop="参数" label="参数" width="150" >
         <template #default = "scope">
            参数{{parseInt(scope.$index) + 1}}
         </template>
    </el-table-column>
    <el-table-column prop="value" label="数值" >
           <template #default = "scope">
           
              <el-input
            v-model="scope.row.value"
            :rows="2"
            type="textarea"
            placeholder=""
        />
           </template>
        
    </el-table-column>

    <el-table-column fixed="right" label="类型" width="200">
      <template #default = "scope">
             <el-select v-model="scope.row.type" class="m-2" placeholder="类型" size="large">
                <el-option
                v-for="item in typeList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
                />
            </el-select>
      </template>
    </el-table-column>
  </el-table>

   <el-icon class="mt-20 cursor" @click="addDataItem"><CirclePlus /></el-icon>

    </div>

   
    </div>


</template>


<style lang="less" scoped>

    .param-wrap{

        .title {
            text-align: left;
            color: red;
            font-size: 14px;
            margin-bottom: 30px;
            margin-top: 20px;
        }   
    }
</style>