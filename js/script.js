window.onload = function() {
  const modal = document.getElementById('explanation-modal');
  modal.style.display = 'none';
};

function showExplanation(type) {
  const modal = document.getElementById('explanation-modal');
  const text = document.getElementById('explanation-text');

  if (type === 'bubble') {
    text.innerHTML = `
      <h3>Bubble Sort</h3>
      <p>- Algoritma sederhana yang menukar elemen bersebelahan.</p>
      <p>- Kompleksitas waktu: O(n^2).</p>
    `;
  } else if (type === 'selection') {
    text.innerHTML = `
      <h3>Selection Sort</h3>
      <p>- Memilih elemen terkecil dan menempatkannya di posisi yang tepat.</p>
      <p>- Kompleksitas waktu: O(n^2).</p>
    `;
  } else if (type === 'insertion') {
    text.innerHTML = `
      <h3>Insertion Sort</h3>
      <p>- Menyisipkan elemen pada posisi yang benar.</p>
      <p>- Cocok untuk dataset kecil atau hampir terurut.</p>
    `;
  }

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('explanation-modal');
  modal.style.display = 'none';
}
