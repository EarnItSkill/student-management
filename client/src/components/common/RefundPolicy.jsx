import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  RefreshCw,
} from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-white ">
        <div className="max-w-3xl mx-auto px-6 py-10 flex item-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="btn btn-ghost btn-sm gap-2 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            ফিরে যান
          </button>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-10 h-10" />
            <h1 className="text-3xl font-bold">রিফান্ড পলিসি</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Quick Summary */}
        <div className="card bg-success/10 border-2 border-success mb-8">
          <div className="card-body">
            <h2 className="card-title text-success mb-3">দ্রুত সারসংক্ষেপ</h2>
            <p className="text-gray-400">
              এনরোলমেন্ট থেকে <span className="font-bold">৭ দিনের মধ্যে</span>{" "}
              সম্পূর্ণ রিফান্ড পাবেন। এর পরে কোন রিফান্ড নেই।
            </p>
          </div>
        </div>

        {/* Main Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="text-xl font-bold">
                  ৭ দিনের মানি-ব্যাক গ্যারান্টি
                </h3>
              </div>
              <p className="text-gray-500 ml-9">
                কোর্স এনরোলমেন্ট থেকে ৭ দিনের মধ্যে যেকোনো কারণে সম্পূর্ণ অর্থ
                ফেরত পাওয়া যায়।
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h3 className="text-xl font-bold">রিফান্ড পাওয়ার শর্ত</h3>
              </div>
              <div className="ml-9 space-y-2">
                <div className="flex gap-2">
                  <span className="badge badge-sm">✓</span>
                  <span className="text-gray-600">
                    এনরোলমেন্টের ৭ দিনের মধ্যে আবেদন করতে হবে
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-sm">✓</span>
                  <span className="text-gray-600">
                    বৈধ ইমেইল এবং অ্যাকাউন্ট তথ্য থাকতে হবে
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-sm">✓</span>
                  <span className="text-gray-600">
                    আবেদনের সময় সিদ্ধান্ত নিতে হবে
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4">রিফান্ড প্রক্রিয়া</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="badge badge-lg badge-primary">১</div>
                  <div>
                    <p className="font-bold">রিফান্ড আবেদন করুন</p>
                    <p className="text-sm text-gray-600">
                      সাপোর্টে যোগাযোগ করে রিফান্ড চাইলে আবেদন সম্পন্ন হয়
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="badge badge-lg badge-primary">২</div>
                  <div>
                    <p className="font-bold">যাচাই করা হয়</p>
                    <p className="text-sm text-gray-600">
                      আমরা আপনার অ্যাকাউন্ট এবং লেনদেন যাচাই করি
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="badge badge-lg badge-primary">৩</div>
                  <div>
                    <p className="font-bold">অনুমোদিত হয়</p>
                    <p className="text-sm text-gray-600">
                      যাচাইয়ের পর রিফান্ড অনুমোদিত হয়
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="badge badge-lg badge-primary">৪</div>
                  <div>
                    <p className="font-bold">অর্থ ফেরত পান</p>
                    <p className="text-sm text-gray-600">
                      ৫-৭ কর্মদিবসের মধ্যে অর্থ ফেরত আসে
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4">রিফান্ড যোগ্য নয়</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-error">✕</span>
                  <span className="text-gray-600">৭ দিনের পর যোগাযোগ করলে</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-error">✕</span>
                  <span className="text-gray-600">কোর্স সম্পূর্ণ করার পর</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-error">✕</span>
                  <span className="text-gray-600">
                    বেশি অর্ধেক কন্টেন্ট দেখার পর
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-error">✕</span>
                  <span className="text-gray-600">
                    অ্যাকাউন্ট সাস্পেন্ড হলে
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="card bg-warning/10 border-2 border-warning shadow">
            <div className="card-body">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" />
                <h3 className="text-xl font-bold text-warning">
                  গুরুত্বপূর্ণ নোট
                </h3>
              </div>
              <ul className="ml-9 space-y-2 text-gray-400">
                <li>
                  • রিফান্ড একই অ্যাকাউন্টে ফেরত আসে যেখান থেকে পেমেন্ট করা
                  হয়েছে
                </li>
                <li>• ব্যাংক ফি বা চার্জ আমরা দায়বদ্ধ নই</li>
                <li>
                  • একবার রিফান্ড দেওয়া হলে সেই কোর্স আর এক্সেস করতে পারবেন না
                </li>
                <li>• ডুপ্লিকেট পেমেন্টের জন্য যোগাযোগ করতে হবে</li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4">বিশেষ ক্ষেত্রে রিফান্ড</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-bold mb-1">প্রযুক্তিগত সমস্যা</p>
                  <p className="text-sm text-gray-600">
                    যদি আপনি কোর্স এক্সেস করতে পারেন না তাহলে সম্পূর্ণ রিফান্ড
                    পাবেন
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1">ডুপ্লিকেট চার্জ</p>
                  <p className="text-sm text-gray-600">
                    একই কোর্সে দুইবার অর্থ কাটা হলে অতিরিক্ত টাকা ফেরত দেওয়া
                    হয়
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1">কোর্স বাতিল</p>
                  <p className="text-sm text-gray-600">
                    যদি কোর্স বাতিল করা হয় তাহলে সম্পূর্ণ রিফান্ড পাবেন
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="card bg-primary/10 border-2 border-primary shadow">
            <div className="card-body">
              <h3 className="text-xl font-bold mb-4">সাপোর্টে যোগাযোগ করুন</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-bold">ইমেইল:</span>{" "}
                  support@education-platform.com
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">ফোন:</span> +880 1XXX-XXXXXX
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  রিফান্ড সম্পর্কে কোন প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 mb-8">
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline flex-1"
          >
            ফিরে যান
          </button>
          <button className="btn btn-primary flex-1">আমি বুঝেছি</button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 py-4">
          <p>শেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}</p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
