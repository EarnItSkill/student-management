import {
  ArrowRight,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const BatchScheduleSection = () => {
  // মৌলিক ব্যাচ টেমপ্লেট (শুধু সময়সূচী ও স্থায়ী তথ্য)
  const batchTemplates = [
    {
      id: 1,
      title: "সকাল ব্যাচ ICT",
      timeSlot: "সকাল ৮:০০ - ৯:০০",
      icon: "🌅",
      color: "from-orange-400 to-red-500",
      tColor: "text-red-500",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-300",
      description: "যারা সকালে পড়তে পছন্দ করেন",
      popular: true,
    },
    {
      id: 2,
      title: "সকাল ব্যাচ",
      timeSlot: "সকাল ১০:০০ - ১২:০০",
      icon: "☀️",
      color: "from-yellow-400 to-orange-500",
      tColor: "text-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-300",
      description: "মধ্য সকালের আদর্শ সময়",
      popular: false,
    },
    {
      id: 3,
      title: "দুপুর ব্যাচ",
      timeSlot: "দুপুর ২:০০ - ৪:০০",
      icon: "🌤️",
      color: "from-blue-400 to-cyan-500",
      tColor: "text-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      description: "দুপুরের শান্ত পরিবেশে",
      popular: false,
    },
    {
      id: 4,
      title: "বিকেল ব্যাচ",
      timeSlot: "বিকেল ৪:০০ - ৬:০০",
      icon: "🌆",
      color: "from-purple-400 to-pink-500",
      tColor: "text-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-300",
      description: "স্কুল/কলেজের পর উপযুক্ত",
      popular: true,
    },
    {
      id: 5,
      title: "সন্ধ্যা ব্যাচ",
      timeSlot: "সন্ধ্যা ৬:০০ - ৮:০০",
      icon: "🌇",
      color: "from-indigo-400 to-purple-500",
      tColor: "text-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-300",
      description: "কর্মজীবীদের জন্য আদর্শ",
      popular: true,
    },
    {
      id: 6,
      title: "রাত্রি ব্যাচ",
      timeSlot: "রাত ৮:০০ - ১০:০০",
      icon: "🌙",
      color: "from-slate-400 to-blue-600",
      tColor: "text-blue-500",
      bgColor: "from-slate-50 to-blue-50",
      borderColor: "border-slate-300",
      description: "নৈশকালীন শিক্ষার্থীদের জন্য",
      popular: false,
    },
  ];

  // স্থায়ী তথ্য (সব ব্যাচের জন্য একই)
  const batchInfo = {
    duration: "৩ মাস",
    daysPerWeek: "৬ দিন (শনি - বৃহস্পতিবার)",
    courseFee: "৪,০০০ টাকা",
    totalSeats: 19,
    features: [
      "অভিজ্ঞ শিক্ষক",
      "ছোট ব্যাচ সাইজ",
      "প্র্যাকটিক্যাল ক্লাস",
      "সার্টিফিকেট প্রদান",
    ],
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">ব্যাচ সময়সূচী</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            আপনার সুবিধামত সময় বেছে নিন
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            সকাল থেকে রাত পর্যন্ত ৬টি ভিন্ন সময়ে ক্লাস। যেকোনো একটি বেছে নিয়ে
            শুরু করুন আপনার শেখার যাত্রা
          </p>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {batchTemplates.map((batch) => (
            <div
              key={batch.id}
              className={`card bg-gradient-to-br ${batch.bgColor} border-2 ${batch.borderColor} hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group`}
            >
              {/* Popular Badge */}
              {batch.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-1 bg-warning text-warning-content px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    <Star className="w-3 h-3 fill-current" />
                    জনপ্রিয়
                  </div>
                </div>
              )}

              <div className="card-body p-6 relative">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{batch.icon}</div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-1 ${batch.tColor}`}>
                      {batch.title}
                    </h3>
                    <p className="text-sm text-gray-600">{batch.description}</p>
                  </div>
                </div>

                {/* Time Slot - Highlighted */}
                <div
                  className={`bg-gradient-to-r ${batch.color} p-4 rounded-xl mb-4 transform group-hover:scale-105 transition-transform`}
                >
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Clock className="w-6 h-6" />
                    <span className="text-xl font-bold">{batch.timeSlot}</span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">সময়কাল</p>
                      <p className="font-bold">{batchInfo.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white p-2 rounded-lg">
                      <Users className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">সর্বোচ্চ সিট</p>
                      <p className="font-bold">{batchInfo.totalSeats} জন</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="bg-white p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">কোর্স ফি</p>
                      <p className="font-bold">{batchInfo.courseFee}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="btn btn-primary w-full mt-6 gap-2 group-hover:gap-4 transition-all">
                  এই ব্যাচে ভর্তি হন
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="card bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl">
          <div className="card-body p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Features */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-12 h-12" />
                  <h3 className="text-3xl font-bold">কোর্সের বিশেষত্ব</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {batchInfo.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Class Days */}
              <div>
                <div className="card bg-white/20 backdrop-blur-sm border-2 border-white/30">
                  <div className="card-body p-6">
                    <h4 className="text-xl font-bold mb-4">ক্লাসের দিনসমূহ</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-6 h-6" />
                      <span className="text-lg font-semibold">
                        {batchInfo.daysPerWeek}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ"].map(
                        (day) => (
                          <div
                            key={day}
                            className="bg-white/30 backdrop-blur-sm py-2 px-3 rounded-lg text-center font-bold"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>
                    <div className="mt-4 p-3 bg-white/30 backdrop-blur-sm rounded-lg text-center">
                      <span className="text-sm font-semibold">
                        শুক্রবার সাপ্তাহিক ছুটি
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BatchScheduleSection;
