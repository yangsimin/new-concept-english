export default defineAppConfig({
  ui: {
    primary: 'rose',
    gray: 'cool',
    button: {
      default: {
        variant: 'ghost',
        color: 'gray',
      },
      color: {
        gray: {
          ghost: 'hover:bg-[#00000011] dark:hover:bg-[#ffffff11]',
        },
      },
    },
    tooltip: {
      default: {
        openDelay: 600,
      } as any,
    },
  },
})
