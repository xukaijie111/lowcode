
<script lang="ts" setup>

import { nextTick, ref, watch } from 'vue'

import CodeEditorSideBarVue from './code-editor-sidebar.vue'
import CodeEditorTabBarVue from './code-editor-tabbar.vue'
import CodeEditorMainVue from './code-editor-main.vue';

import { ElMessageBox } from 'element-plus'
import type {
    ListItem
} from './type'

import _ from 'lodash';


const props = defineProps<{
    lists: Array<ListItem>,
    name?: string
}>()

const emits = defineEmits<{
    (e: 'save', data: Array<Record<any, any>>): void
}>()

interface MapValue {
    dirty: boolean,
    source: string
}

let mapCache = ref(new Map<string, MapValue>());

let dialogVisible = ref(false)
let sideBarRef = ref();
let tabBarRef = ref();
let mainRef = ref();
let activeId = ref();

watch(() => activeId.value, (newValue) => {

    if (!newValue) {
        mainRef.value.update("")
        return ;
    }
    // tab栏切换
    tabBarRef.value.addItem(newValue);

    // 
    let doc = mapCache.value.get(newValue)?.source
    mainRef.value.update(doc)
})



// 重置cache
const resetCache = (id?: string) => {
    if (id) {
        let item = _.find(props.lists, { id })
        if (item) {
            mapCache.value.set(id, {
                dirty: false,
                source: item.source
            })
        }
        return;
    } else {
        mapCache.value.clear();
        props.lists.forEach((item) => {
            let _id = item.id;
            mapCache.value.set(_id, {
                dirty: false,
                source: item.source
            })
        })
    }
}


// 手动保存的时候，flush到业务
const flushToNode = (id?: string | Array<string>) => {

    if (!id) {
        id = props.lists.map((n) => n.id)
    }

    if (!Array.isArray(id)) {

        id = [id];
    }

    let ret = []
    for (let i = 0; i < id.length; i++) {
        let item = mapCache.value.get(id[i]) as MapValue;
        item.dirty = false;
        ret.push({
            id: id[i],
            source: item.source
        })
    }

    console.log(`####save is `,ret);

    emits('save', ret)

}


const checkIsDirty = (id?: string) => {
    let ids = id ? [id] : props.lists.map((n) => n.id)

    for (let i = 0; i < ids.length; i++) {
        if (mapCache.value.get(ids[i])?.dirty) return true;
    }
    return false;
}


const onClickSideBarItem = (item: ListItem) => {
    activeId.value = item.id
}

const saveCurrentCM = () => {
    flushToNode(activeId.value);
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


    } catch (err) {
        return err
    }

    return ret;
}


const onClickTab = (item: ListItem) => {
    activeId.value = item.id;
}


const onCloseTab = async (id: string) => {

    if (checkIsDirty(id)) {
        let ret = await saveConfirm();
        if (ret === "close") return;
        if (ret === "cancel") resetCache(activeId.value);
        if (ret === "confirm") flushToNode(activeId.value);
    }

    let next = tabBarRef.value.getNextItem();

    if(next) {
        activeId.value = next.id;
    } else {
        activeId.value = null;
    }

    tabBarRef.value.deleteItem(id);
}

const open = async (id: string) => {
    resetCache();
    dialogVisible.value = true
    await nextTick();
    activeId.value = id;
}

const onCloseDialog = async () => {
    if (checkIsDirty()) {
        let ret = await saveConfirm();
        if (ret === "close") return;
        if (ret === "cancel") resetCache();
        if (ret === "confirm") flushToNode();
    }

    dialogVisible.value = false;
}

const dispatchCurrentCM = (doc: string) => {

    let id = activeId.value;
    if (!id) return;
    let source = _.find(props.lists, { id })?.source;
    let item = mapCache.value.get(id) as MapValue
    if (doc !== source) {
        item.dirty = true;

    } else {
        item.dirty = false;
    }
    item.source = doc;
}

defineExpose({
    open
})


</script>

<template>
    <div class="editor-wrap">
        <el-dialog style="border-radius:10px" :close-on-click-modal="false" :close-on-press-escape="false"
            v-model="dialogVisible" width="80%" top="5vh">

            <div slot="header"></div>
            <div class="content-wrap w-full">
                <CodeEditorSideBarVue :activeId="activeId" @click-item="onClickSideBarItem" ref="sideBarRef"
                    :lists="props.lists" />
                <div class="code-wrap h-full">
                    <CodeEditorTabBarVue @close-all="onCloseDialog" :map="mapCache" @click="onClickTab"
                        @close="onCloseTab" :lists="props.lists" :activeId="activeId" ref="tabBarRef" />

                    <CodeEditorMainVue @dispatch="dispatchCurrentCM" @save="saveCurrentCM" ref="mainRef" />
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