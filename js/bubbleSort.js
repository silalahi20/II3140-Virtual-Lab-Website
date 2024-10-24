let numbers = [];
let initialNumbers = [];  // Menyimpan urutan awal angka
let currentIndex = 0;
let isStarted = false;
let swapped = false;
let swapRequired = false;

// function generateNumbers() {
//   const count = document.getElementById('numCount').value;
//   numbers = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
//   initialNumbers = [...numbers];  // Simpan urutan awal angka
//   displayNumbers();
//   resetHighlight();
//   document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
// }

function generateNumbers() {
  const count = parseInt(document.getElementById('numCount').value);
  
  // Create array of sequential numbers from 0 to 99
  const pool = Array.from({ length: 100 }, (_, index) => index);
  
  // Shuffle the first 'count' elements
  for (let i = 0; i < count; i++) {
    const j = Math.floor(Math.random() * (pool.length - i)) + i;
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  
  // Take only the first 'count' elements
  numbers = pool.slice(0, count);
  
  initialNumbers = [...numbers];  // Simpan urutan awal angka
  displayNumbers();
  resetHighlight();
  document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
}

function displayNumbers() {
  const container = document.getElementById('number-container');
  container.innerHTML = numbers
    .map(
      (num, index) =>
        `<div class="number" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)" id="num-${index}">${num}</div>`
    )
    .join('');
}

function startSorting() {
  currentIndex = 0;
  swapped = false;
  isStarted = true;  // Tandai bahwa proses telah dimulai
  document.getElementById('status-text').innerText = 'Sorting dimulai...';
  highlightCurrentPair();
  document.querySelector('.controls button[onclick="nextStep()"]').disabled = false; // Enable tombol Next
}

function highlightCurrentPair() {
  if (!isStarted) return;  // Hanya aktif jika sorting sudah dimulai

  resetHighlight();

  if (currentIndex < numbers.length - 1) {
    const first = document.getElementById(`num-${currentIndex}`);
    const second = document.getElementById(`num-${currentIndex + 1}`);

    first.classList.add('highlight');
    second.classList.add('highlight');

    // Aktifkan drag-and-drop hanya pada dua kotak yang sedang ditinjau
    first.setAttribute('draggable', true);
    second.setAttribute('draggable', true);

    // Cek apakah swap diperlukan
    if (numbers[currentIndex] > numbers[currentIndex + 1]) {
      swapRequired = true;  // Swap diperlukan
    } else {
      swapRequired = false; // Swap tidak diperlukan
    }
  }
}

function resetHighlight() {
  const highlighted = document.querySelectorAll('.highlight, .sorted-element');
  highlighted.forEach((el) => {
    el.classList.remove('highlight', 'sorted-element');
  });

  // Matikan draggable untuk semua kotak
  const allNumbers = document.querySelectorAll('.number');
  allNumbers.forEach((el) => el.setAttribute('draggable', false));
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function drop(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData('text');
  const targetId = event.target.id;

  const draggedIndex = parseInt(draggedId.split('-')[1]);
  const targetIndex = parseInt(targetId.split('-')[1]);

  // Validasi apakah kotak yang ditukar adalah yang sedang ditinjau
  if (
    (draggedIndex === currentIndex && targetIndex === currentIndex + 1) ||
    (draggedIndex === currentIndex + 1 && targetIndex === currentIndex)
  ) {
    // Lakukan swap jika angka kiri lebih besar dari angka kanan
    if (numbers[currentIndex] > numbers[currentIndex + 1]) {
      swapNumbers(draggedIndex, targetIndex);
      swapped = true;  // Tandai bahwa ada swap
      swapRequired = false;  // Reset swapRequired karena swap sudah dilakukan
      document.getElementById('status-text').innerText = 'Correct! Klik Next.';
    } else {
      // Jika tidak perlu swap, tampilkan pesan dan batalkan perubahan
      document.getElementById('status-text').innerText = 'Posisi sudah benar, silakan klik Next.';
    }
    displayNumbers();  // Update tampilan setelah drop
    highlightCurrentPair();  // Highlight pasangan berikutnya
  } else {
    document.getElementById('status-text').innerText =
      'Hanya bisa menukar kotak yang sedang ditinjau!';
  }
}

function swapNumbers(index1, index2) {
  const temp = numbers[index1];
  numbers[index1] = numbers[index2];
  numbers[index2] = temp;
}

function nextStep() {
  if (!isStarted) return;  // Abaikan jika sorting belum dimulai

  // Cek apakah pengguna harus melakukan swap tapi belum melakukannya
  if (swapRequired) {
    document.getElementById('status-text').innerText = 'Wrong move, teliti lagi bos!';
    return;
  }

  // Cek apakah seluruh array sudah terurut
  if (isSorted()) {
    isStarted = false;
    document.getElementById('status-text').innerText = 'Bubble Sort Complete!';
    highlightAllSorted(); // Highlight semua elemen dengan warna hijau
    document.querySelector('.controls button[onclick="nextStep()"]').disabled = true; // Disable tombol Next
    return;
  }

  if (currentIndex < numbers.length - 2) {
    currentIndex++;
    highlightCurrentPair();
  } else {
    if (swapped) {
      // Jika ada swap, ulangi dari awal
      currentIndex = 0;
      swapped = false;
      highlightCurrentPair();
    } else {
      // Jika tidak ada swap, berarti sudah terurut
      isStarted = false;
      document.getElementById('status-text').innerText = 'Bubble Sort Complete!';
      highlightAllSorted(); // Highlight semua elemen dengan warna hijau
      document.querySelector('.controls button[onclick="nextStep()"]').disabled = true; // Disable tombol Next
    }
  }
}

function highlightAllSorted() {
  const allNumbers = document.querySelectorAll('.number');
  allNumbers.forEach((el) => {
    el.classList.remove('highlight'); // Hapus highlight biru jika ada
    el.classList.add('sorted-element'); // Tambahkan highlight hijau
  });
  
  // Tambahkan kelas sorted-complete ke container
  const container = document.getElementById('number-container');
  container.classList.add('sorted-complete');
}

function isSorted() {
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] > numbers[i + 1]) {
      return false;
    }
  }
  return true;
}

function resetNumbers() {
  numbers = [...initialNumbers];  // Kembalikan ke urutan awal
  displayNumbers();
  isStarted = false;  // Reset status sorting
  document.getElementById('status-text').innerText = '';
  resetHighlight();
  // Reset kelas sorted-complete pada container
  const container = document.getElementById('number-container');
  container.classList.remove('sorted-complete');
}