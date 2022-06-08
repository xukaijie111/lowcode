

<script lang="ts" setup>

import { Graph } from '@antv/x6'
import { nextTick, ref } from 'vue'
import { process } from '../core/process'
import graphSideBar from '../components/graphSideBar.vue'
import _ from 'lodash'

interface GraphItem {
    name: string,
    id: number,
    graph?: Graph
}

let editableTabsValue = ref(0);
let graphs = ref<Array<GraphItem>>([])
let id = 0;

const createGraph = () => {
    let item :GraphItem = {
        name: "未命名",
        id: id++
    }
    graphs.value.push(item);
    editableTabsValue.value = item.id;
    nextTick(() => {
        const graph = new Graph({
            container: document.getElementById(`graph${item.id}`) as HTMLElement,
             scroller: true,
            width:5000,
            height:5000,
            grid: {
                size: 20,
                visible: true,
                type: 'mesh', // 'dot' | 'fixedDot' | 'mesh'
                args: {
                    color: '#eee', // 网格线/点颜色
                    thickness: 1,     // 网格线宽度/网格点大小
                },
            },
        })
        item.graph = graph;
    })
}

const handleTabsEdit = () => {

}

createGraph();


process.getList({
    pageSize: 10,
    pageNum: 1,
    name: ""
})
</script>

<template>
    <div class="graph-wrap">

        <div class="content">
            <div class="left">
                <graphSideBar />
            </div>

            <div class="right">
                <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
                    <el-tab-pane v-for="item in graphs" :key="item.id" :label="item.name" :name="item.id">
                        <div class="tab-graph" :id="'graph' + item.id"></div>
                    </el-tab-pane>
                </el-tabs>


            </div>

        </div>
    </div>

</template>


<style lang="less" scoped>
.graph-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

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
