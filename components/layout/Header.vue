<script setup lang="ts">
const toast = useToast()

function handleImportCache(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const text = e.target?.result // 获取读取的文本内容
    if (typeof text === 'string') {
      try {
        const jsonData = JSON.parse(text)
        Object.entries(jsonData).forEach(([key, value]) => {
          if (typeof value === 'object') {
            setLocalStorageJson(key, value)
          }
          else {
            localStorage.setItem(key, value as string)
          }
        })
        toast.add({ description: '导入完成，页面将会刷新。', color: 'green' })
        setTimeout(() => {
          location.reload()
        }, 2000)
      }
      catch (error) {
        console.error(error)
        toast.add({ description: '无效的 JSON 文件！', color: 'red' })
      }
    }
  }
  reader.readAsText(file)
}

function handleExportCache() {
  const keys = Object.keys(localStorage).filter(key => key.startsWith('nce'))
  const cache = keys.reduce((obj, key) => {
    obj[key] = JSON.parse(localStorage[key])
    return obj
  }, {} as any)
  downloadJson(cache)
}
</script>

<template>
  <header class="container h-[var(--header-height)] flex items-center justify-end gap-2 text-xl">
    <UButton
      color="primary"
      size="xl"
      class="mr-auto font-bold"
      @click="$router.push('/')"
    >
      New Concept English
    </UButton>
    <NuxtLink to="/choice">
      <UTooltip text="精选句子练习">
        <UButton icon="ph:list-star-duotone" />
      </UTooltip>
    </NuxtLink>
    <LayoutColorPicker />
    <LayoutDarkToggle />
    <UButton
      icon="simple-icons-github"
      to="https://github.com/yangsimin/new-concept-english-web-app"
      target="_blank"
      title="Github"
    />
    <UTooltip text="导出精选句子">
      <UButton
        icon="uil-export"
        @click="handleExportCache"
      />
    </UTooltip>
    <UTooltip text="导入精选句子">
      <UButton class="px-1.5">
        <label class="cursor-pointer h-5">
          <UIcon name="uil-import" class="w-5 h-5" />
          <input type="file" accept=".json" class="hidden" @change="handleImportCache">
        </label>
      </UButton>
    </UTooltip>
  </header>
</template>
