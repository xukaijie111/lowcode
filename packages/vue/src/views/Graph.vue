

<script lang="ts" setup>

    import { process  } from '../core/process'
    import graphSideBar from '../components/graphSideBar.vue'

    process.getList({
        pageSize:10,
        pageNum:1,
        name:""
    })
</script>

<template>
<div class="graph-wrap">

    <div class="content">
        <div class="left">
            <graphSideBar />
        </div>

        <div class="right">
            

        </div>

    </div>
</div>
    
</template>


<style lang="less" scoped>

.graph-wrap {
    width:100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .content{
        flex: 1;
        height: 0px;
        display: flex;

        .right{
            flex: 1;
            width: 0px;
            display: flex;
            flex-direction: column;

        }

    }
}

</style>
