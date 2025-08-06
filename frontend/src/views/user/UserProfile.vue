<template>
    <div class="user-profile-container">
        <div class="card">
            <div class="card-header">
                <h3>User Profile</h3>
            </div>
            <div class="card-body">
                <div v-if="loading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else-if="!user" class="alert alert-info">
                    No user data found. Please log in again.
                </div>
                <div v-else class="profile-details">
                    <div class="row">
                        <div class="col-md-6 form-group">
                            <label>Phone Number</label>
                            <p>{{ user.dienThoai }}</p>
                        </div>
                        <div class="col-md-6 form-group">
                            <label>Account ID</label>
                            <p>{{ user.maTaiKhoan }}</p>
                        </div>
                        <div class="col-md-6 form-group">
                            <label>Middle Name</label>
                            <p>{{ user.hoLot || 'N/A' }}</p>
                        </div>
                        <div class="col-md-6 form-group">
                            <label>First Name</label>
                            <p>{{ user.ten }}</p>
                        </div>
                        <div class="col-md-6 form-group">
                            <label>Date of Birth</label>
                            <p>{{ formatDate(user.ngaySinh) || 'N/A' }}</p>
                        </div>
                        <div class="col-md-6 form-group">
                            <label>Gender</label>
                            <p>{{ user.phai || 'N/A' }}</p>
                        </div>
                        <div class="col-md-12 form-group">
                            <label>Address</label>
                            <p>{{ user.diaChi || 'N/A' }}</p>
                        </div>
                    </div>
                    <button @click="logout" class="btn btn-danger w-100 mt-3">Log Out</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
    name: 'UserProfile',
    data() {
        return {
            user: null,
            loading: false,
        };
    },
    created() {
        this.loadUserProfile();
    },
    methods: {
        loadUserProfile() {
            this.loading = true;
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    toast.error('User is not logged in. Please log in again.');
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 1500); 
                    return;
                }
                this.user = user;
            } catch (error) {
                console.error('Error loading user profile:', error);
                toast.error('Failed to load profile. Please try again.');
            } finally {
                this.loading = false;
            }
        },
        logout() {
            localStorage.removeItem('user');
            toast.success('Logged out successfully!');
            this.$router.push('/');
        },
        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
    },
};
</script>
<style scoped src="@/assets/UserProfile.css"></style>
