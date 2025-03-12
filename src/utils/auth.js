import axios from 'axios';

// ユーザー情報を取得する関数
export const fetchUser = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    localStorage.setItem('authoritykinds_id', response.data.authoritykinds_id); // 🔹 権限を保存
    return response.data;
  } catch (error) {
    console.error('ユーザー情報の取得に失敗しました:', error);
    return null;
  }
};

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
    localStorage.removeItem('authoritykinds_id'); // 🔹 権限情報も削除
    axios.defaults.headers.common['Authorization'] = '';

  } catch (error) {
    console.error('ログアウトエラー:', error.response);
  }
};
