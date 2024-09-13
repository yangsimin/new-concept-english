<script setup lang="ts">
import { defaultPrompt, storageKeyAiPrompt } from '~/constants'

const isModalOpen = ref(false)
const textareaRef = ref<any>(null)

const savedPrompt = useLocalStorage(storageKeyAiPrompt, defaultPrompt)
const tempPrompt = ref(savedPrompt.value)

const placeholders = [
  { key: '{zh}', description: '中文原文' },
  { key: '{en}', description: '英文原文' },
  { key: '{input}', description: '用户输入' },
]

function addPlaceholder(placeholder: string) {
  const textarea = textareaRef.value?.textarea
  if (!textarea) { return }

  const { selectionStart: start, selectionEnd: end } = textarea
  const text = tempPrompt.value
  tempPrompt.value = text.substring(0, start) + placeholder + text.substring(end)
  // 设置光标位置到插入的占位符之后
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + placeholder.length, start + placeholder.length)
  })
}

function saveChanges() {
  isModalOpen.value = false
  savedPrompt.value = tempPrompt.value
}

function cancelChanges() {
  isModalOpen.value = false
}

function openModal() {
  isModalOpen.value = true
  tempPrompt.value = savedPrompt.value
}
</script>

<template>
  <UTooltip text="设置">
    <UButton icon="heroicons:cog-8-tooth" @click="openModal" />
  </UTooltip>
  <UModal v-model="isModalOpen">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <span class="text-base font-bold"> AI Prompt 配置 </span>
          <UButton icon="i-heroicons-arrow-path" size="xs" variant="ghost" color="gray" @click="tempPrompt = defaultPrompt">
            重置
          </UButton>
        </div>
      </template>
      <div class="flex items-center gap-2 mb-4">
        插入占位符:
        <UTooltip v-for="placeholder in placeholders" :key="placeholder.key">
          <UButton
            size="xs"
            variant="soft"
            @click="addPlaceholder(placeholder.key)"
          >
            {{ placeholder.description }}
          </UButton>
        </UTooltip>
      </div>
      <UTextarea
        ref="textareaRef"
        v-model="tempPrompt"
        label="AI Prompt 配置"
        placeholder="在此输入您的 AI Prompt"
        :maxrows="20"
        autoresize
      />
      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton color="gray" variant="ghost" @click="cancelChanges">
            取消
          </UButton>
          <UButton color="primary" variant="solid" @click="saveChanges">
            保存
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>

</style>
