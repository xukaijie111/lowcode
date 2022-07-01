<script lang="ts" setup>

import { ref,watch } from 'vue';

import { Close } from '@element-plus/icons-vue'
import _ from 'lodash';

import type {
    ListItem
} from './type'


let props = defineProps<
  {
    lists:Array<ListItem>,
    activeId:string,
    map:Map<string,unknown>
  }
>()

let emits = defineEmits<
{
  (e:"close",id:string):void
  (e:'click',item:ListItem):void
  (e:"closeAll"):void
}
>()

let opendItems = ref<Array<ListItem>>([]);

const handleCurrentTab = (item: ListItem) => {
  if (props.activeId && item.id === props.activeId) return;
  emits('click',item)
}

const update = () => {

  for (let i = 0; i < opendItems.value.length;i++) {
    if (!_.find(props.lists,{ id: opendItems.value[i].id})) {
      opendItems.value.splice(i,1);
      i--;
    }

  }
}

const addItem = (id: string) => {
  if (!_.find(opendItems.value, { id })) {
    let item = _.find(props.lists, { id}) as ListItem;
    opendItems.value.push(item);
  }
}

const deleteItem = (id:string) => {
 
  let index = _.findIndex(opendItems.value, { id })

  if (index !== -1) {
    opendItems.value.splice(index,1)
  }
}

const getNextItem = () => {
    let currentId = props.activeId;
    if (!currentId) return;
    let index = _.findIndex(opendItems.value, { id:currentId})
    if (index === -1) {
      console.error(`error why?`)
      return 
    }
    if (index === 0) {
        if (opendItems.value.length === 1) return null;
        return opendItems.value[index + 1];
    }else {
      return opendItems.value[index - 1];
    }


}


watch(() => props.lists,
    () => update(),
    {
      deep:true
    }
)

const onCloseItemClick = (item:ListItem) => {
  emits('close',item.id)
}

const onCloseClick = () => {
  emits('closeAll');
}



defineExpose({
  addItem,
  deleteItem,
  update,
  getNextItem
})

const getItemClass = (item:ListItem) => {
  let param:Record<any,any> = {}
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
  <div  class="noselect editorTabBar">
    <div class="tab-list " ref="tabList">
      <div v-for="(item, index) in opendItems" :key="index" class="editor-tab  flex-center"
        v-bind:class="getItemClass(item)"
       @click="handleCurrentTab(item)">
        {{ item.name }}

        <el-icon class="close-icon" color="white" size="10" @click.stop="onCloseItemClick(item)"><Close /></el-icon>
      </div>
    </div>

    <div class="close-wrap flex-center" @click.stop="onCloseClick">
        <el-icon class="close-icon" color="black" size="12" >
                    <Close />
        </el-icon>
    </div>

                
  </div>
</template>



<style lang="less" scoped>
/* main style */
.editorTabBar {
  width: 100%;
  height: 30px;
  background-color: #333333;
  display: flex;
  display: flex;

  .close-wrap{
    width: 50px;
    &:hover{
      cursor: pointer;
    }
    .close-icon{
      background-color: rgb(215,87,75);
      padding: 2px;
      border-radius: 50%;
    }

  }

  .tab-list {
    flex: 1;
    width: 0px;
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
    color: #ffffff;
    font-size: 16px;
    }
  }

}
</style>
