// Import express.js
const express = require('express');
const { login, register, calculateAge } = require('./models/user'); 
const { getDay, getTime } = require('./models/timetable'); // 引用辅助函数
const app = express();  // 只声明一次 app 实例
// Get the functions in the db.js file to use
const db = require('./services/db');
var session = require("express-session")
const path = require('path');

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Add static files location
app.use(express.static("static"));

// 配置会话中间件
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore(), // 存储会话数据的方式
    cookie: { secure: false } // 允许在非 HTTPS 环境下使用
}));

// 使用 body-parser 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// 设置 Pug 作为模板引擎
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

app.get('/test', async (req, res) => {
  try {
    const sqlQuery = 'SELECT * FROM student LIMIT 10';
    const rows = await db.query(sqlQuery);

    // 打印调试信息
    console.log('Number of rows:', rows.length);
    console.log('Database rows:', rows);

    // 渲染测试页面
    res.render('test', { students: rows });
  } catch (err) {
    console.error('Error fetching student info:', err);
    res.status(500).send('服务器内部错误');
  }
});

// 创建一个 /login 路由来渲染登录页面
app.get("/login", function(req, res) {
    res.render("login");
});

// 处理登录表单提交
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = await login(username, password);
      // 将用户ID和student_id存储在会话中
      req.session.userId = user.id;
      req.session.studentId = user.student_id;
      req.session.teacherId = user.teacher_id;

      if (user.user_type === 'teacher') {
        res.redirect('/teacher/interface');
      } else if (user.user_type === 'student') {
        res.redirect('/student/interface');
      }
    } catch (err) {
      res.status(401).send(err.message);
    }
  });

// 创建一个 /register 路由来渲染注册页面
app.get("/register", function(req, res) {
    res.render("register");
});

// 处理注册表单提交
app.post('/register', async (req, res) => {
    const { username, password, user_type } = req.body;
  
    try {
      await register(username, password, user_type);
      res.redirect('/login');
    } catch (err) {
      res.status(500).send('注册失败：' + err.message);
    }
  });
  
// 学生界面路由
app.get('/student/interface', async (req, res) => {
    try {
        const userId = req.session.userId;
        const studentId = req.session.studentId;
  
        if (!userId || !studentId) {
            return res.redirect('/login');
        }
  
        // 查询学生信息
        const studentRows = await db.query('SELECT * FROM student WHERE student_id = ?', [studentId]);

        // 如果没有找到学生数据
        if (studentRows.length === 0) {
            return res.status(404).send('学生信息未找到');
        }

        const studentInfo = studentRows;

        // 计算年龄
        const dob = new Date(studentInfo.DOB); // 将DOB字段转为Date对象
        studentInfo.age = calculateAge(dob); // 添加计算出的年龄

        // 渲染页面并传递学生信息
        res.render('studentpage/interface', { student: studentInfo });
    } catch (err) {
        console.error('Error fetching student info:', err);
        res.status(500).send('服务器内部错误');
    }
});

// 学生信息编辑界面路由
app.get('/student/info', async (req, res) => {
    try {
      const userId = req.session.userId;
      const studentId = req.session.studentId;
  
      if (!userId || !studentId) {
        return res.redirect('/login');
      }
  
      // 查询学生信息
      const studentRows = await db.query('SELECT * FROM student WHERE student_id = ?', [studentId]);
  
      if (studentRows.length === 0) {
        return res.status(404).send('学生信息未找到');
      }
  
      const studentInfo = studentRows;
  
      // 格式化DOB为"yyyy-MM-dd"
      const dob = new Date(studentInfo.DOB);
      studentInfo.formattedDOB = dob.toISOString().split('T')[0]; // 提取并格式化日期部分

      // 渲染学生信息编辑页面，并传递学生信息
      res.render('studentpage/info', { student: studentInfo });
    } catch (err) {
      console.error('Error fetching student info:', err);
      res.status(500).send('服务器内部错误');
    }
  });

  // 更新学生信息的路由
