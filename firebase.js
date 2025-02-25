import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
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
const db = getFirestore(app);

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
