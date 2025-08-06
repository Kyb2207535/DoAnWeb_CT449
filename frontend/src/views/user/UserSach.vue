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
                <div class="book-image-container">
                    <img v-if="sach.image"
                        :src="`http://localhost:3000/image/book_images/${encodeURIComponent(sach.image)}`"
                        :alt="`Image of ${sach.tenSach}`" class="book-image">
                    <span v-else class="no-image">No Image</span>
                </div>
                <div class="book-info">
                    <h3>{{ sach.tenSach }}</h3>
                    <p><strong>Author:</strong> {{ sach.tacGia || 'Unknown' }}</p>
                    <p><strong>Publisher:</strong> {{ getPublisherName(sach.maNXB) }}</p>
                    <p><strong>Status:</strong> {{ sach.soQuyen > 0 ? 'Available' : 'Borrowed' }}</p>
                </div>
                <button v-if="sach.soQuyen > 0" class="btn-borrow" @click="borrowBook(sach.maSach)">
                    <i class="bi bi-book me-1"></i> Borrow
                </button>
                <button v-else class="btn-notify" :disabled="true"> Out of Book </button>
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
                if (!sach || !sach.tenSach || !sach.maSach) return false;
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
                this.sachList = response.data.filter(sach => sach && sach.tenSach && sach.maSach);
                console.log('Sach list with images:', this.sachList.map(s => ({ tenSach: s.tenSach, image: s.image })));
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
            const nxb = this.nxbList.find(nxb => nxb && nxb.maNXB === maNXB);
            return nxb ? nxb.tenNXB : 'Unknown';
        },
        showError(message, error) {
            toast.error(message);
            console.error(error);
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
            }
        },
    }
}
</script>
<style scoped src="@/assets/UserSach.css"></style>
