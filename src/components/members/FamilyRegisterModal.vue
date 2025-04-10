// カタカナ→ひらがな変換
<template>
  <CModal v-model:visible="internalVisible" size="lg" @close="closeModal">
    <CModalHeader>
      <CModalTitle>家族登録</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <!-- 入力が変わるたびにサーバーへ問い合わせる（簡易 debounce 推奨） -->
      <CFormInput
        v-model="searchKeyword"
        type="text"
        placeholder="氏名で検索（例：山田）"
        class="mb-3"
      />

      <div v-if="filteredMembers.length === 0">該当する会員が見つかりません。</div>
      <div v-for="member in filteredMembers" :key="member.member_id" class="mb-2 border-bottom pb-2">
        <CFormCheck :label="`${member.username_sei} ${member.username_mei}`" v-model="member.selected" />
        <CFormSelect v-model="member.relationship" :disabled="!member.selected">
          <option value="">続柄を選択</option>
          <option value="1">父</option>
          <option value="2">母</option>
          <option value="3">兄</option>
          <option value="4">姉</option>
          <option value="5">弟</option>
          <option value="6">妹</option>
          <option value="7">子</option>
          <option value="8">親戚</option>
          <option value="9">その他</option>
        </CFormSelect>
      </div>
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="closeModal">キャンセル</CButton>
      <CButton color="primary" @click="registerFamilies">登録</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CButton, CFormCheck, CFormSelect, CFormInput
} from '@coreui/vue'

// props
const props = defineProps({
  visible: Boolean,
  memberId: Number,
})

// emit
const emit = defineEmits(['close', 'success'])
const internalVisible = ref(false)

watch(() => props.visible, (val) => {
  internalVisible.value = val
})

const closeModal = () => {
  internalVisible.value = false
  emit('close')
}

// 会員データと検索キーワード
const members = ref([])
const searchKeyword = ref('')
let debounceTimer = null

// 検索（カタカナ→ひらがな用）
const toHiragana = (str) => {
  return str.normalize('NFKC').replace(/[\u30a1-\u30f6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  )
}

// 検索時にAPIから取得
const searchMembers = async () => {
  const keywordRaw = searchKeyword.value.trim()
  const keyword = toHiragana(keywordRaw)
  if (!keyword) {
    members.value = []
    return
  }
  // 検索ワードをサーバーに送信（URL例：/api/members/search?keyword=武田）
  try {
  const res = await axios.get('http://127.0.0.1:8000/api/members/search', {
    params: { keyword },
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    withCredentials: true
  })

  members.value = res.data.data.map(m => ({
    ...m,
    selected: false,
    relationship: ''
  }))
  } catch (error) {
      console.error('検索エラー:', error)
    }
}

// 🔄 入力監視して、0.5秒後に検索実行
watch(searchKeyword, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchMembers()
  }, 500)
})

// 検索結果をそのまま使用
const filteredMembers = computed(() => members.value)

// 家族登録
const registerFamilies = async () => {
  const selected = members.value.filter(m => m.selected && m.relationship)
  for (const m of selected) {
    await axios.post('http://127.0.0.1:8000/api/families', {
      member_id: props.memberId,
      family_id: m.member_id,
      relationship: m.relationship
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })

    // 逆方向（兄→弟 だけでなく 弟→兄）
    await axios.post('http://127.0.0.1:8000/api/families', {
      member_id: m.member_id,
      family_id: props.memberId,
      relationship: getReverseRelation(m.relationship)
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      withCredentials: true
    })
  }
  emit('success')
  closeModal()
}
  // 続柄逆変換
  const getReverseRelation = (relation) => {
    const map = {
      1: 7, // 父⇔子
      2: 7, // 母⇔子
      3: 5, // 兄→弟
      4: 6, // 姉→妹
      5: 3, // 弟→兄
      6: 4, // 妹→姉
      7: 7  // その他→その他
  }
  return map[relation] || 7
}

</script>