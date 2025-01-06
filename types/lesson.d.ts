export interface Lesson {
  id: number
  titleEn: string
  titleZh: string
  sentences: Sentence[]
}

export interface Sentence {
  lessonId: number
  sentenceId: number
  startAt: number
  stopAt: number
  en: string
  zh: string
  index: number
}

export interface SentenceInfo {
  isAnswerVisible: boolean
  isMarked: boolean
  inputText: string
  sentence: Sentence
  diffChanges?: Diff.Change[]
}
