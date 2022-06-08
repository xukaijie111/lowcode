

<script lang="ts" setup>
    import { ref } from 'vue';
    import Cell from './Cell.vue'
    let menus = ref([
        {
            name:"普通元件",
            children:[
                {
                    name:"common",
                    shape:"rectangle"
                }
            ]
        }
    ])

</script>

<template>
<div class="wrap">
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo h-full"
      >
        <el-sub-menu index="1" v-for="(item,index) in menus" :key="index">
          <template #title>
            <span>{{item.name}}</span>
          </template>
          <el-menu-item v-for="(subItem,index) in item.children" :key="index"> 
            <Cell 
              :subItem="subItem"
            />
          </el-menu-item>
        </el-sub-menu>
        
      </el-menu>
      </div>
</template>

<style lang="less" scoped>

.wrap{
    height: 100%;
    width: 200px;
}

</style>