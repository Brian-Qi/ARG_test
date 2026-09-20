<template>
  <div class="svc-page">
    <nav class="svc-crumb" aria-label="面包屑">
      <RouterLink to="/">首页</RouterLink>
      <span class="crumb-sep">›</span>
      <span aria-current="page">文书捐赠</span>
    </nav>

    <template v-if="!submitted">
      <h1 class="svc-title">文书捐赠</h1>
      <p class="svc-lead">
        为保存城市记忆、充实馆藏体系，本馆常年接受民间文书无偿捐赠与寄存。范围包括商号账簿与票据、契约文书、家谱族谱、书信日记、照片底片、证章地图等。
      </p>

      <form class="svc-form" @submit.prevent="submit">
        <div class="svc-field">
          <label class="svc-label" for="svc-doc-type">文书类型<span class="req">*</span></label>
          <select id="svc-doc-type" v-model="form.docType" class="svc-select" :class="{ invalid: errors.docType }">
            <option value="" disabled>请选择</option>
            <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
          </select>
          <p v-if="errors.docType" class="svc-error">{{ errors.docType }}</p>
        </div>

        <div class="svc-field">
          <label class="svc-label" for="svc-doc-desc">内容简述<span class="req">*</span></label>
          <textarea
            id="svc-doc-desc"
            v-model="form.desc"
            class="svc-textarea"
            :class="{ invalid: errors.desc }"
            placeholder="简述文书大致内容、年代与保存状况（10—200 字）"
          ></textarea>
          <p v-if="errors.desc" class="svc-error">{{ errors.desc }}</p>
        </div>

        <div class="svc-field">
          <label class="svc-label">意向方式</label>
          <div class="svc-radio-group">
            <label class="svc-radio"><input v-model="form.kind" type="radio" value="无偿捐赠" /> 无偿捐赠</label>
            <label class="svc-radio"><input v-model="form.kind" type="radio" value="寄存" /> 寄存</label>
          </div>
        </div>

        <div class="svc-field">
          <label class="svc-label">联系方式<span class="req">*</span></label>
          <div class="svc-radio-group svc-contact-kind">
            <label class="svc-radio"><input v-model="form.contactKind" type="radio" value="电话" @change="clearContact" /> 电话</label>
            <label class="svc-radio"><input v-model="form.contactKind" type="radio" value="邮箱" @change="clearContact" /> 邮箱</label>
          </div>
          <input
            v-if="form.contactKind === '电话'"
            v-model="form.contact"
            class="svc-input"
            :class="{ invalid: errors.contact }"
            type="tel"
            placeholder="请输入手机号"
            @input="clearContactError"
          />
          <input
            v-else-if="form.contactKind === '邮箱'"
            v-model="form.contact"
            class="svc-input"
            :class="{ invalid: errors.contact }"
            type="email"
            placeholder="请输入邮箱地址"
            @input="clearContactError"
          />
          <p v-if="errors.contact" class="svc-error">{{ errors.contact }}</p>
        </div>

        <div class="svc-footer">
          <button class="btn-flat" type="submit">提交意向</button>
          <span class="svc-note">待工作人员初步鉴定后，再与您约定捐赠与交接方式。</span>
        </div>
      </form>
    </template>

    <div v-else class="svc-done">
      <h2>捐赠意向已登记</h2>
      <p>感谢您对馆藏建设的支持。工作人员将对文书进行初步鉴定，并尽快与您联系，约定捐赠或寄存的具体方式。</p>
      <p>涉及商业机密的账簿，可按约定进行年限封存后公开。</p>
      <RouterLink class="back-link" to="/">← 返回首页</RouterLink>
    </div>

    <!-- 错误弹窗 -->
    <div v-if="showAlert" class="archive-modal-mask" @click.self="showAlert = false">
      <div class="archive-modal svc-alert">
        <h2>无法提交</h2>
        <p>{{ alertMsg }}</p>
        <div class="svc-alert-actions">
          <button class="btn-flat" type="button" @click="showAlert = false">知道了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const submitted = ref(false)
const showAlert = ref(false)
const alertMsg = ref('')
const types = ['商号账簿与票据', '契约文书', '家谱族谱', '书信日记', '照片底片', '证章地图', '其他']
const form = reactive({
  docType: '',
  desc: '',
  kind: '无偿捐赠',
  contactKind: '',
  contact: ''
})

const errors = reactive({ docType: '', desc: '', contact: '' })

function clearContact() {
  form.contact = ''
  errors.contact = ''
}
function clearContactError() {
  errors.contact = ''
}

function isValidContact(kind, v) {
  v = (v || '').trim()
  if (!v) return false
  if (kind === '电话') return /^1\d{10}$/.test(v)
  if (kind === '邮箱') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  return false
}

function validate() {
  let ok = true
  if (!form.docType) {
    errors.docType = '请选择文书类型。'
    ok = false
  } else errors.docType = ''
  const len = form.desc.trim().length
  if (len < 10 || len > 200) {
    errors.desc = '内容简述需在 10—200 字之间。'
    ok = false
  } else errors.desc = ''
  if (!form.contactKind) {
    errors.contact = '请选择联系方式类型。'
    ok = false
  } else if (!isValidContact(form.contactKind, form.contact)) {
    errors.contact = form.contactKind === '电话' ? '请输入正确手机号。' : '请输入有效的邮箱地址。'
    ok = false
  } else errors.contact = ''
  return ok
}

function submit() {
  if (!validate()) {
    alertMsg.value = errors.contact || errors.docType || errors.desc || '请完善表单信息。'
    showAlert.value = true
    return
  }
  submitted.value = true
}
</script>

<style scoped>
.svc-error {
  color: #8c2f24;
  font-size: 12px;
  margin: 6px 0 0;
}
.svc-input.invalid,
.svc-select.invalid,
.svc-textarea.invalid {
  border-color: #8c2f24;
}
.svc-contact-kind {
  margin-bottom: 8px;
}
.svc-alert-actions {
  margin-top: 18px;
}
</style>
