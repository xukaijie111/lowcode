var express = require('express');
var router = express.Router();
let { userCollect } = require('../common/db')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',async function(req,res,next) {
      let body = req.body;
      let {
        username,
        password
      } = body;
      let find = await userCollect.find({name:username,password}).toArray();
      console.log('find',find)

      if (!find || !find.length) {
        return res.json({ success:false, errorMsg:"账号或密码错误" })
      }
      return res.json({success:true,data: find[0]})

})
module.exports = router;
