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
async function addHabitToFirebase(name) {
  await addDoc(collection(db, "habits"), { name });
  loadHabits(); // Reload habits after adding
}

// Load habits from Firebase
async function loadHabits() {
  const querySnapshot = await getDocs(collection(db, "habits"));
  document.getElementById("habits").innerHTML = "";
  querySnapshot.forEach((doc) => {
    let li = document.createElement("li");
    li.innerHTML = `${
      doc.data().name
    } <button onclick="removeHabitFromFirebase('${doc.id}')">❌</button>`;
    document.getElementById("habits").appendChild(li);
  });
}

// Remove habit from Firebase
async function removeHabitFromFirebase(id) {
  await deleteDoc(doc(db, "habits", id));
  loadHabits(); // Reload habits after deletion
}
