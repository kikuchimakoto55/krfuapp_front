<script setup>
import { ref } from 'vue';
const membersList = ref([
    { id: 0, name: "配列値０"},
    { id: 1, name: "配列値１"},
    { id: 2, name: "配列値２"},
    ]);
    function deleteItem(id) {
        membersList.value.splice(id, 1);
    }
</script>
<template>
    <ul>
        <li v-for="member in membersList" :key="member.id">
            {{ member.name }}<br />
            備考
            <input type="text" />
            <br />
            <button @click="deleteItem(member.id)">削除</button>
        </li>
    </ul>
</template>

