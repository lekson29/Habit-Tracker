import {
  signIn,
  signUp,
  signOutUser,
  checkLoginStatus,
  addHabitToFirebase,
  loadHabits,
  removeHabitFromFirebase,
} from "./firebase.js";

// DOM elements
const signInBtn = document.getElementById("sign-in-btn");
const signUpBtn = document.getElementById("sign-up-btn");
const signOutBtn = document.getElementById("logout-btn");
const addHabitBtn = document.getElementById("add-habit-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const habitNameInput = document.getElementById("habit-name");

// Event Listeners
signInBtn.addEventListener("click", signInHandler);
signUpBtn.addEventListener("click", signUpHandler);
signOutBtn.addEventListener("click", signOutHandler);
addHabitBtn.addEventListener("click", addHabitHandler);

// Sign in handler
async function signInHandler() {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (email && password) {
    const user = await signIn(email, password);
    if (user) {
      document.getElementById("login-form").style.display = "none";
      document.getElementById("habit-section").style.display = "block";
      loadHabits(user.uid); // Pass user.uid to loadHabits
    }
  }
}

// Sign up handler
async function signUpHandler() {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (email && password) {
    const user = await signUp(email, password);
    if (user) {
      document.getElementById("login-form").style.display = "none";
      document.getElementById("habit-section").style.display = "block";
      loadHabits(user.uid); // Pass user.uid to loadHabits
    }
  }
}

// Sign out handler
async function signOutHandler() {
  await signOutUser();
  document.getElementById("login-form").style.display = "block";
  document.getElementById("habit-section").style.display = "none";
}

// Add habit handler
async function addHabitHandler() {
  const habitName = habitNameInput.value.trim();

  // Ensure that the user is logged in before proceeding
  checkLoginStatus(async (user) => {
    if (user && habitName) {
      try {
        await addHabitToFirebase(habitName, user.uid); // Pass user.uid here
        habitNameInput.value = ""; // Clear input field
        console.log("Habit added successfully!");

        // Refresh the habit list immediately
        loadHabits(user.uid); // Make sure to pass user.uid to loadHabits
      } catch (error) {
        console.error("Error adding habit:", error);
        alert("There was an issue adding the habit. Please try again.");
      }
    } else {
      alert("Please enter a habit name or ensure you're logged in.");
    }
  });
}

// Check if the user is logged in when the page loads
checkLoginStatus((user) => {
  if (user) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("habit-section").style.display = "block";
    loadHabits(user.uid); // Pass user.uid to loadHabits
  } else {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("habit-section").style.display = "none";
  }
});
window.removeHabitFromFirebase = removeHabitFromFirebase;
