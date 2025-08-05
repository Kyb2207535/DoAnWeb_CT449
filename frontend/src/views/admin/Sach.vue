<template>
    <div class="sach-container">
        <div class="header-container">
            <h2>BOOK MANAGEMENT</h2>
            <button class="btn-add" @click="openAddModal">
                <i class="bi bi-plus-circle me-1"></i> Add Book
            </button>
        </div>

        <!-- Statistic Card -->
        <div class="stats-container">
            <div class="stat-card">
                <h4>Total Books by Titles</h4>
                <p class="stat-value">{{ totalSachTheoDauMuc }}</p>
            </div>
            <div class="stat-card">
                <h4>Total Books</h4>
                <p class="stat-value">{{ totalSach }}</p>
            </div>
        </div>

        <!-- Popup Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="resetForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ isEditing ? 'UPDATE BOOK' : 'ADD NEW BOOK' }}</h3>
                    <button class="btn-close" @click="resetForm"><i class="bi bi-x-lg"></i></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Book Name <span class="required">*</span></label>
                            <input v-model="form.tenSach" type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Price</label>
                            <input v-model.number="form.donGia" type="number" min="0">
                        </div>
                        <div class="form-group">
                            <label>Quantity</label>
                            <input v-model.number="form.soQuyen" type="number" min="0">
                        </div>
                        <div class="form-group">
                            <label>Publication Year</label>
                            <input v-model.number="form.namXuatBan" type="number" min="1900" :max="currentYear">
                        </div>
                        <div class="form-group">
                            <label>Publisher</label>
                            <select v-model="form.maNXB">
                                <option value="">-- Select --</option>
                                <option v-for="nxb in nxbList" :key="nxb._id" :value="nxb.maNXB">{{ nxb.tenNXB }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group full-width">
                            <label>Author</label>
                            <input v-model="form.tacGia" type="text">
                        </div>
                        <div class="form-group full-width">
                            <label>Book Image</label>
                            <input type="file" accept="image/*" @change="handleImageUpload" class="image-input">
                            <div v-if="imagePreview || form.image" class="image-preview">
                                <img :src="imagePreview || `/image/book_images/${form.image}`" alt="Book Image">
                                <button v-if="form.image" type="button" class="btn-remove-image" @click="removeImage">
                                    <i class="bi bi-trash"></i> Remove Image
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            <i class="bi bi-save me-1"></i> {{ isEditing ? 'Update' : 'Add' }}
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
                <span>BOOK LIST</span>
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
                            <!-- <th>Image</th> -->
                            <th>Book Code</th>
                            <th>Book Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Pub. Year</th>
                            <th>Publisher</th>
                            <th>Author</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(sach, index) in filteredSach" :key="sach._id">
                            <td>{{ index + 1 }}</td>
                            <!-- <td>
                                <img v-if="sach.image" :src="`/image/book_images/${sach.image}`" alt="Book Image"
                                    class="book-image">
                                <span v-else>No Image</span>
                            </td> -->
                            <td>{{ sach.maSach }}</td>
                            <td>{{ sach.tenSach }}</td>
                            <td>{{ formatCurrency(sach.donGia) }}</td>
                            <td>{{ sach.soQuyen }}</td>
                            <td>{{ sach.namXuatBan }}</td>
                            <td>{{ getPublisherName(sach.maNXB) }}</td>
                            <td>{{ sach.tacGia }}</td>
                            <td>
                                <button @click="editSach(sach)" class="btn-icon btn-edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button @click="confirmDelete(sach._id)" class="btn-icon btn-delete">
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
import { defineComponent } from 'vue';
import { api } from '@/api';
import { toast } from 'vue3-toastify';

export default defineComponent({
    name: 'SachPage',
    data() {
        return {
            sachList: [],
            nxbList: [],
            searchQuery: '',
            form: {
                tenSach: '',
                donGia: '',
                soQuyen: '',
                namXuatBan: '',
                maNXB: '',
                tacGia: '',
                image: ''
            },
            imagePreview: '',
            isEditing: false,
            currentId: null,
            showModal: false,
            totalSachTheoDauMuc: 0,
            totalSach: 0
        };
    },
    computed: {
        filteredSach() {
            const query = this.searchQuery.toLowerCase();
            return this.sachList.filter(sach => {
                return (
                    sach.maSach.toLowerCase().includes(query) ||
                    sach.tenSach.toLowerCase().includes(query) ||
                    sach.tacGia?.toLowerCase().includes(query) ||
                    this.getPublisherName(sach.maNXB)?.toLowerCase().includes(query)
                );
            });
        },
        currentYear() {
            return new Date().getFullYear();
        }
    },
    created() {
        this.fetchSach();
        this.fetchNXB();
    },
    methods: {
        async fetchSach() {
            try {
                const response = await api.get('/sach');
                this.sachList = response.data;
                this.totalSachTheoDauMuc = response.data.length;
                this.totalSach = response.data.reduce((total, sach) => total + sach.soQuyen, 0);
            } catch (error) {
                this.showError('Error loading book list', error);
            }
        },
        async fetchNXB() {
            try {
                const response = await api.get('/nhaxuatban');
                this.nxbList = response.data;
            } catch (error) {
                this.showError('Error loading publisher list', error);
            }
        },
        async handleSubmit() {
            try {
                const formData = new FormData();
                formData.append('tenSach', this.form.tenSach);
                formData.append('donGia', this.form.donGia);
                formData.append('soQuyen', this.form.soQuyen);
                formData.append('namXuatBan', this.form.namXuatBan);
                formData.append('maNXB', this.form.maNXB);
                formData.append('tacGia', this.form.tacGia);
                if (this.imagePreview) {
                    formData.append('image', this.form.imageFile);
                } else if (this.form.image) {
                    formData.append('image', this.form.image);
                }

                if (this.isEditing) {
                    await api.put(`/sach/${this.currentId}`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    toast.success('Book updated successfully');
                } else {
                    await api.post('/sach', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    toast.success('Book added successfully');
                }
                this.resetForm();
                await this.fetchSach();
            } catch (error) {
                this.showError('Error saving book data', error);
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.form.imageFile = file;
                this.imagePreview = URL.createObjectURL(file);
                this.form.image = file.name;
            }
        },
        removeImage() {
            this.form.image = '';
            this.form.imageFile = null;
            this.imagePreview = '';
        },
        editSach(sach) {
            this.form = {
                tenSach: sach.tenSach,
                donGia: sach.donGia,
                soQuyen: sach.soQuyen,
                namXuatBan: sach.namXuatBan,
                maNXB: sach.maNXB,
                tacGia: sach.tacGia,
                image: sach.image || '',
                imageFile: null
            };
            this.imagePreview = '';
            this.isEditing = true;
            this.currentId = sach._id;
            this.showModal = true;
        },
        confirmDelete(id) {
            if (confirm('Are you sure you want to delete this book?')) {
                this.deleteSach(id);
            }
        },
        async deleteSach(id) {
            try {
                await api.delete(`/sach/${id}`);
                toast.success('Book deleted successfully');
                await this.fetchSach();
            } catch (error) {
                this.showError('Error deleting book', error);
            }
        },
        resetForm() {
            this.form = {
                tenSach: '',
                donGia: '',
                soQuyen: '',
                namXuatBan: '',
                maNXB: '',
                tacGia: '',
                image: '',
                imageFile: null
            };
            this.imagePreview = '';
            this.isEditing = false;
            this.currentId = null;
            this.showModal = false;
        },
        openAddModal() {
            this.resetForm();
            this.showModal = true;
        },
        formatCurrency(value) {
            if (!value) return '';
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'VND' }).format(value);
        },
        getPublisherName(maNXB) {
            const nxb = this.nxbList.find(nxb => nxb.maNXB === maNXB);
            return nxb ? nxb.tenNXB : '';
        },
        showError(message, error) {
            toast.error(message);
            console.error(error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            }
        }
    }
});
</script>
<style scoped src="@/assets/Sach.css"></style>
