<template>
  <div class="p-3">
    <h5 class="mb-3">委員会種別 編集</h5>

    <CAlert color="danger" v-if="errorMessage">{{ errorMessage }}</CAlert>
    <CAlert color="success" v-if="successMessage">{{ successMessage }}</CAlert>

    <div v-if="loading" class="d-flex align-items-center mb-3">
      <CSpinner size="sm" class="me-2" /> 読み込み中...
    </div>

    <CForm v-else @submit.prevent="handleSubmit">
      <div class="mb-3">
        <CFormLabel for="name">委員会種別名称 <span class="text-danger">*</span></CFormLabel>
        <CFormInput id="name" v-model="form.committeekindsname" :disabled="submitting" :invalid="!!errors.committeekindsname" @blur="validateField()" />
        <div class="form-text">100文字以内、HTMLタグ不可</div>
        <div class="text-danger mt-1" v-if="errors.committeekindsname">{{ errors.committeekindsname }}</div>
      </div>

      <div class="d-flex gap-2">
        <CButton type="submit" color="primary" :disabled="submitting">
          <template v-if="submitting"><CSpinner size="sm" class="me-1" />更新中</template>
          <template v-else>更新する</template>
        </CButton>
        <CButton color="secondary" variant="outline" @click="$router.push('/committee-kinds')" :disabled="submitting">
          一覧へ戻る
        </CButton>
      </div>
    </CForm>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
const route = useRoute()
const id = Number(route.params.id)

const form = reactive({ committeekindsname: '' })
const errors = reactive({ committeekindsname: '' })
const successMessage = ref('')
const errorMessage = ref('')
const loading = ref(true)
const submitting = ref(false)


// 互換フラグ（テンプレ側で loaded を参照している場合に備える）
const loaded = ref(false)

const noHtml = (v) => /<[^>]+>/.test(v)
const validateField = () => {
  const v = (form.committeekindsname || '').toString()
  if (!v.trim()) { errors.committeekindsname = '名称は必須です。'; return false }
  if (v.length > 100) { errors.committeekindsname = '名称は100文字以内で入力してください。'; return false }
  if (noHtml(v)) { errors.committeekindsname = '無効な文字（HTMLタグ）は使用できません。'; return false }
  errors.committeekindsname = ''; return true
}
const isValid = computed(() => validateField())

const normalize = (s) => s
  .replace(/\u00A0|\u3000/g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/[\u200B-\u200D\uFEFF]/g, '')
  .trim()

const fetchItem = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${API_BASE}/api/committee-kinds/${id}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    form.committeekindsname = res.data.committeekindsname || ''
    loaded.value = true
  } catch (e) {
    errorMessage.value = '取得に失敗しました。存在しない可能性があります。'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!isValid.value) return
  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      `${API_BASE}/api/committee-kinds/${id}`,
      { committeekindsname: normalize(form.committeekindsname) },
      {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      }
    )
    successMessage.value = '更新しました。'
  } catch (err) {
    if (err?.response?.status === 422) {
      errors.committeekindsname = err.response.data?.errors?.committeekindsname?.[0] || '入力エラーです。'
    } else if (err?.response?.status === 404) {
      errorMessage.value = 'データが見つかりません。'
    } else if (err?.response?.status === 401) {
      errorMessage.value = '認証切れです。再ログインしてください。'
    } else {
      errorMessage.value = '更新に失敗しました。'
    }
  } finally {
    submitting.value = false
  }
}

onMounted(fetchItem)
</script>