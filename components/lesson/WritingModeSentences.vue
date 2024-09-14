<script setup lang="ts">
import * as Diff from 'diff'
import { defaultPrompt, storageKeyAiPrompt } from '~/constants'
import type { Sentence, SentenceInfo } from '~/types/lesson'

const emits = defineEmits<{
  (e: 'markClick', value: { sentence: Sentence, isMarked: boolean }): void
}>()
const formData = defineModel<SentenceInfo[]>({ default: [] })
const keyFnMap: Record<string, { name: string, fn: () => void }> = {
  'v': {
    name: '隐藏答案',
    fn: () => {
      setAllVisible(false)
    },
  },
  'z': {
    name: '重置',
    fn: clear,
  },
  'enter': {
    name: '提交',
    fn: () => { },
  },
  'shift+enter': {
    name: '提交全部',
    fn: submit,
  },
  'Tab': {
    name: '下一句',
    fn: () => {
      setTimeout(() => {
        const activeEl = window.document.activeElement
        if (!activeEl) {
          return
        }
        const { y } = activeEl.getBoundingClientRect()
        if (y > window.innerHeight * 0.4) {
          window.scrollBy({
            top: y - window.innerHeight / 4,
          })
        }
      })
    },
  },
  'j': {
    name: '下移',
    fn: throttle(() => {
      window.scrollBy({
        top: 300,
      })
    }, 200),
  },
  'k': {
    name: '上移',
    fn: throttle(() => {
      window.scrollBy({
        top: -300,
      })
    }, 200),
  },
}

const { copySentencePrompt } = usePromptIcon()
const { playSound, pauseSound } = useSound()

onUnmounted(() => {
  pauseSound()
})

function submitSingle(i: SentenceInfo) {
  // FIXME: 解决重复问题，需要加上索引判断
  formData.value = formData.value.map((item) => {
    if (i.sentence.zh === item.sentence.zh) {
      item.diffChanges = checkResult(item)
      item.isAnswerVisible = true
    }
    return item
  })
  playSound(i)
}

function submit() {
  formData.value = formData.value.map((item) => {
    item.diffChanges = checkResult(item)
    return item
  })
  setAllVisible(true)
}

function clearSingle(i: SentenceInfo) {
  formData.value = formData.value.map((item) => {
    if (i.sentence.zh === item.sentence.zh) {
      item.inputText = ''
      item.diffChanges = []
      item.isAnswerVisible = false
    }
    return item
  })
}

function clear() {
  setAllVisible(false)
  formData.value = formData.value.map((item) => {
    item.inputText = ''
    item.diffChanges = []
    item.isAnswerVisible = false
    return item
  })
}

function setAllVisible(visible: boolean) {
  formData.value = formData.value.map((item) => {
    item.isAnswerVisible = visible
    return item
  })
}

function checkResult(item: SentenceInfo): Diff.Change[] {
  return Diff.diffWords(item.inputText.trim(), item.sentence.en.trim())
}

function usePromptIcon() {
  const { copy: copyToClipboard } = useClipboard({ legacy: true })
  const toast = useToast()
  async function copySentencePrompt({ sentence, inputText }: SentenceInfo) {
    let promptTemplate = useLocalStorage(storageKeyAiPrompt, defaultPrompt).value
    promptTemplate = promptTemplate.replace(/\{zh\}/g, sentence.zh)
    promptTemplate = promptTemplate.replace(/\{en\}/g, sentence.en)
    promptTemplate = promptTemplate.replace(/\{input\}/g, inputText)

    await copyToClipboard(promptTemplate)

    const url = 'https://tongyi.aliyun.com/qianwen/'

    const description = `已拷贝，请前往 <a
          href="${url}" target="_blank"
          style="text-decoration:underline; margin:0 4px;"
        >《通义千问》</a>提问
    `
    toast.add({
      title: 'Success',
      description,
      color: 'green',
    })
  }

  return {
    copySentencePrompt,
  }
}

