async function generateIncrementalCode(Model, fieldName, prefix = "", length = 3) {
  // Tìm document có mã lớn nhất (theo field cần tăng dần)
  const latestDoc = await Model
    .findOne({[fieldName]: new RegExp(`^${prefix}`),}) // lọc theo prefix
    .sort({ [fieldName]: -1 }) // sắp giảm dần để lấy lớn nhất
    .lean();

  let newNumber = 1;

  if (latestDoc && latestDoc[fieldName]) {
    const currentCode = latestDoc[fieldName].replace(prefix, "");
    const parsed = parseInt(currentCode, 10);
    if (!isNaN(parsed)) newNumber = parsed + 1;
  }

  const paddedNumber = newNumber.toString().padStart(length, "0");
  return prefix + paddedNumber;
}

module.exports = {
  generateIncrementalCode,
};
