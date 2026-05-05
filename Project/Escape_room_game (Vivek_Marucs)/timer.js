/* ============================================ */
/* TIMER GLOBAL VARIABLES                       */
/* ============================================ */

// Variable to store the setInterval ID so we can clear it later
let timerInterval;
// Variable to store the remaining time in seconds
let timeLeft;

/* ============================================ */
/* TIMER INITIALIZATION FUNCTION                */
/* ============================================ */

// Function to initialize the timer when page loads
function initTimer() {
  // Get the timer display element from HTML
  const timerElement = document.getElementById('timer');
  // If timer element doesn't exist on this page, exit the function
  if (!timerElement) return; // If no timer div, skip

  // Check if this is the index.html page (cutscene page)
  if (document.title === "Don't let him find you") return;

  // Get the end time of the timer from session storage
  const endTime = sessionStorage.getItem('timerEndTime');
  // Check if an end time was previously stored
  if (endTime) {
    // Calculate how many seconds remain until the end time
    const remaining = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
    // Check if there's still time remaining
    if (remaining > 0) {
      // Store the remaining time
      timeLeft = remaining;
      // Start displaying the timer
      startTimerDisplay();
    } else {
      // Time is up, remove the stored end time
      sessionStorage.removeItem('timerEndTime');
      // Send player back to the beginning
      window.location.href = 'index.html';
    }
  }
}

/* ============================================ */
/* START TIMER FUNCTION                         */
/* ============================================ */

// Function to start a new timer (called after video ends)
function startTimer() {
  // Calculate when the timer should end (now + 2 minutes = 120000 milliseconds)
  const endTime = Date.now() + 120000; // 3 minutes
  // Store the end time in session storage so it persists if page reloads
  sessionStorage.setItem('timerEndTime', endTime.toString());
  // Set initial time to 120 seconds (seems like 2 minutes for display)
  timeLeft = 120;
  // Start the timer display
  startTimerDisplay();
}

/* ============================================ */
/* TIMER DISPLAY FUNCTION                       */
/* ============================================ */

// Function to start the recurring timer display updates
function startTimerDisplay() {
  // Update the display immediately (don't wait for first interval)
  updateTimerDisplay();
  // Set an interval to update the timer every 1000 milliseconds (1 second)
  timerInterval = setInterval(() => {
    // Get the stored end time from session storage
    const endTime = sessionStorage.getItem('timerEndTime');
    // Check if an end time exists
    if (endTime) {
      // Calculate how many seconds remain (make sure it doesn't go below 0)
      timeLeft = Math.max(0, Math.floor((parseInt(endTime) - Date.now()) / 1000));
      // Update the displayed time on the page
      updateTimerDisplay();
      // Check if time has run out
      if (timeLeft <= 0) {
        // Stop the interval timer updates
        clearInterval(timerInterval);
        // Remove the stored end time
        sessionStorage.removeItem('timerEndTime');
        // Send player back to start when time runs out
        window.location.href = 'index.html'; // Restart from cutscene
      }
    }
  }, 1000);
}

/* ============================================ */
/* UPDATE TIMER DISPLAY FUNCTION                */
/* ============================================ */

// Function to update what the timer shows on the page
function updateTimerDisplay() {
  // Get the timer display element from HTML
  const timerElement = document.getElementById('timer');
  // If timer element doesn't exist, exit the function
  if (!timerElement) return;
  // Calculate how many full minutes remain
  const minutes = Math.floor(timeLeft / 60);
  // Calculate how many seconds remain after removing full minutes
  const seconds = timeLeft % 60;
  // Update the timer element with formatted time (MM:SS)
  timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/* ============================================ */
/* TIMER INITIALIZATION ON PAGE LOAD             */
/* ============================================ */

// Listen for when the page has finished loading all content
document.addEventListener('DOMContentLoaded', initTimer);
