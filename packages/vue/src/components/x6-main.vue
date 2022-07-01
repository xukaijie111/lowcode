<script lang="ts" setup>
    import { mGraph } from '../core/graph'

 
     const init = (mgraph:mGraph,options:Record<any,any>) => {
        mgraph.createGraph({
            ...options,
            container:document.getElementById('graph') as HTMLElement
        });
    }

    defineExpose({
        init
    })

</script>

<template>

<div class="main-wrap ww-full h-full" id="graph"></div>

</template>

<style lang="less" scoped>

</style>