
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
let currentNode = ref();
let nodes = ref<Array<Node>>();


const setCurrentNode = (node) => {
    if (!node) {
        currentNode.value = null;
        return;
    }
    currentNode.value = node;
}
const openEditor = (node: Node) => {
    dialogVisible.value = true;
    nodes.value = props.mgraph.getGraph().getNodes();
    nextTick(() => {
        sideBarRef.value.update();
      //  tabBarRef.value.update();
        onClickSideBarItem(node);
    })
}

const onClickSideBarItem = (node: Node) => {
    setCurrentNode(node);
    tabBarRef.value.addNode(node);

}


const closeCurrentTab = () => {
    let preNode = currentNode.value;
    console.log(`###preNode is `,preNode);
    let preId = preNode.id;
    let opendNodes = tabBarRef.value.getNodes();
    let index = _.findIndex(opendNodes,{ id:preId });
    if (index === 0 ) {
        if (opendNodes[1])
         setCurrentNode(opendNodes[1])
        else setCurrentNode(null)
    }else {
       setCurrentNode(opendNodes[index-1]);
    }
    tabBarRef.value.deleteNode(preNode.id)
}

const onClickTab = (node) => {
        currentNode.value = node;
}


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
                <CodeEditorSideBarVue :node="currentNode" @click-item="onClickSideBarItem" ref="sideBarRef"
                    :mgraph="props.mgraph" />
                <div class="code-wrap h-full">
                    <CodeEditorTabBarVue 
                    @click="onClickTab"
                    @close="closeCurrentTab"
                    :node="currentNode" :mgraph="props.mgraph" ref="tabBarRef" />

                    <CodeEditorMainVue ref="mainRef" :node="currentNode"/>
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