// script.js
const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');
const resetBtn = document.querySelector('.reset-btn');

let board = Array(9).fill(null);  // Array representing the board
let currentPlayer = 'X';  // Player X starts first

// Handle cell click
cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    
    // Ignore the cell if it's already filled or the game is over
    if (board[index] || checkWinner()) return;

    // Update the board
    board[index] = currentPlayer;
    cell.classList.add(currentPlayer);

    // Check for winner or draw
    if (checkWinner()) {
      message.textContent = `${currentPlayer} wins!`;
    } else if (board.every(cell => cell !== null)) {
      message.textContent = 'It\'s a draw!';
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
      message.textContent = `Player ${currentPlayer}'s turn`;
    }
  });
});

// Reset the game
resetBtn.addEventListener('click', resetGame);

// Check for a winner
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6]             // Diagonal
  ];

  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

// Reset the board
function resetGame() {
  board = Array(9).fill(null);
  cells.forEach(cell => cell.classList.remove('X', 'O'));
  currentPlayer = 'X';
  message.textContent = `Player ${currentPlayer}'s turn`;
}
