<template>
    <div class="p-4">
  
      <CForm @submit.prevent="submit">
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>大会ID</CFormLabel>
            <CFormInput v-model="form.tournament_id" readonly />
          </CCol>
          <CCol md="6" v-if="tournament.value && tournament.value.divisionflg === 1">
            <CFormLabel>ディビジョン名</CFormLabel>
            <CFormSelect v-model="form.division_name">
              <option value="">選択してください</option>
              <option v-for="division in divisions" :key="division.division_name" :value="division.division_name">
                {{ division.division_name }}
              </option>
            </CFormSelect>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>回戦</CFormLabel>
            <CFormSelect v-model="form.round_label">
              <option value="">選択してください</option>
              <option v-for="(label, key) in roundOptions" :key="key" :value="key">{{ label }}</option>
            </CFormSelect>
          </CCol>
          <CCol md="6">
            <CFormLabel>試合日時</CFormLabel>
            <CFormInput type="datetime-local" v-model="form.game_date" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>会場名</CFormLabel>
              <CFormSelect v-model="form.venue_id">
                <option value="">選択してください</option>
                  <option v-for="venue in venues" :key="venue.venue_id" :value="String(venue.venue_id)">
                    {{ venue.venue_name }}
                  </option>
              </CFormSelect>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>チーム1</CFormLabel>
              <CFormSelect v-model="form.team1_id">
                <option value="">選択してください</option>
                <option v-for="team in teams" :key="team.team_id" :value="team.team_id">
                  {{ team.team_name }}
                </option>
              </CFormSelect>
          </CCol>
          <CCol md="6">
            <CFormLabel>チーム2</CFormLabel>
              <CFormSelect v-model="form.team2_id">
                <option value="">選択してください</option>
                <option v-for="team in teams" :key="team.team_id" :value="team.team_id">
                  {{ team.team_name }}
                </option>
              </CFormSelect>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>レフリー</CFormLabel>
            <CFormInput :value="form.referee || '未設定'" />
          </CCol>
          <CCol md="6">
            <CFormLabel>担当者</CFormLabel>
            <CFormInput :value="form.manager || '未設定'" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>ドクター</CFormLabel>
            <CFormInput :value="form.doctor || '未設定'" />
          </CCol>
        </CRow>
  
        <CButton type="submit" color="primary">更新する</CButton>
        <CButton color="secondary" class="ms-4" @click="goBack">キャンセル</CButton>
      </CForm>
    </div>

        <h3 class="mt-5 text-lg font-bold">スコア編集</h3>
    <table class="table table-bordered w-full text-center border mt-2">
      <thead>
        <tr>
          <th colspan="2">{{ form.team1?.team_name || 'チーム1' }}</th>
          <th rowspan="2" class="align-middle">種別</th>
          <th colspan="2">{{ form.team2?.team_name || 'チーム2' }}</th>
        </tr>
        <tr>
          <th>前半</th>
          <th>後半</th>
          <th>前半</th>
          <th>後半</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(label, key) in { T: 't', G: 'g', PG: 'pg', DG: 'dg' }" :key="key">
          <td><CFormInput v-model.number="score[`op1fh_${label}`]" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td><CFormInput v-model.number="score[`op1hh_${label}`]" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td>{{ key }}</td>
          <td><CFormInput v-model.number="score[`op2fh_${label}`]" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td><CFormInput v-model.number="score[`op2hh_${label}`]" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
        </tr>
        <tr>
          <td colspan="2">{{ score.op1fh_score + score.op1hh_score }} 点</td>
          <td>得点</td>
          <td colspan="2">{{ score.op2fh_score + score.op2hh_score }} 点</td>
        </tr>
        <tr>
          <td colspan="5">
            <CButton color="secondary" @click="calcScore">スコア計算</CButton>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-center gap-4 mt-4">
      <div class="team-card text-center p-3 border rounded shadow-sm">
        <div class="fw-bold">{{ form.team1?.team_name || 'チーム1' }} <span>{{ judgeResult()[0] }}</span></div>
        <div class="fs-4">{{ score.op1fh_score + score.op1hh_score }} 点</div>
      </div>
      <div class="team-card text-center p-3 border rounded shadow-sm">
        <div class="fw-bold">{{ form.team2?.team_name || 'チーム2' }} <span>{{ judgeResult()[1] }}</span></div>
        <div class="fs-4">{{ score.op2fh_score + score.op2hh_score }} 点</div>
      </div>
    </div>

    <!-- PK / FK / 反則 入力 -->
    <h4 class="mt-5 font-semibold">反則入力</h4>
    <table class="table table-bordered w-full text-center border mt-2">
      <thead>
        <tr>
          <th colspan="2">{{ form.team1?.team_name || 'チーム1' }}</th>
          <th></th>
          <th colspan="2">{{ form.team2?.team_name || 'チーム2' }}</th>
        </tr>
        <tr>
          <th>PK</th>
          <th>FK</th>
          <th>反則</th>
          <th>PK</th>
          <th>FK</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><CFormInput v-model.number="score.op1fh_pkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td><CFormInput v-model.number="score.op1fh_fkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td class="align-middle fw-bold">前半</td>
          <td><CFormInput v-model.number="score.op2fh_pkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td><CFormInput v-model.number="score.op2fh_fkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
        </tr>
        <tr>
          <td><CFormInput v-model.number="score.op1hh_pkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td><CFormInput v-model.number="score.op1hh_fkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td class="align-middle fw-bold">後半</td>
          <td><CFormInput v-model.number="score.op2hh_pkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
          <td><CFormInput v-model.number="score.op2hh_fkscore" type="number" inputmode="numeric" pattern="[0-9]*" /></td>
        </tr>
        <tr>
          <td>{{ score.op1fh_pkscore + score.op1hh_pkscore }}</td>
          <td>{{ score.op1fh_fkscore + score.op1hh_fkscore }}</td>
          <td class="align-middle fw-bold">合計</td>
          <td>{{ score.op2fh_pkscore + score.op2hh_pkscore }}</td>
          <td>{{ score.op2fh_fkscore + score.op2hh_fkscore }}</td>
        </tr>
        <tr>
          <td colspan="5">
            <CButton color="secondary" @click="calcPenalty">反則数計算</CButton>
          </td>
        </tr>
      </tbody>
    </table>

  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const router = useRouter()
  const gameId = route.params.id
  const form = ref({})
  const venues = ref([])
  const teams = ref([])
  const tournament = ref({})
  const divisions = ref([])
  
  const score = ref({
  // 前半・後半：チーム1
  op1fh_t: 0, op1fh_g: 0, op1fh_pg: 0, op1fh_dg: 0,
  op1hh_t: 0, op1hh_g: 0, op1hh_pg: 0, op1hh_dg: 0,

  // 前半・後半：チーム2
  op2fh_t: 0, op2fh_g: 0, op2fh_pg: 0, op2fh_dg: 0,
  op2hh_t: 0, op2hh_g: 0, op2hh_pg: 0, op2hh_dg: 0,

  // 得点合計
  op1fh_score: 0, op1hh_score: 0,
  op2fh_score: 0, op2hh_score: 0,

  // 反則数（PK/FK）
  op1fh_pkscore: 0, op1hh_pkscore: 0,
  op1fh_fkscore: 0, op1hh_fkscore: 0,
  op2fh_pkscore: 0, op2hh_pkscore: 0,
  op2fh_fkscore: 0, op2hh_fkscore: 0,

  // その他
  score_book: '',
  gamereport: '',
  publishing: 1,
})

