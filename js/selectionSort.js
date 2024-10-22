let numbers = [];
    let currentIndex = 0;
    let isStarted = false;
    let minIndex = 0;
    let draggedElementIndex = null;

    function generateNumbers() {
      const count = document.getElementById('numCount').value;
      numbers = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
      displayNumbers();
      resetHighlight();
      document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
    }

    function displayNumbers() {
      const container = document.getElementById('number-container');
      container.innerHTML = numbers
        .map(
          (num, index) =>
            `<div class="number" draggable="true" id="num-${index}" ondragstart="dragStart(${index})" ondrop="drop(${index})" ondragover="allowDrop(event)">${num}</div>`
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

      resetHighlight();

      const currentElement = document.getElementById(`num-${currentIndex}`);
      if (currentElement) {
        currentElement.classList.add('current-element'); // Highlight biru
      }

      minIndex = currentIndex;
      findMinElement();
    }

    function findMinElement() {
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
      const highlighted = document.querySelectorAll(
        '.highlight, .min-element, .current-element, .sorted-element'
      );
      highlighted.forEach((el) => {
        el.classList.remove(
          'highlight', 'min-element', 'current-element', 'sorted-element'
        );
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
      resetHighlight(); // Reset untuk menampilkan perubahan
      markAsSorted(currentIndex); // Highlight hijau untuk elemen yang sudah disortir
      currentIndex++;

      if (currentIndex < numbers.length) {
        highlightCurrentElement();
      } else {
        isStarted = false;
        document.getElementById('status-text').innerText = 'Selection Sort Complete!';
      }
    }

    function markAsSorted(index) {
      const sortedElement = document.getElementById(`num-${index}`);
      if (sortedElement) {
        sortedElement.classList.add('sorted-element'); // Highlight hijau
      }
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
        document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
      }
    }

    function resetNumbers() {
      generateNumbers();
      isStarted = false;  // Reset status sorting
      document.getElementById('status-text').innerText = '';
      resetHighlight();
    }