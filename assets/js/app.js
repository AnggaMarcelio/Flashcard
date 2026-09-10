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

const $ = id => document.getElementById(id);

window.onload = () => {
  setCategory('all');
};

function setCategory(cat) {
  document.querySelectorAll(".cat").forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
  deck = cat === "all" ? [...allCards] : allCards.filter(c => c[0] === cat);
  $('counter').textContent = `Total: ${deck.length} Gambar`;
  
  closeFlashcard(); // Sembunyikan area flashcard
  renderGallery();
}

// Menampilkan koleksi gambar seperti pada gambar referensi
function renderGallery() {
  const gallery = $('gallery');
  gallery.innerHTML = '';
  deck.forEach((c, index) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    
    // Fallback URL jika gambar offline belum ditambahkan oleh user, 
    // agar tampilan tetap terlihat saat dites (optional)
    const imgSrc = c[1]; 
    
    div.innerHTML = `
      <img src="${imgSrc}" alt="${c[2]}" onerror="this.src='https://placehold.co/150x150/f8fafc/64748b?text=Gambar+Offline'">
      <div class="title">${c[2]}</div>
    `;
    div.onclick = () => startFlashcard(index);
    gallery.appendChild(div);
  });
}

function startFlashcard(index) {
  currentIndex = index;
  $('flashcard-section').style.display = 'flex';
  $('flashcard-section').scrollIntoView({ behavior: 'smooth' });
  renderCard();
}

function closeFlashcard() {
  $('flashcard-section').style.display = 'none';
  clearInterval(timerId);
}

function renderCard() {
  clearInterval(timerId); 
  remaining = 10;
  const c = deck[currentIndex];
  
  $("category-label").textContent = c[0];
  $("visual-img").src = c[1];
  $("word").textContent = c[2];
  $("pron").textContent = c[3];
  $("meaning").textContent = c[4];
  
  // Menggunakan placehold.co sebagai fallback untuk testing
  $("visual-img").onerror = function() {
    this.src = 'https://placehold.co/600x400/f8fafc/64748b?text=Gambar+Offline+Belum+Ada';
  };
  
  $("learning").classList.add("centered");
  $("next").disabled = true;
  $("skip").disabled = false;
  $("timer").textContent = "Perhatikan gambarnya... 10";
  
  // Progress bar
  $("bar").style.width = `${((currentIndex + 1) / deck.length) * 100}%`;

  timerId = setInterval(() => {
    remaining--;
    if(remaining > 0) {
      $("timer").textContent = `Perhatikan gambarnya... ${remaining}`;
    } else {
      revealAnswer();
    }
  }, 1000);
}

function revealAnswer() {
  clearInterval(timerId);
  $("learning").classList.remove("centered");
  $("timer").textContent = "Jawaban / Answer!";
  $("next").disabled = false;
  $("skip").disabled = true;
}

function nextCard() {
  if(currentIndex < deck.length - 1) { 
    currentIndex++; 
    renderCard(); 
  } else {
    $("timer").textContent = "Koleksi Kategori Ini Selesai!";
    $("next").disabled = true;
  }
}
