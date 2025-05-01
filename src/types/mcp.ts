
export interface MCPRoute {
  name: string;
  description?: string;
  logo_url?: string;
  connected: boolean;
  url: string;
}

export interface MCPRoutesResponse {
  servers: MCPRoute[];
}
