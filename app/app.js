// Import express.js
const express = require("express");

const path = require('path');

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// 设置 Pug 作为模板引擎
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// 创建一个 /login 路由来渲染登录页面
app.get("/login", function(req, res) {
    res.render("login");
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

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});