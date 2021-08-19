<template>
  <div class="index-container">
    <test-component />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TestComponent from '@/components/TestComponent.vue'

export default Vue.extend({ components: { TestComponent } })
</script>
