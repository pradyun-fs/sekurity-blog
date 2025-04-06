import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [links, setLinks] = useState([{ label: "", url: "" }]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.email);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBio(data.bio || "");
        setPhotoURL(data.photoURL || "");
        setLinks(data.links || [{ label: "", url: "" }]);
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [user]);

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const addLinkField = () => setLinks([...links, { label: "", url: "" }]);
  const removeLink = (index) => setLinks(links.filter((_, i) => i !== index));

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formData
      );
      console.log("Upload result: ",res.data);
      const url = res.data.data.url;
      setPhotoURL(url);
      toast.success("✅ Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("❌ Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", user.email);
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL,
        bio,
        links,
      });
      toast.success("✅ Profile updated!");
      navigate(`/author/${user.email}`);
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("❌ Failed to save profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-8 update-profile-section flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">✏️ Edit Your Profile</h2>

        <label className="block mb-2 font-semibold text-cyan-400">Display Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          className="mb-4 block"
        />
        {uploading && <p className="text-sm text-gray-500 mb-4">Uploading...</p>}
        {photoURL && (
          <div className="mb-4">
            <img src={photoURL} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover" />
          </div>
        )}

        <label className="block mb-2 font-semibold text-cyan-400">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows="3"
          className="mb-4 w-full bg-white text-black border border-gray-300 rounded px-4 py-2"
        />

        <label className="block mb-2 font-semibold text-cyan-400">Links</label>
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Label (e.g., GitHub)"
              value={link.label}
              onChange={(e) => handleLinkChange(index, "label", e.target.value)}
              className="w-1/3 bg-white text-black border border-gray-300 rounded px-2 py-1"
            />
            <input
              type="url"
              placeholder="https://..."
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              className="w-2/3 bg-white text-black border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => removeLink(index)}
              className="text-cyan-500 hover:text-red-500"
            >
              ✖
            </button>
          </div>
        ))}

        <button
          onClick={addLinkField}
          className="text-sm text-cyan-600 hover:underline mb-4"
        >
          ➕ Add another link
        </button>

        <div className="mt-6">
          <button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded font-semibold"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
