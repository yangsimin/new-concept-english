<script setup lang="ts">
import type { Sentence, SentenceInfo } from '~/types/lesson'
import type SentencesWriting from '~/components/lesson/WritingModeSentences.vue'
import { storageKeyChoice } from '~/constants'

const router = useRouter()
const sentencesWritingRef = ref<InstanceType<typeof SentencesWriting>>()
const markedSentences = useLocalStorage<SentenceInfo[]>(storageKeyChoice, [])
const { paginatedSentences, pagination, onPageChange } = usePagination()

updateCache()

function updateCache() {
  const latestMarkedSentences = queryMarkedSentences()
  markedSentences.value = latestMarkedSentences.sort((a, b) => {
    return (a.sentence.lessonId * 100 + Number(a.sentence.sentenceId))
      - (b.sentence.lessonId * 100 + Number(b.sentence.sentenceId))
  }).map((latestItem) => {
    const cacheItem = markedSentences.value.find((cacheItem) => {
      if (cacheItem.sentence.lessonId === latestItem.sentence.lessonId
        && cacheItem.sentence.sentenceId === latestItem.sentence.sentenceId) {
        return true
      }
      return false
    })
    return cacheItem || latestItem
  })
}

function queryMarkedSentences(): SentenceInfo[] {
  const lessonKeys = Object.keys(localStorage).filter(key => key.startsWith('nce-lessonId-'))
  return lessonKeys.map((key) => {
    const cache = getLocalStorageJson<any>(key)
    if (!cache) {
      return []
    }
    return cache.formData
      .filter((each: SentenceInfo) => each.isMarked)
      .map((each: SentenceInfo) => ({
        ...each,
        isAnswerVisible: false,
        isMarked: true,
        inputText: '',
      }))
  }).flat()
}

function onMarkClick({ sentence, isMarked }: { sentence: Sentence, isMarked: boolean }) {
  const storageKey = `nce-lessonId-${sentence.lessonId}`
  const cache = getLocalStorageJson<any>(storageKey)
  if (!cache) {
    return
  }
  const sentenceInfoList: SentenceInfo[] = cache.formData
  sentenceInfoList.forEach((info) => {
    if (info.sentence.sentenceId !== sentence.sentenceId) {
      return
    }
    info.isMarked = isMarked
  })
  setLocalStorageJson(storageKey, { formData: sentenceInfoList })
}

function usePagination() {
  const itemsPerPage = 20
  const currentPage = ref(1)

  const paginatedSentences = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return markedSentences.value.slice(start, end)
  })

  const pagination = computed(() => ({
    page: currentPage.value,
    totalItems: markedSentences.value.length,
    itemsPerPage,
  }))

  function onPageChange(page: number) {
    currentPage.value = page
  }

  return {
    paginatedSentences,
    pagination,
    onPageChange,
  }
}

function goBack() {
  if (router.options.history.state.back) {
    return router.back()
  }
  router.push('/')
}
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        精选句子练习
      </h1>
      <UButton icon="i-heroicons-arrow-left" label="返回" @click="goBack" />
    </div>
    <UCard class="my-8">
      <LessonWritingModeSentences
        v-if="markedSentences.length"
        ref="sentencesWritingRef"
        v-model="paginatedSentences"
        @mark-click="onMarkClick"
      >
        <template #index="{ sentenceInfo, index }">
          <span class="mr-2 whitespace-nowrap">
            {{ pagination.itemsPerPage * (pagination.page - 1) + 1 + index }}.
            <NuxtLink
              :to="`/nce/?book=${Math.floor(sentenceInfo.sentence.lessonId / 1000)}&lessonId=${sentenceInfo.sentence.lessonId}`"
              class="underline hover:text-primary-500"
            >
              [{{ Math.floor(sentenceInfo.sentence.lessonId / 1000) }}-{{ sentenceInfo.sentence.lessonId % 1000 }}]
            </NuxtLink>
          </span>
        </template>
      </LessonWritingModeSentences>
      <UAlert v-else icon="i-heroicons-information-circle" color="primary" variant="subtle" title="快去添加句子吧~" />
    </UCard>
    <UPagination
      :model-value="pagination.page"
      class="justify-center"
      :page-count="pagination.itemsPerPage"
      :total="pagination.totalItems"
      size="lg"
      :inactive-button="{ color: 'gray' }"
      :prev-button="{ color: 'gray' }"
      :next-button="{ color: 'gray' }"
      :max="12"
      @update:model-value="onPageChange($event)"
    />
    <template v-if="markedSentences.length && sentencesWritingRef">
      <div class="my-8">
        <div class="flex justify-center gap-2">
          <UButton class="w-32" block color="primary" variant="solid" @click="sentencesWritingRef.keyFnMap['shift+enter'].fn">
            <UIcon name="i-heroicons-check" class="mr-1" />
            提交
          </UButton>
          <UButton class="w-32" block variant="outline" @click="sentencesWritingRef.keyFnMap.v.fn">
            <UIcon name="i-heroicons-eye-slash" class="mr-1" />
            隐藏
          </UButton>
          <UButton class="w-32" block variant="outline" @click="sentencesWritingRef.keyFnMap.z.fn">
            <UIcon name="i-heroicons-arrow-path" class="mr-1" />
            重置
          </UButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>

</style>
