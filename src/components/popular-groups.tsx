import React from "react";
import { Card, CardBody, CardHeader, Button, Avatar, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useGroups } from "../context/group-context";
import { useAuth } from "./auth/auth-context";
import { NotificationService } from "../services/notification-service";

export const PopularGroups: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { t } = useTranslation();
  
  // Replace static data with context
  const { groups, isLoading, joinGroup, isUserInGroup } = useGroups();
  const { isAuthenticated } = useAuth();
  
  // Get the 4 most popular groups
  const popularGroups = React.useMemo(() => {
    return [...groups]
      .sort((a, b) => b.members - a.members)
      .slice(0, 4);
  }, [groups]);
  
  // Add join group handler
  const handleJoinGroup = async (groupId: number, groupName: string) => {
    // In a real app, this would send a join request to the backend
    // For demo, we'll just simulate sending a notification
    if (user) {
      // Simulate sending a notification to the group admin
      const groupAdmin = {
        id: "admin-user",
        name: "Group Admin",
        email: "admin@example.com", // In a real app, this would be the actual email
        avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5"
      };
      
      // Send notification to the group admin
      await NotificationService.sendGroupInviteNotification(
        groupAdmin,
        groupName,
        user.name
      );
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Popular Groups</h2>
        <Button 
          size="sm" 
          variant="light"
          onPress={() => navigate("/groups")}
        >
          View All
        </Button>
      </CardHeader>
      <CardBody className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size="sm" color="primary" />
          </div>
        ) : popularGroups.length === 0 ? (
          <div className="p-4 text-center text-foreground-500">
            No groups available
          </div>
        ) : (
          <div className="divide-y divide-divider">
            {popularGroups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 p-3 hover:bg-content2/50 transition-colors">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon icon={group.icon} className="text-primary text-xl" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{group.name}</p>
                  <p className="text-xs text-foreground-400">{group.members} members</p>
                </div>
                <Button 
                  size="sm" 
                  variant="flat" 
                  color="primary"
                  onPress={() => handleJoinGroup(group.id, group.name)}
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};