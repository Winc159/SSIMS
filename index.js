"use strict";

process.on('uncaughtException', (err) => {
    console.error('发生了未捕获的错误', err);
    process.exit(1); // 强制退出（根据 Node.js 文档）
  });
  
  process.on('SIGTERM', () => {
    console.log('接收到 SIGTERM 信号，优雅地关闭进程');
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    console.log('接收到 SIGINT 信号，优雅地关闭进程');
    process.exit(0);
  });

// Include the app.js file.
// This will run the code.
console.log("entrypoint");
const app = require("./app/app.js");