<template>
     <main>
        <router-view></router-view> <!-- 🔹 ここに移動 -->
    </main>
</template>
<script setup>
</script>
<!--
・App.vue..Vueアプリケーションのルートコンポーネント。他のコンポーネントを含み、アプリケーション全体のレイアウトなどを決める
・Vueファイルは script(javascript),templater(HTML),style(CSS)に分ける
-->
<style scoped>
    * {
        margin: 0;
        padding: 0;
    }

    body {
        font-family: fot-tsukuardgothic-std, sans-serif;
        line-height: 1.5;
        font-size: 14px;
    }

    .container {
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }

    @media (min-width: 768px) {
        .container {
            width: 700px;
            padding: 0;
            margin: 0 auto;
        }
    }

    @media (min-width: 1024px) {
        .container {
            width: 980px;
        }
    }

    header {
        height: auto;
        display: grid;
        grid-template-rows: 1fr;
        margin-bottom: 80px;
    }

    header > * {
        grid-row: 1;
        grid-column: 2;
    }

    h1 {
        justify-self: start;
        align-self: center;
        font-size: 20px;
        font-weight: normal;
    }

    h1 > a {
        color: #fff;
        text-decoration: none;
    }

    #form {
        justify-self: end;
        align-self: center;
        display: none;
    }

    nav {
  margin-bottom: 20px;
}
nav a {
  margin-right: 10px;
  text-decoration: none;
  color: blue;
}

    @media (min-width: 768px) {
        header {
            grid-template-columns: 1fr 700px 1fr;
        }

        #form {
            display: block;
        }
    }

    @media (min-width: 1024px) {
        header {
            grid-template-columns: 1fr 80% 1fr;
        }
    }


</style>
