import { ArrowLeft, Mail, MapPin, Phone, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-sm gap-2 mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            ফিরে যান
          </button>
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">গোপনীয়তা নীতি</h1>
              <p className="text-white/80 mt-2">
                আপনার তথ্য সুরক্ষা আমাদের অগ্রাধিকার
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Last Updated */}
            <div className="alert alert-info mb-8">
              <span>
                📅 শেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}
              </span>
            </div>

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ১. পরিচয়
              </h2>
              <p className="text-gray-600 mb-4">
                আমাদের অনলাইন শিক্ষা প্ল্যাটফর্ম আপনার ব্যক্তিগত তথ্যের
                গোপনীয়তা রক্ষায় প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা
                করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি।
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ২. আমরা কী তথ্য সংগ্রহ করি?
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-2">✓ ব্যক্তিগত তথ্য</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>নাম, ইমেইল এবং ফোন নম্বর</li>
                    <li>শিক্ষার্থী আইডি এবং এনরোলমেন্ট তথ্য</li>
                    <li>ঠিকানা এবং লিঙ্গ তথ্য</li>
                    <li>প্রোফাইল ছবি</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    ✓ শিক্ষা সংক্রান্ত তথ্য
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>কোর্স এনরোলমেন্ট এবং অগ্রগতি</li>
                    <li>কুইজ ফলাফল এবং স্কোর</li>
                    <li>উপস্থিতি রেকর্ড</li>
                    <li>পেমেন্ট ও লেনদেন তথ্য</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">✓ প্রযুক্তিগত তথ্য</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>IP ঠিকানা এবং ডিভাইস তথ্য</li>
                    <li>ব্রাউজার ধরন এবং সংস্করণ</li>
                    <li>কুকিজ এবং ট্র্যাকিং তথ্য</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ৩. তথ্য কীভাবে ব্যবহার করা হয়?
              </h2>
              <div className="bg-base-200 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="badge badge-primary">✓</span>
                    <span>আপনার অ্যাকাউন্ট তৈরি এবং পরিচালনা করতে</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="badge badge-primary">✓</span>
                    <span>শিক্ষা সেবা প্রদান এবং উন্নত করতে</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="badge badge-primary">✓</span>
                    <span>পেমেন্ট প্রক্রিয়াকরণ এবং বিলিং এর জন্য</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="badge badge-primary">✓</span>
                    <span>গুরুত্বপূর্ণ আপডেট এবং সতর্কতা পাঠাতে</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="badge badge-primary">✓</span>
                    <span>গ্রাহক সেবা এবং সহায়তা প্রদান করতে</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="badge badge-primary">✓</span>
                    <span>জালিয়াতি রোধ এবং নিরাপত্তা নিশ্চিত করতে</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ৪. তথ্য শেয়ারিং
              </h2>
              <p className="text-gray-600 mb-4">
                আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না, কেবল
                নিম্নলিখিত ক্ষেত্রে ছাড়া:
              </p>
              <div className="alert alert-warning">
                <ul className="list-disc list-inside text-sm">
                  <li>আইনি প্রয়োজনীয়তা পূরণের জন্য</li>
                  <li>পেমেন্ট গেটওয়ে পার্টনারদের সাথে</li>
                  <li>আপনার স্পষ্ট সম্মতি সহ অন্যান্য সেবার জন্য</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ৫. ডেটা নিরাপত্তা
              </h2>
              <p className="text-gray-600 mb-4">
                আমরা আপনার তথ্য রক্ষায় নিম্নোক্ত ব্যবস্থা গ্রহণ করি:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-primary/10 border border-primary">
                  <div className="card-body p-4">
                    <h4 className="font-bold text-primary">🔒 এনক্রিপশন</h4>
                    <p className="text-sm">
                      সকল সংবেদনশীল তথ্য এনক্রিপ্ট করা হয়
                    </p>
                  </div>
                </div>
                <div className="card bg-secondary/10 border border-secondary">
                  <div className="card-body p-4">
                    <h4 className="font-bold text-secondary">🛡️ ফায়ারওয়াল</h4>
                    <p className="text-sm">
                      অ্যাডভান্সড ফায়ারওয়াল সুরক্ষা ব্যবহার করা হয়
                    </p>
                  </div>
                </div>
                <div className="card bg-success/10 border border-success">
                  <div className="card-body p-4">
                    <h4 className="font-bold text-success">✓ নিয়মিত অডিট</h4>
                    <p className="text-sm">নিরাপত্তা পরীক্ষা নিয়মিত করা হয়</p>
                  </div>
                </div>
                <div className="card bg-warning/10 border border-warning">
                  <div className="card-body p-4">
                    <h4 className="font-bold text-warning">
                      🔑 অ্যাক্সেস নিয়ন্ত্রণ
                    </h4>
                    <p className="text-sm">
                      সীমিত অ্যাক্সেস নিয়ন্ত্রণ ব্যবস্থা
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ৬. আপনার অধিকার
              </h2>
              <p className="text-gray-600 mb-4">
                আপনার নিম্নোক্ত অধিকার রয়েছে:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-2">
                  <span className="badge badge-lg">✓</span>
                  <span>আপনার তথ্য অ্যাক্সেস করার অধিকার</span>
                </li>
                <li className="flex gap-2">
                  <span className="badge badge-lg">✓</span>
                  <span>ভুল তথ্য সংশোধন করার অধিকার</span>
                </li>
                <li className="flex gap-2">
                  <span className="badge badge-lg">✓</span>
                  <span>আপনার অ্যাকাউন্ট মুছে ফেলার অধিকার</span>
                </li>
                <li className="flex gap-2">
                  <span className="badge badge-lg">✓</span>
                  <span>মার্কেটিং বার্তা থেকে অপ্ট-আউট করার অধিকার</span>
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ৭. কুকিজ ব্যবহার
              </h2>
              <p className="text-gray-600">
                আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকিজ ব্যবহার করি। আপনি আপনার
                ব্রাউজার সেটিংসে কুকিজ অক্ষম করতে পারেন।
              </p>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                ৮. নীতি পরিবর্তন
              </h2>
              <p className="text-gray-600">
                আমরা এই নীতি যেকোনো সময় পরিবর্তন করতে পারি। উল্লেখযোগ্য
                পরিবর্তন হলে আমরা ইমেইলের মাধ্যমে আপনাকে অবহিত করব।
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-base-200 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                ৯. আমাদের সাথে যোগাযোগ করুন
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold">ইমেইল</p>
                    <p className="text-gray-600">
                      privacy@education-platform.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold">ফোন</p>
                    <p className="text-gray-600">+880 1XXX-XXXXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold">ঠিকানা</p>
                    <p className="text-gray-600">ঢাকা, বাংলাদেশ</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Accept Button */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => window.history.back()}
                className="btn btn-outline flex-1"
              >
                ফিরে যান
              </button>
              <button className="btn btn-primary flex-1">
                আমি বুঝেছি ও সম্মত
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
