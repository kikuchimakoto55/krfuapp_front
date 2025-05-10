<template>
    <div class="p-4">
      <CForm @submit.prevent="submit">
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>大会ID</CFormLabel>
            <CFormInput v-model="form.tournament_id" readonly />
          </CCol>
          <CCol md="6">
            <CFormLabel>ディビジョン</CFormLabel>
            <CFormInput type="text" :value="getDivisionLabel(form.division_order)" readonly />
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
            <CFormInput v-model="form.referee" placeholder="未設定" />
          </CCol>
          <CCol md="6">
            <CFormLabel>担当者</CFormLabel>
            <CFormInput v-model="form.manager" placeholder="未設定" />
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol md="6">
            <CFormLabel>ドクター</CFormLabel>
            <CFormInput v-model="form.doctor" placeholder="未設定" />
          </CCol>
        </CRow>


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

      </tbody>
    </table>

    <!-- スコアブック・レポートエリア -->
    <CRow class="mb-3">
      <CCol md="6">
        <CFormLabel>スコアブック（ファイル添付）</CFormLabel>
        <CFormInput type="file" @change="handleFileUpload" />
        <p v-if="form.scorebook_file_name">現在のファイル: {{ form.scorebook_file_name }}</p>
      </CCol>
    </CRow>

    <CRow class="mb-3">
      <CCol>
        <CFormLabel>ゲームレポート</CFormLabel>
        <CFormTextarea v-model="form.game_report" rows="5" placeholder="試合内容の詳細やコメントを入力してください" />
      </CCol>
    </CRow>

    <CRow class="mb-3">
      <CCol md="4">
        <CFormLabel>公開設定</CFormLabel>
        <CFormSelect v-model="form.publishing">
          <option value="0">公開</option>
          <option value="1">非公開</option>
        </CFormSelect>
      </CCol>
    </CRow>

              <!-- ⭐ フォームの最後にボタン -->
              <div class="mt-4 text-center">
          <CButton type="submit" color="primary">更新する</CButton>
          <CButton color="secondary" class="ms-4" @click="goBack">キャンセル</CButton>
        </div>
      </CForm>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import { roundOptions } from '../roundOptions'
  
  const route = useRoute()
  const router = useRouter()
  const gameId = route.params.id
  const venues = ref([])
  const teams = ref([])
  const tournament = ref({})
  const divisions = ref([])
  
  const shouldShowDivision = computed(() => {
  return Number(tournament.value?.divisionflg) === 1 && divisions.value.length > 0
})

const getDivisionLabel = (order) => {
  const division = divisions.value.find(d => d.order === Number(order));
  return division ? division.name : '-';
};

  const form = ref({
  // onMounted で上書きされる既存項目に加えて、
  game_report: '',
  publishing: '0', // ← 文字列で管理（後で数値化して送信）
  scorebook_file: null,
  scorebook_file_name: '', // 既存ファイル名表示用（編集前にAPI取得して反映する）
  });
  const handleFileUpload = (event) => {
    form.value.scorebook_file = event.target.files[0];
  };
  
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

