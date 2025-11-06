import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ClipboardList,
  FileText,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function CourseProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    {
      number: 1,
      title: "অফলাইন ক্লাস",
      subtitle: "ক্লাসরুমে সরাসরি শিক্ষা",
      description:
        "আমাদের অভিজ্ঞ শিক্ষকদের সাথে সরাসরি ইন্টারঅ্যাকশনের মাধ্যমে সম্পূর্ণ কন্টেন্ট শিখুন।",
      benefits: [
        "মাল্টিমিডিয়া ক্লাসরুম",
        "সরাসরি প্রশ্নোত্তর সেশন",
        "হাতে-কলমে শিক্ষা",
        "তাৎক্ষণিক সমস্যার সমাধান",
      ],
      icon: Users,
      color: "from-blue-500 via-blue-600 to-cyan-600",
      lightColor: "from-blue-100 to-cyan-100",
    },
    {
      number: 2,
      title: "অনলাইন কন্টেন্ট",
      subtitle: "একই দিনে ডিজিটাল অ্যাক্সেস",
      description:
        "অফলাইন ক্লাসের সমস্ত কন্টেন্ট, স্লাইড এবং নোটস একই দিনে অনলাইনে উপলব্ধ করা হয়।",
      benefits: [
        "সম্পূর্ণ কন্টেন্ট রেকর্ডিং",
        "ডাউনলোডযোগ্য নোটস",
        "যেকোনো সময় পুনরায় দেখুন",
        "২৪/৭ অ্যাক্সেস",
      ],
      icon: BookOpen,
      color: "from-purple-500 via-purple-600 to-pink-600",
      lightColor: "from-purple-100 to-pink-100",
    },
    {
      number: 3,
      title: "MCQ অনুশীলন",
      subtitle: "১০-১৫টি বহুনির্বাচনী প্রশ্ন",
      description:
        "প্রতিটি ক্লাসের পর আপনার জ্ঞান পরীক্ষা করতে MCQ প্রশ্নের সমাধান করুন।",
      benefits: [
        "তাৎক্ষণিক ফলাফল",
        "সঠিক ও ভুল উত্তর প্রদর্শন",
        "দুর্বল বিষয় চিহ্নিত করুন",
        "নিজের অবস্থান যাচাই করুন",
      ],
      icon: ClipboardList,
      color: "from-green-500 via-green-600 to-emerald-600",
      lightColor: "from-green-100 to-emerald-100",
    },
    {
      number: 4,
      title: "সৃজনশীল প্রশ্ন",
      subtitle: "বোর্ড প্রশ্ন সহ ৮-১০টি",
      description:
        "প্রতি অধ্যায়ের নির্ধারিত ক্লাস শেষে বোর্ড প্রশ্ন এবং সৃজনশীল প্রশ্নের সমাধান নিন।",
      benefits: [
        "বোর্ড পরীক্ষার প্রস্তুতি",
        "দক্ষতা উন্নয়ন",
        "মডেল উত্তরপত্র",
        "বিস্তারিত সমাধান",
      ],
      icon: FileText,
      color: "from-orange-500 via-orange-600 to-amber-600",
      lightColor: "from-orange-100 to-amber-100",
    },
    {
      number: 5,
      title: "চূড়ান্ত পরীক্ষা",
      subtitle: "৫০টি র‍্যান্ডম MCQ",
      description:
        "প্রতি অধ্যায় শেষে ৫০টি র‍্যান্ডম MCQ প্রশ্নের মাধ্যমে সম্পূর্ণ মূল্যায়ন করুন।",
      benefits: [
        "সম্পূর্ণ অধ্যায় কভারেজ",
        "র‍্যাঙ্কিং সিস্টেম",
        "বিস্তারিত বিশ্লেষণ",
        "সার্টিফিকেট প্রাপ্তি",
      ],
      icon: Target,
      color: "from-red-500 via-red-600 to-rose-600",
      lightColor: "from-red-100 to-rose-100",
    },
  ];

  const CurrentIcon = steps[activeStep].icon;
  const currentStep = steps[activeStep];

  return (
    <section
      id="course-process"
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden py-20 relative"
    >
      {/* Animated Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
            <Zap className="w-5 h-5 text-blue-400 animate-bounce" />
            <span className="text-blue-300 font-semibold text-sm">
              আমাদের শিক্ষা পদ্ধতি
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            কোর্স চলার ধাপসমূহ
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            একটি সুসংগঠিত এবং প্রমাণিত শিক্ষা প্রক্রিয়া যা আপনার দক্ষতা বৃদ্ধি
            নিশ্চিত করে
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left - Main Display */}
          <div className="lg:col-span-2">
            <div className="relative group">
              {/* Glowing Border */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${currentStep.color} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`}
              ></div>

              {/* Card */}
              <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
                {/* Icon Container */}
                <div
                  className={`relative h-64 bg-gradient-to-br ${currentStep.color} overflow-hidden`}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -top-24 -right-24 animate-blob"></div>
                    <div className="absolute w-48 h-48 bg-white rounded-full blur-3xl -bottom-24 -left-24 animate-blob animation-delay-4000"></div>
                  </div>

                  {/* Icon */}
                  <div className="relative h-full flex items-center justify-center">
                    <CurrentIcon className="w-48 h-48 text-white/30 animate-float" />
                  </div>

                  {/* Step Number */}
                  <div className="absolute top-6 right-6 flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <span className="text-3xl font-black bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                      {currentStep.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-4xl font-black text-white mb-2">
                      {currentStep.title}
                    </h3>
                    <p
                      className={`text-lg font-semibold bg-gradient-to-r ${currentStep.color} bg-clip-text text-transparent`}
                    >
                      {currentStep.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-300 text-lg leading-relaxed">
                    {currentStep.description}
                  </p>

                  {/* Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {currentStep.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-gradient-to-r ${currentStep.color}`}
                        ></div>
                        <span className="text-slate-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400">শিক্ষা যাত্রা</span>
                <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {activeStep + 1}/{steps.length}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${currentStep.color} transition-all duration-500 rounded-full`}
                  style={{
                    width: `${((activeStep + 1) / steps.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right - Steps Navigation */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = activeStep === index;
              const isCompleted = index < activeStep;

              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  className="w-full text-left group"
                >
                  <div
                    className={`relative p-4 rounded-xl transition-all duration-300 border backdrop-blur-sm ${
                      isActive
                        ? `bg-gradient-to-r ${step.color}/20 border-${
                            step.color.split("-")[1]
                          }-500/50 shadow-lg shadow-${
                            step.color.split("-")[1]
                          }-500/20`
                        : isCompleted
                        ? "bg-slate-700/30 border-slate-600/50"
                        : "bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon Circle */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                          isActive
                            ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                            : isCompleted
                            ? "bg-slate-600 text-green-400"
                            : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <StepIcon className="w-6 h-6" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h4
                          className={`font-bold transition-colors ${
                            isActive ? "text-white" : "text-slate-300"
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p
                          className={`text-sm transition-colors ${
                            isActive ? "text-blue-300" : "text-slate-400"
                          }`}
                        >
                          ধাপ {step.number}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight
                        className={`w-5 h-5 transition-all ${
                          isActive
                            ? "text-white translate-x-1"
                            : "text-slate-500"
                        }`}
                      />
                    </div>
                  </div>
                </button>
              );
            })}

            {/* CTA Button */}
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl group cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:scale-105">
              <h4 className="text-xl font-black text-white mb-2">
                আপনি প্রস্তুত?
              </h4>
              <p className="text-blue-100 text-sm mb-4">
                আজই যোগ দিন এবং শুরু করুন
              </p>
              <button className="w-full bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                এখনই নথিভুক্ত হন
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Indicator Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {steps.map((step, index) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(index)}
              className={`transition-all duration-300 rounded-full ${
                activeStep === index
                  ? `w-12 h-3 bg-gradient-to-r ${step.color} shadow-lg shadow-current`
                  : `w-3 h-3 bg-slate-600 hover:bg-slate-500`
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
