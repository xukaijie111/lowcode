
<script lang="ts" setup>

import { ref, defineExpose, nextTick } from 'vue'
import type { Node } from '@antv/x6'
import { mGraph } from '../core/graph';
import CodeEditorSideBarVue from './code-editor-sidebar.vue'
import CodeEditorTabBarVue from './code-editor-tabbar.vue'
    let props = defineProps<
        {
            mgraph:mGraph
        }
    >()

let dialogVisible = ref(false)
let sideBarRef = ref();
let tabBarRef = ref();


const openEditor = (node: Node) => {
    dialogVisible.value = true;
    nextTick(() => {
         sideBarRef.value.update();
    })
}

const onClickSideBarItem = (node:Node) => {
    tabBarRef.value.addNode(node);

}

defineExpose({
    openEditor
})


</script>

<template>

    <el-dialog v-model="dialogVisible" width="80%" top="5vh">
        <div class="content-wrap w-full">
            <CodeEditorSideBarVue 
            @click-item="onClickSideBarItem"
            ref="sideBarRef" :mgraph = "props.mgraph"/>
            <div class="code-wrap h-full">
                <CodeEditorTabBarVue :mgraph = "props.mgraph" ref="tabBarRef"/>
            </div>
        </div>

    </el-dialog>

</template>


<style lang="less" scoped>
.content-wrap {
    height: 800px;
    background-color: #1e1e1e;
    display: flex;

    .code-wrap {
        flex: 1;
        width: 0px;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }

}
</style>