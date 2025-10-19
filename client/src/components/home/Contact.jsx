import { Headset, Mail, MapPinHouse } from "lucide-react";
export default function Contact() {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">যোগাযোগ করুন</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="card bg-white/10 backdrop-blur">
            <div className="card-body items-center">
              <MapPinHouse className="w-12 h-12 mb-3" />
              <h3 className="font-bold text-xl mb-2">ঠিকানা</h3>
              <p>হরিশ্চর, লালমাই, কুমিল্লা।</p>
            </div>
          </div>
          <div className="card bg-white/10 backdrop-blur">
            <div className="card-body items-center">
              <Mail className="w-12 h-12 mb-3" />
              <h3 className="font-bold text-xl mb-2">ইমেইল</h3>
              <p>mrmozammal@gmail.com</p>
            </div>
          </div>
          <div className="card bg-white/10 backdrop-blur">
            <div className="card-body items-center">
              <Headset className="w-12 h-12 mb-3" />
              <h3 className="font-bold text-xl mb-2">ফোন</h3>
              <p>+880 1914708856</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
