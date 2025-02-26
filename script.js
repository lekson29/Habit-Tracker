// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ8seJw44GMX879yy6MOoKti5-PQsvwmI",
  authDomain: "habit-tracker-48148.firebaseapp.com",
  projectId: "habit-tracker-48148",
  storageBucket: "habit-tracker-48148.firebasestorage.app",
  messagingSenderId: "957305681675",
  appId: "1:957305681675:web:6198efd3f4ff6ea41b140e",
  measurementId: "G-Y7PCJZTZ6L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// DOM Elements
const signInBtn = document.getElementById("sign-in-btn");
const googleSignInDiv = document.getElementById("google-sign-in");
const habitTrackerDiv = document.getElementById("habit-tracker");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitNameInput = document.getElementById("habit-name");
const logoutBtn = document.getElementById("logout-btn");
const habitListDiv = document.getElementById("habit-list");

// Google Sign-In
signInBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log(`Signed in as ${user.displayName}`);
      googleSignInDiv.style.display = "none";
      habitTrackerDiv.style.display = "block";
      loadHabits();
    })
    .catch((error) => {
      console.error("Error during sign-in: ", error);
    });
});

// Log Out
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    googleSignInDiv.style.display = "block";
    habitTrackerDiv.style.display = "none";
    console.log("User logged out");
  });
});

// Add Habit
addHabitBtn.addEventListener("click", () => {
  const habitName = habitNameInput.value.trim();
  if (habitName) {
    const userId = auth.currentUser.uid;
    const habitRef = database.ref(`users/${userId}/habits`).push();
    habitRef.set({
      name: habitName,
      completed: false,
    });
    habitNameInput.value = ""; // Clear the input
    loadHabits();
  }
});

// Load Habits
function loadHabits() {
  const userId = auth.currentUser.uid;
  const habitRef = database.ref(`users/${userId}/habits`);

  habitRef.once("value", (snapshot) => {
    habitListDiv.innerHTML = ""; // Clear previous list

    snapshot.forEach((childSnapshot) => {
      const habit = childSnapshot.val();
      const habitId = childSnapshot.key;

      const habitItem = document.createElement("div");
      habitItem.classList.add("habit-item");

      habitItem.innerHTML = `
          <span>${habit.name}</span>
          <button onclick="deleteHabit('${habitId}')">Delete</button>
        `;

      habitListDiv.appendChild(habitItem);
    });
  });
}

// Delete Habit
function deleteHabit(habitId) {
  const userId = auth.currentUser.uid;
  const habitRef = database.ref(`users/${userId}/habits/${habitId}`);
  habitRef.remove().then(() => {
    console.log("Habit deleted");
    loadHabits(); // Reload the habits
  });
}
