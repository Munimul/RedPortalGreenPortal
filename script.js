"use strict";

// Board Item number
let numOfItems = 100;

// Global variable parentDiv, itemArray
let itemArray, lastItem, activePlayer, boardNum, playerNum;

//Single_Player Mode
let singlePlayer = false;

//Player Score
const p1Score = 0;
const p2Score = 0;

//Portal numbers
const portals = {
  greenPortals: [5, 17, 26, 31, 40, 53, 65, 74, 84, 91],
  greenPortalAdd: [6, 7, 3, 9, 7, 11, 3, 5, 6, 8],
  // places       [11, 24,29, 41,  47,64,68,79,90,99]
  //places        [1, 9, 10,  26, 28,34,51,58,73]
  redPortals: [8, 13, 21, 32, 39, 46, 57, 69, 80, 88, 97],
  redPortalMinus: [-7, -4, -11, -6, -11, -12, -6, -11, -7, -18, -3],
};

// -----------------All HTML Elements------------------
///-----------boardItem--------
// Board Container
const boardContainer = document.querySelector(".gameContainer");

// Modal or requirement div
const modal = document.querySelector(".modal");

//Board Size selector
const boardSize = document.getElementById("boardSize");
//Player Number selector
const playerNumber = document.getElementById("playerNumber");
// Start Button
const start = document.getElementById("start");
//Board Element
const parentDiv = document.querySelector(".board");
//Single Player Button
const singlePlayButton = document.querySelector(".singlePlayer");
// Reset Button
const reset = document.querySelector(".reset");
// Player Button
const player1button = document.getElementById("player1");
const player2button = document.getElementById("player2");

//Player Score board Element
const p1Board = document.querySelector(".leftPlayer");
const p2Board = document.querySelector(".rightPlayer");

// Player Score Element
const p1ScoreEl = document.getElementById("p1");
const p2ScoreEl = document.getElementById("p2");

// Dice Element
const dice1 = document.getElementById("1");
const dice2 = document.getElementById("2");

//message element
const messageEl = document.querySelector(".message");

//Player Back-groundColor
const p1Color = "yellow";
const p2Color = "blue";
const bothColor = "black";
const redPortal = "red";
const greenPortal = "green";

//--------------------All Classes (Player, Board, Message)-----------------

// Player Class
class Player {
  constructor(score, scoreEl, playerId) {
    this.score = score;
    this.scoreEl = scoreEl;
    this.playerId = playerId;
  }
  resetScore() {
    this.score = 0;
  }
  addScore(roll) {
    this.score += roll;
  }

  showScore() {
    this.scoreEl.textContent = `${this.score}`;
  }
}

// Board Class
class Board {
  constructor(itemArray, p1Color, p2Color, bothColor) {
    this.itemArray = itemArray;
    this.p1Color = p1Color;
    this.p2Color = p2Color;
    this.bothColor = bothColor;
  }

  removeColor(score, color) {
    if (itemArray[score].classList.contains(this.bothColor)) {
      itemArray[score].classList.remove(this.bothColor);
      color === this.p1Color
        ? itemArray[score].classList.add(this.p2Color)
        : itemArray[score].classList.add(this.p1Color);
    } else {
      itemArray[score].classList.remove(color);
    }
  }
  addColor(score, color) {
    if (color === this.p1Color) {
      if (itemArray[score].classList.contains(this.p2Color)) {
        itemArray[score].classList.remove(this.p2Color);
        itemArray[score].classList.add(this.bothColor);
      } else {
        itemArray[score].classList.add(this.p1Color);
      }
    } else {
      if (itemArray[score].classList.contains(this.p1Color)) {
        itemArray[score].classList.remove(this.p1Color);
        itemArray[score].classList.add(this.bothColor);
      } else {
        itemArray[score].classList.add(this.p2Color);
      }
    }
  }
}

//message class
class Message {
  constructor(messageEl) {
    this.messageEl = messageEl;
  }
  turnMessage(playerId) {
    messageEl.textContent = `Player ${playerId}'s Turn!`;
  }
  winMessage(playerId) {
    messageEl.textContent = `Player ${playerId} has Won!`;
  }
  greenMessage(playerId) {
    messageEl.textContent = `Player ${playerId} has advanced through Green Portal!`;
  }
  redMessage(playerId) {
    messageEl.textContent = `Player ${playerId} has lost places through Red Portal`;
  }
  anyMessage(playerId, score) {
    messageEl.textContent = `Very Close! Player ${playerId}! You need a ${
      boardNum - score
    }`;
  }
  loseMessage() {
    messageEl.textContent = "You loose, Computer Wins!";
  }
}

//----------------Game Logic and Utility Functions----------------
//Function for creating a board with numOfItems
// Create 100 tiles the max size of board
function createItems(numOfDiv) {
  itemArray = [];
  for (let i = 0; i <= numOfDiv + 1; i++) {
    let child = document.createElement("div");
    child.textContent = i;
    child.id = i;
    child.className = "item";
    itemArray.push(child);
    parentDiv.appendChild(child);
  }
}

