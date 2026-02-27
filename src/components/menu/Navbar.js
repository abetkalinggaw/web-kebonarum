import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const getBasePath = () => {
    const publicUrl = process.env.PUBLIC_URL || "";

    if (!publicUrl) {
      return "";
    }

    try {
      const parsed = new URL(publicUrl, window.location.origin);
      return parsed.pathname.replace(/\/+$/, "");
    } catch (error) {
      return publicUrl.replace(/\/+$/, "");
    }
  };

  const resolveAppPath = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${getBasePath()}${normalizedPath}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!(window.innerWidth <= 1024 && isMenuOpen)) {
      return;
    }

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      window.scrollTo(0, scrollY);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      setOpenDropdown(null);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDropdownToggle = (dropdownKey, e) => {
    if (window.innerWidth <= 1024) {
      e.preventDefault();
      setOpenDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
    }
  };

  const handleNavigation = (path, e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setOpenDropdown(null);

    window.scrollTo(0, 0);

    const targetPath = resolveAppPath(path);
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
    const normalizedTargetPath = targetPath.replace(/\/+$/, "") || "/";

    if (currentPath === normalizedTargetPath) {
      window.location.reload();
      return;
    }

    window.location.assign(targetPath);
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/" onClick={(e) => handleNavigation("/", e)}>
            <img src={logo} alt="Kebonarum Logo" className="logo-image" />
          </a>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="navbar-menu-list">
            <li>
              <a href="/about" onClick={(e) => handleNavigation("/about", e)}>
                About
              </a>
            </li>
            <li>
              <a
                href="/sejarah"
                onClick={(e) => handleNavigation("/sejarah", e)}
              >
                Sejarah
              </a>
            </li>
            <li>
              <a href="/gereja" onClick={(e) => handleNavigation("/gereja", e)}>
                Gereja
              </a>
            </li>
            <li
              className={`navbar-dropdown-parent ${
                openDropdown === "media" ? "active" : ""
              }`}
            >
              <a href="#" onClick={(e) => handleDropdownToggle("media", e)}>
                <span className="dropdown-trigger">
                  Media
                  <span className="dropdown-arrow" aria-hidden="true">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 3.5L5 6.5L8 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </a>
              <ul className="navbar-dropdown">
                <li>
                  <a
                    href="/media/youtube"
                    onClick={(e) => handleNavigation("/media/youtube", e)}
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="/media/instagram"
                    onClick={(e) => handleNavigation("/media/instagram", e)}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="/media/documentation"
                    onClick={(e) => handleNavigation("/media/documentation", e)}
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </li>
            <li
              className={`navbar-dropdown-parent ${
                openDropdown === "pengumuman" ? "active" : ""
              }`}
            >
              <a
                href="#"
                onClick={(e) => handleDropdownToggle("pengumuman", e)}
              >
                <span className="dropdown-trigger">
                  Pengumuman
                  <span className="dropdown-arrow" aria-hidden="true">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 3.5L5 6.5L8 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </a>
              <ul className="navbar-dropdown">
                <li>
                  <a
                    href="/pengumuman/events"
                    onClick={(e) => handleNavigation("/pengumuman/events", e)}
                  >
                    Events
                  </a>
                </li>
                <li>
                  <a
                    href="/pengumuman/warta-gereja"
                    onClick={(e) =>
                      handleNavigation("/pengumuman/warta-gereja", e)
                    }
                  >
                    Warta Gereja
                  </a>
                </li>
              </ul>
            </li>
            <li
              className={`navbar-dropdown-parent ${
                openDropdown === "komisi" ? "active" : ""
              }`}
            >
              <a href="#" onClick={(e) => handleDropdownToggle("komisi", e)}>
                <span className="dropdown-trigger">
                  Komisi
                  <span className="dropdown-arrow" aria-hidden="true">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 3.5L5 6.5L8 3.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              </a>
              <ul className="navbar-dropdown">
                <li>
                  <a
                    href="/komisi/pwg"
                    onClick={(e) => handleNavigation("/komisi/pwg", e)}
                  >
                    PWG & Ibadah
                  </a>
                </li>
                <li>
                  <a
                    href="/komisi/diaken"
                    onClick={(e) => handleNavigation("/komisi/diaken", e)}
                  >
                    Diaken
                  </a>
                </li>
                <li>
                  <a
                    href="/komisi/Penatalayanan"
                    onClick={(e) =>
                      handleNavigation("/komisi/Penatalayanan", e)
                    }
                  >
                    Penatalayanan
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a
                href="/statistik"
                onClick={(e) => handleNavigation("/statistik", e)}
              >
                Statistik
              </a>
            </li>
            <li>
              <a
                href="/formulir"
                onClick={(e) => handleNavigation("/formulir", e)}
              >
                Formulir
              </a>
            </li>
            <li>
              <a
                href="/persembahan"
                onClick={(e) => handleNavigation("/persembahan", e)}
              >
                Persembahan
              </a>
            </li>
          </ul>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Close button for mobile menu */}
        {isMenuOpen && (
          <button
            className="close-menu-btn"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="8"
                y1="8"
                x2="24"
                y2="24"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="24"
                y1="8"
                x2="8"
                y2="24"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
