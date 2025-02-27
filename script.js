//Take name from user
// let firstName  = prompt("Hey! Welcome What's your name... ");
// let user_name  = document.getElementById("#user-name");

// Function to reload the page when called
function reload() {
  window.location.reload();
}

// DOM elements representing the game board boxes, player turns, message display, and buttons
let boxes = document.querySelectorAll(".boxes"); // All the clickable boxes for the tic-tac-toe game
let turn1 = document.querySelector(".turn1"); // Element representing player X's turn
let turn2 = document.querySelector(".turn2"); // Element representing player O's turn
let msg = document.querySelector(".msg"); // Element to display the winner message
let winner_result = document.querySelector("#winner-result"); // Element to show who won (X or O)
let reset = document.querySelector("#reset"); // Button to reset the game
let new_game = document.querySelector("#new-game"); // Button to start a new game

// Game control variables
let turnX = true; // Boolean to track if it's X's turn (true = X's turn, false = O's turn)
let clickSound = new Audio("/Image/notification.mp3"); // Sound effect for clicking on a box
let winner_sound = new Audio("/Image/winner.wav"); // Sound effect when there's a winner

// Array representing all possible winning combinations (by index of the boxes)
let winnerCondition = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal from top-left to bottom-right
  [2, 4, 6], // Diagonal from top-right to bottom-left
];

// Event listener for the "Reset" button to clear the game board
reset.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.innerText = ""; // Clear the box
    box.disabled = false; // Make the box clickable again
    box.classList.add("hover"); // Add hover effect back to the box
    msg.classList.add("hide"); //  Hide the result message
  });
});

// Event listener for the "New Game" button to reload the page and start fresh
new_game.addEventListener("click", () => {
  boxes.forEach((box) => {
    reload(); // Reload the browser to reset everything
    box.innerText = "";
    box.disabled = false;
    box.classList.add("hover");
    msg.classList.add("hide");
  });
});

// Adding click event listeners to each box (game cells)
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    clickSound.play(); // Play click sound when a box is clicked

    // If it's X's turn, mark the box with "X" and switch to O's turn
    if (turnX) {
      box.innerText = "X"; // Display "X" in the box
      box.style.color = "rgb(237, 2, 2)"; // Set the color for "X"
      turn2.classList.add("box-shadow-turn"); // Highlight O's turn visually
      turn1.classList.remove("box-shadow-turn"); // Remove highlight from X's turn
      turnX = false; // Change turn to O
    } else {
      // If it's O's turn, mark the box with "O" and switch to X's turn
      box.innerText = "O"; // Display "O" in the box
      box.style.color = "rgb(255, 255, 255)";
      turn2.classList.remove("box-shadow-turn"); // Remove highlight from O's turn
      turn1.classList.add("box-shadow-turn"); // Highlight X's turn visually
      turnX = true; // Change turn to X
    }

    // Check if the game has a winner after every move
    checkWinner();
  });
});

// Function to check if there's a winner by comparing the current board state
function checkWinner() {
  for (let condition of winnerCondition) {
    // Loop through each winning condition
    let box1 = boxes[condition[0]].innerText; // Get the value in the first box of the condition
    let box2 = boxes[condition[1]].innerText; // Get the value in the second box
    let box3 = boxes[condition[2]].innerText; // Get the value in the third box

    // Check if all three boxes in the condition are non-empty and match
    if (box1 !== "" || (box2 !== "" && box3 !== "")) {
      if (box1 === box2 && box2 == box3) {
        showResult(box1); // Call function to display the winner (either "X" or "O")
        winner_sound.play(); //play winner sound when a player wins
        confetti_effect();
        bottom_confectti_effect();
      }
    }
  }
}

//Add confetti_effect
function confetti_effect() {
  var end = Date.now() + 7 * 1000; // Run for 7 seconds
  var colors = [
    "#00BFFF",
    "#39FF14",
    "#FF69B4",
    "#FF4500",
    "#32CD32",
    "#DC143C",
  ];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

//Add bottom confetti efect
function bottom_confectti_effect() {
  var count = 200;
  var defaults = {
    origin: { y: 1 },
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

// Function to display the winner and disable further moves
function showResult(result) {
  boxes.forEach((box) => {
    box.disabled = true; // Disable all boxes to prevent further clicks after the game ends
    box.classList.remove("hover");
  });
}

// Function to display the winner and disable further moves
function showResult(result) {
  boxes.forEach((box) => {
    box.disabled = true; // Disable all boxes to prevent further clicks after the game ends
    box.classList.remove("hover"); // Remove hover effect since the game is over
  });
  msg.classList.remove("hide"); // Show the result message
  winner_result.innerText = result; // Display the winner (X or O) in the message

  // Change the color of the winner text based on whether X or O won
  if (result === "X") {
    winner_result.style.color = "rgb(237, 2, 2)"; //x's color
  } else {
    winner_result.style.color = "rgb(255, 255, 255)"; //O's color
  }
}
