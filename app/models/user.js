const bcrypt = require('bcryptjs');
const { query } = require('../services/db');

async function login(username, password) {
  try {
    // 查询数据库中的用户信息
    const rows = await query('SELECT * FROM users WHERE username = ?', [username]);

    // 如果没有找到用户，则抛出错误
    if (rows.length === 0) {
      throw new Error('用户名或密码不正确');
    }

    // 转换数据为对象（如果需要）
    const user = Array.isArray(rows) ? rows[0] : rows;
    
    // 直接比较明文密码
    if (password !== user.password) {
        throw new Error('用户名或密码不正确');
    }

    return user;
  } catch (err) {
    throw err;
  }
}

async function registerStudent(username, password, Student_name, DOB, Gender, symptoms, Address_City, Address_District, Address_detail, Parents_name, Parents_Phonenumber, Institution_name) {
  // 创建用户，先不填充 student_id 或 teacher_id
  const userResult = await query('INSERT INTO user (username, password, user_type) VALUES (?, ?, ?)', [username, password, 'student']);
  const userId = userResult.insertId;

  // 创建学生
  const studentResult = await query('INSERT INTO student (Student_name, DOB, Gender, symptoms, Address_City, Address_District, Address_detail, Parents_name, Parents_Phonenumber, Institution_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [Student_name, DOB, Gender, symptoms, Address_City, Address_District, Address_detail, Parents_name, Parents_Phonenumber, Institution_name]);
  const studentId = studentResult.insertId;

  // 更新 user 表中的 student_id 列
  await query('UPDATE user SET student_id = ? WHERE id = ?', [studentId, userId]);
}

async function registerTeacher(username, password, Teacher_name, Gender, DOB, Address, Phone_number, Institution_name) {
  // 创建用户，先不填充 student_id 或 teacher_id
  const userResult = await query('INSERT INTO user (username, password, user_type) VALUES (?, ?, ?)', [username, password, 'teacher']);
  const userId = userResult.insertId;

  // 创建老师
  const teacherResult = await query('INSERT INTO teacher (Teacher_name, Gender, DOB, Address, Phone_number, Institution_name) VALUES (?, ?, ?, ?, ?, ?)', [Teacher_name, Gender, DOB, Address, Phone_number, Institution_name]);
  const teacherId = teacherResult.insertId;

  // 更新 user 表中的 teacher_id 列
  await query('UPDATE user SET teacher_id = ? WHERE id = ?', [teacherId, userId]);
}


// calculate age
function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

module.exports = { login, calculateAge, registerTeacher, registerStudent };
