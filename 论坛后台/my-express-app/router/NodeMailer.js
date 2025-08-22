const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { respondSuccess, respondError } = require('../utils/responses');

// 创建一个Nodemailer传输器
const transporter = nodemailer.createTransport({
  service: 'QQ', // 使用QQ邮箱服务
  auth: {
    user: 'yukin_pan@qq.com', // QQ邮箱账号
    pass: 'qbtfuxnjbsytbigd', // QQ邮箱授权码
  },
});

// 发送邮件函数
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: 'yukin_pan@qq.com', // 发件人邮箱
      to: to, // 收件人邮箱
      subject: subject, // 邮件主题
      text: text, // 邮件内容
    });
  } catch (error) {
    console.error('邮件发送失败:', error);
  }
};

// 生成随机验证码
const generateCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString();
};

// 使用示例
const to = 'recipient_email@example.com'; // 收件人邮箱00
const subject = '验证码'; // 邮件主题
const code = generateCode(); // 生成验证码
const text = `验证码:${code}您正在使用登录功能,
验证码提供他人可能导致账号被盗，请勿转发或泄露
`; // 邮件内容

// 那边传过来qq邮箱,然后这边发送验证码,注册的时候再验证验证码就行了
router.post('/', (req, res) => {
  const to = req.body.email; // 获取收件人邮箱
  const succed =  sendEmail(to, subject, text)
  return respondSuccess(res,200,"邮件发送成功",code);
})

// sendEmail(to, subject, text);
module.exports = router;