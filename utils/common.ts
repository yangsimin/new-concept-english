export function throttle(fn: (...args: any[]) => any, delay: number) {
  let timer: NodeJS.Timeout | undefined

  return function (...args: any[]) {
    if (timer) {
      return
    }
    fn.apply(this, args)
    timer = setTimeout(() => {
      timer = undefined
    }, delay)
  }
}

export function getLocalStorageJson<T>(key: string, defaultValue: any = undefined): T {
  if (!localStorage[key]) {
    return defaultValue as T
  }
  return JSON.parse(localStorage[key]) as T
}

export function setLocalStorageJson(key: string, value: any) {
  if (value === undefined || value === null) {
    localStorage[key] = ''
    return
  }
  localStorage[key] = JSON.stringify(value)
}

export function downloadJson(data: string | object) {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 在Firefox中可能有效，在Chrome中可能无法正常工作，需要保留这一行，因为不立即释放URL可能会导致内存泄露
  URL.revokeObjectURL(url)
}

export function getAudioUrl(book: number, lesson: number) {
  // TODO: 替换音频路径
  // https://static.aienglish.com/static2/newconcept/1_1.mp3
  // return `${HOST}/book${bookId}/${lessonId}.mp3`
  return `https://static.aienglish.com/static2/newconcept/${book}_${lesson}.mp3`
}

export function getBookIdFromLessonId(lessonId: number) {
  return Math.floor(lessonId / 1000)
}

export function getLessonIndexFromLessonId(lessonId: number) {
  return lessonId % 1000
}
