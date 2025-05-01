
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="flex items-center gap-2 p-4 border border-destructive rounded-md bg-destructive/10 text-destructive mb-4">
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );
};

export default ErrorDisplay;
