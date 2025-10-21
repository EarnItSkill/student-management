// import { BookOpen, GraduationCap } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function Slider() {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const heroSlides = [
//     {
//       title: "স্বাগতম আমাদের ট্রেনিং সেন্টারে!",
//       subtitle:
//         "মানসম্মত শিক্ষা এবং প্রশিক্ষণের মাধ্যমে আপনার ক্যারিয়ার গড়ুন",
//       gradient: "from-primary to-secondary",
//     },
//     {
//       title: "আধুনিক কম্পিউটার শিক্ষা",
//       subtitle: "হাতে-কলমে প্রশিক্ষণ এবং বাস্তব প্রজেক্ট অভিজ্ঞতা",
//       gradient: "from-secondary to-accent",
//     },
//     {
//       title: "সফলতার পথে এগিয়ে যান",
//       subtitle: "অভিজ্ঞ শিক্ষক এবং আধুনিক পরিবেশে শিখুন",
//       gradient: "from-accent to-primary",
//     },
//   ];
//   // Hero Slider Auto Play
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % 3);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <>
//       <div className="relative overflow-hidden ">
//         <div className="carousel w-full h-[70vh]">
//           {heroSlides.map((slide, index) => (
//             <div
//               key={index}
//               className={`carousel-item w-full transition-all duration-500 ${
//                 currentSlide === index ? "opacity-100" : "opacity-0 absolute"
//               }`}
//             >
//               <div
//                 className={`hero w-full h-[70vh] bg-gradient-to-r ${slide.gradient}`}
//               >
//                 <div className="hero-content text-center text-white">
//                   <div className="max-w-3xl">
//                     <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
//                       {slide.title}
//                     </h1>
//                     <p className="text-xl md:text-2xl mb-8 animate-slide-up">
//                       {slide.subtitle}
//                     </p>
//                     <div className="flex gap-4 justify-center animate-slide-up">
//                       <Link to="/login" className="btn btn-accent btn-lg gap-2">
//                         <GraduationCap className="w-5 h-5" />
//                         এখনই শুরু করুন
//                       </Link>
//                       <a
//                         href="#courses"
//                         className="btn btn-outline btn-lg text-white hover:bg-white hover:text-primary gap-2"
//                       >
//                         <BookOpen className="w-5 h-5" />
//                         কোর্স দেখুন
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Slider Indicators */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
//           {heroSlides.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentSlide(index)}
//               className={`w-3 h-3 rounded-full transition-all ${
//                 currentSlide === index ? "bg-white w-8" : "bg-white/50"
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

import { BookOpen, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      title: "স্বাগতম আমাদের ট্রেনিং সেন্টারে!",
      subtitle:
        "মানসম্মত শিক্ষা এবং প্রশিক্ষণের মাধ্যমে আপনার ক্যারিয়ার গড়ুন",
      // Placeholder image for Classroom/Learning
      imageUrl:
        "https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvd2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
    },
    {
      title: "আধুনিক কম্পিউটার শিক্ষা",
      subtitle: "হাতে-কলমে প্রশিক্ষণ এবং বাস্তব প্রজেক্ট অভিজ্ঞতা",
      // Placeholder image for Coding/Tech
      imageUrl:
        "https://plus.unsplash.com/premium_photo-1663051138877-c6471214ae11?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGNvbXB1dGVyJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    },
    {
      title: "ICT: এইচ.এস.সি, আলিম",
      subtitle: "কোর কনসেপ্ট নিয়ে অন্য লেভেলের অভিজ্ঞতা",
      // Placeholder image for Coding/Tech
      imageUrl: "https://i.ibb.co.com/FqnDS4vP/ict-slider.jpg",
    },
    {
      title: "সফলতার পথে এগিয়ে যান",
      subtitle: "অভিজ্ঞ শিক্ষক এবং আধুনিক পরিবেশে শিখুন",
      // Placeholder image for Success/Achievement
      imageUrl:
        "https://images.unsplash.com/photo-1620217952841-4f8709913a2f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbXB1dGVyJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
    },
  ];

  // Hero Slider Auto Play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="relative overflow-hidden w-full h-[75vh] sm:h-[85vh]">
      <style>{`
        /* Custom Keyframes for Text Animation */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Custom Keyframes for Ken Burns Effect (Subtle Zoom) */
        @keyframes ken-burns {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.07); }
        }

        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 1.0s ease-out forwards;
        }
        .ken-burns-effect {
          animation: ken-burns 5s linear infinite alternate; /* Animates the image slightly over the slide duration */
        }
      `}</style>

      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out`}
            style={{
              transform: `translateX(${(index - currentSlide) * 10 * 0}%)`,
              // Ensures only the current slide is interactive/visible for screen readers
              visibility: currentSlide === index ? "visible" : "hidden",
            }}
          >
            {/* Image Container with Ken Burns Effect */}
            <div
              className={`hero w-full h-full relative bg-cover bg-center`}
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
              }}
            >
              {/* Image Transform Layer for Zoom Effect */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out ${
                  currentSlide === index ? "ken-burns-effect" : ""
                }`}
                style={{
                  backgroundImage: `url(${slide.imageUrl})`,
                  // Reset scale when slide changes to make the zoom start again
                  transform:
                    currentSlide === index ? "scale(1)" : "scale(1.07)",
                }}
              ></div>

              {/* Professional Dark Overlay for Text Contrast */}
              <div className="absolute inset-0 bg-gray-900 opacity-70"></div>

              <div className="hero-content relative z-10 text-center text-white p-6 sm:p-12">
                <div className="max-w-4xl">
                  <h1
                    key={slide.title} // Key change forces re-render and re-animation
                    className="text-4xl sm:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight drop-shadow-lg"
                    style={{ animationDelay: "0.1s" }} // Staggering effect
                  >
                    {slide.title}
                  </h1>
                  <p
                    key={slide.subtitle}
                    className="text-lg sm:text-2xl mb-8 sm:mb-10 font-light drop-shadow-md"
                    style={{ animationDelay: "0.3s" }}
                  >
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() =>
                        document
                          .getElementById("courses")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                      className="flex items-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow-2xl hover:bg-gray-200 transition duration-300 transform hover:scale-105 ring-2 ring-white ring-offset-2 ring-offset-gray-900/10"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      কোর্স দেখুন
                    </button>
                    <button
                      onClick={() =>
                        document
                          .getElementById("contact")
                          .scrollIntoView({ behavior: "smooth" })
                      }
                      className="flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-800 transition duration-300 transform hover:scale-105"
                    >
                      <GraduationCap className="w-5 h-5 mr-2" />
                      যোগাযোগ করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-8 top-1/2 -translate-y-1/2 rotate-90 -left-24 flex gap-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 border-white ${
              currentSlide === index
                ? "bg-white w-8"
                : "bg-transparent hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
