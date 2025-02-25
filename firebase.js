// Your Firebase Configuration
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
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();
