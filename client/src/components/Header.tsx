import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Accessibility,
  Type,
  Contrast,
  MousePointer,
  Eye,
  EyeOff,
  Keyboard,
  Volume2,
  Monitor,
  Sun,
  Moon,
  Minus,
  Plus,
  RotateCcw,
  Settings,
  BookOpen,
  Shield,
  Heart,
  FileText,
  Handshake,
  Globe,
  Users,
  UserPlus,
  Calendar,
  Stethoscope,
  Network,
  Info,
  UserCheck,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import casLogo from "@assets/l_cas_vert_rgb_1753253116732.png";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { isStaging } from "@/hooks/useEnvironment";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdowns, setMobileDropdowns] = useState<{
    [key: string]: boolean;
  }>({});
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [location] = useLocation();
  const { t } = useLanguage();

  const increaseFontSize = () => {
    if (fontSize < 24) {
      const newSize = fontSize + 2;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      const newSize = fontSize - 2;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  const resetSettings = () => {
    setFontSize(16);
    document.documentElement.style.fontSize = "16px";
  };

  // Function to check if current page matches navigation item
  const isPageActive = (href: string, dropdownItems?: any[]) => {
    if (href === "#" || href === "/") {
      return location === "/";
    }

    if (dropdownItems) {
      return dropdownItems.some((item) => item.href === location);
    }

    return location === href;
  };

  const stagingOnly = isStaging();
  
  const navItems = [
    {
      name: t("nav.about"),
      href: "#about",
      hasDropdown: true,
      dropdownItems: [
        { name: t("nav.aboutCAS"), href: "/about" },
        { name: t("nav.aboutAmyloidosis"), href: "/about-amyloidosis" },
      ],
    },
    {
      name: t("nav.resources"),
      href: "#resources",
      hasDropdown: true,
      dropdownItems: stagingOnly
        ? [
            {
              name: t("nav.uploadResource"),
              href: "/upload-resource",
            },
            {
              name: t("nav.manageResources"),
              href: "/admin/resources/moderation",
            },
            {
              name: t("nav.partnerships"),
              href: "/partnerships",
            },
          ]
        : [
            {
              name: t("nav.partnerships"),
              href: "/partnerships",
            },
          ],
    },
    { name: t("nav.getInvolved"), href: "/get-involved" },
    ...(stagingOnly
      ? [
          {
            name: t("nav.eventsAndNews"),
            href: "/events-and-news",
            hasDropdown: true,
            dropdownItems: [
              { name: t("nav.summit"), href: "/events-and-news#summit" },
              { name: t("nav.journalClub"), href: "/journal-club" },
              { name: t("nav.cannEvents"), href: "/events-and-news#cann-events" },
              { name: t("nav.news"), href: "/events-and-news#news" },
            ],
          },
        ]
      : [{ name: t("nav.events"), href: "/events" }]),
    {
      name: "CANN",
      href: "#cann",
      hasDropdown: true,
      dropdownItems: [
        { name: t("nav.aboutCANN"), href: "/about-cann" },
        { name: t("nav.cannResources"), href: "/cann-resources" },
      ],
    },
    { name: t("nav.contactUs"), href: "/contact" },
    { name: t("nav.joinCASCANN"), href: "/join-cas", isPrimary: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-white backdrop-blur-md border-b border-gray-200 shadow-sm ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-300 shadow-lg"
          : "bg-white backdrop-blur-xl"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
    >
      <div className="max-w-8xl mx-auto px-4 xl:px-6">
        <div className="flex items-center justify-between h-20 md:h-24 min-w-0">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center group cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src={casLogo}
              alt="Canadian Amyloidosis Society"
              className="h-16 w-auto md:h-20 group-hover:scale-105 transition-all duration-300 drop-shadow-md"
            />
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center">
            <div className="flex items-center gap-1 bg-gray-100/95 backdrop-blur-xl rounded-full px-4 py-2 border border-gray-300/50 shadow-lg">
              {navItems.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.hasDropdown ? (
                    <motion.a
                      href={item.href.startsWith("#") ? undefined : item.href}
                      className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 text-sm font-semibold border whitespace-nowrap cursor-pointer ${
                        isPageActive(item.href, item.dropdownItems)
                          ? "text-gray-800 bg-gradient-to-r from-[#00AFE6]/30 to-[#00DD89]/30 border-[#00AFE6]/60 shadow-lg shadow-[#00AFE6]/30"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 border-transparent hover:border-[#00AFE6]/40 hover:shadow-md hover:shadow-[#00AFE6]/20"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-2.5 h-2.5 transition-all duration-300 ${
                          activeDropdown === item.name
                            ? "rotate-180 text-[#00AFE6]"
                            : isPageActive(item.href, item.dropdownItems)
                              ? "text-[#00AFE6]"
                              : ""
                        }`}
                      />
                      {isPageActive(item.href, item.dropdownItems) && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
                      )}
                    </motion.a>
                  ) : (
                    <motion.a
                      href={item.href}
                      className={`flex items-center gap-1 px-3 py-2 rounded-full transition-all duration-300 text-sm font-semibold border relative whitespace-nowrap ${
                        item.isPrimary
                          ? "text-white bg-gradient-to-r from-[#00AFE6] to-[#00DD89] border-transparent shadow-lg shadow-[#00AFE6]/30 hover:shadow-xl hover:shadow-[#00AFE6]/40 hover:scale-105"
                          : isPageActive(item.href)
                            ? "text-gray-800 bg-gradient-to-r from-[#00AFE6]/30 to-[#00DD89]/30 border-[#00AFE6]/60 shadow-lg shadow-[#00AFE6]/30"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-[#00AFE6]/20 hover:to-[#00DD89]/20 border-transparent hover:border-[#00AFE6]/40 hover:shadow-md hover:shadow-[#00AFE6]/20"
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: item.isPrimary ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                      {!item.isPrimary && isPageActive(item.href) && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
                      )}
                    </motion.a>
                  )}

                  {/* Dropdown Menu */}
                  {item.hasDropdown && (
                    <div
                      className="dropdown-menu absolute top-full left-0 pt-2 w-72 z-[9999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{ zIndex: 9999 }}
                    >
                      <motion.div
                        className="bg-white backdrop-blur-xl rounded-2xl border border-gray-300 shadow-2xl shadow-gray-500/10 py-3 overflow-hidden relative"
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{
                          opacity: activeDropdown === item.name ? 1 : 0,
                          y: activeDropdown === item.name ? 0 : -20,
                          scale: activeDropdown === item.name ? 1 : 0.9,
                        }}
                        transition={{
                          duration: 0.3,
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        style={{ zIndex: 9999 }}
                      >
                        {/* Gradient glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00AFE6]/5 to-[#00DD89]/5 rounded-2xl overflow-hidden"></div>

                        {item.dropdownItems?.map(
                          (dropdownItem, dropdownIndex) => (
                            <motion.a
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="relative block px-6 py-4 text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-[#00AFE6]/15 hover:to-[#00DD89]/15 transition-all duration-300 text-base font-semibold border-l-2 border-transparent hover:border-[#00AFE6] hover:shadow-lg hover:shadow-[#00AFE6]/10 group/item"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{
                                opacity: activeDropdown === item.name ? 1 : 0,
                                x: activeDropdown === item.name ? 0 : -20,
                              }}
                              transition={{
                                duration: 0.3,
                                delay: dropdownIndex * 0.1,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 shrink-0 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full opacity-50 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                                <span className="group-hover/item:translate-x-1 transition-transform duration-300">
                                  {dropdownItem.name}
                                </span>
                              </div>
                            </motion.a>
                          ),
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Controls Section */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="hidden md:flex items-center space-x-1.5">
              <LanguageSwitcher />
              <ThemeToggle />
              <div className="relative">
                <button
                  onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                  className="flex items-center gap-1.5 bg-white backdrop-blur-sm border border-gray-300 rounded-full px-2.5 py-0.5 cursor-pointer hover:bg-gray-100 transition-all duration-300 shadow-sm h-6 min-w-[100px] justify-center text-black text-xs font-medium"
                  aria-label="Open accessibility tools"
                  aria-expanded={isAccessibilityOpen}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="font-medium">Accessibility</span>
                </button>

                {/* Accessibility Dropdown */}
                <AnimatePresence>
                  {isAccessibilityOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-80 z-[120]"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#00AFE6] rounded-full flex items-center justify-center">
                                <Settings className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                  Accessibility Tools
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Customize your experience
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => setIsAccessibilityOpen(false)}
                              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              aria-label="Close accessibility tools"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-4 max-h-96 overflow-y-auto pr-3">
                            {/* Font Size */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Type className="w-4 h-4 text-[#00AFE6]" />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Text Size
                                  </span>
                                </div>
                                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                  {fontSize}px
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={decreaseFontSize}
                                  disabled={fontSize <= 12}
                                  className="p-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                  aria-label="Decrease font size"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-2 relative">
                                  <div
                                    className="bg-[#00AFE6] h-2 rounded-lg transition-all duration-300"
                                    style={{
                                      width: `${((fontSize - 12) / 12) * 100}%`,
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={increaseFontSize}
                                  disabled={fontSize >= 24}
                                  className="p-1.5 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                                  aria-label="Increase font size"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* High Contrast */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Contrast className="w-4 h-4 text-[#00AFE6]" />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    High Contrast
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    document.documentElement.classList.toggle(
                                      "accessibility-high-contrast",
                                    )
                                  }
                                  className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  Toggle
                                </button>
                              </div>
                            </div>

                            {/* Focus Indicators */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Eye className="w-4 h-4 text-[#00AFE6]" />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Focus Indicators
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    document.documentElement.classList.toggle(
                                      "accessibility-focus-visible",
                                    )
                                  }
                                  className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  Toggle
                                </button>
                              </div>
                            </div>

                            {/* Dyslexia Font */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Type className="w-4 h-4 text-[#00AFE6]" />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Dyslexia Font
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    document.documentElement.classList.toggle(
                                      "accessibility-dyslexia-font",
                                    )
                                  }
                                  className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  Toggle
                                </button>
                              </div>
                            </div>

                            {/* Cursor Size */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <MousePointer className="w-4 h-4 text-[#00AFE6]" />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Cursor Size
                                  </span>
                                </div>
                                <select
                                  className="px-2 py-1 text-xs border rounded bg-white dark:bg-gray-800"
                                  onChange={(e) => {
                                    document.documentElement.classList.remove(
                                      "accessibility-cursor-large",
                                      "accessibility-cursor-extra-large",
                                    );
                                    if (e.target.value !== "normal") {
                                      document.documentElement.classList.add(
                                        `accessibility-cursor-${e.target.value}`,
                                      );
                                    }
                                  }}
                                >
                                  <option value="normal">Normal</option>
                                  <option value="large">Large</option>
                                  <option value="extra-large">
                                    Extra Large
                                  </option>
                                </select>
                              </div>
                            </div>

                            {/* Reduced Motion */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <EyeOff className="w-4 h-4 text-[#00AFE6]" />
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    Reduce Motion
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    document.documentElement.classList.toggle(
                                      "accessibility-reduced-motion",
                                    )
                                  }
                                  className="px-3 py-1 text-xs border rounded-full hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                  Toggle
                                </button>
                              </div>
                            </div>

                            {/* Reset Button */}
                            <div className="pt-3 border-t dark:border-gray-800">
                              <button
                                onClick={resetSettings}
                                className="w-full p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2 text-sm"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Reset to Default
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="xl:hidden p-2 md:p-3 rounded-xl bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all duration-300"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isMenuOpen) {
                  setMobileDropdowns({});
                }
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="xl:hidden"
        initial={false}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <div className="py-4 md:py-6 bg-white/95 backdrop-blur-xl rounded-2xl mt-2 md:mt-4 mx-4 border border-gray-200 shadow-xl max-h-[70vh] overflow-y-auto">
          {/* Navigation Items */}
          <div className="space-y-1 px-4">
            {navItems.map((item, index) => (
              <div key={item.name} className="space-y-1">
                {item.hasDropdown ? (
                  <>
                    <div
                      className={`w-full flex items-center justify-between px-4 py-3 font-semibold text-base rounded-xl transition-all duration-300 ${
                        isPageActive(item.href, item.dropdownItems)
                          ? "text-gray-800 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <a
                        href={item.href.startsWith("#") ? undefined : item.href}
                        onClick={() => {
                          if (!item.href.startsWith("#")) {
                            setIsMenuOpen(false);
                            setMobileDropdowns({});
                          }
                        }}
                        className="flex-1"
                      >
                        {item.name}
                      </a>
                      <div className="flex items-center gap-2">
                        {isPageActive(item.href, item.dropdownItems) && (
                          <div className="w-2 h-2 shrink-0 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMobileDropdowns((prev) => ({
                              ...prev,
                              [item.name]: !prev[item.name],
                            }));
                          }}
                          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              mobileDropdowns[item.name] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    {mobileDropdowns[item.name] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {item.dropdownItems?.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className={`flex items-center justify-start gap-3 px-8 py-3 rounded-xl transition-all duration-300 text-sm ${
                              location === dropdownItem.href
                                ? "text-gray-800 bg-gradient-to-r from-[#00AFE6]/20 to-[#00DD89]/20 border-l-4 border-[#00AFE6]"
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setMobileDropdowns({});
                            }}
                          >
                            <div className={`w-2 h-2 shrink-0 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full ${
                              location === dropdownItem.href ? "opacity-100" : "opacity-50"
                            }`}></div>
                            <span className="text-left">{dropdownItem.name}</span>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 font-semibold text-base rounded-xl transition-all duration-300 ${
                      item.isPrimary
                        ? "text-white bg-gradient-to-r from-[#00AFE6] to-[#00DD89] shadow-lg shadow-[#00AFE6]/30"
                        : isPageActive(item.href)
                          ? "text-gray-800 bg-gradient-to-r from-[#00AFE6]/15 to-[#00DD89]/15 border-l-4 border-[#00AFE6]"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setMobileDropdowns({});
                    }}
                  >
                    <span>{item.name}</span>
                    {!item.isPrimary && isPageActive(item.href) && (
                      <div className="w-2 h-2 shrink-0 bg-gradient-to-r from-[#00AFE6] to-[#00DD89] rounded-full"></div>
                    )}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Control Buttons Section */}
          <div className="px-4 pt-4 mt-4 border-t border-gray-200">
            <div className="flex flex-col items-center gap-2 mb-3">
              <div className="flex items-center justify-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <button
                onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                className="flex items-center gap-1.5 bg-gray-100 backdrop-blur-sm border border-gray-300 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-200 transition-all duration-300 shadow-sm justify-center text-gray-700 text-xs font-medium"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Accessibility</span>
              </button>
            </div>

            {/* Mobile Accessibility Panel */}
            {isAccessibilityOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-4 mt-3 border border-gray-300 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-gray-900">
                    Accessibility Tools
                  </h4>
                  <button
                    onClick={() => setIsAccessibilityOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Font Size */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700 font-medium">Text Size</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={decreaseFontSize}
                        disabled={fontSize <= 12}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded min-w-[40px] text-center font-medium">
                        {fontSize}px
                      </span>
                      <button
                        onClick={increaseFontSize}
                        disabled={fontSize >= 24}
                        className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 text-gray-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Quick toggles */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        document.documentElement.classList.toggle(
                          "accessibility-high-contrast",
                        )
                      }
                      className="text-xs px-2 py-2 border border-gray-300 rounded hover:bg-gray-100 text-center text-gray-700 font-medium"
                    >
                      High Contrast
                    </button>
                    <button
                      onClick={() =>
                        document.documentElement.classList.toggle(
                          "accessibility-dyslexia-font",
                        )
                      }
                      className="text-xs px-2 py-2 border border-gray-300 rounded hover:bg-gray-100 text-center text-gray-700 font-medium"
                    >
                      Dyslexia Font
                    </button>
                  </div>

                  <button
                    onClick={resetSettings}
                    className="w-full text-xs px-2 py-2 border border-gray-300 rounded hover:bg-gray-100 text-center text-gray-700 font-medium"
                  >
                    Reset Settings
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
