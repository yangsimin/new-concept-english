<script setup lang="ts">
import { storageKeyLastLesson } from '~/constants'

const router = useRouter()

function onBookClick(index: number) {
  const cache: Record<string, number> = getLocalStorageJson(storageKeyLastLesson, {})
  router.push({
    path: '/nce',
    query: {
      book: index,
      lessonId: cache[index] ?? index * 1000 + 1,
    },
  })
}
</script>

<template>
  <main
    class="h-full grid grid-cols-[repeat(2,10rem)] grid-rows-[repeat(2,10rem)] gap-6 place-content-center"
  >
    <UButton
      v-for="index in 4"
      :key="index"
      class="block text-[2rem]"
      variant="solid"
      color="primary"
      @click="onBookClick(index)"
    >
      {{ index }}
    </UButton>
  </main>
</template>
