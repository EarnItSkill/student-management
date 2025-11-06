import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const contactInfo = [
    {
      id: 1,
      icon: MapPin,
      title: "ঠিকানা",
      value: "হরিশ্চর, লালমাই, কুমিল্লা।",
      color: "from-blue-600 to-cyan-600",
      bgLight: "from-blue-100 to-cyan-50",
    },
    {
      id: 2,
      icon: Mail,
      title: "ইমেইল",
      value: "mrmozammal@gmail.com",
      color: "from-purple-600 to-pink-600",
      bgLight: "from-purple-100 to-pink-50",
    },
    {
      id: 3,
      icon: Phone,
      title: "ফোন",
      value: "+880 1914708856",
      color: "from-green-600 to-emerald-600",
      bgLight: "from-green-100 to-emerald-50",
    },
  ];

  return (
    <section
      id="contact"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
            যোগাযোগ করুন
          </h2>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            যেকোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info) => {
            const IconComponent = info.icon;
            const isHovered = hoveredCard === info.id;

            return (
              <div
                key={info.id}
                onMouseEnter={() => setHoveredCard(info.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="relative group"
              >
                {/* Glowing Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-20 group-hover:opacity-40 rounded-2xl blur-xl transition-opacity duration-500`}
                ></div>

                {/* Card */}
                <div
                  className={`relative bg-slate-800 bg-opacity-80 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 text-center transition-all duration-500 transform ${
                    isHovered
                      ? "translate-y-0 shadow-2xl border-opacity-100"
                      : "translate-y-0"
                  } group-hover:border-opacity-100 group-hover:shadow-2xl`}
                >
                  {/* Icon Container */}
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${
                      info.color
                    } mb-6 transform transition-transform duration-500 ${
                      isHovered ? "scale-110 rotate-6" : "scale-100"
                    }`}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {info.title}
                  </h3>
                  <p
                    className={`text-lg transition-all duration-500 ${
                      isHovered ? "text-white font-semibold" : "text-slate-300"
                    }`}
                  >
                    {info.value}
                  </p>

                  {/* Animated Line */}
                  <div
                    className={`mt-6 h-1 bg-gradient-to-r ${
                      info.color
                    } rounded-full transition-all duration-500 transform ${
                      isHovered ? "w-full" : "w-0"
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
