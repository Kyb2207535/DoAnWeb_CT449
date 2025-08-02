// 5000 VNĐ mỗi ngày trễ
const PHAT_MOI_NGAY = 5000;

function tinhTienPhat(ngayTraThucTe, ngayTraDuKien) {
  const thucTe = new Date(ngayTraThucTe);
  const duKien = new Date(ngayTraDuKien);

  if (thucTe <= duKien) return 0;

  const soNgayTre = Math.ceil((thucTe - duKien) / (1000 * 60 * 60 * 24));
  return soNgayTre * PHAT_MOI_NGAY;
}

module.exports = {
  tinhTienPhat,
};
