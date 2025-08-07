import { createRouter, createWebHistory } from "vue-router";
import { toast } from "vue3-toastify";

// Admin
import AdminSidebar from "../components/AdminSidebar.vue";
import DocGia from "../views/admin/DocGia.vue";
import NhanVien from "../views/admin/NhanVien.vue";
import Sach from "../views/admin/Sach.vue";
import NhaXuatBan from "../views/admin/NhaXuatBan.vue";
import MuonTra from "../views/admin/MuonTra.vue";

// User
import UserHeader from "../components/UserHeader.vue";
import UserSach from "../views/user/UserSach.vue";
import UserMuon from "../views/user/UserMuon.vue";
import UserProfile from "../views/user/UserProfile.vue";
import UserLichSu from "../views/user/UserLichSu.vue";

// Login (dùng chung)
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/admin",
    component: AdminSidebar,
    meta: { requiresAdmin: true },
    children: [
      {
        path: "nhanvien",
        name: "nhanvien",
        component: NhanVien,
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
        component: UserMuon,
      },
      {
        path: "lichsumuon",
        name: "lichsumuon",
        component: UserLichSu,
      },
      {
        path: "profile",
        name: "profile",
        component: UserProfile,
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Bảo vệ route theo vai trò
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu tuyến yêu cầu quyền admin
  if (to.meta.requiresAdmin) {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Administrators only.");
      setTimeout(() => {
        next("/");
      }, 2000); 
      return;
    }
    return next(); // Cho phép admin tiếp tục
  }

  // Nếu đã đăng nhập và truy cập /login, chuyển hướng theo vai trò
  if (to.name === "login" && user) {
    if (user.role === "admin") {
      return next("/admin/sach");
    } else {
      return next("/");
    }
  }

  // Cho phép truy cập các tuyến khác (tuyến người dùng hoặc /login)
  return next();
});

export default router;
