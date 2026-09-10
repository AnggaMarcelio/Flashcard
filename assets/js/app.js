// =========================================================
// ENGLISH FLASHCARDS — APP LOGIC
// =========================================================

// Menggabungkan semua data dari file terpisah
const allCards = [
  ...dataBadan,
  ...dataWarna,
  ...dataHewan,
  ...dataBenda
];

let deck = [...allCards];
let currentIndex = 0;
let timerId = null;
let remaining = 10;

// Helper untuk mengambil elemen berdasarkan ID
const $ = id => document.getElementById(id);


// =========================================================
// MAPPING KATEGORI KE CLASS CSS
// =========================================================

function getCategoryClass(category) {
  switch (category) {
    case 'Hewan':
      return 'animals';

    case 'Benda Sekitar':
      return 'objects';

    case 'Anggota Badan':
      return 'body-parts';

    case 'Warna':
      return 'colors';

    default:
      return '';
  }
}


// =========================================================
// SAAT HALAMAN SELESAI DIMUAT
// =========================================================

window.onload = () => {
  setCategory('all');
};


// =========================================================
// MEMILIH KATEGORI
// =========================================================

function setCategory(cat) {

  // Update tombol kategori yang aktif
  document.querySelectorAll('.cat').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.cat === cat
    );
  });

  // Filter data berdasarkan kategori
  deck = cat === 'all'
    ? [...allCards]
    : allCards.filter(card => card[0] === cat);

  // Update jumlah gambar
  $('counter').textContent = `Total: ${deck.length} Gambar`;

  // Tutup flashcard ketika mengganti kategori
  closeFlashcard();

  // Tampilkan koleksi
  renderGallery();
}


// =========================================================
// MENAMPILKAN GALLERY
// =========================================================

function renderGallery() {

  const gallery = $('gallery');

  // Bersihkan gallery terlebih dahulu
  gallery.innerHTML = '';

  // Jika tidak ada data
  if (deck.length === 0) {
    gallery.innerHTML = `
      <div style="
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px 20px;
        color: #718096;
        font-weight: 800;
      ">
        Tidak ada gambar pada kategori ini.
      </div>
    `;

    return;
  }

  // Membuat setiap kartu
  deck.forEach((c, index) => {

    const div = document.createElement('div');

    // Ambil kategori dari data
    const category = c[0];

    // Ubah nama kategori menjadi class CSS
    const categoryClass = getCategoryClass(category);

    div.className = `gallery-item ${categoryClass}`;

    // URL gambar
    const imgSrc = c[1];

    // Isi kartu (Teks bahasa Inggris/c[2] sudah dihapus)
    div.innerHTML = `
      <img
        src="${imgSrc}"
        alt="${c[2]}"
        onerror="this.src='https://placehold.co/150x150/f8fafc/64748b?text=Gambar+Offline'"
      >
    `;

    // Ketika kartu diklik
    div.onclick = () => startFlashcard(index);

    // Masukkan kartu ke gallery
    gallery.appendChild(div);
  });
}


// =========================================================
// MEMULAI FLASHCARD
// =========================================================

function startFlashcard(index) {

  // Pastikan index valid
  if (index < 0 || index >= deck.length) {
    return;
  }

  currentIndex = index;

  // Tampilkan area flashcard
  $('flashcard-section').style.display = 'block';

  // Scroll menuju flashcard
  $('flashcard-section').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  // Tampilkan kartu
  renderCard();
}


// =========================================================
// MENUTUP FLASHCARD
// =========================================================

function closeFlashcard() {

  // Sembunyikan area flashcard
  $('flashcard-section').style.display = 'none';

  // Hentikan timer
  clearInterval(timerId);

  timerId = null;
}


// =========================================================
// MENAMPILKAN FLASHCARD
// =========================================================

function renderCard() {

  // Hentikan timer sebelumnya
  clearInterval(timerId);

  // Reset timer
  remaining = 10;

  // Ambil data kartu sekarang
  const c = deck[currentIndex];

  // Jika data tidak tersedia
  if (!c) {
    return;
  }


  // =======================================================
  // TENTUKAN CLASS KATEGORI
  // =======================================================

  const category = c[0];

  const categoryClass = getCategoryClass(category);


  // =======================================================
  // TERAPKAN CLASS KE FLASHCARD UTAMA
  // =======================================================

  // Hapus class kategori lama
  $('flashcard-section').classList.remove(
    'animals',
    'objects',
    'body-parts',
    'colors'
  );

  // Tambahkan class kategori baru
  if (categoryClass) {
    $('flashcard-section').classList.add(categoryClass);
  }


  // =======================================================
  // ISI DATA FLASHCARD
  // =======================================================

  $('category-label').textContent = c[0];

  $('visual-img').src = c[1];

  $('word').textContent = c[2];

  $('pron').textContent = c[3];

  $('meaning').textContent = c[4];


  // =======================================================
  // FALLBACK GAMBAR
  // =======================================================

  $('visual-img').onerror = function () {

    this.src =
      'https://placehold.co/600x400/f8fafc/64748b?text=Gambar+Offline+Belum+Ada';

  };


  // =======================================================
  // KONDISI AWAL FLASHCARD
  // =======================================================

  // Gambar berada di tengah
  $('learning').classList.add('centered');

  // Tombol Next belum bisa digunakan
  $('next').disabled = true;

  // Tombol Skip aktif
  $('skip').disabled = false;

  // Timer
  $('timer').textContent =
    'Perhatikan gambarnya... 10';


  // =======================================================
  // PROGRESS BAR
  // =======================================================

  const progress =
    ((currentIndex + 1) / deck.length) * 100;

  $('bar').style.width = `${progress}%`;


  // =======================================================
  // TIMER 10 DETIK
  // =======================================================

  timerId = setInterval(() => {

    remaining--;

    if (remaining > 0) {

      $('timer').textContent =
        `Perhatikan gambarnya... ${remaining}`;

    } else {

      // Setelah 10 detik tampilkan jawaban
      revealAnswer();
    }

  }, 1000);
}


// =========================================================
// MENAMPILKAN JAWABAN
// =========================================================

function revealAnswer() {

  // Hentikan timer
  clearInterval(timerId);

  timerId = null;

  // Gambar pindah ke kolom kiri
  // Jawaban muncul di kolom kanan
  $('learning').classList.remove('centered');

  // Ubah tulisan timer
  $('timer').textContent =
    'Jawaban / Answer!';

  // Aktifkan tombol Next
  $('next').disabled = false;

  // Matikan tombol Skip
  $('skip').disabled = true;
}


// =========================================================
// KARTU BERIKUTNYA
// =========================================================

function nextCard() {

  // Pastikan masih ada kartu berikutnya
  if (currentIndex < deck.length - 1) {

    currentIndex++;

    renderCard();

  } else {

    // Semua kartu sudah selesai
    $('timer').textContent =
      'Koleksi Kategori Ini Selesai!';

    $('next').disabled = true;
  }
}
