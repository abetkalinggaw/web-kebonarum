import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

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

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchInput("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search for:", searchInput);
    // Add your search logic here
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Kebonarum Logo" className="logo-image" />
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <ul className="navbar-menu-list">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/sejarah">Sejarah</Link>
            </li>
            <li>
              <Link to="/gereja">Gereja</Link>
            </li>
            <li
              className={`navbar-dropdown-parent ${
                openDropdown === "media" ? "active" : ""
              }`}
            >
              <Link to="#" onClick={(e) => handleDropdownToggle("media", e)}>
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
              </Link>
              <ul className="navbar-dropdown">
                <li>
                  <Link to="/media/youtube">YouTube</Link>
                </li>
                <li>
                  <Link to="/media/instagram">Instagram</Link>
                </li>
                <li>
                  <Link to="/media/documentation">Documentation</Link>
                </li>
              </ul>
            </li>
            <li
              className={`navbar-dropdown-parent ${
                openDropdown === "pengumuman" ? "active" : ""
              }`}
            >
              <Link
                to="#"
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
              </Link>
              <ul className="navbar-dropdown">
                <li>
                  <Link to="/pengumuman/event">Event</Link>
                </li>
                <li>
                  <Link to="/pengumuman/warta-gereja">Warta Gereja</Link>
                </li>
              </ul>
            </li>
            <li
              className={`navbar-dropdown-parent ${
                openDropdown === "komisi" ? "active" : ""
              }`}
            >
              <Link to="#" onClick={(e) => handleDropdownToggle("komisi", e)}>
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
              </Link>
              <ul className="navbar-dropdown">
                <li>
                  <Link to="/komisi/pwg">PWG & Ibadah</Link>
                </li>
                <li>
                  <Link to="/komisi/diaken">Diaken</Link>
                </li>
                <li>
                  <Link to="/komisi/Penatalayanan">Penatalayanan</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/statistik">Statistik</Link>
            </li>
            <li>
              <Link to="/formulir">Formulir</Link>
            </li>
            <li>
              <Link to="/persembahan">Persembahan</Link>
            </li>
          </ul>

          {/* Mobile search inside the fullscreen menu */}
          <div className="navbar-search mobile">
            <form
              className="search-form mobile-search-form"
              onSubmit={handleSearchSubmit}
            >
              <span className="mobile-search-inline-icon" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.9999 14.9999L19 19"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Desktop search (hidden on mobile) */}
        <div className="navbar-search desktop">
          <button className="search-icon" onClick={toggleSearch}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.9999 14.9999L19 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isSearchOpen && (
            <form className="search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                autoFocus
              />
            </form>
          )}
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
