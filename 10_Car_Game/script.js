const gameArea = document.querySelector(".gameArea");
const startScreen = document.querySelector(".startScreen");

let player = { speed: 4, score: 0, inPlay: false };
let keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

document.addEventListener("keydown", (e) => (keys[e.key] = true));
document.addEventListener("keyup", (e) => (keys[e.key] = false));
startScreen.addEventListener("click", startGame);

function isCollide(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function moveLines() {
  document.querySelectorAll(".roadLine").forEach((line) => {
    line.y += player.speed;
    if (line.y >= 700) line.y = -100;
    line.style.top = line.y + "px";
  });
}

function moveEnemy(car) {
  const enemies = document.querySelectorAll(".enemy");
  const scoreBoard = document.querySelector(".score");

  enemies.forEach((enemy) => {
    if (isCollide(car, enemy)) {
      endGame();
    }

    enemy.y += player.speed;
    if (enemy.y >= 700) {
      enemy.y = -200;
      enemy.style.left = Math.floor(Math.random() * 350) + "px";
      player.score++;
      scoreBoard.textContent = "Score: " + player.score;
    }
    enemy.style.top = enemy.y + "px";
  });
}

function gamePlay() {
  if (!player.inPlay) return;

  const car = document.querySelector(".car");
  const road = gameArea.getBoundingClientRect();

  moveLines();
  moveEnemy(car);

  if (keys.ArrowLeft && player.x > 0) player.x -= 5;
  if (keys.ArrowRight && player.x < road.width - 50) player.x += 5;
  if (keys.ArrowUp && player.y > 0) player.y -= 5;
  if (keys.ArrowDown && player.y < road.height - 100) player.y += 5;

  car.style.left = player.x + "px";
  car.style.top = player.y + "px";

  requestAnimationFrame(gamePlay);
}

function endGame() {
  player.inPlay = false;
  startScreen.classList.remove("hide");
  startScreen.innerHTML = `
        <h2>💥 Game Over!</h2>
        <p>Your Score: ${player.score}</p>
        <div class="bottomBar">
          <button class="restartBtn">Restart</button>
        </div>
      `;
  document.querySelector(".restartBtn").addEventListener("click", restartGame);
}

function restartGame() {
  startScreen.innerHTML = `
        <h2>🚗 Car Racing Game</h2>
        <p>Click Here to Start</p>
      `;
  startScreen.classList.remove("hide");
  startGame();
}

function startGame() {
  gameArea.innerHTML = `<div class="score">Score: 0</div>`;
  startScreen.classList.add("hide");

  player.inPlay = true;
  player.score = 0;
  player.speed = 4;

  // Road lines
  for (let i = 0; i < 6; i++) {
    const line = document.createElement("div");
    line.classList.add("roadLine");
    line.y = i * 120;
    line.style.top = line.y + "px";
    gameArea.appendChild(line);
  }

  // Car
  const car = document.createElement("div");
  car.classList.add("car");
  gameArea.appendChild(car);
  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  // Enemies
  for (let i = 0; i < 3; i++) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = (i + 1) * -250;
    enemy.style.top = enemy.y + "px";
    enemy.style.left = Math.floor(Math.random() * 350) + "px";
    gameArea.appendChild(enemy);
  }

  requestAnimationFrame(gamePlay);
}
