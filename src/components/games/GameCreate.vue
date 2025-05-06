<template>
  <div class="p-4">
    

    <CForm @submit.prevent="submitForm">
      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>大会ID[編集不可]</CFormLabel>
          <CFormInput v-model="form.tournament_id" type="number" :readonly="true" />
        </CCol>

        <!-- ディビジョン設定が有効な大会のみ表示、isLoadedチェックも内包 -->
        <CCol md="6" v-if="isDivisionLoaded && divisionflg === 1">
          <CFormLabel>ディビジョン名</CFormLabel>

          <!-- divisionflg 読み込み中は placeholder を表示 -->
            <CFormSelect
              v-if="isDivisionLoaded && divisionflg === 1"
              v-model="form.division_name"
              :required="isDivisionRequired"
              :disabled="divisionOptions.length === 0">
              <option value="">選択してください</option>
              <option v-for="d in divisionOptions" :key="d.order" :value="d.name">
                {{ d.name }}
              </option>
            </CFormSelect>
          </CCol>

          <!-- ディビジョンフラグ未取得中のみプレースホルダ表示（ちらつき防止） -->
          <CCol md="6" v-else-if="!isDivisionLoaded">
            <CFormLabel>ディビジョン名</CFormLabel>
            <CFormInput :disabled="true" placeholder="読み込み中..." />
          </CCol>
        
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>回戦情報</CFormLabel>
          <CFormSelect v-model="form.round_info" required>
            <option value="">選択してください</option>
            <option value="9">Aリーグ</option>
            <option value="10">Bリーグ</option>
            <option value="11">Cリーグ</option>
            <option value="12">Dリーグ</option>
            <option value="44">Eリーグ</option>
            <option value="45">Fリーグ</option>
            <option value="46">Gリーグ</option>
            <option value="47">Hリーグ</option>
            <option value="48">Iリーグ</option>
            <option value="49">Jリーグ</option>
            <option value="50">Kリーグ</option>
            <option value="51">Lリーグ</option>
            <option value="52">Mリーグ</option>
            <option value="53">Nリーグ</option>
            <option value="54">Oリーグ</option>
            <option value="55">Pリーグ</option>
            <option value="56">Qリーグ</option>
            <option value="57">Rリーグ</option>
            <option value="58">Sリーグ</option>
            <option value="59">Tリーグ</option>
            <option value="60">Uリーグ</option>
            <option value="61">Vリーグ</option>
            <option value="62">Wリーグ</option>
            <option value="63">Xリーグ</option>
            <option value="64">Yリーグ</option>
            <option value="65">Zリーグ</option>
            <option value="1">1回戦</option>
            <option value="2">2回戦</option>
            <option value="3">3回戦</option>
            <option value="4">4回戦</option>
            <option value="5">5回戦</option>
            <option value="13">6回戦</option>
            <option value="14">7回戦</option>
            <option value="15">8回戦</option>
            <option value="16">9回戦</option>
            <option value="17">10回戦</option>
            <option value="18">11回戦</option>
            <option value="19">12回戦</option>
            <option value="20">13回戦</option>
            <option value="21">14回戦</option>
            <option value="22">15回戦</option>
            <option value="23">16回戦</option>
            <option value="24">17回戦</option>
            <option value="25">18回戦</option>
            <option value="26">19回戦</option>
            <option value="27">20回戦</option>
            <option value="28">21回戦</option>
            <option value="29">22回戦</option>
            <option value="30">23回戦</option>
            <option value="31">24回戦</option>
            <option value="32">25回戦</option>
            <option value="33">26回戦</option>
            <option value="34">27回戦</option>
            <option value="35">28回戦</option>
            <option value="36">29回戦</option>
            <option value="37">30回戦</option>
            <option value="38">準々決勝</option>
            <option value="6">準決勝</option>
            <option value="7">決勝</option>
            <option value="8">3位決定戦</option>
            <option value="39">4位決定戦</option>
            <option value="40">5位決定戦</option>
            <option value="41">6位決定戦</option>
            <option value="42">7位決定戦</option>
            <option value="43">8位決定戦</option>
          </CFormSelect>
        </CCol>
        <CCol md="6">
          <CFormLabel>開催日時</CFormLabel>
          <CFormInput v-model="form.date" type="datetime-local" required />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>会場</CFormLabel>
            <CFormSelect v-model="form.venue_id">
              <option value="">選択してください</option>
              <option v-for="venue in venues" :key="venue.venue_id" :value="venue.venue_id">
                {{ venue.venue_name }}
              </option>
            </CFormSelect>
        </CCol>
        <CCol md="6">
          <CFormLabel>レフリー</CFormLabel>
          <CFormInput v-model="form.referee" type="text" placeholder="レフリー名" />
        </CCol>
      </CRow>

      <CRow class="mb-3">
      <CCol md="6">
          <CFormLabel>対戦チーム（左）</CFormLabel>
          <CFormSelect v-model="form.team_left">
            <option value="">選択してください</option>
            <option v-for="team in teams" :key="team.id" :value="team.team_name">
              {{ team.team_name }}
            </option>
          </CFormSelect>
        </CCol>
        
        <CCol md="6">
          <CFormLabel>対戦チーム（右）</CFormLabel>
          <CFormSelect v-model="form.team_right">
            <option value="">選択してください</option>
            <option v-for="team in teams" :key="team.id" :value="team.team_name">
              {{ team.team_name }}
            </option>
          </CFormSelect>
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol md="6">
          <CFormLabel>担当者</CFormLabel>
          <CFormInput v-model="form.manager" type="text" placeholder="担当者名" />
        </CCol>
        <CCol md="6">
          <CFormLabel>ドクター</CFormLabel>
          <CFormInput v-model="form.doctor" type="text" placeholder="ドクター名" />
        </CCol>
      </CRow>

      <CButton color="primary" type="submit" class="me-2">登録</CButton>
      <CButton color="secondary" @click="goBack">戻る</CButton>
    </CForm>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

