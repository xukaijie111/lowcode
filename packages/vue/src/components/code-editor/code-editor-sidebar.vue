
<script lang="ts" setup>
import { ref } from 'vue';
import type {Node} from '@antv/x6'
import { mGraph } from '../../core/graph';

    let props = defineProps<
        {
            mgraph:mGraph,
            activeNodeId:string
        }
    >()

    let emit = defineEmits<{
        (e:"clickItem",item:Node):void
    }>()
let listNodes = ref<Array<Node>>([])
const update = () => {
        let graph = props.mgraph.getGraph();
        let nodes = graph.getNodes();
        listNodes.value = nodes.filter((node) => {
            let data = node.getData();
            if (data.type) return true
            else return false;
        })
}

const getNodeName = (node:Node) => {
  let data = node.getData();
  return data.base.name || "未命名"
}

const onClickitem = (index:number) => {
    let item = listNodes.value[index] as Node;
    emit('clickItem',item)
}

defineExpose({
    update
})

</script>

<template>

 <div id="sidebar" class="wrap">

     <div 

     @click="onClickitem(index)"
     :class="props.activeNodeId === item.id ? 'active-item' : ''"
     v-for="(item,index) in listNodes" class="item w-full ellipsis">{{getNodeName(item as Node)}}</div>
   
  </div>
</template>

<style lang="less" scoped>
    .wrap{
            background-color: #333333;
            width: 200px;
            height: 100%;
            padding: 20px 0px;
            box-sizing: border-box;

            .active-item{
                 background-color:  #1e1e1e;
            }
            .item {
                color: white;
                padding-left: 10px;
                text-align: left;
                height: 25px;
                line-height: 25px;
                box-sizing: border-box;
                &:hover{
                 
                  background-color:  #1e1e1e;
                    cursor: pointer;
                }
            }
    }
</style>