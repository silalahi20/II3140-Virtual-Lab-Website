window.onload = function() {
  const modal = document.getElementById('explanation-modal');
  modal.style.display = 'none';
};

function showExplanation(type) {
  const modal = document.getElementById('explanation-modal');
  const text = document.getElementById('explanation-text');
  const video = document.getElementById('explanation-video');

  // Set content based on algorithm type
  if (type === 'bubble') {
    text.innerHTML = `
      <h3>Bubble Sort</h3>
      <p>Algoritma sederhana yang menukar elemen bersebelahan.</p>
      <p>Kompleksitas waktu: O(n^2).</p>
    `;
    video.src = "https://www.youtube.com/embed/xli_FI7CuzA"; // Corrected URL for Bubble Sort video embed
  } else if (type === 'selection') {
    text.innerHTML = `
      <h3>Selection Sort</h3>
      <p>Memilih elemen terkecil dan menempatkannya di posisi yang tepat.</p>
      <p>Kompleksitas waktu: O(n^2).</p>
    `;
    video.src = "https://www.youtube.com/embed/g-PGLbMth_g?start=76"; // Corrected URL for Selection Sort video embed with start time
  } else if (type === 'insertion') {
    text.innerHTML = `
      <h3>Insertion Sort</h3>
      <p>Menyisipkan elemen pada posisi yang benar.</p>
      <p>Cocok untuk dataset kecil atau hampir terurut.</p>
    `;
    video.src = "https://www.youtube.com/embed/JU767SDMDvA"; // Corrected URL for Insertion Sort video embed
  }

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('explanation-modal');
  modal.style.display = 'none';
  
  // Reset video source to stop the video when modal is closed
  const video = document.getElementById('explanation-video');
  video.src = "";
}
