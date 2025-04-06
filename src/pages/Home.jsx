import { useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase-config";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { FaSignOutAlt } from "react-icons/fa";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.email) {
        const docRef = doc(db, "profiles", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProfile(docSnap.data());
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <div className="w-full max-w-2xl text-center space-y-6">
        {/* Title */}
        <div className="mt-10">
          <h1 className="text-5xl font-extrabold text-emerald-400 mb-2">Phish&Chips</h1>
          <p className="font-mono text-lg text-gray-300">
            Hey There!, <span className="bg-zinc-800 px-2 py-1 rounded font-bold">Explore Stories & Share Ideas</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">A platform to read, write, and expand your perspective.</p>
        </div>

        {user ? (
          <>
            <p className="text-sm text-gray-400">Welcome, {user.displayName}</p>

            {profile?.photoURL && (
              <img
                src={profile.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto border-2 border-emerald-500"
              />
            )}

            {profile?.bio && (
              <p className="text-gray-400 italic">{profile.bio}</p>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                onClick={() => navigate("/write")}
                className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
              >
                📄 Write
              </button>
              <button
                onClick={() => navigate("/read")}
                className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
              >
                📖 Read
              </button>
              <button
                onClick={() => navigate("/update")}
                className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
              >
                ✍️ Update Profile
              </button>
              {user.email === "pradyunsubash@gmail.com" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
                >
                  🛡 Admin
                </button>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="mt-8 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full font-semibold"
            >
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <button
            onClick={async () => await signInWithPopup(auth, provider)}
            className="bg-white text-black py-2 px-6 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            🔐 Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
