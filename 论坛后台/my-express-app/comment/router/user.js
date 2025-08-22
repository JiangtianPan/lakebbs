const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { respondSuccess, respondError } = require('../utils/responses');

// 用户注册
router.post('/register', async (req, res) => {
    try {
        const fakeUser = {
            account: '测试222',
            password: 'admin',
            name: '测试222',
            avatar: 'http://example.com/avatar.jpg'
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
        // const { account, password } = req.body;
        // const user = await User.findOne({ where: { account } });
        // if (!user || user.password !== password) {
        //     return respondError(res, 401, '账号或密码错误');
        // }
        respondSuccess(res, 200, '登录成功', user);
    } catch (error) {
        respondError(res, 500, '登录失败', error);
    }
});

// 获取用户信息
router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
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
router.put('/:id', async (req, res) => {
    try {
        const { name, avatar } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return respondError(res, 404, '用户不存在');
        }
        await user.update({ name, avatar });
        respondSuccess(res, 200, '用户信息更新成功', user);
    } catch (error) {
        respondError(res, 500, '更新用户信息失败', error);
    }
});

module.exports = router;
