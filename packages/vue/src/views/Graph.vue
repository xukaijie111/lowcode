

<script lang="ts" setup>

import { Graph } from '@antv/x6'
import { nextTick, ref } from 'vue'
import { Process } from '../core/process'
import { GraphMenu } from '../core/menu'
import graphSideBar from '../components/graphSideBar.vue'
import _ from 'lodash'

import * as d3 from 'd3'
let process = new Process();
let graphMenu = new GraphMenu();

interface GraphItem {
    name: string,
    id: number,
    graph?: Graph
}
let vcellMenus = ref(graphMenu.getMenus())


let editableTabsValue = ref(0);
let graphs = ref<Array<GraphItem>>([])
let id = 0;

function createGraph() {
    let item: GraphItem = {
        name: "未命名",
        id: id++
    }
    graphs.value.push(item);
    editableTabsValue.value = item.id;

    nextTick(() => {
        const graph = process.createGraph({
            container: document.getElementById(`graph${item.id}`) as HTMLElement,
            scroller: {
                enabled: true,
                className: `graph-scroller-${item.id}`
            }
        })
        item.graph = graph;

        nextTick(() => {
            addGraphScrollerEvent(item.id)
        })
    })
}

const addGraphScrollerEvent = (id: number) => {
    let eles = document.getElementsByClassName(`graph-scroller-${id}`)
    if (eles.length) {
        let ele = eles[0];
        ele.setAttribute('data-id', id.toString())
        //@ts-ignore
        ele.addEventListener('dragover', allowDrop)
        //@ts-ignore
        ele.addEventListener('drop', onDrop)
    }
}

const handleTabsEdit = () => {

}


const allowDrop = (event: DragEvent) => {
    event.preventDefault();
}

const onDrop = (event: DragEvent) => {
    let ele = event.currentTarget;
    //@ts-ignore
    let id = parseInt(ele?.dataset?.id);
    let graph = _.find(graphs.value, { id })?.graph
    if (!graph) return;
    let cellId = event.dataTransfer?.getData("data") as string;
    let cell = graphMenu.getMenuItemById(cellId);

    let point = d3.pointer(event, d3.select(ele as HTMLElement).node())
    process.addNode(graph as Graph, cell, point)



    event.preventDefault();
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
                <graphSideBar :menus="vcellMenus" />
            </div>

            <div class="right">
                <el-tabs v-model="editableTabsValue" type="card" editable class="demo-tabs" @edit="handleTabsEdit">
                    <el-tab-pane v-for="(item) in graphs" :key="item.id" :label="item.name" :name="item.id">
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
