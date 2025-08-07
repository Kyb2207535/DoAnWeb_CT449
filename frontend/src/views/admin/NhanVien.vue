<template>
    <div class="nhan-vien-container">
        <div class="header-container">
            <h2>EMPLOYEE MANAGEMENT</h2>
            <button class="btn-add" @click="openAddModal">
                <i class="bi bi-plus-circle me-1"></i> Add Employee
            </button>
        </div>
        <!-- Statistic Card -->
        <div class="stats-container">
            <div class="stat-card">
                <h4>Total Employees</h4>
                <p class="stat-value">{{ totalNhanVien }}</p>
            </div>
            <div class="stat-card">
                <h4>Librarians</h4>
                <p class="stat-value">{{ soNhanVienLibrarian }}</p>
            </div>
            <div class="stat-card">
                <h4>Assistants</h4>
                <p class="stat-value">{{ soNhanVienAssistant }}</p>
            </div>
        </div>
        <!-- Popup Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="resetForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ isEditing ? 'UPDATE EMPLOYEE' : 'ADD NEW EMPLOYEE' }}</h3>
                    <button class="btn-close" @click="resetForm"><i class="bi bi-x-lg"></i></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="form-grid">                    
                        <div class="form-group">
                            <label>Full Name <span class="required">*</span></label>
                            <input v-model="form.hoTen" type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Password <span class="required" v-if="!isEditing">*</span></label>
                            <input v-model="form.password" type="password" :required="!isEditing" minlength="6">
                        </div>
                        <div class="form-group">
                            <label>Position</label>
                            <select v-model="form.chucVu">
                                <option value="">-- Select --</option>
                                <option value="Librarian">Librarian</option>
                                <option value="Assistant">Assistant</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input v-model="form.soDienThoai" type="tel" pattern="[0-9]{10}">
                        </div>
                        <div class="form-group full-width">
                            <label>Address</label>
                            <textarea v-model="form.diaChi" rows="3"></textarea>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <i class="bi bi-save me-1"></i> {{ isEditing ? 'Update' : 'Add New' }}
                        </button>
                        <button v-if="isEditing" @click="resetForm" type="button" class="btn-secondary">
                            <i class="bi bi-x-circle me-1"></i> Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Table -->
        <div class="card">
            <div class="card-header">
                <span>EMPLOYEE LIST</span>
                <div class="search-container">
                    <i class="bi bi-search"></i>
                    <input v-model="searchQuery" type="text" placeholder="Search..." />
                </div>
            </div>
            <div class="table-responsive">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Employee ID</th>
                            <th>Full Name</th>
                            <th>Position</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(nhanVien, index) in filteredNhanVien" :key="nhanVien._id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ nhanVien.maNhanVien }}</td>
                            <td>{{ nhanVien.hoTen }}</td>
                            <td>{{ nhanVien.chucVu || 'N/A' }}</td>
                            <td>{{ nhanVien.soDienThoai || 'N/A' }}</td>
                            <td>{{ nhanVien.diaChi || 'N/A' }}</td>
                            <td>
                                <button @click="editNhanVien(nhanVien)" class="btn-icon btn-edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button @click="confirmDelete(nhanVien._id)" class="btn-icon btn-delete">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { api } from '@/api';

export default {
    name: 'EmployeeManagement',
    data() {
        return {
            nhanVienList: [],
            searchQuery: '',
            form: {
                maNhanVien: '',
                hoTen: '',
                password: '',
                chucVu: '',
                soDienThoai: '',
                diaChi: '',
            },
            isEditing: false,
            currentId: null,
            showModal: false,
            totalNhanVien: 0,
            soNhanVienLibrarian: 0,
            soNhanVienAssistant: 0,
        };
    },
    computed: {
        filteredNhanVien() {
            const query = this.searchQuery.toLowerCase();
            return this.nhanVienList.filter(nhanVien => {
                return (
                    nhanVien.maNhanVien.toLowerCase().includes(query) ||
                    nhanVien.hoTen.toLowerCase().includes(query) ||
                    nhanVien.soDienThoai?.toLowerCase().includes(query)
                );
            });
        },
    },
    created() {
        this.fetchNhanVien();
    },
    methods: {
        async fetchNhanVien() {
            try {
                const response = await api.get('/nhanvien');
                this.nhanVienList = response.data;
                this.totalNhanVien = response.data.length;
                this.soNhanVienLibrarian = response.data.filter(nv => nv.chucVu === 'Librarian').length;
                this.soNhanVienAssistant = response.data.filter(nv => nv.chucVu === 'Assistant').length;
                console.log('Fetched employees:', response.data);
            } catch (error) {
                this.showError('Error loading employee list', error);
            }
        },
        async handleSubmit() {
            try {
                // Validation
                if (!this.form.hoTen) {
                    toast.error('Please enter full name');
                    return;
                }
                if (!this.isEditing && !this.form.password) {
                    toast.error('Please enter password for new employee');
                    return;
                }
                if (this.form.soDienThoai && !/^[0-9]{10}$/.test(this.form.soDienThoai)) {
                    toast.error('Phone number must have 10 digits');
                    return;
                }

                // Create payload
                const payload = {
                    hoTen: this.form.hoTen,
                    ...(this.form.password && { password: this.form.password }), // Gửi password nếu có giá trị
                    ...(this.form.chucVu && { chucVu: this.form.chucVu }),
                    ...(this.form.soDienThoai && { soDienThoai: this.form.soDienThoai }),
                    ...(this.form.diaChi && { diaChi: this.form.diaChi })
                };

                console.log('Payload sent:', payload); // Debug payload

                if (this.isEditing) {
                    await api.put(`/nhanvien/${this.currentId}`, payload);
                    toast.success('Employee updated successfully');
                } else {
                    await api.post('/nhanvien', payload);
                    toast.success('Employee added successfully');
                }
                this.resetForm();
                await this.fetchNhanVien();
            } catch (error) {
                const errorMessage = error.response?.data?.error || 'Error saving employee';
                console.error('Error response:', error.response?.data);
                this.showError(errorMessage, error);
            }
        },
        editNhanVien(nhanVien) {
            this.form = {
                maNhanVien: nhanVien.maNhanVien,
                hoTen: nhanVien.hoTen,
                password: '',
                chucVu: nhanVien.chucVu || '',
                soDienThoai: nhanVien.soDienThoai || '',
                diaChi: nhanVien.diaChi || '',
            };
            this.isEditing = true;
            this.currentId = nhanVien._id;
            this.showModal = true;
        },
        confirmDelete(id) {
            if (confirm('Are you sure you want to delete this employee?')) {
                this.deleteNhanVien(id);
            }
        },
        async deleteNhanVien(id) {
            try {
                await api.delete(`/nhanvien/${id}`);
                toast.success('Employee deleted successfully');
                await this.fetchNhanVien();
            } catch (error) {
                this.showError('Error deleting employee', error);
            }
        },
        resetForm() {
            this.form = {
                maNhanVien: '',
                hoTen: '',
                password: '',
                chucVu: '',
                soDienThoai: '',
                diaChi: '',
            };
            this.isEditing = false;
            this.currentId = null;
            this.showModal = false;
        },
        openAddModal() {
            this.resetForm();
            this.showModal = true;
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US');
        },
        formatDateForInput(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        },
        showError(message, error) {
            toast.error(message);
            console.error('Full error:', error.response?.data);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            }
        },
    },
};
</script>
<style scoped src="@/assets/DocGia.css"></style>