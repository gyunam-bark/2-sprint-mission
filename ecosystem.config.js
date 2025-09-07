module.exports = {
  apps: [
    {
      name: 'gyunas-app',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
