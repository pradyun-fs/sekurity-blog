import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { useState } from "react";

import BlogEditor from "./components/BlogEditor";
import BlogReader from "./pages/BlogReader";
import BlogDetail from "./pages/BlogDetail";
import AuthorProfile from "./pages/AuthorProfile";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";

function App() {
  const { user } = useAuth();
  const [page, setPage] = useState("home");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPage("home");
    } catch (err) {
      console.error(err);
    }
  };

  const isAdmin = user?.email === "pradyunsubash@gmail.com";

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home
                user={user}
                isAdmin={isAdmin}
                handleLogout={handleLogout}
              />
            </Layout>
          }
        />
        <Route
          path="/write"
          element={
            <Layout>
              <BlogEditor />
            </Layout>
          }
        />
        <Route
          path="/read"
          element={
            <Layout>
              <BlogReader />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout>
              <AdminDashboard />
            </Layout>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <Layout>
              <EditProfile />
            </Layout>
          }
        />
        <Route
          path="/blog/:id"
          element={<BlogDetail />}
        />
        <Route
          path="/author/:email"
          element={
            <Layout>
              <AuthorProfile />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
