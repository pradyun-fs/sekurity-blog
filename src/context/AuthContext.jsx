import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Optional: Ensure session persists across refresh
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log("✅ Firebase auth persistence set to local");
      })
      .catch((err) => console.error("❌ Error setting auth persistence:", err));

    const unsub = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔁 Auth state changed:", currentUser?.email || "null");

      if (currentUser) {
        setUser(currentUser);
      } else {
        console.warn("⚠️ No user detected — skipping setUser(null) to avoid session loss");
        // Optional: Keep user state or redirect to login
        // setUser(null); // you may uncomment if needed
      }
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
