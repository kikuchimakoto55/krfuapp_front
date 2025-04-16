<template>
    <div class="p-4">
      <h4>大会情報登録</h4>
      <CForm @submit.prevent="handleUpdate">
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>大会名</CFormLabel>
            <CFormInput v-model="form.name" required />
          </CCol>
          <CCol md="3">
            <CFormLabel>カテゴリ</CFormLabel>
            <CFormSelect v-model="form.categoly" required>
              <option value="1">有料試合</option>
              <option value="2">社会人</option>
              <option value="3">クラブ</option>
              <option value="4">大学</option>
              <option value="5">高校</option>
              <option value="6">中学</option>
              <option value="7">ラグビースクール</option>
              <option value="8">タグラグビー</option>
              <option value="9">女子</option>
            </CFormSelect>
          </CCol>
          <CCol md="3">
            <CFormLabel>年度（西暦）</CFormLabel>
                <CFormInput v-model="form.year" maxlength="4" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>開催開始日</CFormLabel>
            <CFormInput type="datetime-local" v-model="form.event_period_start" @change="onDateChange('start', $event)" required />
          </CCol>
          <CCol md="6">
            <CFormLabel>開催終了日</CFormLabel>
            <CFormInput type="datetime-local" v-model="form.event_period_end" @change="onDateChange('end', $event)" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>公開設定</CFormLabel>
            <CFormSelect v-model.number="form.publishing" required>
              <option value="0">公開</option>
              <option value="1">非公開</option>
            </CFormSelect>
          </CCol>

        <CCol md="6" class="text-center">
          <CFormLabel>ディビジョン設定</CFormLabel>
          <div class="d-flex justify-content-center gap-4 mt-2">
            <CFormCheck
              type="radio"
              v-model="form.divisionflg"
              :value="'0'"
              name="division-setting"
              id="division-off"
            />
            <label for="division-off" class="form-check-label">設定しない</label>
            <CFormCheck
              type="radio"
              v-model="form.divisionflg"
              :value="'1'"
              name="division-setting"
              id="division-on"
            />
            <label for="division-on" class="form-check-label">設定する</label>
          </div>
        </CCol>
        </CRow>

        <!-- ✅ 設定する を選んだ場合だけ表示 -->
        <CRow v-if="form.divisionflg === '1'" class="mb-3">
        <CCol>
          <div class="border p-3">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>並び順</th>
                  <th>ディビジョン名</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, index) in form.divisions" :key="index">
                <CTableDataCell>
                <CFormInput v-model="d.order" type="number" />
                </CTableDataCell>
                <CTableDataCell>
                <CFormInput v-model="d.name" />
                </CTableDataCell>
                <CTableDataCell>
                <CButton size="sm" color="danger" @click="removeDivision(index)">削除</CButton>
                </CTableDataCell>
              </tr>
                <tr>
                  <td colspan="2">
                    <input v-model="newDivisionName" placeholder="ディビジョン名を入力" class="form-control" />
                  </td>
                  <td>
                    <CButton size="sm" color="primary" @click="addDivision">追加</CButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CCol>
        </CRow>
              
        <CRow class="mt-4">
          <CCol class="text-center">
            <CButton type="submit" color="primary">更新</CButton>
          </CCol>
        </CRow>
      </CForm>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
const route = useRoute()
const router = useRouter()
  const form = ref({
    name: '',
    categoly: '',
    year: '',
    event_period_start: '',
    event_period_end: '',
    publishing: 0,
    divisionflg: "0",
    divisions: [],
  })

  // 編集対象のデータを取得
onMounted(async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/tournaments/${route.params.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })

    const data = res.data
    // divisions はJSON文字列 → オブジェクトに変換
    form.value = {
      ...data,
      divisions: data.divisions ? JSON.parse(data.divisions) : [],
    }
  } catch (err) {
    console.error('取得失敗', err)
    alert('大会情報の取得に失敗しました')
  }
})
  
// 更新処理
const handleUpdate = async () => {
  try {
    const formData = {
      ...form.value,
      categoly: Number(form.value.categoly),
      publishing: Number(form.value.publishing),
      divisionflg: Number(form.value.divisionflg),
      divisions: form.value.divisions?.length ? JSON.stringify(form.value.divisions) : null,
    }

    await axios.put(`http://127.0.0.1:8000/api/tournaments/${route.params.id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })

    alert('大会情報を更新しました')
    router.push('/tournaments') // 更新後一覧ページへ
  } catch (err) {
    console.error('更新失敗', err)
    alert('更新に失敗しました')
  }
}

 
  //ディビジョン設定
  const newDivisionName = ref('')

  const addDivision = () => {
    form.value.divisions.push({
  order: form.value.divisions.length + 1,
  name: newDivisionName.value.trim()
});
}

const removeDivision = (index) => {
  form.value.divisions.splice(index, 1);
form.value.divisions.forEach((d, i) => {
  d.order = i + 1;
});
}

const onDateChange = (type, event) => {
  const value = event.target.value
  if (type === 'start') {
    form.value.event_period_start = value
  } else {
    form.value.event_period_end = value
  }
}
  </script>
  