app.post('/student/update-info', async (req, res) => {
    try {
      const studentId = req.session.studentId;
  
      if (!studentId) {
        return res.redirect('/login');
      }
  
      const { student_name, gender, DOB, symptoms, Address_City, Address_District, Address_detail } = req.body;
  
      // 更新学生信息
      await db.query(
        'UPDATE student SET Student_name = ?, gender = ?, DOB = ?, symptoms = ?, Address_City = ?, Address_District = ?, Address_detail = ? WHERE student_id = ?',
        [student_name, gender, DOB, symptoms, Address_City, Address_District, Address_detail, studentId]
      );
  
      res.redirect('/student/interface');
    } catch (err) {
      console.error('Error updating student info:', err);
      res.status(500).send('服务器内部错误');
    }
});
  

// 创建一个学生课表的页面
app.get('/student/timetable', async (req, res) => {
    try {
        const userId = req.session.userId;
        const studentId = req.session.studentId;

        if (!userId || !studentId) {
            return res.redirect('/login');
        }

        // 查询课程安排和教师信息
        const courseRows = await db.query(
            'SELECT ' +
            '  c.course_name, ' +
            '  s.class_time AS class_time, ' +
            '  s.class_room AS classroom, ' +
            '  t.teacher_name ' +
            'FROM class_schedules s ' +
            'JOIN course c ON s.course_id = c.course_id ' +
            'JOIN schedule_teachers st ON s.schedule_id = st.schedule_id ' +
            'JOIN teacher t ON st.teacher_id = t.teacher_id ' +
            'JOIN schedule_students ss ON s.schedule_id = ss.schedule_id ' +
            'WHERE ss.student_id = ? ' +
            'ORDER BY s.class_time',
            [studentId]
        );

        console.log('Course rows:', courseRows); // 输出查询结果

        // 格式化课程信息
        const courses = courseRows.map(row => {
            const classTime = new Date(row.class_time);
            return {
                date: getDay(classTime),
                time: getTime(classTime),
                course_name: row.course_name,
                classroom: row.classroom,
                teacher_name: row.teacher_name
            };
        });

        // 渲染页面并传递课程信息
        res.render('studentpage/timetable', { courses });
    } catch (err) {
        console.error('Error fetching course info:', err);
        res.status(500).send('服务器内部错误');
    }
});

app.get('/student/report', async (req, res) => {
  try {
    const userId = req.session.userId;
    const studentId = req.session.studentId;

    if (!userId || !studentId) {
      return res.redirect('/login');
    }

    // 查询学生报告信息
    const reportRows = await db.query('SELECT * FROM student_report WHERE student_id = ?', [studentId]);
    console.log('Report rows:', reportRows); // 打印查询结果

    // 将数据包装在数组中
    const reports = Array.isArray(reportRows) ? reportRows : [reportRows];

    // 渲染页面并传递报告信息
    res.render('studentpage/report', { reports });
  } catch (err) {
    console.error('Error fetching report info:', err);
    res.status(500).send('服务器内部错误');
  }
});

// 创建一个 /student/support 路由来渲染支持页面
app.get("/student/support", function(req, res) {
    res.render("studentpage/support");
});

// 老师界面路由
app.get('/teacher/interface', async (req, res) => {
    try {
        const userId = req.session.userId;
        const teacherId = req.session.teacherId;
  
        if (!userId || !teacherId) {
            return res.redirect('/login');
        }
  
        // 查询老师信息
        const [teacherRows] = await db.query('SELECT * FROM teacher WHERE teacher_id = ?', [teacherId]);

        // 如果没有找到老师数
        if (teacherRows.length === 0) {
            return res.status(404).send('老师信息未找到');
        }

        const teacherInfo = teacherRows;

        // 计算年龄
        const dob = new Date(teacherInfo.DOB); // 将DOB字段转为Date对象
        teacherInfo.age = calculateAge(dob); // 添加计算出的年龄

        // 渲染页面并传递老师信息
        res.render('teacherpage/interface', { teacher: teacherInfo });
    } catch (err) {
        console.error('Error fetching teacher info:', err);
        res.status(500).send('服务器内部错误');
    }
});

// 教师信息编辑界面路由
app.get('/teacher/info', async (req, res) => {
  try {
    const userId = req.session.userId;
    const teacherId = req.session.teacherId;

    if (!userId || !teacherId) {
      return res.redirect('/login');
    }

    // 查询教师信息
    const teacherRows = await db.query('SELECT * FROM teacher WHERE teacher_id = ?', [teacherId]);

    if (teacherRows.length === 0) {
      return res.status(404).send('教师信息未找到');
    }

    const teacherInfo = teacherRows;

    // 格式化DOB为"yyyy-MM-dd"
    const dob = new Date(teacherInfo.DOB);
    teacherInfo.formattedDOB = dob.toISOString().split('T')[0]; // 提取并格式化日期部分

    // 渲染教师信息编辑页面，并传递教师信息
    res.render('teacherpage/info', { teacher: teacherInfo });
  } catch (err) {
    console.error('Error fetching student info:', err);
    res.status(500).send('服务器内部错误');
  }
});

