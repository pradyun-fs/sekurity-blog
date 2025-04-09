import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { toast } from 'react-hot-toast';

function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from Firestore, ordered by creation time
  const fetchBlogs = async () => {
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const blogList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogList);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update blog status in Firestore
  const updateStatus = async (id, status) => {
    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, { status });
      toast.success(`Blog ${status}!`);
      await fetchBlogs(); // Refresh after status update
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex justify-center items-center">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">👑 Admin Dashboard🚨</h2>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs submitted yet.</p>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white text-black p-4 mb-6 rounded shadow max-w-3xl mx-auto"
          >
            <p className="text-sm text-gray-500 mb-2">
              Author: {blog.author} ({blog.authorEmail})
            </p>

            <div
              className="prose prose-zinc"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="mt-4 flex gap-3 flex-wrap items-center">
              <p className="text-sm font-bold">Status: {blog.status}</p>

              {blog.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(blog.id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => updateStatus(blog.id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                  >
                    ❌ Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
