import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return "bg-error text-white";
      case "info":
        return "bg-info text-white";
      default:
        return "bg-warning text-white";
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-4 top-4"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getTypeStyles()}`}
        >
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl text-center mb-2">{title}</h3>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6">{message}</p>

        {/* Actions */}
        <div className="modal-action justify-center">
          <button onClick={onClose} className="btn btn-ghost">
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`btn ${type === "danger" ? "btn-error" : "btn-warning"}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
