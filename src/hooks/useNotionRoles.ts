import { useState, useEffect } from "react";

interface UseNotionRolesReturn {
  roles: string[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNotionRoles(): UseNotionRolesReturn {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/roles");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setRoles(data.roles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch roles");
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const refetch = () => {
    fetchRoles();
  };

  return {
    roles,
    loading,
    error,
    refetch,
  };
}
