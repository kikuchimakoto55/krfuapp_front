<template>
  <CContainer>

    <CTable hover bordered responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>会員ID</CTableHeaderCell>
          <CTableHeaderCell>役職種別</CTableHeaderCell>
          <CTableHeaderCell>登録日</CTableHeaderCell>
          <CTableHeaderCell>更新日</CTableHeaderCell>
          <CTableHeaderCell class="text-center">操作</CTableHeaderCell>
        </CTableRow>
      </CTableHead>

      <CTableBody>
        <!-- 1会員 = 複数役職行。ID/日付は縦結合で中央に表示 -->
        <template v-for="row in rows" :key="row.member_id">
          <!-- 先頭行 -->
          <CTableRow>
            <CTableDataCell :rowspan="row._lineCount" class="align-middle text-center">
              {{ row.member_id }}
            </CTableDataCell>

            <CTableDataCell>
              {{ roleTypeLabel[row.first?.type] }}
            </CTableDataCell>

            <CTableDataCell :rowspan="row._lineCount" class="align-middle text-center">
              {{ row.reg_min }}
            </CTableDataCell>
            <CTableDataCell :rowspan="row._lineCount" class="align-middle text-center">
              {{ row.upd_max }}
            </CTableDataCell>

            <CTableDataCell class="text-center">
              <CButton size="sm" color="primary" variant="outline"
                       @click="openEdit(row.first?.coach_id)" :disabled="!row.first?.coach_id">
                編集
              </CButton>
              <CButton size="sm" color="danger" style="color: white;"  class="ms-2"
                       @click="confirmDelete(row.first?.coach_id)" :disabled="!row.first?.coach_id">
                削除
              </CButton>
            </CTableDataCell>
          </CTableRow>

          <!-- 2行目以降（役職のみ + 操作） -->
          <CTableRow v-for="(extra, i) in row.rest" :key="`${row.member_id}-extra-${i}`">
            <CTableDataCell>
              {{ roleTypeLabel[extra.type] }}
            </CTableDataCell>
            <CTableDataCell class="text-center">
              <CButton size="sm" color="primary" variant="outline" @click="openEdit(extra.coach_id)">
                編集
              </CButton>
              <CButton size="sm" color="danger" style="color: white;" class="ms-2" @click="confirmDelete(extra.coach_id)">
                削除
              </CButton>
            </CTableDataCell>
          </CTableRow>
        </template>
      </CTableBody>
    </CTable>

    <!-- 編集モーダル -->
    <CModal :visible="edit.visible" @close="closeEdit">
      <CModalHeader>
        <CModalTitle>役職情報の編集</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-3">
          <label class="form-label">会員ID</label>
          <input class="form-control" type="text" v-model="edit.form.member_id" disabled>
        </div>
        <div class="mb-3">
          <label class="form-label">役職種別</label>
          <input class="form-control" type="text" :value="roleTypeLabel[edit.form.role_type]" disabled>
        </div>
        <div class="mb-3">
          <label class="form-label">役職名称</label>
          <input class="form-control" type="text" :value="edit.form.role_kindsname" disabled>
        </div>
        <div class="mb-3">
          <label class="form-label">レフリー会員番号（任意）</label>
          <input class="form-control" type="number" v-model.number="edit.form.referee_id" />
        </div>
        <div class="mb-3">
          <label class="form-label">備考</label>
          <textarea class="form-control" rows="3" v-model="edit.form.remarks"></textarea>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="outline" @click="closeEdit">閉じる</CButton>
        <CButton color="primary" @click="submitEdit" :disabled="edit.saving">
          {{ edit.saving ? '保存中...' : '保存' }}
        </CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const rows = ref([])

const roleTypeLabel = {
  1: '指導員役職',
  2: '委員会',
  3: '協会担当',
}

// 一覧取得→member_id ごとに集約（各役職行に coach_id を持たせる）
async function fetchList () {
  const res = await axios.get('http://localhost:8000/api/coaches', { withCredentials: true })
  const list = Array.isArray(res.data) ? res.data : []

  // member_id ごとにグルーピングし、役職行の配列を作る（表示順は 1→2→3）
  const grouped = new Map()
  for (const r of list) {
    if (r.del_flg === 1) continue // 念のため除外（API側もdel_flg=0で返している想定）
    const key = r.member_id
    if (!grouped.has(key)) {
      grouped.set(key, {
        member_id: key,
        lines: [], // {coach_id, type}
        reg_min: r.registration_date ?? null,
        upd_max: r.update_date ?? null,
      })
    }
    const g = grouped.get(key)
    g.lines.push({ coach_id: r.coach_id, type: r.role_type })

    // 登録日=最古、更新日=最新
    if (!g.reg_min || (r.registration_date && r.registration_date < g.reg_min)) {
      g.reg_min = r.registration_date
    }
    if (!g.upd_max || (r.update_date && r.update_date > g.upd_max)) {
      g.upd_max = r.update_date
    }
  }

  // type順に並べ、rowspan用の first/rest に分割
  rows.value = Array.from(grouped.values()).map(g => {
    const sorted = g.lines.sort((a, b) => a.type - b.type)
    return {
      member_id: g.member_id,
      reg_min: g.reg_min,
      upd_max: g.upd_max,
      first: sorted[0] ?? null,
      rest: sorted.slice(1),
      _lineCount: Math.max(sorted.length, 1),
    }
  })
}

onMounted(fetchList)

// ===== 編集モーダル関連 =====
const edit = ref({
  visible: false,
  saving: false,
  form: {
    coach_id: null,
    member_id: null,
    role_type: null,
    role_kinds_id: null,
    role_kindsname: '',
    remarks: '',
    referee_id: null,
  }
})

function closeEdit () {
  edit.value.visible = false
  edit.value.form = {
    coach_id: null,
    member_id: null,
    role_type: null,
    role_kinds_id: null,
    role_kindsname: '',
    remarks: '',
    referee_id: null,
  }
}

async function openEdit (coachId) {
  if (!coachId) return
  // 単一取得で既存値をロード
  const res = await axios.get(`http://localhost:8000/api/coaches/${coachId}`, { withCredentials: true })
  const d = res.data
  edit.value.form = {
    coach_id: d.coach_id,
    member_id: d.member_id,
    role_type: d.role_type,
    role_kinds_id: d.role_kinds_id,
    role_kindsname: d.role_kindsname,
    remarks: d.remarks ?? '',
    referee_id: d.referee_id ?? null,
  }
  edit.value.visible = true
}

async function submitEdit () {
  edit.value.saving = true
  try {
    const id = edit.value.form.coach_id
    await axios.put(`http://localhost:8000/api/coaches/${id}`, {
      remarks: edit.value.form.remarks,
      referee_id: edit.value.form.referee_id,
      // role_kinds_id を差し替える要件が出たらここに追加
    }, { withCredentials: true })

    edit.value.saving = false
    edit.value.visible = false
    await fetchList() // 再読込
  } catch (e) {
    edit.value.saving = false
    // 必要ならトースト等に差し替え
    alert('更新に失敗しました')
  }
}

// ===== 削除 =====
async function confirmDelete (coachId) {
  if (!coachId) return
  if (!confirm('この役職を削除します。よろしいですか？')) return
  try {
    await axios.delete(`http://localhost:8000/api/coaches/${coachId}`, { withCredentials: true })
    await fetchList()
  } catch (e) {
    alert('削除に失敗しました')
  }
}
</script>
