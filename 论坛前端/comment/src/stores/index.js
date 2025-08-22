// src/stores/itemsStore.js
import { defineStore } from 'pinia';

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: [
        {
            avatarSrc: '',
            userName: '岸田文雄',
            tweetText: '这是一条消息',
            tweetTime: '2:32 AM · Sep 19, 2024',
            repliesCount: '9.7K',
            retweetsCount: '14K',
            likesCount: '91K',
            isFollowing: true
          },
          {
            avatarSrc: '',
            userName: '岸田文雄',
            tweetText: '这是一条消息',
            tweetTime: '2:32 AM · Sep 19, 2024',
            repliesCount: '9.7K',
            retweetsCount: '14K',
            likesCount: '91K',
            isFollowing: false
          },
          {
            avatarSrc: '',
            userName: '岸田文雄',
            tweetText: '这是一条消息',
            tweetTime: '2:32 AM · Sep 19, 2024',
            repliesCount: '9.7K',
            retweetsCount: '14K',
            likesCount: '91K',
            isFollowing: true
          },
          {
            avatarSrc: '',
            userName: '岸田文雄',
            tweetText: '这是一条消息',
            tweetTime: '2:32 AM · Sep 19, 2024',
            repliesCount: '9.7K',
            retweetsCount: '14K',
            likesCount: '91K',
            isFollowing: false
          },
    ] // 本地数组初始化
  }),
  actions: {
    addItem(item) {
      this.items.push(item); // 添加新项目
    },
    clearItems() {
      this.items = []; // 清空数组
    },
    async fetchItems() {
      // 这里可以仿真 API 调用
      const data = ['项目1', '项目2', '项目3']; // 示例数据
      this.items = data; // 假设 API 返回的数据是数组
    }
  },
  getters: {
    getItems(state) {
      return state.items; // 获取 items 数组
    }
  }
});