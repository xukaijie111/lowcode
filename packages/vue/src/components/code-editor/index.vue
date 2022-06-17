
<script lang="ts" setup>

import { ref, nextTick, watch } from 'vue'
import type { Node } from '@antv/x6'
import { mGraph } from '../../core/graph';
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
let activeNodeId = ref();
let code = ref('');
let nodes = ref<Array<Node>>();

const openEditor = (node: Node) => {
    dialogVisible.value = true;
    nodes.value = props.mgraph.getGraph().getNodes();
    nextTick(() => {
         sideBarRef.value.update();
    })
}

const onClickSideBarItem = (node:Node) => {
    activeNodeId.value = node.id;
    tabBarRef.value.addNode(node);

}

watch(activeNodeId,(newValue) => {
    
})


defineExpose({
    openEditor
})


</script>

<template>

    <el-dialog v-model="dialogVisible" width="80%" top="5vh">
        <div class="content-wrap w-full">
            <CodeEditorSideBarVue 
            :activeNodeId="activeNodeId"
            @click-item="onClickSideBarItem"
            ref="sideBarRef" :mgraph = "props.mgraph"/>
            <div class="code-wrap h-full">
                <CodeEditorTabBarVue 
                :activeNodeId="activeNodeId"
                :mgraph = "props.mgraph" ref="tabBarRef"/>

                 <!-- <codemirror  :value="code" v-model="code"
                    @cursorActivity="cursorPosChanged" class="code-mirror" :class="mdToolbarVisible&&index===0?'md-active':''"
                    ref="codeArea">
                </codemirror> -->
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

        .code-mirror{
            font-family:Monaco;
            font-size: 14px;
        }
    }

}
</style>