import React from "react";
import { Chip } from "@heroui/react";
import { User } from "../types";

interface RoleBadgeProps {
  role: User["role"];
  size?: "sm" | "md" | "lg";
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = "sm" }) => {
  const roleConfig = {
    admin: {
      color: "danger" as const,
      label: "Admin"
    },
    moderator: {
      color: "warning" as const,
      label: "Moderator"
    },
    member: {
      color: "primary" as const,
      label: "Member"
    },
    guest: {
      color: "default" as const,
      label: "Guest"
    }
  };
  
  const config = roleConfig[role] || roleConfig.guest;
  
  return (
    <Chip
      size={size}
      color={config.color}
      variant="flat"
    >
      {config.label}
    </Chip>
  );
};