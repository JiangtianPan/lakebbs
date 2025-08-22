import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
    id: "geeker-user",
    state: () => ({
        // token值
        token: "asdssafadsa",
        // 用户ID，前缀为user-，后面加6位随机数字
        userId:'user-9bf2a28d',
        // 用户账号---邮箱
        account: 'admin',
        // 用户密码 
        password: 'admin',
        // 用户名称---昵称
        name: '管理员',
        // 用户头像（base64格式）
        avatar:'',
    }),
    getters: {},
    actions: {
        setActiveList(user) {
            this.activeList = user;
        },
        setPieData(user) {
            this.pieData = user;
        },
        setBarData(user) {
            this.barData = user;
        },
        // Set Token
        setToken(token) {
            this.token = token;
        },
        setUserdepartment(user) {
            this.userdepartment = user;
        },
        setUsername(user) {
            this.username = user;
        },
        setPassword(user) {
            this.password = user;
        },
        // Set setUserInfo
        setUserInfo(userInfo) {
            console.log(userInfo);

            this.userInfo.name = userInfo;
        }
    },
    persist: piniaPersistConfig("geeker-user")
});
