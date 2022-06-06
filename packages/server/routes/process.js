var express = require('express');
let _ = require('lodash')
const {
    CODING_MODE_SELF
} = require('../common/const');
var router = express.Router();
let {
    processCollect
} = require('../common/db')
let {
    generateId,
    tryTransformCode
} = require('../common/utils')

let { generateCodeByDsl } = require('../codegen/generate')


router.post('/getList', async function (req, res, next) {
    let {
        body
    } = req;
    let {
        name = "",
        pageNum,
        pageSize
    } = body

    pageNum = parseInt(pageNum)
    pageSize = parseInt(pageSize)

    let total = await processCollect.countDocuments();

    let list = await processCollect.find({
        name: {
            $regex: new RegExp(name)
        }
    }).skip(pageSize*(pageNum - 1)).limit(pageNum*pageSize).toArray();
    return res.ok({
        list,
        total,

    })

});


router.post('/delete', async function (req, res, next) {
    let {
        body
    } = req;
    let {
        ids = []
    } = body


    await processCollect.deleteMany({id: {$in: ids}})
    return res.ok(null)

});


router.post('/checkNode', async function (req, res, next) {
    let {
        body
    } = req;

    let {
        codeOptions
    } = body;

    let {
        mode,
        source
    } = codeOptions;

    if (mode === CODING_MODE_SELF) {
        let ret = tryTransformCode(source)
        if (!ret.success) {
            return res.fail('代码错误,可去 https://astexplorer.net/ 进行检查')
        }
    }

    return res.ok(null)

})

async function updateDsl(data) {
    let {
        id
    } = data;

    let setOnInsert = {
         ctime: Date.now(),beUsedNum:0, importOtherProcessNum:0
    }

    let set = _.omit(data,Object.keys(setOnInsert))

    await processCollect.updateOne({
        id
    }, {
        $setOnInsert: setOnInsert,
        $set: {...set ,mtime:  Date.now()}
    }, {
        upsert: true
    })
    return;
}

router.post('/saveDsl', async function (req, res, next) {

    let {
        body
    } = req;

    await updateDsl(body)

    return res.ok(null)
})


router.post('/deploy', async function (req, res, next) {

    let {
        body
    } = req;

    await updateDsl(body)
    let ret = await generateCodeByDsl(body)
    if (ret.success) {
        return res.ok(null)
    }else {
        return res.fail(ret.message)
    }
  
})


router.post('/detail', async function (req, res, next) {

    let {
        body
    } = req;

    let { id } = body;

    let detail = await processCollect.findOne({id})

    return res.ok(_.omit(detail,['_id']))
})


module.exports = router;