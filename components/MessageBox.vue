<script setup lang="ts">
export type MessageType = 'success' | 'info' | 'warning' | 'error'

interface MessageBoxProps {
  visible: boolean
  type: MessageType
  message: string
  html: boolean
}

const props = withDefaults(defineProps<MessageBoxProps>(), {
  visible: false,
  type: 'info',
  message: '',
  html: false,
})
const { visible, message, type, html } = toRefs(props)

const styleMap: Record<MessageType, { color: string, icon: string }> = {
  success: {
    color: 'bg-green-200 text-green-600',
    icon: 'icon-carbon-checkmark-filled',
  },
  info: {
    color: 'bg-gray-200 text-gray-600',
    icon: 'icon-carbon-information-filled',
  },
  warning: {
    color: 'bg-orange-200 text-orange-600',
    icon: 'icon-carbon-warning-filled',
  },
  error: {
    color: 'bg-red-200 text-red-600',
    icon: 'icon-carbon-close-filled',
  },
}
</script>

<template>
  <Transition>
    <div v-if="visible" fixed left-0 right-0 top="[5%]" text-center>
      <div
        :class="[styleMap[type].color]"
        mx-auto w-max flex items-center gap-2 rounded-md px-4 py-2
      >
        <span :class="`${styleMap[type].icon}`" />
        <template v-if="html">
          <div v-html="message" />
        </template>
        <template v-else>
          {{ message }}
        </template>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
