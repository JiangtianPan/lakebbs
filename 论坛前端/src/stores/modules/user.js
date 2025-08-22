import { defineStore } from "pinia";
import piniaPersistConfig from "@/stores/helper/persist";

export const useUserStore = defineStore({
    id: "geeker-user",
    state: () => ({
        // token值
        token: "",
        // 用户ID，前缀为user-，后面加6位随机数字
        userId:'',
        // 用户账号---邮箱
        account: '',
        // 用户密码 
        password: '',
        // 用户名称---昵称
        name: '',
        // 用户头像（base64格式）默认头像
        avatar:`data:image/png;base64,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`
    }),
    getters: {},
    actions: {
        setPieAvatar(user) {
            this.avatar = user;
        },
        setBarAccount(user) {
            this.account = user;
        },
        // Set Token
        setToken(token) {
            this.token = token;
        },
        setUserUserId(user) {
            this.userId = user;
        },
        setUserName(user) {
            this.name = user;
        },
        setPassword(user) {
            this.password = user;
        },
        clearUserInfo() {
            this.token = "";
            this.userId = "";
            this.name = "";
            this.password = "";
            this.avatar = "";
            this.account = "";
        },
        updataUserfont(user) {
            this.name = user.name;
            this.avatar = user.avatar;
            this.account = user.account;
            this.password = user.password;
        }
    },
    persist: piniaPersistConfig("geeker-user")
});