function useSound() {
  const { playAudio, pauseAudio, updateSource } = useAudio()

  function playSound(i: SentenceInfo) {
    const [book, lesson] = [getBookIdFromLessonId(i.sentence.lessonId), getLessonIndexFromLessonId(i.sentence.lessonId)]
    updateSource(getAudioUrl(book, lesson))
    playAudio(i.sentence.startAt, i.sentence.stopAt)
  }

  return {
    playSound,
    pauseSound: pauseAudio,
  }
}

function handleMarkClick(info: SentenceInfo) {
  info.isMarked = !info.isMarked
  emits('markClick', { sentence: info.sentence, isMarked: info.isMarked })
}

defineExpose({
  keyFnMap,
})
</script>

<template>
  <article class="flex flex-col mx-auto min-w-[36rem] w-full gap-4 text-base">
    <div v-for="(eachItem, index) of formData" :key="eachItem.sentence.startAt">
      <div class="flex items-center justify-between">
        <slot name="index" :index="index" :sentence-info="eachItem">
          <span class="mr-2">{{ index + 1 }}.</span>
        </slot>
        <div class="mr-auto">
          {{ eachItem.sentence.zh }}
        </div>
        <div class="mx-2 flex items-center">
          <UTooltip text="清除文本" :shortcuts="['ctrl', 'r']">
            <UButton icon="i-heroicons-trash" tabindex="-1" @click="clearSingle(eachItem)" />
          </UTooltip>
          <UTooltip text="播放语音" :shortcuts="['ctrl', 's']">
            <UButton icon="i-heroicons-speaker-wave" tabindex="-1" @click="playSound(eachItem)" />
          </UTooltip>
          <UTooltip text="加入精选" :shortcuts="['ctrl', 'm']">
            <UButton :icon="eachItem.isMarked ? 'i-heroicons-star-solid' : 'i-heroicons-star'" :color="eachItem.isMarked ? 'primary' : 'gray'" tabindex="-1" @click="handleMarkClick(eachItem)" />
          </UTooltip>
          <UTooltip text="复制提示词" :shortcuts="['ctrl', 'p']">
            <UButton icon="heroicons:chat-bubble-left-right" tabindex="-1" @click="copySentencePrompt(eachItem)" />
          </UTooltip>
        </div>
      </div>
      <div
        class="border-b-[2px]
        border-b-[rgb(var(--color-gray-200))]
        dark:border-b-[rgb(var(--color-gray-400))]
        focus-within:border-b-[rgb(var(--color-primary-500))]
        dark:focus-within:border-b-[rgb(var(--color-primary-400))]
        transition-colors"
      >
        <UInput
          v-model="eachItem.inputText"
          type="text"
          size="xl"
          style="padding: 0; padding-left: 0.25rem;"
          variant="none"
          tabindex="1"
          class="caret-[rgb(var(--color-primary-500))]"
          @keydown.enter.exact.prevent="submitSingle(eachItem)"
          @keydown.tab="keyFnMap.Tab.fn"
          @keydown.stop.exact
          @keydown.enter.shift.prevent="keyFnMap['shift+enter'].fn"
          @keydown.esc.exact="($event.target as HTMLElement).blur()"
          @keydown.r.ctrl="clearSingle(eachItem)"
          @keydown.m.ctrl="handleMarkClick(eachItem)"
          @keydown.p.ctrl="copySentencePrompt(eachItem)"
          @keydown.s.ctrl="playSound(eachItem)"
        />
      </div>
      <div class="pl-1 pr-20" :class="[eachItem.isAnswerVisible ? 'opacity-100' : 'opacity-0'] ">
        <p v-if="!eachItem.diffChanges?.length">
          {{ eachItem.sentence.en }}
        </p>
        <p v-else>
          <span
            v-for="(change, i) in eachItem.diffChanges" :key="i"
            :class="{ 'text-green-500': !change.removed, 'text-red-500': change.added }"
          >
            {{ change.removed ? '' : change.value }}
          </span>
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.custom-caret-color {
  caret-color: rgb(var(--color-primary-500));
  caret-shape: bar;
}
</style>
