import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Configuration (Replace with your own)
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
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Sign in with Google
export function signIn() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Signed in as:", user.displayName);
      document.getElementById("habitSection").style.display = "block";
      document.getElementById("signInButton").style.display = "none";
      document.getElementById("signOutButton").style.display = "block";
      loadHabits(user.uid);
    })
    .catch((error) => console.error("Sign in error:", error.message));
}

// Sign out
export function signOutUser() {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      document.getElementById("habitSection").style.display = "none";
      document.getElementById("signInButton").style.display = "block";
      document.getElementById("signOutButton").style.display = "none";
    })
    .catch((error) => console.error("Sign out error:", error.message));
}

// Add habit to Firestore
export async function addHabit(userId, habitName) {
  if (habitName) {
    const habitRef = collection(db, "users", userId, "habits");
    await addDoc(habitRef, {
      name: habitName,
      streak: 0,
      completedToday: false,
    });
    loadHabits(userId);
  }
}

// Load habits from Firestore
export async function loadHabits(userId) {
  const habitList = document.getElementById("habitList");
  habitList.innerHTML = "";
  const habitRef = collection(db, "users", userId, "habits");
  const snapshot = await getDocs(habitRef);

  snapshot.forEach((docSnap) => {
    const habit = docSnap.data();
    const habitItem = document.createElement("div");
    habitItem.classList.add("habit-item");
    habitItem.innerHTML = `
            <p><strong>${habit.name}</strong></p>
            <p>Streak: ${habit.streak}</p>
            <button onclick="markCompleted('${docSnap.id}', '${userId}')">Mark as Completed</button>
        `;
    habitList.appendChild(habitItem);
  });
}

// Mark habit as completed
export async function markCompleted(habitId, userId) {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  await updateDoc(habitRef, { completedToday: true });
  loadHabits(userId);
}
