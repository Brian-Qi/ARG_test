<template>
  <span class="gf">{{ display }}</span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { glitch } from '../utils/glitch'

const props = defineProps({ text: { type: String, default: '' } })
const display = ref(props.text)
let timer = null
let hold = null

// 每隔几秒闪一下乱码，随即恢复
function loop() {
  timer = setTimeout(() => {
    display.value = glitch(Math.max(2, props.text.length))
    hold = setTimeout(() => {
      display.value = props.text
      loop()
    }, 140)
  }, 2600 + Math.random() * 5200)
}

onMounted(loop)
onBeforeUnmount(() => {
  clearTimeout(timer)
  clearTimeout(hold)
})
</script>

<style scoped>
.gf { letter-spacing: inherit; }
</style>
