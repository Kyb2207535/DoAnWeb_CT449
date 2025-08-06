<template>
    <div class="login-register-container">
        <div class="card">
            <div class="card-header">
                <div class="tab-nav">
                    <button :class="{ 'tab-button': true, active: activeTab === 'login' }" @click="activeTab = 'login'">
                        Log In
                    </button>
                    <button :class="{ 'tab-button': true, active: activeTab === 'register' }"
                        @click="activeTab = 'register'">
                        Register
                    </button>
                </div>
            </div>
            <div class="card-body">
                <!-- Log In Form -->
                <div v-show="activeTab === 'login'" class="tab-pane">
                    <form ref="loginForm" @submit.prevent="handleLogin" class="needs-validation" novalidate>
                        <div class="form-group">
                            <label for="loginDienThoai">Phone Number</label>
                            <div class="input-wrapper">
                                <i class="bi bi-person"></i>
                                <input v-model="loginForm.dienThoai" type="text" id="loginDienThoai"
                                    placeholder="Enter phone number" required pattern="[0-9]{10}">
                                <div class="invalid-feedback">Please enter a valid 10-digit phone number.</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <div class="input-wrapper">
                                <i class="bi bi-lock"></i>
                                <input v-model="loginForm.password" type="password" id="loginPassword"
                                    placeholder="Enter password" required minlength="6">
                                <div class="invalid-feedback">Password must be at least 6 characters.</div>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Log In</button>
                    </form>
                </div>

                <!-- Register Form -->
                <div v-show="activeTab === 'register'" class="tab-pane">
                    <form ref="registerForm" @submit.prevent="handleRegister" class="needs-validation" novalidate>
                        <div class="form-group">
                            <label for="registerDienThoai">Phone Number <span class="required">*</span></label>
                            <div class="input-wrapper">
                                <i class="bi bi-person"></i>
                                <input v-model="registerForm.dienThoai" type="text" id="registerDienThoai"
                                    placeholder="Enter phone number" required pattern="[0-9]{10}">
                                <div class="invalid-feedback">Please enter a valid 10-digit phone number.</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Password <span class="required">*</span></label>
                            <div class="input-wrapper">
                                <i class="bi bi-lock"></i>
                                <input v-model="registerForm.password" type="password" id="registerPassword"
                                    placeholder="Enter password" required minlength="6">
                                <div class="invalid-feedback">Password must be at least 6 characters.</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerHoLot">Middle Name</label>
                            <div class="input-wrapper">
                                <i class="bi bi-person"></i>
                                <input v-model="registerForm.hoLot" type="text" id="registerHoLot"
                                    placeholder="Enter middle name">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerTen">First Name <span class="required">*</span></label>
                            <div class="input-wrapper">
                                <i class="bi bi-person"></i>
                                <input v-model="registerForm.ten" type="text" id="registerTen"
                                    placeholder="Enter first name" required>
                                <div class="invalid-feedback">Please enter your first name.</div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerNgaySinh">Date of Birth</label>
                            <div class="input-wrapper">
                                <i class="bi bi-calendar"></i>
                                <input v-model="registerForm.ngaySinh" type="date" id="registerNgaySinh"
                                    placeholder="Select date of birth">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerPhai">Gender</label>
                            <div class="input-wrapper">
                                <i class="bi bi-gender-ambiguous"></i>
                                <select v-model="registerForm.phai" id="registerPhai">
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerDiaChi">Address</label>
                            <div class="input-wrapper">
                                <i class="bi bi-geo-alt"></i>
                                <input v-model="registerForm.diaChi" type="text" id="registerDiaChi"
                                    placeholder="Enter address">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from '@/api';
import { toast } from 'vue3-toastify';

export default {
    name: 'LoginRegister',
    data() {
        return {
            activeTab: 'login',
            loginForm: {
                dienThoai: '',
                password: ''
            },
            registerForm: {
                dienThoai: '',
                password: '',
                hoLot: '',
                ten: '',
                ngaySinh: '',
                phai: '',
                diaChi: ''
            }
        };
    },
    methods: {
        async handleLogin() {
            console.log('Login request data:', this.loginForm);
            if (!this.loginForm.dienThoai || !this.loginForm.password) {
                toast.error('Please enter all required information.');
                return;
            }
            const form = this.$refs.loginForm;
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                toast.error('Please enter all required information.');
                return;
            }

            try {
                const response = await api.post('/auth/login', this.loginForm);
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success('Logged in successfully!');
                setTimeout(() => {
                    this.$router.push('/');
                }, 1000); 

            } catch (error) {
                if (error.response && error.response.status === 401) {
                    toast.error('Login failed. Invalid phone number or password.');
                } else if (error.response && error.response.status === 404) {
                    toast.error('Login service unavailable. Please try again later.');
                } else {
                    toast.error(error.response?.data?.error || 'Login failed. Please try again.');
                }
            }
        },
        async handleRegister() {
            if (!this.registerForm.dienThoai || !this.registerForm.password || !this.registerForm.ten) {
                toast.error('Please enter phone number, password, and first name.');
                return;
            }
            if (!/^[0-9]{10}$/.test(this.registerForm.dienThoai)) {
                toast.error('Phone number must be 10 digits.');
                return;
            }
            const form = this.$refs.registerForm;
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                toast.error('Please enter phone number, password, and first name.');
                return;
            }

            try {
                await api.post('/docgia', this.registerForm);
                toast.success('Registered successfully!');
                this.registerForm = { dienThoai: '', password: '', hoLot: '', ten: '', ngaySinh: '', phai: '', diaChi: '' };
                this.activeTab = 'login';
            } catch (error) {
                toast.error('Registration failed: ' + (error.response?.data?.error || error.message));
            }
        }
    }
};
</script>

<style scoped>
.login-register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #F5F5F5;
    font-family: 'Inter', sans-serif;
    padding: 2rem;
}

.card {
    width: 100%;
    max-width: 500px;
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
    background: #1A2A44;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 1rem;
}

.tab-nav {
    display: flex;
    gap: 1rem;
}

.tab-button {
    flex: 1;
    padding: 0.75rem;
    background: #6B7280;
    color: #FFFFFF;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 1rem;
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;
}

.tab-button.active {
    background: #F4A261;
    color: #1A2A44;
}

.tab-button:hover {
    background: #E76F51;
}

.card-body {
    padding: 2rem;
}

.tab-pane {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.form-group label {
    color: #1A2A44;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-wrapper i {
    position: absolute;
    left: 1rem;
    color: #6B7280;
    font-size: 1rem;
}

.form-group input,
.form-group select {
    background: #F5F5F5;
    border: 1px solid #6B7280;
    border-radius: 8px;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    color: #1A2A44;
    font-size: 1rem;
    width: 100%;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #60A5FA;
    background: #FFFFFF;
}

.form-group input::placeholder {
    color: #6B7280;
    opacity: 0.7;
}

.invalid-feedback {
    color: #F4A261;
    font-size: 0.85rem;
    margin-top: 0.25rem;
}

.required {
    color: #F4A261;
}

.btn-primary {
    background: #F4A261;
    color: #FFFFFF;
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    font-size: 1rem;
    transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
    margin-top: 20px;
}

.btn-primary:hover {
    background: #E76F51;
    transform: translateY(-2px);
}
</style>