import React, { createContext, useContext, useState, useEffect } from "react";
import { Resource, User } from "../types";
import { ApiService } from "../services/api-service";
import { useAuth } from "../components/auth/auth-context";
import { addToast } from "@heroui/react";

interface ResourceContextType {
  resources: Resource[];
  isLoading: boolean;
  error: string | null;
  fetchResources: () => Promise<void>;
  uploadResource: (resource: Omit<Resource, "id" | "dateAdded" | "downloads">) => Promise<Resource>;
  downloadResource: (id: number) => Promise<void>;
  getResourcesByCategory: (category: string) => Resource[];
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined);

export const ResourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getResources();
      setResources(data);
    } catch (err) {
      setError("Failed to fetch resources");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadResource = async (resource: Omit<Resource, "id" | "dateAdded" | "downloads">) => {
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please sign in to upload resources",
        color: "warning"
      });
      throw new Error("Authentication required");
    }
    
    setIsLoading(true);
    try {
      const newResource = await ApiService.uploadResource(resource);
      setResources(prev => [...prev, newResource]);
      addToast({
        title: "Success!",
        description: "Your resource has been uploaded",
        color: "success"
      });
      return newResource;
    } catch (err) {
      console.error("Failed to upload resource:", err);
      addToast({
        title: "Error",
        description: "Failed to upload resource",
        color: "danger"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResource = async (id: number) => {
    try {
      const updatedResource = await ApiService.downloadResource(id);
      setResources(prev => 
        prev.map(r => r.id === id ? updatedResource : r)
      );
      
      // In a real app, this would trigger the actual file download
      addToast({
        title: "Download started",
        description: "Your file is being downloaded",
        color: "primary"
      });
    } catch (err) {
      console.error("Failed to download resource:", err);
      addToast({
        title: "Error",
        description: "Failed to download resource",
        color: "danger"
      });
    }
  };

  const getResourcesByCategory = (category: string) => {
    if (category === "all") return resources;
    return resources.filter(r => r.category.toLowerCase() === category.toLowerCase());
  };

  // Load resources on initial mount
  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <ResourceContext.Provider
      value={{
        resources,
        isLoading,
        error,
        fetchResources,
        uploadResource,
        downloadResource,
        getResourcesByCategory
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
};

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (context === undefined) {
    throw new Error("useResources must be used within a ResourceProvider");
  }
  return context;
};
