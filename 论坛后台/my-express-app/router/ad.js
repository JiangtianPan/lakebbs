const express = require('express');
const router = express.Router();
const Ad = require('../models/ad');
const { respondSuccess, respondError } = require('../utils/responses');

// 创建广告
router.post('/create', async (req, res) => {
    try {
        const { title, imageUrl, description } = req.body;
        console.log(description, title);
        if (!title || !imageUrl) {
            return respondError(res, 500, '没有图片',);
        }
        const newAd = await Ad.create({ title, imageUrl, description });
        console.log(newAd);
        respondSuccess(res, 201, '广告创建成功', newAd);
    } catch (error) {
        console.log(error);
        respondError(res, 500, '创建广告失败', error);
    }
});

// 获取所有广告
router.get('/all', async (req, res) => {
    try {
        const ads = await Ad.findAll();
        respondSuccess(res, 200, '获取广告成功', ads);
    } catch (error) {
        respondError(res, 500, '获取广告失败', error);
    }
});
// 删除广告
router.delete('/:adId', async (req, res) => {
    console.log(req.params.adId);
    try {
        const ad = await Ad.findByPk(req.params.adId);
        if (!ad) {
            return respondError(res, 404, '广告不存在');
        }
        await ad.destroy();
        respondSuccess(res, 200, '广告删除成功');
    } catch (error) {
        respondError(res, 500, '删除广告失败', error);
    }
});

module.exports = router;
