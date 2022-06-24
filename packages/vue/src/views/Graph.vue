<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';
import { mGraph } from '../core/graph'
import x6MainVue from '../components/x6-main.vue';
import x6StencilVue from '../components/x6-stencil.vue';
import x6EditorVue from '../components/x6-editor.vue';
import x6GraphInfoVue from '../components/x6-graph-info.vue'
import _ from 'lodash'
import { useRoute } from 'vue-router'
import { createProcess } from '../common/api'


const route = useRoute();
let stencil = ref()
let main = ref()
let editor = ref();
let mgraph = ref<mGraph>();
let loading = ref(true)
let showModal = ref(false)
let data = ref({
    name: "",
    description: ""
})
let id = ref();


const createGraph = async (options = {}) => {
    mgraph.value = new mGraph();
    await nextTick();
    main.value.init(mgraph.value, data.value, options);
    stencil.value.init(mgraph.value);

    (mgraph.value as mGraph).on("node:dblclick", (param) => {
        editor.value.open(param);
    })

}

const onConfirmDialog = async (_data) => {
   

    data.value = _.cloneDeep(_data);
   
    await create();
    showModal.value = false;
    editUrl();
    loading.value = false;
    await nextTick();
    createGraph();
}

const create = async () => {
    let _id = await createProcess(data.value);
    id.value = _id;
}

const _getProcessDetail = () => {

}

const editUrl = () => {
    const url = `/#${route.path}/${id.value}`
    window.history.replaceState('', '', url);
}


const init = async () => {
    let params = route.params || {};
    if (params.id) {
        id.value = params.id;
        loading.value = false;
        await nextTick();

        createGraph();

    } else {
        showModal.value = true;
    }
}

onMounted(() => {
    init();
})





</script>


<template>
    <div class="w-full h-full">
        <el-dialog :close-on-click-modal="false" :show-close="false" v-model="showModal" title="基本信息填写" width="50%"
            show-close="false">
            <x6GraphInfoVue :data="data" @confirm="onConfirmDialog" />

        </el-dialog>

        <div class="graph-container w-full h-full" v-if="!loading">


            <div class="base-info">
                <x6GraphInfoVue :data="data" />
            </div>

            <div class="x6-main">

                <div class="stencil h-full">
                    <x6StencilVue ref="stencil" />

                </div>
                <div class="graph-wrap">
                    <x6MainVue ref="main" />
                </div>
            </div>


            <x6EditorVue ref="editor" :mgraph="(mgraph as mGraph)" />
        </div>
    </div>
</template>

<style lang="less" scoped>
.graph-container {
    display: flex;

    flex-direction: column;

    .x6-main {
        height: 0px;
        flex: 1;
        display: flex;
    }

    .base-info {
        height: 80px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid rgb(231, 228, 228);
    }

    .graph-info {
        height: 0px;
        display: flex;
        flex: 1;
    }

    .stencil {
        width: 200px;
        position: relative;
    }

    .graph-wrap {
        width: 0px;
        flex: 1;
    }
}
</style>