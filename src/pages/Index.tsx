
import React, { useEffect, useState } from "react";
import { useToken } from "../hooks/useToken";
import { fetchMCPRoutes } from "../services/mcpService";
import { MCPRoute } from "../types/mcp";
import Header from "../components/Header";
import RouteCard from "../components/RouteCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";

const Index = () => {
  const { token, isLoading: tokenLoading, error: tokenError } = useToken();
  const [routes, setRoutes] = useState<MCPRoute[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoutes = async () => {
      if (!token) return;
      
      setIsLoading(true);
      try {
        const mcpRoutes = await fetchMCPRoutes(token);
        setRoutes(mcpRoutes);
        setError(null);
      } catch (err) {
        console.error("Failed to load MCP routes:", err);
        setError("Failed to load MCP routes. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      loadRoutes();
    }
  }, [token]);

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header title="MCP Client Demo" />
        <ErrorDisplay message={tokenError} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Header 
        title="Pomerium MCP Client Demo" 
        subtitle="Interact with the MCP servers protected by Pomerium"
      />

      {error && <ErrorDisplay message={error} />}

      {isLoading ? (
        <div className="mt-12 flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading available routes...</p>
        </div>
      ) : routes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <RouteCard key={route.name} route={route} token={token!} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No MCP routes available</p>
        </div>
      )}
    </div>
  );
};

export default Index;
