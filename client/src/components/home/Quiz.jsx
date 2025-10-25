import { Award, Target, TrendingUp, Trophy } from "lucide-react";
export default function Quiz() {
  return (
    <div className="bg-gradient-to-br from-secondary/10 to-accent/10 py-16 -mt-14">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold my-4">MCQ কুইজ সুবিধা</h2>
          <p className="text-gray-400">
            নিয়মিত কুইজের মাধ্যমে নিজের দক্ষতা যাচাই করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body items-center text-center">
              <Award className="w-16 h-16 text-primary mb-4" />
              <h3 className="card-title">নিয়মিত কুইজ</h3>
              <p className="text-sm">
                প্রতিটি ক্লাসের পর MCQ কুইজ দিয়ে নিজের শেখা যাচাই করুন
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body items-center text-center">
              <Trophy className="w-16 h-16 text-warning mb-4" />
              <h3 className="card-title">র‍্যাংকিং সিস্টেম</h3>
              <p className="text-sm">
                ব্যাচে নিজের অবস্থান জানুন এবং প্রথম হওয়ার জন্য প্রতিযোগিতা
                করুন
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body items-center text-center">
              <Target className="w-16 h-16 text-success mb-4" />
              <h3 className="card-title">তাৎক্ষণিক ফলাফল</h3>
              <p className="text-sm">
                কুইজ শেষ হওয়ার সাথে সাথেই ফলাফল এবং সঠিক উত্তর দেখুন
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
            <div className="card-body items-center text-center">
              <TrendingUp className="w-16 h-16 text-info mb-4" />
              <h3 className="card-title">পারফরম্যান্স ট্র্যাকিং</h3>
              <p className="text-sm">
                সময়ের সাথে আপনার উন্নতি দেখুন এবং দুর্বল জায়গা চিহ্নিত করুন
              </p>
            </div>
          </div>
        </div>

        {/* Ranking Example */}
        <div className="card bg-base-100 shadow-2xl mt-12 max-w-4xl mx-auto">
          <div className="card-body">
            <h3 className="card-title text-2xl mb-6 justify-center">
              <Trophy className="w-8 h-8 text-warning" />
              র‍্যাংকিং কিভাবে কাজ করে
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div className="text-4xl">🥇</div>
                <div className="flex-1">
                  <div className="font-bold">১ম স্থান - গোল্ড মেডেল</div>
                  <div className="text-sm text-gray-400">
                    সবচেয়ে বেশি স্কোর অর্জনকারী
                  </div>
                </div>
                <div className="badge badge-warning badge-lg">90%+</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="text-4xl">🥈</div>
                <div className="flex-1">
                  <div className="font-bold">২য় স্থান - সিলভার মেডেল</div>
                  <div className="text-sm text-gray-400">
                    দ্বিতীয় সর্বোচ্চ স্কোর
                  </div>
                </div>
                <div className="badge badge-lg">80%+</div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                <div className="text-4xl">🥉</div>
                <div className="flex-1">
                  <div className="font-bold">৩য় স্থান - ব্রোঞ্জ মেডেল</div>
                  <div className="text-sm text-gray-400">
                    তৃতীয় সর্বোচ্চ স্কোর
                  </div>
                </div>
                <div className="badge badge-accent badge-lg">70%+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
