<template>
    <div class="user-muon-container">
        <div class="card">
            <div class="card-header">
                <h3>Borrowed Books</h3>
            </div>
            <div class="card-body">
                <div v-if="loading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else-if="borrowedBooks.length === 0" class="alert alert-info">
                    You are not currently borrowing any books.
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="book in borrowedBooks" :key="book.maSach + '-' + book.ngayMuon">
                                <td>{{ book.tenSach || 'N/A' }}</td>
                                <td>{{ book.tacGia || 'N/A' }}</td>
                                <td>{{ formatDate(book.ngayMuon) }}</td>
                                <td>{{ formatDate(book.ngayTra) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from '@/api';
import { toast } from 'vue3-toastify';

export default {
    name: 'UserMuon',
    data() {
        return {
            borrowedBooks: [],
            loading: false,
        };
    },
    async created() {
        await this.fetchBorrowedBooks();
    },
    methods: {
        async fetchBorrowedBooks() {
            this.loading = true;
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user || !user.maDocGia) {
                    toast.error('User is not logged in. Please log in again.');
                    setTimeout(() => {
                        this.$router.push('/');
                    }, 1500); 
                    return;
                }
                console.log('Lấy danh sách sách mượn cho maDocGia:', user.maDocGia);

                // Lấy bản ghi MuonTra của người dùng
                const response = await api.get(`/muontra?maDocGia=${user.maDocGia}`);
                console.log('Phản hồi MuonTra:', response.data);

                // Lọc bản ghi có ngayTraThucTe là null và đúng maDocGia
                const muonTraList = response.data.filter(muon => !muon.ngayTraThucTe && muon.maDocGia === user.maDocGia);
                console.log('Danh sách MuonTra đã lọc (đang mượn):', muonTraList);

                // Lấy thông tin sách cho mỗi bản ghi MuonTra
                this.borrowedBooks = await Promise.all(
                    muonTraList.map(async (muon) => {
                        try {
                            const bookResponse = await api.get(`/sach?maSach=${muon.maSach}`);
                            console.log(`Thông tin sách cho maSach ${muon.maSach}:`, bookResponse.data);
                            // Giả sử API trả về mảng, lấy sách đầu tiên khớp
                            const book = Array.isArray(bookResponse.data) ? bookResponse.data.find(b => b.maSach === muon.maSach) : bookResponse.data;
                            return {
                                maSach: book?.maSach || muon.maSach,
                                tenSach: book?.tenSach || 'N/A',
                                tacGia: book?.tacGia || 'N/A',
                                ngayMuon: muon.ngayMuon,
                                ngayTra: muon.ngayTra,
                            };
                        } catch (error) {
                            console.error(`Lỗi khi lấy thông tin sách cho maSach ${muon.maSach}:`, error);
                            return {
                                maSach: muon.maSach,
                                tenSach: 'N/A',
                                tacGia: 'N/A',
                                ngayMuon: muon.ngayMuon,
                                ngayTra: muon.ngayTra,
                            };
                        }
                    })
                );
                console.log('Danh sách borrowedBooks cuối cùng:', this.borrowedBooks);
            } catch (error) {
                toast.error('Unable to load loan list. Please try again..');
            } finally {
                this.loading = false;
            }
        }, 
        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
    },
};
</script>

<style scoped src="@/assets/UserMuon.css"></style>
