import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 text-base-content">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                className="w-7 h-7 rounded-full"
                src="https://office-course.vercel.app/assets/images/logo/logo.jpg"
                alt=""
              />
              <h3 className="text-xl font-bold">
                Earn It Skill{" "}
                <span className="text-sm text-gray-400">Offline</span>
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              আমরা মানসম্মত কম্পিউটার প্রশিক্ষণ প্রদান করি। আপনার ক্যারিয়ার
              গড়ার সঠিক সঙ্গী।
            </p>
            <div className="flex gap-3">
              <a href="#" className="btn btn-circle btn-sm btn-primary">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm btn-primary">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm btn-primary">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="btn btn-circle btn-sm btn-primary">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-bold mb-4">জনপ্রিয় কোর্সসমূহ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                মাইক্রোসফ্ট অফিস
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                এডভান্স এক্সেল
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                ICT এইচএসসি, আলিম
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                ওয়েভ ডিজাইন
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                প্রোগ্রামিং
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">যোগাযোগ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  হরিশ্চর, লালমাই, কুমিল্লা।
                  <br />
                  বাংলাদেশ
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+880 1914 708856</span>
                <span>+880 1515 667293</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>earnitskill@gmail.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">নিউজ লেটার</h4>
              <div className="join w-full">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল"
                  className="input input-bordered input-sm join-item w-full"
                />
                <button className="btn btn-primary btn-sm join-item">
                  সাবস্ক্রাইব
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-base-content/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-center md:text-left">
              © {currentYear} Training Center. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/refund"
                className="hover:text-primary transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
