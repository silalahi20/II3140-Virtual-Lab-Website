let numbers = [];
let currentIndex = 0;
let isStarted = false;
let minIndex = 0;
let draggedElementIndex = null;
let sortedIndices = []; // Array to track sorted elements
let initialNumbers = [];  // Menyimpan urutan awal angka

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
  sortedIndices = [];              // Reset sorted indices on new generation
  displayNumbers();
  resetHighlight();
  document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
}


function displayNumbers() {
  const container = document.getElementById('number-container');
  container.innerHTML = numbers
    .map(
      (num, index) =>
        `<div class="number ${sortedIndices.includes(index) ? 'sorted-element' : ''}" draggable="true" id="num-${index}" ondragstart="dragStart(${index})" ondrop="drop(${index})" ondragover="allowDrop(event)">${num}</div>`
    )
    .join('');
}

function startSorting() {
  currentIndex = 0;
  minIndex = 0;
  isStarted = true;
  document.getElementById('status-text').innerText = 'Sorting dimulai...';
  highlightCurrentElement();
}

function highlightCurrentElement() {
  if (!isStarted) return;

  resetHighlight(); // Hanya reset elemen saat ini dan elemen terkecil, bukan elemen yang sudah sorted

  const currentElement = document.getElementById(`num-${currentIndex}`);
  if (currentElement) {
    currentElement.classList.add('current-element'); // Highlight biru
  }

  minIndex = currentIndex;
  findMinElement();
}

function findMinElement() {
  // Jika elemen terakhir yang sedang ditinjau, tidak perlu mencari elemen terkecil lagi
  if (currentIndex === numbers.length - 1) {
    document.getElementById('status-text').innerText =
      `Bilangan terakhir ${numbers[currentIndex]} sudah benar. Silakan klik Next untuk selesai!`;
    markAsSorted(currentIndex); // Tandai elemen terakhir sebagai sudah sorted
    document.querySelector('.controls button[onclick="nextStep()"]').disabled = false;
    return;
  }

  let minElementValue = numbers[minIndex];

  for (let i = currentIndex + 1; i < numbers.length; i++) {
    if (numbers[i] < minElementValue) {
      minIndex = i;
      minElementValue = numbers[i];
    }
  }

  // Jika elemen saat ini sudah merupakan elemen terkecil
  if (minIndex === currentIndex) {
    document.getElementById('status-text').innerText =
      `Bilangan ${numbers[currentIndex]} adalah bilangan terkecil. Silakan klik Next!`;
    markAsSorted(currentIndex); // Berikan highlight hijau langsung
    document.querySelector('.controls button[onclick="nextStep()"]').disabled = false;
  } else {
    highlightMinElement();
    document.getElementById('status-text').innerText = `Bilangan ${numbers[minIndex]} adalah bilangan terkecil saat ini. Silakan lakukan drag and drop untuk menukarnya.`;
    document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
  }
}

function highlightMinElement() {
  const minElement = document.getElementById(`num-${minIndex}`);
  if (minElement) {
    minElement.classList.add('min-element'); // Highlight merah
  }
}

function resetHighlight() {
  // Hanya reset highlight dari current dan min element
  const highlighted = document.querySelectorAll(
    '.current-element, .min-element'
  );
  highlighted.forEach((el) => {
    el.classList.remove('current-element', 'min-element');
  });
}

function dragStart(index) {
  // Only allow dragging for the current element and the min element
  if (index === currentIndex || index === minIndex) {
    draggedElementIndex = index;
  } else {
    draggedElementIndex = null; // Prevent dragging of other elements
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(index) {
  if (draggedElementIndex !== null && (index === currentIndex || index === minIndex)) {
    swapNumbers(draggedElementIndex, index);
  }
}

function swapNumbers(index1, index2) {
  const temp = numbers[index1];
  numbers[index1] = numbers[index2];
  numbers[index2] = temp;
  displayNumbers();
  resetHighlight(); // Reset hanya untuk current dan min
  markAsSorted(currentIndex); // Highlight hijau untuk elemen yang sudah disortir
  currentIndex++;

  if (currentIndex < numbers.length) {
    highlightCurrentElement();
  } else {
    isStarted = false;
    document.getElementById('status-text').innerText = 'Selection Sort Complete!';
    // Tambahkan kelas untuk menonaktifkan hover
    document.getElementById('number-container').classList.add('sorted-complete');
  }
}

function markAsSorted(index) {
  const sortedElement = document.getElementById(`num-${index}`);
  if (sortedElement) {
    sortedElement.classList.add('sorted-element'); // Highlight hijau
  }
  sortedIndices.push(index); // Track the index as sorted
}

function nextStep() {
  // Lanjutkan ke elemen berikutnya tanpa swap jika sudah di posisi yang benar
  markAsSorted(currentIndex);
  currentIndex++;
  if (currentIndex < numbers.length) {
    highlightCurrentElement();
  } else {
    isStarted = false;
    document.getElementById('status-text').innerText = 'Selection Sort Complete!';
    // Tambahkan kelas untuk menonaktifkan hover
    document.getElementById('number-container').classList.add('sorted-complete');
    document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
  }
}

function resetNumbers() {
  numbers = [...initialNumbers];  // Kembalikan ke urutan awal
  sortedIndices = [];              // Reset the sorted indices array
  displayNumbers();
  isStarted = false;               // Reset status sorting
  document.getElementById('status-text').innerText = '';
  resetHighlight();                // Reset any highlights on numbers
}


