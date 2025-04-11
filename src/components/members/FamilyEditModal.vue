<template>
    <CModal :visible="visible" @close="handleClose">
      <CModalHeader>
        <CModalTitle>家族情報の編集</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p><strong>{{ family?.username_sei }} {{ family?.username_mei }}</strong> さんの続柄を選択してください：</p>
        <CFormSelect v-model="editedRelationship">
          <option value="">選択してください</option>
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
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="handleClose">閉じる</CButton>
        <CButton color="primary" @click="updateRelationship">更新</CButton>
      </CModalFooter>
    </CModal>
  </template>
  
  <script setup>
    import { ref, watch } from 'vue'
    import axios from 'axios'
    import { defineEmits } from 'vue'

  // props
  const props = defineProps({
    visible: Boolean,
    family: Object,
  })
  
  // emit
  const emit = defineEmits(['close', 'updated'])
  
  // 編集用ローカルデータ
  const editedRelationship = ref('')
  
  // props.family を監視して変更を反映
  watch(
    () => props.family,
    (newVal) => {
      editedRelationship.value = newVal?.relationship ? String(newVal.relationship) : ''
    },
    { immediate: true }
  )
  
  // モーダルを閉じる
  const handleClose = () => {
    emit('close')
  }
  
  // 更新処理
  const updateRelationship = async () => {
    console.log('🟡 updateRelationship 実行');
    if (!props.family?.id)  {
    console.error('?props.family.id が存在しません')
    return
    }
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/families/${props.family.id}`, {
        relationship: Number(editedRelationship.value),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      })
      console.log('🟢 続柄更新成功');
      emit('updated') // ← 親に通知（再取得の合図）
    } catch (err) {
      console.error('続柄の更新失敗', err)
      alert('更新に失敗しました')
    }
  }
  </script>
  