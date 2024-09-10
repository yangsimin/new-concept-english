<script setup lang="ts">
import type { Sentence } from '~/types/lesson'

const props = defineProps<{
  sentences: Sentence[]
}>()

const emit = defineEmits(['nextLesson'])

const typedText = ref(props.sentences.map(() => ''))
const currentSentenceIndex = ref(0)
const { isCompletedDialogOpen, openCompletedDialog, closeCompletedDialog } = useCompletedDialog()

watchEffect(() => {
  if (!props.sentences) { return }

  typedText.value = props.sentences.map(() => '')
  currentSentenceIndex.value = 0
  closeCompletedDialog()
})

useEventListener('keydown', handleKeyPress)

function handleKeyPress(event: KeyboardEvent) {
  if (isCompletedDialogOpen.value) { return }

  event.preventDefault() // 防止空格键滚动页面
  const currentSentence = props.sentences[currentSentenceIndex.value]
  const currentTyped = typedText.value[currentSentenceIndex.value]

  if (event.key === 'Backspace') {
    typedText.value[currentSentenceIndex.value] = currentTyped.slice(0, -1)
  }
  else if (event.key.length === 1) {
    const expectedChar = currentSentence.en[currentTyped.length]
    if (isInputCorrect(event.key, expectedChar)) {
      typedText.value[currentSentenceIndex.value] += event.key

      // 检查是否需要移动到下一句
      if (currentTyped.length + 1 >= currentSentence.en.length) {
        moveToNextSentence()
      }
    }
    // 如果输入错误，不做任何操作
  }
}

// 检查输入是否正确，忽略大小写
function isInputCorrect(key: string, expected: string) {
  return key.toLowerCase() === expected.toLowerCase()
}

function moveToNextSentence() {
  if (currentSentenceIndex.value < props.sentences.length - 1) {
    currentSentenceIndex.value++
  }
  else {
    openCompletedDialog()
  }
}

function restartTyping() {
  typedText.value = props.sentences.map(() => '')
  currentSentenceIndex.value = 0
  closeCompletedDialog()
}

function goToNextLesson() {
  emit('nextLesson')
  closeCompletedDialog()
}

function useCompletedDialog() {
  const isCompletedDialogOpen = ref(false)
  const openCompletedDialog = () => { isCompletedDialogOpen.value = true }
  const closeCompletedDialog = () => { isCompletedDialogOpen.value = false }

  return {
    isCompletedDialogOpen,
    openCompletedDialog,
    closeCompletedDialog,
  }
}
</script>

<template>
  <div class="flex flex-col gap-8 text-base font-mono my-8">
    <div v-for="(sentence, index) in sentences" :key="index">
      <p>{{ sentence.zh }}</p>
      <div class="whitespace-pre-wrap relative">
        <span
          v-for="(char, charIndex) in sentence.en"
          :key="charIndex"
          :class="{
            'text-[rgb(var(--color-primary-500))]': charIndex < typedText[index].length,
            'text-black/15 dark:text-white/20': charIndex >= typedText[index].length,
          }"
          class="transition-colors duration-100"
        >{{ char }}</span>
        <span
          v-if="index === currentSentenceIndex && !isCompletedDialogOpen"
          class="absolute top-0 w-0.5 h-5 bg-[rgb(var(--color-primary-500))] animate-blink"
          :style="{ left: `${typedText[index].length * 0.6}em` }"
        />
      </div>
    </div>

    <UModal v-model="isCompletedDialogOpen">
      <UCard>
        <template #header>
          <div class="text-xl font-bold">
            恭喜完成！
          </div>
        </template>
        <p>您已经完成了所有句子的输入。接下来您想要：</p>
        <template #footer>
          <div class="flex justify-end gap-4">
            <UButton @click="restartTyping">
              重新开始
            </UButton>
            <UButton color="primary" tabindex="1" @click="goToNextLesson">
              下一课
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animate-blink {
  animation: blink 1s infinite;
}
</style>