// 更新教师信息的路由
app.post('/teacher/update-info', async (req, res) => {
  try {
    const teacherId = req.session.teacherId;

    if (!teacherId) {
      return res.redirect('/login');
    }

    const { teacher_name, gender, DOB, Address, Phone_number, Institution_name } = req.body;

    // 更新教师信息
    await db.query(
      'UPDATE teacher SET teacher_name = ?, gender = ?, DOB = ?, Address = ?, Phone_number = ?, Institution_name = ? WHERE teacher_id = ?',
      [teacher_name, gender, DOB, Address, Phone_number, Institution_name, teacherId]
    );

    res.redirect('/teacher/interface');
  } catch (err) {
    console.error('Error updating teacher info:', err);
    res.status(500).send('服务器内部错误');
  }
});

app.get('/teacher/search', async (req, res) => {
  try {
    const query = req.query.query;
    const userId = req.session.userId;

    if (!userId) {
      return res.redirect('/login');
    }

    let students = [];
    let totalStudents = 0;

    if (query) {
      // 根据搜索条件构建 SQL 查询
      const sqlQuery = `
        SELECT s.Student_id,
               s.Student_name AS name, 
               s.DOB, 
               s.Gender, 
               s.symptoms, 
               s.Address_City, 
               s.Address_District, 
               s.Address_detail, 
               s.Parents_name,
               s.Parents_Phonenumber, 
               s.Institution_name 
        FROM student s
        WHERE s.Student_name LIKE ? 
           OR s.symptoms LIKE ? 
           OR s.Address_City LIKE ? 
           OR s.Address_District LIKE ? 
           OR s.Institution_name LIKE ?
      `;
      
      // 构建查询参数
      const queryParams = [
        `%${query}%`, // Student_name LIKE
        `%${query}%`, // symptoms LIKE
        `%${query}%`, // Address_City LIKE
        `%${query}%`, // Address_District LIKE
        `%${query}%`, // Institution_name LIKE
      ];

      // 执行查询
      const rows = await db.query(sqlQuery, queryParams);

      // 确保 `rows` 是一个数组
      students = Array.isArray(rows) ? rows : [rows];
      totalStudents = students.length;

      // 格式化 DOB 为 yyyy-MM-dd
      students = students.map(student => {
        const dob = new Date(student.DOB);
        return {
          ...student,
          DOB: dob.toISOString().split('T')[0] // 提取并格式化日期部分
        };
      });
    }

    // 渲染页面并传递搜索结果
    res.render('teacherpage/search', { students, totalStudents });
  } catch (err) {
    console.error('Error fetching student info:', err);
    res.status(500).send('服务器内部错误');
  }
});


