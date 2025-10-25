import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileText,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function CourseProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: "অফলাইন ক্লাস",
      description: "আমাদের ক্লাসরুমে সরাসরি ক্লাসে অংশগ্রহণ করুন",
      details: "সম্পূর্ণ কন্টেন্ট ও ব্যাখ্যা সহ লাইভ ক্লাসে অংশগ্রহণ করুন",
      icon: Users,
      color: "from-blue-400 to-blue-600",
    },
    {
      number: 2,
      title: "অনলাইন ক্লাস আনলক",
      description: "একই দিনে অনলাইন কন্টেন্ট উপলব্ধ হবে",
      details: "অফলাইন ক্লাসের সমস্ত কন্টেন্ট একই তারিখে অনলাইনে আপলোড হবে",
      icon: BookOpen,
      color: "from-purple-400 to-purple-600",
    },
    {
      number: 3,
      title: "MCQ পরীক্ষা (১০-১৫ টি)",
      description: "ক্লাস ভিত্তিক অনুশীলন প্রশ্ন",
      details:
        "প্রতিটি ক্লাসের পর ১০-১৫ টি MCQ প্রশ্ন দিয়ে জ্ঞান পরীক্ষা করুন",
      icon: ClipboardList,
      color: "from-green-400 to-green-600",
    },
    {
      number: 4,
      title: "সৃজনশীল প্রশ্ন (৮-১০ টি)",
      description: "বোর্ড প্রশ্ন সহ বিস্তৃত সমাধান",
      details:
        "প্রতি অধ্যায়ের নির্ধারিত ক্লাস শেষে বোর্ড প্রশ্ন ও সৃজনশীল প্রশ্নের সমাধান",
      icon: FileText,
      color: "from-orange-400 to-orange-600",
    },
    {
      number: 5,
      title: "চূড়ান্ত পরীক্ষা (৫০ MCQ)",
      description: "অধ্যায় শেষে র‍্যান্ডম প্রশ্ন",
      details:
        "প্রতি অধ্যায়ের সমাপ্তিতে ৫০ টি র‍্যান্ডম MCQ প্রশ্নের পরীক্ষা নিন",
      icon: Target,
      color: "from-violet-400 to-violet-600",
    },
  ];

  const CurrentIcon = steps[activeStep].icon;

  return (
    <section className="py-20 bg-gradient-to-b from-base-100 to-base-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            কোর্স চলার ধাপসমূহ
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-6 text-lg">
            আমাদের সুসংগঠিত শিক্ষা প্রক্রিয়া অনুসরণ করে আপনার দক্ষতা বৃদ্ধি
            করুন
          </p>
        </div>

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Image & Title */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              {/* Image Area */}
              <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl overflow-hidden mb-6">
                <div
                  className={`h-64 bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center`}
                >
                  <CurrentIcon className="w-32 h-32 text-white opacity-90" />
                </div>
                <div className="card-body">
                  <h3 className="text-3xl font-bold text-primary mb-2">
                    ধাপ {steps[activeStep].number}
                  </h3>
                  <h4 className="text-2xl font-bold mb-3">
                    {steps[activeStep].title}
                  </h4>
                  <p className="text-gray-400 text-lg">
                    {steps[activeStep].details}
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <p className="text-sm text-gray-400 mb-3">অগ্রগতি</p>
                  <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full transition-all duration-500"
                      style={{
                        width: `${((activeStep + 1) / steps.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-3">
                    {activeStep + 1} এর {steps.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Scrollable Steps */}
          <div className="lg:col-span-3">
            <div className="space-y-4 max-h-96 overflow-y-auto px-6 py-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = activeStep === index;

                return (
                  <div
                    key={step.number}
                    onClick={() => setActiveStep(index)}
                    className={`card shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                      isActive
                        ? `bg-gradient-to-r ${step.color} text-white ring-2 ring-offset-2 ring-white`
                        : "bg-base-100 hover:shadow-xl"
                    }`}
                  >
                    <div className="card-body p-6">
                      <div className="flex items-start gap-4">
                        {/* Number Circle */}
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                            isActive
                              ? "bg-white bg-opacity-30 text-gray-700"
                              : `bg-gradient-to-br ${step.color} text-white`
                          }`}
                        >
                          {step.number}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h5
                            className={`text-lg font-bold mb-1 ${
                              isActive ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {step.title}
                          </h5>
                          <p
                            className={`text-sm ${
                              isActive
                                ? "text-white opacity-90"
                                : "text-gray-400"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>

                        {/* Arrow Icon */}
                        <div className="flex-shrink-0">
                          {isActive ? (
                            <StepIcon
                              className={`w-6 h-6 ${
                                isActive ? "text-white" : "text-gray-400"
                              }`}
                            />
                          ) : (
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isActive && (
                        <div className="mt-4 pt-4 border-t border-white border-opacity-30">
                          <p className="text-sm leading-relaxed opacity-95">
                            {step.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 card bg-gradient-to-r from-primary to-secondary text-white shadow-xl">
              <div className="card-body">
                <p className="text-lg font-semibold mb-2">প্রস্তুত হয়েছেন?</p>
                <p className="text-sm opacity-90 mb-4">
                  আজই যোগ দিন এবং আপনার শিক্ষা যাত্রা শুরু করুন
                </p>
                <button className="btn btn-sm btn-neutral gap-2">
                  এখনই শুরু করুন
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {steps.map((step, index) => (
            <button
              key={step.number}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === index
                  ? "bg-primary w-8"
                  : "bg-base-300 hover:bg-base-400"
              }`}
              title={step.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
