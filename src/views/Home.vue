<template>
  <div>
    <!-- ログインユーザー情報 -->
<!-- v-if="user && user.value" のチェックあり -->
<CAlert v-if="user && user.username_sei">
  ログイン中：{{ user.username_sei }} さん（ID: {{ user.member_id }}）
</CAlert>


<!-- 学年別カード -->
<h5 class="mb-3 text-center">📚 学年別 在籍者数</h5>
<CRow class="mb-4">
  <CCol
    v-for="grade in gradeStats"
    :key="grade.grade_category"
    xs="6" sm="4" md="3" lg="2"
    class="mb-3"
  >
    <CCard class="text-center shadow-sm custom-card">
      <CCardBody class="py-1 px-2">
        <div class="fw-semibold text-secondary" style="font-size: 0.85rem;">
          {{ grade.grade_name }}
        </div>
        <div class="fw-bold text-dark" style="font-size: 1.2rem;">
          {{ grade.count }} 名
        </div>
      </CCardBody>
    </CCard>
  </CCol>
</CRow>


    <!-- 資格別カード -->
    <h5 class="mb-3">🎖️ 有効資格保有者数</h5>
    <CRow>
      <CCol
        v-for="license in licenseStats"
        :key="license.licensekindsname"
        sm="6"
        md="3"
        class="mb-3"
      >
        <CCard class="text-center border-success" style="min-height: 80px;">
          <CCardBody class="py-1 px-1">
            <h6 class="card-title mb-1" style="font-size: 0.95rem;">
              {{ license.licensekindsname }}
            </h6>
            <p class="fw-bold mb-0 text-success" style="font-size: 1.5rem;">
              {{ license.count }} 名
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/utils/axios'
import { gradeCategoryOptions } from '@/components/constants/labels.js'

// リアクティブ変数
const user = ref(null)
const gradeStats = ref([])
const licenseStats = ref([])

// ラベル表示用
const getGradeLabel = (category) => {
 return gradeCategoryOptions[category] || `学年 ${category}`
}

// データ取得
const fetchDashboardData = async () => {
  try {
    const [userRes, gradesRes, licensesRes] = await Promise.all([
      axios.get('http://localhost:8000/api/user', { withCredentials: true }),
      axios.get('http://localhost:8000/api/dashboard/grades', { withCredentials: true }),
      axios.get('http://localhost:8000/api/dashboard/licenses', { withCredentials: true })
    ])

    console.log(' userRes.data =', userRes.data)

    //  ここが肝心： userRes.data.user の場合もあるので分岐確認
    user.value = userRes.data
    gradeStats.value = gradesRes.data
    licenseStats.value = licensesRes.data
  } catch (error) {
    console.error('ダッシュボードデータ取得エラー:', error)
  }
}

onMounted(fetchDashboardData)
</script>

<style scoped>
.custom-card {
  padding: 1em;
}
</style>