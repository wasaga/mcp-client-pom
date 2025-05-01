
import { MCPRoute, MCPRoutesResponse } from "../types/mcp";

const BASE_URL = window.location.origin;
const ROUTES_ENDPOINT = "/.pomerium/mcp/routes";

export async function fetchMCPRoutes(token: string): Promise<MCPRoute[]> {
  try {
    const response = await fetch(`${BASE_URL}${ROUTES_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching routes: ${response.status}`);
    }

    const data: MCPRoutesResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch MCP routes:", error);
    
    // For demo purposes, return mock data if the endpoint doesn't exist
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log("Returning mock data for local development");
      return [
        { name: "Authentication System", connected: true, url: "https://auth.example.com" },
        { name: "Data Analytics", connected: false, url: "https://analytics.example.com" },
        { name: "User Management", connected: true, url: "https://users.example.com" },
        { name: "Resource Monitor", connected: false, url: "https://monitor.example.com" },
        { name: "Storage Service", connected: true, url: "https://storage.example.com" }
      ];
    }
    
    throw error;
  }
}

export async function checkRouteHealth(route: MCPRoute, token: string): Promise<MCPRoute> {
  if (!route.connected) {
    return route;
  }

  try {
    const healthUrl = `${route.url}/health`;
    const response = await fetch(healthUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...route,
      health: {
        status: response.ok ? "healthy" : "unhealthy",
        message: response.ok ? "Service is healthy" : `Error: ${response.status}`,
      },
    };
  } catch (error) {
    console.error(`Failed to check health for ${route.name}:`, error);
    return {
      ...route,
      health: {
        status: "unhealthy",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}
