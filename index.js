"use strict";

// 定义关闭服务器的函数
function closeServer() {
  server.close(() => {
    console.log('服务器已关闭');
  });
}

process.on('uncaughtException', (err) => {
  console.error('发生了未捕获的错误:', err.message);
  console.error('堆栈信息:', err.stack);
  process.exit(1);
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