<template>
  <div>
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld @getList="getList" msg="Hello Vue 3 + Vite222" />
    <p v-for="item in list" :key="item.id">{{ item.name }}</p>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { ref } from "vue";
import { fetchList } from "./service.js";
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

    const getList = () => {
      var num = Math.floor(Math.random() * 100 + 1);
      const data = {
        page: 1,
        pageSize: 10,
        _loadingCallback: (l) => {
          console.log('loading:::', l)
        },
        _noCache: true,
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
