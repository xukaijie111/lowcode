


<script lang="ts" setup>
import { ref } from 'vue'
import BaseVue from '../components/base.vue'
import { useRouter } from 'vue-router'

import { getProcessList } from '../common/api'

const router = useRouter();

let searchConfirm = async (query, page) => {
    let body = {
        ...query,
        ...page
    }

    let res = await getProcessList(body);
    return res;
}

const create = () => {
    console.log(`###create`)
    router.push('/graph' )
}

let search = ref({
    confirm: searchConfirm,
    create,
    items: [
        {
            title: "名称/描述",
            key: 'name',
            value: "",
            placeholder: "请输入名称或者描述查询"
        }
    ]
})

let table = ref({
    index: true,
    list: [
        {
            title: "名称",
            key: "name"
        },
        {
            title: "描述",
            key: "description"
        },
        {
            title: "操作",
            template: "operate"
        }
    ]
})


</script>

<template>

    <div class="process-wrap h-full">

        <BaseVue :search="search" :table="table">

            <div slot="operate">
                123
            </div>

        </BaseVue>



    </div>

</template>

<style lang="less" scoped>
.process-wrap {
    width: 100%;
    height: 100%;
}
</style>