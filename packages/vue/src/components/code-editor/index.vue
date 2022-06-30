
<script lang="ts" setup>

import { ref, nextTick } from 'vue'
import type { Node } from '@antv/x6'
import { mGraph } from '../../core/graph';
import CodeEditorSideBarVue from './code-editor-sidebar.vue'
import CodeEditorTabBarVue from './code-editor-tabbar.vue'
import CodeEditorMainVue from './code-editor-main.vue';
import { Close } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'


import _ from 'lodash';

type MapValue = {
    node: Node,
    dirty: boolean,
    source: string
}

let mapCache = ref(new Map<string, MapValue>());

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
let activeId = ref();
let nodes: Array<Node> = []


// 重置cache
const resetCache = (id?: string) => {
   
    let nodes = props.mgraph.getGraph().getNodes();
    if (id) {
        let node = _.find(nodes, { id })
        if (node) {
            mapCache.value.set(id, {
                dirty: false,
                source: node.getData().code.source,
                node,
            })
        }
        return;
    }else {
         mapCache.value.clear();
        nodes.forEach((node) => {
            let _id = node.id;

            console.log(`获取节点代码为`,node.getData().code.source)
            mapCache.value.set(_id, {
                dirty: false,
                source: node.getData().code.source,
                node
            })
        })

        console.log(`###mapcache is `,_.cloneDeep(mapCache.value));
    }
   

}

const getCacheCode = (node: Node) => {
    let id = node.id;
    let data = mapCache.value.get(id);
    if (data) return data.source
}

const getNodeById = (id: string) => {

    let node = _.find(nodes, { id });
    return node;
}

const checkCurrentHasChange = () => {
    let id = currentNode.value?.id as string;
    let doc = mainRef.value.getCurrentCM();
    let map = mapCache.value.get(id);
    if (map) {
        let { source } = map
        if (source !== doc) return true;
    }
    return false;
}

const checkCacheHasChange = () => {
    for (let [, value] of mapCache.value) {
        if (value.dirty) return true;
    }
    return false;
}

// 切换tab的时候，保存临时写的代码
const flushToMap = () => {
    let id = currentNode.value?.id as string;
    let map = mapCache.value.get(id);
    if (map) {
        let doc = mainRef.value.getCurrentCM();
        let source = map.source;
        if (doc !== source) {
            map.dirty = true;
            map.source = doc;
        }
    }
}

// 手动保存的时候，flush到Node
const flushToNode = (id?: string | Array<string>) => {

    if (!id) {
        id = props.mgraph.getGraph().getNodes().map((n) => n.id)
    }

    if (Array.isArray(id)) {
        id.forEach((i) => flushToNode(i));
        return;
    }


    let map = mapCache.value.get(id) as MapValue;

    // 当前的节点，则从CM取，其他的从cache里取
    let doc = id === currentNode.value.id ? mainRef.value.getCurrentCM() : map?.source;

    let node = getNodeById(id) as Node;
    let data = node.getData();
    data.code.source = doc;
    node.setData(data);
    map.dirty = false;
    map.source = doc;

}

const setCurrentNode = (node: Node | null) => {
    if (!node) {
        //@ts-ignore
        currentNode.value = null;
        activeId.value = null
        mainRef.value.update('')
        return;
    }
    mainRef.value.update(getCacheCode(node));
    currentNode.value = node;
    activeId.value = node.id;
}
const openEditor = (node: Node) => {
    resetCache();
    dialogVisible.value = true;
    nodes = props.mgraph.getGraph().getNodes();
    nextTick(() => {
        sideBarRef.value.update();
        tabBarRef.value.update();
        setCurrentNode(node);
        tabBarRef.value.addNode(node);
    })
}

const onClickSideBarItem = (node: Node) => {
    flushToMap();
    setCurrentNode(node);
    tabBarRef.value.addNode(node);
}

const saveConfirm = async () => {
    let ret
    try {
        ret = await ElMessageBox.confirm(
            '是否保存修改',
            '提示',
            {
                distinguishCancelAndClose: true,
                confirmButtonText: '保存',
                cancelButtonText: '不保存',
                type: 'warning',
            }

        )

        flushToNode();

    } catch (err) {
        return err
    }

    return ret;
}


const closeCurrentTab = async () => {

    if (checkCurrentHasChange()) {
        let ret = await saveConfirm();
        if (ret === "close") return;
        if (ret === "cancel") resetCache(currentNode.value.id);
        if (ret === "confirm") flushToNode(currentNode.value.id);

    }

    let preNodeId = currentNode.value.id;
    let nextNode = tabBarRef.value.getNextNode();
    setCurrentNode(nextNode);
    tabBarRef.value.deleteNode(preNodeId)
}

const onClickTab = (node: Node) => {
    flushToMap();
    setCurrentNode(node);
}

const onCloseClick = async () => {

    if (checkCacheHasChange() || checkCurrentHasChange()) {
        let ret = await saveConfirm();
        if (ret === "close") return;
        if (ret === "cancel") resetCache();
        if (ret === "confirm") flushToNode();
    }

    dialogVisible.value = false;

}

const saveCurrentCM = () => {
    flushToNode(currentNode.value.id);
}


defineExpose({
    openEditor
})


</script>

<template>
    <div class="editor-wrap">
        <el-dialog 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        v-model="dialogVisible" width="80%" top="5vh" >

            <div slot="header" class="header flex-center relative">
                {{ mgraph.getName() }}
                <el-icon class="close-icon" color="black" size="12" @click="onCloseClick">
                    <Close />
                </el-icon>
            </div>
            <div class="content-wrap w-full">
                <CodeEditorSideBarVue :activeId="activeId" @click-item="onClickSideBarItem" ref="sideBarRef"
                    :mgraph="props.mgraph" />
                <div class="code-wrap h-full">
                    <CodeEditorTabBarVue :map="mapCache" @click="onClickTab" @close="closeCurrentTab"
                        :activeId="activeId" :mgraph="props.mgraph" ref="tabBarRef" />

                    <CodeEditorMainVue @save="saveCurrentCM" ref="mainRef" :node="currentNode" />
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
        position: relative;

        .close-icon {
            position: absolute;
            right: 30px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }
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