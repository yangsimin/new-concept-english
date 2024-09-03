import { appDescription } from './constants/index'

export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@vueuse/nuxt', '@nuxt/ui', '@nuxtjs/tailwindcss'],
  features: {
    inlineStyles: false,
  },
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      meta: [
        { name: 'description', content: appDescription },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  ssr: false,
  sourcemap: {
    server: true,
    client: true,
  },
  css: [],
  compatibilityDate: '2024-08-22',
  ui: { // why?
    global: true,
  },
})
