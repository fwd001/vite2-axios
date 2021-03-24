<template>
  <div>
    <h1>{{ msg }}</h1>
    <button @click="onAdd">add</button>
    <button @click="onrefresh">refresh</button>
  </div>
</template>

<script setup>
import { defineProps, reactive, defineEmit, useContext } from "vue";
import { fetchAdd } from "../service";

const props = defineProps({
  msg: String,
  emit: Function,
});

const emit = defineEmit(["getList"]);

const state = reactive({ count: 0 });

const onAdd = async () => {
  console.log("add");
  const id = Math.random();
  const data = {
    id: id,
    name: `asd-${id}`,
    age: "23",
    chinese: 12,
    english: "a",
    mathematics: 12,
  };
  const res = fetchAdd(data);
  console.log(res);
};
const onrefresh = () => {
  emit("getList");
};
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
