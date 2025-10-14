import { BookOpen, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      title: "স্বাগতম আমাদের ট্রেনিং সেন্টারে!",
      subtitle:
        "মানসম্মত শিক্ষা এবং প্রশিক্ষণের মাধ্যমে আপনার ক্যারিয়ার গড়ুন",
      gradient: "from-primary to-secondary",
    },
    {
      title: "আধুনিক কম্পিউটার শিক্ষা",
      subtitle: "হাতে-কলমে প্রশিক্ষণ এবং বাস্তব প্রজেক্ট অভিজ্ঞতা",
      gradient: "from-secondary to-accent",
    },
    {
      title: "সফলতার পথে এগিয়ে যান",
      subtitle: "অভিজ্ঞ শিক্ষক এবং আধুনিক পরিবেশে শিখুন",
      gradient: "from-accent to-primary",
    },
  ];
  // Hero Slider Auto Play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="relative overflow-hidden ">
        <div className="carousel w-full h-[70vh]">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-item w-full transition-all duration-500 ${
                currentSlide === index ? "opacity-100" : "opacity-0 absolute"
              }`}
            >
              <div
                className={`hero w-full h-[70vh] bg-gradient-to-r ${slide.gradient}`}
              >
                <div className="hero-content text-center text-white">
                  <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 animate-slide-up">
                      {slide.subtitle}
                    </p>
                    <div className="flex gap-4 justify-center animate-slide-up">
                      <Link to="/login" className="btn btn-accent btn-lg gap-2">
                        <GraduationCap className="w-5 h-5" />
                        এখনই শুরু করুন
                      </Link>
                      <a
                        href="#courses"
                        className="btn btn-outline btn-lg text-white hover:bg-white hover:text-primary gap-2"
                      >
                        <BookOpen className="w-5 h-5" />
                        কোর্স দেখুন
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? "bg-white w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
