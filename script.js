let inputDir = { x: 0, y: 0 };
let lastPaintTime = 0;
let board = document.getElementById("board");
let scoreBox = document.getElementById("score");
let highScoreBox = document.getElementById("highScore");
let speed = 4;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScoreBox.innerHTML = highScore;
const gameOver = new Audio("./media/gameOver.mp3");
let snakeArray = [{ x: 13, y: 15 }];

let food = { x: 6, y: 7 };
let moveSound = new Audio("./media/move.mp3");
let foodSound = new Audio("./media/food.mp3");
const gamesound = new Audio("./media/game.mp3");

let isGameRunning = false;

function main(ctime) {
  window.requestAnimationFrame(main);

  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }

  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snakeArray) {
  for (let i = 1; i < snakeArray.length; i++) {
    if (snakeArray[i].x === snakeArray[0].x && snakeArray[i].y === snakeArray[0].y) {
      return true;
    }
  }

  if (snakeArray[0].x >= 18 || snakeArray[0].x < 0 || snakeArray[0].y >= 18 || snakeArray[0].y < 0) {
    return true;
  }

  return false;
}

function gameEngine() {
  if (isCollide(snakeArray)) {
    gamesound.pause();
    gamesound.currentTime = 0;
    gameOver.play();
    inputDir = { x: 0, y: 0 };
    alert("Game Over! Press any key to Play again");

    snakeArray = [{ x: 13, y: 15 }];
    score = 0;
    speed = 4;
    isGameRunning = false;
    scoreBox.innerHTML = score;
    return;
  }

  if (snakeArray[0].y === food.y && snakeArray[0].x === food.x) {
    foodSound.play();
    snakeArray.unshift({
      x: snakeArray[0].x + inputDir.x,
      y: snakeArray[0].y + inputDir.y,
    });

    score += 1;
    scoreBox.innerHTML = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreBox.innerHTML = highScore;
    }

    speed += 0.05;

    let a = 2;
    let b = 16;
    let newFoodPosition;

    do {
      newFoodPosition = {
        x: Math.round(a + (b - a) * Math.random()),
        y: Math.round(a + (b - a) * Math.random())
      };
    } while (snakeArray.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));

    food = newFoodPosition;
  }

  for (let i = snakeArray.length - 2; i >= 0; i--) {
    snakeArray[i + 1] = { ...snakeArray[i] };
  }

  if (inputDir.x !== 0 || inputDir.y !== 0) {
    moveSound.pause();
    moveSound.currentTime = 0;
    moveSound.play();
  }

  snakeArray[0].x += inputDir.x;
  snakeArray[0].y += inputDir.y;

  board.innerHTML = "";

  snakeArray.forEach((e, index) => {
    let snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;

    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("body");
    }

    board.appendChild(snakeElement);
  });

  let foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");

  board.appendChild(foodElement);
}

window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && inputDir.y !== 1) {
    inputDir = { x: 0, y: -1 };
  } else if (e.key === "ArrowDown" && inputDir.y !== -1) {
    inputDir = { x: 0, y: 1 };
  } else if (e.key === "ArrowLeft" && inputDir.x !== 1) {
    inputDir = { x: -1, y: 0 };
  } else if (e.key === "ArrowRight" && inputDir.x !== -1) {
    inputDir = { x: 1, y: 0 };
  }

  if (!isGameRunning) {
    gamesound.play();
    isGameRunning = true;
  }
});

