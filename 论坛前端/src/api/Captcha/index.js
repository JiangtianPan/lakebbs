import  request  from "../requerst.js";

// 点击发送验证码
  export const getCaptcha = (email) => {
    return request.post(`/sendEmail`,{ email });
  }; 
