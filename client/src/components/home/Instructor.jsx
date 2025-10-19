export default function Instructor() {
  return (
    <div className="bg-base-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">আমাদের ইন্সট্রাক্টর</h2>
          <p className="text-gray-600">অভিজ্ঞ এবং দক্ষ প্রশিক্ষক</p>
        </div>

        <div className="card lg:card-side bg-gradient-to-br from-primary/10 to-secondary/10 shadow-2xl max-w-4xl mx-auto">
          <figure className="lg:w-1/3">
            <img
              src="https://avatars.githubusercontent.com/u/31990245?v=4"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </figure>
          <div className="card-body lg:w-2/3">
            <h2 className="card-title text-3xl">মো. মোজাম্মেল হক</h2>
            <p className="text-xl text-primary font-semibold">
              প্রধান ইন্সট্রাক্টর
            </p>

            <div className="divider"></div>

            <div className="space-y-4">
              <p className="text-gray-700">
                ১০+ বছরের অভিজ্ঞতা সম্পন্ন কম্পিউটার প্রশিক্ষক। শত শত
                শিক্ষার্থীকে সফলভাবে প্রশিক্ষণ দিয়েছেন এবং তাদের ক্যারিয়ার
                গঠনে সহায়তা করেছেন।
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="stat bg-base-100 rounded-lg shadow">
                  <div className="stat-value text-primary">10+</div>
                  <div className="stat-title">বছরের অভিজ্ঞতা</div>
                </div>
                <div className="stat bg-base-100 rounded-lg shadow">
                  <div className="stat-value text-success">500+</div>
                  <div className="stat-title">সফল শিক্ষার্থী</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="badge badge-primary">ICT Expert</div>
                <div className="badge badge-secondary">MS Office</div>
                <div className="badge badge-accent">Graphic Design</div>
                <div className="badge badge-info">Web Development</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
