import { createRouter, createWebHistory } from "vue-router";

// Admin
import AdminSidebar from "../components/AdminSidebar.vue";
import DocGia from "../views/admin/DocGia.vue";
// import NhanVien from "../views/admin/NhanVien.vue";
import Sach from "../views/admin/Sach.vue";
import NhaXuatBan from "../views/admin/NhaXuatBan.vue";
import MuonTra from "../views/admin/MuonTra.vue";

// User
import UserHeader from "../components/UserHeader.vue";
import UserSach from "../views/user/UserSach.vue";
// Login (dùng chung)
// import Login from "../views/Login.vue";

const routes = [
  {
    path: "/admin",
    component: AdminSidebar,
    children: [
      {
        path: "nhanvien",
        name: "nhanvien",
        // component: NhanVien,
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
      {
        path: "",
        redirect: "/admin/sach",
      },
    ],
  },
  {
    path: "/",
    component: UserHeader, 
    children: [
      {
        path: "",
        name: "usersach",
        component: UserSach,
      },
      {
        path: "sachdangmuon",
        name: "sachdangmuon",
        // component: UserBorrowed,
      },
      {
        path: "lichsumuon",
        name: "lichsumuon",
        // component: UserHistory,
      },
      {
        path: "profile",
        name: "profile",
        // component: UserProfile,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    // component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
