import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { User } from "../types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  isAuthenticated,
  user,
  logout
}) => {
  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose}
      placement="left"
      size="xs"
    >
      <DrawerContent>
        <DrawerHeader className="border-b border-divider">
          <h2 className="text-lg font-bold">Menu</h2>
        </DrawerHeader>
        <DrawerBody>
          <div className="flex flex-col gap-2">
            <Button
              variant="light"
              className="justify-start"
              startContent={<Icon icon="lucide:home" />}
              onPress={() => onNavigate("/")}
            >
              Home
            </Button>
            <Button
              variant="light"
              className="justify-start"
              startContent={<Icon icon="lucide:message-square" />}
              onPress={() => onNavigate("/forums")}
            >
              Forums
            </Button>
            <Button
              variant="light"
              className="justify-start"
              startContent={<Icon icon="lucide:users" />}
              onPress={() => onNavigate("/groups")}
            >
              Groups
            </Button>
            <Button
              variant="light"
              className="justify-start"
              startContent={<Icon icon="lucide:file-text" />}
              onPress={() => onNavigate("/resources")}
            >
              Resources
            </Button>
          </div>
          
          {isAuthenticated && (
            <>
              <div className="border-t border-divider my-4" />
              <div className="flex flex-col gap-2">
                <Button
                  variant="light"
                  className="justify-start"
                  startContent={<Icon icon="lucide:user" />}
                  onPress={() => onNavigate("/profile")}
                >
                  My Profile
                </Button>
                <Button
                  variant="light"
                  className="justify-start"
                  startContent={<Icon icon="lucide:settings" />}
                  onPress={() => onNavigate("/settings")}
                >
                  Settings
                </Button>
              </div>
            </>
          )}
        </DrawerBody>
        <DrawerFooter>
          {isAuthenticated ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Avatar
                  src={user?.avatar || "https://img.heroui.chat/image/avatar?w=150&h=150&u=1"}
                  size="sm"
                />
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  logout();
                  onClose();
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                variant="flat"
                color="primary"
                className="flex-1"
                onPress={() => onNavigate("/auth/sign-in")}
              >
                Sign In
              </Button>
              <Button
                color="primary"
                className="flex-1"
                onPress={() => onNavigate("/auth/sign-up")}
              >
                Sign Up
              </Button>
            </div>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};