// Dice Roll
function rollDice(id) {
  const roll = Math.trunc(Math.random() * 6) + 1;
  id == 1 ? (dice1.src = `dice-${roll}.png`) : (dice2.src = `dice-${roll}.png`);
  return roll;
}

//Playing Logic
function playLogic(player, color, tooglePlayer) {
  //Show players turn
  message.turnMessage(tooglePlayer);
  // 1. First remove color from previous position
  board.removeColor(player.score, color);
  //2. Roll dice
  let roll = rollDice(player.playerId);
  //3.1 If score is less than last tile number
  if (roll + player.score < boardNum) {
    player.addScore(roll);
    //3.1.1 if it falls in portals
    if (
      portals.greenPortals.includes(player.score) ||
      portals.redPortals.includes(player.score)
    ) {
      if (portals.greenPortals.includes(player.score)) {
        player.addScore(
          portals.greenPortalAdd[portals.greenPortals.indexOf(player.score)]
        );

        message.greenMessage(player.playerId);
        //Red portal
      } else {
        player.addScore(
          portals.redPortalMinus[portals.redPortals.indexOf(player.score)]
        );

        message.redMessage(player.playerId);
      }
    }
    player.showScore();
    board.addColor(player.score, color);

    activePlayer = tooglePlayer;
    //3.2 if score is equal to winning number
  } else if (roll + player.score === boardNum) {
    player.addScore(roll);
    if (playerNum === 1 && player.playerId === 2) message.loseMessage();
    else {
      message.winMessage(activePlayer);
    }
    player.showScore();
    board.addColor(player.score, color);
    activePlayer = 0;
    //3.3 greater than winning number. Player will have to wait
  } else {
    message.anyMessage(player.playerId, player.score);
    player.showScore();
    board.addColor(player.score, color);
    activePlayer = tooglePlayer;
  }
}

//--------------------Initialize board----------------

// Create Board Layout
function boardLayout() {
  //Max size of Board
  createItems(numOfItems);

  // Start and End tiles
  itemArray[0].textContent = "Start";
  itemArray[itemArray.length - 1].textContent = "End";

  for (let i = 0; i < portals.greenPortals.length; i++) {
    itemArray[portals.greenPortals[i]].classList.add("green");
  }
  for (let i = 0; i < portals.redPortals.length; i++) {
    itemArray[portals.redPortals[i]].classList.add("red");
  }
}
function newBoard(boardNum) {
  // Remove End tiles from 25,50 and 100
  for (let i = 0; i <= 101; i++) {
    itemArray[i].classList.remove("hidden");
  }
  itemArray[25].textContent = 25;
  itemArray[50].textContent = 50;
  //At end tiles to boardNum
  itemArray[boardNum].textContent = "End";
  for (let i = boardNum + 1; i <= 101; i++) {
    itemArray[i].classList.add("hidden");
  }
}

//-----------Object Initialize--------
// Layout Board
boardLayout();
// Board object
const board = new Board(itemArray, p1Color, p2Color, bothColor);
// Player Object initialize/create
const player1 = new Player(p1Score, p1ScoreEl, 1);
const player2 = new Player(p2Score, p2ScoreEl, 2);
//message Object
const message = new Message();

//---------------------------init function----------
function init() {
  //------------Initial state-------
  modal.classList.remove("hidden");
  boardContainer.classList.add("hidden");
  //boardRequirements();
  p1ScoreEl.textContent = 0;
  p2ScoreEl.textContent = 0;
  board.removeColor(player1.score, p1Color);
  board.removeColor(player2.score, p2Color);
  player1.resetScore();
  player2.resetScore();
  activePlayer = 0;
}

init();

//-------------------User Input ---------------------

//Button press events

//Player 1 keyboard key 'a'
document.addEventListener("keydown", function (keyObj) {
  if (keyObj.key === "a" && activePlayer === 1) playLogic(player1, p1Color, 2);
  if (playerNum === 1 && activePlayer === 2) playLogic(player2, p2Color, 1);
});
// Player 1 button click
player1button.addEventListener("click", function () {
  if (activePlayer === 1) playLogic(player1, p1Color, 2);
  if (playerNum === 1 && activePlayer === 2) playLogic(player2, p2Color, 1);
});

// Player 2 keyboard key 'Insert'

document.addEventListener("keydown", function (keyObj) {
  if (keyObj.key === "Insert" && activePlayer === 2 && playerNum === 2) {
    playLogic(player2, p2Color, 1);
  }
});

//Player 2 button click
player2button.addEventListener("click", function () {
  if (activePlayer === 2 && playerNum === 2) {
    playLogic(player2, p2Color, 1);
  }
});

// Reset Game
reset.addEventListener("click", function () {
  init();
});

//Start button || shows board, hides modal
start.addEventListener("click", function () {
  boardNum = parseInt(boardSize.options[boardSize.selectedIndex].value);
  playerNum = parseInt(playerNumber.options[playerNumber.selectedIndex].value);
  newBoard(boardNum);
  boardContainer.classList.remove("hidden");
  modal.classList.add("hidden");
  //Single Player or 2 player mode
  if (playerNum === 1) player2button.textContent = "Computer";
  else {
    player2button.textContent = "Player 2";
  }
  message.turnMessage(1);
  activePlayer = 1;
});
