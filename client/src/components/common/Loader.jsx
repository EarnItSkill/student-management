import { Loader2 } from "lucide-react";

const Loader = ({ fullScreen = true, message = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <p className="mt-4 text-lg font-semibold">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="mt-3 text-sm text-gray-400">{message}</p>
    </div>
  );
};

export default Loader;
