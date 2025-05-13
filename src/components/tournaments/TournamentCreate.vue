<template>
    <div class="p-4">
      
      <CForm @submit.prevent="handleSubmit">
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
            <CFormLabel>年度（西暦）<span class="required">必須</span></CFormLabel>
                <CFormInput type="text" v-model="form.year" maxlength="4" pattern="^[0-9]{4}$" title="西暦4桁で入力してください" required />
                <div v-if="validationErrors.year" class="text-danger">
                {{ validationErrors.year[0] }}
                </div>
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
            <p>publishingの現在値: {{ form.publishing }}</p>
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
            <CButton type="submit" color="primary">登録</CButton>
          </CCol>
        </CRow>
      </CForm>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const form = ref({
    name: '',
    categoly: '',
    year: '',
    event_period_start: '',
    event_period_end: '',
    publishing: "0",
    divisionflg: "0",
    divisions: [],
  })
  
  const handleSubmit = async () => {
  // ✅ 年度が西暦4桁でなければエラー
  if (!/^\d{4}$/.test(form.value.year)) {
    alert('年度は西暦4桁で入力してください');
    return;
  }

  // ディビジョン設定ありのとき、必須チェック
  if (form.value.divisionflg === '1') {
    if (form.value.divisions.length === 0) {
      alert('ディビジョン設定が有効な場合は、ディビジョンを1つ以上追加してください。');
      return;
    }

    // 追加：名前未入力の行があるか確認
    const emptyName = form.value.divisions.some(d => !d.name.trim())
    if (emptyName) {
      alert('ディビジョン名をすべて入力してください。');
      return;
    }
  }

  try {
    const formData = {
      name: form.value.name,
      categoly: Number(form.value.categoly),
      year: form.value.year,
      event_period_start: form.value.event_period_start,
      event_period_end: form.value.event_period_end,
      publishing: Number(form.value.publishing),
      divisionflg: Number(form.value.divisionflg),
      divisions: form.value.divisions.length ? JSON.stringify(form.value.divisions) : null,
    };

    console.log('送信内容:', formData);

    await axios.post('http://127.0.0.1:8000/api/tournaments', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true
    });

    alert('大会情報を登録しました');
  } catch (err) {
    console.error('登録失敗', err);
    alert('登録に失敗しました');
  }
  }

  const validationErrors = ref({})

  
  //ディビジョン設定
  const newDivisionName = ref('')

  const addDivision = () => {
  const name = newDivisionName.value.trim()
  if (!name) {
    alert('ディビジョン名を入力してください')
    return
  }

  form.value.divisions.push({
    order: form.value.divisions.length + 1,
    name
  })

  newDivisionName.value = '' // ← 入力欄クリア
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
  