<template>
    <div class="header-container">
        <nav class="navbar" :class="{ 'navbar-fixed': isScrolled }">
            <div class="container-fluid">
                <!-- Logo và tên thư viện -->
                <router-link to="/" class="navbar-brand d-flex align-items-center">
                    <img src="@/assets/image/library-icon.jpg" alt="Library Icon" class="logo-img me-2">
                    <span class="fw-bold">Digital Library</span>
                </router-link>

                <!-- Menu chính -->
                <div class="navbar-menu">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link to="/sachdangmuon" class="nav-link">
                                Books on Loan
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/lichsumuon" class="nav-link">
                                Borrowed History
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/profile" class="nav-link">
                                Profile
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <button v-if="isLoggedIn" class="btn btn-logout" @click="logout">
                                <i class="bi bi-box-arrow-right me-1"></i> Log Out
                            </button>
                            <router-link v-else to="/login" class="btn btn-login">
                                <i class="bi bi-box-arrow-in-right me-1"></i> Log In
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <!-- Placeholder để tránh nội dung bị che khi header fixed -->
        <div class="header-placeholder" v-if="isScrolled"></div>
        <!-- Router View để render các component con -->
        <router-view></router-view>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';

const router = useRouter();
const isScrolled = ref(false);

// Kiểm tra đăng nhập dựa trên maDocGia trong localStorage
const isLoggedIn = computed(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return !!user.maDocGia || (!!user.role && user.role === 'admin' && !!user.maNhanVien);
});


// Xử lý fixed header khi cuộn
const handleScroll = () => {
    isScrolled.value = window.scrollY > 0;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

function logout() {
    localStorage.removeItem('user');
    setTimeout(() => {
        window.location.reload();
        this.$router.push('/');
    }, 800);
    toast.success('Logged out successfully');
}
</script>

<style scoped src="@/assets/UserLayout.css"></style>