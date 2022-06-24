<script lang="ts" setup>
import { defineExpose } from 'vue'
import { mGraph } from '../core/graph';

const init = (mgraph: mGraph) => {
    mgraph.createStencil({},document.getElementById('stencil') as HTMLElement);
    mgraph.regitserNode();
    mgraph.loadStencil();
}
defineExpose({
    init
})
</script>

<template>
    <div class="stencil-wrap w-full h-full" id="stencil"></div>
</template>

<style lang="less" scoped>

.stencil-wrap {
    padding: 5px;
    box-sizing: border-box;
}
</style>