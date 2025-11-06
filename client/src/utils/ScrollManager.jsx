// ScrollManager.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const savedPos = sessionStorage.getItem("scrollPos");

    if (savedPos && sessionStorage.getItem("lastPath") === pathname) {
      // আগের স্ক্রল পজিশনে ফিরবে
      window.scrollTo({
        top: parseInt(savedPos),
        behavior: "smooth",
      });
      sessionStorage.removeItem("scrollPos");
    } else {
      // টপে যাবে
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // বর্তমান path সেভ
    sessionStorage.setItem("lastPath", pathname);
  }, [pathname]);

  return null;
};

export default ScrollManager;
