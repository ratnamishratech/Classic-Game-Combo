// Snake Game Logic
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let hiscoreval = 0;

// Start Snake Game
document.getElementById('snakeGameBtn').onclick = function () {
    document.body.style.backgroundImage = "url('./bg.jpg')";
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('snakeGame').classList.remove('hidden');
    musicSound.play();

    let hiscore = localStorage.getItem("hiscore");
    if (hiscore === null) {
        hiscoreval = 0;
        localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
    } else {
        hiscoreval = JSON.parse(hiscore);
        document.getElementById('hiscoreBox').innerHTML = "HiScore: " + hiscoreval;
    }
    main();
};

// Main loop for Snake Game
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        alert("Game Over! Press any key to play again.");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        document.getElementById('scoreBox').innerHTML = "Score: " + score;
        return;
    }

    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            document.getElementById('hiscoreBox').innerHTML = "HiScore: " + hiscoreval;
        }
        document.getElementById('scoreBox').innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = { x: Math.floor(Math.random() * 15 + 1), y: Math.floor(Math.random() * 15 + 1) };
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Display Snake and Food
    board.innerHTML = '';
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Event listener for key presses in Snake Game
document.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 }; // Start moving down
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

// Whac a Mole Game Logic
let moleGameScore = 0;
let gameActive = true;

// Load audio files
const moleCatchSound = new Audio('mole-catch.wav');
const overSound = new Audio('gameover-whac.mp3');

document.getElementById('whacAMoleBtn').onclick = function () {
    document.body.style.backgroundImage = "url('./mario-bg.jpg')"; // Set the game background
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('moleGame').classList.remove('hidden');
    startWhacAMoleGame();
};

function startWhacAMoleGame() {
    moleGameScore = 0; // Reset score
    gameActive = true; // Reset game status
    document.getElementById('score').textContent = moleGameScore; // Display score

    const moleBoard = document.getElementById('moleBoard');
    moleBoard.innerHTML = '';
    
    // Create 9 divs for the mole board
    for (let i = 0; i < 9; i++) {
        const mole = document.createElement('div');
        moleBoard.appendChild(mole);
        
        // Add click event listener to each mole
        mole.addEventListener('click', () => {
            if (!gameActive) return; // Ignore clicks if game is over
            // Check if the clicked element is a plant
            if (mole.innerHTML.includes('piranha-plant.png')) {
                endGame(); // End the game if the player hits a plant
            } else if (mole.innerHTML.includes('monty-mole.png')) {
                moleGameScore++;
                document.getElementById('score').textContent = moleGameScore;
                moleCatchSound.play(); // Play mole catch sound
                mole.innerHTML = `<img src="monty-mole.png" alt="Mole" />`;
                setTimeout(() => {
                    mole.innerHTML = ''; // Hide mole after 1 second
                }, 1000);
            }
        });
    }

    // Randomly show moles and plants every 1.5 seconds
    const gameInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(gameInterval); // Stop interval if game is over
            return;
        }

        // Generate random indices for mole and plant
        const randomMoleIndex = Math.floor(Math.random() * 9);
        const randomPlantIndex = Math.floor(Math.random() * 9);

        // Ensure the same position isn't chosen for both
        if (randomMoleIndex === randomPlantIndex) {
            randomPlantIndex = (randomMoleIndex + 1) % 9; // Change plant index to avoid collision
        }

        // Show mole and plant in different positions
        moleBoard.children[randomMoleIndex].innerHTML = `<img src="monty-mole.png" alt="Mole" />`;
        moleBoard.children[randomPlantIndex].innerHTML = `<img src="piranha-plant.png" alt="Piranha Plant" />`;

        setTimeout(() => {
            moleBoard.children[randomMoleIndex].innerHTML = ''; // Hide mole after 1 second
            moleBoard.children[randomPlantIndex].innerHTML = ''; // Hide plant after 1 second
        }, 1000);
    }, 1500);
}

//extra
// Function to end the game in Whac-A-Mole
function endGame() {
    gameActive = false; // Set game status to inactive

    // Play the game over sound first, no delay
    overSound.play();

    // Use an event listener to detect when the sound finishes
    overSound.onended = function () {
        // Show the game over message with the correct score and options
        const playAgain = confirm(`Game Over! \nWould you like to play again?`);

        if (playAgain) {
            // Reset the game if the player chooses to play again
            moleGameScore = 0; // Reset score here only if player wants to play again
            startWhacAMoleGame(); // Start the game again
        } else {
          
            document.querySelector('.container').classList.remove('hidden'); // Show the main menu
            document.getElementById('gameContainer').classList.add('hidden'); // Hide the game container
        }
    };
}


