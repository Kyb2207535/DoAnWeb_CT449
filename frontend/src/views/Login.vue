<template>
    <div class="login-register-container">
        <div class="form-section">
            <div class="card">
                <div class="card-header">
                    <h2>{{ activeTab === 'login' ? 'Log In' : 'Register' }}</h2>
                </div>
                <div class="card-body">
                    <!-- Log In Form -->
                    <div v-show="activeTab === 'login'" class="tab-pane">
                        <form ref="loginForm" @submit.prevent="handleLogin" class="needs-validation" novalidate>
                            <div class="form-group">
                                <label for="loginDienThoai">Phone Number</label>
                                <div class="input-wrapper">
                                    <i class="bi bi-phone"></i>
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
                        <div class="toggle-text">
                            Don't have an account?
                            <a href="#" @click.prevent="activeTab = 'register'">Register here</a>
                        </div>
                    </div>

                    <!-- Register Form -->
                    <div v-show="activeTab === 'register'" class="tab-pane">
                        <form ref="registerForm" @submit.prevent="handleRegister" class="needs-validation" novalidate>
                            <div class="form-group">
                                <label for="registerDienThoai">Phone Number <span class="required">*</span></label>
                                <div class="input-wrapper">
                                    <i class="bi bi-phone"></i>
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
                        <div class="toggle-text">
                            Already have an account?
                            <a href="#" @click.prevent="activeTab = 'login'">Log in here</a>
                        </div>
                    </div>
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
                toast.error('Please enter a valid 10-digit phone number and password.');
                return;
            }

            try {
                const response = await api.post('/auth/login', this.loginForm);
                const userData = response.data;
                localStorage.setItem('user', JSON.stringify(userData));
                toast.success('Logged in successfully!');
                setTimeout(() => {
                    if (userData.role === 'admin') {
                        this.$router.push('/admin');
                    } else {
                        this.$router.push('/');
                    }
                }, 1000);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    toast.error('Invalid phone number or password.');
                } else if (error.response && error.response.status === 404) {
                    toast.error('User not found.');
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
    background-image: url('https://i.pinimg.com/1200x/8e/ed/54/8eed548670f115f05ee16f55e6ca5e97.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-family: 'Inter', sans-serif;
    padding: 2rem;
    gap: 2rem;
    overflow: hidden;
}



.form-section {
    flex: 1;
    max-width: 450px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    width: 100%;
    background: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.card-header {
    background: #1A2A44;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    padding: 1.5rem;
    text-align: center;
}

.card-header h2 {
    color: #FFFFFF;
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.card-body {
    padding: 2.5rem;
}

.tab-pane {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.form-group label {
    color: #1A2A44;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.02em;
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
    font-size: 1.2rem;
    z-index: 1;
    transition: color 0.3s ease;
}

.form-group input,
.form-group select {
    background: #F5F5F5;
    border: 1px solid #6B7280;
    border-radius: 10px;
    padding: 0.85rem 1rem 0.85rem 3rem;
    color: #1A2A44;
    font-size: 0.95rem;
    width: 100%;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #F4A261;
    background: #FFFFFF;
    box-shadow: 0 0 0 4px rgba(244, 162, 97, 0.15);
}

.form-group input:focus+i,
.form-group select:focus+i {
    color: #F4A261;
}

.form-group input::placeholder {
    color: #6B7280;
    opacity: 0.7;
}

.invalid-feedback {
    color: #F4A261;
    font-size: 0.85rem;
    margin-top: 0.3rem;
    font-weight: 500;
}

.required {
    color: #F4A261;
    font-weight: 700;
}

.btn-primary {
    background: #F4A261;
    color: #FFFFFF;
    padding: 0.85rem;
    border-radius: 10px;
    border: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
}

.btn-primary:hover {
    background: #E76F51;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(231, 111, 81, 0.3);
}

.btn-primary::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
}

.btn-primary:hover::after {
    left: 100%;
}

.toggle-text {
    text-align: center;
    color: #1A2A44;
    font-size: 0.9rem;
}

.toggle-text a {
    color: #F4A261;
    font-weight: 600;
    text-decoration: none;
    transition: color 0.3s ease;
}

.toggle-text a:hover {
    color: #E76F51;
    text-decoration: underline;
}

</style>