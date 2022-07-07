
<script lang="ts" setup>

import { nextTick, ref } from 'vue'
import { mGraph } from '../core/graph';
import { Node, NodeView } from '@antv/x6'
import codeEditorVue from './code-editor/index.vue';

import type { TabsPaneContext } from 'element-plus'
import { ElMessage } from 'element-plus'
import { nodeRule } from '../common/rule'

import processStartParamFormVue from './process-start-param-form.vue';

import _ from 'lodash'

import {
    run
} from '../core/run'

import {
    getOtherProcessList
} from '../common/api'

let props = defineProps<
    {
        mgraph: mGraph
        id: string
    }
>()

const emits = defineEmits<{
    (e: "save"): void
}>()

let drawerVisible = ref(false)

type Param = {
    node: Node,
    view: NodeView
}

type TabEnum = "base" | "code" | "detail" | "test"

//const baseRule = ref(nodeRule)

let activeName = ref<TabEnum>('base')

const currentNode = ref<Node>()
const nodeData = ref<any>();
const baseRef = ref();
const codeEditorRef = ref();
const paramRef = ref();

const otherProcessLists = ref();

const handleClickTab = (tab: TabsPaneContext, event: Event) => {
    event.stopPropagation();
}

const nodeValidCheck = async () => {
    try {
        let nodes = props.mgraph.getGraph().getNodes();
        let { base } = nodeData.value;
        let { name } = base;

        let names = nodes.filter((n) => n.id !== currentNode.value?.id).map((n) => n.getData().base.name)

        if (names.includes(name)) {
            ElMessage.warning(`名称${name} 重复了`)
            return Promise.reject();
        }
        await baseRef.value.validate();

    } catch (err) {
        ElMessage.warning(`基本信息內容有误`)
        console.log(err)
        return Promise.reject();
    }

}

const onConfirmClick = async () => {
    try {
        await nodeValidCheck();

        // 设置名称
        let data = nodeData.value;
        let { base } = data
        let { name } = base;
        if (name) {
            currentNode.value?.attr({
                label: {
                    text: name
                }
            })
        }

        currentNode.value?.setData(_.cloneDeep(data));

        emits('save')

    } catch (error) {
        console.log(error);
    }

}

const open = (param: Param) => {
    let { node } = param;
    currentNode.value = node;
    nodeData.value = _.cloneDeep(node.getData())
    drawerVisible.value = true
}

let codeLists = ref();
const onEditCodeClick = async () => {
    let nodes = props.mgraph.getGraph().getNodes();
    codeLists.value = nodes.map((node) => {
        let data = node.getData();
        let { base, code } = data;
        return {
            id: node.id,
            source: code.source,
            name: base.name || "未命名"
        }
    })

    await nextTick();

    codeEditorRef.value.open(currentNode.value?.id);
}

const onSaveCode = (list: Array<Record<any, any>>) => {
    let nodes = props.mgraph.getGraph().getNodes();
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let { id, source } = item;
        let node = _.find(nodes, { id }) as Node
        let data = node.getData();
        data.code.source = source;
        node.setData(_.cloneDeep(data));

        // 同步当前的临时nodeData中
        if (currentNode.value?.id === id) {
            nodeData.value.code.source = source;
        }

    }
}


const onTestClick = async () => {
    if (!paramRef.value.checkParamValidate()) return;
    let name = props.mgraph.getName();
    await run(name);
}

const remoteMethod = async (name: string) => {
    try {
        let ret = await getOtherProcessList({
            id: props.id,
            name
        })
        otherProcessLists.value = ret;

    } catch (err) {

    }


}
defineExpose({
    open
})
</script>

<template>

    <div class="editor-wrap">

        <codeEditorVue @save="onSaveCode" ref="codeEditorRef" :lists="codeLists" />

        <el-drawer v-model="drawerVisible" title="编辑节点" direction="rtl" size="50%">
            <div class="draw-wrap w-full h-full">
                <div class="draw-content-wrap w-full h-full">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTab">
                        <el-tab-pane label="基本信息" name="base"></el-tab-pane>
                        <el-tab-pane label="代码" name="code"></el-tab-pane>
                        <el-tab-pane label="详情" name="detail"></el-tab-pane>

                        <!-- <el-tab-pane label="测试" name="test"></el-tab-pane> -->
                    </el-tabs>


                    <div class="draw-content w-full">
                        <div v-show="activeName === 'base'" class="w-full">
                            <el-form :model="nodeData.base" label-position="left" ref="baseRef" label-width="60px"
                                :rules="nodeRule" class="w-full">
                                <el-form-item label="名称" prop="name">
                                    <el-input v-model="nodeData.base.name" placeholder="只支持英文" />
                                </el-form-item>
                                <el-form-item label="描述" prop="description">
                                    <el-input v-model="nodeData.base.description" />
                                </el-form-item>

                            </el-form>
                        </div>

                        <div v-show="activeName === 'code'">
                            <el-radio-group v-model="nodeData.code.mode" class="w-full">
                                <el-radio label="self">自定义实现</el-radio>
                                <el-radio label="other">引入其他流</el-radio>

                                <el-select v-if="nodeData.code.mode === 'other'" v-model="nodeData.code.other"
                                    filterable remote reserve-keyword placeholder="Please enter a keyword"
                                    :remote-method="remoteMethod">
                                    <el-option v-for="item in otherProcessLists" :key="item.id" :label="item.basic.name"
                                        :value="item.id" />
                                </el-select>
                            </el-radio-group>
                            <div v-if="nodeData.code.type === 'self'">
                                <el-button type="primary" @click="onEditCodeClick">编辑</el-button>
                            </div>


                        </div>



                        <div v-show="activeName === 'test'">

                            <processStartParamFormVue ref="paramRef" />

                        </div>




                    </div>
                </div>

                <el-button type="primary" v-if="activeName !== 'test'" @click="onConfirmClick">保存</el-button>
                <el-button type="primary" v-if="activeName === 'test'" @click="onTestClick">测试</el-button>
            </div>

        </el-drawer>
    </div>
</template>

<style lang="less" scoped>
.editor-wrap {
    .draw-wrap {
        padding: 20px 20px;
        display: flex;
        flex-direction: column;
    }

    .draw-content-wrap {
        flex: 1;
        height: 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;

        .draw-content {
            flex: 1;
            height: 0px;

        }
    }

    :deep(.el-drawer__header) {
        margin-bottom: 0px;
    }
}
</style>
