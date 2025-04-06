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
    const fetchUserProfile = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.email);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-950 text-white">
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="bg-white text-black py-3 px-6 rounded hover:bg-gray-200"
        >
          🔐 Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-12 flex flex-col items-center">
      {/* Logo + Intro */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-emerald-400 mb-2 text-center">
        Phish&Chips
      </h1>
      <p className="text-lg mb-1 font-mono text-gray-300 text-center">
        Hey There!, <span className="bg-zinc-800 px-2 py-1 rounded font-bold">Explore Stories & Share Ideas</span>
      </p>
      <p className="text-sm text-gray-400 mb-8 text-center">
        A platform to read, write, and expand your perspective.
      </p>

      {/* Profile Section */}
      {profile && (
        <div className="flex flex-col items-center mb-8">
          {profile.photoURL && (
            <img src={profile.photoURL} className="w-24 h-24 rounded-full mb-3 object-cover" alt="Profile" />
          )}
          <p className="text-xl font-bold">{user.displayName}</p>
          <p className="text-sm text-gray-400 mb-2">{profile.bio}</p>
          <div className="flex gap-3 flex-wrap justify-center">
            {profile.links?.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 underline text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          onClick={() => navigate("/write")}
          className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
        >
          📝 Write
        </button>
        <button
          onClick={() => navigate("/read")}
          className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
        >
          📖 Read
        </button>
        {user.email === "pradyunsubash@gmail.com" && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
          >
            🛡 Admin
          </button>
        )}
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-white text-black py-2 px-4 rounded hover:bg-gray-300"
        >
          ✏️ Update Profile
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full font-semibold flex items-center gap-2"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default Home;
