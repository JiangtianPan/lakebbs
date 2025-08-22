import  request  from "../requerst.js";

// 获取广告列表
export const getAdList = () => {
    return request.get("/ad/all")
}