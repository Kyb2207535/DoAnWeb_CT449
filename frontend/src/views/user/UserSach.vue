<template>
    <div class="userbook-container">
        <!-- Toggle Cart Button -->
        <button class="btn-toggle-cart" @click="toggleSidebar">
            <i class="bi bi-cart"></i> ({{ cart.length }})
        </button>

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
                        :alt="`Image of ${sach.tenSach}`" class="book-image" />
                    <span v-else class="no-image">No Image</span>
                </div>
                <div class="book-info">
                    <h3>{{ sach.tenSach }}</h3>
                    <p><strong>Author:</strong> {{ sach.tacGia || 'Unknown' }}</p>
                    <p><strong>Publisher:</strong> {{ getPublisherName(sach.maNXB) }}</p>
                    <p><strong>Status:</strong> {{ sach.soQuyen > 0 ? 'Available' : 'Borrowed' }}</p>
                </div>
                <button v-if="sach.soQuyen > 0" class="btn-borrow" @click="addToCart(sach.maSach)">
                    <i class="bi bi-book me-1"></i> Add to Cart
                </button>
                <button v-else class="btn-notify" :disabled="true">
                    Out of Book
                </button>
            </div>
        </div>

        <!-- Borrow Cart Sidebar -->
        <div class="borrow-cart-sidebar" :class="{ 'open': isSidebarOpen }">
            <div class="sidebar-header">
                <h3>Borrow Cart <span class="cart-count">({{ cart.length }})</span></h3>
                <button class="btn-close-sidebar" @click="toggleSidebar">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="sidebar-content">
                <div class="cart-items">
                    <div v-for="book in cart" :key="book.maSach" class="cart-item">
                        <div class="cart-item-image">
                            <img v-if="book.image"
                                :src="`http://localhost:3000/image/book_images/${encodeURIComponent(book.image)}`"
                                :alt="`Image of ${book.tenSach}`" />
                            <span v-else class="no-image">No Image</span>
                        </div>
                        <div class="cart-item-info">
                            <h4>{{ book.tenSach }}</h4>
                            <p>{{ book.tacGia || 'Unknown' }}</p>
                        </div>
                        <button class="btn-remove" @click="removeFromCart(book.maSach)">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <div v-if="cart.length === 0" class="empty-cart">
                        <p>Your cart is empty</p>
                    </div>
                </div>
                <div class="sidebar-footer" v-if="cart.length > 0">
                    <div class="borrow-duration">
                        <label for="borrow-days">Borrow Days:</label>
                        <input id="borrow-days" type="number" v-model.number="borrowDays" min="1" max="30"
                            placeholder="Borrow days" />
                    </div>
                    <p><strong>Total Books:</strong> {{ cart.length }}</p>
                    <button class="btn-confirm" @click="confirmBorrow">
                        <i class="bi bi-check-circle me-1"></i> Confirm Borrow
                    </button>
                </div>
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
            maDocGia: null,
            cart: [],
            isSidebarOpen: false,
            borrowDays: 7 // Default 7 days
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
                const matchesNXB = !this.selectedNXB || sach.maNXB === this.selectedNXB;
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
        addToCart(maSach) {
            if (!this.maDocGia) {
                toast.error('Please log in to add books');
                return;
            }
            const selectedBook = this.sachList.find(sach => sach.maSach === maSach);
            if (!selectedBook) return;

            const alreadyInCart = this.cart.some(book => book.maSach === maSach);
            if (alreadyInCart) {
                toast.info('Book already in cart');
                return;
            }

            this.cart.push(selectedBook);
            this.isSidebarOpen = true;
        },
        removeFromCart(maSach) {
            this.cart = this.cart.filter(book => book.maSach !== maSach);
        },
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        async confirmBorrow() {
            if (!this.maDocGia) {
                toast.error('Please log in to borrow');
                return;
            }

            if (this.cart.length === 0) {
                toast.info('No books in cart');
                return;
            }

            if (!this.borrowDays || this.borrowDays < 1 || this.borrowDays > 30) {
                toast.error('Borrow days must be between 1 and 30');
                return;
            }

            try {
                const borrowData = this.cart.map(book => ({
                    maDocGia: this.maDocGia,
                    maSach: book.maSach,
                    ngayMuon: new Date().toISOString().split('T')[0],
                    soNgayMuon: this.borrowDays
                }));

                await Promise.all(borrowData.map(data => api.post('/muontra', data)));

                toast.success('Successfully borrowed books');
                this.cart = [];
                this.isSidebarOpen = false;
                this.borrowDays = 7; // Reset to default
                await this.fetchSach();
            } catch (error) {
                this.showError('Error confirming borrow', error);
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
        }
    }
};
</script>

<style scoped src="@/assets/UserSach.css"></style>
