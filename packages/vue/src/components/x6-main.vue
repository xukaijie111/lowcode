<script lang="ts" setup>
    import { defineExpose } from 'vue'
    import { mGraph } from '../core/graph'

 
     const init = (mgraph:mGraph) => {
        mgraph.createGraph({
            container:document.getElementById('graph') as HTMLElement
        });
    }

    defineExpose({
        init
    })

</script>

<template>

<div class="main-wrap ww-full h-full" id="graph">
  
</div>

</template>

<style lang="less" scoped>

</style>