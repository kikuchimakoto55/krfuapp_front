import axios from 'axios';

// ログアウト処理
export const logout = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    // ローカルストレージをクリア
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
  } catch (error) {
    console.error('ログアウトエラー:', error.response);
  }
};
