import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const ArrowIcon = ({ isOpen }) => (
  <span
    className={`dropdown-arrow ${isOpen ? "open" : ""}`}
    aria-hidden="true"
    style={{ display: "inline-flex", originY: 0.5 }}
  >
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M2 3.5L5 6.5L8 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const DesktopDropdown = ({ children, isOpen, onMouseEnter, onMouseLeave }) => (
  <ul
    className={`navbar-dropdown navbar-dropdown--motion ${isOpen ? "visible" : ""}`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </ul>
);

const MobileDropdown = ({ isOpen, children }) => (
  <>
    {isOpen && (
      <ul
        className={`navbar-dropdown navbar-dropdown--mobile-motion ${isOpen ? "visible" : ""}`}
        style={{ overflow: "hidden" }}
      >
        {children}
      </ul>
    )}
  </>
);

const DropdownItem = ({ children, index }) => (
  <li style={{ animationDelay: `${index * 45}ms` }} className="dropdown-item">
    {children}
  </li>
);

const dropdownData = {
  media: [
    { label: "YouTube", path: "/media/youtube" },
    { label: "Instagram", path: "/media/instagram" },
    { label: "Dokumentasi", path: "/media/documentation" },
  ],
  pengumuman: [
    { label: "Agenda", path: "/pengumuman/events" },
    { label: "Warta Gereja", path: "/pengumuman/warta-gereja" },
  ],
  komisi: [
    { label: "Diaken & Ibadah", path: "/komisi/diaken-ibadah" },
    { label: "Penatalayanan", path: "/komisi/penatalayanan" },
    { label: "PWG", path: "/komisi/pwg" },
  ],
};

const DropdownParent = ({
  dropdownKey,
  label,
  openDropdown,
  setOpenDropdown,
  handleNavigation,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const isMobile = () => window.innerWidth <= 1180;
  const isOpen = openDropdown === dropdownKey;
  const items = dropdownData[dropdownKey];
  const mobile = isMobile();

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!mobile) {
      clearTimeout(hoverTimeoutRef.current);
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!mobile) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  };

  const handleToggle = (e) => {
    if (mobile) {
      e.preventDefault();
      setOpenDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
    }
  };

  return (
    <li
      className={`navbar-dropdown-parent ${isOpen ? "active" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button onClick={handleToggle} className="dropdown-toggle-btn">
        <span className="dropdown-trigger">
          {label}
          <ArrowIcon isOpen={mobile ? isOpen : isHovered} />
        </span>
      </button>

      {/* Desktop: hover-driven */}
      {!mobile && (
        <DesktopDropdown
          isOpen={isHovered}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, i) => (
            <DropdownItem key={item.path} index={i}>
              <a
                href={item.path}
                onClick={(e) => handleNavigation(item.path, e)}
              >
                {item.label}
              </a>
            </DropdownItem>
          ))}
        </DesktopDropdown>
      )}

      {/* Mobile: toggle-driven accordion */}
      {mobile && (
        <MobileDropdown isOpen={isOpen}>
          {items.map((item, i) => (
            <DropdownItem key={item.path} index={i}>
              <a
                href={item.path}
                onClick={(e) => handleNavigation(item.path, e)}
              >
                {item.label}
              </a>
            </DropdownItem>
          ))}
        </MobileDropdown>
      )}
    </li>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [navState, setNavState] = useState("top");
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const isScrolled = useRef(false);

  const getBasePath = () => {
    const publicUrl = process.env.PUBLIC_URL || "";
    if (!publicUrl) return "";
    try {
      const parsed = new URL(publicUrl, window.location.origin);
      return parsed.pathname.replace(/\/+$/, "");
    } catch {
      return publicUrl.replace(/\/+$/, "");
    }
  };

  const resolveAppPath = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${getBasePath()}${normalizedPath}`;
  };

  useEffect(() => {
    setNavState("top");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;
        const wasScrolled = isScrolled.current;
        isScrolled.current = currentY > 60;

        if (isMenuOpen) {
          ticking.current = false;
          lastScrollY.current = currentY;
          return;
        }

        if (currentY <= 60) {
          setNavState("top");
        } else if (delta > 4) {
          setNavState("hidden");
        } else if (delta < -4) {
          setNavState("scrolled");
        } else if (!wasScrolled && isScrolled.current) {
          setNavState("scrolled");
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      setNavState(window.scrollY > 60 ? "scrolled" : "top");
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!(window.innerWidth <= 1024 && isMenuOpen)) return;
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
    if (isMenuOpen) setOpenDropdown(null);
    setIsMenuOpen((prev) => !prev);
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
    <nav className={`navbar navbar-state-${navState}`}>
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
                Tentang
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
            <DropdownParent
              dropdownKey="media"
              label="Media"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleNavigation={handleNavigation}
            />
            <DropdownParent
              dropdownKey="pengumuman"
              label="Pengumuman"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleNavigation={handleNavigation}
            />
            <DropdownParent
              dropdownKey="komisi"
              label="Komisi"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              handleNavigation={handleNavigation}
            />
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

        {isMenuOpen && (
          <button
            className="close-menu-btn"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
