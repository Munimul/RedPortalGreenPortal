"use strict";

// Board Item number
let numOfItems = 50;

// Global variable parentDiv, itemArray
let parentDiv, itemArray, lastItem;

//Function for creating a board with numOfItems
function createItems(numOfDiv) {
  parentDiv = document.querySelector(".board");
  itemArray = [];

  for (let i = 0; i <= numOfDiv; i++) {
    let child = document.createElement("div");
    if (i === 0) {
      child.textContent = "Start";
    } else {
      child.textContent = i;
    }
    child.id = i;
    child.className = "item";

    itemArray.push(child);
    parentDiv.appendChild(child);
  }
  lastItem = document.createElement("div");
  lastItem.id = numOfDiv.length + 1;
  lastItem.className = "item";
  lastItem.textContent = "Finish";
  itemArray.push(lastItem);
  parentDiv.appendChild(lastItem);
}

//Initialize board
createItems(numOfItems);

// Player Button
const player1button = document.getElementById("player1");
const player2button = document.getElementById("player2");

// Player Score Element
const p1ScoreEl = document.querySelector(".p1");
const p2ScoreEl = document.querySelector(".p2");
//Player Score
let p1Score = 0;
let p2Score = 0;

// Player object

function player(score, scoreEl) {
  this.score = score;
  this.scoreEl = scoreEl;
  this.changeScore = function (dice) {
    this.score += dice;
    this.scoreEl.textContent = `${this.score}`;
  };
  this.changeColor = function () {
    itemArray[this.score].classList.add("green");
  };
}

const player1 = new player(p1Score, p1ScoreEl);
const player2 = new player(p2Score, p2ScoreEl);

player1button.addEventListener("click", function () {
  player1.changeScore(4);
  console.log(player1.score);
  player1.changeColor();
});
