<template>
    <div class="userbook-container">
        <!-- Search and Filter -->
        <div class="search-filter-container">
            <div class="search-container">
                <i class="bi bi-search"></i>
                <input v-model="searchQuery" type="text" placeholder="Search by book name or author..." />
            </div>
            <div class="filter-container">
                <label>Publisher</label>
                <select v-model="selectedNXB">
                    <option value="">All Publishers</option>
                    <option v-for="nxb in nxbList" :key="nxb._id" :value="nxb.maNXB">
                        {{ nxb.tenNXB }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Book List -->
        <div class="book-grid">
            <div v-for="sach in filteredSach" :key="sach._id" class="book-card">
                <div class="book-info">
                    <h3>{{ sach.tenSach }}</h3>
                    <p><strong>Author:</strong> {{ sach.tacGia || 'Unknown' }}</p>
                    <p><strong>Publisher:</strong> {{ getPublisherName(sach.maNXB) }}</p>
                    <p><strong>Status:</strong> {{ sach.soQuyen > 0 ? 'Available' : 'Borrowed' }}</p>
                </div>
                <button v-if="sach.soQuyen > 0" class="btn-borrow" @click="borrowBook(sach.maSach)">
                    <i class="bi bi-book me-1"></i> Borrow
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from '@/api';
import { toast } from 'vue3-toastify';

export default {
    name: 'UserSach',
    data() {
        return {
            sachList: [],
            nxbList: [],
            searchQuery: '',
            selectedNXB: '',
            maDocGia: null
        };
    },
    computed: {
        filteredSach() {
            const query = this.searchQuery.toLowerCase();
            return this.sachList.filter(sach => {
                const matchesSearch =
                    sach.tenSach.toLowerCase().includes(query) ||
                    (sach.tacGia && sach.tacGia.toLowerCase().includes(query));
                const matchesNXB =
                    !this.selectedNXB || sach.maNXB === this.selectedNXB;
                return matchesSearch && matchesNXB;
            });
        }
    },
    created() {
        this.fetchSach();
        this.fetchNXB();
        this.loadUser();
    },
    methods: {
        async fetchSach() {
            try {
                const response = await api.get('/sach');
                this.sachList = response.data;
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
        loadUser() {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            this.maDocGia = user.maDocGia || null;
        },
        async borrowBook(maSach) {
            if (!this.maDocGia) {
                toast.error('Please log in to borrow books');
                return;
            }
            try {
                const borrowData = {
                    maDocGia: this.maDocGia,
                    maSach,
                    ngayMuon: new Date().toISOString().split('T')[0],
                    soNgayMuon: 7
                };
                await api.post('/muontra', borrowData);
                toast.success('Borrow request sent successfully');
                await this.fetchSach();
            } catch (error) {
                this.showError('Error sending borrow request', error);
            }
        },
        getPublisherName(maNXB) {
            const nxb = this.nxbList.find(nxb => nxb.maNXB === maNXB);
            return nxb ? nxb.tenNXB : 'Unknown';
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

<style scoped>
.userbook-container {
    padding: 2rem;
    max-width: 1280px;
    margin: 0 auto;
    background: #F5F5F5;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
}

.search-filter-container {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    background: #FFFFFF;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    flex-wrap: wrap;
}

.search-container {
    position: relative;
    flex: 1;
    min-width: 250px;
}

.search-container i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #60A5FA;
    font-size: 1.1rem;
}

.search-container input {
    background: #F8FAFC;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    padding: 0.85rem 1rem 0.85rem 2.75rem;
    color: #1A2A44;
    width: 100%;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-container input:focus {
    outline: none;
    border-color: #60A5FA;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.search-container input::placeholder {
    color: #9CA3AF;
    opacity: 0.8;
}

.filter-container {
    display: flex;
    flex-direction: column;
    min-width: 220px;
}

.filter-container label {
    color: #6B7280;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.95rem;
}

.filter-container select {
    background: #F8FAFC;
    border: 1px solid #E5E7EB;
    border-radius: 10px;
    padding: 0.85rem;
    color: #1A2A44;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.filter-container select:focus {
    outline: none;
    border-color: #60A5FA;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
}

.book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.75rem;
    padding: 1rem;
}

.book-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 1.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s ease;
    border: 1px solid #F3F4F6;
}

.book-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: #60A5FA;
}

.book-info h3 {
    color: #1A2A44;
    margin: 0 0 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.3;
}

.book-info p {
    color: #6B7280;
    margin: 0.6rem 0;
    font-size: 0.95rem;
    line-height: 1.5;
}

.book-info p strong {
    color: #1A2A44;
}

.btn-borrow {
    background: #F4A261;
    color: #FFFFFF;
    padding: 0.85rem 1.75rem;
    border-radius: 10px;
    border: none;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    align-self: flex-end;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-borrow:hover {
    background: #E76F51;
    color: #FFFFFF;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(231, 111, 81, 0.3);
}

.btn-borrow i {
    font-size: 1rem;
}
</style>