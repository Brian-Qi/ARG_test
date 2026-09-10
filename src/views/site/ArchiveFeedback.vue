<template>
  <div class="svc-page">
    <nav class="svc-crumb" aria-label="面包屑">
      <RouterLink to="/">首页</RouterLink>
      <span class="crumb-sep">›</span>
      <span aria-current="page">意见建议</span>
    </nav>

    <template v-if="!submitted">
      <h1 class="svc-title">意见建议</h1>
      <p class="svc-lead">您对馆藏著录、公开内容或使用体验的任何疑问与建议，欢迎在此留言。我们会在核实后处理，并视情况以邮件方式回复。</p>

      <form class="svc-form" @submit.prevent="submit">
        <div class="svc-field">
          <label class="svc-label" for="fb-kind">类型<span class="req">*</span></label>
          <select id="fb-kind" v-model="form.kind" class="svc-select" :class="{ invalid: errors.kind }">
            <option value="" disabled>请选择</option>
            <option v-for="k in kinds" :key="k" :value="k">{{ k }}</option>
          </select>
          <p v-if="errors.kind" class="svc-error">{{ errors.kind }}</p>
        </div>

        <div class="svc-field">
          <label class="svc-label" for="fb-content">内容<span class="req">*</span></label>
          <textarea id="fb-content" v-model="form.content" class="svc-textarea" :class="{ invalid: errors.content }" placeholder="请描述您的建议或疑问（10—200 字）"></textarea>
          <p v-if="errors.content" class="svc-error">{{ errors.content }}</p>
        </div>

        <div class="svc-field">
          <label class="svc-label">联系方式</label>
          <input v-model="form.contact" class="svc-input" type="text" placeholder="选填，便于我们回复（邮箱或电话）" />
        </div>

        <div class="svc-footer">
          <button class="btn-flat" type="submit">提交建议</button>
          <span class="svc-note">您的反馈将由馆长审阅，不做公开。</span>
        </div>
      </form>
    </template>

    <div v-else class="svc-done">
      <h2>已收到</h2>
      <p>您的意见我们已经收到。感谢您帮助完善这座数字档案馆。</p>
      <RouterLink class="back-link" to="/">← 返回首页</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const kinds = ['内容质疑', '使用不适', '建议完善', '其他']
const submitted = ref(false)
const form = reactive({ kind: '', content: '', contact: '' })
const errors = reactive({ kind: '', content: '' })

function submit() {
  let ok = true
  if (!form.kind) { errors.kind = '请选择类型。'; ok = false } else errors.kind = ''
  const c = form.content.trim()
  if (c.length < 10) { errors.content = '请至少填写 10 字。'; ok = false } else errors.content = ''
  if (!ok) return
  submitted.value = true
}
</script>
