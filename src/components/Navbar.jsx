import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle, FaCar, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/");

  };

  return (

    <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-gray-800 text-white z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-green-400"
        >
          <FaCar />
          DriveNow
        </Link>


        <ul className="hidden md:flex items-center gap-8 text-gray-300 font-medium">

          <li>
            <Link to="/" className="hover:text-green-400 transition">
              Home
            </Link>
          </li>

          <li>
            <Link to="/cars" className="hover:text-green-400 transition">
              Cars
            </Link>
          </li>

          <li>
            <Link to="/offers" className="hover:text-green-400 transition">
              Offers
            </Link>
          </li>

          <li>
            <Link to="/about" className="hover:text-green-400 transition">
              About
            </Link>
          </li>

          <li>
            <Link to="/contact" className="hover:text-green-400 transition">
              Contact
            </Link>
          </li>

        </ul>


        <div className="flex items-center gap-4">

          {user ? (

            <div className="relative">

              <FaUserCircle
                size={32}
                className="cursor-pointer text-green-400"
                onClick={() => setMenuOpen(!menuOpen)}
              />

              {menuOpen && (

                <div className="absolute right-0 mt-4 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">

                  <div className="px-4 py-3 border-b border-gray-700 text-green-400 font-semibold">
                    {user.name}
                  </div>

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user.role === "owner" && (
                    <Link
                      to="/owner"
                      className="block px-4 py-2 hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Owner Dashboard
                    </Link>
                  )}

                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Bookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-red-400"
                  >
                    Logout
                  </button>

                </div>

              )}

            </div>

          ) : (

            <Link
              to="/login"
              className="hidden md:block bg-green-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-300 transition"
            >
              Login
            </Link>

          )}


          {user?.role === "user" && (

            <Link
              to="/become-host"
              className="flex items-center gap-2 bg-green-400 text-black px-3 py-1 rounded font-semibold hover:bg-green-300 transition"
            >

              <FaCar />

              Become a Host

            </Link>

          )}


          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenu(!mobileMenu)}
          >

            {mobileMenu ? <FaTimes /> : <FaBars />}

          </button>

        </div>

      </div>


      {mobileMenu && (

        <div className="md:hidden bg-black border-t border-gray-800">

          <ul className="flex flex-col text-center text-gray-300 font-medium">

            <li className="py-3 border-b border-gray-800">
              <Link to="/" onClick={() => setMobileMenu(false)}>
                Home
              </Link>
            </li>

            <li className="py-3 border-b border-gray-800">
              <Link to="/cars" onClick={() => setMobileMenu(false)}>
                Cars
              </Link>
            </li>

            <li className="py-3 border-b border-gray-800">
              <Link to="/offers" onClick={() => setMobileMenu(false)}>
                Offers
              </Link>
            </li>

            <li className="py-3 border-b border-gray-800">
              <Link to="/about" onClick={() => setMobileMenu(false)}>
                About
              </Link>
            </li>

            <li className="py-3 border-b border-gray-800">
              <Link to="/contact" onClick={() => setMobileMenu(false)}>
                Contact
              </Link>
            </li>

            {!user && (
              <li className="py-3">
                <Link to="/login" onClick={() => setMobileMenu(false)}>
                  Login
                </Link>
              </li>
            )}

          </ul>

        </div>

      )}

    </nav>

  );

}

export default Navbar;