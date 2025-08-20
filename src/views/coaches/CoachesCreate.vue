<template>
  <div class="p-4">

    <CAlert v-if="alert.message" :color="alert.type" class="mb-3">{{ alert.message }}</CAlert>

    <CForm @submit.prevent="handleSubmit">
      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel for="member_id">会員ID</CFormLabel>
          <CFormInput id="member_id" v-model="form.member_id" type="text" placeholder="例) 123" />
          <div v-if="errors.member_id" class="text-danger small mt-1">{{ errors.member_id }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="4">
          <CFormLabel for="coachKinds">指導員役職（複数選択可）</CFormLabel>
          <CFormSelect id="coachKinds" v-model="form.coach_kind_ids" multiple :size="6">
            <option
              v-for="k in coachKinds"
              :key="k.c_categorykinds_id"
              :value="String(k.c_categorykinds_id)"
            >
              {{ k.c_categorykindsname }}
            </option>
          </CFormSelect>
          <div v-if="errors.coach_kind_ids" class="text-danger small mt-1">{{ errors.coach_kind_ids }}</div>
        </CCol>

        <CCol md="4">
          <CFormLabel for="committeeKinds">委員会（複数選択可）</CFormLabel>
          <CFormSelect id="committeeKinds" v-model="form.committee_kind_ids" multiple :size="6">
            <option
              v-for="k in committeeKinds"
              :key="k.committeekinds_id"
              :value="String(k.committeekinds_id)"
            >
              {{ k.committeekindsname }}
            </option>
          </CFormSelect>
          <div v-if="errors.committee_kind_ids" class="text-danger small mt-1">{{ errors.committee_kind_ids }}</div>
        </CCol>

        <CCol md="4">
          <CFormLabel for="aPositionKinds">協会担当（複数選択可）</CFormLabel>
          <CFormSelect id="aPositionKinds" v-model="form.a_position_kind_ids" multiple :size="6">
            <option
              v-for="k in aPositionKinds"
              :key="k.a_positionkinds_id"
              :value="String(k.a_positionkinds_id)"
            >
              {{ k.a_positionkindsname }}
            </option>
          </CFormSelect>
          <div v-if="errors.a_position_kind_ids" class="text-danger small mt-1">{{ errors.a_position_kind_ids }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="12">
          <CFormLabel for="referee_id">レフリー会員番号（任意）</CFormLabel>
          <CFormInput id="referee_id" v-model="form.referee_id" type="text" placeholder="任意" />
          <div v-if="errors.referee_id" class="text-danger small mt-1">{{ errors.referee_id }}</div>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol>
          <CFormLabel for="remarks">備考</CFormLabel>
          <CFormTextarea id="remarks" v-model="form.remarks" rows="3" placeholder="任意" />
          <div v-if="errors.remarks" class="text-danger small mt-1">{{ errors.remarks }}</div>
        </CCol>
      </CRow>

      <div class="d-flex gap-2">
        <CButton type="submit" color="primary" :disabled="isSubmitting">
          <template v-if="isSubmitting"><CSpinner component="span" size="sm" class="me-2" />登録中...</template>
          <template v-else>登録</template>
        </CButton>
        <CButton type="button" color="secondary" @click="handleReset" :disabled="isSubmitting">クリア</CButton>
      </div>
    </CForm>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isSubmitting = ref(false)
const alert = ref({ type: 'info', message: '' })
const errors = ref({})

const coachKinds = ref([])
const committeeKinds = ref([])
const aPositionKinds = ref([])

const form = ref({
  member_id: '',
  coach_kind_ids: [],        // 文字列配列で保持（CoreUIの警告回避）
  committee_kind_ids: [],    // 文字列配列で保持
  a_position_kind_ids: [],   // 文字列配列で保持
  remarks: '',
  referee_id: '',
})

const fetchAllKinds = async () => {
  try {
    const token = localStorage.getItem('token')
    const cfg = {
      withCredentials: true,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
      },
    }

    const [r1, r2, r3] = await Promise.all([
      axios.get('http://localhost:8000/api/coach-kinds', cfg),
      axios.get('http://localhost:8000/api/committee-kinds', cfg),
      axios.get('http://localhost:8000/api/a-position-kinds', cfg),
    ])

    // レスポンスが {data:[...]} の場合にも対応
    const pick = (res) =>
      Array.isArray(res.data) ? res.data :
      (Array.isArray(res.data?.data) ? res.data.data : [])

    // del_flg が来る実装にも対応（なければ素通し）
    const safe = (arr) => Array.isArray(arr)
      ? arr.filter(x => (x?.del_flg ?? 0) === 0)
      : []

    // 役職: キー名ゆらぎを吸収して正規化
    const normalizeAPosition = (arr) => safe(arr).map(it => ({
      a_positionkinds_id:
        it.a_positionkinds_id ??
        it.a_positionkindsId ??
        it.apositionkinds_id ??
        it.id,
      a_positionkindsname:
        it.a_positionkindsname ??
        it.a_positionkindskindsname ??
        it.a_positionkinds_name ??
        it.name ??
        it.title,
    })).filter(it => it.a_positionkinds_id != null)

    coachKinds.value     = safe(pick(r1))
    committeeKinds.value = safe(pick(r2))
    aPositionKinds.value = normalizeAPosition(pick(r3))

    // デバッグ（必要なら一時的に確認）
    console.debug('aPositionKinds fetched:', aPositionKinds.value)
  } catch (e) {
    console.error('kinds fetch error', e?.response?.status, e?.response?.data)
    alert.value = { type: 'danger', message: '種別マスタの取得に失敗しました。' }
  }
}

onMounted(fetchAllKinds)

const handleReset = () => {
  form.value = {
    member_id: '',
    coach_kind_ids: [],
    committee_kind_ids: [],
    a_position_kind_ids: [],
    remarks: '',
    referee_id: '',
  }
  errors.value = {}
  alert.value = { type: 'info', message: '' }
}

const handleSubmit = async () => {
  errors.value = {}
  alert.value = { type: 'info', message: '' }

  const payload = {
    member_id: Number(form.value.member_id),
    coach_kind_ids: form.value.coach_kind_ids.map(v => Number(v)),
    committee_kind_ids: form.value.committee_kind_ids.map(v => Number(v)),
    a_position_kind_ids: form.value.a_position_kind_ids.map(v => Number(v)),
    remarks: form.value.remarks || null,
    referee_id: form.value.referee_id || null,
  }

  const hasAny =
    (payload.coach_kind_ids?.length || 0) > 0 ||
    (payload.committee_kind_ids?.length || 0) > 0 ||
    (payload.a_position_kind_ids?.length || 0) > 0

  if (!payload.member_id) errors.value.member_id = '会員IDは必須です。'
  if (!hasAny) errors.value.coach_kind_ids = 'いずれかの種別を最低1つ選択してください。'
  if (!payload.member_id || !hasAny) return

  isSubmitting.value = true
  try {
    // Sanctum: CSRFクッキー取得（必須）
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true })

    // Bearer トークン（既存ログイン処理で保存済み想定）
    const token = localStorage.getItem('token')

    const res = await axios.post('http://localhost:8000/api/coaches', payload, {
      withCredentials: true,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
      },
    })

    if (res.status === 201) {
      alert.value = { type: 'success', message: '登録しました' }
      window.alert('登録しました')
    } else if (res.status === 200) {
      const msg = res.data?.message || '新規に登録されたデータはありません'
      alert.value = { type: 'warning', message: msg }
      window.alert(msg)
    }
  } catch (e) {
    console.error(e)
    const status = e?.response?.status

    if (status === 409) {
      const yes = window.confirm('登録済みデータがあります。最新情報で上書きしますか？')
      if (yes) {
        const token = localStorage.getItem('token')
        await axios.post(
          'http://localhost:8000/api/coaches?overwrite=1',
          payload,
          {
            withCredentials: true,
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              Accept: 'application/json',
            },
          }
        )
        alert.value = { type: 'success', message: '上書き更新しました。' }
        window.alert('上書き更新しました。')
      } else {
        router.push(`/coaches/edit/${form.value.member_id}`)
      }
      return
    }

    if (status === 401 || status === 419) {
      alert.value = { type: 'danger', message: '未認証です（ログインし直してください）。' }
      window.alert('未認証です（ログインし直してください）。')
    } else if (status === 403) {
      alert.value = { type: 'danger', message: '権限がありません。' }
      window.alert('権限がありません。')
    } else if (status === 422) {
      const ve = e.response?.data?.errors || {}
      const firstKey = Object.keys(ve)[0]
      if (firstKey) {
        errors.value[firstKey] = Array.isArray(ve[firstKey]) ? ve[firstKey][0] : String(ve[firstKey])
      }
      alert.value = { type: 'danger', message: '入力内容を確認してください。' }
      window.alert('入力内容を確認してください。')
    } else {
      alert.value = { type: 'danger', message: 'サーバーエラーが発生しました。' }
      window.alert('サーバーエラーが発生しました。')
    }
  } finally {
    // どの経路でも必ず false に戻す
    isSubmitting.value = false
  }
}
</script>
