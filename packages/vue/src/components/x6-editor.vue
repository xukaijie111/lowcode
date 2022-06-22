
<script lang="ts" setup>

import { ref } from 'vue'
import { mGraph } from '../core/graph';
import { Node, NodeView } from '@antv/x6'
import codeEditorVue from './code-editor/index.vue';

import type { TabsPaneContext } from 'element-plus'
import { ElMessage } from 'element-plus'
import { nodeRule } from '../common/rule'
import _ from 'lodash'

    let props = defineProps<
        {
            mgraph:mGraph
        }
    >()

let drawerVisible = ref(false)

type Param = {
    node: Node,
    view: NodeView
}

type TabEnum = "base" | "code" | "detail"

//const baseRule = ref(nodeRule)

let activeName = ref<TabEnum>('base')

const currentNode = ref<Node>()
const nodeData = ref<any>();
const baseRef = ref();
const codeEditorRef = ref();


const handleClickTab = (tab: TabsPaneContext, event: Event) => {
    event.stopPropagation();
}

const nodeValidCheck = async () => {
    try{
        await baseRef.value.validate();

    }catch(err) {
        ElMessage.warning(`基本信息內容有误`)
        return Promise.reject();
    }
   
}

const onConfirmClick = async () => {
    try {
        await nodeValidCheck();
        currentNode.value?.setData(_.cloneDeep(nodeData.value))
        ElMessage.success(`保存成功`)
    } catch (error) {
        
    }

}

const open = (param: Param) => {
    let { node } = param;
    currentNode.value = node;
    nodeData.value = _.cloneDeep(node.getData())
    drawerVisible.value = true
}

const onEditCodeClick = () => {
    codeEditorRef.value.openEditor(currentNode.value);
}

defineExpose({
    open
})
</script>

<template>

    <div class="editor-wrap">

        <codeEditorVue ref="codeEditorRef" :mgraph = "props.mgraph"/>

        <el-drawer v-model="drawerVisible" title="编辑节点" direction="rtl" size="50%">
            <div class="draw-wrap w-full h-full">
                <div class="draw-content-wrap w-full h-full">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClickTab">
                        <el-tab-pane label="基本信息" name="base"></el-tab-pane>
                        <el-tab-pane label="代码" name="code"></el-tab-pane>
                        <el-tab-pane label="详情" name="detail"></el-tab-pane>
                    </el-tabs>


                    <div class="draw-content w-full">
                        <div v-if="activeName === 'base'" class="w-full">
                            <el-form :model="nodeData.base" 
                            label-position="left"
                            ref="baseRef"
                            label-width="60px" :rules="nodeRule" class="w-full">
                                <el-form-item label="名称" prop="name">
                                    <el-input v-model="nodeData.base.name" placeholder="只支持英文"/>
                                </el-form-item>
                                <el-form-item label="描述" prop="description">
                                     <el-input v-model="nodeData.base.description" />
                                </el-form-item>
                               
                            </el-form>
                        </div>

                        <div v-if="activeName === 'code'" >
                             <el-radio-group v-model="nodeData.code.mode" class="w-full">
                                <el-radio label="self">自定义实现</el-radio>
                                <el-radio label="imoort">引入其他流</el-radio>
                            </el-radio-group>
                            <div v-if="nodeData.code.mode === 'self' ">
                                    <el-button type="primary" @click="onEditCodeClick">编辑</el-button>
                            </div>

                            <div v-if="nodeData.code.mode === 'imoort' ">
                                    <el-button type="primary">选择</el-button>
                            </div>
                        </div>


                    </div>
                </div>

                <el-button type="primary" @click="onConfirmClick">确定</el-button>
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
