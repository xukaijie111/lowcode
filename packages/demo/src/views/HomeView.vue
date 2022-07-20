<script setup lang="ts">

import { ref } from 'vue';
import { dslCall } from '@lowcode/core'

let page = ref({
  pageNum: 1,
  pageSize: 9
})

let list = ref<Record<any, any>>([])

let cart = ref<Record<any, any>>()

const cartNum = ref(0)

const getProductsList = async function() {
  let res = await dslCall('getProducts', page.value);
   list.value = res.list;
}


const getCarts = async function() {
  let cart = await dslCall(`cartManage`, {op:'list'})
  cart.value = cart;
}


const addCart = async function(item:Record<any,any>) {
   let _cart = await dslCall(`cartManage`, {op:'add',item:{...item,number:1}})

  cart.value = _cart;

     console.log(`###cart is`,cart)

}


getProductsList();
getCarts();

const getCartNumber = () => {
  let list = cart.value?.list || [];
  let number = 0;
  //@ts-ignore
  number = list.reduce((prev,now) => {

    return prev + now.number
  },0)

  return number;

}

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
        <p class="description">{{ item.description }}</p>
        <p class="price-wrap"><small>￥</small><b>{{item.price/1000}}</b></p>
        <button tabindex="-1" class="addCart" @click.stop = "addCart(item)">Add to cart</button>
      </div>
    </div>

      <button class="cart-btn">
        <div class="cart-icon">
          <div title="Products in cart quantity" class="cart">{{getCartNumber()}}</div>
        </div>
      </button>

  </div>
</template>

<style lang="less" scoped>
.home-wrap {
  height: 100%;
  width: 1200px;
  margin: 0 auto;
  margin-top: 30px;
  overflow: auto;




    .cart-btn {
       position: fixed;
    top: 20px;
    right: 50px;
      border: 0;
      padding: 0;
      width: 50px;
      height: 50px;
      color: #ececec;
      background-color: #1b1a20;
      text-align: center;
      line-height: 50px;
      position: absolute;
      cursor: pointer;
      z-index: 2;

      .cart-icon {
        width: 50px;
        height: 50px;
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin-right: 15px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfiCwwQEgYn7+gWAAABQklEQVRIx9WTsUoDQRRF72xMYSFokcRCjBFESGWRwtZe8AtEFFNrI1bB0tLGQuzs/AJB8AO2kZRCxBiRQNKIoIYoyLFwCZuss9nNgpBXzc7be3j3zow09mU48321zVF8gNtbZ5Q1UwmGYQPIxFU5vnVdUuHfARO+OD5oa9GzM6NcbICkem+CLZ0kA1zKHQ2w6tlpqRUN4AwA5knFiTAISGsuHqDfwoOkgp4kUkoP1WI+Azt02ZYk9hle3cAEBh69c7iKEOJ30IJU/71KpqbaKCH6b0LEGgTcaYXpeIj+GJf54pyI70CSTACxq1M5ehmqvDCHfwIkFrQW4S1WzXUCq+E5lNhkMqSfo0ze3t7hlWeqIfJ3GnQo2n644ZhZYMnSL9OQcKnYAHs0ueUeY+nn6eDyRskGcFjngGxIBkUqVvk41g+oBJ136GBf8AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMS0xMlQxNjoxODowNiswMTowMEVm3zEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTEtMTJUMTY6MTg6MDYrMDE6MDA0O2eNAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==);
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        background-size: 50%;

        .cart {
          display: inline-block;
          width: 18px;
          height: 18px;
          color: #0c0b10;
          font-weight: bold;
          font-size: 0.7em;
          text-align: center;
          line-height: 18px;
          border-radius: 50%;
          background-color: #eabf00;
          position: absolute;
          bottom: 0;
          right: 5px;
        }
      }
    }
 

  .list-wrap {
    width: 900px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    padding-bottom: 200px;
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

      .description {
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

      .price-wrap {
        font-size: 15px;

        small {
          font-size: 80%;
        }

        b {
          font-size: 150%;
        }
      }

      .addCart {
        background-color: #1b1a20;
        color: #fff;
        padding: 15px 0;
        margin-top: 10px;
        cursor: pointer;
        width: 100%;
        border: 0;
        transition: background-color 0.2s;
        font-size: 16px;

        &:hover {
          background-color: #eabf00;
        }
      }
    }
  }
}
</style>
