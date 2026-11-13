import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests',
  timeout:180000,
  workers:1,
  reporter:[['list'],['html',{open:'never'}]],
  use:{ baseURL:'http://127.0.0.1:4173', channel:'msedge', headless:true, reducedMotion:'reduce', timezoneId:'Asia/Kuala_Lumpur', trace:'retain-on-failure' },
  webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:true,timeout:20000}
});
