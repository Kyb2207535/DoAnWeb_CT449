<template>
    <div class="admin-container">
        <!-- Sidebar -->
        <div class="admin-sidebar" :class="{ 'collapsed': isCollapsed }">
            <div class="sidebar-header">
                <h3>Library Management</h3>
            </div>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <router-link to="/admin/nhanvien" class="nav-link">
                        <i class="bi bi-people-fill"></i>
                        <span v-if="!isCollapsed">Staff</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/docgia" class="nav-link">
                        <i class="bi bi-person-fill"></i>
                        <span v-if="!isCollapsed">Reader</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/sach" class="nav-link">
                        <i class="bi bi-book-fill"></i>
                        <span v-if="!isCollapsed">Book</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/nhaxuatban" class="nav-link">
                        <i class="bi bi-building-fill"></i>
                        <span v-if="!isCollapsed">Publisher</span>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/admin/theodoimuonsach" class="nav-link">
                        <i class="bi bi-clipboard-check-fill"></i>
                        <span v-if="!isCollapsed">Book Borrowing Tracking</span>
                    </router-link>
                </li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="admin-main">
            <header class="admin-header">
                <div class="header-content">
                    <h4>{{ currentPageTitle }}</h4>
                    <div class="user-info">
                        <span>Hello, Admin</span>
                        <button class="btn-logout">Logout</button>
                    </div>
                </div>
            </header>

            <div class="admin-content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AdminLayout',
}
</script>

<style scoped src="@/assets/AdminLayout.css"></style>