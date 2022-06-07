var express = require('express');
var router = express.Router();
let {
    cellCollect
} = require('../common/db')

/* GET users listing. */
router.post('/cellList', async function (req, res, next) {
    try {
        let cellList = await cellCollect.find({}).toArray();

        return res.ok(cellList)

    } catch (err) {
        console.log(err)
        return res.fail(err)
    }
});
module.exports = router