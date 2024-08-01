// Import express.js
const express = require('express');
const { login } = require('./models/user'); 
const app = express();  // 只声明一次 app 实例
var session = require("express-session")

const path = require('path');

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// 设置 Pug 作为模板引擎
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 使用 body-parser 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// 创建一个 /login 路由来渲染登录页面
app.get("/login", function(req, res) {
    res.render("login");
});

// 创建一个 /login 路由来渲染登录页面
app.get("/register", function(req, res) {
    res.render("register");
});

// 处理登录表单提交
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = await login(username, password);
  
      if (user.user_type === 'teacher') {
        res.redirect('/teacher/interface');
      } else if (user.user_type === 'student') {
        res.redirect('/student/interface');
      }
    } catch (err) {
      res.status(401).send(err.message);
    }
  });

// 创建一个 /studentinterface 路由来渲染登录页面
app.get("/student/interface", function(req, res) {
    res.render("studentpage/interface");
});

// 创建一个 /student/personal-info 路由来渲染个人信息修改页面
app.get("/student/info", function(req, res) {
    res.render("studentpage/info");
});

// 创建一个 /student/timetable 路由来渲染课程表页面
app.get("/student/timetable", function(req, res) {
    res.render("studentpage/timetable");
});

// 创建一个 /student/report 路由来渲染报告评估页面
app.get("/student/report", function(req, res) {
    res.render("studentpage/report");
});

// 创建一个 /student/support 路由来渲染支持页面
app.get("/student/support", function(req, res) {
    res.render("studentpage/support");
});

// 创建一个 /teacherinterface 路由来渲染登录页面
app.get("/teacher/interface", function(req, res) {
    res.render("teacherpage/interface");
});

// 创建一个 /teacher/info 路由来渲染个人信息修改页面
app.get("/teacher/info", function(req, res) {
    res.render("teacherpage/info");
});

// 创建一个 /teacher/folder 路由来渲染个人信息修改页面
app.get("/teacher/folder", function(req, res) {
    res.render("teacherpage/folder");
});

// 创建一个 /teacher/timetable 路由来渲染课程表页面
app.get("/teacher/timetable", function(req, res) {
    res.render("teacherpage/timetable");
});

// 创建一个 /teacher/timetable 路由来渲染课程表页面
app.get("/teacher/edittimetable", function(req, res) {
    res.render("teacherpage/edit");
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});