//Take name from user
// let firstName  = prompt("Hey! Welcome What's your name... ");
// let user_name  = document.getElementById("#user-name");

// Function to reload the page when called

function reload() {
  window.location.reload();
}

//------------------------------------------------------------------------------
// DOM elements representing the game board boxes, player turns, message display, and buttons
let boxes = document.querySelectorAll(".boxes"); // All the clickable boxes for the tic-tac-toe game
let turn1 = document.querySelector(".turn1"); // Element representing player X's turn
let turn2 = document.querySelector(".turn2"); // Element representing player O's turn
let msg = document.querySelector(".msg");
let winner_result = document.querySelector("#winner-result"); // Element to show who won (X or O)
let reset = document.querySelector("#reset"); // Button to reset the game
let new_game = document.querySelector("#new-game"); // Button to start a new game
let user_name = document.querySelector("#user-name"); // Element to display the user's name
let start_game = document.querySelector("#start-game"); // Button to start the game

let controlBtns = document.querySelectorAll(".btn");
controlBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.add("shadow2");
    btn.classList.remove("shadow1");
    setTimeout(() => {
      btn.classList.add("shadow1");
      btn.classList.remove("shadow2");
    }, 300); // 0.3 second later back to normal
  });
});

// Game control variables
let turnX = true; // Boolean to track if it's X's turn (true = X's turn, false = O's turn)
let clickSound = new Audio("/Image/notification.mp3"); // Sound effect for clicking on a box
let winner_sound = new Audio("/Image/winner.wav"); // Sound effect when there's a winner
let gameDraw = new Audio("/Image/draw_sound.mp3"); // Sound effect for a draw in the game
//------------------------------------------------------------------------------
// Variables to store player names and game state
let userName = "";
let player1Name = "";
let player2Name = "";
let currentStep = 0;
let message = "";

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

// Random line picker
function getRandomLine(lines) {
  let randomIndex = Math.floor(Math.random() * lines.length);
  return lines[randomIndex];
}

// Winner lines X
function getWinnerLinesX(player1Name) {
  return [
    `Congratulations ${player1Name}! You are unstoppable as Player X!`,
    `Woohoo! ${player1Name} takes the victory as X!`,
    `Amazing move! ${player1Name}, you win the match as Player X!`,
    `Bravo! ${player1Name} dominates this round as X!`,
    `${player1Name}, you’re the champion playing as X!`,
  ];
}

// Winner lines O
function getWinnerLinesO(player2Name) {
  return [
    `Congratulations ${player2Name}! You did it as Player O!`,
    `Yes! ${player2Name} wins the match as O!`,
    `Fantastic! ${player2Name} takes the victory as Player O!`,
    `Unbelievable! ${player2Name} comes out on top as O!`,
    `${player2Name}, you’re the champion playing as O!`,
  ];
}

// Draw lines
function getDrawLines(player1Name, player2Name) {
  return [
    `Wow! It's a draw. Both ${player1Name} and ${player2Name} played brilliantly!`,
    `Incredible! No winner this time — ${player1Name} and ${player2Name} are equally strong!`,
    `Amazing battle! It's a tie between ${player1Name} and ${player2Name}.`,
    `Neither X nor O could dominate. Great fight ${player1Name} and ${player2Name}!`,
    `It's a perfect balance — a draw between ${player1Name} and ${player2Name}!`,
  ];
}

// Event listener for the "Start Game" button to initiate the game
start_game.addEventListener("click", () => {
  speak(
    `Hello! Welcome to the game. Could you please tell me your name?`,
    () => {
      startRecognition();
    }
  );
  currentStep = 0;
  // startRecognition();
});
// Function to speak a message using the Web Speech API
function speak(text, callback) {
  let speech = new SpeechSynthesisUtterance(text);
  speech.pitch = 1.2; // thoda high tone
  speech.rate = 1.1; // normal speed
  speech.volume = 1; // full volume
  speech.lang = "en-US"; // English accent

  speech.onend = () => {
    if (callback) {
      setTimeout(() => {
        callback();
      }, 0);
    }
  };

  window.speechSynthesis.cancel(); // purane speech clear
  window.speechSynthesis.speak(speech);
}

function startRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    let userSpeech = event.results[0][0].transcript.trim();

    // ✅ Step 0: User name
    if (currentStep === 0) {
      userName = userSpeech;
      speak(
        `Nice to meet you ${userName}. Now, please tell me Player 1's name.`,
        () => {
          startRecognition(); // 🔥 callback se recognition start
        }
      );
      currentStep = 1;
      // setTimeout(() => startRecognition(), 5000); // thoda gap de kar fir se listen

      // ✅ Step 1: Player 1
    } else if (currentStep === 1) {
      player1Name = userSpeech;
      speak(
        `Great! Player 1 is ${player1Name}. Now, please tell me Player 2's name.`,
        () => {
          startRecognition();
        }
      );
      currentStep = 2;
      // setTimeout(() => startRecognition(), 5000);

      // ✅ Step 2: Player 2 (check duplicate with player1)
    } else if (currentStep === 2) {
      if (userSpeech.toLowerCase() === player1Name.toLowerCase()) {
        speak(
          `Oops! Player 2 cannot have the same name as Player 1. Please tell me a different name.`,
          () => {
            startRecognition();
          }
        );
        // setTimeout(() => startRecognition(), 5000); // fir se puchhega
      } else {
        player2Name = userSpeech;
        speak(
          `Awesome! Player 1 is X: ${player1Name}, and Player 2 is O: ${player2Name}. 
          Thank you ${userName} for sharing your name and the players' names. 
          And by the way, this exciting game has been proudly created by Prince Bhai.
          Now get ready — it's time to play the game! 
          Let's begin${userName}!`
        );
        currentStep = 3;
      }
    }
  };

  recognition.onerror = (e) => {
    speak(`Sorry, I didn't catch that. Could you please repeat?`, () => {
      startRecognition();
    });
    // setTimeout(() => startRecognition(), 4000);
  };

  recognition.start(); // ✅ har baar correct place par start
}

//---------------------------Reset and New Game Functionality---------------------------
// Event listener for the "Reset" button to clear the game board
reset.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.innerText = ""; // Clear the box
    box.disabled = false; // Make the box clickable again
    box.classList.add("hover"); // Add hover effect back to the box
    msg.classList.add("hide"); //  Hide the result message
    user_name.innerText = "Winner ";
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

//----------------------------------game cells turnx , turno click event--------------------------------
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

//----------------------------------checkWinner function--------------------------------
// Function to check if there's a winner by comparing the current board state
function checkWinner() {
  user_name.innerText = "Winner "; // Reset the winner text
  for (let condition of winnerCondition) {
    // Loop through each winning condition
    let box1 = boxes[condition[0]].innerText; // Get the value in the first box of the condition
    let box2 = boxes[condition[1]].innerText; // Get the value in the second box
    let box3 = boxes[condition[2]].innerText; // Get the value in the third box

    // Check if all three boxes in the condition are non-empty and match
    if (box1 !== "" && box2 !== "" && box3 !== "") {
      if (box1 === box2 && box2 == box3) {
        if (box1 === "X") {
          setTimeout(() => showResult(player1Name), 100);
          // Call function to display the winner (X)
        } else {
          setTimeout(() => showResult(player2Name), 100);
        }
        // Call function to display the winner (either "X" or "O")
        winner_sound.play(); //play winner sound when a player wins
        confetti_effect();
        bottom_confectti_effect();
      }
    }
  }

  // ✅ Agar winner nahi mila, tabhi draw check karo
  let isDraw = [...boxes].every((box) => box.innerText !== "");

  // Agar saare boxes fill ho gaye aur koi winner nahi mila → Draw
  if (isDraw) {
    gameDraw.play(); // Play draw sound effect
    msg.classList.remove("hide"); // Show the result message
    winner_result.innerText = "Game Draw"; // Display draw message
    winner_result.style.color = "#00FFFF"; // Set color for draw message
    msg.style.fontSize = "1rem";
    user_name.innerText = "";
    let drawMessage = getRandomLine(getDrawLines(player1Name, player2Name)); // Speak a random congratulatory message for X);
    speak(drawMessage); // Speak the draw message
  }
}

//-------------------showResult function--------------------
// Function to display the winner and disable further moves
function showResult(result) {
  boxes.forEach((box) => {
    box.disabled = true; //Disable all boxes to prevent further clicks after the game ends
    box.classList.remove("hover"); //Remove hover effect since the game is over
  });

  winner_result.innerText = result; // Display the winner (X or O) in the message
  msg.classList.remove("hide");
  // Change the color of the winner text based on whether X or O won
  if (result === player1Name) {
    message = getRandomLine(getWinnerLinesX(player1Name));

    winner_result.style.color = "rgb(237, 2, 2)"; //x's color
  } else if (result === player2Name) {
    message = getRandomLine(getWinnerLinesO(player2Name));

    winner_result.style.color = "rgb(255, 255, 255)"; //O's color
  } else {
    message = getRandomLine(getDrawLines(player1Name, player2Name)); // Speak a random congratulatory message for X);
  }

  setTimeout(() => {
    speak(message);
  }, 1000); // Speak a random congratulatory message for O
}

//-----------------------------------------Confetti Effect----------------------------------------
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
