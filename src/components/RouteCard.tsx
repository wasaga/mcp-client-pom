
import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { MCPRoute } from "../types/mcp";

interface RouteCardProps {
  route: MCPRoute;
  token: string;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, token }) => {
  const [routeData] = useState<MCPRoute>(route);

  const handleConnect = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const connectEndpoint = `${route.url}/.pomerium/mcp/connect`;
    const redirectUrl = `${connectEndpoint}${connectEndpoint.includes('?') ? '&' : '?'}redirect=${currentUrl}`;
    window.location.href = redirectUrl;
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{route.name}</h3>
        <StatusBadge 
          connected={routeData.connected}
        />
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 truncate">
        {route.url}
      </p>

      <button
        className="w-full py-2 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        disabled={routeData.connected}
        onClick={handleConnect}
      >
        {routeData.connected ? "Connected" : "Connect"}
      </button>
    </div>
  );
};

export default RouteCard;
