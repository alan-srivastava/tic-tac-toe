const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');  // Generate unique game IDs
const port = 8080;
const server = new WebSocket.Server({ port });

let games = {}; // Store game sessions
let currentPlayer = 'X';
let gameBoard = Array(9).fill(null);

server.on('connection', (ws) => {
  console.log('New player connected');
  
  // Generate a new game ID if no game exists or get an existing game
  const gameId = Object.keys(games).length === 0 ? uuidv4() : Object.keys(games)[0];

  if (!games[gameId]) {
    games[gameId] = { players: [], board: gameBoard, currentPlayer: 'X' };
  }
  
  const player = { ws, playerSymbol: currentPlayer };

  games[gameId].players.push(player);

  // Send the game ID and the initial game state to the new player
  ws.send(JSON.stringify({ type: 'init', gameId: gameId, board: gameBoard, player: currentPlayer }));

  // If both players are connected, start the game
  if (games[gameId].players.length === 2) {
    currentPlayer = 'O'; // Switch player for the second player
    games[gameId].players.forEach(p => {
      p.ws.send(JSON.stringify({ type: 'start', board: gameBoard, currentPlayer: currentPlayer }));
    });
  }

  // Handle incoming messages
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'move') {
      const { index, player } = data;
      gameBoard[index] = player;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch turn

      // Broadcast updated game state to both players
      games[gameId].players.forEach(p => {
        p.ws.send(JSON.stringify({ type: 'update', board: gameBoard, player: currentPlayer }));
      });
    }
  });

  // Handle player disconnection
  ws.on('close', () => {
    console.log('Player disconnected');
    games[gameId].players = games[gameId].players.filter(p => p.ws !== ws);
    
    // If the game only has one player left, remove the game
    if (games[gameId].players.length === 0) {
      delete games[gameId];
    }
  });
});

console.log(`Server is running on ws://localhost:${port}`);
