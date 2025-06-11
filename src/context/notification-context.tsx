import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "../types";
import { ApiService } from "../services/api-service";
import { useAuth } from "../components/auth/auth-context";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getUserNotifications(user.id);
      setNotifications(data);
    } catch (err) {
      setError("Failed to fetch notifications");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const markAsRead = async (notificationId: number) => {
    if (!user) return;
    
    try {
      await ApiService.markNotificationAsRead(user.id, notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };
  
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be a single API call
      const promises = notifications
        .filter(n => !n.isRead)
        .map(n => ApiService.markNotificationAsRead(user.id, n.id));
      
      await Promise.all(promises);
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch notifications when user changes
  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};