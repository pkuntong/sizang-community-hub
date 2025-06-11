import React, { createContext, useContext, useState, useEffect } from "react";
import { addToast } from "@heroui/react";
import { User } from "../../types";
import { PermissionsService } from "../../services/permissions-service";
import { NotificationService } from "../../services/notification-service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  canManageContent: (contentAuthorId?: string) => boolean;
  canDeleteContent: (contentAuthorId?: string) => boolean;
  canManageUsers: (targetUserId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the token with your backend
        const savedUser = localStorage.getItem("sizang_user");
        
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // Simulating successful login
      const mockUser: User = {
        id: "user1",
        name: "Maria Thang",
        email: "maria.thang@example.com",
        avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
        role: "admin",
        joinDate: "2022-08-15",
        bio: "Community organizer and cultural preservationist",
        location: "Dallas, TX",
        language: ["en", "sz"],
        lastActive: new Date().toISOString(),
        isEmailVerified: true, // Admin is verified
        permissions: PermissionsService.generatePermissionsForRole("admin")
      };
      
      // Check if email is verified
      if (!mockUser.isEmailVerified) {
        addToast({
          title: "Email not verified",
          description: "Please check your email to verify your account",
          color: "warning"
        });
        throw new Error("Email not verified");
      }
      
      // Save to localStorage for persistence
      localStorage.setItem("sizang_user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Show success toast
      addToast({
        title: "Welcome back!",
        description: "You've successfully signed in",
        color: "success"
      });
    } catch (error) {
      console.error("Login error:", error);
      
      // Show error toast
      addToast({
        title: "Sign in failed",
        description: "Please check your credentials and try again",
        color: "danger"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would trigger Google OAuth
      // Simulating successful Google login
      const mockUser: User = {
        id: "google-user-123",
        name: "Google User",
        email: "google.user@example.com",
        avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
        role: "member"
      };
      
      localStorage.setItem("sizang_user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // Simulating successful registration with verification required
      const mockUser: User = {
        id: "new-user-123",
        name: name,
        email: email,
        avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
        role: "member",
        joinDate: new Date().toISOString(),
        isEmailVerified: false, // New users start unverified
        verificationToken: "mock-token-" + Math.random().toString(36).substring(2, 15),
        verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        permissions: PermissionsService.generatePermissionsForRole("member")
      };
      
      // Send verification email
      await NotificationService.sendEmailVerificationEmail(mockUser, mockUser.verificationToken!);
      
      // Show a verification required message
      addToast({
        title: "Verification Required",
        description: "Please check your email to verify your account",
        color: "primary"
      });
      
      // Store the unverified user (in a real app, this would be in the database)
      localStorage.setItem("sizang_unverified_user", JSON.stringify(mockUser));
      
      // Return without setting the user (they're not logged in yet)
      return;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would verify with the backend
      // For demo, we'll just check against the stored unverified user
      const unverifiedUser = JSON.parse(localStorage.getItem("sizang_unverified_user") || "null");
      
      if (!unverifiedUser) {
        throw new Error("No pending verification");
      }
      
      if (unverifiedUser.verificationToken !== token) {
        throw new Error("Invalid verification token");
      }
      
      if (new Date(unverifiedUser.verificationExpires) < new Date()) {
        throw new Error("Verification token expired");
      }
      
      // Update the user to verified
      const verifiedUser: User = {
        ...unverifiedUser,
        isEmailVerified: true,
        verificationToken: undefined,
        verificationExpires: undefined
      };
      
      // Save the verified user
      localStorage.setItem("sizang_user", JSON.stringify(verifiedUser));
      localStorage.removeItem("sizang_unverified_user");
      
      // Set the user in state
      setUser(verifiedUser);
      
      // Send welcome email after verification
      await NotificationService.sendWelcomeEmail(verifiedUser);
      
      // Show success toast
      addToast({
        title: "Email Verified!",
        description: "Your account has been verified successfully",
        color: "success"
      });
    } catch (error) {
      console.error("Verification error:", error);
      
      // Show error toast
      addToast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Please try again",
        color: "danger"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would resend the verification email
      // For demo, we'll just update the token expiration
      const unverifiedUser = JSON.parse(localStorage.getItem("sizang_unverified_user") || "null");
      
      if (!unverifiedUser) {
        throw new Error("No pending verification");
      }
      
      // Update the verification token and expiration
      const updatedUser = {
        ...unverifiedUser,
        verificationToken: "mock-token-" + Math.random().toString(36).substring(2, 15),
        verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      // Save the updated user
      localStorage.setItem("sizang_unverified_user", JSON.stringify(updatedUser));
      
      // Show success toast
      addToast({
        title: "Verification Email Sent",
        description: "Please check your email to verify your account",
        color: "success"
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      
      // Show error toast
      addToast({
        title: "Failed to Resend",
        description: error instanceof Error ? error.message : "Please try again",
        color: "danger"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would check if the email exists in the database
      // For demo purposes, we'll just create a mock user
      const mockUser: User = {
        id: "reset-user-123",
        name: "Reset User",
        email: email,
        avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=4",
        role: "member",
        resetToken: "reset-token-" + Math.random().toString(36).substring(2, 15),
        resetTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      // Send password reset email
      await NotificationService.sendPasswordResetEmail(mockUser, mockUser.resetToken!);
      
      // Store the reset token (in a real app, this would be in the database)
      localStorage.setItem("sizang_reset_user", JSON.stringify(mockUser));
      
      // Show success toast
      addToast({
        title: "Password Reset Email Sent",
        description: "Please check your email to reset your password",
        color: "success"
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      
      // Show error toast
      addToast({
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "Please try again",
        color: "danger"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would verify the token with the backend
      const resetUser = JSON.parse(localStorage.getItem("sizang_reset_user") || "null");
      
      if (!resetUser) {
        throw new Error("Invalid reset token");
      }
      
      if (resetUser.resetToken !== token) {
        throw new Error("Invalid reset token");
      }
      
      if (new Date(resetUser.resetTokenExpires) < new Date()) {
        throw new Error("Reset token expired");
      }
      
      // Update the user's password
      const updatedUser: User = {
        ...resetUser,
        resetToken: undefined,
        resetTokenExpires: undefined
      };
      
      // Save the updated user
      localStorage.setItem("sizang_user", JSON.stringify(updatedUser));
      localStorage.removeItem("sizang_reset_user");
      
      // Set the user in state
      setUser(updatedUser);
      
      // Show success toast
      addToast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully",
        color: "success"
      });
    } catch (error) {
      console.error("Password reset error:", error);
      
      // Show error toast
      addToast({
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "Please try again",
        color: "danger"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return PermissionsService.hasPermission(user, permission);
  };

  const canManageContent = (contentAuthorId?: string): boolean => {
    return PermissionsService.canManageContent(user, contentAuthorId);
  };

  const canDeleteContent = (contentAuthorId?: string): boolean => {
    return PermissionsService.canDeleteContent(user, contentAuthorId);
  };

  const canManageUsers = (targetUserId?: string): boolean => {
    return PermissionsService.canManageUsers(user, targetUserId);
  };

  const logout = () => {
    localStorage.removeItem("sizang_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        googleLogin,
        signup,
        logout,
        verifyEmail,
        resendVerificationEmail,
        requestPasswordReset,
        resetPassword,
        hasPermission,
        canManageContent,
        canDeleteContent,
        canManageUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};