onMounted(async () => {
  try {
    const gameResponse = await axios.get(`http://localhost:8000/api/games/${gameId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    });

    const data = gameResponse.data;

    form.value = {
      tournament_id: data.tournament_id,
      division_name: data.division_name,
      round_label: data.round_label,
      game_date: data.game_date ? new Date(data.game_date).toISOString().slice(0, 16) : '',
      venue_id: String(data.venue_id),
      team1_id: String(data.team1_id),
      team2_id: String(data.team2_id),
      referee: data.referee,
      manager: data.manager,
      doctor: data.doctor,
      game_report: data.game_report,
      publishing: data.publishing,
      scorebook_file_name: data.score?.scorebook_file_name || ''
    };

    score.value = {
      op1fh_t: data.score?.op1fh_t || 0,
      op1fh_g: data.score?.op1fh_g || 0,
      op1fh_pg: data.score?.op1fh_pg || 0,
      op1fh_dg: data.score?.op1fh_dg || 0,
      op1hh_t: data.score?.op1hh_t || 0,
      op1hh_g: data.score?.op1hh_g || 0,
      op1hh_pg: data.score?.op1hh_pg || 0,
      op1hh_dg: data.score?.op1hh_dg || 0,
      op2fh_t: data.score?.op2fh_t || 0,
      op2fh_g: data.score?.op2fh_g || 0,
      op2fh_pg: data.score?.op2fh_pg || 0,
      op2fh_dg: data.score?.op2fh_dg || 0,
      op2hh_t: data.score?.op2hh_t || 0,
      op2hh_g: data.score?.op2hh_g || 0,
      op2hh_pg: data.score?.op2hh_pg || 0,
      op2hh_dg: data.score?.op2hh_dg || 0,
      op1fh_score: data.score?.op1fh_score || 0,
      op1hh_score: data.score?.op1hh_score || 0,
      op2fh_score: data.score?.op2fh_score || 0,
      op2hh_score: data.score?.op2hh_score || 0,
      op1fh_pkscore: data.score?.op1fh_pkscore || 0,
      op1fh_fkscore: data.score?.op1fh_fkscore || 0,
      op1hh_pkscore: data.score?.op1hh_pkscore || 0,
      op1hh_fkscore: data.score?.op1hh_fkscore || 0,
      op2fh_pkscore: data.score?.op2fh_pkscore || 0,
      op2fh_fkscore: data.score?.op2fh_fkscore || 0,
      op2hh_pkscore: data.score?.op2hh_pkscore || 0,
      op2hh_fkscore: data.score?.op2hh_fkscore || 0,
      score_book: data.score?.score_book || '',
      gamereport: data.score?.gamereport || '',
      publishing: data.score?.publishing || 1
    };

    // 試合情報取得後
    const tournamentResponse = await axios.get(`http://localhost:8000/api/tournaments/${form.value.tournament_id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    });
    tournament.value = tournamentResponse.data;
    console.log('tournament.value:', tournament.value);
    console.log('取得した tournamentResponse:', tournament.value);

if (Number(tournament.value.divisionflg) === 1 && Array.isArray(tournament.value.divisions)) {
  divisions.value = tournament.value.divisions;
}

console.log('divisionflg:', tournament.value.divisionflg);
console.log('divisions.value:', divisions.value);

    // divisionflgが0ならディビジョン名をnullに
    if (tournament.value.divisionflg !== 1) {
      form.value.division_name = null;
    }
    console.log('divisions.value:', divisions.value);




	// 会場一覧を取得
    const venueResponse = await axios.get('http://localhost:8000/api/venues', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    });
    venues.value = venueResponse.data;

	// チーム一覧を取得
    const teamResponse = await axios.get('http://localhost:8000/api/teams', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    });
    teams.value = teamResponse.data;

  } catch (error) {
    console.error('試合情報の取得失敗:', error);
    alert('試合情報の取得に失敗しました');
  }
});


  
const submit = async () => {
  const formData = new FormData();

  formData.append('_method', 'PUT');
  formData.append('venue_id', Number(form.value.venue_id));
  formData.append('team1_id', Number(form.value.team1_id));
  formData.append('team2_id', Number(form.value.team2_id));
  formData.append('match_round', Number(form.value.round_label));
  formData.append('match_datetime', form.value.game_date || '');
  formData.append('referee', form.value.referee || '');
  formData.append('manager', form.value.manager || '');
  formData.append('doctor', form.value.doctor || '');
  formData.append('game_report', form.value.game_report || '');
  formData.append('publishing', Number(form.value.publishing));

  if (form.value.scorebook_file) {
    formData.append('scorebook', form.value.scorebook_file);
  }

  // ⭐ scoreオブジェクトを個別展開
  for (const [key, value] of Object.entries(score.value)) {
    formData.append(`score[${key}]`, value);
  }

  try {
    await axios.post(`http://localhost:8000/api/games/${gameId}`, formData, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
    });

    alert('試合情報を更新しました');
    router.push('/games');
  } catch (error) {
    console.error('試合情報の更新失敗:', error);
    alert('試合情報の更新に失敗しました');
  }
};

const goBack = () => {
  router.push('/games');
};

  const calcScore = () => {
  const calc = (t, g, pg, dg) => (t * 5) + (g * 2) + (pg * 3) + (dg * 3)

  score.value.op1fh_score = calc(score.value.op1fh_t, score.value.op1fh_g, score.value.op1fh_pg, score.value.op1fh_dg)
  score.value.op1hh_score = calc(score.value.op1hh_t, score.value.op1hh_g, score.value.op1hh_pg, score.value.op1hh_dg)

  score.value.op2fh_score = calc(score.value.op2fh_t, score.value.op2fh_g, score.value.op2fh_pg, score.value.op2fh_dg)
  score.value.op2hh_score = calc(score.value.op2hh_t, score.value.op2hh_g, score.value.op2hh_pg, score.value.op2hh_dg)
  };

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
  