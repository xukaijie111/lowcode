<script lang="ts" setup>
import { onMounted, ref ,nextTick} from 'vue';
import { mGraph } from '../core/graph'
import x6MainVue from '../components/x6-main.vue';
import x6StencilVue from '../components/x6-stencil.vue';
import x6EditorVue from '../components/x6-editor.vue'

let stencil = ref()
let main = ref()
let editor = ref();
let mgraph = ref<mGraph>();
let loading = ref(true)
onMounted(() => {
    mgraph.value = new mGraph();

    loading.value = false;
    nextTick(() => {
        main.value.init(mgraph.value);
        stencil.value.init(mgraph.value);

        (mgraph.value as mGraph).on("node:dblclick", (param) => {
            editor.value.open(param);
    })
    })

})


</script>


<template>
    <div class="graph-container w-full h-full" v-if="!loading">
        <div class="stencil h-full">
            <x6StencilVue ref="stencil" />

        </div>
        <div class="graph-wrap">
            <x6MainVue ref="main" />
        </div>

        <x6EditorVue ref="editor" :mgraph="(mgraph as mGraph)" />
    </div>
</template>

<style lang="less" scoped>
.graph-container {
    display: flex;

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