<template>
  <Transition name="scare">
    <div v-if="game.state.scare" class="scare-overlay" :class="game.state.scare.type">
      <img class="scare-img" :src="faceSrc" alt="" width="1536" height="1024" />
      <p>{{ game.state.scare.text }}</p>
      <span class="scare-grain" aria-hidden="true"></span>
    </div>
  </Transition>
</template>

<script setup>
import game from '../stores/game'
// 绑定（非静态）src，避免构建期要求文件存在；图由出图批次生成
const faceSrc = '/img/scare_face.webp'
</script>
