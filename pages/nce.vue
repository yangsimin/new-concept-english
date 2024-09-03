<script setup lang="ts">
import type { Lesson, Sentence } from '~/types/lesson'
import { HOST, storageKeyLastLesson, storageKeyListenMode } from '~/constants'

const route = useRoute()
const router = useRouter()

const bookId = ref(1)
const lessonId = ref(1001)
const lessonIdList = ref<number[]>([])
const currentLesson = ref<Lesson | undefined>()

const isListeningMode = useLocalStorage(storageKeyListenMode, true)

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
      <UTooltip :text="isListeningMode ? '翻译模式' : '听力模式'">
        <UButton :icon="isListeningMode ? 'material-symbols:edit-outline' : 'material-symbols:headphones-outline-rounded'" @click="() => isListeningMode = !isListeningMode" />
      </UTooltip>
      <LessonMenu
        :current-lesson-id="lessonId"
        :lesson-id-list="lessonIdList"
        @select-lesson-id="selectLesson($event)"
      >
        <UTooltip text="课程目录">
          <UButton icon="material-symbols:menu-book-outline" />
        </UTooltip>
      </LessonMenu>
    </header>
    <main v-if="currentLesson" class="mt-8">
      <LessonListeningMode
        v-if="isListeningMode"
        :current-lesson="currentLesson"
        @next-lesson="stepLesson(1)"
        @prev-lesson="stepLesson(-1)"
      />
      <LessonWritingMode
        v-else
        :key="currentLesson.id"
        :current-lesson="currentLesson"
        @next-lesson="stepLesson(1)"
        @prev-lesson="stepLesson(-1)"
      />
    </main>
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
