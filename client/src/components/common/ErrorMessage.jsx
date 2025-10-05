import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="alert alert-error shadow-lg">
      <AlertCircle className="w-6 h-6" />
      <div className="flex-1">
        <h3 className="font-bold">Error!</h3>
        <div className="text-sm">{message}</div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-sm btn-outline">
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
