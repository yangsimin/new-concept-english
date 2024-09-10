<script setup lang="ts">
const props = defineProps<{
  lessonIdList: number[]
  currentLessonId: number
}>()
const emits = defineEmits(['selectLessonId'])

const { lessonIdList, currentLessonId } = toRefs(props)

const isMenuOpen = ref(false)

function onSelectLesson(id: number) {
  if (id !== currentLessonId.value) {
    emits('selectLessonId', id)
    isMenuOpen.value = false
  }
}
</script>

<template>
  <UPopover mode="hover" :popper="{ placement: 'top-end' }">
    <template #default>
      <slot />
    </template>
    <template #panel>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }" class="max-w-[560px] w-[90vw]">
        <template #header>
          <h3 class="text-center text-lg font-bold">
            选择课程
          </h3>
        </template>
        <div class="grid w-full grid-cols-[repeat(auto-fill,minmax(2.5rem,1fr))] grid-rows-[repeat(auto-fill,minmax(2.5rem,1fr))] place-items-center gap-2 overflow-y-auto p-4">
          <UButton
            v-for="id in lessonIdList"
            :key="id"
            :color="id === currentLessonId ? 'primary' : 'gray'"
            class="flex h-10 w-10 items-center justify-center p-0"
            @click="onSelectLesson(id)"
          >
            {{ id % 1000 }}
          </UButton>
        </div>
      </UCard>
    </template>
  </UPopover>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
