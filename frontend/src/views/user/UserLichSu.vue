<template>
    <div class="user-lichsu-container">
        <div class="card">
            <div class="card-header">
                <h3>Book Borrowing History</h3>
            </div>
            <div class="card-body">
                <div v-if="loading" class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <div v-else-if="history.length === 0" class="alert alert-info">
                    You have no book borrowing history.
                </div>
                <div v-else class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Borrow Date</th>
                                <th>Due Date</th>
                                <th>Actual Return Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="record in history" :key="`${record.maSach}-${record.ngayMuon}`">
                                <td>{{ record.tenSach }}</td>
                                <td>{{ record.tacGia }}</td>
                                <td>{{ formatDate(record.ngayMuon) }}</td>
                                <td>{{ formatDate(record.ngayTra) }}</td>
                                <td>{{ formatDate(record.ngayTraThucTe) || 'Not Returned' }}</td>
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
    name: 'UserLichSu',
    data() {
        return {
            history: [],
            loading: false,
        };
    },
    async created() {
        await this.fetchBorrowingHistory();
    },
    methods: {
        async fetchBorrowingHistory() {
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

                // Fetch all muontra records and filter by maDocGia
                const response = await api.get(`/muontra`);
                const muonTraList = response.data.filter(muon => muon.maDocGia === user.maDocGia);

                // Fetch book details for each muontra record
                this.history = await Promise.all(
                    muonTraList.map(async (muon) => {
                        try {
                            const bookResponse = await api.get(`/sach?maSach=${muon.maSach}`);
                            console.log(`Book information for maSach ${muon.maSach}:`, bookResponse.data);
                            // Assume API returns an array, take the first matching book
                            const book = Array.isArray(bookResponse.data) ? bookResponse.data.find(b => b.maSach === muon.maSach) : bookResponse.data;
                            return {
                                maSach: book?.maSach || muon.maSach,
                                tenSach: book?.tenSach || 'N/A',
                                tacGia: book?.tacGia || 'N/A',
                                ngayMuon: muon.ngayMuon,
                                ngayTra: muon.ngayTra,
                                ngayTraThucTe: muon.ngayTraThucTe,
                            };
                        } catch (error) {
                            console.error(`Error fetching book information for maSach ${muon.maSach}:`, error);
                            return {
                                maSach: muon.maSach,
                                tenSach: 'N/A',
                                tacGia: 'N/A',
                                ngayMuon: muon.ngayMuon,
                                ngayTra: muon.ngayTra,
                                ngayTraThucTe: muon.ngayTraThucTe,
                            };
                        }
                    })
                );
            } catch (error) {
                console.error('Error fetching borrowing history:', error.response?.data || error.message);
                toast.error('Unable to load borrowing history. Please try again.');
            } finally {
                this.loading = false;
            }
        },
        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
    },
};
</script>
<style scoped src="@/assets/UserLichSu.css"></style>
