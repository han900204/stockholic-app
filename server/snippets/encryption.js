const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS = 10;

const hashPassword = async (pw) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(pw, salt);

    return hashed;
  } catch (err) {
    console.log(err);
  }
};

const comparePassword = async (rawPW, pw) => {
  try {
    const isPwValid = await bcrypt.compare(rawPW, pw);
    return isPwValid;
  } catch (err) {
    console.log(err);
  }
};

const generateToken = async () => {
  const token = await crypto.randomBytes(16).toString('hex');
  return token;
};

module.exports = { hashPassword, comparePassword, generateToken };
