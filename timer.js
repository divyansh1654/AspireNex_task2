// js/timer.js

let totalTime = 300; // Default total time in seconds (5 minutes)
let timeLeft = totalTime;
let timerInterval;

// Function to set custom quiz duration
document.getElementById('setTimeButton').addEventListener('click', function() {
  const userInput = document.getElementById('quiz-time').value;
  totalTime = userInput * 60; // Convert minutes to seconds
  timeLeft = totalTime;
  updateTimerDisplay();
});

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(updateTimer, 1000);
}

// Function to update the timer every second
function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    updateTimerDisplay();
  } else {
    finishQuiz(); // Implement this function to handle quiz completion
  }
}

// Function to stop the timer
function stopTimer() {
  clearInterval(timerInterval);
}

// Function to update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  document.getElementById('countdown').innerHTML = `${minutes}:${seconds}`;
}

// Call startTimer when your quiz starts
startTimer();