// 创建一个教师课表的页面
app.get('/teacher/timetable', async (req, res) => {
  try {
      const userId = req.session.userId;
      const teacherId = req.session.teacherId;

      if (!userId || !teacherId) {
          return res.redirect('/login');
      }

      // 查询课程安排
      const courseRows = await db.query(
          'SELECT ' +
          '  s.schedule_id, ' +
          '  c.course_name, ' +
          '  s.class_time AS class_time, ' +
          '  s.class_room AS classroom, ' +
          '  t.teacher_name ' +
          'FROM class_schedules s ' +
          'JOIN course c ON s.course_id = c.course_id ' +
          'JOIN schedule_teachers st ON s.schedule_id = st.schedule_id ' +
          'JOIN teacher t ON st.teacher_id = t.teacher_id ' +
          'WHERE t.teacher_id = ? ' +
          'ORDER BY s.class_time',
          [teacherId]
      );

      // 查询学生信息
      const studentRows = await db.query(
          'SELECT ' +
          '  ss.schedule_id, ' +
          '  st.student_id, ' +
          '  st.student_name ' +
          'FROM schedule_students ss ' +
          'JOIN student st ON ss.student_id = st.student_id'
      );

      // 打印查询结果
      console.log('Course rows:', courseRows);
      console.log('Student rows:', studentRows);

      // 初始化学生映射
      const studentMap = {};
      for (const student of studentRows) {
          console.log('Student:', student);
          const scheduleId = student.schedule_id.toString(); // 确保为字符串

          // 如果 studentMap[scheduleId] 未定义，则初始化为一个空数组
          if (!studentMap[scheduleId]) {
              studentMap[scheduleId] = [];
          }

          // 将学生信息添加到对应的 schedule_id 数组中
          studentMap[scheduleId].push(student);
      }

      // 打印最终的 studentMap
      console.log('Student map:', studentMap);

      // 格式化课程信息
      const courses = courseRows.map(row => {
          const classTime = new Date(row.class_time);
          const scheduleId = row.schedule_id.toString(); // 确保为字符串
          return {
              schedule_id: scheduleId,
              date: getDay(classTime),
              time: getTime(classTime),
              course_name: row.course_name,
              classroom: row.classroom,
              teacher_name: row.teacher_name,
              students: studentMap[scheduleId] || [] // 如果没有匹配的学生，返回空数组
          };
      });

      // 打印数据
      console.log('Student map:', studentMap);
      console.log('Courses with students:', courses);

      // 渲染页面并传递课程信息
      res.render('teacherpage/timetable', { courses });
  } catch (err) {
      console.error('Error fetching course info:', err);
      res.status(500).send('服务器内部错误');
  }
});

// 删除课程安排的路由
app.get('/teacher/course/:schedule_id/delete', async (req, res) => {
  const scheduleId = req.params.schedule_id;

  try {
    // 删除课程安排记录
    await db.query('DELETE FROM class_schedules WHERE schedule_id = ?', [scheduleId]);

    // 删除课程与学生的关联
    await db.query('DELETE FROM schedule_students WHERE schedule_id = ?', [scheduleId]);

    // 删除课程与教师的关联（如果需要）
    await db.query('DELETE FROM schedule_teachers WHERE schedule_id = ?', [scheduleId]);

    // 重定向到课程列表页
    res.redirect('/teacher/courses');
  } catch (error) {
    console.error('删除课程安排时发生错误:', error);
    res.status(500).send('删除课程安排时发生错误');
  }
});

// 处理课程信息修改页面
app.get('/teacher/timetable/:schedule_id/edit', async (req, res) => {
  try {
      const { schedule_id } = req.params;
      const userId = req.session.userId;

      if (!userId) {
          return res.redirect('/login');
      }

      console.log(`Received request to edit timetable for ID: ${schedule_id}`);

      // 查询课程信息
      const courseResult = await db.query(
        'SELECT cs.schedule_id, cs.class_time, cs.class_room, cs.course_id, c.course_name ' +
        'FROM class_schedules cs ' +
        'JOIN course c ON c.Course_id = cs.course_id ' +
        'WHERE cs.schedule_id = ?',
        [schedule_id]
      );

      if (!courseResult.length) {
          return res.status(404).send('课程未找到');
      }

      const course = courseResult[0];
      const formattedDOB = new Date(course.class_time).toISOString().slice(0, 16);

      // 查询所有课程
      const allCourses = await db.query(
        'SELECT Course_id AS id, course_name FROM course'
      );

      res.render('teacherpage/timetable_edit', { course: { ...course, formattedDOB }, timetableId: schedule_id, courses: allCourses });
  } catch (err) {
      console.error('Error fetching course info:', err);
      res.status(500).send('服务器内部错误');
  }
});

// 处理课程信息修改提交
app.post('/teacher/update-timetable/:schedule_id', async (req, res) => {
  try {
      const { course_id, class_time, class_room } = req.body;
      const { schedule_id } = req.params;

      await db.query(
        'UPDATE class_schedules ' +
        'SET course_id = ?, class_time = ?, class_room = ? ' +
        'WHERE schedule_id = ?',
        [course_id, class_time, class_room, schedule_id]
      );

      res.redirect('/teacher/timetable');
  } catch (err) {
      console.error('Error updating timetable:', err);
      res.status(500).send('更新课程信息时出错');
  }
});

// 创建一个 /teacher/edittimetable 路由来渲染课程表页面
app.get("/teacher/edittimetable", function(req, res) {
    res.render("teacherpage/edit");
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});