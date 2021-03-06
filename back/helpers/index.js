const bcrypt = require("bcrypt");
const getHash = (string) => {
  return bcrypt.hashSync(string, 10);
};

/**
 * generate a random string
 * @param {Number} length - length of random string
 * @return {String}
 */
const makeKey = (length) => {
  const n = length === undefined ? 6 : length;
  let result = "";
  const chr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const chrLength = chr.length;
  for (let i = 0; i < n; i++) {
    result += chr.charAt(Math.floor(Math.random() * chrLength));
  }
  return result;
};

const validateEmail = (email) => {
  const regex = /^[^@]+@[^@]+\.[^@]+$/;
  return regex.test(email);
};

const compareCurrentDate = (date) => {
  const DATE = Date.now();
  return new Date(date).getTime() > new Date(DATE).getTime();
};

const compareDateForUpdateBooking = (date) => {
  const TODAY = new Date();
  TODAY.setDate(TODAY.getDate() + 1);
  return new Date(date).getTime() > TODAY.getTime();
};

module.exports = {
  getHash,
  makeKey,
  validateEmail,
  compareCurrentDate,
  compareDateForUpdateBooking,
};
