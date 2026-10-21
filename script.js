// ==========================================
// 1. DATA AWAL & INISIALISASI (LOCALSTORAGE)
// ==========================================

// Data bawaan jika belum ada data di browser
const defaultInventory = [
    { id: "B001", nama: "Minyak Goreng 2L", lokasi: "Rak-A1", stok: 12 },
    { id: "B002", nama: "Gula Pasir 1kg", lokasi: "Rak-A2", stok: 20 },
    { id: "B003", nama: "Beras 5kg", lokasi: "Rak-B1", stok: 5 },
    { id: "B004", nama: "Kecap Manis 520ml", lokasi: "Rak-B2", stok: 8 },
    { id: "B005", nama: "Sabun Cuci Piring", lokasi: "Rak-C1", stok: 15 },
    { id: "B006", nama: "Tepung Terigu 1kg", lokasi: "Rak-C2", stok: 10 }
];

// Ambil data dari LocalStorage atau gunakan data awal
let inventoryData = JSON.parse(localStorage.getItem('inventory_data')) || defaultInventory;

// Elemen DOM
const searchInput = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const totalItemsSpan = document.getElementById('totalItems');
const addItemForm = document.getElementById('addItemForm');

// ==========================================
// 2. FUNGSI UTAMA MANAJEMEN DATA & TAMPILAN
// ==========================================

// Simpan perubahan ke LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('inventory_data', JSON.stringify(inventoryData));
}

// Menampilkan data ke dalam tabel
function renderTable(dataToDisplay = inventoryData, highlightedId = null) {
    inventoryTableBody.innerHTML = '';
    totalItemsSpan.textContent = dataToDisplay.length;

    if (dataToDisplay.length === 0) {
        inventoryTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; color:#888;">Barang tidak ditemukan.</td>
            </tr>
        `;
        return;
    }

    dataToDisplay.forEach(item => {
        const row = document.createElement('tr');
        
        // Beri kelas khusus jika baris ini cocok dengan hasil pencarian utama
        if (item.id === highlightedId) {
            row.classList.add('highlight-row');
        }

        row.innerHTML = `
            <td><strong>${item.id}</strong></td>
            <td>${item.nama}</td>
            <td><span class="badge">${item.lokasi}</span></td>
            <td>${item.stok}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteItem('${item.id}')">Hapus</button>
            </td>
        `;
        inventoryTableBody.appendChild(row);
    });
}

// Reset semua sorotan di denah visual rak
function clearMapHighlights() {
    const shelfBoxes = document.querySelectorAll('.shelf-box');
    shelfBoxes.forEach(box => {
        box.classList.remove('active-shelf');
    });
}

// Menyorot rak di denah berdasarkan ID Rak
function highlightShelf(shelfId) {
    clearMapHighlights();
    if (!shelfId) return;

    const targetShelf = document.getElementById(shelfId);
    if (targetShelf) {
        targetShelf.classList.add('active-shelf');
    }
}

// ==========================================
// 3. FUNGSI PENCARIAN & INTERAKSI
// ==========================================

// Logika Pencarian
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (query === '') {
        renderTable(inventoryData);
        clearMapHighlights();
        return;
    }

    // Filter barang yang cocok dengan kata kunci
    const filteredResults = inventoryData.filter(item => 
        item.nama.toLowerCase().includes(query) || 
        item.id.toLowerCase().includes(query)
    );

    if (filteredResults.length > 0) {
        // Tampilkan hasil dan sorot rak dari barang pertama yang ditemukan
        const firstMatch = filteredResults[0];
        renderTable(filteredResults, firstMatch.id);
        highlightShelf(firstMatch.lokasi);
    } else {
        renderTable([]);
        clearMapHighlights();
    }
}

// Tambah Barang Baru
addItemForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const kode = document.getElementById('inputKode').value.trim().toUpperCase();
    const nama = document.getElementById('inputNama').value.trim();
    const lokasi = document.getElementById('selectRak').value;
    const stok = parseInt(document.getElementById('inputStok').value);

    // Cek apakah Kode sudah ada (jika ada, perbarui)
    const existingIndex = inventoryData.findIndex(item => item.id === kode);

    if (existingIndex !== -1) {
        inventoryData[existingIndex] = { id: kode, nama, lokasi, stok };
    } else {
        inventoryData.push({ id: kode, nama, lokasi, stok });
    }

    saveToLocalStorage();
    renderTable();
    addItemForm.reset();
    alert('Data barang berhasil disimpan!');
});

// Hapus Barang
function deleteItem(id) {
    if (confirm(`Yakin ingin menghapus barang dengan kode ${id}?`)) {
        inventoryData = inventoryData.filter(item => item.id !== id);
        saveToLocalStorage();
        handleSearch(); // Refresh tampilan berdasarkan status pencarian saat ini
    }
}

// ==========================================
// 4. EVENT LISTENERS & INITIALIZATION
// ==========================================

// Event listener untuk input pencarian secara langsung (live search)
searchInput.addEventListener('input', handleSearch);

// Event listener untuk tombol reset
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    renderTable(inventoryData);
    clearMapHighlights();
});

// Jalankan saat aplikasi pertama kali dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});
