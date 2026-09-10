<template>
  <Transition name="scare">
    <div v-if="game.state.scare" class="scare-overlay" :class="game.state.scare.type">
      <div class="scare-face"><span>●</span><span>●</span><i /></div>
      <p>{{ game.state.scare.text }}</p>
      <span class="scare-grain" aria-hidden="true"></span>
    </div>
  </Transition>
</template>

<script setup>
import game from '../stores/game'
</script>
