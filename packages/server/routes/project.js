var express = require('express');
var router = express.Router();
let { projectCollect } = require('../common/db')
let { generateId } = require('../common/utils')


router.post('/getList', async function(req, res, next) {
    let { body } = req;
    let {name = ""} = body   
    let list = await projectCollect.find({name:{$regex:new RegExp(name)}}).toArray();
    return res.ok(list)

});

router.post('/saveProject',async function(req,res,next) {

    let param = req.body;
    let id = generateId();
    param.id = id;

    await projectCollect.insert(param)

    return res.ok(null)
})

router.post('/editProject',async function (req,res,next) {
    let body = req.body;

    let { id } = body;
     await projectCollect.updateOne({ id }, { $set: body })
    return res.ok(null)
})



module.exports = router;
