import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "./auth/auth-context";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "react-i18next";

export const MainNavbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    logout();
    history.push("/");
  };
  
  const handleNavigation = (path: string) => {
    history.push(path);
  };

  return (
    <Navbar maxWidth="xl" className="border-b border-divider backdrop-blur-md bg-background/70 sticky top-0 z-50">
      <NavbarBrand>
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleNavigation("/")}
        >
          <div className="bg-primary rounded-md p-1.5 shadow-sm">
            <Icon icon="lucide:users" className="text-white text-xl" />
          </div>
          <p className="font-bold text-inherit text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-500">{t('app.name')}</p>
        </motion.div>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link 
            color={isActive("/") ? "primary" : "foreground"}
            className="cursor-pointer"
            onPress={() => handleNavigation("/")}
          >
            {t('nav.home')}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color={isActive("/forums") ? "primary" : "foreground"}
            className="cursor-pointer"
            onPress={() => handleNavigation("/forums")}
          >
            {t('nav.forums')}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color={isActive("/groups") ? "primary" : "foreground"}
            className="cursor-pointer"
            onPress={() => handleNavigation("/groups")}
          >
            {t('nav.groups')}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            color={isActive("/resources") ? "primary" : "foreground"}
            className="cursor-pointer"
            onPress={() => handleNavigation("/resources")}
          >
            {t('nav.resources')}
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <LanguageSwitcher />
        
        {!isAuthenticated ? (
          <div className="hidden sm:flex gap-2">
            <Button 
              variant="flat" 
              color="primary"
              onPress={() => handleNavigation("/auth/sign-in")}
            >
              {t('nav.signIn')}
            </Button>
            <Button 
              color="primary"
              onPress={() => handleNavigation("/auth/sign-up")}
            >
              {t('nav.signUp')}
            </Button>
          </div>
        ) : (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src={user?.avatar || "https://img.heroui.chat/image/avatar?w=150&h=150&u=1"}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{t('nav.profile.signedInAs')}</p>
                <p className="font-semibold">{user?.email}</p>
              </DropdownItem>
              <DropdownItem key="my_profile" onPress={() => handleNavigation("/profile")}>
                {t('nav.profile.myProfile')}
              </DropdownItem>
              <DropdownItem key="my_groups" onPress={() => handleNavigation("/my-groups")}>
                {t('nav.profile.myGroups')}
              </DropdownItem>
              <DropdownItem key="settings" onPress={() => handleNavigation("/settings")}>
                {t('nav.profile.settings')}
              </DropdownItem>
              <DropdownItem key="help_and_feedback">
                {t('nav.profile.helpFeedback')}
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                {t('nav.profile.logout')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
};