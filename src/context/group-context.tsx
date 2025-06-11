import React, { createContext, useContext, useState, useEffect } from "react";
import { Group, User } from "../types";
import { ApiService } from "../services/api-service";
import { useAuth } from "../components/auth/auth-context";
import { addToast } from "@heroui/react";

interface GroupContextType {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  joinGroup: (groupId: number) => Promise<void>;
  leaveGroup: (groupId: number) => Promise<void>;
  createGroup: (group: Omit<Group, "id" | "members" | "memberIds">) => Promise<Group>;
  isUserInGroup: (groupId: number) => boolean;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getGroups();
      setGroups(data);
    } catch (err) {
      setError("Failed to fetch groups");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (groupId: number) => {
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please sign in to join groups",
        color: "warning"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const updatedGroup = await ApiService.joinGroup(groupId, user.id);
      setGroups(prev => 
        prev.map(g => g.id === groupId ? updatedGroup : g)
      );
      addToast({
        title: "Success!",
        description: `You've joined ${updatedGroup.name}`,
        color: "success"
      });
    } catch (err) {
      console.error("Failed to join group:", err);
      addToast({
        title: "Error",
        description: "Failed to join group",
        color: "danger"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const leaveGroup = async (groupId: number) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedGroup = await ApiService.leaveGroup(groupId, user.id);
      setGroups(prev => 
        prev.map(g => g.id === groupId ? updatedGroup : g)
      );
      addToast({
        title: "Left group",
        description: `You've left ${updatedGroup.name}`,
        color: "primary"
      });
    } catch (err) {
      console.error("Failed to leave group:", err);
      addToast({
        title: "Error",
        description: "Failed to leave group",
        color: "danger"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async (group: Omit<Group, "id" | "members" | "memberIds">) => {
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please sign in to create groups",
        color: "warning"
      });
      throw new Error("Authentication required");
    }
    
    setIsLoading(true);
    try {
      const newGroup = await ApiService.createGroup(group);
      setGroups(prev => [...prev, newGroup]);
      addToast({
        title: "Success!",
        description: "Your group has been created",
        color: "success"
      });
      return newGroup;
    } catch (err) {
      console.error("Failed to create group:", err);
      addToast({
        title: "Error",
        description: "Failed to create group",
        color: "danger"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const isUserInGroup = (groupId: number) => {
    if (!user) return false;
    const group = groups.find(g => g.id === groupId);
    return group ? (group.memberIds || []).includes(user.id) : false;
  };

  // Load groups on initial mount
  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <GroupContext.Provider
      value={{
        groups,
        isLoading,
        error,
        fetchGroups,
        joinGroup,
        leaveGroup,
        createGroup,
        isUserInGroup
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error("useGroups must be used within a GroupProvider");
  }
  return context;
};
