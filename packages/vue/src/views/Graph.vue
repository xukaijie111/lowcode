<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { mGraph } from '../core/graph'
import x6MainVue from '../components/x6-main.vue';
import x6StencilVue from '../components/x6-stencil.vue';

let stencil = ref()
let main =  ref() 
let mgraph:mGraph
onMounted(() => {
    mgraph = new mGraph();
    //console.log(`#####x6MainVue is `,main)
    main.value.init(mgraph);
    stencil.value.init(mgraph)
})


</script>


<template>
    <div class="graph-container w-full h-full">
        <div class="stencil h-full" >
            <x6StencilVue ref="stencil"/>

        </div>
        <div class="graph-wrap">
             <x6MainVue ref="main" />
        </div>
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