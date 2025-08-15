<template>
  <div class="p-3">

    <CAlert color="danger" v-if="errorMessage">{{ errorMessage }}</CAlert>
    <CAlert color="success" v-if="successMessage">{{ successMessage }}</CAlert>

    <CForm @submit.prevent="handleSubmit" class="mb-3">
      <div class="mb-3">
        <CFormLabel for="name">委員会種別名称 <span class="text-danger">*</span></CFormLabel>
        <CFormInput id="name" v-model="name" :disabled="submitting" placeholder="例）総務委員会" />
        <div class="form-text">100文字以内、HTMLタグ不可</div>
        <div class="text-danger mt-1" v-if="fieldErrors.committeekindsname">{{ fieldErrors.committeekindsname }}</div>
      </div>

      <div class="d-flex gap-2">
        <CButton type="submit" color="primary" :disabled="submitting">
          <template v-if="submitting"><CSpinner size="sm" class="me-1" />送信中</template>
          <template v-else>登録する</template>
        </CButton>
        <CButton color="secondary" variant="outline" @click="$router.push('/committee-kinds')" :disabled="submitting">
          一覧へ
        </CButton>
      </div>
    </CForm>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CommitteeKindCreate",
  data() {
    return {
      // Coach流儀の本体
      form: { committeekindsname: "" },
      errors: { committeekindsname: "" },
      successMessage: "",

      // ★ テンプレート後方互換のためのエイリアス
      name: "",            // v-model で参照されている想定
      submitting: false,   // :disabled で参照されている想定
      errorMessage: "",    // 画面上部の汎用エラー
      fieldErrors: {},     // フィールド別エラー表示
    };
  },
  watch: {
    // 双方向同期（テンプレの name と本体 form.* を一致させる）
    name(v) { this.form.committeekindsname = v; },
    'form.committeekindsname'(v) { this.name = v; },
  },
  created() {
    // 初期同期（空文字同士でも一度合わせておく）
    this.name = this.form.committeekindsname || "";
  },
  methods: {
    normalize(s) {
      if (typeof s !== "string") return s;
      return s
        .replace(/\u00A0|\u3000/g, " ")        // NBSP/全角→半角
        .replace(/\s+/g, " ")                  // 連続空白を1つへ
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // ゼロ幅除去
        .trim();
    },
    async handleSubmit() {
      // 画面内メッセージをリセット
      this.errors.committeekindsname = "";
      this.fieldErrors = {};
      this.successMessage = "";
      this.errorMessage = "";

      // フロント最小バリデ（Coach と同等）
      const vRaw = (this.name || "").toString();
      if (!vRaw.trim()) {
        const msg = "名称は必須です。";
        this.errors.committeekindsname = msg;
        this.fieldErrors = { committeekindsname: msg };
        return;
      }
      if (vRaw.length > 100) {
        const msg = "委員会種別名称は100文字以内で入力してください。";
        this.errors.committeekindsname = msg;
        this.fieldErrors = { committeekindsname: msg };
        return;
      }
      if (/<[^>]+>/.test(vRaw)) {
        const msg = "無効な入力です。";
        this.errors.committeekindsname = msg;
        this.fieldErrors = { committeekindsname: msg };
        return;
      }

      const payload = { committeekindsname: this.normalize(vRaw) };

      this.submitting = true;
      try {
        const token = localStorage.getItem("token"); // 送信直前取得（Coach と同じ）
        await axios.post(
          "http://localhost:8000/api/committee-kinds",
          payload,
          {
            withCredentials: true,
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        this.successMessage = "登録が完了しました。";
        // 成功時クリア（テンプレが name を使っているため name を空に）
        this.name = "";
        this.form.committeekindsname = "";
      } catch (err) {
        if (err.response?.status === 422) {
          const msg = err.response?.data?.errors?.committeekindsname?.[0]
            || "入力エラーが発生しました。";
          this.errors.committeekindsname = msg;
          this.fieldErrors = { committeekindsname: msg };
          this.errorMessage = "入力内容を確認してください。";
        } else if (err.response?.status === 401) {
          this.errors.committeekindsname = "";
          this.fieldErrors = {};
          this.successMessage = "";
          this.errorMessage = "";
          alert("認証が切れています。再ログインしてください。");
        } else {
          alert("登録に失敗しました。");
        }
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>