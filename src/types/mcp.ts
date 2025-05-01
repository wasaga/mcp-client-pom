
export interface MCPRoute {
  name: string;
  description?: string;
  logo_url?: string;
  connected: boolean;
  url: string;
  health?: {
    status: "healthy" | "unhealthy" | "unknown";
    message?: string;
  };
}

export interface MCPRoutesResponse {
  servers: MCPRoute[];
}
