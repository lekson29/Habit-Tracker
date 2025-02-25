import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDs6aSlwtmS2bGPMApvaHEGgPyHYdqjNHU",
  authDomain: "habit-tracker-5eee2.firebaseapp.com",
  projectId: "habit-tracker-5eee2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase Authentication methods
export async function signIn(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in: ", error);
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
  }
}

// Add habit to Firebase
export async function addHabitToFirebase(name) {
  try {
    await addDoc(collection(db, "habits"), { name });
  } catch (error) {
    console.error("Error adding habit: ", error);
  }
}

// Load habits from Firebase
export async function loadHabits() {
  try {
    const querySnapshot = await getDocs(collection(db, "habits"));
    const habits = [];
    querySnapshot.forEach((doc) => {
      habits.push({ id: doc.id, name: doc.data().name });
    });
    return habits;
  } catch (error) {
    console.error("Error loading habits: ", error);
  }
}

// Remove habit from Firebase
export async function removeHabitFromFirebase(id) {
  try {
    await deleteDoc(doc(db, "habits", id));
  } catch (error) {
    console.error("Error removing habit: ", error);
  }
}
