<template>
  <div class="p-3">

    <!-- 成功メッセージ（既存を流用） -->
    <CAlert
      v-if="successMessage"
      color="success"
      class="mb-3"
      dismissible
      @close="successMessage = ''"
    >
      {{ successMessage }}
    </CAlert>

    <CForm @submit.prevent="handleSubmit" class="mb-3">
      <div class="mb-3">
        <CFormLabel for="name">協会担当種別名称 <span class="text-danger">*</span></CFormLabel>
        <CFormInput
          id="name"
          v-model="form.a_positionkindskindsname"
          type="text"
          placeholder="例）広報担当"
          :invalid="!!errors.a_positionkindskindsname"
        />
        <div class="form-text">100文字以内、HTMLタグ不可</div>
        <div v-if="errors.a_positionkindskindsname" class="text-danger mt-1">
          {{ errors.a_positionkindskindsname }}
        </div>
      </div>

      <div class="d-flex gap-2">
        <CButton type="submit" color="primary">登録する</CButton>
        <CButton color="secondary" variant="outline" @click="$router.push('/a-position-kinds')">
          一覧へ
        </CButton>
      </div>
    </CForm>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "APositionKindCreate",
  data() {
    return {
      form: { a_positionkindskindsname: "" },
      errors: { a_positionkindskindsname: "" },
      successMessage: "",
    };
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
      this.errors.a_positionkindskindsname = "";
      this.successMessage = "";

      // ★ フロント最小バリデ（サーバと整合）
      const v = (this.form.a_positionkindskindsname || "").toString();
      if (!v.trim()) {
        this.errors.a_positionkindskindsname = "名称は必須です。";
        return;
      }
      if (v.length > 100) {
        this.errors.a_positionkindskindsname = "協会担当種別名称は100文字以内で入力してください。";
        return;
      }
      if (/<[^>]+>/.test(v)) { // NoHtml と一致
        this.errors.a_positionkindskindsname = "無効な入力です。";
        return;
      }

      const payload = { a_positionkindskindsname: this.normalize(v) };

      try {
        const token = localStorage.getItem("token"); // ★ Bearer を付与（Coachと同じ位置）
        await axios.post(
          "http://localhost:8000/api/a-position-kinds",
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
        this.form.a_positionkindskindsname = ""; // ★ Coach同様、成功後はクリア
      } catch (err) {
        if (err.response?.status === 422) {
          const msg = err.response?.data?.errors?.a_positionkindskindsname?.[0];
          this.errors.a_positionkindskindsname = msg || "入力エラーが発生しました。"; // ★ 先頭のみ表示
        } else if (err.response?.status === 401) {
          this.errors.a_positionkindskindsname = "";
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