const judgeResult = () => {
  const team1 = score.value.op1fh_score + score.value.op1hh_score
  const team2 = score.value.op2fh_score + score.value.op2hh_score
  if (team1 > team2) return ['○', '●']
  if (team1 < team2) return ['●', '○']
  return ['△', '△']
}

const calcPenalty = () => {
  // ここではVueテンプレート側で合計済みのため、処理が必要なら記載
  console.log('PK/FK合計:', {
    team1_pk: score.value.op1fh_pkscore + score.value.op1hh_pkscore,
    team1_fk: score.value.op1fh_fkscore + score.value.op1hh_fkscore,
    team2_pk: score.value.op2fh_pkscore + score.value.op2hh_pkscore,
    team2_fk: score.value.op2fh_fkscore + score.value.op2hh_fkscore,
  })
}

onMounted(async () => {
  try {
    const gameResponse = await axios.get(`http://localhost:8000/api/games/${gameId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })

    form.value = { ...gameResponse.data }

    // 試合日時をdatetime-local用に変換
    if (form.value.game_date) {
      form.value.game_date = new Date(form.value.game_date).toISOString().slice(0, 16)
    }

    // 試合情報取得後
    const tournamentResponse = await axios.get(`http://localhost:8000/api/tournaments/${form.value.tournament_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    tournament.value = tournamentResponse.data

    console.log('取得した tournament:', tournament.value)
    console.log('divisionflg:', tournament.value.divisionflg)
    console.log('取得した divisions:', divisions.value)


    // divisionflgが0ならディビジョン名をnullに
    if (tournament.value.divisionflg !== 1) {
      form.value.division_name = null
    }
    // division 一覧を取得
    const divisionResponse = await axios.get(`http://localhost:8000/api/tournaments/${form.value.tournament_id}/divisions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    divisions.value = divisionResponse.data

    // 会場一覧を取得
    const venueResponse = await axios.get('http://localhost:8000/api/venues', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    venues.value = venueResponse.data

    // チーム一覧を取得
    const teamResponse = await axios.get('http://localhost:8000/api/teams', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    teams.value = teamResponse.data

  } catch (error) {
    console.error('試合情報の取得失敗:', error)
    alert('試合情報の取得に失敗しました')
  }
})
  
const submit = async () => {
  try {
    await axios.put(`http://localhost:8000/api/games/${gameId}`, {
      ...form.value,
      venue_id: Number(form.value.venue_id),
      team1_id: Number(form.value.team1_id),
      team2_id: Number(form.value.team2_id),
      round_label: Number(form.value.round_label),
      score: score.value
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
    alert('試合情報を更新しました')
    router.push('/games')
  } catch (error) {
    console.error('試合情報の更新失敗:', error)
    alert('試合情報の更新に失敗しました')
  }
}
  
  
  const goBack = () => {
    router.push('/games')
  }

  const calcScore = () => {
  const calc = (t, g, pg, dg) => (t * 5) + (g * 2) + (pg * 3) + (dg * 3)

  score.value.op1fh_score = calc(score.value.op1fh_t, score.value.op1fh_g, score.value.op1fh_pg, score.value.op1fh_dg)
  score.value.op1hh_score = calc(score.value.op1hh_t, score.value.op1hh_g, score.value.op1hh_pg, score.value.op1hh_dg)

  score.value.op2fh_score = calc(score.value.op2fh_t, score.value.op2fh_g, score.value.op2fh_pg, score.value.op2fh_dg)
  score.value.op2hh_score = calc(score.value.op2hh_t, score.value.op2hh_g, score.value.op2hh_pg, score.value.op2hh_dg)
  }

  const roundOptions = {
    9: 'Aリーグ',
    10: 'Bリーグ',
    11: 'Cリーグ',
    12: 'Dリーグ',
    44: 'Eリーグ',
    45: 'Fリーグ',
    46: 'Gリーグ',
    47: 'Hリーグ',
    48: 'Iリーグ',
    49: 'Jリーグ',
    50: 'Kリーグ',
    51: 'Lリーグ',
    52: 'Mリーグ',
    53: 'Nリーグ',
    54: 'Oリーグ',
    55: 'Pリーグ',
    56: 'Qリーグ',
    57: 'Rリーグ',
    58: 'Sリーグ',
    59: 'Tリーグ',
    60: 'Uリーグ',
    61: 'Vリーグ',
    62: 'Wリーグ',
    63: 'Xリーグ',
    64: 'Yリーグ',
    65: 'Zリーグ',
    1: '1回戦',
    2: '2回戦',
    3: '3回戦',
    4: '4回戦',
    5: '5回戦',
    13: '6回戦',
    14: '7回戦',
    15: '8回戦',
    16: '9回戦',
    17: '10回戦',
    18: '11回戦',
    19: '12回戦',
    20: '13回戦',
    21: '14回戦',
    22: '15回戦',
    23: '16回戦',
    24: '17回戦',
    25: '18回戦',
    26: '19回戦',
    27: '20回戦',
    28: '21回戦',
    29: '22回戦',
    30: '23回戦',
    31: '24回戦',
    32: '25回戦',
    33: '26回戦',
    34: '27回戦',
    35: '28回戦',
    36: '29回戦',
    37: '30回戦',
    38: '準々決勝',
    6: '準決勝',
    7: '決勝',
    8: '3位決定戦',
    39: '4位決定戦',
    40: '5位決定戦',
    41: '6位決定戦',
    42: '7位決定戦',
    43: '8位決定戦',
}

  </script>
  
  <style scoped>
  .p-4 {
    max-width: 800px;
    margin: auto;
  }

  .team-card {
  width: 90%;
  background-color: #f8f9fa;
  border-radius: 12px;
  }

  /* Bootstrap 5 を使っていない場合のみ gap に対応 */
  .d-flex.gap-4 > * + * {
    margin-left: 1.5rem; /* gap-4 相当の24px */
  }
  </style>
  