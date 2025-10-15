import { Edit, FileText, Image as ImageIcon, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import { parseSpecialToJSX } from "../../utils/parseSpecialToJSX";

const CqDetailModal = ({ cq, onClose }) => {
  const navigate = useNavigate();
  const { deleteCqQuestion } = useAppContext();

  const handleEdit = () => {
    navigate(`/dashboard/admin/cq/edit/${cq._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this CQ question?")) {
      try {
        await deleteCqQuestion(cq._id);
        onClose();
      } catch (error) {
        alert("Failed to delete CQ question", { error });
      }
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b sticky top-0 bg-base-100 z-10">
          <div>
            <h3 className="font-bold text-2xl">CQ Question Details</h3>
            <p className="text-sm text-gray-600 mt-1">Chapter {cq.chapter}</p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stimulus Section */}
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              {cq.stimulusType === "image" ? (
                <ImageIcon className="w-6 h-6 text-primary" />
              ) : (
                <FileText className="w-6 h-6 text-primary" />
              )}
              <h4 className="text-xl font-bold">উদ্দীপক (Stimulus)</h4>
              <div className="badge badge-primary">{cq.stimulusType}</div>
            </div>

            {cq.stimulusType === "image" ? (
              <div className="w-full bg-base-100 rounded-lg overflow-hidden">
                <img
                  src={cq.stimulusContent}
                  alt="Stimulus"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x400?text=Image+Not+Found";
                  }}
                />
              </div>
            ) : (
              <div className="p-4 bg-base-100 rounded-lg">
                <p className="whitespace-pre-wrap">
                  {parseSpecialToJSX(cq.stimulusContent)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-4 mb-6">
          <h4 className="text-xl font-bold">প্রশ্নসমূহ (Questions)</h4>
          {cq.questions.map((question, index) => (
            <div key={index} className="card bg-base-200 shadow">
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="badge badge-primary">
                        Question {index + 1}
                      </div>
                      <div className="badge badge-ghost">
                        {question.marks} Marks
                      </div>
                    </div>
                    <p className="text-lg">
                      {parseSpecialToJSX(question.question)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-base-100">
          <button onClick={onClose} className="btn btn-ghost">
            Close
          </button>
          <button onClick={handleEdit} className="btn btn-info gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button onClick={handleDelete} className="btn btn-error gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CqDetailModal;
