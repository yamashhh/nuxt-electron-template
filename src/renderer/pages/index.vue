<template>
  <div class="index-container">
    <test-component />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TestComponent from '@/components/TestComponent.vue'

export default defineComponent({
  components: { TestComponent },
})
</script>
