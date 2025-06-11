import React from "react";
import { useAuth } from "./auth/auth-context";
import { Permission } from "../types";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  fallback,
  children
}) => {
  const { hasPermission, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <Card className="border border-divider/40 shadow-md">
        <CardBody className="p-6 text-center">
          <div className="flex flex-col items-center py-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Icon icon="lucide:lock" className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
            <p className="text-foreground-600 mb-4">
              Please sign in to access this content
            </p>
            <div className="flex gap-3">
              <Button 
                as={Link} 
                to="/auth/sign-in" 
                color="primary"
              >
                Sign In
              </Button>
              <Button 
                as={Link} 
                to="/auth/sign-up" 
                variant="flat"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  if (!hasPermission(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Card className="border border-divider/40 shadow-md">
        <CardBody className="p-6 text-center">
          <div className="flex flex-col items-center py-4">
            <div className="w-12 h-12 bg-danger/20 rounded-full flex items-center justify-center mb-4">
              <Icon icon="lucide:shield-alert" className="text-danger text-xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">Access Denied</h3>
            <p className="text-foreground-600 mb-4">
              You don't have permission to access this content
            </p>
            <Button 
              as={Link} 
              to="/" 
              variant="flat"
            >
              Back to Home
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  return <>{children}</>;
};