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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && daftarMenu.classList.contains("is-open")) {
      aturMenu(false);
      tombolMenu.focus();
    }
  });
}

const STOK_MENIPIS = 5;

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

function formatRupiah(nilai) {
  return `Rp${nilai.toLocaleString("id-ID")}`;
}

function statusStok(stok) {
  if (stok === 0) {
    return { label: "Habis", kelas: "habis" };
  } else if (stok <= STOK_MENIPIS) {
    return { label: `Stok terbatas (${stok})`, kelas: "terbatas" };
  }
  return { label: `Tersedia (${stok})`, kelas: "tersedia" };
}

function buatElemenProduk(produk) {
  const status = statusStok(produk.stok);

  const kartu = document.createElement("article");
  kartu.classList.add("product-card");

  const kategori = document.createElement("p");
  kategori.classList.add("meta");
  kategori.textContent = produk.kategori;

  const nama = document.createElement("h3");
  nama.textContent = produk.nama;

  const badges = document.createElement("p");
  badges.classList.add("badges");
  if (produk.unggulan) {
    const labelUnggulan = document.createElement("span");
    labelUnggulan.classList.add("badge", "badge--unggulan");
    labelUnggulan.textContent = "Bestseller";
    badges.append(labelUnggulan);
  }
  const labelStok = document.createElement("span");
  labelStok.classList.add("badge", `badge--${status.kelas}`);
  labelStok.textContent = status.label;
  badges.append(labelStok);

  const deskripsi = document.createElement("p");
  deskripsi.textContent = produk.deskripsi;

  const harga = document.createElement("p");
  harga.classList.add("price");
  harga.textContent = formatRupiah(produk.harga);

  kartu.append(kategori, nama, badges, deskripsi, harga);
  return kartu;
}

function buatEmptyState(kategori) {
  const kosong = document.createElement("p");
  kosong.classList.add("empty-state");
  kosong.textContent = `Belum ada produk untuk kategori ${kategori}.`;
  return kosong;
}

function filterKategori(daftar, kategori) {
  if (kategori === "semua") {
    return daftar;
  }
  return daftar.filter((produk) => produk.kategori === kategori);
}

function renderProduk(kategoriAktif) {
  const hasil = filterKategori(produkUMKM, kategoriAktif);
  wadahProduk.replaceChildren();
  if (hasil.length === 0) {
    wadahProduk.append(buatEmptyState(kategoriAktif));
  } else {
    wadahProduk.append(...hasil.map(buatElemenProduk));
  }
  const namaKategori = kategoriAktif === "semua" ? "semua kategori" : `kategori ${kategoriAktif}`;
  teksStatus.textContent = `Menampilkan ${hasil.length} produk (${namaKategori}).`;
}

function tandaiTombolAktif(tombolDipilih) {
  tombolFilter.forEach((tombol) => {
    const aktif = tombol === tombolDipilih;
    tombol.classList.toggle("is-active", aktif);
    tombol.setAttribute("aria-pressed", String(aktif));
  });
}

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

function filterTersedia(daftar) {
  return daftar.filter((produk) => produk.stok > 0);
}

function cariRekomendasi(daftar) {
  return daftar.find((produk) => produk.unggulan && produk.stok > 0);
}

const wadahProduk = document.querySelector("#produk-dinamis");
const teksStatus = document.querySelector("#produk-status");
const tombolFilter = document.querySelectorAll("[data-filter]");
const wadahBestseller = document.querySelector("#daftar-bestseller");
const teksRingkasan = document.querySelector("#ringkasan-produk");
const teksRekomendasi = document.querySelector("#rekomendasi-produk");

const produkTersedia = filterTersedia(produkUMKM);
const rekomendasi = cariRekomendasi(produkUMKM);
const ringkasan = hitungRingkasan(produkUMKM);

if (wadahBestseller) {
  const produkBestseller = produkTersedia.filter((produk) => produk.unggulan);
  wadahBestseller.replaceChildren(...produkBestseller.map(buatElemenProduk));
}

if (wadahProduk && teksStatus) {
  let kategoriAktif = "semua";
  renderProduk(kategoriAktif);

  tombolFilter.forEach((tombol) => {
    tombol.addEventListener("click", (event) => {
      kategoriAktif = event.currentTarget.dataset.filter;
      tandaiTombolAktif(event.currentTarget);
      renderProduk(kategoriAktif);
    });
  });
}

if (teksRingkasan) {
  teksRingkasan.textContent = `${produkUMKM.length} produk: ${produkTersedia.length} tersedia, ${ringkasan.habis} habis.`;
}
if (teksRekomendasi && rekomendasi) {
  teksRekomendasi.textContent = `Rekomendasi hari ini: ${rekomendasi.nama} (${formatRupiah(rekomendasi.harga)}).`;
}

console.table(produkUMKM);
console.table(produkTersedia, ["nama", "stok"]);
console.log("Rekomendasi:", rekomendasi);
produkUMKM.forEach((produk) => {
  console.log(`${produk.nama} -> ${statusStok(produk.stok).label}`);
});
console.log(`Nilai stok: ${formatRupiah(ringkasan.nilaiStok)}`);