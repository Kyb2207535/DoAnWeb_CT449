// Hàm tính ngày trả 
function getNgayTra(ngayMuon, soNgay) {
  const ngay = new Date(ngayMuon);
  ngay.setDate(ngay.getDate() + soNgay);
  return ngay;
}

// Hàm kiểm tra xem có trả trễ không
function isTreHan(ngayTraThucTe, ngayTraDuKien) {
  const tra = new Date(ngayTraThucTe);
  const duKien = new Date(ngayTraDuKien);
  return tra > duKien;
}

module.exports = {
  getNgayTra,
  isTreHan,
};
