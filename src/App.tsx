import React from "react";
import { Tabs, Tab, Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { CommunityHeader } from "./components/community-header";
import { DiscussionFeed } from "./components/discussion-feed";
import { PopularGroups } from "./components/popular-groups";
import { CultureSpotlight } from "./components/culture-spotlight";
import { Footer } from "./components/footer";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { ForumsPage } from "./pages/forums-page";
import { GroupsPage } from "./pages/groups-page";
import { ResourcesPage } from "./pages/resources-page";
import { HomePage } from "./pages/home-page";
import { DiscussionDetailPage } from "./pages/discussion-detail-page";
import { useAuth } from "./components/auth/auth-context";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/language-switcher";
import { SignInPage } from "./pages/auth/sign-in"; // Changed from "./pages/auth/sign-in-page"
import { SignUpPage } from "./pages/auth/sign-up"; // Changed from "./pages/auth/sign-up-page"
import { ProfilePage } from "./pages/profile/profile-page";
import { SettingsPage } from "./pages/settings-page";
import { DatabaseSchemaPage } from "./pages/admin/database-schema";
import { VerifyEmailPage } from "./pages/auth/verify-email";
import { VerificationSentPage } from "./pages/auth/verification-sent";
import { ForgotPassword } from "./pages/auth/forgot-password";
import { ResetPasswordPage } from "./pages/auth/reset-password";
import { MobileMenu } from "./components/mobile-menu";
import { SearchBar } from './components/SearchBar';
import { NotificationBell } from './components/NotificationBell';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { ModerationDashboard } from './pages/admin/ModerationDashboard';
import { RegistrationSettings } from './components/admin/RegistrationSettings';
import { SearchResults } from "./pages/SearchResults";
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { ReactPlugin } from '@stagewise-plugins/react';
import { AdminDashboard } from './pages/admin/dashboard';
import { AdminUsers } from './pages/admin/admin-users';
import { AdminForums } from './pages/admin/admin-forums';
import { AdminReports } from './pages/admin/admin-reports';
import { AdminSettings } from './pages/admin/admin-settings';

const AppContent: React.FC = () => {
  const [selected, setSelected] = React.useState("home");
  // Remove the language state since we're now using i18next
  // const [language, setLanguage] = React.useState("en");

  // Add translation hook
  const { t } = useTranslation();

  // Remove the languages object since we're now using translations
  // const languages = {
  //   en: "English",
  //   sz: "Sizang",
  //   my: "Burmese"
  // };

  // Add auth context
  const { user, isAuthenticated, logout } = useAuth();

  // Add navigate hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Add state for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Only show navbar on non-auth pages */}
      {!window.location.pathname.includes('/auth/') && (
        <Navbar maxWidth="xl" className="border-b border-divider backdrop-blur-md bg-background/70 sticky top-0 z-50">
          <NavbarBrand>
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleNavigation("/")}
            >
              <div>
                <img
                  src="/favicon.png"
                  alt="Logo"
                  className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
                />
              </div>
              <p className="font-bold text-inherit text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-500">{t('app.name')}</p>
            </motion.div>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            <NavbarItem>
              <Link 
                color={window.location.pathname === "/" ? "primary" : "foreground"}
                className="cursor-pointer"
                onPress={() => handleNavigation("/")}
              >
                Home
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link 
                color={window.location.pathname === "/forums" ? "primary" : "foreground"}
                className="cursor-pointer"
                onPress={() => handleNavigation("/forums")}
              >
                Forums
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link 
                color={window.location.pathname === "/groups" ? "primary" : "foreground"}
                className="cursor-pointer"
                onPress={() => handleNavigation("/groups")}
              >
                Groups
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link 
                color={window.location.pathname === "/resources" ? "primary" : "foreground"}
                className="cursor-pointer"
                onPress={() => handleNavigation("/resources")}
              >
                Resources
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            {/* Replace the language dropdown with our new LanguageSwitcher component */}
            <LanguageSwitcher />
            
            {!isAuthenticated ? (
              <div className="hidden sm:flex gap-2">
                <Button 
                  variant="flat" 
                  color="primary"
                  onPress={() => handleNavigation("/auth/sign-in")}
                >
                  Sign In
                </Button>
                <Button 
                  color="primary"
                  onPress={() => handleNavigation("/auth/sign-up")}
                >
                  Sign Up
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
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="my_profile" onPress={() => handleNavigation("/profile")}>
                    My Profile
                  </DropdownItem>
                  <DropdownItem key="my_groups" onPress={() => handleNavigation("/my-groups")}>
                    My Groups
                  </DropdownItem>
                  <DropdownItem key="settings" onPress={() => handleNavigation("/settings")}>
                    Settings
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onPress={logout}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
            
            {/* Add mobile menu toggle button */}
            <Button
              className="sm:hidden"
              isIconOnly
              variant="light"
              onPress={() => setIsMobileMenuOpen(true)}
            >
              <Icon icon="lucide:menu" className="text-xl" />
            </Button>
          </NavbarContent>
        </Navbar>
      )}

      {/* Add MobileMenu component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={(path) => {
          handleNavigation(path);
          setIsMobileMenuOpen(false);
        }}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forums" element={<ForumsPage />} />
          <Route path="/forums/discussion/:id" element={<DiscussionDetailPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/auth/sign-in" element={<SignInPage />} />
          <Route path="/auth/sign-up" element={<SignUpPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/verification-sent" element={<VerificationSentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/my-groups" element={<div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <Icon icon="lucide:users" className="text-6xl text-foreground-300 mb-4" />
            <h1 className="text-3xl font-bold mb-2">My Groups</h1>
            <p className="text-foreground-500 mb-6 text-center">This feature is coming soon. You'll be able to manage all your groups here.</p>
            <Button 
              color="primary"
              as={Link}
              href="/groups"
              startContent={<Icon icon="lucide:search" />}
            >
              Explore Groups
            </Button>
          </div>} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/admin/moderation" element={<ModerationDashboard />} />
          <Route path="/admin/settings" element={<RegistrationSettings />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/forums" element={<AdminForums />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <>
      <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

export default App;