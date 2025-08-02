function generateCode(prefix = "", length = 5) {
  const randomPart = Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
  return prefix + randomPart;
}


module.exports = {
  generateCode,
};
