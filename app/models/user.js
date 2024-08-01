const bcrypt = require('bcryptjs');
const { query } = require('../services/db');

async function login(username, password) {
  try {
    // 查询数据库中的用户信息
    const rows = await query('SELECT * FROM users WHERE username = ?', [username]);

    // 如果没有找到用户，则抛出错误
    if (rows.length === 0) {
      throw new Error('没找到该用户');
    }

    const user = rows[0];

    // 直接比较明文密码
    if (password !== user.password) {
        throw new Error('用户名或密码不正确');
    }

    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = { login };
