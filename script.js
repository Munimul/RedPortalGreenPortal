"use strict";

// Board Item number
let numOfItems = 49;

// Global variable parentDiv, itemArray
let parentDiv, itemArray, lastItem;

//Function for creating a board with numOfItems
function createItems(numOfDiv) {
  parentDiv = document.querySelector(".board");
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

//Initialize board
createItems(numOfItems);
// Start and End tiles
itemArray[0].textContent = "Start";
itemArray[itemArray.length - 1].textContent = "End";

const portals = {
  greenPortals: [5, 17, 24, 32],
  greenPortalAdd: [6, 9, 3, 9],
  redPortals: [8, 13, 21, 28, 39],
  redPortalMinus: [-7, -4, 11, -3, -33],
};

for (let i = 0; i < portals.greenPortals.length; i++) {
  itemArray[portals.greenPortals[i]].classList.add("green");
}
for (let i = 0; i < portals.redPortals.length; i++) {
  itemArray[portals.redPortals[i]].classList.add("red");
}

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

//Player Back-groundColor
const p1Color = "yellow";
const p2Color = "blue";
const bothColor = "black";
const redPortal = "red";
const greenPortal = "green";

//Player Score
const p1Score = 0;
const p2Score = 0;

//Active Player
let activePlayer = 1;

// Dice Roll
function rollDice(id) {
  const roll = Math.trunc(Math.random() * 6) + 1;
  id == 1 ? (dice1.src = `dice-${roll}.png`) : (dice2.src = `dice-${roll}.png`);
  return roll;
}
// Player Class
class Player {
  constructor(score, scoreEl, playerId) {
    this.score = score;
    this.scoreEl = scoreEl;
    this.playerId = playerId;
  }
  addScore(roll) {
    this.score += roll;
  }

  showScore() {
    this.scoreEl.textContent = `${this.score}`;
  }
}

// Player Object initialize/create
const player1 = new Player(p1Score, p1ScoreEl, 1);
const player2 = new Player(p2Score, p2ScoreEl, 2);

//message element
const messageEl = document.querySelector(".message");

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
      numOfItems + 1 - score
    }`;
  }
}
//message Object
const message = new Message();
message.turnMessage(1);

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
// Board object
const board = new Board(itemArray, p1Color, p2Color, bothColor);

//Playing Logic
function playLogic(player, color, tooglePlayer) {
  message.turnMessage(tooglePlayer);
  board.removeColor(player.score, color);
  let roll = rollDice(player.playerId);
  if (roll + player.score < numOfItems + 1) {
    player.addScore(roll);
    if (
      portals.greenPortals.includes(player.score) ||
      portals.redPortals.includes(player.score)
    ) {
      if (portals.greenPortals.includes(player.score)) {
        player.addScore(
          portals.greenPortalAdd[portals.greenPortals.indexOf(player.score)]
        );

        message.greenMessage(player.playerId);
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
  } else if (roll + player.score === numOfItems + 1) {
    player.addScore(roll);
    message.winMessage(activePlayer);
    player.showScore();
    board.addColor(player.score, color);
    //tooglePlayer === 1 ? alert("Player 2 Wins!") : alert("Player 1 Wins!");
    console.log(tooglePlayer === 1 ? "Player 2 Wins!" : "Player 1 Wins!");
    activePlayer = 0;
  } else {
    message.anyMessage(player.playerId, player.score);
    player.showScore();
    board.addColor(player.score, color);
    activePlayer = tooglePlayer;
  }
}

//Button press events
document.addEventListener("keydown", function (keyObj) {
  if (keyObj.key === "a" && activePlayer === 1) {
    playLogic(player1, p1Color, 2);
  }
});

document.addEventListener("keydown", function (keyObj) {
  if (keyObj.key === "Enter" && activePlayer === 2) {
    playLogic(player2, p2Color, 1);
  }
});
