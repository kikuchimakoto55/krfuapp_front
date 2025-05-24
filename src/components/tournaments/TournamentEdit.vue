<template>
  <div class="p-4">
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
            <CFormSelect v-model="form.publishing" required>
              <option value="0">公開</option>
              <option value="1">非公開</option>
            </CFormSelect>
          </CCol>

        <CCol md="6" class="text-center">
          <CFormLabel>ディビジョン設定</CFormLabel>
          <div class="d-flex justify-content-center gap-4 mt-2">
            <!--  設定しない -->
            <CFormCheck
            type="radio"
            :checked="form.divisionflg === 0"
            @change="setDivisionFlg(0)"
            name="division-setting"
            id="division-off"
            />
            <label for="division-off" class="form-check-label">設定しない</label>

            <!--  設定する -->
            <CFormCheck
            type="radio"
            :checked="form.divisionflg === 1"
            @change="setDivisionFlg(1)"
            name="division-setting"
            id="division-on"
            />
            <label for="division-on" class="form-check-label">設定する</label>
          </div>
        </CCol>
        </CRow>

        <!--  設定する を選んだ場合だけ表示 -->
        <CRow v-if="form.divisionflg === 1" class="mb-3">
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

      <!-- ボタン行 -->
      <CRow class="mt-4">
        <CCol class="text-center">
          <CButton type="submit" color="primary">更新</CButton>
        </CCol>
        <CCol class="text-center">
          <CButton color="danger" @click="handleDelete">削除</CButton>
        </CCol>
        <CCol class="text-center">
          <CButton color="secondary" @click="handleCopy">複製</CButton>
        </CCol>
      </CRow>

      <!-- 大会結果編集フォーム -->
      <CRow class="mt-5">
        <CCol>
          <h5>大会結果の編集</h5>
          <div v-for="(division, dIndex) in resultForm.results" :key="dIndex" class="border p-3 mb-3">
            <h6 class="mb-2">ディビジョン {{ division.division_order }}：{{ division.division_name }}</h6>
            <div v-for="(result, rIndex) in division.results" :key="rIndex" class="mb-3">
              <CRow>
                <CCol md="3">
                  <CFormLabel>順位名</CFormLabel>
                  <CFormInput v-model="result.rank_label" />
                </CCol>
                <CCol md="3">
                  <CFormLabel>チームID</CFormLabel>
                  <CFormInput v-model="result.team_id" type="number" />
                </CCol>
                <CCol md="4">
                  <CFormLabel>結果レポート</CFormLabel>
                  <CFormInput v-model="result.report" />
                </CCol>
                <CCol md="2">
                  <CFormLabel>対戦表</CFormLabel>
                  <CFormInput type="file" @change="e => handleFileUpload(e, dIndex, rIndex)" />
                </CCol>
              </CRow>
            </div>
          </div>

          <div class="text-center">
            <CButton color="info" @click="handleResultUpdate">大会結果を編集</CButton>
          </div>
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
  name: '', categoly: '', year: '', event_period_start: '', event_period_end: '',
  publishing: "0", divisionflg: 0, divisions: []
})

const resultForm = ref({ results: [] })
const fileMap = ref({})

//複製処理
const handleCopy = () => {
  router.push({ path: '/tournaments/create', query: { copyFrom: route.params.id } })
}

// 編集対象のデータを取得
onMounted(async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/tournaments/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true,
    })
    const data = res.data
