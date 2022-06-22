
<script lang="ts" setup>

import { ref, nextTick, watch } from 'vue'
import type { Node } from '@antv/x6'
import { mGraph } from '../../core/graph';
import CodeEditorSideBarVue from './code-editor-sidebar.vue'
import CodeEditorTabBarVue from './code-editor-tabbar.vue'
import CodeEditorMainVue from './code-editor-main.vue';

import _ from 'lodash';

let props = defineProps<
    {
        mgraph: mGraph
    }
>()

let dialogVisible = ref(false)
let sideBarRef = ref();
let tabBarRef = ref();
let mainRef = ref();
let codeAreaRef = ref();
let activeNodeId = ref();
let code = ref('');
let nodes = ref<Array<Node>>();


const openEditor = (node: Node) => {
    dialogVisible.value = true;
    nodes.value = props.mgraph.getGraph().getNodes();
    nextTick(() => {
        sideBarRef.value.update();
        tabBarRef.value.update();
        onClickSideBarItem(node);
    })
}

const onClickSideBarItem = (node: Node) => {
    activeNodeId.value = node.id;
    tabBarRef.value.addNode(node);

}

watch(activeNodeId, (newValue) => {
    let currentNode = _.find(nodes.value, { id: newValue });
    if (!currentNode) return;
    mainRef.value.update(currentNode);
})


defineExpose({
    openEditor
})


</script>

<template>
    <div class="editor-wrap">
        <el-dialog v-model="dialogVisible" width="80%" top="5vh">

            <div slot="header" class="header flex-center relative">
                {{mgraph.getName()}}
                    
            </div>
            <div class="content-wrap w-full">
                <CodeEditorSideBarVue :activeNodeId="activeNodeId" @click-item="onClickSideBarItem" ref="sideBarRef"
                    :mgraph="props.mgraph" />
                <div class="code-wrap h-full">
                    <CodeEditorTabBarVue :activeNodeId="activeNodeId" :mgraph="props.mgraph" ref="tabBarRef" />

                    <CodeEditorMainVue ref="mainRef" />
                </div>
            </div>

        </el-dialog>
    </div>

</template>


<style lang="less" scoped>
.editor-wrap {
    :deep(.el-dialog__body) {
        padding: 0px;
    }

    :deep(.el-dialog__header) {
        height: 0px;
        width: 0px;
        opacity: 0;
        margin: 0px;
        padding: 0px;
    }

    .header {

    }
}


.content-wrap {
    height: 800px;
    // background-color: #1e1e1e;
    display: flex;

    .code-wrap {
        flex: 1;
        width: 0px;
        overflow: auto;
        display: flex;
        flex-direction: column;

        .code-mirror {
            font-family: Monaco;
            font-size: 14px;
        }
    }

}
</style>