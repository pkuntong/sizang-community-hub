import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Tag } from "../types";
import { ApiService } from "../services/api-service";

interface CategoryContextType {
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getTagBySlug: (slug: string) => Tag | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTags = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getTags();
      setTags(data);
    } catch (err) {
      setError("Failed to fetch tags");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCategoryBySlug = (slug: string) => {
    return categories.find(c => c.slug === slug);
  };
  
  const getTagBySlug = (slug: string) => {
    return tags.find(t => t.slug === slug);
  };
  
  // Load categories and tags on initial mount
  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);
  
  return (
    <CategoryContext.Provider
      value={{
        categories,
        tags,
        isLoading,
        error,
        fetchCategories,
        fetchTags,
        getCategoryBySlug,
        getTagBySlug
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};