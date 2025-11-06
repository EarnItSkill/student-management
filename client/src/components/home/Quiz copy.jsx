import {
  Award,
  CheckCircle2,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

export default function Quiz() {
  const features = [
    {
      icon: Award,
      title: "নিয়মিত কুইজ",
      description: "প্রতিটি ক্লাসের পর MCQ কুইজ দিয়ে নিজের শেখা যাচাই করুন",
      color: "from-blue-600 to-cyan-600",
      gradient: "from-blue-100 to-cyan-50",
    },
    {
      icon: Trophy,
      title: "র‍্যাংকিং সিস্টেম",
      description:
        "ব্যাচে নিজের অবস্থান জানুন এবং প্রথম হওয়ার জন্য প্রতিযোগিতা করুন",
      color: "from-yellow-600 to-orange-600",
      gradient: "from-yellow-100 to-orange-50",
    },
    {
      icon: Target,
      title: "তাৎক্ষণিক ফলাফল",
      description: "কুইজ শেষ হওয়ার সাথে সাথেই ফলাফল এবং সঠিক উত্তর দেখুন",
      color: "from-green-600 to-emerald-600",
      gradient: "from-green-100 to-emerald-50",
    },
    {
      icon: TrendingUp,
      title: "পারফরম্যান্স ট্র্যাকিং",
      description:
        "সময়ের সাথে আপনার উন্নতি দেখুন এবং দুর্বল জায়গা চিহ্নিত করুন",
      color: "from-purple-600 to-pink-600",
      gradient: "from-purple-100 to-pink-50",
    },
  ];

  const rankings = [
    {
      position: 1,
      emoji: "🥇",
      title: "গোল্ড মেডেল",
      subtitle: "চ্যাম্পিয়ন",
      score: "95%+",
      benefits: ["৳৫০০ / বই পুরস্কার", "সার্টিফিকেট", "র‍্যাংকিং পয়েন্ট"],
      color: "from-yellow-400 to-yellow-600",
      bgGradient: "from-yellow-100 to-yellow-50",
    },
    {
      position: 2,
      emoji: "🥈",
      title: "সিলভার মেডেল",
      subtitle: "রানার-আপ",
      score: "90%+",
      benefits: ["৳৩০০ / বই পুরস্কার", "সার্টিফিকেট", "র‍্যাংকিং পয়েন্ট"],
      color: "from-gray-300 to-gray-600",
      bgGradient: "from-gray-100 to-gray-50",
    },
    {
      position: 3,
      emoji: "🥉",
      title: "ব্রোঞ্জ মেডেল",
      subtitle: "তৃতীয় স্থান",
      score: "85%+",
      benefits: ["৳১০০ / বই পুরস্কার", "সার্টিফিকেট", "র‍্যাংকিং পয়েন্ট"],
      color: "from-orange-400 to-orange-600",
      bgGradient: "from-orange-100 to-orange-50",
    },
  ];

  const certificateTypes = [
    {
      icon: "📜",
      title: "কোর্স সম্পন্ন সার্টিফিকেট",
      description: "কোর্সের সকল মডিউল সম্পন্ন করে পান",
    },
    {
      icon: "⭐",
      title: "পারফরম্যান্স এক্সিলেন্স সার্টিফিকেট",
      description: "৮৫%+ স্কোর অর্জনকারী শিক্ষার্থীদের জন্য",
    },
    {
      icon: "🎖️",
      title: "র‍্যাংকার সার্টিফিকেট",
      description: "র‍্যাঙ্কিং এ শীর্ষ ১০ স্থান অধিকারকারীদের জন্য",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-purple-500 bg-opacity-10 border border-purple-400 border-opacity-30">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold text-sm">
              ইন্টারেক্টিভ শিক্ষা
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            MCQ কুইজ সুবিধা
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            নিয়মিত কুইজের মাধ্যমে নিজের দক্ষতা যাচাই করুন এবং সার্টিফিকেট অর্জন
            করুন
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative h-full"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Glowing Background */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                ></div>

                {/* Card */}
                <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl group-hover:border-opacity-100 transition-all duration-500 h-full">
                  {/* Top accent */}
                  <div
                    className={`h-1 bg-gradient-to-r ${feature.color}`}
                  ></div>

                  <div className="p-6">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ranking System */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-white mb-4 flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-yellow-400" />
              র‍্যাংকিং এবং পুরস্কার সিস্টেম
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              অধ্যায় ভিত্তিক MCQ পরীক্ষায় অংশগ্রহণ করে আপনার পারফরম্যান্স
              অনুযায়ী রংকিং এবং আকর্ষণীয় পুরস্কার জিতুন
            </p>
          </div>

          {/* Ranking Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rankings.map((rank, index) => (
              <div
                key={index}
                className="group relative"
                style={{
                  animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Glowing Background */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${rank.color} opacity-20 group-hover:opacity-40 rounded-2xl blur-xl transition-opacity duration-500`}
                ></div>

                {/* Card */}
                <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl group-hover:border-opacity-100 transition-all duration-500">
                  {/* Header with gradient */}
                  <div
                    className={`bg-gradient-to-r ${rank.bgGradient} p-6 text-center border-b border-slate-700`}
                  >
                    <div className="text-7xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {rank.emoji}
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 mb-1">
                      {rank.title}
                    </h4>
                    <p className="text-sm font-semibold text-gray-700">
                      {rank.subtitle}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="p-6">
                    <div className="text-center mb-6 p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-slate-400 text-sm mb-1">স্কোর রেঞ্জ</p>
                      <p
                        className={`text-3xl font-black bg-gradient-to-r ${rank.color} bg-clip-text text-transparent`}
                      >
                        {rank.score}
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      {rank.benefits.map((benefit, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificate Section */}
        <div className="relative group mb-20">
          {/* Glowing Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 opacity-20 group-hover:opacity-30 rounded-2xl blur-xl transition-opacity duration-500"></div>

          <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="text-center mb-12">
                <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-4xl font-black text-white mb-3">
                  সার্টিফিকেশন প্রোগ্রাম
                </h3>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  আপনার যোগ্যতা অনুযায়ী বিভিন্ন ধরনের আন্তর্জাতিক মানের
                  সার্টিফিকেট অর্জন করুন
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {certificateTypes.map((cert, index) => (
                  <div
                    key={index}
                    className="p-6 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-green-500/50 transition-all duration-300 group/cert"
                  >
                    <div className="text-5xl mb-4 group-hover/cert:scale-110 transition-transform">
                      {cert.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">
                      {cert.title}
                    </h4>
                    <p className="text-sm text-slate-400">{cert.description}</p>
                  </div>
                ))}
              </div>

              {/* Certificate Benefits */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-600/30 rounded-xl">
                <p className="text-center text-slate-300">
                  <span className="font-bold text-white">
                    ✓ সার্টিফিকেট সুবিধা:
                  </span>{" "}
                  চাকরির ক্ষেত্রে প্রাধান্য পায় • মূল্য সংযোজন করে CV তে •
                  পেশাদার স্বীকৃতি প্রদান করে • আপনার দক্ষতার প্রমাণ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
