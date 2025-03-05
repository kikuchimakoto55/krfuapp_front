<script setup>
defineProps({
    text: String,
});
const dateTest ="TestConponent記述です。"
function myMethod() {
    console.log("メソッド実行");
}
</script>

<template>
    <button v-on:click="myMethod">メソッド実行</button>
    <p>{{ text }}</p>
    <p>{{ dateTest }}</p>
</template>