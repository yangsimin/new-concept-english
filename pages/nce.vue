<script setup lang="ts">
import type { Lesson, Sentence } from '~/types/lesson'
import { HOST, storageKeyLastLesson, storageKeyLessonMode } from '~/constants'

const route = useRoute()
const router = useRouter()

const bookId = ref(1)
const lessonId = ref(1001)
const lessonIdList = ref<number[]>([])
const currentLesson = ref<Lesson | undefined>()
const { selectedMode, modeOptions, defaultModeIndex, onModeChange } = useMode()

watchEffect(async () => {
  if (!Array.isArray(route.query.book)) {
    bookId.value = Number(route.query.book)
  }
  else {
    bookId.value = 0
  }

  if (!Array.isArray(route.query.lessonId)) {
    lessonId.value = Number(route.query.lessonId)
  }
  else {
    lessonId.value = 0
  }
})

watchEffect(async () => {
  const lessonIds = await requestBook(bookId.value) ?? []
  if (bookId.value === 1) {
    lessonIdList.value = lessonIds.filter(id => id % 2)
  }
  else {
    lessonIdList.value = lessonIds
  }
})

watchEffect(async () => {
  if (!bookId.value || !lessonId.value) {
    return
  }

  if (lessonIdList.value.findIndex(id => id === lessonId.value) < 0) {
    return
  }

  currentLesson.value = await requestLesson(bookId.value, lessonId.value) ?? undefined
  updateCache()
})

function updateCache() {
  const cache = getLocalStorageJson<any>(storageKeyLastLesson, {})
  setLocalStorageJson(storageKeyLastLesson, {
    ...cache,
    [bookId.value]: lessonId.value,
  })
}

async function requestLesson(book: number, lessonId: number): Promise<Lesson | null> {
  const { data } = await useFetch('/api/nce/lesson', {
    query: { book, lessonId },
    transform: (lesson: any) => ({
      id: lessonId,
      titleEn: lesson.title.title,
      titleZh: lesson.title.title_cn,
      sentences: lesson.data.slice(1).map((s: any) => ({
        startAt: Number(s.Timing),
        stopAt: Number(s.EndTiming),
        en: s.Sentence,
        zh: s.Sentence_cn,
        lessonId,
        sentenceId: s.IdIndex,
      } satisfies Sentence)),
    } satisfies Lesson),
  })
  return data.value
}

async function requestBook(book: number): Promise<number[] | null> {
  const { data } = await useFetch('/api/nce/book', {
    query: { book },
    transform: (data: any[]) => (data.map(lesson => Number(lesson.voa_id))),
  })
  return data.value
}

function stepLesson(step: number) {
  const nextLessonIndex = lessonIdList.value.findIndex(id => id === lessonId.value) + step
  if (nextLessonIndex < 0 || nextLessonIndex > lessonIdList.value.length - 1) {
    return
  }

  selectLesson(lessonIdList.value[nextLessonIndex])
  window.scrollTo(0, 0)
}

function selectLesson(lessonId: number) {
  router.push({
    path: route.path,
    query: {
      book: bookId.value,
      lessonId,
    },
  })
}

function useMode() {
  const modeOptions = [
    { label: '听力模式', value: 'listening', icon: 'material-symbols:headphones-outline-rounded' },
    { label: '翻译模式', value: 'writing', icon: 'ri:translate' },
    { label: '打字模式', value: 'typing', icon: 'material-symbols:keyboard-outline' },
  ] as const

  // 从本地存储中获取上次使用的模式，如果没有则默认为'listening'
  const selectedMode = useLocalStorage<typeof modeOptions[number]['value']>(storageKeyLessonMode, 'typing')
  const defaultModeIndex = modeOptions.findIndex(mode => mode.value === selectedMode.value)

  const onModeChange = (modeIndex: number) => {
    selectedMode.value = modeOptions[modeIndex].value
  }

  return {
    selectedMode,
    modeOptions,
    defaultModeIndex,
    onModeChange,
  }
}
</script>

<template>
  <div class="flex flex-col box-border p-4">
    <header class="flex items-center justify-start lt-sm:text-xl text-2xl">
      <h4 class="flex mr-auto">
        <strong class="mr-4">{{ `${bookId}-${lessonId % 1000}` }}</strong>
        <div>
          <strong> {{ currentLesson?.titleEn }} </strong>
          <br> {{ currentLesson?.titleZh }}
        </div>
      </h4>

      <!-- 将选择器替换为标签组件 -->
      <UTabs
        :items="(modeOptions as any)"
        :model-value="defaultModeIndex"
        :ui="{
          list: {
            background: 'bg-[rgb(var(--color-primary-50))]',
            marker: { background: 'bg-[rgb(var(--color-primary-200))]' },
            tab: {
              icon: 'mr-0 scale-[1.2]',
              size: 'text-[0px]',
            },
          },
        }"
        :content="false"
        @update:model-value="onModeChange"
      />

      <LessonMenu
        :current-lesson-id="lessonId"
        :lesson-id-list="lessonIdList"
        @select-lesson-id="selectLesson($event)"
      >
        <UButton size="md" icon="material-symbols:menu-book-outline" class="ml-2" />
      </LessonMenu>
    </header>
    <section v-if="currentLesson" class="mt-8 w-screen ml-[50%] translate-x-[-50%] lg:px-8">
      <LessonListeningMode
        v-if="selectedMode === 'listening'"
        :current-lesson="currentLesson"
        @next-lesson="stepLesson(1)"
        @prev-lesson="stepLesson(-1)"
      />
      <LessonWritingMode
        v-else-if="selectedMode === 'writing'"
        :key="currentLesson.id"
        :current-lesson="currentLesson"
        @next-lesson="stepLesson(1)"
        @prev-lesson="stepLesson(-1)"
      />
      <LessonTypingMode
        v-else-if="selectedMode === 'typing'"
        :sentences="currentLesson.sentences"
        @next-lesson="stepLesson(1)"
      />
    </section>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
