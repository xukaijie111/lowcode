
<script lang="ts" setup>

import type {
    ListItem
} from './type'

    let props = defineProps<
        {
            activeId:string,
            lists:Array<ListItem>
        }
    >()

    let emit = defineEmits<{
        (e:"clickItem",item:ListItem):void
    }>()


const onClickitem = (item:ListItem) => {

    emit('clickItem',item)
}


</script>

<template>

 <div id="sidebar" class="wrap">

     <div 

     @click="onClickitem(item)"
     :class="props.activeId && props.activeId === item.id ? 'active-item' : ''"
     v-for="(item) in lists" class="item w-full ellipsis">{{item.name}}</div>
   
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