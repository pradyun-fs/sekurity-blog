import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase-config";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

function AuthorProfile() {
  const { email: rawEmail } = useParams();
  const email = decodeURIComponent(rawEmail); // handle URL-encoded emails
  const [userInfo, setUserInfo] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) return; 

    const fetchData = async () => {
      try {
        console.log("Author email from route:", email);

        // Get user by email
        const userQuery = query(collection(db, "users"), where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          setUserInfo(userSnapshot.docs[0].data());
        } else {
          setError("User profile not found.");
          setUserInfo(null);
        }

        //  Get blogs by author
        const blogQuery = query(
          collection(db, "blogs"),
          where("authorEmail", "==", email),
          where("status", "==", "approved")
        );
        const blogSnapshot = await getDocs(blogQuery);
        const blogData = blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogs(blogData);
      } catch (err) {
        console.error("Error loading author profile:", err);
        setError("Something went wrong while loading profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">
        Loading profile...
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="min-h-screen bg-zinc-950 text-red-500 flex justify-center items-center">
        {error || "User not found."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white text-black rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col items-center mb-4">
            {userInfo.photoURL && (
              <img
                src={userInfo.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            )}
            <h2 className="text-2xl font-bold">{userInfo.displayName}</h2>
            <p className="text-sm text-gray-600">{userInfo.email}</p>
            {userInfo.bio && <p className="italic mt-2">{userInfo.bio}</p>}

            {Array.isArray(userInfo.links) && userInfo.links.length > 0 && (
              <div className="flex gap-4 mt-4 flex-wrap justify-center">
                {userInfo.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            <Link
              to="/profile/edit"
              className="text-blue-600 mt-4 inline-block hover:underline"
            >
              ✏️ Edit Profile
            </Link>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-white">
          Blogs by {userInfo.displayName}
        </h3>
        <div className="space-y-4">
          {blogs.length === 0 ? (
            <p className="text-gray-400">No approved blogs yet.</p>
          ) : (
            blogs.map(blog => (
              <div key={blog.id} className="bg-white text-black p-4 rounded shadow">
                <h4 className="font-bold mb-2">{blog.title}</h4>
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-emerald-600 hover:underline"
                >
                  View Blog →
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthorProfile;
