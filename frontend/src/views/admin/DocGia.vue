<template>
    <div class="reader-container">
        <div class="header-container">
            <h2>READER MANAGEMENT</h2>
            <button class="btn-add" @click="openAddModal">
                <i class="bi bi-plus-circle me-1"></i> Add Reader
            </button>
        </div>
        <!-- <div class="stats-container">
            <div class="stat-card">
                <h4>Total Readers</h4>
                <p class="stat-value">{{ totalDocGia }}</p>
            </div>
        </div> -->
        <!-- Popup Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="resetForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ isEditing ? 'UPDATE READER' : 'ADD NEW READER' }}</h3>
                    <button class="btn-close" @click="resetForm"><i class="bi bi-x-lg"></i></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Reader ID <span class="required">*</span></label>
                            <input v-model="form.maDocGia" type="text" :readonly="isEditing" required>
                        </div>
                        <div class="form-group">
                            <label>Middle Name</label>
                            <input v-model="form.hoLot" type="text">
                        </div>
                        <div class="form-group">
                            <label>First Name <span class="required">*</span></label>
                            <input v-model="form.ten" type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Date of Birth</label>
                            <input v-model="form.ngaySinh" type="date">
                        </div>
                        <div class="form-group">
                            <label>Gender</label>
                            <select v-model="form.phai">
                                <option value="">-- Select --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input v-model="form.dienThoai" type="tel">
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
                <span>READER LIST</span>
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
                            <th>Reader ID</th>
                            <th>Full Name</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(docgia, index) in filteredDocGia" :key="docgia._id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ docgia.maDocGia }}</td>
                            <td>{{ docgia.hoLot }} {{ docgia.ten }}</td>
                            <td>{{ formatDate(docgia.ngaySinh) }}</td>
                            <td>{{ docgia.phai }}</td>
                            <td>{{ docgia.dienThoai }}</td>
                            <td>
                                <button @click="editDocGia(docgia)" class="btn-icon btn-edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button @click="confirmDelete(docgia._id)" class="btn-icon btn-delete">
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
import axios from 'axios'
import { toast } from 'vue3-toastify'

export default {
    name: 'ReaderPage',
    data() {
        return {
            docgiaList: [],
            searchQuery: '',
            form: {
                maDocGia: '',
                hoLot: '',
                ten: '',
                ngaySinh: '',
                phai: '',
                diaChi: '',
                dienThoai: ''
            },
            isEditing: false,
            currentId: null,
            showModal: false,
            totalDocGia: 0
        }
    },
    computed: {
        filteredDocGia() {
            const query = this.searchQuery.toLowerCase()
            return this.docgiaList.filter(docgia => {
                return (
                    docgia.maDocGia.toLowerCase().includes(query) ||
                    (docgia.hoLot + ' ' + docgia.ten).toLowerCase().includes(query) ||
                    docgia.dienThoai?.toLowerCase().includes(query)
                )
            })
        }
    },
    created() {
        this.fetchDocGia()
    },
    methods: {
        async fetchDocGia() {
            try {
                const response = await axios.get('http://localhost:3000/api/docgia')
                this.docgiaList = response.data
                this.totalDocGia = response.data.length
            } catch (error) {
                this.showError('Error loading reader list', error)
            }
        },
        async handleSubmit() {
            try {
                if (this.isEditing) {
                    await axios.put(`http://localhost:3000/api/docgia/${this.currentId}`, this.form)
                    toast.success('Reader updated successfully')
                } else {
                    await axios.post('http://localhost:3000/api/docgia', this.form)
                    toast.success('Reader added successfully')
                }
                this.resetForm()
                await this.fetchDocGia()
            } catch (error) {
                this.showError('Error saving data', error)
            }
        },
        editDocGia(docgia) {
            this.form = {
                maDocGia: docgia.maDocGia,
                hoLot: docgia.hoLot,
                ten: docgia.ten,
                ngaySinh: this.formatDateForInput(docgia.ngaySinh),
                phai: docgia.phai,
                diaChi: docgia.diaChi,
                dienThoai: docgia.dienThoai
            }
            this.isEditing = true
            this.currentId = docgia._id
            this.showModal = true
        },
        confirmDelete(id) {
            if (confirm('Are you sure you want to delete this reader?')) {
                this.deleteDocGia(id)
            }
        },
        async deleteDocGia(id) {
            try {
                await axios.delete(`http://localhost:3000/api/docgia/${id}`)
                toast.success('Reader deleted successfully')
                await this.fetchDocGia()
            } catch (error) {
                this.showError('Error deleting reader', error)
            }
        },
        resetForm() {
            this.form = {
                maDocGia: '',
                hoLot: '',
                ten: '',
                ngaySinh: '',
                phai: '',
                diaChi: '',
                dienThoai: ''
            }
            this.isEditing = false
            this.currentId = null
            this.showModal = false
        },
        openAddModal() {
            this.resetForm()
            this.showModal = true
        },
        formatDate(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US')
        },
        formatDateForInput(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toISOString().split('T')[0]
        },
        showError(message, error) {
            toast.error(message)
            console.error(error)
            if (error.response?.data?.error) {
                toast.error(error.response.data.error)
            }
        }
    }
}
</script>
<style scoped src="@/assets/DocGia.css"></style>