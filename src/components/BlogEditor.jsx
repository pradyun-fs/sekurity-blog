import "./editorStyles.css";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { FloatingImage } from "../extensions/FloatingImage";
import { handleImagePaste } from "../utils/handleImagePaste";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function BlogEditor() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false, // disable built-in bold
      }),
      Bold,
      Underline,
      Link.configure({ autolink: true, openOnClick: true, linkOnPaste: true }),
      FloatingImage,
    ],
    content: "<p></p>",
  });

  useEffect(() => {
    if (!editor) return;
    const handler = handleImagePaste(editor, imgbbApiKey);
    const el = editor.view.dom;
    el.addEventListener("paste", handler);
    return () => el.removeEventListener("paste", handler);
  }, [editor, imgbbApiKey]);

  const handleSubmit = async () => {
    if (!editor || !user) {
      console.warn("❌ Submit blocked: editor or user not available");
      return;
    }

    const html = editor.getHTML().trim();
    const name = user.displayName || "Anonymous";

    console.log("🧠 Submitting as user:", user?.email);

    if (!title.trim()) {
      toast.error("Enter a blog title.");
      return;
    }

    if (!html || html === "<p></p>") {
      toast.error("Write some content.");
      return;
    }

    try {
      const blogData = {
        title: title.trim(),
        content: html,
        author: name,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
        status: "pending",
      };

      console.log("📤 Submitting blog to Firestore:", blogData);

      await addDoc(collection(db, "blogs"), blogData);

      toast.success("✅ Blog submitted for admin review!");
      setSubmitted(true);
      setTitle("");
      editor.commands.clearContent();

      console.log("✅ Blog submitted successfully. Still logged in as:", user?.email);
    } catch (err) {
      console.error("❌ Error submitting blog:", err);
      toast.error("Error submitting blog.");
    }
  };

  if (!editor) return null;

  return (
    <div className="max-w-6xl w-full mx-auto bg-white p-8 rounded-lg shadow-lg text-black">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">📝 Write a Blog</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter your blog title"
        className="mb-4 w-full border border-gray-300 rounded px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-zinc-100"
      />

      <div className="flex flex-wrap items-center gap-2 mb-4 bg-zinc-100 p-3 rounded">
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn">Underline</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• Bullet List</button>
        <button onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()} className="btn">H1</button>
        <button onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()} className="btn">H2</button>
        <button onClick={() => editor.chain().focus().undo().run()} className="btn">↩ Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()} className="btn">↪ Redo</button>
      </div>

      <div className="border rounded mb-6 bg-white min-h-[300px] text-left">
        <EditorContent editor={editor} className="p-4 text-left" />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-8 rounded font-semibold text-lg transition"
      >
        Submit for Review
      </button>

      {submitted && (
        <p className="mt-4 text-green-600 text-center">✅ Blog submitted!</p>
      )}
    </div>
  );
}

export default BlogEditor;
