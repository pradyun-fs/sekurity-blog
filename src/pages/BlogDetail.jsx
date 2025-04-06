import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog(docSnap.data());
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div className="text-white text-center p-10">Loading blog...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-400 mb-2">{blog.title}</h1>
        <p className="text-gray-400 text-sm mb-4">
          By {blog.author} ({blog.authorEmail}) <br />
          {blog.createdAt?.toDate && (
            <>Published on: {blog.createdAt.toDate().toLocaleString()}</>
          )}
        </p>

        <div
          className="prose prose-invert max-w-none prose-img:rounded"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <div className="mt-10 flex justify-between items-center">
          <Link to="/" className="text-emerald-400 hover:underline">← Back to blog list</Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="bg-emerald-600 px-4 py-2 rounded text-white"
          >
            🔗 Share this blog
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
