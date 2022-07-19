<script setup lang="ts">

import { ref } from 'vue';
import { dslCall } from '@lowcode/core'

let page = ref({
  pageNum: 1,
  pageSize: 9
})

let list = ref<Record<any,any>>([])

dslCall('getProducts', page.value)
  .then((res) => {
    list.value = res.list;
    console.log(`###list is`, list.value);
  })


const getItemSrc = (item: Record<any, any>) => {
  let { image } = item;

  return new URL(`../assets/images/${image}`, import.meta.url).href
}

</script>

<template>
  <div class="home-wrap">

    <div class="list-wrap">

      <div class="item" v-for="item in list">
        <img :src="getItemSrc(item)" class="header" /> 
        <p class="description">{{item.description}}</p>
        <p class="price-wrap"><small>￥</small><b>25</b><span>.90</span></p>
        <button tabindex="-1" class="addCart">Add to cart</button>
      </div>
    </div>

  </div>
</template>

<style lang="less" scoped>
.home-wrap {
  height: 100%;
  width: 1200px;
  margin: 0 auto;
  margin-top: 30px;
  overflow: auto;

  .list-wrap {
    width: 900px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;

    .item {

      margin-right: 20px;
      margin-bottom: 30px;

      .header {
        width: 220px;
        height: 320px;
        &:hover {
          opacity: 0.5;
        }
      }
      .description{
        padding: 0 20px;
        margin: 10px 0px;
        font-size: 18px;
        position: relative;
            height: 45px;
        &::before {
          content: '';
          width: 20px;
          height: 2px;
          background-color: #eabf00;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -10px;
        }
      }

      .price-wrap{
        font-size: 15px;
        small{
          font-size: 80%;
        }
        b{
          font-size: 150%;
        }
      }
      .addCart{
            background-color: #1b1a20;
            color: #fff;
            padding: 15px 0;
            margin-top: 10px;
            cursor: pointer;
            width: 100%;
            border: 0;
            transition: background-color 0.2s;
            font-size: 16px;
            &:hover{
              background-color: #eabf00;
            }
      }
    }
  }
}
</style>
