import {
  ArrowRight,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // স্ক্রোল করলে ভিজিবল নিয়ন্ত্রণ
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        // এক স্ক্রিনের বেশি স্ক্রোল করলে দেখাবে
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const socialLinks = [
    {
      icon: Facebook,
      label: "Facebook",
      href: "#",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "#",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "#",
      color: "hover:text-pink-600",
    },
    { icon: Youtube, label: "YouTube", href: "#", color: "hover:text-red-600" },
  ];

  const quickLinks = [
    { label: "হোম", path: "/" },
    { label: "কোর্স", path: "/courses" },
    { label: "আমাদের সম্পর্কে", path: "/about" },
    { label: "যোগাযোগ", path: "/contact" },
    { label: "লগইন", path: "/login" },
  ];

  const courses = [
    "মাইক্রোসফ্ট অফিস",
    "এডভান্স এক্সেল",
    "ICT এইচএসসি, আলিম",
    "ওয়েব ডিজাইন",
    "প্রোগ্রামিং",
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-5 rounded-full blur-3xl"></div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* About Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75"></div>
                  <img
                    className="relative w-10 h-10 rounded-full border-2 border-slate-700"
                    src="https://office-course.vercel.app/assets/images/logo/logo.jpg"
                    alt="Earn IT Skill"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Earn IT Skill
                  </h3>
                  <p className="text-xs text-slate-400">(ICT-Ofline)</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                আমরা মানসম্মত কম্পিউটার প্রশিক্ষণ প্রদান করি। আপনার ক্যারিয়ার
                গড়ার সঠিক সঙ্গী।
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600 text-slate-300 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 hover:text-white hover:scale-110 ${social.color}`}
                      title={social.label}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                দ্রুত লিংক
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-300 group"
                    >
                      <ArrowRight className="w-3 h-3 text-blue-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Courses */}
            <div>
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                জনপ্রিয় কোর্স
              </h3>
              <ul className="space-y-3">
                {courses.map((course, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group"
                  >
                    <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                    {course}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                যোগাযোগ
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center group-hover:bg-blue-600/40 transition-colors">
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-slate-400 leading-relaxed">
                    হরিশ্চর, লালমাই, কুমিল্লা
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center group-hover:bg-purple-600/40 transition-colors">
                    <Phone className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-400">+880 1914 708856</p>
                    <p className="text-slate-400">+880 1515 667293</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-pink-600/20 flex items-center justify-center group-hover:bg-pink-600/40 transition-colors">
                    <Mail className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-slate-400">earnitskill@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></span>
                নিউজলেটার
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                সর্বশেষ আপডেট এবং অফার পান সবার আগে।
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল"
                    className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-slate-700 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
                >
                  <Send className="w-4 h-4" />
                  সাবস্ক্রাইব
                </button>
              </form>
              {subscribed && (
                <p className="text-sm text-green-400 mt-2 animate-pulse">
                  ✓ সাবস্ক্রিপশন সফল!
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 mb-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-center md:text-left text-sm text-slate-400">
              © {currentYear}{" "}
              <span className="font-bold text-white">Earn IT Skill</span>.
              সর্বাধিকার সংরক্ষিত।
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
              >
                গোপনীয়তা নীতি
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="w-px h-4 bg-slate-700"></div>
              <Link
                to="/terms"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
              >
                শর্তাবলী
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="w-px h-4 bg-slate-700"></div>
              <Link
                to="/refund"
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
              >
                রিফান্ড নীতি
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button (Optional) */}
      {isVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all opacity-50 hover:opacity-100 hover:pointer-events-auto flex items-center justify-center"
        >
          ↑
        </button>
      )}
    </footer>
  );
};

export default Footer;
