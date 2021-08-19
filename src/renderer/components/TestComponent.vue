<template>
  <div class="test-component">
    <h1 class="title">This is a test component.</h1>
    <nuxt-link to="/tutorial">INTERNAL LINK</nuxt-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss" scoped>
@import 'assets/scss/app';

.test-component {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > .title {
    font-size: 5rem;
    line-height: 1.5;
  }
}
</style>