// iDragon Game Logic
let iDragonScore = 0;
let gamesActive = false; // Initially set to false
let dinoMovingRight = false; // Flag to track right movement
let lastObstaclePosition = 0; // To track the last position of the obstacle

document.getElementById('iDragonBtn').onclick = function () {
    document.querySelector('.container').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    document.getElementById('iDragonGame').classList.remove('hidden');
    startiDragonGame();
};

function startiDragonGame() {
    iDragonScore = 0; // Reset score
    gamesActive = true; // Start the game
    document.getElementById('scoreCont').textContent = 'Your Score: ' + iDragonScore;

    // Move the obstacle
    const obstacle = document.querySelector('.obstacle');
    obstacle.style.left = '100vw'; // Start off-screen
    lastObstaclePosition = parseFloat(obstacle.style.left); // Initialize last obstacle position

    let obstacleInterval = setInterval(() => {
        if (!gamesActive) {
            clearInterval(obstacleInterval);
            return;
        }

        const obstaclePosition = obstacle.getBoundingClientRect();
        const dinoPosition = document.querySelector('.dino').getBoundingClientRect();

        // Check for collision
        if (
            obstaclePosition.left < dinoPosition.right &&
            obstaclePosition.right > dinoPosition.left &&
            obstaclePosition.top < dinoPosition.bottom
        ) {
            endGame(); // End the game if there's a collision
            return;
        }

        // Move the obstacle to the left
        obstacle.style.left = obstaclePosition.left - 5 + 'px'; // Adjust speed as needed

        // If the obstacle moves off-screen, reset its position
        if (obstaclePosition.right < 0) {
            obstacle.style.left = '100vw'; // Reset position to right
            // Check if the obstacle passed the dino for scoring
            if (lastObstaclePosition > dinoPosition.right) {
                iDragonScore++;
                document.getElementById('scoreCont').textContent = 'Your Score: ' + iDragonScore;
            }
            lastObstaclePosition = parseFloat(obstacle.style.left); // Update last obstacle position
        }
    }, 100);

    // Event listener for jumping and moving
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(e) {
    if (e.key === 'ArrowUp' && gamesActive) { // Check for up arrow
        jump();
    }
    if (e.key === 'ArrowRight' && gamesActive) { // Check for right arrow
        moveRight();
    }
}

function jump() {
    const dino = document.querySelector('.dino');
    if (!dino.classList.contains('animateDino')) {
        dino.classList.add('animateDino');

        // Remove the jump class after the animation duration
        setTimeout(() => {
            dino.classList.remove('animateDino');
        }, 600); // Adjust duration to match CSS
    }
}

function moveRight() {
    const dino = document.querySelector('.dino');
    if (!dinoMovingRight) {
        dinoMovingRight = true; // Set the flag to true
        const dinoPosition = dino.getBoundingClientRect();
        const moveInterval = setInterval(() => {
            const newPosition = dino.getBoundingClientRect();
            // Move dino only if it is not off-screen
            if (newPosition.right < window.innerWidth) {
                dino.style.left = (newPosition.left + 70) + 'px'; // Move right by 70px
            } else {
                clearInterval(moveInterval); // Stop moving if at the edge
            }
        }, 200);

        // Stop moving after 300 milliseconds
        setTimeout(() => {
            clearInterval(moveInterval);
            dinoMovingRight = false; // Reset the flag
        }, 300);
    }
}

// Function to end the game
function endGame() {
    gamesActive = false; // Set game status to inactive
    alert(`Game Over! Your final score is ${iDragonScore}.`);
    document.querySelector('.container').classList.remove('hidden'); // Show main menu
    document.getElementById('gameContainer').classList.add('hidden'); // Hide game container
    // Remove the event listener to prevent further jumping
    document.removeEventListener('keydown', handleKeyPress);
}

//extra
// Function to end the game in iDragon
function endGame() {
    gamesActive = false; // Set game status to inactive

    const finalScore = iDragonScore; // Store the score before any reset

    // Show the game over message with the correct score and options
    const playAgain = confirm(`Game Over!\nWould you like to play again?`);

    if (playAgain) {
        // Reset the game if the player chooses to play again
        iDragonScore = 0; // Reset score only if player wants to play again
        startiDragonGame(); // Start the game again
    } else {
        // Exit to the main menu
        document.querySelector('.container').classList.remove('hidden'); // Show main menu
        document.getElementById('gameContainer').classList.add('hidden'); // Hide game container
    }
}


