
export interface MCPRoute {
  name: string;
  connected: boolean;
  url: string;
  health?: {
    status: "healthy" | "unhealthy" | "unknown";
    message?: string;
  };
}

export interface MCPRoutesResponse {
  results: MCPRoute[];
}
