import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../components/AdminLayout.vue";
import DocGia from "../views/admin/DocGia.vue";
import NhaXuatBan from "../views/admin/NhaXuatBan.vue";
import Sach from "../views/admin/Sach.vue";
import MuonTra from "../views/admin/MuonTra.vue";

const routes = [
  {
    path: "/admin",
    component: AdminLayout,
    children: [
      {
        path: "nhanvien",
        name: "nhanvien",
        // component: () => import("@/views/admin/NhanVien.vue"),
      },
      {
        path: "docgia",
        name: "docgia",
        component: DocGia,
      },
      {
        path: "sach",
        name: "sach",
        component: Sach,
      },
      {
        path: "nhaxuatban",
        name: "nhaxuatban",
        component: NhaXuatBan,
      },
      {
        path: "theodoimuonsach",
        name: "theodoimuonsach",
        component: MuonTra,
      },
      { path: "", redirect: "/admin/sach" },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
