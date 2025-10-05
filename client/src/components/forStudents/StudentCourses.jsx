import { BookOpen, Calendar, DollarSign, Users } from "lucide-react";
import DashboardLayout from "../../components/common/DashboardLayout";
import { useAppContext } from "../../context/useAppContext";

const StudentCourses = () => {
  const { currentUser, courses, batches, enrollments } = useAppContext();

  // Get student's enrollments
  const myEnrollments = enrollments.filter(
    (e) => e.studentId === currentUser?.id
  );

  // Get student's batches and courses
  const myBatches = myEnrollments.map((enrollment) => {
    const batch = batches.find((b) => b.id === enrollment.batchId);
    const course = courses.find((c) => c.id === batch?.courseId);
    return { ...batch, course, enrollment };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">My Courses</h2>
          <div className="badge badge-primary badge-lg">
            {myBatches.length} Enrolled
          </div>
        </div>

        {myBatches.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Courses Yet</h3>
            <p className="text-gray-500">You haven't enrolled in any courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {myBatches.map((batch) => (
              <div
                key={batch.id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all"
              >
                <figure className="h-48">
                  <img
                    src={batch.course?.image}
                    alt={batch.course?.title}
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h3 className="card-title text-xl">{batch.course?.title}</h3>
                  <p className="text-sm text-gray-600">
                    {batch.course?.description}
                  </p>

                  <div className="divider my-2"></div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Batch:</span>
                      <span>{batch.batchName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Duration:</span>
                      <span>
                        {batch.startDate} to {batch.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Fee:</span>
                      <span>৳{batch.course?.fee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-semibold">Schedule:</span>
                      <span>{batch.schedule}</span>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <div className="badge badge-success">
                      {batch.enrollment?.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentCourses;
