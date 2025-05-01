
import { useEffect, useState } from "react";

export function useToken() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractToken = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would extract the token from the request headers
        // For demo purposes, we'll check if there's a token in localStorage, URL params, or use a mock
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");
        
        // Check localStorage first, then URL params
        const storedToken = localStorage.getItem("mcp_token");
        
        if (tokenFromUrl) {
          localStorage.setItem("mcp_token", tokenFromUrl);
          setToken(tokenFromUrl);
        } else if (storedToken) {
          setToken(storedToken);
        } else {
          // For demo purposes, generate a mock token
          const mockToken = "demo-" + Math.random().toString(36).substring(2, 15);
          localStorage.setItem("mcp_token", mockToken);
          setToken(mockToken);
        }
      } catch (err) {
        setError("Failed to extract authentication token");
        console.error("Token extraction error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    extractToken();
  }, []);

  return { token, isLoading, error };
}
