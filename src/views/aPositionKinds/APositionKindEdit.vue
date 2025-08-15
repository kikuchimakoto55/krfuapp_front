<template>
  <CContainer class="p-3">
    <h5 class="mb-3">協会担当種別 編集</h5>

    <CAlert v-if="successMessage" color="success" class="mb-3" dismissible @close="successMessage=''">
      {{ successMessage }}
    </CAlert>
    <CAlert v-if="errorMessage" color="danger" class="mb-3" dismissible @close="errorMessage=''">
      {{ errorMessage }}
    </CAlert>

    <CForm @submit.prevent="handleSubmit" v-if="!loading">
      <div class="mb-3">
        <CFormLabel for="a_positionkindskindsname">協会担当種別名称 <span class="text-danger">*</span></CFormLabel>
        <CFormInput
          id="a_positionkindskindsname"
          v-model="form.a_positionkindskindsname"
          :invalid="!!errors.a_positionkindskindsname"
          placeholder="例：広報担当"
          @blur="validateField()"
        />
        <div class="form-text d-flex justify-between">
          <span>100文字以内 / 角括弧&lt; &gt;禁止</span>
          <span>{{ form.a_positionkindskindsname.length }} / 100</span>
        </div>
        <div v-if="errors.a_positionkindskindsname" class="invalid-feedback d-block">
          {{ errors.a_positionkindskindsname }}
        </div>
      </div>

      <div class="d-flex gap-2">
        <CButton type="submit" color="primary" :disabled="submitting || !isValid">保存</CButton>
        <CButton type="button" color="secondary" variant="outline" @click="goBack" :disabled="submitting">戻る</CButton>
      </div>
    </CForm>

    <div v-else>読み込み中...</div>
  </CContainer>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE = (import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '')
const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const form = reactive({ a_positionkindskindsname: '' })
const errors = reactive({ a_positionkindskindsname: '' })
const successMessage = ref('')
const errorMessage = ref('')
const loading = ref(true)
const submitting = ref(false)

const noHtml = (v) => /<[^>]+>/.test(v)
const validateField = () => {
  const v = (form.a_positionkindskindsname || '').toString()
  if (!v.trim()) { errors.a_positionkindskindsname = '協会担当種別名称は必須です。'; return false }
  if (v.length > 100) { errors.a_positionkindskindsname = '協会担当種別名称は100文字以内で入力してください。'; return false }
  if (noHtml(v)) { errors.a_positionkindskindsname = '無効な文字（HTMLタグ）は使用できません。'; return false }
  errors.a_positionkindskindsname = ''; return true
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
    const res = await axios.get(`${API_BASE}/api/a-position-kinds/${id}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    form.a_positionkindskindsname = res.data?.a_positionkindskindsname || ''
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
    await axios.put(`${API_BASE}/api/a-position-kinds/${id}`,
      { a_positionkindskindsname: normalize(form.a_positionkindskindsname) },
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
      errors.a_positionkindskindsname = err.response.data?.errors?.a_positionkindskindsname?.[0] || '入力エラーです。'
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

const goBack = () => router.push('/a-position-kinds')

onMounted(fetchItem)
</script>

<style scoped>
.d-flex { display: flex; }
.gap-2 { gap: .5rem; }
.justify-between { justify-content: space-between; }
</style>
