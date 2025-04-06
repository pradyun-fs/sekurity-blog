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

function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlogs(data);
  };

  const updateStatus = async (id, status) => {
    const blogRef = doc(db, "blogs", id);
    await updateDoc(blogRef, { status });
    fetchBlogs(); // Refresh
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">👑 Admin Dashboard🚨</h2>
      {blogs.length === 0 && <p>No blogs submitted yet.</p>}

      {blogs.map((blog) => (
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
          <div className="mt-4 flex gap-3">
            <p className="text-sm font-bold">Status: {blog.status}</p>
            {blog.status === "pending" && (
              <>
                <button
                  onClick={() => updateStatus(blog.id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(blog.id, "rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
