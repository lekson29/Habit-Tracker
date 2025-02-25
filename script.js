// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs6aSlwtmS2bGPMApvaHEGgPyHYdqjNHU",
  authDomain: "habit-tracker-5eee2.firebaseapp.com",
  projectId: "habit-tracker-5eee2",
  storageBucket: "habit-tracker-5eee2.firebasestorage.app",
  messagingSenderId: "779245589872",
  appId: "1:779245589872:web:a637c67b623f040219abb5",
  measurementId: "G-F6HWE82Q53",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// DOM Elements
const googleLoginBtn = document.getElementById("google-sign-in-btn");
const habitTrackerSection = document.getElementById("habit-tracker-section");
const googleLoginSection = document.getElementById("google-login");
const habitListElement = document.getElementById("habit-list");
const habitForm = document.getElementById("habit-form");
const habitNameInput = document.getElementById("habit-name");
const saveHabitBtn = document.getElementById("save-habit-btn");
const cancelHabitBtn = document.getElementById("cancel-habit-btn");

// Google Sign-In
googleLoginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth
    .signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("Logged in as: ", user.displayName);
      googleLoginSection.style.display = "none"; // Hide Google login
      habitTrackerSection.style.display = "block"; // Show habit tracker
    })
    .catch((error) => {
      console.error("Error during sign-in:", error);
    });
});

// Sign out
function signOut() {
  auth
    .signOut()
    .then(() => {
      googleLoginSection.style.display = "block"; // Show Google login
      habitTrackerSection.style.display = "none"; // Hide habit tracker
    })
    .catch((error) => {
      console.error("Sign out error:", error);
    });
}

// Add Habit
document.getElementById("add-habit-btn").addEventListener("click", () => {
  habitForm.style.display = "block";
});

// Save Habit to Firebase
saveHabitBtn.addEventListener("click", () => {
  const habitName = habitNameInput.value.trim();

  if (habitName) {
    const newHabitRef = db.ref("habits").push();
    newHabitRef.set({ name: habitName, completed: false });

    habitNameInput.value = ""; // Clear input
    habitForm.style.display = "none"; // Hide form
  }
});

// Cancel Habit Form
cancelHabitBtn.addEventListener("click", () => {
  habitForm.style.display = "none";
  habitNameInput.value = "";
});

// Fetch Habits from Firebase
db.ref("habits").on("value", (snapshot) => {
  habitListElement.innerHTML = ""; // Clear the list first

  snapshot.forEach((childSnapshot) => {
    const habit = childSnapshot.val();
    const habitId = childSnapshot.key;

    const habitElement = document.createElement("div");
    habitElement.classList.add("habit-item");
    habitElement.setAttribute("data-id", habitId);
    habitElement.innerHTML = `
        <p>${habit.name}</p>
        <button class="delete-btn">Delete</button>
      `;
    habitListElement.appendChild(habitElement);
  });
});

// Delete Habit
habitListElement.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const habitId = e.target.parentElement.getAttribute("data-id");
    db.ref("habits").child(habitId).remove();
  }
});
