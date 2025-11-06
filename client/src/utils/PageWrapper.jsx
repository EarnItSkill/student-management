// PageWrapper.jsx
import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // শুরুতে ফেইড ও হালকা নিচে থাকবে
      animate={{ opacity: 1, y: 0 }} // ধীরে ধীরে দৃশ্যমান হবে
      exit={{ opacity: 0, y: -20 }} // বের হওয়ার সময় ফেইড হবে
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
