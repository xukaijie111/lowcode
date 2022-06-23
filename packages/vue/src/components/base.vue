

<script lang="ts" setup>

import { ref } from 'vue'
import _ from 'lodash'
import { ElMessage } from 'element-plus'

type SearchItem = {
    title:string,
    key:string,
    value?:unknown,
    select?:boolean,
    placeholder?:string
}
type Search = {
    rules?:unknown
    confirm:Function,
    create?:Function,
    items:Array<SearchItem>
}


type TableItem = {
    
            title:string,
            key?:string,// 后端的字段
            template?:string // 获取template函数
}

type Table = {
    index?:boolean
    list:Array<TableItem>
}

let query = ref({});
let sRef = ref();

let page = ref({
    pageSize:10,
    pageNum:1,
    total:0
})

let tableData = ref([])

const initQuery = () => {
    let items = props.search.items;
    for (let item of items) {
        let { key ,value } = item;
        query.value[key] = _.cloneDeep(value);
    }
}

let props = defineProps<
    {
        search:Search,
        table:Table
    }
>()

initQuery();

const handleCurrentChange = (val) => {
    console.log(`###val is `,val)
}


const onSubmitClick = async () => {
    try{

        await sRef.value.validate();
        let res = await props.search.confirm(_.cloneDeep(query.value),page.value)
        tableData.value = res.list;
        page.value.total = res.total;

    }
    catch(err) {
        console.log(err)
    }
}

const onCreateClick = () => {
    //@ts-ignore
    props.search?.create();
}


</script>

<template>
    <div class="base-wrap w-full h-full">
           <div class="search-wrap">
            <el-form :inline="true"
            ref="sRef"
             :model="query" class="demo-form-inline align-left" :rules = "props.search.rules">
                <el-form-item :label="item.title" v-for="item in props.search.items" :prop = "item.key">
                    <el-input v-model="item.value" :placeholder="item.placeholder" />
                </el-form-item>
       
                <el-form-item>
                     <el-button type="primary" @click="onSubmitClick">查询</el-button>
                      <el-button type="primary" @click="onCreateClick" v-if="props.search.create">创建</el-button>
                </el-form-item>
            </el-form>
           </div>

          <div class="content-wrap ">
            <el-table :data="tableData" style="width: 100%" class="table-wrap">
                    <el-table-column type="index"  v-if="props.table.index"/>
                    <el-table-column :prop="item.key" :label="item.title" v-for="item in props.table.list">
                        <template #default="scope">
                           <slot :name="item.template"/>
                        </template>
                    </el-table-column>
            </el-table>

            <el-pagination
                small
                background
                layout="prev, pager, next, total"
                :total="page.total"
                class="pag"
                 @current-change="handleCurrentChange"
            />


          </div>

    </div>

</template>

<style lang="less" scoped>

.base-wrap{
    display: flex;
    flex-direction: column;

    .content-wrap{
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 0px;
        padding-bottom: 30px;
        box-sizing: border-box;
        .table-wrap{
            flex: 1;
            height: 0px;
        }
        .pag{
            text-align: right;
            margin-top: 30px;
        }
    }
}

</style>