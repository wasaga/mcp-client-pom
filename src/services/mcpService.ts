
import { MCPRoute, MCPRoutesResponse } from "../types/mcp";

const BASE_URL = window.location.origin;
const ROUTES_ENDPOINT = "/.pomerium/mcp/routes";

export async function fetchMCPRoutes(token: string): Promise<MCPRoute[]> {
  // Always return mock data during development to avoid direct frontend requests
  // In production, this would be replaced by a backend proxy endpoint
  if (window.location.hostname === "localhost" || 
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("lovableproject.com")) {
    console.log("Using mock data for development environment");
    return getMockRoutes();
  }

  try {
    // In a real production environment, this would call a backend proxy endpoint
    // that would add the proper headers and forward the request
    const response = await fetch(`${BASE_URL}${ROUTES_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching routes: ${response.status}`);
    }

    // Check content type to avoid parsing HTML as JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Response is not JSON, using mock data instead");
      return getMockRoutes();
    }

    const data: MCPRoutesResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch MCP routes:", error);
    
    // Return mock data when there's an error
    return getMockRoutes();
  }
}

// Helper function to provide consistent mock data
function getMockRoutes(): MCPRoute[] {
  return [
    { 
      name: "Authentication System", 
      connected: true, 
      url: "https://auth.example.com",
      health: { status: "healthy", message: "Service is healthy" }
    },
    { 
      name: "Data Analytics", 
      connected: false, 
      url: "https://analytics.example.com" 
    },
    { 
      name: "User Management", 
      connected: true, 
      url: "https://users.example.com",
      health: { status: "unhealthy", message: "Database connection timeout" }
    },
    { 
      name: "Resource Monitor", 
      connected: false, 
      url: "https://monitor.example.com" 
    },
    { 
      name: "Storage Service", 
      connected: true, 
      url: "https://storage.example.com",
      health: { status: "healthy", message: "All systems operational" }
    }
  ];
}

export async function checkRouteHealth(route: MCPRoute, token: string): Promise<MCPRoute> {
  if (!route.connected) {
    return route;
  }

  // For development environments, use predefined health status from mock data
  if (window.location.hostname === "localhost" || 
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("lovableproject.com")) {
    if (route.health) {
      return route; // Return the route with its mock health status
    }
    
    // Generate random health status for testing if not provided
    const healthStates = ["healthy", "unhealthy"] as const;
    const randomHealth = healthStates[Math.floor(Math.random() * healthStates.length)];
    const healthMessage = randomHealth === "healthy" 
      ? "Service is operational" 
      : "Service experiencing issues";
      
    return {
      ...route,
      health: {
        status: randomHealth,
        message: healthMessage,
      },
    };
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
