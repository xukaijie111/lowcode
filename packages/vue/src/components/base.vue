

<script lang="ts" setup>

import { ref } from 'vue'
import _ from 'lodash'
import { ElMessage,ElMessageBox } from 'element-plus'

type SearchItem = {
    title: string,
    key: string,
    value?: unknown,
    select?: boolean,
    placeholder?: string
}
type Search = {
    rules?: unknown
    confirm: Function,
    create?: Function,
    delete?:Function
    items: Array<SearchItem>
}


type TableItem = {

    title: string,
    key?: string,// 后端的字段
    slot?: string // 获取template函数
}

type Operate = {
    delete?: Function,
    detail?: Function
}

type Table = {
    index?: boolean,
    multSelect?:boolean,
    operate?: Operate,
    list: Array<TableItem>
}

let query = ref({});
let sRef = ref();

let page = ref({
    pageSize: 10,
    pageNum: 1,
    total: 0
})

let tableData = ref([])
let selected:Array<unknown> = []

const initQuery = () => {
    let items = props.search.items;
    for (let item of items) {
        let { key, value } = item;
        query.value[key] = _.cloneDeep(value);
    }
}

let props = defineProps<
    {
        search: Search,
        table: Table
    }
>()

const emits = defineEmits<
    {
        (e:"detail",data:unknown):void
    }
>()

initQuery();

const handleCurrentChange = (val) => {
    console.log(`###val is `, val)
}


const onSubmitClick = async () => {
    try {

        await sRef.value.validate();
        let res = await props.search.confirm(_.cloneDeep(query.value), page.value)
        tableData.value = res.list;
        page.value.total = res.total;
        selected = [];

    }
    catch (err) {
        console.log(err)
    }
}

const onCreateClick = () => {
    //@ts-ignore
    props.search?.create();
}

const handleDetail = (row:unknown) => {
    emits('detail',row)
}

const handleDelete = async (row:unknown) => {

    await ElMessageBox.confirm(
    '确定删除?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )

console.log('是否是数组',Array.isArray(row),row)
      //@ts-ignore
   await props.search.delete(Array.isArray(row)?row:[row])
  onSubmitClick();

}

const onMultDeleteClick = () => {
    if (!selected.length) {
        return ElMessage.warning(`未选择项`)
    }

    //@ts-ignore
    handleDelete(selected);

}

const handleSelectionChange = (rows:Array<unknown>) => {
    selected = rows;
}

defineExpose({
    onSubmitClick
})


</script>

<template>
    <div class="base-wrap w-full h-full">
        <div class="search-wrap">
            <el-form :inline="true" ref="sRef" :model="query" class="demo-form-inline align-left"
                :rules="props.search.rules">
                <el-form-item :label="item.title" v-for="item in props.search.items" :prop="item.key">
                    <el-input v-model.trim="query[item.key]" :placeholder="item.placeholder" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmitClick">查询</el-button>
                    <el-button type="primary" @click="onCreateClick" v-if="props.search.create">创建</el-button>
                     <el-button type="danger" @click="onMultDeleteClick" v-if="props.search.delete">删除</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="content-wrap ">
            <el-table 
             @selection-change="handleSelectionChange"
            :data="tableData" style="width: 100%" class="table-wrap">
<el-table-column type="selection" width="55" v-if="props.table.multSelect"/>
                <el-table-column type="index" v-if="props.table.index" label="序号" />
                <el-table-column :prop="item.key" :label="item.title" v-for="item in props.table.list">
                    <template #default="scope" v-if="item.slot">
                        <slot :name="item.slot" :row="scope.row" />
                    </template>

                </el-table-column>
                <el-table-column label="操作" v-if="props.table.operate">
                    <template #default="scope">
                        <el-button size="small" v-if="props.table.operate.detail" @click="handleDetail(scope.row)">详情</el-button>
                        <el-button size="small" 
                        v-if="props.table.operate.delete"
                        type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination small background layout="prev, pager, next, total" :total="page.total" class="pag"
                @current-change="handleCurrentChange" />


        </div>

    </div>

</template>

<style lang="less" scoped>
.base-wrap {
    display: flex;
    flex-direction: column;

    .content-wrap {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 0px;
        padding-bottom: 30px;
        box-sizing: border-box;

        .table-wrap {
            flex: 1;
            height: 0px;
        }

        .pag {
            text-align: right;
            margin-top: 30px;
        }
    }
}
</style>