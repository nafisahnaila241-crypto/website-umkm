// js/app.js - P09: JavaScript fundamental dan data produk Kopakopi
// Satu file untuk semua halaman. Setiap bagian yang menyentuh DOM dicek dulu
// (if) supaya script ini aman dimuat di halaman mana pun tanpa error.

// ---------- 1. Data: array of object ----------
// const dipakai karena variabel ini tidak akan diisi ulang (isi array tetap bisa dibaca).
const STOK_MENIPIS = 5; // stok <= 5 dianggap terbatas

const produkUMKM = [
  {
    id: 1,
    nama: "Hazelnut Latte",
    kategori: "Minuman",
    harga: 25000,
    stok: 12,
    unggulan: true,
    deskripsi: "Perpaduan kopi dan susu dengan rasa kacang hazel yang manis.",
  },
  {
    id: 2,
    nama: "Cappuccino",
    kategori: "Minuman",
    harga: 22000,
    stok: 8,
    unggulan: true,
    deskripsi: "Perpaduan espresso, susu, dan foam yang lembut dengan rasa creamy yang nikmat.",
  },
  {
    id: 3,
    nama: "Butterscotch Latte",
    kategori: "Minuman",
    harga: 30000,
    stok: 3,
    unggulan: true,
    deskripsi: "Perpaduan kopi dan susu dengan rasa gula merah dan mentega yang manis serta creamy.",
  },
  {
    id: 4,
    nama: "Kopi Arabika 500 gram",
    kategori: "Biji kopi",
    harga: 204000,
    stok: 9,
    unggulan: false,
    deskripsi: "Biji kopi arabika untuk seduh harian di rumah atau kantor.",
  },
  {
    id: 5,
    nama: "Kopi Robusta 250 gram",
    kategori: "Biji kopi",
    harga: 50000,
    stok: 0,
    unggulan: false,
    deskripsi: "Biji kopi robusta dengan body kuat untuk pencinta kopi pekat.",
  },
  {
    id: 6,
    nama: "Hazelnut Latte Botol 1 Liter",
    kategori: "Minuman",
    harga: 85000,
    stok: 6,
    unggulan: false,
    deskripsi: "Hazelnut latte kemasan botol besar untuk dibagi bersama.",
  },
];

// ---------- 2. Fungsi bantu (operator + conditional) ----------
function formatRupiah(angka) {
  return `Rp${angka.toLocaleString("id-ID")}`;
}

// Conditional 1: status stok (if / else if / else)
function getStatusStok(stok) {
  if (stok === 0) {
    return { teks: "Habis", kelas: "habis" };
  } else if (stok <= STOK_MENIPIS) {
    return { teks: `Stok terbatas (${stok})`, kelas: "terbatas" };
  }
  return { teks: `Tersedia (${stok})`, kelas: "tersedia" };
}

// Conditional 2: label produk unggulan (operator ternary)
function getLabelUnggulan(produk) {
  return produk.unggulan ? `<span class="badge badge--unggulan">Bestseller</span>` : "";
}

// ---------- 3. Menyusun output dengan template literal ----------
function buatKartuProduk(produk) {
  const status = getStatusStok(produk.stok);
  return `
    <article class="product-card">
      <p class="meta">${produk.kategori}</p>
      <h3>${produk.nama}</h3>
      <p class="badges">
        ${getLabelUnggulan(produk)}
        <span class="badge badge--${status.kelas}">${status.teks}</span>
      </p>
      <p>${produk.deskripsi}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
    </article>`;
}

function renderProduk(wadah, daftar) {
  let html = ""; // let karena nilainya ditambah di dalam perulangan
  for (const produk of daftar) {
    html += buatKartuProduk(produk);
  }
  wadah.innerHTML = html;
}

// ---------- 4. Render ke DOM (hanya jika elemennya ada di halaman) ----------
// Halaman utama: hanya produk unggulan
const wadahBestseller = document.querySelector("#daftar-bestseller");
if (wadahBestseller) {
  const produkUnggulan = [];
  for (const produk of produkUMKM) {
    if (produk.unggulan) {
      produkUnggulan.push(produk);
    }
  }
  renderProduk(wadahBestseller, produkUnggulan);
}

// Halaman produk: semua produk + ringkasan
const wadahKatalog = document.querySelector("#produk-dinamis");
if (wadahKatalog) {
  renderProduk(wadahKatalog, produkUMKM);
}

let jumlahTersedia = 0;
let jumlahHabis = 0;
let nilaiStok = 0;
for (const produk of produkUMKM) {
  if (produk.stok > 0) {
    jumlahTersedia += 1;
  } else {
    jumlahHabis += 1;
  }
  nilaiStok += produk.harga * produk.stok;
}
const rataHarga = produkUMKM.reduce((total, p) => total + p.harga, 0) / produkUMKM.length;

const ringkasan = document.querySelector("#ringkasan-produk");
if (ringkasan) {
  ringkasan.textContent = `${produkUMKM.length} produk: ${jumlahTersedia} tersedia, ${jumlahHabis} habis.`;
}

// ---------- 5. Debugging lewat Console ----------
console.table(produkUMKM);
console.log(`Ringkasan: ${jumlahTersedia} tersedia, ${jumlahHabis} habis.`);
console.log(`Nilai stok: ${formatRupiah(nilaiStok)} | Rata-rata harga: ${formatRupiah(Math.round(rataHarga))}`);