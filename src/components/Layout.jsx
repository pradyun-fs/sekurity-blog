import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      {/* Top Left Logo */}
      <div className="p-4">
        <Link to="/" className="inline-block">
          <img src={logo} alt="Phish&Chips Logo" className="h-20 md:h-28" />
        </Link>
      </div>

      {/* Main Content */}
      <main className="w-full flex justify-center">{children}</main>
    </div>
  );
}

export default Layout;
