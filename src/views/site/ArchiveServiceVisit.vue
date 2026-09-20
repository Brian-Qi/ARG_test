<template>
  <div class="svc-page">
    <nav class="svc-crumb" aria-label="面包屑">
      <RouterLink to="/">首页</RouterLink>
      <span class="crumb-sep">›</span>
      <span aria-current="page">展览预约</span>
    </nav>

    <template v-if="!submitted">
      <h1 class="svc-title">展览预约</h1>
      <p class="svc-lead">本馆数字阅览室面向公众开放参观与查阅。请提前预约时间与人数，以便安排接待。线下开放时段以本馆公告为准。</p>

      <form class="svc-form" @submit.prevent="submit">
        <div class="svc-field">
          <label class="svc-label" for="svc-visit-date">预约日期<span class="req">*</span></label>
          <div class="svc-date">
            <select id="svc-visit-date" v-model="form.year" class="svc-select" :class="{ invalid: dateError }" @change="onYearChange">
              <option value="" disabled>年</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }} 年</option>
            </select>
            <select v-model="form.month" class="svc-select" :class="{ invalid: dateError }" @change="onMonthChange">
              <option value="">月</option>
              <option v-for="m in availMonths" :key="m" :value="m">{{ m }} 月</option>
            </select>
            <input
              v-model="form.day"
              class="svc-input svc-day-input"
              :class="{ invalid: dateError }"
              type="number"
              min="1"
              placeholder="日"
              @input="checkDate"
            />
          </div>
          <p v-if="dateError" class="svc-error">{{ dateError }}</p>
        </div>

        <div class="svc-field">
          <label class="svc-label" for="svc-visit-time">时段<span class="req">*</span></label>
          <select id="svc-visit-time" v-model="form.time" class="svc-select" :class="{ invalid: errors.time }">
            <option value="" disabled>请选择</option>
            <option value="上午 9:00—11:00">上午 9:00—11:00</option>
            <option value="下午 13:00—15:00">下午 13:00—15:00</option>
            <option value="下午 15:00—17:00">下午 15:00—17:00</option>
          </select>
          <p v-if="errors.time" class="svc-error">请选择预约时段。</p>
        </div>

        <div class="svc-field">
          <label class="svc-label" for="svc-visit-people">参观人数<span class="req">*</span></label>
          <input
            id="svc-visit-people"
            v-model="form.people"
            class="svc-input"
            :class="{ invalid: errors.people }"
            type="number"
            min="1"
            placeholder="请输入人数"
            @input="onPeople"
          />
          <p v-if="errors.people" class="svc-error">{{ errors.people }}</p>
        </div>

        <div class="svc-field">
          <label class="svc-label">参观形式</label>
          <div class="svc-radio-group">
            <label v-for="opt in forms" :key="opt" class="svc-radio">
              <input v-model="form.kind" type="radio" :value="opt" :disabled="!form.people || overLimit" />
              {{ opt }}
            </label>
          </div>
          <p class="svc-note">超过 20 人请选择特殊审批。</p>
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
            type="tel"
            placeholder="请输入手机号"
            @input="clearContactError"
          />
          <input
            v-else-if="form.contactKind === '邮箱'"
            v-model="form.contact"
            class="svc-input"
            type="email"
            placeholder="请输入邮箱地址"
            @input="clearContactError"
          />
          <p v-if="errors.contact" class="svc-error">{{ errors.contact }}</p>
        </div>

        <div class="svc-footer">
          <button class="btn-flat" type="submit">提交预约</button>
          <span class="svc-note">提交后请以场馆最终确认的时段为准。</span>
        </div>
      </form>
    </template>

    <div v-else class="svc-done">
      <h2>预约已登记</h2>
      <p>我们已收到您的参观预约申请。工作人员会与您确认具体时段与接待安排，请留意联系信息。</p>
      <p>到馆请携带有效证件，并遵守本馆开放规则。</p>
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

    <!-- 超过 20 人 弹窗 -->
    <div v-if="overLimit" class="archive-modal-mask" @click.self="closeOver">
      <div class="archive-modal svc-modal">
        <button class="modal-close" type="button" @click="closeOver">关闭</button>
        <h2>人数已超过限额</h2>
        <p>超过 20 人的团体参观需另行审批，请先提交特殊审批申请，我们将在核实接待能力后与您确认。</p>
        <div class="svc-modal-actions">
          <button class="btn-flat" type="button" @click="requestSpecial">提交特殊审批</button>
          <button class="btn-flat" type="button" @click="closeOver">调整人数</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const submitted = ref(false)
