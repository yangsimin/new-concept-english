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

  并做一下几件事
  1. 丝毫不修改地重复这三句话
  2. 对比我的翻译和新概念的原文的差异，需要逐词对比，对有差异的词组，进行对比分析差异，并以表格的形式输。
  3. 进行整体表达的对比，对差异点、薄弱点和建议这三个维度进行分析和阐述，并在尽量不修改原文正确用词的基础上更正我的表达。
  4. 给出你认为更好更地道的英文表达方式。`
