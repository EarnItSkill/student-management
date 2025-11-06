import { Award, BookOpen, Star, Users } from "lucide-react";
import { useState } from "react";

export default function Instructor() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section
      id="instructor"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            আমাদের ইন্সট্রাক্টর
          </h2>
          <p className="text-xl text-slate-300">অভিজ্ঞ এবং দক্ষ প্রশিক্ষক</p>
        </div>

        {/* Main Card */}
        <div className="relative group">
          {/* Glowing Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-20 group-hover:opacity-30 rounded-3xl blur-2xl transition-opacity duration-1000"></div>

          {/* Card */}
          <div className="relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 md:p-12">
              {/* Left: Image Section */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <div className="relative">
                  {/* Decorative Background Shapes */}
                  <div className="absolute top-8 right-8 w-48 h-48 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-15 rounded-3xl transform rotate-45 group-hover:rotate-90 group-hover:scale-110 transition-all duration-700"></div>

                  <div className="absolute -bottom-16 left-4 w-56 h-56 bg-gradient-to-br from-purple-600 to-pink-600 opacity-12 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700"></div>

                  {/* Image */}
                  <div className="relative z-10 w-56 h-72 overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500">
                    <img
                      src="https://avatars.githubusercontent.com/u/31990245?v=4"
                      alt="মো. মোজাম্মেল হক"
                      onLoad={() => setImageLoaded(true)}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        imageLoaded
                          ? "scale-100 opacity-100"
                          : "scale-110 opacity-0"
                      }`}
                    />
                  </div>

                  {/* Badge */}
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                    <Star className="w-4 h-4 fill-white" />
                    শীর্ষ শিক্ষক
                  </div>
                </div>
              </div>

              {/* Right: Content Section */}
              <div className="lg:col-span-3 space-y-8">
                {/* Header */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                    মো. মোজাম্মেল হক
                  </h3>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    প্রধান ইন্সট্রাক্টর
                  </p>
                  <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mt-4"></div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-lg leading-relaxed">
                  ১০+ বছরের অভিজ্ঞতা সম্পন্ন কম্পিউটার প্রশিক্ষক। শত শত
                  শিক্ষার্থীকে সফলভাবে প্রশিক্ষণ দিয়েছেন এবং তাদের ক্যারিয়ার
                  গঠনে সহায়তা করেছেন।
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: Award,
                      value: "10+",
                      label: "বছরের অভিজ্ঞতা",
                      color: "from-blue-600 to-cyan-600",
                    },
                    {
                      icon: Users,
                      value: "500+",
                      label: "সফল শিক্ষার্থী",
                      color: "from-green-600 to-emerald-600",
                    },
                  ].map((stat, idx) => {
                    const IconComponent = stat.icon;
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-slate-700 bg-opacity-50 rounded-xl border border-slate-600 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
                      >
                        <div
                          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} mb-2`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="text-2xl font-black text-white">
                            {stat.value}
                          </div>
                          <p className="text-slate-300 font-semibold text-sm">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <p className="text-slate-400 font-semibold text-sm uppercase tracking-wider">
                    দক্ষতা ও বিশেষত্ব
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        text: "ICT Expert",
                        color: "from-blue-600 to-blue-700",
                      },
                      {
                        text: "MS Office",
                        color: "from-green-600 to-green-700",
                      },
                      {
                        text: "Graphic Design",
                        color: "from-purple-600 to-purple-700",
                      },
                      {
                        text: "Web Development",
                        color: "from-orange-600 to-orange-700",
                      },
                    ].map((skill, idx) => (
                      <div
                        key={idx}
                        className={`px-4 py-2 bg-gradient-to-r ${skill.color} text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-default flex items-center gap-2`}
                      >
                        <BookOpen className="w-4 h-4" />
                        {skill.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
