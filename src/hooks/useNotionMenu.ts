import { useState, useEffect } from "react";
import { NavMenuItem } from "@/types";

interface UseNotionMenuReturn {
  menuItems: NavMenuItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNotionMenu(databaseId?: string): UseNotionMenuReturn {
  const [menuItems, setMenuItems] = useState<NavMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = databaseId
        ? `/api/menu?databaseId=${encodeURIComponent(databaseId)}`
        : "/api/menu";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMenuItems(data.menuItems || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch menu items"
      );
      console.error("Error fetching menu items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [databaseId]);

  const refetch = () => {
    fetchMenuItems();
  };

  return {
    menuItems,
    loading,
    error,
    refetch,
  };
}
