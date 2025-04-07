import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BlogReader() {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchApprovedBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchApprovedBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-emerald-400 text-center">
          📚 Explore Blogs
        </h1>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full px-4 py-2 rounded bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-400">No blogs found.</p>
        ) : (
          <div className="space-y-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white text-black p-6 rounded shadow max-w-3xl mx-auto"
              >
                <h2 className="text-xl font-bold mb-1">{blog.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  By: {blog.author} ({blog.authorEmail})
                </p>
                {blog.createdAt?.toDate && (
                  <p className="text-sm text-gray-500 mb-4">
                    Published on: {blog.createdAt.toDate().toLocaleString()}
                  </p>
                )}

                <div
                  className="prose prose-zinc line-clamp-3 overflow-hidden max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: blog.content || "<p>No content</p>",
                  }}
                />

                <div className="flex items-center justify-between mt-4">
                  <Link
                    to={`/blog/${blog.id}`}
                    className="text-emerald-600 hover:underline"
                  >
                    Read Full Blog →
                  </Link>

                  {user?.email === blog.authorEmail && (
                    <Link
                      to={`/edit-blog/${blog.id}`}
                      className="text-blue-600 hover:underline ml-4"
                    >
                      ✏️ Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogReader;