const overLimit = ref(false)
const showAlert = ref(false)
const alertMsg = ref('')
const now = new Date()
const todayY = now.getFullYear()
const todayM = now.getMonth() + 1
const todayD = now.getDate()
const years = [todayY, todayY + 1]

const form = reactive({
  year: '',
  month: '',
  day: '',
  time: '',
  people: '',
  kind: '',
  contactKind: '',
  contact: ''
})

const errors = reactive({ time: '', people: '', contact: '' })
const dateError = ref('')

const availMonths = computed(() => {
  const y = parseInt(form.year)
  if (!y) return []
  if (y > todayY) return Array.from({ length: 12 }, (_, i) => i + 1)
  return Array.from({ length: 12 - todayM + 1 }, (_, i) => todayM + i)
})

function maxDay() {
  if (!form.year || !form.month) return 31
  return new Date(parseInt(form.year), parseInt(form.month), 0).getDate()
}

function onYearChange() {
  // 切换年份后，若月/日不在可用范围，则重置
  if (form.year && !availMonths.value.includes(parseInt(form.month))) {
    form.month = ''
  }
  form.day = ''
  checkDate()
}

function onMonthChange() {
  form.day = ''
  checkDate()
}

function checkDate() {
  dateError.value = ''
  if (!form.year || !form.month || !form.day) return
  const y = parseInt(form.year)
  const m = parseInt(form.month)
  const d = parseInt(form.day)
  if (!Number.isInteger(d) || d < 1) {
    dateError.value = '请输入有效的日期。'
    return
  }
  let max = maxDay()
  if (d > max) {
    dateError.value = '请填写正确日期。'
    return
  }
  if (y === todayY && m === todayM && d < todayD) {
    dateError.value = '请选择今天的日期或之后的日期。'
    return
  }
  if (y === todayY && m < todayM) {
    dateError.value = '请选择今天或之后的月份。'
    return
  }
}

const forms = computed(() => {
  const n = parseInt(form.people)
  if (n === 1) return ['个人参观', '学术查阅']
  if (n > 1) return ['团体参观', '学术查阅']
  return []
})

function onPeople() {
  const n = parseInt(form.people)
  if (form.people && (n < 1 || isNaN(n))) {
    errors.people = '人数至少为 1。'
  } else if (n > 20) {
    errors.people = ''
    overLimit.value = true
  } else {
    errors.people = ''
    if (!forms.value.includes(form.kind)) form.kind = ''
    if (n === 1 && !['个人参观', '学术查阅'].includes(form.kind)) form.kind = '个人参观'
    if (n > 1 && !['团体参观', '学术查阅'].includes(form.kind)) form.kind = '团体参观'
  }
}

function requestSpecial() {
  form.kind = '特殊审批'
  overLimit.value = false
}

function closeOver() {
  overLimit.value = false
}

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
  checkDate()
  if (!form.year || !form.month || !form.day) {
    if (!dateError.value) dateError.value = '请选择预约日期。'
    ok = false
  } else if (dateError.value) {
    ok = false
  }
  if (!form.time) {
    errors.time = '请选择预约时段。'
    ok = false
  } else errors.time = ''
  const n = parseInt(form.people)
  if (!form.people || isNaN(n) || n < 1) {
    errors.people = '人数至少为 1。'
    ok = false
  } else if (n > 20) {
    errors.people = ''
    overLimit.value = true
    ok = false
  } else errors.people = ''
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
  const ok = validate()
  if (!ok) {
    if (overLimit.value) return
    alertMsg.value = errors.contact || errors.time || errors.people || dateError.value || '请完善表单信息。'
    showAlert.value = true
    return
  }
  submitted.value = true
}
</script>

<style scoped>
.svc-date {
  display: flex;
  gap: 10px;
}
.svc-date .svc-select,
.svc-date .svc-day-input {
  flex: 1 1 0;
  min-width: 0;
}
.svc-day-input {
  text-align: center;
}
.svc-contact-kind {
  margin-bottom: 8px;
}
.svc-error {
  color: #8c2f24;
  font-size: 12px;
  margin: 6px 0 0;
}
.svc-input.invalid,
.svc-select.invalid {
  border-color: #8c2f24;
}
.svc-modal-actions,
.svc-alert-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}
</style>
