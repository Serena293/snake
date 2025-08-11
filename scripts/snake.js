const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("high-score");

let snake = [{ x: 10, y: 10 }];
const gridSize = 20;
let gameStarted = false;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;


let highScore = 0;

const drawSnake = () => {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};

const draw = () => {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore()
};

const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

// set the position of the snake or the food

const setPosition = (element, position) => {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
};

const drawFood = () => {
  if(gameStarted){
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.append(foodElement);
  }
};

const generateFood = () => {
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
};
let food = generateFood();


const move = () => {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;

    case "up":
      head.y--; 
      break;

    case "down":
      head.y++;
      break;

    case "left":
      head.x--;
      break;
  }
  snake.unshift(head); 

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};

const startGame = () => {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  loadHighScore( )
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};

const handleKeyPress = (event) => {

  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        if (direction !== "up") direction = "down";
        break;
      case "ArrowLeft":
        if (direction !== "right") direction = "left";
        break;
      case "ArrowRight":
        if (direction !== "left") direction = "right";
        break;
    }
  }
};

const increaseSpead = () => {
 
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
};

const checkCollision = () => {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
};

const resetGame = () => {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
};

const updateScore = () => {
 const currentScore = snake.length - 1;
  score.textContent = currentScore
};

const stopGame = () => {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = "block";
};

const updateHighScore = () => {
  const currentScore = snake.length - 1;
  const savedHighScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
    localStorage.setItem('highScore', highScore)
  }
  highScoreText.style.display = "block";
};


const loadHighScore = () => {
  const savedHighScore = parseInt(localStorage.getItem("highScore"), 10) || 0;
  highScore = savedHighScore;
  highScoreText.textContent = highScore.toString().padStart(3, "0");
};

document.addEventListener("keydown", handleKeyPress);

 