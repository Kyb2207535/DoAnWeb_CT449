<template>
    <div class="publisher-container">
        <div class="header-container">
            <h2>BOOK PUBLISHER MANAGEMENT</h2>
            <button class="btn-add" @click="openAddModal">
                <i class="bi bi-plus-circle me-1"></i> Add Publisher
            </button>
        </div>
        <!-- Statistic Card -->
        <div class="stats-container">
            <div class="stat-card">
                <h4>Total Publishers</h4>
                <p class="stat-value">{{ totalNXB }}</p>
            </div>
        </div>

        <!-- Popup Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="resetForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ isEditing ? 'UPDATE PUBLISHER' : 'ADD NEW PUBLISHER' }}</h3>
                    <button class="btn-close" @click="resetForm"><i class="bi bi-x-lg"></i></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Publisher Name <span class="required">*</span></label>
                            <input v-model="form.tenNXB" type="text" required>
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
                <span>PUBLISHER LIST</span>
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
                            <th>Publisher Code</th>
                            <th>Publisher Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(nxb, index) in filteredNXB" :key="nxb._id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ nxb.maNXB }}</td>
                            <td>{{ nxb.tenNXB }}</td>
                            <td>{{ nxb.diaChi }}</td>
                            <td>
                                <button @click="editNXB(nxb)" class="btn-icon btn-edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button @click="confirmDelete(nxb._id)" class="btn-icon btn-delete">
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
import { api } from '@/api';
import { toast } from 'vue3-toastify';

export default {
    name: 'Publisher',
    data() {
        return {
            nxbList: [],
            searchQuery: '',
            form: {
                tenNXB: '',
                diaChi: ''
            },
            isEditing: false,
            currentId: null,
            showModal: false,
            totalNXB: 0
        }
    },
    computed: {
        filteredNXB() {
            const query = this.searchQuery.toLowerCase()
            return this.nxbList.filter(nxb => {
                return (
                    nxb.maNXB.toLowerCase().includes(query) ||
                    nxb.tenNXB.toLowerCase().includes(query) ||
                    nxb.diaChi?.toLowerCase().includes(query)
                )
            })
        }
    },
    created() {
        this.fetchNXB()
    },
    methods: {
        async fetchNXB() {
            try {
                const response = await api.get('/nhaxuatban');
                this.nxbList = response.data;
                this.totalNXB = response.data.length;
            } catch (error) {
                this.showError('Error loading publisher list', error);
            }
        },
        async handleSubmit() {
            try {
                if (this.isEditing) {
                    await api.put(`/nhaxuatban/${this.currentId}`, this.form);
                    toast.success('Publisher updated successfully');
                } else {
                    await api.post('/nhaxuatban', this.form);
                    toast.success('Publisher added successfully');
                }
                this.resetForm();
                await this.fetchNXB();
            } catch (error) {
                this.showError('Error saving data', error);
            }
        },
        editNXB(nxb) {
            this.form = {
                tenNXB: nxb.tenNXB,
                diaChi: nxb.diaChi
            };
            this.isEditing = true;
            this.currentId = nxb._id;
            this.showModal = true;
        },
        confirmDelete(id) {
            if (confirm('Are you sure you want to delete this publisher?')) {
                this.deleteNXB(id);
            }
        },
        async deleteNXB(id) {
            try {
                await api.delete(`/nhaxuatban/${id}`);
                toast.success('Publisher deleted successfully');
                await this.fetchNXB();
            } catch (error) {
                this.showError('Error deleting publisher', error);
            }
        },
        resetForm() {
            this.form = {
                tenNXB: '',
                diaChi: ''
            };
            this.isEditing = false;
            this.currentId = null;
            this.showModal = false;
        },
        openAddModal() {
            this.resetForm();
            this.showModal = true;
        },
        showError(message, error) {
            toast.error(message);
            console.error(error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            }
        }
    }
}
</script>
<style scoped src="@/assets/NhaXuatBan.css"></style>
