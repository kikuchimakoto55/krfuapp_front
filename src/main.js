import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router'; // ルーターをインポート
import CoreuiVue from '@coreui/vue';
import '@coreui/coreui/dist/css/coreui.min.css'; // CoreUI のスタイル
import '@coreui/icons/css/all.min.css';          // CoreUI のアイコン
import axios from 'axios';

// 🛠️ Axios のデフォルト設定
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true; // Cookie を送信可能にする

const app = createApp(App);

app.use(router);  // Vue アプリに Router を適用
app.use(CoreuiVue);  // CoreUI を適用
app.mount('#app'); // Vue インスタンスをマウント