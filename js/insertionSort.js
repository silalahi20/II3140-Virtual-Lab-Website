let numbers = [];
let currentIndex = 1;
let isStarted = false;
let draggedElementIndex = null;
let compareIndex = 0;

function generateNumbers() {
  const count = document.getElementById('numCount').value;
  numbers = Array.from({ length: count }, () => Math.floor(Math.random() * 100));
  displayNumbers();
  resetHighlight();
  document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
  document.getElementById('number-container').classList.remove('sorted-complete');
  // Remove any completion highlighting
  const allNumbers = document.querySelectorAll('.number');
  allNumbers.forEach(el => el.classList.remove('sorted'));
}

function displayNumbers() {
  const container = document.getElementById('number-container');
  container.innerHTML = numbers
    .map(
      (num, index) =>
        `<div class="number" draggable="true" id="num-${index}" ondragstart="dragStart(${index})" ondrop="drop(${index})" ondragover="allowDrop(event)">${num}</div>`
    )
    .join('');
    
  // Reapply current highlights if they exist
  if (isStarted) {
    const currentElement = document.getElementById(`num-${currentIndex}`);
    const comparedElement = document.getElementById(`num-${compareIndex}`);
    if (currentElement) currentElement.classList.add('current-element');
    if (comparedElement) comparedElement.classList.add('compared-element');
  }
}

function startSorting() {
  currentIndex = 1;
  isStarted = true;
  document.getElementById('status-text').innerText = `Bilangan ${numbers[0]} sudah pada posisinya. Silakan klik Next!`;
  highlightCurrentElement();
}

function highlightCurrentElement() {
  if (!isStarted) return;

  resetHighlight();

  const currentElement = document.getElementById(`num-${currentIndex}`);
  if (currentElement) {
    currentElement.classList.add('current-element');
  }

  document.getElementById('status-text').innerText = `Tinjau elemen: ${numbers[currentIndex]}.`;
  compareIndex = currentIndex - 1;
  highlightComparedElement(compareIndex);
}

function highlightComparedElement(index) {
  const previousElement = document.getElementById(`num-${index}`);
  if (previousElement) {
    previousElement.classList.add('compared-element');
  }

  if (numbers[currentIndex] < numbers[compareIndex]) {
    document.getElementById('status-text').innerText = `Bilangan ${numbers[currentIndex]} lebih kecil daripada ${numbers[compareIndex]}. Silakan tukar posisi ${numbers[currentIndex]} dengan ${numbers[compareIndex]}!`;
    document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
  } else {
    // Check if there are any larger elements to the left
    let hasLargerElementToLeft = false;
    for (let i = compareIndex - 1; i >= 0; i--) {
      if (numbers[i] > numbers[currentIndex]) {
        hasLargerElementToLeft = true;
        break;
      }
    }

    if (hasLargerElementToLeft) {
      // Continue comparing with elements to the left
      compareIndex--;
      highlightComparedElement(compareIndex);
    } else {
      document.getElementById('status-text').innerText = `Bilangan ${numbers[currentIndex]} sudah pada posisinya. Silakan klik Next!`;
      document.querySelector('.controls button[onclick="nextStep()"]').disabled = false;
    }
  }
}

function resetHighlight() {
  const highlighted = document.querySelectorAll('.current-element, .compared-element');
  highlighted.forEach((el) => {
    el.classList.remove('current-element', 'compared-element');
  });
}

function dragStart(index) {
  if (index === currentIndex || index === compareIndex) {
    draggedElementIndex = index;
  } else {
    draggedElementIndex = null;
  }
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(index) {
  if (draggedElementIndex !== null && (index === currentIndex || index === compareIndex)) {
    swapNumbers(draggedElementIndex, index);
  }
}

function swapNumbers(index1, index2) {
  // Perform the swap
  const temp = numbers[index1];
  numbers[index1] = numbers[index2];
  numbers[index2] = temp;
  
  // Update the current position after swap
  currentIndex = Math.min(index1, index2);
  
  displayNumbers();
  resetHighlight();

  // After swapping, check if we need to continue comparing with elements to the left
  if (compareIndex > 0) {
    compareIndex--;
    highlightComparedElement(compareIndex);
  } else {
    // Check if there are any larger elements to the left
    let hasLargerElementToLeft = false;
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (numbers[i] > numbers[currentIndex]) {
        compareIndex = i;
        hasLargerElementToLeft = true;
        break;
      }
    }

    if (!hasLargerElementToLeft) {
      // If no larger elements to the left, move to next element
      currentIndex = Math.max(index1, index2) + 1;
      if (currentIndex < numbers.length) {
        highlightCurrentElement();
      } else {
        completeSorting();
      }
    } else {
      // Continue comparing with the found larger element
      highlightComparedElement(compareIndex);
    }
  }
}

function nextStep() {
  if (currentIndex < numbers.length) {
    // Check if there are any larger elements to the left
    let hasLargerElementToLeft = false;
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (numbers[i] > numbers[currentIndex]) {
        compareIndex = i;
        hasLargerElementToLeft = true;
        break;
      }
    }

    if (hasLargerElementToLeft) {
      highlightComparedElement(compareIndex);
    } else {
      // Move to next element if current element is in correct position
      currentIndex++;
      if (currentIndex < numbers.length) {
        highlightCurrentElement();
      } else {
        completeSorting();
      }
    }
  }
}

function completeSorting() {
  isStarted = false;
  document.getElementById('status-text').innerText = 'Insertion Sort Complete!';
  document.getElementById('number-container').classList.add('sorted-complete');
  document.querySelector('.controls button[onclick="nextStep()"]').disabled = true;
  
  // Remove any existing highlights
  resetHighlight();
  
  // Add green highlight to all numbers
  const allNumbers = document.querySelectorAll('.number');
  allNumbers.forEach(el => el.classList.add('sorted'));
}

function resetNumbers() {
  generateNumbers();
  isStarted = false;
  document.getElementById('status-text').innerText = '';
  resetHighlight();
  // Remove completion highlighting
  const allNumbers = document.querySelectorAll('.number');
  allNumbers.forEach(el => el.classList.remove('sorted'));
}