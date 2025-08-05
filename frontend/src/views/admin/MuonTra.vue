<template>
    <div class="muontra-container">
        <div class="header-container">
            <h2>BORROW MANAGEMENT</h2>
            <button class="btn-add" @click="openAddModal">
                <i class="bi bi-plus-circle me-1"></i> Add Borrow Record
            </button>
        </div>
        <!-- Statistic Cards -->
        <div class="stats-container">
            <div class="stat-card">
                <h4>Total Borrow Records</h4>
                <p class="stat-value">{{ totalMuonTra }}</p>
            </div>
            <div class="stat-card">
                <h4>Currently Borrowed Books</h4>
                <p class="stat-value">{{ currentlyBorrowed }}</p>
            </div>
        </div>
        <!-- Popup Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="resetForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>{{ isEditing ? 'Update Borrow Record' : 'Add New Borrow Record' }}</h3>
                    <button class="btn-close" @click="resetForm"><i class="bi bi-x-lg"></i></button>
                </div>
                <form @submit.prevent="handleSubmit">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Reader <span class="required">*</span></label>
                            <input v-model="readerSearch" type="text" placeholder="Search reader by name"
                                class="search-input" @input="debounceSearch('reader')">
                            <select v-model="form.maDocGia" required class="modern-select">
                                <option value="">Select Reader</option>
                                <option v-for="docgia in filteredDocGia" :key="docgia._id" :value="docgia.maDocGia">
                                    {{ docgia.hoLot }} {{ docgia.ten }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Books <span class="required">*</span></label>
                            <div class="book-selection">
                                <input v-model="bookSearch" type="text" placeholder="Search book by title"
                                    class="search-input" @input="debounceSearch('book')">
                                <select v-model="selectedBook" class="modern-select">
                                    <option value="">Select Book</option>
                                    <option v-for="sach in filteredSach" :key="sach._id" :value="sach.maSach">
                                        {{ sach.tenSach }}
                                    </option>
                                </select>
                                <button type="button" class="btn-add-book" @click="addBook" :disabled="!selectedBook">
                                    <i class="bi bi-plus-circle me-1"></i> Add Book
                                </button>
                            </div>
                            <div class="selected-books" v-if="form.maSach.length > 0">
                                <div v-for="(book, index) in form.maSach" :key="book" class="selected-book-item">
                                    {{ getBookName(book) }}
                                    <button type="button" class="btn-remove-book" @click="removeBook(index)">
                                        <i class="bi bi-x-circle"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Borrow Date <span class="required">*</span></label>
                            <input v-model="form.ngayMuon" type="date" required class="date-input">
                        </div>
                        <div class="form-group">
                            <label>Duration</label>
                            <input v-model.number="form.soNgayMuon" type="number" min="1" placeholder="Default: 7"
                                class="number-input">
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
                <span>BORROW RECORD LIST</span>
                <div class="header-actions">
                    <button class="btn-filter" @click="filterBorrowedBooks">
                        <i class="bi bi-filter me-1"></i> Borrowed Books
                    </button>
                    <div class="search-container">
                        <i class="bi bi-search"></i>
                        <input v-model="searchQuery" type="text" placeholder="Search by reader or book name..." />
                    </div>
                </div>
            </div>
            <div class="table-responsive">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Reader</th>
                            <th>Book</th>
                            <th>Borrow Date</th>
                            <th>Duration</th>
                            <th>Due Date</th>
                            <th>Returned</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(muontra, index) in filteredMuonTra" :key="muontra._id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ getReaderName(muontra.maDocGia) }}</td>
                            <td>{{ getBookName(muontra.maSach) }}</td>
                            <td>{{ formatDate(muontra.ngayMuon) }}</td>
                            <td>{{ muontra.soNgayMuon }}</td>
                            <td>{{ formatDate(muontra.ngayTra) }}</td>
                            <td>
                                <input type="checkbox" class="return-checkbox" :checked="!!muontra.ngayTraThucTe"
                                    @change="toggleReturnStatus(muontra._id, $event.target.checked)">
                            </td>
                            <td>
                                <button @click="editMuonTra(muontra)" class="btn-icon btn-edit">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button @click="confirmDelete(muontra._id)" class="btn-icon btn-delete">
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
import { debounce } from 'lodash';

