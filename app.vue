<script setup lang="ts">
import { appName } from '~/constants'
import '~/assets/main.css'

useHead({
  title: appName,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications :ui="{ strategy: 'override', position: 'top-0 right-0' }">
    <template #description="{ description }">
      <span v-html="description" />
    </template>
  </UNotifications>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.3rem);
}
</style>
