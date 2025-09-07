module.exports = {
  apps: [
    {
      name: 'gyunas-app',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      args: [],
      node_args: ['--require', 'crypto'],
    },
  ],
};
