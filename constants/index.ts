export const appName = 'New Concept English Learning App'
export const appDescription = 'New Concept English Learning App'
export const storageKeySoundEnable = 'nce-sound-enable'
export const storageKeyLessonMode = 'nce-lesson-mode'
export const storageKeyLastLesson = 'nce-last-lesson'
export const storageKeyAiPrompt = 'nce-ai-prompt'
export const storageKeyChoice = 'nce-choice'
export const storageKeyChoicePage = 'nce-choice-page'
export const HOST = 'http://139.159.153.45:3004'

export const defaultPrompt = `你扮演一位资深的雅思培训老师，请看下面三段文字：

    1. {zh}
    2. {en}
    3. {input}

  第一句,是新概念教材的中文原文。
  第二句,是新概念教材的英语原文。
  第三句,是我所翻译的英文。

  请做一下几件事
  1. 丝毫不修改地重复这三句话
  2. 请仔细认真对比我的翻译和新概念的原文，以你觉得合适的颗粒度，不宜过粗或者过细，重点比较介词、连词、短语、时态等。以表格的形式输出差异点。
  3. 对差异点逐一讲解，新概念的表达为什么比我的翻译更好，为什么我这边用是错误的，为什么新概念的用法是更好到，并对知识点进行扩展。
  4. 以雅思7.5分的标准，给出你认为更好更地道的英文表达方式。
  5. 请确保你的回答准确无误，不要乱说，不确定的请不要说，否则将受到惩罚。`
