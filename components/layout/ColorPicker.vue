<script setup lang="ts">
import colors from '#tailwind-config/theme/colors'

const appConfig = useAppConfig()
const colorMode = useColorMode()

const primaryColors = computed(() => appConfig.ui.colors.filter(c => c !== 'primary').map(c => ({ text: c, hex: (colors as any)[c][colorMode.value === 'dark' ? 400 : 500] })))
const primary = computed({
  get() {
    return primaryColors.value.find(c => c.text === appConfig.ui.primary)
  },

  set(color) {
    if (!color?.text) { return }
    appConfig.ui.primary = color.text
    window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.primary)
  },
})

const grayColors = computed(() => ['slate', 'cool', 'zinc', 'neutral', 'stone'].map(c => ({ text: c, hex: (colors as any)[c][colorMode.value === 'dark' ? 400 : 500] })))
const gray = computed({
  get() {
    return grayColors.value.find(c => c.text === appConfig.ui.gray)
  },

  set(color) {
    if (!color?.text) { return }
    appConfig.ui.gray = color.text
    window.localStorage.setItem('nuxt-ui-gray', appConfig.ui.gray)
  },
})
</script>

<template>
  <UPopover :close-delay="300" mode="hover">
    <template #default="{ open }">
      <UButton
        icon="heroicons:swatch-solid"
        :color="((primary?.text ?? 'gray') as any)"
        :class="[open && 'bg-[#00000011] dark:bg-[#ffffff11]']"
      />
    </template>
    <template #panel>
      <div class="grid grid-cols-5 p-2">
        <UTooltip v-for="color in primaryColors" :key="color.text" :text="color?.text" class="capitalize">
          <UButton square :variant="primary?.text === color.text ? 'solid' : 'ghost'" @click="primary = color">
            <span class="inline-block rounded-full w-3 h-3" :style="{ backgroundColor: color.hex }" />
          </UButton>
        </UTooltip>
      </div>
      <hr class="border-gray-200 dark:border-gray-800">
      <div class="grid grid-cols-5 p-2">
        <UTooltip v-for="color in grayColors" :key="color.text" :text="color?.text" class="capitalize">
          <UButton square :variant="gray?.text === color.text ? 'solid' : 'ghost'" @click="gray = color">
            <span class="inline-block rounded-full w-3 h-3" :style="{ backgroundColor: color.hex }" />
          </UButton>
        </UTooltip>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>

</style>
