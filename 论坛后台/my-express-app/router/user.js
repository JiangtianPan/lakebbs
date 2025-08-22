const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { respondSuccess, respondError } = require('../utils/responses');
const Post = require('../models/post');

// 用户注册
router.post('/register', async (req, res) => {
    const { account, password, name, avatar } = req.body;
    try {
        const fakeUser = {
            account,
            password,
            name,
            avatar
        }
        // const newUser = await User.create(req.body);
        const newUser = await User.create(fakeUser);
        respondSuccess(res, 201, '用户注册成功', newUser);
    } catch (error) {
        respondError(res, 500, '用户注册失败', error);
    }
});

// 用户登录
router.post('/login', async (req, res) => {
    try {
        const { account, password } = req.body;
        const user = await User.findOne({ where: { account:account } });
        console.log(user);
        
        if (!user.dataValues.account || user.dataValues.password !== password) {
            return respondSuccess(res, 201,'账号或密码错误');
        }

        respondSuccess(res, 200, '登录成功',user);
    } catch (error) {
        respondError(res, 500, '登录失败', error);
    }
});

// 获取用户信息
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ where: { userId: req.params.id } });
        if (!user) {
            return respondError(res, 404, '用户不存在');
        }
        respondSuccess(res, 200, '获取用户信息成功', user);
    } catch (error) {
        respondError(res, 500, '获取用户信息失败', error);
    }
});

// 更新用户信息
router.put('/', async (req, res) => {
    try {
        const { account,avatar,name,password,userId } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return respondError(res, 404, '用户不存在');
        }
        await user.update({ account,avatar,name,password });
        respondSuccess(res, 200, '用户信息更新成功', user);
    } catch (error) {
        respondError(res, 500, '更新用户信息失败', error);
    }
});

// 根据popstid查userid
router.get('/post/:id', async (req, res) => {
    try {
        const user = await Post.findOne({ where: { postId: req.params.id } });
        if (!user) {
            return respondError(res, 404, '用户不存在');
        }
        respondSuccess(res, 200, '获取用户信息成功', user);
    } catch (error) {
        respondError(res, 500, '获取用户信息失败', error);
    }
})

module.exports = router;