// divisions はJSON文字列 → オブジェクトに変換
    form.value = {
      ...data,
      divisionflg: Number(data.divisionflg),
      divisions: Array.isArray(data.divisions) ? data.divisions : []
    }
  } catch (err) {
    console.error('取得失敗', err)
    alert('大会情報の取得に失敗しました')
  }

  try {
    const res = await axios.get(`http://localhost:8000/api/tournament-results/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    const raw = res.data
    const grouped = {}
    raw.forEach(item => {
      const key = item.division_order
      if (!grouped[key]) grouped[key] = { division_order: item.division_order, division_name: item.division_name, results: [] }
      grouped[key].results.push({
        rank_label: item.rank_label,
        team_id: item.team_id,
        report: item.report || '',
        document_path: item.document_path || '',
      })
    })
    resultForm.value.results = Object.values(grouped)
  } catch (err) {
    console.error('結果取得エラー', err)
  }
})

//更新処理
const handleUpdate = async () => {
  if (form.value.divisionflg === 1 && form.value.divisions.length === 0) {
    alert("ディビジョンを1つ以上入力してください"); return;
  }
  const hasEmpty = form.value.divisions.some(d => !d.name?.trim());
  if (form.value.divisionflg === 1 && hasEmpty) {
    alert("すべてのディビジョン名を入力してください"); return;
  }
  try {
    const formData = {
      ...form.value,
      categoly: Number(form.value.categoly),
      publishing: Number(form.value.publishing),
      divisionflg: Number(form.value.divisionflg),
      divisions: form.value.divisions?.length ? JSON.stringify(form.value.divisions) : null,
    }
    await axios.put(`http://127.0.0.1:8000/api/tournaments/${route.params.id}`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    alert('大会情報を更新しました');
    router.push('/tournaments')
  } catch (err) {
    console.error('更新失敗', err)
    alert('更新に失敗しました')
  }
}

//削除処理
const handleDelete = async () => {
  if (!confirm('この大会を削除してもよろしいですか？')) return;
  try {
    await axios.delete(`http://localhost:8000/api/tournaments/${route.params.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    alert('削除が完了しました')
    router.push('/tournaments')
  } catch (error) {
    alert('削除に失敗しました')
  }
}

//ディビジョン設定
const addDivision = () => {
  if (!newDivisionName.value.trim()) {
    alert("ディビジョン名を入力してください")
    return
  }
  form.value.divisions.push({ order: form.value.divisions.length + 1, name: newDivisionName.value.trim() })
  newDivisionName.value = ""
}
const removeDivision = (index) => {
  form.value.divisions.splice(index, 1)
  form.value.divisions.forEach((d, i) => d.order = i + 1)
}
const newDivisionName = ref('')
const onDateChange = (type, event) => {
  const value = event.target.value
  if (type === 'start') form.value.event_period_start = value
  else form.value.event_period_end = value
}
const setDivisionFlg = (value) => {
  form.value.divisionflg = value
}

const handleFileUpload = (e, dIndex, rIndex) => {
  const file = e.target.files[0]
  if (!file) return
  if (!fileMap.value[dIndex]) fileMap.value[dIndex] = {}
  fileMap.value[dIndex][rIndex] = file
}

const handleResultUpdate = async () => {
  const formData = new FormData()
  formData.append('tournament_id', route.params.id)
  resultForm.value.results.forEach((division, dIndex) => {
    division.results.forEach((result, rIndex) => {
      formData.append(`results[${dIndex}][${rIndex}][division_order]`, division.division_order)
      formData.append(`results[${dIndex}][${rIndex}][division_name]`, division.division_name)
      formData.append(`results[${dIndex}][${rIndex}][rank_order]`, rIndex + 1)
      formData.append(`results[${dIndex}][${rIndex}][rank_label]`, result.rank_label)
      formData.append(`results[${dIndex}][${rIndex}][team_id]`, result.team_id)
      formData.append(`results[${dIndex}][${rIndex}][report]`, result.report || '')
      if (fileMap.value[dIndex]?.[rIndex]) {
        formData.append(`results[${dIndex}][${rIndex}][document]`, fileMap.value[dIndex][rIndex])
      }
    })
  })
  try {
    await axios.post(
      `http://localhost:8000/api/tournament-results/update-by-tournament/${route.params.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
    )
    alert('大会結果を更新しました')
  } catch (err) {
    console.error('大会結果更新エラー', err)
    alert('更新に失敗しました')
  }
}
</script>
