<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <button @click="onClear">clear</button>
    <HelloWorld @getList="getList" msg="Hello Vue 3 + Vite222" />
    <p v-for="item in list" :key="item.id">{{ item.name }}</p>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { ref } from "vue";
import { fetchList } from "./service.js";

let clearCache = () => {};
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    HelloWorld,
  },
  setup() {
    console.log("setup");

    const list = ref([]);

    let onClear = () => {
      clearCache();
    };

    const getList = () => {
      var num = Math.floor(Math.random() * 100 + 1);
      const data = {
        page: 1,
        pageSize: 10,
        // loading 回调函数
        _loadingCallback: (l) => {
          console.log("loading:::", l);
        },
        // 是否使用缓存
        _cache: true,
        // TODO： 清除缓存方法 
        _clearCache: (clear) => {
          clearCache = clear;
        },
      };
      fetchList(data).then((res) => {
        console.log("APP:::", res);
        list.value = res && res.data && res.data.list;
      });
    };
    getList();

    return {
      list,
      getList,
      onClear,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
