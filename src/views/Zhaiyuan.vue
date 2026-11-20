<template>
  <div class="zhaiyuan">
    <p class="zy-lead">宅子是座四合院。五个孩子不是同时死的，也死在不同的方位。把五条病亡录，摆进它该死的那一方。</p>

    <div class="zy-plan" aria-label="四合院平面">
      <button
        v-for="p in PLACES"
        :key="p.id"
        type="button"
        class="zy-zone"
        :class="[`zy-${p.id}`, { filled: !!assigned[p.id], ok: solved }]"
        @click="placeHere(p.id)"
      >
        <span class="zy-zone-name">{{ p.name }}</span>
        <span v-if="assigned[p.id]" class="zy-zone-child">{{ childOf(assigned[p.id]) }}</span>
        <span v-else class="zy-zone-empty">空</span>
      </button>
    </div>

    <div class="zy-cards">
      <button v-for="d in unplaced" :key="d.id" type="button" class="zy-card" :class="{ sel: selected === d.id }" @click="selected = d.id">
        <b>{{ d.child }}</b>
        <span class="zy-defect">{{ d.defect }}</span>
        <span class="zy-symptom">殁前：{{ d.symptom }}</span>
      </button>
      <p v-if="!unplaced.length" class="zy-done-hint">五条都已归位。</p>
    </div>

    <p v-if="msg" class="zy-msg" :class="{ ok: solved }">{{ msg }}</p>

    <ul v-if="solved" class="zy-traces">
      <li v-for="p in PLACES" :key="p.id">
        <b>{{ p.name }}</b
        >（{{ p.wuxing }} · {{ p.organ }} · {{ p.god }}）：{{ p.trace }}
      </li>
    </ul>

    <!-- 归名：五方归位之后才谈得上把名字写回去。写的是正名，不是平时喊的。 -->
    <section v-if="solved" class="zy-names">
      <h3 class="zy-names-title">归名</h3>
      <p class="zy-names-lead">
        账上五个零，要落回五个名字。名字不在账里，在这些人的纸上；纸上写的是正名，不是平时喊的那个。
      </p>
      <div v-for="p in PLACES" :key="'n-' + p.id" class="zy-name-row">
        <span class="zy-name-place">{{ p.name }}</span>
        <input
          v-model="inputs[p.id]"
          class="zy-name-input"
          type="text"
          maxlength="6"
          :disabled="!canWrite(p.id) || !!done[p.id]"
          :placeholder="canWrite(p.id) ? '写下正名' : '凭据不足'"
          :aria-label="p.name + ' 归名'"
          @keyup.enter="submit(p.id)"
        />
        <span class="zy-name-state">{{ done[p.id] ? '已归名' : '' }}</span>
      </div>
      <p v-if="nameMsg" class="zy-msg" :class="{ ok: namesSolved }">{{ nameMsg }}</p>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import game from '../stores/game'
import { familyUnlocked } from '../stores/archive-notify'
import { PLACES, DEATHS } from '../data/courtyard'

const assigned = reactive({}) // { placeId: deathId }
const selected = ref(null)
const msg = ref('')
const solved = ref(false)
const wrongCount = ref(0) // 「摆满但错」的次数；反复试错到阈值 = 走捷径

const unplaced = computed(() => DEATHS.filter((d) => !Object.values(assigned).includes(d.id)))
function childOf(deathId) {
  const d = DEATHS.find((x) => x.id === deathId)
  return d ? d.child : ''
}

function placeHere(placeId) {
  if (solved.value) return
  if (assigned[placeId] && !selected.value) {
    // 点已占位、又没选卡 → 取出
    delete assigned[placeId]
    msg.value = ''
    return
  }
  if (!selected.value) {
    msg.value = '先在下面选一条病亡录。'
    return
  }
  assigned[placeId] = selected.value
  selected.value = null
  check()
}

function check() {
  const all = PLACES.every((p) => {
    const d = DEATHS.find((x) => x.id === assigned[p.id])
    return d && d.place === p.id
  })
  if (all) {
    solved.value = true
    game.state.zhaiyuanSolved = true
    game.markBranch('zhaiyuan')
    game.collectKey('zhenxiang')
    msg.value = '五方归位：东木、南火、西金、北水、中土。不是五场病，是一场按方位布下的局。'
  } else if (unplaced.value.length === 0) {
    wrongCount.value += 1
    if (wrongCount.value === 6) game.takeShortcut() // 反复试错到阈值 = 走捷径
    msg.value =
      wrongCount.value >= 6
        ? '五条都摆上了，仍有一处对不上。以六根定脏、以脏定五行，方位自明。'
        : '五条都摆上了，可有一处对不上——再想想各是哪一行、哪一方。'
  } else {
    msg.value = ''
  }
}

/* ---------------- 归名 ---------------- */
const inputs = reactive({})
const done = reactive({})
const nameMsg = ref('')
const namesSolved = ref(game.state.namesSolved)

const deathOf = (placeId) => DEATHS.find((d) => d.place === placeId)

// 落笔的门槛：证明这一位是谁的那张纸，必须已经读过。
// 西厢没有口头记录，只能靠 A 面族谱——那里有她的正名。
function canWrite(placeId) {
  const d = deathOf(placeId)
  if (!d) return false
  if (placeId === 'west') return familyUnlocked()
  return !!d.clueId && game.hasRead(d.clueId)
}

