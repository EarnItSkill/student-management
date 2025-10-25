import {
  Award,
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileText,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function CourseProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: "অফলাইন ক্লাস",
      subtitle: "ক্লাসরুমে সরাসরি শিক্ষা",
      description:
        "আমাদের অভিজ্ঞ শিক্ষকদের সাথে সরাসরি ইন্টারঅ্যাকশনের মাধ্যমে সম্পূর্ণ কন্টেন্ট শিখুন।",
      benefits: [
        "মাল্টিমিডিয়া ক্লাসরুম",
        "সরাসরি প্রশ্নোত্তর সেশন",
        "হাতে-কলমে শিক্ষা",
        "তাৎক্ষণিক সমস্যার সমাধান",
      ],
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgLight: "from-blue-100 to-cyan-50",
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
      ],
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      bgLight: "from-purple-100 to-pink-50",
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
      color: "from-green-500 to-emerald-500",
      bgLight: "from-green-100 to-emerald-50",
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
      ],
      icon: FileText,
      color: "from-orange-500 to-amber-500",
      bgLight: "from-orange-100 to-amber-50",
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
        "সম্পূর্ণ অধ্যায় ধারণা",
      ],
      icon: Target,
      color: "from-red-500 to-rose-500",
      bgLight: "from-red-100 to-rose-50",
    },
  ];

  const CurrentIcon = steps[activeStep].icon;
  const currentStep = steps[activeStep];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-base-50 to-base-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="badge badge-primary badge-lg gap-2">
              <Zap className="w-4 h-4" />
              আমাদের শিক্ষা পদ্ধতি
            </span>
          </div>
          <h2 className="py-3 text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            কোর্স চলার ধাপসমূহ
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            একটি সুসংগঠিত এবং প্রমাণিত শিক্ষা প্রক্রিয়া যা আপনার দক্ষতা বৃদ্ধি
            নিশ্চিত করে।
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Left Side - Image & Info */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 space-y-6">
              {/* Large Visual Card */}
              <div
                className={`card bg-gradient-to-br ${currentStep.bgLight} shadow-2xl border-2 border-base-200 overflow-hidden group`}
              >
                <div
                  className={`h-72 bg-gradient-to-br ${currentStep.color} flex items-center justify-center relative overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute w-40 h-40 bg-white rounded-full blur-3xl top-10 -right-20"></div>
                    <div className="absolute w-40 h-40 bg-white rounded-full blur-3xl -bottom-20 -left-10"></div>
                  </div>

                  {/* Icon */}
                  <CurrentIcon className="w-40 h-40 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                </div>

                <div className="card-body p-8">
                  <div className="mb-4">
                    <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-bold">
                      ধাপ {currentStep.number}
                    </div>
                  </div>

                  <h3 className="text-3xl font-bold mb-2 text-gray-800">
                    {currentStep.title}
                  </h3>
                  <p className="text-sm text-primary font-semibold mb-4">
                    {currentStep.subtitle}
                  </p>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {currentStep.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3">
                    {currentStep.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentStep.color}`}
                        ></div>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="card bg-base-100 shadow-lg border border-base-200">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-gray-700">অগ্রগতি</p>
                    <span className="text-sm font-bold text-primary">
                      {activeStep + 1}/{steps.length}
                    </span>
                  </div>

                  <div className="w-full bg-base-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${currentStep.color} transition-all duration-500 rounded-full`}
                      style={{
                        width: `${((activeStep + 1) / steps.length) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex gap-1 mt-4">
                    {steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          idx <= activeStep
                            ? `bg-gradient-to-r ${steps[idx].color}`
                            : "bg-base-300"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Scrollable Steps */}
          <div className="lg:col-span-3">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = activeStep === index;
                const isCompleted = index < activeStep;

                return (
                  <div
                    key={step.number}
                    onClick={() => setActiveStep(index)}
                    className={`relative cursor-pointer transition-all duration-300 group`}
                  >
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-7 top-20 w-0.5 h-12 transition-colors ${
                          isCompleted || isActive
                            ? `bg-gradient-to-b ${step.color}`
                            : "bg-base-300"
                        }`}
                      ></div>
                    )}

                    {/* Card */}
                    <div
                      className={`card shadow-md transition-all duration-300 border-2 ms-1   my-3 ${
                        isActive
                          ? `bg-gradient-to-r ${step.bgLight} border-transparent ring-2 ring-offset-2 ring-primary shadow-xl origin-left`
                          : isCompleted
                          ? `bg-base-100 border-base-300 hover:shadow-lg`
                          : `bg-gray-800 border-base-200 hover:shadow-lg hover:border-base-300`
                      }`}
                    >
                      <div className="card-body p-6">
                        <div className="flex items-start gap-4">
                          {/* Number Circle */}
                          <div
                            className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                              isActive
                                ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                                : isCompleted
                                ? `bg-base-200 text-primary`
                                : `bg-gray-600 text-gray-300 group-hover:bg-base-300`
                            }`}
                          >
                            {isCompleted ? (
                              <Award className="w-6 h-6" />
                            ) : (
                              step.number
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h5
                                  className={`text-lg font-bold mb-1 transition-colors ${
                                    isActive ? `text-gray-900` : "text-gray-100"
                                  }`}
                                >
                                  {step.title}
                                </h5>
                                <p
                                  className={`text-sm mb-2 transition-colors ${
                                    isActive
                                      ? `text-primary font-semibold`
                                      : "text-gray-300"
                                  }`}
                                >
                                  {step.subtitle}
                                </p>
                              </div>
                              <ChevronRight
                                className={`flex-shrink-0 w-5 h-5 transition-all ${
                                  isActive
                                    ? "text-primary rotate-90"
                                    : "text-gray-400"
                                }`}
                              />
                            </div>

                            {/* Expanded Content */}
                            {isActive && (
                              <div className="mt-4 pt-4 border-t-2 border-gray-200 animate-in fade-in duration-300">
                                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                                  {step.description}
                                </p>
                                <div className="space-y-2">
                                  {step.benefits.map((benefit, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <div
                                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${step.color}`}
                                      ></div>
                                      <span className="text-xs text-gray-400">
                                        {benefit}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Card */}
            <div className="mt-8 card bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute w-40 h-40 bg-white rounded-full blur-3xl top-1/2 -right-20 opacity-20"></div>
              </div>

              <div className="card-body relative z-10">
                <h4 className="text-2xl font-bold mb-2">আপনি প্রস্তুত?</h4>
                <p className="text-sm opacity-90 mb-4">
                  আজই যোগ দিন এবং আপনার শিক্ষা যাত্রা শুরু করুন
                </p>
                <button className="btn btn-neutral gap-2 w-full group">
                  এখনই নথিভুক্ত হন
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {steps.map((step, index) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(index)}
              className={`transition-all duration-300 rounded-full ${
                activeStep === index
                  ? `w-6 h-3 bg-gradient-to-r ${step.color}`
                  : `w-3 h-3 bg-base-300 hover:bg-base-400`
              }`}
              title={step.title}
            />
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
}
