<template>
  <div class="login-container">
    <CCard class="login-card">
      <CCardHeader class="logo-header">
        <img src="../assets/logo.png" alt="Client Logo" class="logo" />
      </CCardHeader>
      <CCardBody>
        <CForm @submit.prevent="handleLogin">
          <div class="mb-3">
            <CFormLabel for="email">メールアドレスをご入力ください</CFormLabel>
            <CFormInput v-model="email" type="email" id="email" required />
          </div>
          <div class="mb-3">
            <CFormLabel for="password">パスワード</CFormLabel>
            <CFormInput v-model="password" type="password" id="password" required />
          </div>
          <br/>
          <CButton type="submit" color="primary" class="custom-login-btn" block>ログイン</CButton>
        </CForm>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/utils/axios';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
    try {
        // CSRFトークンを取得
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });

        // ログインリクエストを送信
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
            email: email.value,
            password: password.value,
        }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });

        // ✅ トークンを保存
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // ✅ ユーザーID・権限を保存
        localStorage.setItem('user_id', response.data.user.member_id);
        localStorage.setItem('authoritykinds_id', response.data.user.authoritykinds_id);
        localStorage.setItem('authoritykindsname', response.data.user.authoritykindsname);

        // ✅ デバッグ用ログ (問題が発生した場合、ブラウザの Console に出力されます)
        console.log('authoritykinds_id:', response.data.user.authoritykinds_id);
        console.log('authoritykindsname:', response.data.user.authoritykindsname);

        // ダッシュボードへリダイレクト
        router.push('/');
    } catch (error) {
        alert('ログインに失敗しました。');
        console.error(error.response);
    }
};
</script>

<style scoped>
.login-container {
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
}

.login-card {
width: 400px;
}

/* カードヘッダーのスタイルを上書き */
.logo-header {
background-color: transparent !important;
border: none !important;
padding: 0 !important;
}

.logo {
max-width: 100%;
height: auto;
}

/* カスタムログインボタン */
.custom-login-btn {
background-color: #004ea2 !important;
border-color: #004ea2 !important;
border-radius: 0 !important;
width: 100%;
}
</style>