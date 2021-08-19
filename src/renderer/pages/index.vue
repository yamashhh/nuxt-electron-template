<template>
  <div class="index-container">
    <test-component />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TestComponent from '../components/TestComponent.vue'

export default Vue.extend({ components: { TestComponent } })
</script>

<style lang="scss" scoped>
@import 'assets/scss/app';

.index-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: pink;
}
</style>
