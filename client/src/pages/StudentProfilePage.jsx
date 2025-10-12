import { BookOpen, Mail, MapPin, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();

  // লগইন করা ছাত্রের তথ্য
  const student = currentUser;

  if (!student || student.role !== "student") {
    return (
      <div className="text-center py-20">
        <User className="w-20 h-20 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">অ্যাক্সেস নেই</h2>
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          লগইন করুন
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-base-200 min-h-screen">
      {/* Header */}
      <div className="gap-4 ">
        <h1 className="text-3xl font-bold text-center">আমার প্রোফাইল</h1>
      </div>

      {/* Student Profile Card */}
      <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl max-w-4xl mx-auto">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Avatar */}
            <div className="avatar">
              <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                <img src={student.image} alt={student.name} />
              </div>
            </div>

            {/* Student Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-4">
                <h2 className="text-4xl font-bold">{student.name}</h2>
                <div className="flex gap-2 flex-wrap justify-center">
                  <div className="badge badge-primary badge-lg">
                    {student.studentId}
                  </div>
                  <div
                    className={`badge badge-lg ${
                      student.gender === "male"
                        ? "badge-info"
                        : "badge-secondary"
                    }`}
                  >
                    {student.gender === "male" ? "ছেলে" : "মেয়ে"}
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">ইমেইল</p>
                    <p className="font-semibold">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">ফোন নম্বর</p>
                    <p className="font-semibold">{student.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">ঠিকানা</p>
                    <p className="font-semibold">{student.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-base-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">EIIN নম্বর</p>
                    <p className="font-semibold">{student.eiin}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
