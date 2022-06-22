

<script lang="ts" setup>
import sideBarVue from '../components/side-bar.vue';
import headerVue from '../components/header.vue';
</script>

<template>

    <div class="home-wrap w-full h-full">

        <headerVue />
        <div class="content-wrap">
            <side-bar-vue />
            <div class="content h-full">
                <router-view></router-view>
            </div>

        </div>
    </div>

</template>

<style lang="less" scoped>
.home-wrap {
    display: flex;
    flex-direction: column;

    .content-wrap {
        display: flex;
        flex: 1;
        height: 0px;
        .content {
            flex: 1;
            width: 0px;
        }
    }
}
</style>