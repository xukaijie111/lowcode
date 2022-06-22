<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="$route.path"
   unique-opened router>
            <template v-for="item in items">
                <template v-if="item.children">
                    <el-submenu :index="item.index" >
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-menu-item :index="subItem.index">
                              <div style="paddingLeft:20px">{{ subItem.title }}</div>
                            </el-menu-item>
                          
                        </template>
                    </el-submenu>
                </template>
               
            </template>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>

import { ref } from 'vue'

let items = ref(
[
             {
                icon: "el-icon-lx-calendar",
                index: "2",
                title: "流程管理",
                children: [
                    {
                        index: "/process",
                        title: "流程管理",
                    },
                ],
            },
            ]
)

</script>

<style  lang="less" scoped>
.sidebar {
    display: block;
    bottom: 0;
    overflow-y: scroll;
    box-shadow:1px 0px 0px #DEDEDE;
     z-index:1
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
</style>