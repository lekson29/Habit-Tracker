import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs6aSlwtmS2bGPMApvaHEGgPyHYdqjNHU",
  authDomain: "habit-tracker-5eee2.firebaseapp.com",
  projectId: "habit-tracker-5eee2",
  storageBucket: "habit-tracker-5eee2.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign in user
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    alert(error.message);
  }
}

// Create new user
export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed up:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    alert(error.message);
  }
}

// Sign out user
export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
}

// Monitor authentication state
export function checkLoginStatus(callback) {
  onAuthStateChanged(auth, callback);
}

// Add habit to Firebase (with user.uid)
async function addHabitToFirebase(habitName, userId) {
  const db = firebase.firestore();
  await db.collection("habits").add({
    name: habitName,
    userId: userId, // Store userId with the habit
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// Load habits for a specific user (filter by userId)
async function loadHabits(userId) {
  const db = firebase.firestore();
  const snapshot = await db
    .collection("habits")
    .where("userId", "==", userId) // Only get habits that belong to this user
    .get();

  const habits = [];
  snapshot.forEach((doc) => {
    habits.push(doc.data());
  });

  // Display the habits (or update your UI as needed)
  console.log(habits);
}

// **Real-time Listener for Habits**
export function loadHabits() {
  const habitsList = document.getElementById("habits");
  habitsList.innerHTML = ""; // Clear list before rendering

  onSnapshot(collection(db, "habits"), (snapshot) => {
    habitsList.innerHTML = ""; // Clear list before adding new items
    snapshot.forEach((doc) => {
      let li = document.createElement("li");
      li.innerHTML = `${
        doc.data().name
      } <button onclick="removeHabitFromFirebase('${doc.id}')">❌</button>`;
      habitsList.appendChild(li);
    });
  });
}

// Remove habit from Firestore
export async function removeHabitFromFirebase(id) {
  await deleteDoc(doc(db, "habits", id));
}
