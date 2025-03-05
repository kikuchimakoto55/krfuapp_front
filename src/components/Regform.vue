<script setup>
import { ref } from "vue";
const name =ref("");
</script>
<template>
    <div>
        <label for="name">名前：</label>
        <input type="text" id="name" v-model="name">
        <p>入力された名前：{{ name }}</p>
    </div>
</template>