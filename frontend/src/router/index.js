import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "../components/AdminLayout.vue";
import DocGia from "../views/admin/DocGia.vue";

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
        component: DocGia
      },
      {
        path: "sach",
        name: "sach",
        // component: () => import("@/views/admin/Sach.vue"),
      },
      {
        path: "nhaxuatban",
        name: "nhaxuatban",
        // component: () => import("@/views/admin/NhaXuatBan.vue"),
      },
      {
        path: "theodoimuonsach",
        name: "theodoimuonsach",
        // component: () => import("@/views/admin/TheoDoiMuonSach.vue"),
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
