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

async function register(username, password, user_type) {
  try {
    // 将用户信息插入数据库，直接存储明文密码
    await query('INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)', [username, password, user_type]);
  } catch (err) {
    throw new Error('注册失败：' + err.message);
  }
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

module.exports = { login, register, calculateAge };
