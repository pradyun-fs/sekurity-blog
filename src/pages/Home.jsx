import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase-config";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { FaSignOutAlt } from "react-icons/fa";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchUserInfo = async () => {
      const docRef = doc(db, "users", user.email);
      const snap = await getDoc(docRef);
      if (snap.exists()) setUserInfo(snap.data());
    };
    fetchUserInfo();
  }, [user]);

  const isAdmin = user?.email === "pradyunsubash@gmail.com";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-emerald-400 mb-4">
          Phish&Chips
        </h1>
        <p className="text-lg text-gray-300 font-mono mb-6">
          Explore Stories & Share Ideas
        </p>

        {user ? (
          <>
            {userInfo && (
              <div className="mb-6">
                {userInfo.photoURL && (
                  <img
                    src={userInfo.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto object-cover mb-2"
                  />
                )}
                <h2 className="text-xl font-semibold">{user.displayName}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
                {userInfo.bio && (
                  <p className="italic text-gray-300 mt-2">{userInfo.bio}</p>
                )}
                <div className="flex justify-center flex-wrap gap-3 mt-4">
                  {userInfo.links?.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-500 underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-4 mb-6">
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
              {isAdmin && (
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

            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full font-semibold"
            >
              <FaSignOutAlt className="inline mr-2" />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signInWithPopup(auth, provider)}
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
