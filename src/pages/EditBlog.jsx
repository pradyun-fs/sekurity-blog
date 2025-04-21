import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { FloatingImage } from "../extensions/FloatingImage";
import { handleImagePaste } from "../utils/handleImagePaste";
import { db } from "../firebase-config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import "../components/editorStyles.css";

function EditBlog() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      FloatingImage,
      Link.configure({
        autolink: true,
        openOnClick: true,
        linkOnPaste: true,
      }),
    ],
    content: "<p>Loading blog...</p>",
  });

  // ✅ Fetch existing blog content
  useEffect(() => {
    const fetchBlog = async () => {
      if (!editor || !id) return;
      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.authorEmail !== user?.email) {
            toast.error("You are not authorized to edit this blog.");
            return navigate("/");
          }
          setTitle(data.title);
          editor.commands.setContent(data.content);
        } else {
          toast.error("Blog not found.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching blog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [editor, id, user, navigate]);

  // ✅ Handle image pasting
  useEffect(() => {
    if (!editor) return;
    const pasteHandler = handleImagePaste(editor, imgbbApiKey);
    const el = editor.view.dom;
    el.addEventListener("paste", pasteHandler);
    return () => el.removeEventListener("paste", pasteHandler);
  }, [editor, imgbbApiKey]);

  // ✅ Submit updated blog
  const handleUpdate = async () => {
    if (!editor || !user) return;

    const html = editor.getHTML().trim();
    if (!title.trim()) return toast.error("Enter a blog title.");
    if (!html || html === "<p></p>") return toast.error("Write some content.");

    try {
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, {
        title: title.trim(),
        content: html,
        updatedAt: serverTimestamp(),
        status: "pending",
      });

      toast.success("✅ Blog updated for review!");

      // ✅ Avoid flushSync warning by deferring navigation
      setTimeout(() => navigate(`/blog/${id}`), 0);

    } catch (err) {
      console.error("Error updating blog:", err);
      toast.error("Error saving blog.");
    }
  };

  if (loading || !editor) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-950 text-white">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white text-black rounded shadow mt-10 mb-16">
      <h2 className="text-3xl font-bold mb-6 text-emerald-600">✏️ Edit Blog</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full border border-gray-300 px-4 py-2 rounded bg-zinc-100 text-lg"
        placeholder="Edit blog title"
      />

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">Bold</button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn">Underline</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• Bullet List</button>
          <button onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()} className="btn">H1</button>
          <button onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()} className="btn">H2</button>
          <button onClick={() => editor.chain().focus().undo().run()} className="btn">↩ Undo</button>
          <button onClick={() => editor.chain().focus().redo().run()} className="btn">↪ Redo</button>
        </div>
      </div>

      <div className="border rounded bg-white min-h-[300px] text-left">
        <EditorContent editor={editor} className="p-4" />
      </div>

      <button
        onClick={handleUpdate}
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-8 rounded font-semibold text-lg"
      >
        Update Blog
      </button>
    </div>
  );
}

export default EditBlog;
