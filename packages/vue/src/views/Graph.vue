<script setup lang="ts">
    import {
        ref
    } from 'vue';
    import _ from 'lodash'
    import {
        getCellList
    } from '../common/api'


    let menus = ref([])
    const _getCellList = async () => {
        try {
            //@ts-ignore
            let list:Array<any> = await getCellList();
            let _menus :Array <never> =[]
            list.reduce((prev, now) => {
                let {
                    category
                } = now;
                let item = _.find(prev, {
                    category
                });
                if (item) {
                    item.children.push(now);
                } else {
                    prev.push({
                        category,
                        children: [now],
                    });
                }
                return prev;
            }, _menus);
            menus.value = _menus;

        } catch (err) {
            console.log(err)
        }

    }

    _getCellList();
</script>


<template>
    <div class="graph-wrap">
        <el-row>
            <el-col :span="24">
                <div class="flex-x-center size-26 header pl-20">
                    在这里管理流程,管理类
                </div>
            </el-col>
        </el-row>

        <div class="content-wrap">
            <div class="left">
                <el-menu default-active="1" class="el-menu-vertical-demo">
                    <el-sub-menu v-for="item in menus" :index="item.id" :key="item.id">
                        <template #title>
                            <span>{{ item.category }}</span>
                        </template>
                        <el-menu-item-group v-for="subItem in item.children" :index="subItem.id" :key="subItem.id">
                            <Cell :subItem="subItem" />
                        </el-menu-item-group>
                    </el-sub-menu>
                </el-menu>
            </div>

            <div class="wrap">
                <div class="deploy">
                    <el-button type="primary" @click.stop="onSaveGraphClick">保存</el-button>
                    <el-button type="primary" @click.stop="onDeployClick">部署</el-button>
                </div>
                <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
                    <el-tab-pane :key="item.id" v-for="(item) in graphs" :label="item.name" :name="item.id">
                    </el-tab-pane>
                </el-tabs>
                <div v-for="(item,index) in graphs" :key="index" v-show="item.id === editableTabsValue"
                    class="draw-wrap" :id="'draw-wrap-' + index" @dragover="allowDrop"
                    @drop="(event) => onDrop(index, event)"></div>
            </div>
        </div>
        <NodeOptions ref="nodeops" @submit="onSubmitNodeOptions" />

        <el-dialog title="流程名称" :visible.sync="editProcessVisible">
            <el-form :model="eidtProcessForm" :rules="processRule" ref="editProcess">
                <el-form-item label="名称" :label-width="100" prop="name">
                    <el-input v-model="eidtProcessForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="eidtProcessForm.description" placeholder="最多20个字符" maxlength="20"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="editProcessVisible = false">取 消</el-button>
                <el-button type="primary" @click="onConfirmEditGraph">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<style lang="less" scoped>
    .graph-wrap {
        width: 100%;
        height: 100%;

        .container {
            width: 500px;
            height: 500px
        }
    }
</style>