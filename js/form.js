const STORAGE_KEY = "umkm-p12-preferensi";
const form = document.querySelector("#form-kontak");
const statusForm = document.querySelector("#status-form");
const preview = document.querySelector("#preview");
const channels = document.querySelectorAll("[data-channel]");
const tombolSimpan = document.querySelector("#simpan-preferensi");

// Kontrol yang divalidasi. Untuk grup radio, yang dipakai kontrol pertama grup;
// penanda aria-invalid dipasang di <fieldset> pembungkusnya.
const nama = ["nama", "email", "whatsapp", "waktu", "paket", "topik", "pesan"];
const fields = nama.map((n) => form.elements[n]).map((el) => (el instanceof RadioNodeList ? el[0] : el));

function setStatus(teks, jenis) {
  statusForm.textContent = teks;
  statusForm.classList.toggle("is-error", jenis === "error");
  statusForm.classList.toggle("is-success", jenis === "success");
}

function pesanError(field) {
  if (field.validity.valueMissing) {
    return field.type === "radio" || field.tagName === "SELECT" ? "Pilih salah satu opsi." : "Field ini wajib diisi.";
  }
  if (field.validity.typeMismatch) return "Format email belum benar.";
  if (field.validity.patternMismatch) return "Nomor WhatsApp harus diawali 08 dan 10-13 digit angka.";
  if (field.validity.tooShort) return "Minimal " + field.minLength + " karakter.";
  return "";
}

function validasiField(field) {
  const pesan = pesanError(field);
  const kunci = field.type === "radio" ? field.name : field.id;
  const error = document.querySelector("#" + kunci + "-error");
  const penanda = field.type === "radio" ? field.closest("fieldset") : field;
  penanda.setAttribute("aria-invalid", pesan ? "true" : "false");
  if (error) error.textContent = pesan;
  return pesan === "";
}

function simpanPreferensi() {
  const preferensi = {
    channel: Array.from(channels).filter((item) => item.checked).map((item) => item.value),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
  setStatus("Preferensi tersimpan di localStorage.", "success");
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (!tersimpan) return;
    const preferensi = JSON.parse(tersimpan);
    channels.forEach((item) => {
      item.checked = preferensi.channel?.includes(item.value) ?? false;
    });
    setStatus("Preferensi berhasil dimuat.");
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    setStatus("Data preferensi rusak dan sudah dihapus.", "error");
  }
}

// Teks divalidasi saat diketik; radio dan select saat pilihan berubah.
form.addEventListener("input", (event) => {
  const field = event.target;
  if (field.type === "radio" || field.tagName === "SELECT") return;
  if (fields.includes(field)) validasiField(field);
});
form.addEventListener("change", (event) => {
  const el = event.target;
  const field = el.type === "radio" ? form.elements[el.name][0] : el;
  if (fields.includes(field)) validasiField(field);
});
tombolSimpan.addEventListener("click", simpanPreferensi);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  // Semua field diperiksa sekaligus agar semua pesan error tampil.
  const hasil = fields.map((field) => validasiField(field));
  if (hasil.includes(false)) {
    setStatus("Perbaiki field yang ditandai.", "error");
    fields[hasil.indexOf(false)].focus();
    return;
  }

  const data = new FormData(form);
  preview.textContent =
    "Nama: " + data.get("nama") +
    "\nEmail: " + data.get("email") +
    "\nWhatsApp: " + data.get("whatsapp") +
    "\nWaktu: " + data.get("waktu") +
    "\nPaket: " + data.get("paket") +
    "\nTopik: " + data.get("topik") +
    "\nPesan: " + data.get("pesan");
  setStatus("Form valid dan siap diproses.", "success");
});

muatPreferensi();