

<script lang="ts" setup>

 import { onMounted } from 'vue'
 import { Process } from '../core/process'
 import { MenuPlugin } from "../core/plugins/index"

let process = new Process();

onMounted(() => {
process.createGraph({
    ele:document.getElementById('container') as HTMLElement,
    plugins:[
        new MenuPlugin()
    ]
})
})


</script>

<template>
    <div class="graph-wrap">
        <div class="container" id="container"></div>
    </div>

</template>


<style lang="less" scoped>
.graph-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .container {
        width:100%;
        height:100%;
        position: relative;
    }
}
</style>
