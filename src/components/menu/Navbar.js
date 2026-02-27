import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import "./Navbar.css";
import logo from "../../assets/logo.png";

/* ─── Animated arrow ─────────────────────────────────────────────── */
const ArrowIcon = ({ isOpen }) => (
  <motion.span
    className="dropdown-arrow"
    aria-hidden="true"
    animate={{ rotate: isOpen ? 180 : 0 }}
    transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
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
  </motion.span>
);

/* ─── Desktop dropdown panel ─────────────────────────────────────── */
const DesktopDropdown = ({ children }) => (
  <motion.ul
    className="navbar-dropdown navbar-dropdown--motion"
    initial={{ opacity: 0, y: 8, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 8, scale: 0.96 }}
    transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
  >
    {children}
  </motion.ul>
);

/* ─── Mobile accordion ───────────────────────────────────────────── */
const MobileDropdown = ({ isOpen, children }) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.ul
        className="navbar-dropdown navbar-dropdown--mobile-motion"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
        style={{ overflow: "hidden" }}
      >
        {children}
      </motion.ul>
    )}
  </AnimatePresence>
);

/* ─── Staggered dropdown item ────────────────────────────────────── */
const DropdownItem = ({ children, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -6 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -6 }}
    transition={{ duration: 0.16, delay: index * 0.045, ease: "easeOut" }}
  >
    {children}
  </motion.li>
);

/* ─── Dropdown parent ────────────────────────────────────────────── */
const dropdownData = {
  media: [
    { label: "YouTube", path: "/media/youtube" },
    { label: "Instagram", path: "/media/instagram" },
    { label: "Documentation", path: "/media/documentation" },
  ],
  pengumuman: [
    { label: "Events", path: "/pengumuman/events" },
    { label: "Warta Gereja", path: "/pengumuman/warta-gereja" },
  ],
  komisi: [
    { label: "PWG & Ibadah", path: "/komisi/pwg" },
    { label: "Diaken", path: "/komisi/diaken" },
    { label: "Penatalayanan", path: "/komisi/Penatalayanan" },
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
  const isMobile = () => window.innerWidth <= 1180;
  const isOpen = openDropdown === dropdownKey;
  const items = dropdownData[dropdownKey];
  const mobile = isMobile();

  const handleToggle = (e) => {
    if (mobile) {
      e.preventDefault();
      setOpenDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
    }
  };

  return (
    <li
      className={`navbar-dropdown-parent ${isOpen ? "active" : ""}`}
      onMouseEnter={() => !mobile && setIsHovered(true)}
      onMouseLeave={() => !mobile && setIsHovered(false)}
    >
      <button onClick={handleToggle} className="dropdown-toggle-btn">
        <span className="dropdown-trigger">
          {label}
          <ArrowIcon isOpen={mobile ? isOpen : isHovered} />
        </span>
      </button>

      {/* Desktop: hover-driven with AnimatePresence */}
      {!mobile && (
        <AnimatePresence>
          {isHovered && (
            <DesktopDropdown>
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
        </AnimatePresence>
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

/* ─── Navbar ─────────────────────────────────────────────────────── */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const controls = useAnimation();
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
    controls.start("top");
  }, [controls]);

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
          controls.start("top");
        } else if (delta > 4) {
          controls.start("hidden");
        } else if (delta < -4) {
          controls.start("scrolled");
        } else if (!wasScrolled && isScrolled.current) {
          controls.start("scrolled");
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      controls.start(window.scrollY > 60 ? "scrolled" : "top");
    }
  }, [isMenuOpen, controls]);

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
    <motion.nav
      className="navbar"
      initial="top"
      animate={controls}
      variants={{
        top: {
          y: 0,
          backgroundColor: "rgba(58, 63, 60, 0)",
          backdropFilter: "blur(0px)",
          transition: {
            y: { duration: 0.44, ease: [0.22, 0.61, 0.36, 1] },
            backgroundColor: { duration: 0.55, ease: "easeOut" },
            backdropFilter: { duration: 0.55, ease: "easeOut" },
          },
        },
        scrolled: {
          y: 0,
          backgroundColor: "rgba(58, 63, 60, 1)",
          transition: {
            y: { duration: 0.44, ease: [0.22, 0.61, 0.36, 1] },
            backgroundColor: { duration: 0.55, ease: "easeOut" },
          },
        },
        hidden: {
          y: "-110%",
          backgroundColor: "rgba(58, 63, 60, 1)",
          transition: {
            y: { duration: 0.34, ease: [0.55, 0, 0.45, 1] },
            backgroundColor: { duration: 0.18, ease: "easeIn" },
          },
        },
      }}
    >
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
    </motion.nav>
  );
};

export default Navbar;
