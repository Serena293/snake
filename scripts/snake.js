const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("high-score");

// //Il serpente  è un array di oggetti, l'oggetto è contine la posizione del serpente
let snake = [{ x: 10, y: 10 }]; //x:10, y:10 perchè abbiamo dato delle dimensioni fiesse, quidi inizierà più o meno al centro
const gridSize = 20;
let gameStarted = false;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;


let highScore = 0;

// disegna il serpente
//per ogni oggetto contenuto nell'array snake (segment) invoca due funzioni
//una che crea l'elemento e una che lo posiziona
const drawSnake = () => {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};



// //Draw the game board and the food
// //Set to a clear board every time the function is called
// //and create the new snake
const draw = () => {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore()
};

// //Create a snake or food
// //Function with two parameters. When we call the function inside drowSnake
// //it will take the parameters 'div' and 'snake'

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

//It draws a random food, it uses the setPosition function with the parameter food
//food gets randomly generated
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

// //to move the snake we use the spread operetor, so that we create a copy
// // of the intex 0 of the array

const move = () => {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;

    case "up":
      head.y--; //perchè i numeri verso l'alto sono in negativo
      break;

    case "down":
      head.y++;
      break;

    case "left":
      head.x--;
      break;
  }
  snake.unshift(head); //creaiamo una nuova testa e la mettiamo all'inizio di snake.
//   // snake.pop(); //rimuoviamo l'ultimo pezzo della coda.
//   //quindi in realtà il serpente non si muove  ma lo assmbliamo e disassembliamo
//   //questo deve avvenire quando non colpiamo il cibo, quando non colpiamo il cibo
//   //il serpente deve rimanere della dimensione

//   //l'if considera qundo il serpente colpisce il cibo, ovvero quando la testa del serpente
//   //si ha le stesse esatte cordinate del cibo. In questo caso non c'è bisogno del pop, poichè
//   //le dimensioni del serpente deveno aumentare

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval(gameInterval); //reset the movement
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};

// // //test
// // setInterval(() => {
// //   move()
// //   draw()
// // },200)

const startGame = () => {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  loadHighScore()
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};


// //le due condizioni servono a coprie tutti i tipi di browser
const handleKeyPress = (event) => {

  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
    // updateScore()
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
  //   console.log(gameSpeedDelay);
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

 