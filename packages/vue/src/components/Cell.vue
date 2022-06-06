<script setup lang="ts">
    import * as d3 from 'd3'

    const props = defineProps({
        subItem: {
            type: Object,
            default: {},
        }
    })

    const getClass = () => {
            let {
                shape
            } = props.subItem;
            let param = {}
            param[shape] = true
            return param
    }

     const ondragstart = (event) => {
        // 鼠标点击节点的相对位置
        let { layerX,layerY } = event;
        let id = this.subItem.id;
        let data = `${id}-${layerX}-${layerY}`
        event.dataTransfer.setData("data", data) ;
     // event.preventDefault();
    }
</script>

<template>
    <div>
        <div v-if="!subItem.image" :class="getClass()" class="menu-node" ref="node">

            <div draggable="true" @dragstart="ondragstart" class="rect-wrap flex-center">{{ subItem.name }}</div>


        </div>

        <img draggable="true" @dragstart="ondragstart" v-else :src="subItem.image" class="ml-30" />

    </div>
</template>

<script>
    import * as d3 from 'd3'
    export default {
        name: "Cell",

        props: {
            subItem: {
                type: Object,
                default: {},
            },
        },

        methods: {
            getClass() {
                let {
                    shape
                } = this.subItem;
                let param = {}
                param[shape] = true
                return param
            },

            ondragstart(event) {
                // 鼠标点击节点的相对位置
                let {
                    layerX,
                    layerY
                } = event;
                let id = this.subItem.id;
                let data = `${id}-${layerX}-${layerY}`
                event.dataTransfer.setData("data", data);
                // event.preventDefault();
            },
        },
    };
</script>

<style lang="less" scoped>
    .menu-node {
        width: 80px;
        height: 30px;
        border-radius: 4px;
        display: flex;
        font-size: 13px;
        position: relative;
        margin-left: 30px;
        cursor: move;
        border: 2px solid #666;
        background: #fff;

        &.circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        &.diamond {
            width: 50px;
            height: 50px;

            transform: rotate(45deg);

            .rect-wrap {
                transform: rotate(-45deg);
            }
        }


    }

    .menu-node:hover {
        border: 2px solid orange;
    }

    .icon-wrap {
        width: 30px;
        height: 100%;
        background: rgba(0, 0, 0, 0.05);
        border-right: 1px solid rgba(0, 0, 0, 0.05);
    }

    .input-wrap {
        position: absolute;
        top: 50%;
        left: 0px;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        background: #d9d9d9;
        border-radius: 3px;
        width: 10px;
        height: 10px;
        border: 1px solid #999;
    }

    .output-wrap {
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translate(50%, -50%);
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        background: #d9d9d9;
        border-radius: 3px;
        width: 10px;
        height: 10px;
        border: 1px solid #999;
    }

    .rect-wrap {
        width: 0px;
        flex: 1;
        height: 100%;
        color: #333;
    }

    .port-icon {
        display: inline-block;
        width: 20px;
        height: 100%;
    }
</style>