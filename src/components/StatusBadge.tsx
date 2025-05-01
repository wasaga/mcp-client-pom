
import React from "react";
import { Check, X } from "lucide-react";

interface StatusBadgeProps {
  connected: boolean;
  health?: "healthy" | "unhealthy" | "unknown";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ connected, health }) => {
  if (!connected) {
    return (
      <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-100 px-2.5 py-0.5 rounded-full">
        <X size={16} />
        <span>Not Connected</span>
      </div>
    );
  }

  if (!health || health === "unknown") {
    return (
      <div className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded-full">
        <Check size={16} />
        <span>Connected</span>
      </div>
    );
  }

  if (health === "unhealthy") {
    return (
      <div className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full">
        <X size={16} />
        <span>Connected - Unhealthy</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full">
      <Check size={16} />
      <span>Connected - Healthy</span>
    </div>
  );
};

export default StatusBadge;
