// Import Firebase core
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBES89FIh5haZOcmlNTyDPcM1xNMVbniJg",
  authDomain: "secutiyblog-phish-and-chips.firebaseapp.com",
  projectId: "secutiyblog-phish-and-chips",
  storageBucket: "secutiyblog-phish-and-chips.firebasestorage.app",
  messagingSenderId: "894832211791",
  appId: "1:894832211791:web:2121590468c5568e92f73a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
