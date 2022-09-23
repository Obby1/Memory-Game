//declare variables
const gameContainer = document.getElementById("game");
const totalGamesPlayed = document.querySelector("#totalGamesPlayed");
const COLORS = [
  "lightcoral",
  "lightskyblue",
  "lightgreen",
  "gold",
  "orchid",
  "lightcoral",
  "lightskyblue",
  "lightgreen",
  "gold",
  "orchid",
  "lightcoral",
  "lightskyblue",
  "lightgreen",
  "gold",
  "orchid",
  "lightcoral",
  "lightskyblue",
  "lightgreen",
  "gold",
  "orchid",
];
let card1 = null;
let card2 = null;
let card3 = null;
let card4 = null;
let noClicks = false;
let count = 0;
let gamesPlayed = 0;

// Display Total Games Played
if (localStorage.getItem(`gamesPlayed`)) {
  gamesPlayed = parseInt(localStorage.getItem(`gamesPlayed`));
}
totalGamesPlayed.innerHTML = "Total Games Played = " + gamesPlayed;

//shuffle board
function shuffle(array) {
  let counter = array.length;

  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// set start button
if (gameContainer.innerHTML == ``) {
  const startBtn = document.createElement("button");
  startBtn.classList.add("button");
  startBtn.innerHTML = "START GAME";
  startBtn.addEventListener(`click`, startGame);
  const tempRandomRGB = randomRGB();
  startBtn.style.borderColor = tempRandomRGB;
  startBtn.style.boxShadow = `0px 0px 50px ${tempRandomRGB}`;
  gameContainer.parentElement.append(startBtn);
  setInterval(function () {
    // startBtn.style.borderColor = randomRGB();
    const tempRandomRGB2 = randomRGB();
    startBtn.style.borderColor = tempRandomRGB2;
    startBtn.style.boxShadow = `0px 0px 50px ${tempRandomRGB2}`;
  }, 2000);
}

// declare color array
let shuffledColors = shuffle(COLORS);
// create divs for each color
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    const newDiv = document.createElement("div");
    newDiv.classList.add(color);
    newDiv.classList.add("gameDiv");
    newDiv.addEventListener("click", handleCardClick);
    //add random glow to each div upon load
    const tempRandomRGB = randomRGB();
    newDiv.style.borderColor = tempRandomRGB;
    newDiv.style.boxShadow = `0px 0px 50px ${tempRandomRGB}`;
    gameContainer.append(newDiv);
  }
}

function handleCardClick(event) {
  //block click events
  if (event.target.classList.contains(`flipped`)) return;
  if (noClicks) return;

  //declare current selection
  let currentSelection = event.target;
  currentSelection.setAttribute("style", `background-color:${currentSelection.classList[0]}`);

  //declare cards1 through 4
  if (!card1 && !card2) {
    currentSelection.classList.add("flipped");
    card1 = currentSelection;
    card2 = null;
    card3 = null;
    card4 = null;
  }

  if (card1 && !card2 && !card3 && !card4) {
    currentSelection.classList.add("flipped");
    card2 = currentSelection === card1 ? null : currentSelection;
    card3 = null;
    card4 = null;
  }

  if (card1 && card2 && !card3 && !card4) {
    currentSelection.classList.add("flipped");
    card3 = currentSelection === card1 || currentSelection === card2 ? null : currentSelection;
    card4 = null;
  }

  if (card1 && card2 && card3 && !card4) {
    currentSelection.classList.add("flipped");
    card4 = currentSelection === card1 || currentSelection === card2 || currentSelection === card3 ? null : currentSelection;
  }

  //run function once all cards are declared
  if (card1 && card2 && card3 && card4) {
    compareCards();
  }

  //compare cards
  function compareCards() {
    noClicks = true;
    //check if cards matched
    if (card1.classList[0] === card2.classList[0] && card2.classList[0] === card3.classList[0] && card3.classList[0] === card4.classList[0]) {
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);
      card3.removeEventListener("click", handleCardClick);
      card4.removeEventListener("click", handleCardClick);
      card1 = null;
      card2 = null;
      card3 = null;
      card4 = null;
      count += 4;
      noClicks = false;
      // Ask to play again when game is over
      if (count === 20) {
        alert(`Game Over! Play again?`);
        gamesPlayed = parseInt(gamesPlayed) + 1;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        resetBoard();
      }
    } else {
      //if cards didn't match then reset cards1 through 4
      setTimeout(function () {
        card1.classList.remove(`flipped`);
        card2.classList.remove(`flipped`);
        card3.classList.remove(`flipped`);
        card4.classList.remove(`flipped`);
        card1.setAttribute("style", `background-color: `);
        card2.setAttribute("style", `background-color: `);
        card3.setAttribute("style", `background-color: `);
        card4.setAttribute("style", `background-color: `);
        card1 = null;
        card2 = null;
        card3 = null;
        card4 = null;
        noClicks = false;
      }, 1000);
    }
  }
}

function resetBoard() {
  gameContainer.innerHTML = "";
  shuffle(COLORS);
  createDivsForColors(shuffledColors);
  count = 0;
  // is there a better way to reload the single p element? only found jQuery solutions online
  location.reload();
}

function startGame() {
  gameContainer.innerHTML = "";
  shuffle(COLORS);
  createDivsForColors(shuffledColors);
  count = 0;
  let foundBtn = document.querySelector(".button");
  foundBtn.remove();
  const divBorders = document.querySelectorAll(`.gameDiv`);
  setInterval(function () {
    for (let div of divBorders) {
      //give randomRGB glow to each div
      const tempRandomRGB = randomRGB();
      div.style.borderColor = tempRandomRGB;
      div.style.boxShadow = `0px 0px 50px ${tempRandomRGB}`;
    }
  }, 2000);
}

//changing background colors
document.addEventListener("mousemove", function (e) {
  const page = document.querySelector(`body`);
  let color1 = (e.pageX / window.innerWidth) * 255;
  let color2 = (e.pageY / window.innerHeight) * 255;
  let color3 = ((e.pageX + e.pageY) / (window.innerWidth + window.innerHeight)) * 255;
  page.style.backgroundColor = `RGBA(${color1},${color2},${color3},0.1)`;
});

function randomRGB() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r},${g},${b})`;
}

// To Do List: add extra functionality [better start button, better gameover, total moves, toatl attempts played, bestscore, add css]
// More to do: Fix up the font, soften the borders, pastel background, scoreboard
