/* ============================================ */
/* VIDEO & DOM ELEMENT REFERENCES               */
/* ============================================ */

// Get the cutscene video element from HTML
const video = document.getElementById('cutsceneVideo');
// Get the text overlay element that shows during video
const textOverlay = document.getElementById('textOverlay');
// Get the black screen element for fading transitions
const blackScreen = document.getElementById('blackScreen');
// Get the image screen element that shows after video
const imageScreen = document.getElementById('imageScreen');
// Get the final image container element
const finalImage = document.getElementById('finalImage');
// Get the actual image inside the final-image container
const finalImg = document.getElementById('finalImg');
// Get the keypad modal popup element
const keypadModal = document.getElementById('keypadModal');

/* ============================================ */
/* GAME STATE VARIABLES                         */
/* ============================================ */

// Initialize empty string to store user's code input
let currentCode = '';
// Define the correct code that player must enter (0845)
const correctCode = '0845'; // Code for picture 1

/* ============================================ */
/* VIDEO PLAYBACK EVENT LISTENER                */
/* ============================================ */

// Listen for time update events as the video plays
video.addEventListener('timeupdate', () => {
  // Get the total duration of the video in seconds
  const duration = video.duration;
  // Get the current playback time in seconds
  const currentTime = video.currentTime;
  // Calculate how many seconds remain until video ends
  const timeUntilEnd = duration - currentTime;

  // Check if less than 1 second remains in the video
  if (timeUntilEnd <= 1 && timeUntilEnd > 0) {
    // Show the text overlay during final second of video
    textOverlay.style.opacity = '1';
  } else {
    // Hide the text overlay if not in final second
    textOverlay.style.opacity = '0';
  }
});

/* ============================================ */
/* VIDEO END EVENT SEQUENCE                     */
/* ============================================ */

// Listen for when the video finishes playing completely
video.addEventListener('ended', () => {
  // Set transition animation for smooth fade effect
  blackScreen.style.transition = 'opacity 0.5s ease-in-out';
  // Make black screen visible (fade to black)
  blackScreen.style.opacity = '1';

  // Set a timer to show the image after 2 seconds
  setTimeout(() => {
    // Set transition for the image screen fade in
    imageScreen.style.transition = 'opacity 1s ease-in-out';
    // Make the image screen visible (fade in)
    imageScreen.style.opacity = '1';
  }, 2000);

  // Set a timer to hide the image after 5 seconds total (3 seconds after showing)
  setTimeout(() => {
    // Hide the image screen (fade out)
    imageScreen.style.opacity = '0';
  }, 5000);

  // Set a timer to show final image after 7 seconds total
  setTimeout(() => {
    // Set transition for final image fade in
    finalImage.style.transition = 'opacity 1s ease-in-out';
    // Make final image visible (fade in)
    finalImage.style.opacity = '1';
    // Start playing background audio
    document.getElementById('bgAudio').play();
    // Start the countdown timer for the game
    startTimer();
  }, 7000);

  // ============================================
  // Click Event Handler for Final Image
  // ============================================

  // Listen for clicks on the final image
  finalImg.addEventListener('click', function(event) {
    // Get the position and size of the image on screen
    const rect = finalImg.getBoundingClientRect();
    // Calculate the X coordinate of the click relative to the image
    const x = event.clientX - rect.left;
    // Calculate the Y coordinate of the click relative to the image
    const y = event.clientY - rect.top;
    // Get the width of the image element
    const width = rect.width;
    // Get the height of the image element
    const height = rect.height;

    // Check if click is in the middle area of the image (40% to 60%)
    if (x > width * 0.4 && x < width * 0.6 && y > height * 0.4 && y < height * 0.6) {
      // Show the keypad modal popup for code entry
      keypadModal.style.display = 'flex';
    }
  });
});

/* ============================================ */
/* KEYPAD FUNCTION: ADD DIGIT                   */
/* ============================================ */

