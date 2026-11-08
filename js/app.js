// ---------- 0. Menu hamburger  ----------
const tombolMenu = document.querySelector(".nav-toggle");
const daftarMenu = document.querySelector("#menu-utama");

function aturMenu(buka) {
  daftarMenu.classList.toggle("is-open", buka);
  tombolMenu.setAttribute("aria-expanded", String(buka));
  tombolMenu.setAttribute("aria-label", buka ? "Tutup menu" : "Buka menu");
}

if (tombolMenu && daftarMenu) {
  tombolMenu.addEventListener("click", () => {
    aturMenu(!daftarMenu.classList.contains("is-open"));
  });
  // Tombol Escape menutup menu dan mengembalikan fokus ke tombol
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && daftarMenu.classList.contains("is-open")) {
      aturMenu(false);
      tombolMenu.focus();
    }
  });
}

// ---------- 1. Data: array of object ----------
const STOK_MENIPIS = 5; // stok <= 5 dianggap terbatas

const produkUMKM = [
  { id: 1, nama: "Hazelnut Latte", kategori: "Minuman", harga: 25000, stok: 12, unggulan: true,
    deskripsi: "Perpaduan kopi dan susu dengan rasa kacang hazel yang manis." },
  { id: 2, nama: "Cappuccino", kategori: "Minuman", harga: 22000, stok: 8, unggulan: true,
    deskripsi: "Perpaduan espresso, susu, dan foam yang lembut dengan rasa creamy yang nikmat." },
  { id: 3, nama: "Butterscotch Latte", kategori: "Minuman", harga: 30000, stok: 3, unggulan: true,
    deskripsi: "Perpaduan kopi dan susu dengan rasa gula merah dan mentega yang manis serta creamy." },
  { id: 4, nama: "Kopi Arabika 500 gram", kategori: "Biji kopi", harga: 204000, stok: 9, unggulan: false,
    deskripsi: "Biji kopi arabika untuk seduh harian di rumah atau kantor." },
  { id: 5, nama: "Kopi Robusta 250 gram", kategori: "Biji kopi", harga: 50000, stok: 0, unggulan: false,
    deskripsi: "Biji kopi robusta dengan body kuat untuk pencinta kopi pekat." },
  { id: 6, nama: "Hazelnut Latte Botol 1 Liter", kategori: "Minuman", harga: 85000, stok: 6, unggulan: false,
    deskripsi: "Hazelnut latte kemasan botol besar untuk dibagi bersama." },
];

// ---------- 2. Function ----------
// Input: angka. Return: teks rupiah. Efek samping: tidak ada.
function formatRupiah(nilai) {
  return `Rp${nilai.toLocaleString("id-ID")}`;
}

// Input: stok (angka). Return: object { label, kelas }. Efek samping: tidak ada.
function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", kelas: "habis" };
  } else if (stok <= STOK_MENIPIS) {
    return { label: `Stok terbatas (${stok})`, kelas: "terbatas" };
  }
  return { label: `Tersedia (${stok})`, kelas: "tersedia" };
}

// Input: satu object produk. Return: string markup kartu. Efek samping: tidak ada.
function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const labelUnggulan = produk.unggulan ? `<span class="badge badge--unggulan">Bestseller</span>` : "";
  return `
    <article class="product-card">
      <p class="meta">${produk.kategori}</p>
      <h3>${produk.nama}</h3>
      <p class="badges">
        ${labelUnggulan}
        <span class="badge badge--${status.kelas}">${status.label}</span>
      </p>
      <p>${produk.deskripsi}</p>
      <p class="price">${formatRupiah(produk.harga)}</p>
    </article>`;
}

// filter: ambil beberapa elemen yang memenuhi syarat (hasilnya array baru)
function filterTersedia(daftar) {
  return daftar.filter((produk) => produk.stok > 0);
}

// find: ambil SATU elemen pertama yang cocok (bukan array)
function cariRekomendasi(daftar) {
  return daftar.find((produk) => produk.unggulan && produk.stok > 0);
}

// map: ubah tiap produk menjadi markup (jumlah elemen sama, bentuknya berbeda)
function renderProduk(wadah, daftar) {
  wadah.innerHTML = daftar.map(buatKartuProduk).join("");
}

// for...of: dipakai karena satu perulangan mengisi tiga penghitung sekaligus
// (reduce atau tiga filter terpisah akan lebih panjang dan membingungkan).
function hitungRingkasan(daftar) {
  let tersedia = 0;
  let habis = 0;
  let nilaiStok = 0;
  for (const produk of daftar) {
    if (produk.stok > 0) {
      tersedia += 1;
    } else {
      habis += 1;
    }
    nilaiStok += produk.harga * produk.stok;
  }
  return { tersedia, habis, nilaiStok };
}

// ---------- 3. Render ke DOM (hanya jika elemennya ada di halaman) ----------
const produkTersedia = filterTersedia(produkUMKM);
const rekomendasi = cariRekomendasi(produkUMKM);
const ringkasan = hitungRingkasan(produkUMKM);

// Halaman utama: produk unggulan yang masih tersedia
const wadahBestseller = document.querySelector("#daftar-bestseller");
if (wadahBestseller) {
  renderProduk(wadahBestseller, produkTersedia.filter((produk) => produk.unggulan));
}

// Halaman produk: semua produk, ringkasan, dan rekomendasi
const wadahKatalog = document.querySelector("#produk-dinamis");
if (wadahKatalog) {
  renderProduk(wadahKatalog, produkUMKM);
}

const teksRingkasan = document.querySelector("#ringkasan-produk");
if (teksRingkasan) {
  teksRingkasan.textContent = `${produkUMKM.length} produk: ${produkTersedia.length} tersedia, ${ringkasan.habis} habis.`;
}

const teksRekomendasi = document.querySelector("#rekomendasi-produk");
if (teksRekomendasi && rekomendasi) {
  teksRekomendasi.textContent = `Rekomendasi hari ini: ${rekomendasi.nama} (${formatRupiah(rekomendasi.harga)}).`;
}

// ---------- 4. Debugging lewat Console ----------
console.table(produkUMKM);
console.table(produkTersedia, ["nama", "stok"]);
console.log("Rekomendasi:", rekomendasi);
// forEach: dipakai karena hanya menjalankan efek samping (mencetak log) tanpa nilai kembalian.
produkUMKM.forEach((produk) => {
  console.log(`${produk.nama} -> ${statusStok(produk.stok).label}`);
});
console.log(`Nilai stok: ${formatRupiah(ringkasan.nilaiStok)}`);