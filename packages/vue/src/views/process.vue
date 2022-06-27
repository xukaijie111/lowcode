


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
        'delete': true
    },
    list: [
        {
            title: "名称",
            key: "name"
        },
        {
            title: "描述",
            key: "description"
        }
    ]
})

onMounted(() => {
    baseRef.value.onSubmitClick();
})


</script>

<template>

    <div class="process-wrap h-full">

        <BaseVue :search="search" :table="table" ref="baseRef"></BaseVue>
    </div>

</template>

<style lang="less" scoped>
.process-wrap {
    width: 100%;
    height: 100%;
}
</style>