// Function to add a digit when user clicks a number button
function addDigit(digit) {
  // Check if the code is less than 4 digits long
  if (currentCode.length < 4) {
    // Add the new digit to the current code string
    currentCode += digit;
    // Update the display to show the new code
    updateCodeDisplay();
    // Clear any error message from previous attempts
    document.getElementById('errorMsg').textContent = '';
  }
}

/* ============================================ */
/* KEYPAD FUNCTION: CLEAR CODE                  */
/* ============================================ */

// Function to clear the code and reset the display
function clearCode() {
  // Reset the current code to an empty string
  currentCode = '';
  // Update the display to show empty code
  updateCodeDisplay();
  // Clear any error messages
  document.getElementById('errorMsg').textContent = '';
}

/* ============================================ */
/* KEYPAD FUNCTION: UPDATE DISPLAY              */
/* ============================================ */

// Function to update the visual display of the code
function updateCodeDisplay() {
  // Start with the current code user has entered
  let display = currentCode;
  // Loop until display is 4 characters long
  while (display.length < 4) {
    // Add a dash for each missing digit
    display += '-';
  }
  // Update the HTML element to show the code with dashes
  document.getElementById('codeDisplay').textContent = display;
}

/* ============================================ */
/* KEYPAD FUNCTION: CHECK CODE                  */
/* ============================================ */

// Function to verify if the entered code is correct
function checkCode() {
  // Check if the code is exactly 4 digits long
  if (currentCode.length !== 4) {
    // Show error message if code is incomplete
    document.getElementById('errorMsg').textContent = '⚠️ code must have 4 numbers!';
    // Exit the function without checking
    return;
  }

  // Check if the entered code matches the correct code
  if (currentCode === correctCode) {
    // Mark this puzzle as solved in browser storage
    localStorage.setItem('puzzle_index.html', 'solved');
    // Enable the next button
    enableNext();
    // Navigate to the second room/page
    window.location.href = 'second.html';
  } else {
    // Show error message if code is wrong
    document.getElementById('errorMsg').textContent = '❌ wrong code! try again...';
    // Clear the code for user to try again
    currentCode = '';
    // Update the display to show empty
    updateCodeDisplay();
  }
}

/* ============================================ */
/* MODAL FUNCTION: CLOSE                        */
/* ============================================ */

// Function to close the keypad modal popup
function closeModal() {
  // Hide the keypad modal by setting display to none
  keypadModal.style.display = 'none';
  // Reset the current code to empty string
  currentCode = '';
  // Update the display to show empty
  updateCodeDisplay();
  // Clear any error messages
  document.getElementById('errorMsg').textContent = '';
}

/* ============================================ */
/* NAVIGATION SETUP                             */
/* ============================================ */

// Define the current page filename
const currentPage = 'index.html';
// Array of all pages in the game in order
const pages = ['index.html', 'second.html', 'third.html', 'fourth.html', 'fifth.html', 'sixth.html'];
// Find the index of the current page in the pages array
const currentIndex = pages.indexOf(currentPage);
// Get the back button element from HTML
const backBtn = document.getElementById('backBtn');
// Get the next button element from HTML
const nextBtn = document.getElementById('nextBtn');

/* ============================================ */
/* BACK BUTTON SETUP                            */
/* ============================================ */

// Check if we're not on the first page
if (currentIndex > 0) {
  // Add click event listener to back button
  backBtn.addEventListener('click', () => window.location.href = pages[currentIndex - 1]);
} else {
  // Disable back button if we're on the first page
  backBtn.disabled = true;
}

/* ============================================ */
/* NEXT BUTTON FUNCTION                         */
/* ============================================ */

// Function to enable the next button and its functionality
function enableNext() {
  // Enable the next button by removing disabled state
  nextBtn.disabled = false;
  // Add click event listener to next button
  nextBtn.addEventListener('click', () => window.location.href = pages[currentIndex + 1]);
}

/* ============================================ */
/* PUZZLE STATE CHECK                           */
/* ============================================ */

// Check if the puzzle on this page has already been solved
if (localStorage.getItem('puzzle_' + currentPage) === 'solved') {
  // If solved, enable the next button
  enableNext();
}

// Enable Next button immediately (for testing)
enableNext();
