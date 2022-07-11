


<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getProcessList, deleteProcess ,deployById} from '../common/api'

import _ from 'lodash'
import { ElMessage,ElMessageBox } from 'element-plus'

const router = useRouter();

const baseRef = ref();

let query = ref({
    name:""
})
let page = ref({
    pageSize:10,
    pageNum:1,
    total:0
})
let selected:Array<unknown> = []

let tableData = ref([])


const handleSelectionChange = (rows:Array<unknown>) => {
    selected = rows;
}


let onSubmitClick = async () => {
    let body = {
        ...query.value,
        ...page.value
    }

    let res = await getProcessList(body) as Record<any,any>;
    tableData.value = res.list;
    page.value.total = res.total;
}

const onCreateClick = () => {
    router.push('/graph')
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

    let ids = Array.isArray(row)?row:[row];
     await deleteProcess(ids);
  
    onSubmitClick();

}

const onMultDeleteClick = async (rows: Array<unknown>) => {

     if (!selected.length) {
        return ElMessage.warning(`未选择项`)
    }


    //@ts-ignore
    let ids = rows.map((r) => r.id)
    await deleteProcess(ids);
}


const handleDetail = (row:Record<any,any>) => {
  let { id } = row;
  router.push(`/graph/${id}`)
}

const handleCurrentChange = (val:number) => {
    console.log(`###val is `, val)
}

const onDeployClick = async (id) => {
    await deployById(id);
    ElMessage.success(`部署成功`);
}

onMounted(() => {
    onSubmitClick();
})


</script>

<template>

    <div class="process-wrap h-full">
 <div class="search-wrap">
            <el-form :inline="true" ref="sRef" :model="query" class="demo-form-inline align-left">
                <el-form-item label="名称" prop="name">

                    <el-input v-model.trim="query.name" placeholder="请输入名称查询" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmitClick">查询</el-button>
                    <el-button type="primary" @click="onCreateClick" >创建</el-button>
                     <el-button type="danger" @click="onMultDeleteClick">删除</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="content-wrap ">
            <el-table 
             @selection-change="handleSelectionChange"
            :data="tableData" style="width: 100%" class="table-wrap">
<el-table-column type="selection" width="55" />
                <el-table-column type="index"  label="序号" />

                    <el-table-column  label = "名称">
                    <template #default="scope">
                           <div class="name" @click="handleDetail(scope.row)">{{scope.row.basic.name}}</div> 

                    </template>
                </el-table-column>

                <el-table-column  label = "描述">
                    <template #default="scope">
                            {{scope.row.basic.description}}

                    </template>
                </el-table-column>

                <el-table-column prop="nodesNum" label = "节点数">
                       <template #default="scope">
                            {{scope.row.nodesNum || 0}}

                    </template>
                </el-table-column>
               
                <el-table-column label="操作" >
                    <template #default="scope">
                        <el-button size="small"  @click="handleDetail(scope.row)">详情</el-button>
                        <el-button size="small" 

                        type="danger" @click="handleDelete(scope.row)">删除
                        </el-button>

                        <el-button  @click="onDeployClick(scope.row.id)">部署</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination small background layout="prev, pager, next, total" :total="page.total" class="pag"
                @current-change="handleCurrentChange" />


        </div>
    </div>


</template>

<style lang="less" scoped>
.process-wrap {
    width: 100%;
    height: 100%;

    .name {
        color: #409eff;
        cursor: pointer;
    }
}
</style>