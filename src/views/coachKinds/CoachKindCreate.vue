<template>
  <div class="p-4">
    <h4>指導員種別 登録</h4>
    <CForm @submit.prevent="handleSubmit">
      <CFormLabel for="name">指導員種別名称</CFormLabel>
      <CFormInput
        id="name"
        v-model="form.c_categorykindsname"
        type="text"
        placeholder="例: 主任指導員"
        :invalid="!!errors.c_categorykindsname" 
      />
      <div v-if="errors.c_categorykindsname" class="text-danger small">
        {{ errors.c_categorykindsname }}
      </div>

      <CButton type="submit" color="primary" class="mt-3">登録</CButton>
    </CForm>

    <CAlert
      v-if="successMessage"
      color="success"
      class="mt-3"
      dismissible
      @close="successMessage = ''"
    >
      {{ successMessage }}
    </CAlert>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CoachKindCreate",
  data() {
    return {
      form: { c_categorykindsname: "" },
      errors: { c_categorykindsname: "" },
      successMessage: "",
    };
  },
  methods: {
    normalize(s) {
      if (typeof s !== "string") return s;
      return s
        .replace(/\u00A0|\u3000/g, " ")       // NBSP/全角→半角
        .replace(/\s+/g, " ")                 // 連続空白を1つへ
        .replace(/[\u200B-\u200D\uFEFF]/g, "")// ゼロ幅除去
        .trim();
    },
    async handleSubmit() {
      this.errors.c_categorykindsname = "";
      this.successMessage = "";

      // ★ フロント最小バリデ（サーバと整合）
      const v = (this.form.c_categorykindsname || "").toString();
      if (!v.trim()) {
        this.errors.c_categorykindsname = "名称は必須です。";
        return;
      }
      if (v.length > 100) {
        this.errors.c_categorykindsname = "指導員種別名称は100文字以内で入力してください。";
        return;
      }
      if (/<[^>]+>/.test(v)) { // 任意のHTMLタグを禁止（NoHtml と一致）
        this.errors.c_categorykindsname = "無効な入力です。";
        return;
      }

      const payload = { c_categorykindsname: this.normalize(v) };

      try {
        const token = localStorage.getItem("token"); // ★ Bearer を付与
        await axios.post(
          "http://localhost:8000/api/coach-kinds",
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
        this.form.c_categorykindsname = "";
      } catch (err) {
        if (err.response?.status === 422) {
          const msg = err.response?.data?.errors?.c_categorykindsname?.[0];
          this.errors.c_categorykindsname = msg || "入力エラーが発生しました。"; // ★ 先頭を表示
        } else if (err.response?.status === 401) {
          this.errors.c_categorykindsname = "";
          this.successMessage = "";
          alert("認証が切れています。再ログインしてください。");
        } else {
          alert("登録に失敗しました。");
        }
      }
    },
  },
};
</script>
