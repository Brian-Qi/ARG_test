<template>
  <span class="glitch-text" aria-hidden="true">{{ text }}</span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { glitch } from '../utils/glitch'

const props = defineProps({ n: { type: Number, default: 6 } })
const text = ref('')
onMounted(() => { text.value = glitch(props.n) })
</script>

<style scoped>
.glitch-text {
  color: rgba(168, 41, 28, 0.7);
  letter-spacing: 0.12em;
  user-select: none;
}
</style>
