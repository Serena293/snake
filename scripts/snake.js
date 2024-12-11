const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");

//Il serpente  è un array di oggetti, l'oggetto è contine la posizione del serpente
let snake = [{ x: 10, y: 10 }]; //x:10, y:10 perchè abbiamo dato delle dimensioni fiesse, quidi inizierà più o meno al centro
const gridSize = 20;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 300;
let gameStarted = false;

//disegna il serpente
const drawSnake = () => {
  snake.forEach((segment) => {
    const snakeElemente = createGameElement("div", "snake");
    setPoistion(snakeElemente, segment);
    board.appendChild(snakeElemente);
  });
};

//Draw the game board and the food
//Set to a clear board every time the function is called
//and create the new snake
const draw = () => {
  board.innerHTML = "";
  drawSnake();
  drawFood();
};

//Create a snake or food
//Function with two parameters. When we call the function inside drowSnake
//it will take the parameters 'div' and 'snake'
const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

//set the position of the snake or the food
const setPoistion = (element, position) => {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
};

const drawFood = () => {
  const foodElement = createGameElement("div", "food");
  setPoistion(foodElement, food);
  board.append(foodElement);
};

const generateFood = () => {
  const x = Math.floor(Math.random() * gridSize + 1);
  const y = Math.floor(Math.random() * gridSize + 1);
  return { x, y };
};
let food = generateFood();

//to move the snake we use the spread operetor, so that we create a copy
// of the intex 0 of the array
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
  // snake.pop(); //rimuoviamo l'ultimo pezzo della coda.
  //quindi in realtà il serpente non si muove  ma lo assmbliamo e disassembliamo
  //questo deve avvenire quando non colpiamo il cibo, quando non colpiamo il cibo
  //il serpente deve rimanere della dimensione

  //l'if considera qundo il serpente colpisce il cibo, ovvero quando la testa del serpente
  //si ha le stesse esatte cordinate del cibo. In questo caso non c'è bisogno del pop, poichè
  //le dimensioni del serpente deveno aumentare

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    clearInterval(gameInterval); //reaset the movement
    gameInterval = setInterval(() => {
      move();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }

};

// //test
// setInterval(() => {
//   move()
//   draw()
// },200)

const startGame = () => {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    // checkCollision()
    draw();
  }, gameSpeedDelay);
};

// draw()
//le due condizioni servono a coprie tutti i tipi di browser
const handleKeyPress = (event) => {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
};




document.addEventListener('keydown', handleKeyPress)
startGame()
