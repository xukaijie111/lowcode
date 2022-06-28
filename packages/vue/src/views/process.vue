


<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import BaseVue from '../components/base.vue'
import { useRouter } from 'vue-router'

import { getProcessList, deleteProcess } from '../common/api'

const router = useRouter();

const baseRef = ref();

let searchConfirm = async (query:object, page:object) => {
    let body = {
        ...query,
        ...page
    }

    let res = await getProcessList(body);
    return res;
}

const create = () => {
    router.push('/graph')
}



const deleteItems = async (rows: Array<unknown>) => {
    //@ts-ignore
    let ids = rows.map((r) => r.id)
    await deleteProcess(ids);
}


let search = ref({
    confirm: searchConfirm,
    create,
    delete: deleteItems,
    items: [
        {
            title: "名称/描述",
            key: 'name',
            value: "",
            placeholder: "请输入名称查询"
        }
    ]
})


let table = ref({
    index: true,
    multSelect: true,
    operate: {
        'delete': true,
        'detail':true
    },
    list: [
        {
            title: "名称",
            key: "base",
            slot:"tname"
        },
        {
            title: "描述",
            key: "base",
            slot:"tdesc"
        }
    ]
})

onMounted(() => {
    baseRef.value.onSubmitClick();
})

const handleDetail = (row:Record<any,any>) => {
  let { id } = row;
  router.push(`/graph/${id}`)
}


</script>

<template>

    <div class="process-wrap h-full">

        <BaseVue 
        @detail="handleDetail"
        :search="search" :table="table" ref="baseRef">
        
            <template slot="tname" v-slot:tname="scope"><div>{{scope.row.basic?scope.row.basic.name:""}}</div></template>
            <template slot="tdesc" v-slot:tdesc="scope"><div>{{scope.row.basic?scope.row.basic.description:""}}</div></template>
        </BaseVue>
    </div>


</template>

<style lang="less" scoped>
.process-wrap {
    width: 100%;
    height: 100%;
}
</style>