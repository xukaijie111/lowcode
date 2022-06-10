

<script lang="ts" setup>

 import { nextTick, onMounted, ref } from 'vue'
 import { Process } from '../core/process'
 import { MenuPlugin } from "../core/plugins/index"
// import { GraphMenu } from '../core/menu'

let process = new Process();

onMounted(() => {
let graph = process.createGraph({
    ele:document.getElementById('container') as HTMLElement,
    plugins:[
        new MenuPlugin()
    ]
})
})


process.getList({
    pageSize: 10,
    pageNum: 1,
    name: ""
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

    .content {
        flex: 1;
        height: 0px;
        display: flex;

        .right {
            flex: 1;
            width: 0px;
            display: flex;
            flex-direction: column;

        }

    }
}
</style>
