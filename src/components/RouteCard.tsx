import React, { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";
import { MCPRoute } from "../types/mcp";
import { checkRouteHealth } from "../services/mcpService";
import LoadingSpinner from "./LoadingSpinner";

interface RouteCardProps {
  route: MCPRoute;
  token: string;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, token }) => {
  const [routeData, setRouteData] = useState<MCPRoute>(route);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    if (route.connected) {
      const checkHealth = async () => {
        setIsChecking(true);
        try {
          const updatedRoute = await checkRouteHealth(route, token);
          setRouteData(updatedRoute);
        } catch (error) {
          console.error(`Failed to check health for ${route.name}:`, error);
        } finally {
          setIsChecking(false);
        }
      };
      
      checkHealth();
      
      // Poll health status every 30 seconds for connected routes
      const intervalId = setInterval(checkHealth, 30000);
      return () => clearInterval(intervalId);
    }
  }, [route, token]);

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
          health={routeData.health?.status} 
        />
      </div>
      
      <p className="text-sm text-muted-foreground mb-4 truncate">
        {route.url}
      </p>

      {isChecking && (
        <div className="mb-4">
          <LoadingSpinner size="sm" />
        </div>
      )}

      {routeData.connected && routeData.health && (
        <div className="mb-4 text-sm">
          <span className="font-medium">Health:</span>{" "}
          <span className={routeData.health.status === "healthy" ? "text-green-600" : "text-red-600"}>
            {routeData.health.message || (routeData.health.status === "healthy" ? "Healthy" : "Unhealthy")}
          </span>
        </div>
      )}

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