// useRouteで現在のルート情報を取得
const route = useRoute()
const router = useRouter()
const teams = ref([]) // チーム一覧
const venues = ref([]); // 会場一覧
const divisionOptions = ref([]) // ディビジョン配列
const isDivisionRequired = ref(false)  // ディビジョン入力の要否
const isDivisionLoaded = ref(false) // isDivisionLoaded だけを別に定義
const validationErrors = ref({}) //バリデーションエラー
const divisionflg = ref(null)  //ディビジョン表示
const isLoaded = ref(false)  //ディビジョン表示タイミング調整

const form = ref({
  tournament_id: '',
  division_name: '',
  round_info: '',
  date: '',
  venue_id: '',
  team_left: '',
  team_right: '',
  referee: '',
  manager: '',
  doctor: ''
})



// 初回マウント時に、クエリから tournament_id をフォームにセット
onMounted(async () => {
  const tournamentIdFromQuery = route.query.tournament_id || ''
  form.value.tournament_id = tournamentIdFromQuery
  
  // divisionflg 初期値クリア
  divisionflg.value = null
  isDivisionRequired.value = false
  isDivisionLoaded.value = false // ← divisionflg取得完了を明示的に表す

  // divisionflg だけを先に軽量取得（divRes）
  if (tournamentIdFromQuery) {
  try {
      const divRes = await axios.get(`http://localhost:8000/api/tournaments/${tournamentIdFromQuery}/check-division`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      })
      divisionflg.value = divRes.data.divisionflg
      isDivisionRequired.value = divRes.data.divisionflg === 1
      isDivisionLoaded.value = true // divisionflg のみ先に表示させる
    } catch (e) {
      console.error('divisionflg の取得に失敗:', e)
  }
  // 必要な場合のみ、divisions 情報を取得（res）
  if (divisionflg.value === 1) {
    try {
        const res = await axios.get(`http://localhost:8000/api/tournaments/${tournamentIdFromQuery}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true
        })

        const divisionsJson = res.data.divisions
        divisionOptions.value = divisionsJson ?? []
      } catch (e) {
        console.error('大会情報の取得に失敗:', e)
      }
    }
  }
  // 🔵 チーム一覧もここで取得する
  try {
    const teamRes = await axios.get('http://localhost:8000/api/teams', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    teams.value = teamRes.data
  } catch (e) {
    console.error('チーム情報の取得に失敗:', e)
  }
  // 会場情報の取得
  try {
    const venueRes = await axios.get('http://localhost:8000/api/venues', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    venues.value = venueRes.data
  } catch (e) {
    console.error('会場情報の取得に失敗:', e)
  }
  isLoaded.value = true
  })

  const prepareFormData = () => {
  const convertEmptyToNull = (value) => value === '' ? null : value
  // 対戦チーム（team_left, team_right）はIDを送る
  const selectedTeamLeft = teams.value.find(t => t.team_name === form.value.team_left);
  const selectedTeamRight = teams.value.find(t => t.team_name === form.value.team_right);

  return {
    tournament_id: form.value.tournament_id,
    division_name: form.value.division_name,
    match_round: form.value.round_info,             // ★ round_info → match_round
    match_datetime: form.value.date,                 // ★ date → match_datetime
    venue_id: convertEmptyToNull(form.value.venue_id),// 会場選択

    team1_id: selectedTeamLeft ? selectedTeamLeft.team_id : null,  // チーム名からIDを取る
    team1_alias: null,                               // 今回はエイリアスなし
    team2_id: selectedTeamRight ? selectedTeamRight.team_id : null,
    team2_alias: null,

    referee: convertEmptyToNull(form.value.referee),
    manager: convertEmptyToNull(form.value.manager),
    doctor: convertEmptyToNull(form.value.doctor),
  }
};

const submitForm = async () => {
  validationErrors.value = {} // ← 送信前に初期化
  try {
    const preparedData = prepareFormData()
    await axios.post('http://localhost:8000/api/games', preparedData, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  withCredentials: true
  })
    alert('登録完了しました')
    router.push('/games')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      validationErrors.value = error.response.data.errors || {}
    } else {
      console.error('登録エラー:', error)
      alert('登録に失敗しました')
    }
  }
}

const goBack = () => {
  router.back() // 1つ前のページに戻る（または router.push('/tournaments') なども可）
}



</script>

<style scoped>
.p-4 {
  max-width: 800px;
  margin: auto;
}
</style>
