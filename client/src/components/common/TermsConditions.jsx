import { ArrowLeft, CheckCircle, FileText } from "lucide-react";

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-sm gap-2 mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            ফিরে যান
          </button>
          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-bold">শর্তাবলী</h1>
              <p className="text-white/70 text-sm mt-1">
                সেবা ব্যবহারের শর্তাদি
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Last Updated */}
        <div className="mb-8 text-center text-sm text-gray-500">
          শেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}
        </div>

        {/* Section 1 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">১</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">সেবার শর্তাবলী</h2>
              <p className="text-gray-600 leading-relaxed">
                এই প্ল্যাটফর্ম ব্যবহার করে আপনি এই সমস্ত শর্তাবলী মেনে চলতে
                সম্মত হন। যদি আপনি এই শর্তাবলী মেনে না চলতে পারেন তাহলে এই সেবা
                ব্যবহার করবেন না।
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">২</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                ব্যবহারকারী অ্যাকাউন্ট
              </h2>
              <div className="bg-base-100 p-6 rounded-lg space-y-3">
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-gray-600">
                    আপনি সত্যিকারের তথ্য প্রদান করে অ্যাকাউন্ট তৈরি করবেন
                  </p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-gray-600">
                    আপনার পাসওয়ার্ড গোপনীয় রাখা আপনার দায়িত্ব
                  </p>
                </div>
                <div className="flex gap-2">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-gray-600">
                    আপনার অ্যাকাউন্টের সমস্ত কার্যকলাপের জন্য আপনি দায়বদ্ধ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">৩</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">কোর্স এবং কন্টেন্ট</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                আমাদের সমস্ত কোর্স সামগ্রী বৌদ্ধিক সম্পত্তি এবং কপিরাইট দ্বারা
                সুরক্ষিত। আপনি শুধুমাত্র ব্যক্তিগত শিক্ষার জন্য এটি ব্যবহার করতে
                পারেন।
              </p>
              <div className="alert alert-warning">
                <span className="text-sm">
                  ⚠️ অননুমোদিত প্রকাশনা বা বিতরণ কঠোরভাবে নিষিদ্ধ
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">৪</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">
                অর্থ প্রদান এবং রিফান্ড
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-bold">অর্থ প্রদান:</span> সমস্ত মূল্য
                  স্পষ্টভাবে প্রদর্শিত হয় এবং কোন লুকানো খরচ নেই।
                </p>
                <p>
                  <span className="font-bold">রিফান্ড নীতি:</span> এনরোলমেন্ট
                  থেকে ৭ দিনের মধ্যে পূর্ণ অর্থ ফেরত দেওয়া যায়।
                </p>
                <p>
                  <span className="font-bold">ব্যর্থ লেনদেন:</span> প্রযুক্তিগত
                  সমস্যার কারণে টাকা কাটা হলে আমরা তা ফেরত দিই।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">৫</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">নিষিদ্ধ কার্যকলাপ</h2>
              <div className="bg-error/5 p-6 rounded-lg border border-error/20">
                <p className="text-gray-700 mb-4 font-semibold">
                  নিম্নলিখিত কাজ করবেন না:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• অন্যদের অ্যাকাউন্ট হ্যাক বা অননুমোদিত অ্যাক্সেস করা</li>
                  <li>• বিরক্তিকর, অপমানজনক বা হয়রানিমূলক আচরণ</li>
                  <li>• ভাইরাস বা ম্যালওয়্যার ছড়িয়ে দেওয়া</li>
                  <li>• নকল পরিচয় ব্যবহার করা বা জালিয়াতি করা</li>
                  <li>• প্ল্যাটফর্মের প্রযুক্তিগত ব্যবস্থা ভেঙে ফেলা</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">৬</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">শংসাপত্র এবং সমাপ্তি</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                সমস্ত কোর্স সম্পূর্ণ করার পর আপনি শংসাপত্র পাবেন। এই শংসাপত্র
                শুধুমাত্র সাধারণ উদ্দেশ্যে এবং আইনি যোগ্যতার প্রমাণ নয়।
              </p>
              <div className="alert alert-info">
                <span className="text-sm">
                  ℹ️ শংসাপত্র জাল করা বা বিক্রয় করা কঠোর অপরাধ
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">৭</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">দায়বদ্ধতার সীমা</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                আমরা এই প্ল্যাটফর্ম "যেমনি আছে" প্রদান করি। আমরা কোন ওয়ারেন্টি
                দিই না যে সেবা নিরবচ্ছিন্ন বা ত্রুটিমুক্ত হবে।
              </p>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>আমরা দায়বদ্ধ নই:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>কোন তৃতীয় পক্ষের ক্ষতির জন্য</li>
                  <li>ডেটা হারানো বা দুর্ঘটনার জন্য</li>
                  <li>পরোক্ষ বা আনুষঙ্গিক ক্ষতির জন্য</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">৮</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">পরিবর্তন এবং আপডেট</h2>
              <p className="text-gray-600 leading-relaxed">
                আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করি।
                প্রধান পরিবর্তন হলে আমরা ইমেইলের মাধ্যমে বিজ্ঞপ্তি দিই। ক্রমাগত
                ব্যবহার নতুন শর্তাবলী মেনে চলার সম্মতি বোঝায়।
              </p>
            </div>
          </div>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">৯</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">আইনি এবং ম্যানেজমেন্ট</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                এই শর্তাবলী বাংলাদেশের আইন দ্বারা পরিচালিত হয়। যেকোনো বিরোধ
                বাংলাদেশের আদালতে সমাধান করা হবে।
              </p>
              <div className="alert alert-info">
                <span className="text-sm">
                  📋 আমরা সমস্ত প্রযোজনীয় স্থানীয় এবং আন্তর্জাতিক আইন মেনে চলি
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 10 */}
        <section className="mb-12">
          <div className="flex items-start gap-4">
            <div className="badge badge-primary badge-lg">১০</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">যোগাযোগ করুন</h2>
              <p className="text-gray-600 mb-4">
                যদি আপনার কোন প্রশ্ন বা উদ্বেগ থাকে:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-base-100 p-4 rounded-lg">
                  <p className="font-bold text-sm mb-1">ইমেইল</p>
                  <p className="text-gray-600 text-sm">
                    support@education-platform.com
                  </p>
                </div>
                <div className="bg-base-100 p-4 rounded-lg">
                  <p className="font-bold text-sm mb-1">ফোন</p>
                  <p className="text-gray-600 text-sm">+880 1XXX-XXXXXX</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accept Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline flex-1"
          >
            ফিরে যান
          </button>
          <button className="btn btn-primary flex-1">আমি সম্মত</button>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-500 py-4 border-t">
          <p>এই শর্তাবলী বুঝতে অসুবিধা হলে আমাদের সাথে যোগাযোগ করুন।</p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
