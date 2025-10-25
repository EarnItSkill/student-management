import {
  AlertCircle,
  Award,
  BookOpen,
  Clock,
  Facebook,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";

const NotEnrolledPage = () => {
  const contactInfo = {
    phone: "01515667293",
    email: "mrmozammal@gmail.com",
    address: "হরিশ্চর, লালমাই, কুমিল্লা",
    whatsapp: "01914708856",
    facebook: "facebook.com/mrmozammal",
  };

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "মানসম্পন্ন কোর্স",
      description: "অভিজ্ঞ শিক্ষকদের তত্ত্বাবধানে সম্পূর্ণ কোর্স",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "ছোট ব্যাচ সাইজ",
      description: "প্রতিটি ছাত্রকে বিশেষ মনোযোগ দেওয়ার জন্য",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "MCQ পরীক্ষা",
      description: "পরীক্ষা দেওয়ার মাধ্যমে আপনার স্কিল যাচাই করতে পারবেন",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Alert Card */}
          <div className="card bg-white shadow-2xl mb-8 overflow-hidden">
            <div className="card-body p-8">
              <div className="flex flex-col items-center text-center">
                {/* Icon with Animation */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-warning/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-warning to-orange-400 p-6 rounded-full">
                    <AlertCircle className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Main Message */}
                <h1 className="text-3xl pt-2 md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  আপনি এখনও কোনো ব্যাচে এনরোল করেননি
                </h1>

                <p className="text-lg text-gray-400 mb-6 max-w-2xl">
                  আমাদের কোর্সে যুক্ত হয়ে আপনার শিক্ষা যাত্রা শুরু করুন। নিচের
                  যোগাযোগ মাধ্যমে আমাদের সাথে সংযুক্ত হন।
                </p>

                {/* Decorative Badge */}
                <div className="badge badge-lg badge-primary gap-2 mb-8">
                  <Sparkles className="w-4 h-4" />
                  বিশেষ লক্ষণীয় বিষয়!
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="card bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="card-body items-center text-center p-6">
                      <div className="text-purple-600 mb-3">{feature.icon}</div>
                      <h3 className="font-bold text-lg mb-2 text-green-700">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="divider">
                <span className="badge badge-info text-white">
                  যোগাযোগ করুন
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {/* Phone */}
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="card bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-400 transition-all duration-300 cursor-pointer"
                >
                  <div className="card-body p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 p-3 rounded-full">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-medium">
                          ফোন করুন
                        </p>
                        <p
                          className="text-lg font-bold text-green-700 text-right"
                          dir="ltr"
                        >
                          {contactInfo.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 cursor-pointer"
                >
                  <div className="card-body p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#25D366] p-3 rounded-full">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-medium">
                          WhatsApp
                        </p>
                        <p
                          className="text-lg font-bold text-[#25D366] text-right"
                          dir="ltr"
                        >
                          {contactInfo.whatsapp}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="card bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 cursor-pointer"
                >
                  <div className="card-body p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 font-medium">
                          ইমেইল করুন
                        </p>
                        <p className="text-sm font-bold text-blue-700 truncate">
                          {contactInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href={`https://${contactInfo.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card bg-gradient-to-br from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 border-2 border-sky-200 hover:border-sky-400 transition-all duration-300 cursor-pointer"
                >
                  <div className="card-body p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#1877F2] p-3 rounded-full">
                        <Facebook className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 font-medium">
                          Facebook
                        </p>
                        <p className="text-sm font-bold text-[#1877F2] truncate">
                          মেসেজ করুন
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Address & Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Address */}
                <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <div className="card-body p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500 p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-medium mb-1">
                          আমাদের ঠিকানা
                        </p>
                        <p className="font-bold text-purple-700">
                          {contactInfo.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="card bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                  <div className="card-body p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-500 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 font-medium mb-1">
                          অফিস সময়
                        </p>
                        <p className="font-bold text-orange-700">
                          সকাল ৯টা - রাত ৯টা
                        </p>
                        <p className="text-sm text-gray-400">
                          শনি - বৃহস্পতিবার
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <GraduationCap className="w-6 h-6" />
                  <span className="font-bold text-lg">
                    এখনই যোগাযোগ করুন এবং শুরু করুন!
                  </span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="alert alert-info mt-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <h3 className="font-bold">দ্রুত রেজিস্ট্রেশন করুন!</h3>
                  <div className="text-sm">
                    সীমিত আসন বাকি আছে। আজই যোগাযোগ করে আপনার আসন নিশ্চিত করুন।
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

export default NotEnrolledPage;
