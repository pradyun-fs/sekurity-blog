import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function UpdateProfile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [links, setLinks] = useState([""]);
  const [profilePic, setProfilePic] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBio(data.bio || "");
        setLinks(data.links || [""]);
        setProfilePic(data.profilePic || "");
      }
    };
    fetchProfile();
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=97af36b982d212f8879a941404e1de55`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      setProfilePic(data.data.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.success("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        bio,
        links: links.filter(Boolean),
        profilePic,
        updatedAt: serverTimestamp(),
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

      <label className="block mb-2 font-semibold">Display Picture:</label>
      {profilePic && <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full mb-2" />}
      <input type="file" onChange={handleImageUpload} className="mb-4" />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}

      <label className="block mb-2 font-semibold">Bio:</label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="Tell us about yourself"
      />

      <label className="block mb-2 font-semibold">Links:</label>
      {links.map((link, idx) => (
        <input
          key={idx}
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="https://..."
          value={link}
          onChange={(e) => {
            const newLinks = [...links];
            newLinks[idx] = e.target.value;
            setLinks(newLinks);
          }}
        />
      ))}
      <button
        className="text-sm text-emerald-600 hover:underline mb-4"
        onClick={() => setLinks([...links, ""])}
      >
        + Add another link
      </button>

      <button
        onClick={handleSave}
        className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
      >
        Save Profile
      </button>

      {submitted && <p className="text-green-600 mt-3">✅ Profile updated!</p>}
    </div>
  );
}

export default UpdateProfile;
