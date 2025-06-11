import { User, Permission, RolePermissions } from "../types";

/**
 * Defines the permissions for each role in the system
 */
export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    "manageUsers",
    "manageContent",
    "moderateContent",
    "createContent",
    "editOwnContent",
    "deleteOwnContent",
    "viewPrivateContent"
  ],
  moderator: [
    "moderateContent",
    "createContent",
    "editOwnContent",
    "deleteOwnContent",
    "viewPrivateContent"
  ],
  member: [
    "createContent",
    "editOwnContent",
    "deleteOwnContent",
    "viewPrivateContent"
  ],
  guest: []
};

/**
 * Maps permissions to user-friendly descriptions
 */
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  manageUsers: "Manage all users (create, update, delete)",
  manageContent: "Manage all content (create, update, delete)",
  moderateContent: "Moderate content (approve, reject, edit)",
  createContent: "Create new content (posts, comments, resources)",
  editOwnContent: "Edit own content",
  deleteOwnContent: "Delete own content",
  viewPrivateContent: "View private content"
};

/**
 * Service to handle permission checks
 */
export class PermissionsService {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false;
    
    // Map role to permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    
    // Check if the user's role includes this permission
    return rolePermissions.includes(permission);
  }
  
  /**
   * Check if a user can perform an action on content
   */
  static canManageContent(user: User | null, contentAuthorId?: string): boolean {
    if (!user) return false;
    
    // Admins can manage all content
    if (this.hasPermission(user, "manageContent")) return true;
    
    // Moderators can moderate all content
    if (this.hasPermission(user, "moderateContent")) return true;
    
    // Users can manage their own content if they have permission
    if (contentAuthorId && contentAuthorId === user.id) {
      return this.hasPermission(user, "editOwnContent");
    }
    
    return false;
  }
  
  /**
   * Check if a user can delete content
   */
  static canDeleteContent(user: User | null, contentAuthorId?: string): boolean {
    if (!user) return false;
    
    // Admins can delete all content
    if (this.hasPermission(user, "manageContent")) return true;
    
    // Moderators can delete all content
    if (this.hasPermission(user, "moderateContent")) return true;
    
    // Users can delete their own content if they have permission
    if (contentAuthorId && contentAuthorId === user.id) {
      return this.hasPermission(user, "deleteOwnContent");
    }
    
    return false;
  }
  
  /**
   * Check if a user can manage other users
   */
  static canManageUsers(user: User | null, targetUserId?: string): boolean {
    if (!user) return false;
    
    // Admins can manage all users
    if (this.hasPermission(user, "manageUsers")) return true;
    
    // Users can't manage themselves (prevent role escalation)
    if (targetUserId && targetUserId === user.id) return false;
    
    return false;
  }
  
  /**
   * Generate user permissions object based on role
   */
  static generatePermissionsForRole(role: User["role"]): User["permissions"] {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    
    return {
      canManageUsers: rolePermissions.includes("manageUsers"),
      canManageContent: rolePermissions.includes("manageContent"),
      canModerateContent: rolePermissions.includes("moderateContent"),
      canCreateContent: rolePermissions.includes("createContent"),
      canEditOwnContent: rolePermissions.includes("editOwnContent"),
      canDeleteOwnContent: rolePermissions.includes("deleteOwnContent"),
      canViewPrivateContent: rolePermissions.includes("viewPrivateContent")
    };
  }
}