const express = require('express');
const router = express.Router();
const Collection = require('../models/Collections');
const { respondSuccess, respondError } = require('../utils/responses');

//  点击收藏
router.post('/sc', async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const collec = await Collection.create({ userId, postId });
    respondSuccess(res, 200, "收藏成功");
  } catch (error) {
    respondError(res, error);
  }
})
// 点击取消收藏
router.delete('/', async (req, res) => {
  try {
    const { userId, postId } = req.query;
    
    if (!userId || !postId) {
      return respondError(res, 400, '缺少必要的参数');
    }
    const collec = await Collection.findOne({
      where:{ userId, postId }
    });
    
    if (!collec) {
      return respondError(res, 404, '收藏记录不存在');
    }
    await collec.destroy();
    respondSuccess(res, 200, '取消收藏成功');
  } catch (error) {
    respondError(res, 500, '取消收藏失败', error);
  }
})

// 获取特定用户的收藏列表
router.get('/:userId', async (req, res) => {
  try {
      const collection = await Collection.findAll({
          where: { userId: req.params.userId },
      }); 
      respondSuccess(res, 200, '获取收藏列表成功', collection);
  } catch (error) {
      respondError(res, 500, '获取收藏列表失败', error);
  }
});

// 根据传过来的postid
router.get('/count/:postId', async (req, res) => {
  try {
      const collection = await Collection.findAll({
          where: { postId: req.params.postId },
      }); 

      if(collection.length == 0) return respondSuccess(res, 200, '获取收藏列表成功', 0);
      respondSuccess(res, 200, '获取收藏列表成功', collection.length);
  } catch (error) {
      respondError(res, 500, '获取收藏列表失败', error);
  }
})

module.exports = router;