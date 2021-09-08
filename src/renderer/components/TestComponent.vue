<template>
  <div class="test-component">
    <h1 class="title">This is a test component.</h1>
    <nuxt-link to="/tutorial">INTERNAL LINK</nuxt-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {},
})
</script>
