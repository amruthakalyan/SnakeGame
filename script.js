document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const gridSize = 20;
  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 15 };
  let direction = "right";
  let speed = 5; // Initial speed

  // Sound effects
  const eatSound = document.getElementById("eatSound");
  const gameOverSound = document.getElementById("gameOverSound");

  function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake
    ctx.fillStyle = "#00F";
    snake.forEach(segment => {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Draw Food
    ctx.fillStyle = "#F00";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }

  function update() {
    // Update Snake position
    const head = { ...snake[0] };

    switch (direction) {
      case "up":
        head.y -= 1;
        break;
      case "down":
        head.y += 1;
        break;
      case "left":
        head.x -= 1;
        break;
      case "right":
        head.x += 1;
        break;
    }

    snake.unshift(head);

    // Check if Snake eats food
    if (head.x === food.x && head.y === food.y) {
      // Generate new food at a random position
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
      };

      // Increase the speed of the game based on snake length
      speed += 0.2;

      // Play eat sound
      playSound(eatSound);
    } else {
      // Remove the last segment of the snake if it didn't eat food
      snake.pop();
    }

    // Check for collision with walls or itself
    if (
      head.x < 0 ||
      head.x >= canvas.width / gridSize ||
      head.y < 0 ||
      head.y >= canvas.height / gridSize ||
      checkCollision()
    ) {
      // Play game over sound
      playSound(gameOverSound);

      alert("Game Over!");
      resetGame();
    }
  }

  function checkCollision() {
    const head = snake[0];
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }

  function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    direction = "right";
    speed = 5; // Reset speed
  }

  function handleKeyPress(e) {
    switch (e.key) {
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

  // Event listener for keyboard input
  document.addEventListener("keydown", handleKeyPress);

  // Game loop
  function gameLoop() {
    draw();
    update();
    setTimeout(gameLoop, 1000 / speed);
  }

  // Initial game loop
  gameLoop();
});