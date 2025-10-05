import {
  Facebook,
  GraduationCap,
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
              <GraduationCap className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-bold">Training Center</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
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
            <h3 className="text-lg font-bold mb-4">Popular Courses</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                Microsoft Office
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                Graphic Design
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                Web Development
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                Digital Marketing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                Programming
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  কুমিল্লা, চট্টগ্রাম
                  <br />
                  বাংলাদেশ
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span>info@training.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Newsletter</h4>
              <div className="join w-full">
                <input
                  type="email"
                  placeholder="Your email"
                  className="input input-bordered input-sm join-item w-full"
                />
                <button className="btn btn-primary btn-sm join-item">
                  Subscribe
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
