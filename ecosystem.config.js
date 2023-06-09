module.exports = {
  apps: [
    {
      name: 'kiosk_his_api_fastify_ts',
      script: 'dist/app.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
