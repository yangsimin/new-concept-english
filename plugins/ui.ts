export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    if (import.meta.client) {
      appConfig.ui.primary = window.localStorage.getItem('nuxt-ui-primary') || appConfig.ui.primary
      appConfig.ui.gray = window.localStorage.getItem('nuxt-ui-gray') || appConfig.ui.gray
    }
  },
})
