import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        <h1 className="text-4xl font-bold mb-4">পেজ পাওয়া যায়নি! 😕</h1>
        <p className="text-xl text-gray-600 mb-8">
          দুঃখিত, আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই।
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn btn-primary">
            হোমপেজে ফিরে যান
          </Link>
          <Link to="/login" className="btn btn-secondary">
            লগইন করুন
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
