<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';
import { mGraph } from '../core/graph'
import x6MainVue from '../components/x6-main.vue';
import x6StencilVue from '../components/x6-stencil.vue';
import x6EditorVue from '../components/x6-editor.vue';
import x6GraphInfoVue from '../components/x6-graph-info.vue'
import _ from 'lodash'
import { useRoute } from 'vue-router'
import { createProcess, getProcessDetail, saveDsl,deployDsl } from '../common/api'
import { ElMessage } from 'element-plus';
import { Edge } from '@antv/x6';


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

const onConfirmProcessBasicInfo = async (_data: unknown) => {
    //@ts-ignore
    data.value = _.cloneDeep(_data);
    await saveDsl(id.value, { basic: data.value });
    ElMessage.success(`保存成功`)
}


const createGraph = async (options = {}) => {
    mgraph.value = new mGraph();
    await nextTick();
    main.value.init(mgraph.value, options);
    stencil.value.init(mgraph.value);

    (mgraph.value as mGraph).on("node:dblclick", (param) => {
        editor.value.open(param);
    });

}

const onConfirmDialog = async (_data: unknown) => {

    //@ts-ignore
    data.value = _.cloneDeep(_data);

    await create();
    showModal.value = false;
    editUrl();
    loading.value = false;
    await nextTick();
    createGraph();

    mgraph.value?.setData(data.value);
}

const create = async () => {
    let _id = await createProcess({ basic: data.value });
    id.value = _id;
}

const _getProcessDetail = async () => {
    let res = await getProcessDetail(id.value);
    //@ts-ignore
    let { basic, config } = res;
    data.value = basic;
    mgraph.value?.fromJSON(config);
    mgraph.value?.setData(basic)

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
        await _getProcessDetail();
    } else {
        showModal.value = true;
    }
}

onMounted(() => {
    init();
})


const onSaveDsl = async () => {
    let body = {
        basic: {
            ...data.value
        },
        config: mgraph.value?.toJSON()
    }

    await saveDsl(id.value, body)

    ElMessage.success(`保存成功`)

}

const onDeployDsl = async () => {
    let ret = mgraph.value?.checkGraphValid();

    if (!ret?.sucess) {
        return ElMessage.warning(`${ret?.errorMsg}`);
    }

     let body = {
        basic: {
            ...data.value
        },
        config: mgraph.value?.toJSON()
    }

    await deployDsl(id.value, body)

    ElMessage.success(`部署成功`)
}




</script>


<template>
    <div class="w-full h-full">
        <el-dialog :close-on-click-modal="false" :show-close="false" v-model="showModal" title="基本信息填写" width="50%"
            show-close="false">
            <x6GraphInfoVue :data="data" @confirm="onConfirmDialog" />

        </el-dialog>

        <div class="graph-container w-full h-full" v-if="!loading">


            <div class="base-info">
                <x6GraphInfoVue :data="data" @confirm="onConfirmProcessBasicInfo" />
            </div>

            <div class="x6-main">

                <div class="stencil h-full">
                    <x6StencilVue ref="stencil" />

                </div>
                <div class="graph-wrap">
                    <div class="graph-operates">
                        <el-button type="primary" @click="onSaveDsl">保存</el-button>
                        <el-button type="primary" @click="onDeployDsl">部署</el-button>
                    </div>
                    <x6MainVue ref="main" />
                </div>
            </div>


            <x6EditorVue 
            :id="id"
            ref="editor" :mgraph="(mgraph as mGraph)" @save="onSaveDsl"/>
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
        position: relative;

        .graph-operates {
            position: absolute;
            top: 30px;
            right: 30px;
            z-index: 10;
        }
    }
}
</style>