// 抄录只认字，不认空格与全角。
function normalize(s) {
  return String(s || '')
    .replace(/\s+/g, '')
    .replace(/[\uFF01-\uFF5E]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
}

function submit(placeId) {
  if (namesSolved.value || done[placeId]) return
  const d = deathOf(placeId)
  if (!d) return
  if (!canWrite(placeId)) {
    nameMsg.value = '这一格还不该落笔。'
    return
  }
  if (normalize(inputs[placeId]) === d.name) {
    done[placeId] = true
    inputs[placeId] = d.name
    nameMsg.value = ''
    if (PLACES.every((p) => done[p.id])) {
      namesSolved.value = true
      game.state.namesSolved = true
      nameMsg.value = '五方归名。账上的零，开始有主。'
    }
    return
  }
  nameMsg.value = '抄错了。纸上不是这么写的。'
}
</script>

<style scoped>
.zhaiyuan {
  max-width: 720px;
}
.zy-lead {
  color: #b09a72;
}
.zy-plan {
  display: grid;
  grid-template-areas:
    '. north .'
    'west center east'
    '. south .';
  grid-template-columns: 1fr 1.2fr 1fr;
  grid-template-rows: repeat(3, 96px);
  gap: 8px;
  margin: 18px 0;
  background: rgba(10, 7, 4, 0.6);
  border: 1px solid rgba(157, 40, 26, 0.4);
  padding: 10px;
}
.zy-north {
  grid-area: north;
}
.zy-south {
  grid-area: south;
}
.zy-west {
  grid-area: west;
}
.zy-east {
  grid-area: east;
}
.zy-center {
  grid-area: center;
}
.zy-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #120b08;
  border: 1px solid rgba(157, 40, 26, 0.45);
  color: #b09a72;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}
.zy-zone:hover {
  border-color: #d13424;
  background: rgba(168, 41, 28, 0.12);
}
.zy-zone.filled {
  border-color: rgba(209, 52, 36, 0.8);
  background: rgba(168, 41, 28, 0.16);
}
.zy-zone.ok {
  border-color: #d13424;
  box-shadow: inset 0 0 20px rgba(209, 52, 36, 0.2);
}
.zy-zone-name {
  font-size: 0.78rem;
  letter-spacing: 0.3em;
  color: #9c7c55;
}
.zy-zone-child {
  font-family: var(--kai);
  font-size: 1.05rem;
  color: #e3cf9f;
}
.zy-zone-empty {
  font-size: 0.8rem;
  color: #5c4a34;
}
.zy-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}
.zy-card {
  flex: 1 1 150px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  background: #16100a;
  border: 1px solid rgba(157, 40, 26, 0.45);
  color: #c8b18a;
  padding: 10px 12px;
  cursor: pointer;
  font-family: inherit;
}
.zy-card:hover {
  border-color: #d13424;
}
.zy-card.sel {
  border-color: #f0c884;
  box-shadow: 0 0 16px rgba(240, 200, 132, 0.25);
}
.zy-card b {
  color: #e3cf9f;
}
.zy-defect {
  font-size: 0.78rem;
  color: #9c7c55;
  letter-spacing: 0.1em;
}
.zy-symptom {
  font-size: 0.82rem;
  color: #b09a72;
}
.zy-done-hint {
  color: #8a6f4d;
  font-size: 0.85rem;
}
.zy-msg {
  margin-top: 14px;
  color: #d8c394;
  font-size: 0.9rem;
  line-height: 1.8;
}
.zy-msg.ok {
  color: #e8b49a;
}
.zy-traces {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
}
.zy-traces li {
  border-top: 1px dashed rgba(138, 111, 77, 0.3);
  padding: 9px 2px;
  color: #b09a72;
  font-size: 0.86rem;
  line-height: 1.7;
}
.zy-traces b {
  color: #e3cf9f;
  margin-right: 4px;
}

/* ---------- 归名 ---------- */
.zy-names {
  margin-top: 26px;
  border-top: 1px solid rgba(157, 40, 26, 0.4);
  padding-top: 18px;
}
.zy-names-title {
  font-family: var(--kai);
  font-size: 1.15rem;
  letter-spacing: 0.4em;
  color: #e3cf9f;
  margin: 0 0 8px;
}
.zy-names-lead {
  color: #9c7c55;
  font-size: 0.86rem;
  line-height: 1.9;
  margin: 0 0 16px;
}
.zy-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px dashed rgba(138, 111, 77, 0.22);
}
.zy-name-place {
  flex: 0 0 4.2em;
  font-size: 0.82rem;
  letter-spacing: 0.2em;
  color: #9c7c55;
}
.zy-name-input {
  flex: 1 1 auto;
  max-width: 12em;
  background: #120b08;
  border: 1px solid rgba(157, 40, 26, 0.4);
  color: #e3cf9f;
  font-family: var(--kai);
  font-size: 1rem;
  letter-spacing: 0.2em;
  padding: 6px 10px;
}
.zy-name-input:focus {
  outline: none;
  border-color: #d13424;
}
.zy-name-input:disabled {
  color: #6b5a44;
  border-color: rgba(138, 111, 77, 0.25);
  background: rgba(18, 11, 8, 0.5);
}
.zy-name-state {
  flex: 0 0 4em;
  font-size: 0.76rem;
  color: #d13424;
  letter-spacing: 0.16em;
}
</style>
