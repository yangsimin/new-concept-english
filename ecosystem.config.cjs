module.exports = {
  apps: [
    {
      name: 'nce',
      port: '3003',
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs',
    },
  ],
}
