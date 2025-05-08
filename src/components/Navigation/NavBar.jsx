import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";

function NavBar() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  // Check if we're on auth pages
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    // Smooth scroll handler
    const handleClick = (e, sectionId) => {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    // Set up intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-100px 0px -100px 0px",
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    // Add click handlers for smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) =>
        handleClick(e, link.getAttribute("href").slice(1))
      );
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleClick);
      });
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg z-50 shadow-md"
    >
     <div className="container mx-auto px-4 py-3 flex items-center justify-between h-20">
  <Link to="/" className="flex items-center space-x-3">
    <motion.div
      whileHover={{ rotate: 5 }}
      transition={{ duration: 0.3 }}
      className="flex items-center"
    >
      <img
        src="/src/assets/chatwithme-logo.png"
        alt="ChatWithMe Logo"
        className="h-10 w-auto scale-250" // larger visually without pushing height
      />
      <span className="text-xl  font-bold text-blue-600 ml-2">
        ChatWithMe
      </span>
    </motion.div>
  </Link>

  {currentUser ? (
    <div className="flex items-center space-x-6">
      <Link
        to="/chat"
        className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        Chat
      </Link>
      <Link
        to="/profile"
        className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-gray-50"
      >
        Profile
      </Link>
      <button
        onClick={handleLogout}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
      >
        Se déconnecter
      </button>
    </div>
  ) : (
    <div className="flex items-center space-x-4">
      {!isAuthPage && (
        <div className="hidden md:flex space-x-8 mr-8">
          {["home", "about", "features"].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`relative font-medium text-sm transition-colors ${
                activeSection === section
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
              {activeSection === section && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </a>
          ))}
        </div>
      )}
      <Link
        to="/login"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        Connexion
      </Link>
      <Link
        to="/register"
        className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        S'inscrire
      </Link>
    </div>
  )}
</div>

    </motion.nav>
  );
}

export default NavBar;
