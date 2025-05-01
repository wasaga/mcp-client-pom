
import React from "react";
import { Check, X } from "lucide-react";

interface StatusBadgeProps {
  connected: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ connected }) => {
  if (!connected) {
    return (
      <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-100 px-2.5 py-0.5 rounded-full">
        <X size={16} />
        <span>Not Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">
      <Check size={16} />
      <span>Connected</span>
    </div>
  );
};

export default StatusBadge;
