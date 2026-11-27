<template>
  <footer class="vault-footer">
    <div class="vault-footer-inner">
      <div>
        <strong>杭州民俗数字档案馆</strong><br />
        <address class="vault-address">地址：杭州市西湖区…唔，湖好像干了　｜　开放时间：周二至周日 9:00—17:00，初五除外</address>
        <br />
        本馆为公益性数字文化展示平台。个别卷宗调阅后，可能影响馆藏数量。
      </div>
      <nav aria-label="页脚导航">
        数字化项目：近代商号账簿第 <b class="vault-broken">一</b> 批（编号 HZ-1927 系列）　<br />
        <span class="vault-dead-link">数据校正与勘误公告</span>　 <span class="vault-dead-link">调阅指引</span>　
        <span class="vault-dead-link">首页已无法访问</span><br />
        <span class="vault-faint">浙公网安备 3301████████ ｜ 浙ICP备████████号-2　<Glitch :n="8" /></span>
      </nav>
    </div>
    <div class="vault-footer-inner vault-viewopt">
      <label class="scare-toggle">
        <input type="checkbox" :checked="game.state.strongScare" @change="toggle" />
        <span>强惊吓画面</span>
        <em>{{ game.state.strongScare ? '已开 · 含突脸与血屏' : '已关 · 仅保留文字与线索' }}</em>
      </label>

      <div class="vault-wipe">
        <button class="wipe-btn" type="button" @click="askWipe">
          {{ confirming ? '再点一次，确认清除' : '清除记忆' }}
        </button>
        <em class="wipe-note">{{ wipeNote }}</em>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Glitch from './Glitch.vue'
import game from '../stores/game'

const router = useRouter()

function toggle(e) {
  game.setStrongScare(e.target.checked)
}

// 清除记忆：删掉这台设备上的全部记录，从 A 面重来。
// 刷新页面做不到这件事——进度在 localStorage，不是缓存。
const confirming = ref(false)
const wipeNote = ref('删除本机全部调阅记录（画面偏好保留）')
let timer = null

function askWipe() {
  if (!confirming.value) {
    confirming.value = true
    wipeNote.value = '进度、结局、消息都会消失，且不可恢复'
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      confirming.value = false
      wipeNote.value = '删除本机全部调阅记录（画面偏好保留）'
    }, 6000)
    return
  }
  if (timer) clearTimeout(timer)
  game.clearMemory()
  confirming.value = false
  wipeNote.value = '已清除。请重新从馆藏目录开始。'
  router.push('/')
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
.vault-footer {
  margin-top: auto;
  background: #120a06;
  color: #8f7a54;
  border-top: 1px solid rgba(157, 40, 26, 0.3);
  padding: 26px 28px 20px;
  font-size: 13px;
  line-height: 1.9;
}
.vault-footer-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
}
.vault-footer a {
  color: #bd9c68;
  text-decoration: none;
}
.vault-footer a:hover {
  text-decoration: underline;
}
.vault-address {
  display: inline;
  font-style: normal;
  color: #7a674a;
}
.vault-broken {
  color: #d13424;
  font-weight: 600;
}
.vault-dead-link {
  text-decoration: line-through;
  color: #5c4a34;
}
.vault-faint {
  color: #4c3d2b;
  font-size: 12px;
}

.vault-viewopt {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed rgba(157, 40, 26, 0.22);
}
.scare-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #9a8262;
  font-size: 12.5px;
  letter-spacing: 0.06em;
}
.scare-toggle input {
  width: 15px;
  height: 15px;
  accent-color: #a8291c;
  cursor: pointer;
}
.scare-toggle em {
  font-style: normal;
  color: #6d5a40;
}
.scare-toggle input:focus-visible {
  outline: 2px solid #d13424;
  outline-offset: 2px;
}

/* ---------- 清除记忆 ---------- */
.vault-wipe {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.wipe-btn {
  background: transparent;
  border: 1px solid rgba(157, 40, 26, 0.45);
  color: #9a8262;
  font-family: inherit;
  font-size: 12.5px;
  letter-spacing: 0.08em;
  padding: 5px 12px;
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}
.wipe-btn:hover {
  color: #d13424;
  border-color: #d13424;
}
.wipe-note {
  font-style: normal;
  color: #6d5a40;
  font-size: 12px;
}
</style>
