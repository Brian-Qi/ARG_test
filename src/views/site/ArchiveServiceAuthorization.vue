<template>
  <div class="svc-page">
    <nav class="svc-crumb" aria-label="面包屑">
      <RouterLink to="/">首页</RouterLink>
      <span class="crumb-sep">›</span>
      <span aria-current="page">资料授权申请</span>
    </nav>

    <template v-if="!submitted">
      <h1 class="svc-title">资料授权申请</h1>
      <p class="svc-lead">本馆数字资源以公益开放为原则。涉及第三方版权、尚未全文公开，或拟作商业使用的馆藏，请先提交使用授权申请，由工作人员评估后可告知使用范围与方式。</p>

      <form class="svc-form" @submit.prevent="submit">
        <div class="svc-field">
          <label class="svc-label" for="svc-use-type">申请用途<span class="req">*</span></label>
          <select id="svc-use-type" v-model="form.useType" class="svc-select" :class="{ invalid: errors.useType }" @change="clearUseType">
            <option value="" disabled>请选择</option>
            <option value="学术研究">学术研究</option>
            <option value="教育公开">教育公开</option>
            <option value="展览陈列">展览陈列</option>
            <option value="商业使用">商业使用</option>
            <option value="个人参考">个人参考</option>
          </select>
          <p v-if="errors.useType" class="svc-error">{{ errors.useType }}</p>
        </div>

        <div class="svc-field">
          <label class="svc-label" for="svc-title">拟使用馆藏<span class="req">*</span></label>
          <input id="svc-title" v-model="form.title" class="svc-input" :class="{ invalid: errors.title }" type="text" placeholder="馆藏号或题名" />
          <p v-if="errors.title" class="svc-error">{{ errors.title }}</p>
          <p class="svc-note">可填写公开目录中的馆藏号；若未找到对应馆藏，请提供题名与大致年代。</p>
        </div>

        <div class="svc-field">
          <label class="svc-label" for="svc-scope">拟使用范围</label>
          <textarea id="svc-scope" v-model="form.scope" class="svc-textarea" placeholder="简述拟使用的内容范围、篇幅或用途"></textarea>
        </div>

        <div class="svc-field">
          <label class="svc-label" for="svc-org">所在单位/机构</label>
          <input id="svc-org" v-model="form.org" class="svc-input" type="text" placeholder="选填，如学校、研究机构或企业" />
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
          <button class="btn-flat" type="submit">提交申请</button>
          <span class="svc-note">提交后我们将评估资源权属，并以邮件告知可用性与使用范围。</span>
        </div>
      </form>
    </template>

    <div v-else class="svc-done">
      <h2>申请已登记</h2>
      <p>我们已收到您的使用授权申请。工作人员将核对馆藏权属与拟用范围，评估结果会通过您留下的联系方式反馈。</p>
      <p>如需调整或补充材料，请再次提交或与我们联系。</p>
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
import { push } from '../../stores/archive-notify'

const submitted = ref(false)
const showAlert = ref(false)
const alertMsg = ref('')
const form = reactive({
  useType: '',
  title: '',
  scope: '',
  org: '',
  contactKind: '',
  contact: ''
})

const errors = reactive({ useType: '', title: '', contact: '' })

function clearUseType() { errors.useType = '' }
function clearContact() { form.contact = ''; errors.contact = '' }
function clearContactError() { errors.contact = '' }

function isValidContact(kind, v) {
  v = (v || '').trim()
  if (!v) return false
  if (kind === '电话') return /^1\d{10}$/.test(v)
  if (kind === '邮箱') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  return false
}

function validate() {
  let ok = true
  if (!form.useType) { errors.useType = '请选择申请用途。'; ok = false } else errors.useType = ''
  if (!form.title || form.title.trim().length < 2) { errors.title = '请填写馆藏号或题名。'; ok = false } else errors.title = ''
  if (!form.contactKind) { errors.contact = '请选择联系方式类型。'; ok = false }
  else if (!isValidContact(form.contactKind, form.contact)) {
    errors.contact = form.contactKind === '电话' ? '请输入正确手机号。' : '请输入有效的邮箱地址。'
    ok = false
  } else errors.contact = ''
  return ok
}

function submit() {
  if (!validate()) {
    const firstErr = errors.useType || errors.title || errors.contact
    alertMsg.value = firstErr
    showAlert.value = true
    return
  }
  const title = form.title.trim()
  const isShen = /沈晚|HZ-1927-0512/i.test(title)
  if (isShen) {
    push({
      type: 'shen',
      title: '资料授权申请 · 特殊审核',
      body: '沈晚？你想查账？账本不是你翻的。去，叫你大人来。没大人来，就回你的那五张签去。',
      familyAvailable: true
    })
  } else {
    push({
      type: 'normal',
      title: '资料授权申请 · 已受理',
      body: '您提交的资料授权申请已登记，工作人员将核对权属与拟用范围，评估结果将通过您留下的联系方式反馈。'
    })
  }
  submitted.value = true
}
</script>

<style scoped>
.svc-contact-kind {
  margin-bottom: 8px;
}
.svc-error {
  color: #8c2f24;
  font-size: 12px;
  margin: 6px 0 0;
}
.svc-alert-actions {
  margin-top: 18px;
}
.svc-input.invalid,
.svc-select.invalid {
  border-color: #8c2f24;
}
</style>
