<script lang="ts" setup>

import { ref,watch } from 'vue';
import type { Node } from '@antv/x6'
import { mGraph } from '../../core/graph';
import { Close } from '@element-plus/icons-vue'
import _ from 'lodash';

let props = defineProps<
  {
    mgraph: mGraph
    activeId:string,
    map:Map<string,unknown>
  }
>()

let emits = defineEmits<
{
  (e:"close"):void
  (e:'click',node:Node):void
}
>()

let opendNodes = ref<Array<Node>>([]);

const handleCurrentTab = (node: Node) => {
  if (props.activeId && node.id === props.activeId) return;
  emits('click',node)
}

const update = () => {
  let nodes = props.mgraph.getGraph().getNodes();
  for (let i = 0; i < opendNodes.value.length;i++) {
    if (!_.find(nodes,{ id: opendNodes.value[i].id})) {
      opendNodes.value.splice(i,1);
      i--;
    }

  }
}

const addNode = (node: Node) => {
  if (!_.find(opendNodes.value, { id: node.id })) {
    opendNodes.value.push(node);
  }
}

const deleteNode = (id:string) => {
 
  let index = _.findIndex(opendNodes.value, { id })

  if (index !== -1) {
    opendNodes.value.splice(index,1)
  }
}

const getNextNode = () => {
    let currentNodeId = props.activeId;
    let index = _.findIndex(opendNodes.value, { id:currentNodeId})
    console.log(`###index is `,index);
    if (index === -1) {
      return console.error(`error why?`)
    }
    if (index === 0) {
        if (opendNodes.value.length === 1) return null;
        return opendNodes.value[index + 1];
    }else {
      return opendNodes.value[index - 1];
    }


}


const getNodeName = (node: Node) => {
  let data = node.getData();
  return data.base.name || "未命名"
}

const onCloseClick = () => {
  emits('close')
}


defineExpose({
  addNode,
  deleteNode,
  update,
  getNextNode
})

const getItemClass = (item) => {
  let param = {}
  let { id } = item
  if (props.activeId && props.activeId === id) {
    param[ 'active-tab'] = true;
  }

  let mapData = props.map.get(id);
  //@ts-ignore
   if (mapData&& mapData.dirty) param['dirty'] = true;

  return param
}

watch(
  () => props.map,
  (newValue) => {
    
  },
  {
    deep:true
  }
)


</script>


<template>
  <div id="editorTabBar" class="noselect">
    <div class="tab-list " ref="tabList">
      <div v-for="(item, index) in opendNodes" :key="index" class="editor-tab  flex-center"
        v-bind:class="getItemClass(item)"
       @click="handleCurrentTab(item as Node)">
        {{ getNodeName(item as Node) }}

        <el-icon class="close-icon" color="white" size="10" @click.stop="onCloseClick"><Close /></el-icon>
      </div>
    </div>
  </div>
</template>



<style lang="less" scoped>
/* main style */
#editorTabBar {
  width: 100%;
  height: 30px;
  background-color: #262626;
  display: flex;

  .tab-list {
    width: 100%;
    overflow-y: auto;
    overflow-y: overlay; // only fit webkit
    position: relative;
    display: flex;
    flex: 1;

    &::-webkit-scrollbar {
      outline: none;
      height: 4px;
      background-color: transparent;
      transition: all 0.3s ease;
    }

    &::-webkit-scrollbar-track {
      background-color: rgba(30, 30, 30, 0);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(80, 80, 80, 0.3);
    }

    &::-webkit-scrollbar-thumb:hover {
      outline: none;
      background-color: rgba(80, 80, 80, 0.7);
    }

    .editor-tab {
      padding: 0 20px;
      color: #bfbfbf;
      background-color: #333;
      font-size: 14px;
      position: relative;
      cursor: pointer;

    &.dirty {
      color: rgb(226,192,141);
      &:hover{
        color: rgb(234, 166, 63);;
      }
    }
      .close-icon {
        right: 0px;
        top: 0px;
        position: absolute;
        top: 50%;
        right: 4px;
        transform: translateY(-50%);
        border: 10px;
        background-color: #333333;
        opacity: 0;
         transition: all 0.3s ease;
      }


      &:not(:first-child) {
        border-left: 1px solid #1a1a1a;
      }

      &:hover {
        color: #f2f2f2;
        .close-icon{
          opacity: 1;
        }
      }
    }

    .active-tab {
    background-color: #1e1e1e;
    color: #f2f2f2;
    }
  }

}
</style>
