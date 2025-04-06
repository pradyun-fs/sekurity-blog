import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useAuth } from "../context/AuthContext";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  const isOwner = user?.email === blog.authorEmail;

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto bg-white text-black p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <p className="text-sm text-gray-600 mb-4">
          By {blog.author} ({blog.authorEmail})
        </p>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {isOwner && (
          <button
            onClick={() => navigate(`/edit-blog/${blog.id}`)}
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded font-semibold"
          >
            ✏️ Edit Blog
          </button>
        )}
      </div>
    </div>
  );
}

export default BlogDetail;
