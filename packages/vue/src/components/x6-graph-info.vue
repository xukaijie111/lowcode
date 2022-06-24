

<script lang="ts" setup>

    import { ref, watch } from 'vue';
    import { ElMessage } from 'element-plus'
    import _ from 'lodash'
    
    let rules = ref({
        name:[
            { required :true,message:"请输入名称"}
        ],
        description:[
            { required :true,message:"请输入描述"}
        ]
    })

    const emit = defineEmits<{
        (e:"confirm",data:PropsData):void
    }>()

    type PropsData = {
        name:string,
        description:string
    }

    const props = defineProps<
        {
            data:PropsData
        }
    >()

    const data = ref(_.cloneDeep(props.data));
    const sRef = ref();

    const checkValid = async () => {
        try{
             await  sRef.value.validate();
             return true
        }catch(err) {
            ElMessage.warning(`内容错误`)
            return false
        }
      
    }


    const onCreateClick = async () => {
        if (!await checkValid()) return false;
        emit('confirm',data.value);
    }

    watch(
        () => props.data,
        (newValue) => {
            data.value = _.cloneDeep(newValue);
        }
    )

</script>

<template>

    <div class="wrap">
          <el-form :inline="true"
            ref="sRef"
 
             :model="data" class="demo-form-inline align-left" :rules = "rules">
                <el-form-item label="名称"  prop = "name">
                    <el-input v-model.trim="data.name" placeholder="请输入流程名称" />
                </el-form-item>

                  <el-form-item label="描述"  prop = "description">
                    <el-input v-model="data.description" placeholder="请输入描述" />
                </el-form-item>
       
                <el-form-item>

                      <el-button type="primary" @click="onCreateClick">确认</el-button>
                </el-form-item>
            </el-form>

    </div>

</template>

<style lang="less" scoped>

.wrap {
    display: flex;
    align-items: center;

}

</style>