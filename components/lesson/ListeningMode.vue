<script setup lang="ts">
import type { Lesson, Sentence } from '~/types/lesson'
import { storageKeySoundEnable } from '~/constants'

const props = defineProps<{
  currentLesson: Lesson
}>()
const emits = defineEmits(['nextLesson', 'prevLesson'])
const { currentLesson } = toRefs(props)

const sentenceIndex = ref(0)
const currentSentence = ref<Sentence | undefined>()

const isSoundEnable = useLocalStorage(storageKeySoundEnable, true)
const isEnTextHidden = ref(true)
const { audioInstance, playAudio, pauseAudio, updateSource } = useAudio()

const keyFnMap: Record<string, { name: string, fn: () => void }> = {
  h: {
    name: '上一课',
    fn: () => { emits('prevLesson') },
  },
  j: {
    name: '下一步',
    fn: () => { onClickNextStep() },
  },
  k: {
    name: '上一句',
    fn: () => { onClickPrevSentence() },
  },
  l: {
    name: '下一课',
    fn: () => { emits('nextLesson') },
  },
  m: {
    name: '静音切换',
    fn: () => { isSoundEnable.value = !isSoundEnable.value },
  },
}

onUnmounted(() => {
  pauseAudio()
})

watchEffect(() => {
  currentSentence.value = currentLesson.value.sentences[sentenceIndex.value]
  isEnTextHidden.value = true
  pauseAudio()
})

watchEffect(() => {
  audioInstance.muted = !isSoundEnable.value
})

watchEffect(() => {
  if (!currentLesson.value) {
    return
  }

  sentenceIndex.value = 0
  isEnTextHidden.value = true
  updateSource(currentLesson.value.audioUrl)
})

function onClickPrevSentence() {
  if (sentenceIndex.value > 0) {
    sentenceIndex.value--
  }
}

function onClickNextStep() {
  if (isEnTextHidden.value) {
    isEnTextHidden.value = false
    if (isSoundEnable.value) {
      playAudio(Number(currentSentence.value!.startAt), Number(currentSentence.value!.stopAt))
    }
    return
  }
  if (sentenceIndex.value < currentLesson.value.sentences.length - 1) {
    sentenceIndex.value++
  }
}
</script>

<template>
  <UContainer class="flex flex-col items-center justify-between h-full py-8">
    <article v-if="currentSentence" class="flex-1 flex flex-col items-center justify-center gap-10 text-4xl lt-sm:gap-6 lt-sm:text-lg w-full">
      <p class="relative flex items-center w-full justify-center">
        {{ currentSentence.zh }}
        <UButton
          :icon="isSoundEnable ? 'i-heroicons-speaker-wave' : 'i-heroicons-speaker-x-mark'"
          size="xl"
          @click="isSoundEnable = !isSoundEnable"
        />
      </p>
      <p class="flex flex-wrap justify-center gap-2 w-full">
        <span
          v-for="(piece, index) in currentSentence.en.trim().split(/\s/)"
          :key="index"
          class="border-b-4 border-primary py-1"
        >
          <span :class="{ 'opacity-0': isEnTextHidden }" class="px-2">{{ piece }}</span>
        </span>
      </p>
    </article>
    <UContainer class="w-full max-w-md mt-16">
      <div class="grid grid-cols-2 grid-rows-2 gap-4">
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          block
          :disabled="sentenceIndex === 0"
          @click="onClickPrevSentence"
        >
          <UIcon name="i-heroicons-arrow-up" class="mr-1" />
          上一句
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          block
          :disabled="sentenceIndex === currentLesson!.sentences.length - 1 && !isEnTextHidden"
          @click="onClickNextStep"
        >
          <UIcon name="i-heroicons-arrow-down" class="mr-1" />
          下一步
        </UButton>
        <UButton
          color="gray"
          variant="soft"
          size="lg"
          block
          @click="emits('prevLesson')"
        >
          <UIcon name="i-heroicons-arrow-left" class="mr-1" />
          上一课
        </UButton>
        <UButton
          color="gray"
          variant="soft"
          size="lg"
          block
          @click="emits('nextLesson')"
        >
          下一课
          <UIcon name="i-heroicons-arrow-right" class="ml-1" />
        </UButton>
      </div>
    </UContainer>
  </UContainer>
</template>
