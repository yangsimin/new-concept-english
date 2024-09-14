<script setup lang="ts">
import type { Sentence } from '~/types/lesson'

const props = defineProps<{
  sentences: Sentence[]
}>()

const emit = defineEmits(['nextLesson'])

const typedText = ref<string[]>([])

const currentSentenceIndex = ref(0)
const { isCompletedDialogOpen, openCompletedDialog, closeCompletedDialog } = useCompletedDialog()
const sentenceRefs = ref<HTMLElement[]>([])
const hiddenSpanRef = ref<HTMLSpanElement | null>(null)

watch(() => props.sentences, () => {
  if (!props.sentences) { return }

  restartTyping()
}, { immediate: true })

useEventListener('keydown', handleKeyPress)

function handleKeyPress(event: KeyboardEvent) {
  if (isCompletedDialogOpen.value) { return }

  event.preventDefault() // 防止空格键滚动页面
  const currentSentence = props.sentences[currentSentenceIndex.value]
  const currentTyped = typedText.value[currentSentenceIndex.value]

  if (event.key === 'Backspace') {
    typedText.value[currentSentenceIndex.value] = currentTyped.slice(0, -1)
  }
  else if (event.key === 'Enter') {
    moveToNextSentence()
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
  }
}

// 检查输入是否正确，忽略大小写
function isInputCorrect(key: string, expected: string) {
  return key.toLowerCase() === expected.toLowerCase()
}

function moveToNextSentence() {
  if (currentSentenceIndex.value < props.sentences.length - 1) {
    currentSentenceIndex.value++
    nextTick(() => {
      scrollToCurrentSentence()
    })
  }
  else {
    openCompletedDialog()
  }
}

function scrollToCurrentSentence() {
  const currentSentenceElement = sentenceRefs.value[currentSentenceIndex.value]
  if (!currentSentenceElement) { return }

  const rect = currentSentenceElement.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const scrollThreshold = viewportHeight * 0.7 // 当句子在视口底部 70% 以下时滚动

  if (rect.bottom > scrollThreshold) {
    const scrollAmount = rect.top - viewportHeight * 0.3 // 滚动到视口 30% 的位置
    window.scrollBy({ top: scrollAmount, behavior: 'smooth' })
  }
}

function restartTyping() {
  typedText.value = props.sentences.map(() => '')
  currentSentenceIndex.value = 0
  closeCompletedDialog()
  nextTick(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
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

function handleSentenceClick(index: number) {
  currentSentenceIndex.value = index
  // 重置从点击的句子开始的所有输入
  typedText.value[currentSentenceIndex.value] = ''
  nextTick(() => {
    scrollToCurrentSentence()
  })
}

function calculateCursorPosition(index: number): number {
  if (!hiddenSpanRef.value) { return 0 }

  const currentTypedText = typedText.value[index] || ''
  hiddenSpanRef.value.textContent = currentTypedText
  return hiddenSpanRef.value.offsetWidth
}
</script>

<template>
  <UCard>
    <div class="flex flex-col gap-8 text-base font-mono">
      <div
        v-for="(sentence, index) in sentences"
        :key="index"
        :ref="el => { if (el) sentenceRefs[index] = el as HTMLElement }"
        class="cursor-pointer"
        @click="handleSentenceClick(index)"
      >
        <p>{{ sentence.zh }}</p>
        <div class="whitespace-pre-wrap relative">
          <span
            v-for="(char, charIndex) in sentence.en"
            :key="charIndex"
            :class="{
              'text-[rgb(var(--color-primary-500))]': charIndex < typedText[index].length,
              'text-black/20 dark:text-white/20': charIndex >= typedText[index].length,
            }"
            class="transition-colors duration-100"
          >{{ char }}</span>
          <span
            v-if="index === currentSentenceIndex && !isCompletedDialogOpen"
            class="absolute top-0 w-0.5 h-5 bg-[rgb(var(--color-primary-500))] animate-blink"
            :style="{ left: `${calculateCursorPosition(index)}px` }"
          />
        </div>
      </div>
      <!-- 添加一个隐藏的 span 用于计算文本宽度 -->
      <span
        ref="hiddenSpanRef"
        class="absolute opacity-0 pointer-events-none whitespace-pre"
        :style="{
          font: 'inherit',
          fontSize: 'inherit',
          lineHeight: 'inherit',
        }"
      />
    </div>
  </UCard>
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
          <UButton color="primary" tabindex="1" variant="solid" @click="goToNextLesson">
            下一课
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
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
