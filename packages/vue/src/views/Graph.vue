<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue';
import { mGraph } from '../core/graph'
import x6MainVue from '../components/x6-main.vue';
import x6StencilVue from '../components/x6-stencil.vue';
import x6EditorVue from '../components/x6-editor.vue';
import x6GraphInfoVue from '../components/x6-graph-info.vue'
import _ from 'lodash'

let stencil = ref()
let main = ref()
let editor = ref();
let mgraph = ref<mGraph>();
let loading = ref(true)
let data = ref({
    name: "",
    description: ""
})

const createGraph = () => {
    mgraph.value = new mGraph();
    nextTick(() => {
        main.value.init(mgraph.value,data.value);
        stencil.value.init(mgraph.value);

        (mgraph.value as mGraph).on("node:dblclick", (param) => {
            editor.value.open(param);
        })
    })

}

const onConfirmDialog = (_data) => {
   data.value = _.cloneDeep(_data);
   loading.value = false;
   nextTick(() => {
        createGraph();
   })

}

</script>


<template>
    <div class="w-full h-full">
        <el-dialog v-model="loading" title="基本信息填写" width="80%" show-close="false">
            <x6GraphInfoVue :data="data" @confirm="onConfirmDialog"/>

        </el-dialog>

        <div class="graph-container w-full h-full" v-if="!loading">


            <div class="base-info">
                <x6GraphInfoVue :data="data" />
            </div>
            <div class="graph-info"></div>
            <div class="stencil h-full">
                <x6StencilVue ref="stencil" />

            </div>
            <div class="graph-wrap">
                <x6MainVue ref="main" />
            </div>

            <x6EditorVue ref="editor" :mgraph="(mgraph as mGraph)" />
        </div>
    </div>
</template>

<style lang="less" scoped>
.graph-container {
    display: flex;

    flex-direction: column;

    .base-info {}

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