export default defineComponent({
    name: 'MuonTra',
    data() {
        return {
            muontraList: [],
            docgiaList: [],
            sachList: [],
            searchQuery: '',
            readerSearch: '',
            bookSearch: '',
            selectedBook: '',
            showBorrowedOnly: false,
            form: {
                maDocGia: '',
                maSach: [],
                ngayMuon: '',
                soNgayMuon: 7
            },
            isEditing: false,
            currentId: null,
            showModal: false,
            totalMuonTra: 0
        };
    },
    computed: {
        filteredMuonTra() {
            const query = this.searchQuery.toLowerCase();
            return this.muontraList.filter(muontra => {
                const readerName = this.getReaderName(muontra.maDocGia)?.toLowerCase() || '';
                const bookName = this.getBookName(muontra.maSach)?.toLowerCase() || '';
                const matchesSearch = readerName.includes(query) || bookName.includes(query);
                const matchesBorrowedFilter = this.showBorrowedOnly ? !muontra.ngayTraThucTe : true;
                return matchesSearch && matchesBorrowedFilter;
            });
        },
        filteredDocGia() {
            const query = this.readerSearch.toLowerCase();
            return this.docgiaList.filter(docgia => {
                const fullName = `${docgia.hoLot} ${docgia.ten}`.toLowerCase();
                return fullName.includes(query);
            });
        },
        filteredSach() {
            const query = this.bookSearch.toLowerCase();
            return this.sachList.filter(sach => {
                return sach.tenSach.toLowerCase().includes(query);
            });
        },
        currentlyBorrowed() {
            return this.muontraList.filter(muontra => !muontra.ngayTraThucTe).length;
        }
    },
    created() {
        this.fetchMuonTra();
        this.fetchDocGia();
        this.fetchSach();
        this.debounceSearch = debounce((type) => {
            if (type === 'reader') this.readerSearch = this.readerSearch;
            if (type === 'book') this.bookSearch = this.bookSearch;
        }, 300);
    },
    methods: {
        async fetchMuonTra() {
            try {
                const response = await api.get('/muontra');
                this.muontraList = response.data;
                this.totalMuonTra = response.data.length;
            } catch (error) {
                this.showError('Error loading borrow record list', error);
            }
        },
        async fetchDocGia() {
            try {
                const response = await api.get('/docgia');
                this.docgiaList = response.data;
            } catch (error) {
                this.showError('Error loading reader list', error);
            }
        },
        async fetchSach() {
            try {
                const response = await api.get('/sach');
                this.sachList = response.data;
            } catch (error) {
                this.showError('Error loading book list', error);
            }
        },
        async handleSubmit() {
            try {
                if (this.isEditing) {
                    const payload = {
                        maDocGia: this.form.maDocGia,
                        maSach: this.form.maSach[0],
                        ngayMuon: this.form.ngayMuon,
                        soNgayMuon: this.form.soNgayMuon
                    };
                    await api.put(`/muontra/${this.currentId}`, payload);
                    toast.success('Borrow record updated successfully');
                } else {
                    for (const maSach of this.form.maSach) {
                        const payload = {
                            maDocGia: this.form.maDocGia,
                            maSach: maSach,
                            ngayMuon: this.form.ngayMuon,
                            soNgayMuon: this.form.soNgayMuon
                        };
                        await api.post('/muontra', payload);
                    }
                    toast.success('Borrow records added successfully');
                }
                this.resetForm();
                await this.fetchMuonTra();
            } catch (error) {
                this.showError('Error saving borrow record', error);
            }
        },
        async toggleReturnStatus(id, isReturned) {
            try {
                const muontra = this.muontraList.find(item => item._id === id);
                const payload = {
                    maDocGia: muontra.maDocGia,
                    maSach: muontra.maSach,
                    ngayMuon: muontra.ngayMuon,
                    soNgayMuon: muontra.soNgayMuon,
                    ngayTraThucTe: isReturned ? new Date().toISOString().split('T')[0] : null
                };
                await api.put(`/muontra/${id}`, payload);
                toast.success('Return status updated successfully');
                await this.fetchMuonTra();
            } catch (error) {
                this.showError('Error updating return status', error);
            }
        },
        addBook() {
            if (this.selectedBook && !this.form.maSach.includes(this.selectedBook)) {
                this.form.maSach.push(this.selectedBook);
                this.selectedBook = '';
                this.bookSearch = '';
            }
        },
        removeBook(index) {
            this.form.maSach.splice(index, 1);
        },
        editMuonTra(muontra) {
            this.form = {
                maDocGia: muontra.maDocGia,
                maSach: [muontra.maSach],
                ngayMuon: this.formatDateForInput(muontra.ngayMuon),
                soNgayMuon: muontra.soNgayMuon
            };
            this.isEditing = true;
            this.currentId = muontra._id;
            this.showModal = true;
        },
        filterBorrowedBooks() {
            this.showBorrowedOnly = !this.showBorrowedOnly;
            this.searchQuery = '';
        },
        confirmDelete(id) {
            if (confirm('Are you sure you want to delete this borrow record?')) {
                this.deleteMuonTra(id);
            }
        },
        async deleteMuonTra(id) {
            try {
                await api.delete(`/muontra/${id}`);
                toast.success('Borrow record deleted successfully');
                await this.fetchMuonTra();
            } catch (error) {
                this.showError('Error deleting borrow record', error);
            }
        },
        resetForm() {
            this.form = {
                maDocGia: '',
                maSach: [],
                ngayMuon: '',
                soNgayMuon: 7
            };
            this.readerSearch = '';
            this.bookSearch = '';
            this.selectedBook = '';
            this.isEditing = false;
            this.currentId = null;
            this.showModal = false;
        },
        openAddModal() {
            this.resetForm();
            this.showModal = true;
        },
        formatDate(dateString) {
            if (!dateString) return 'Not Returned';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US');
        },
        formatDateForInput(dateString) {
            if (!dateString || dateString === 'Not Returned') return null;
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        },
        getReaderName(maDocGia) {
            const docgia = this.docgiaList.find(docgia => docgia.maDocGia === maDocGia);
            return docgia ? `${docgia.hoLot} ${docgia.ten}` : 'Unknown';
        },
        getBookName(maSach) {
            const sach = this.sachList.find(sach => sach.maSach === maSach);
            return sach ? sach.tenSach : 'Unknown';
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
<style scoped src="@/assets/MuonTra.css"></style>