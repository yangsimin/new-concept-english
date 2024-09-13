<script setup lang="ts">

</script>

<template>
  <header class="container h-[var(--header-height)] flex items-center justify-end gap-2 text-xl">
    <UButton
      color="primary"
      size="xl"
      class="mr-auto font-bold"
      @click="$router.push('/')"
    >
      New Concept English
    </UButton>

    <NuxtLink to="/choice">
      <UTooltip text="精选句子练习">
        <UButton icon="ph:list-star-duotone" />
      </UTooltip>
    </NuxtLink>

    <HeaderColorPicker />

    <HeaderDarkToggle />

    <UButton
      icon="simple-icons-github"
      to="https://github.com/yangsimin/new-concept-english-web-app"
      target="_blank"
      title="Github"
    />

    <HeaderCacheManager />

    <HeaderSettings />
  </header>
</template>
