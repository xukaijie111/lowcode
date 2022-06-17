
const onlyZimuReg = /^[A-Za-z]+$/



export const nodeRule = {
    name:[
        { required: true, message: '请输入节点名称', trigger: 'blur' },
        { pattern:onlyZimuReg, message: '只支持英文字符', trigger: 'blur' },
    ],
    description:[
        { required: true, message: '请输入描述', trigger: 'blur' },
    ]
}