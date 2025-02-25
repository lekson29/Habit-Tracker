import {
  signIn,
  logOut,
  addHabitToFirebase,
  loadHabits,
  removeHabitFromFirebase,
} from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById("sign-in").addEventListener("click", signInHandler);
  document.getElementById("sign-out").addEventListener("click", signOutHandler);
  document
    .getElementById("add-habit")
    .addEventListener("click", addHabitHandler);
  document
    .getElementById("toggle-dark-mode")
    .addEventListener("click", toggleDarkMode);
}

async function signInHandler() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email && password) {
    await signIn(email, password);
    checkLoginStatus(); // Check if the user is signed in after the attempt
  } else {
    alert("Please enter email and password!");
  }
}

async function signOutHandler() {
  await logOut();
  checkLoginStatus(); // Check the login status after logging out
}

async function addHabitHandler() {
  const habitName = document.getElementById("habit-name").value.trim();
  if (habitName) {
    await addHabitToFirebase(habitName);
    loadHabitsUI(); // Reload the habits after adding
  }
}

async function loadHabitsUI() {
  const habits = await loadHabits();
  document.getElementById("habits").innerHTML = "";
  habits.forEach((habit) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <span>${habit.name}</span>
      <button onclick="removeHabitFromFirebase('${habit.id}')">❌</button>
    `;
    document.getElementById("habits").appendChild(li);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
}

function checkLoginStatus() {
  const user = firebase.auth().currentUser;

  if (user) {
    // Show habit tracker, hide login form
    document.getElementById("login-form").style.display = "none";
    document.getElementById("habit-section").style.display = "block";
    loadHabitsUI(); // Load habits if logged in
  } else {
    // Show login form, hide habit tracker
    document.getElementById("login-form").style.display = "block";
    document.getElementById("habit-section").style.display = "none";
  }
}

// Initialize the login status check
checkLoginStatus();
