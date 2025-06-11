// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  joinDate?: string;
  bio?: string;
  location?: string;
  language?: string[];
  lastActive?: string;
  isEmailVerified?: boolean;
  verificationToken?: string;
  verificationExpires?: string;
  resetToken?: string;           // Add for password reset
  resetTokenExpires?: string;    // Add for password reset
  permissions?: Permission[];
}

// Discussion types
export interface Discussion {
  id: number;
  title: string;
  author: string;
  authorId: string; // Added to link to User
  authorAvatar: string;
  category: string;
  content: string;
  timeAgo: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  comments: number;
  likes: number;
  hasImage: boolean;
  imageUrl?: string;
  // Added fields
  tags: string[];
  language: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  likedBy: string[]; // Array of user IDs
}

export interface Comment {
  id: number;
  discussionId: number; // Added to link to Discussion
  author: string;
  authorId: string; // Added to link to User
  authorAvatar: string;
  content: string;
  timeAgo: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  likes: number;
  // Added fields
  language: string;
  isEdited: boolean;
  likedBy: string[]; // Array of user IDs
  parentId?: number; // For nested replies
}

// Group types
export interface Group {
  id: number;
  name: string;
  description: string;
  members: number;
  icon: string;
  coverImage: string;
  creatorId: string;
  memberIds?: string[];
  // Added fields
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  category: string;
  tags: string[];
  isPrivate: boolean;
  moderatorIds: string[];
  language: string;
}

// New GroupPost type for group discussions
export interface GroupPost {
  id: number;
  groupId: number;
  title?: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  comments: number;
  hasAttachment: boolean;
  attachmentUrl?: string;
  language: string;
}

// New GroupComment type for comments on group posts
export interface GroupComment {
  id: number;
  groupId: number;
  postId: number;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  language: string;
}

// Resource types
export interface Resource {
  id: number;
  title: string;
  description: string;
  type: "Document" | "Audio" | "Video" | "Link" | "Image";
  category: string;
  author: string;
  authorId: string; // Added to link to User
  dateAdded: string;
  createdAt: string; // ISO date string
  updatedAt?: string; // ISO date string
  downloads: number;
  imageUrl: string;
  fileUrl: string;
  // Added fields
  tags: string[];
  language: string;
  size?: number; // File size in bytes
  format?: string; // File format (PDF, MP3, etc.)
  isApproved: boolean;
  approvedBy?: string; // User ID of approver
}

// New Category type for organizing discussions and resources
export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  parentId?: number; // For nested categories
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

// New Tag type for tagging content
export interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  count: number; // Number of items using this tag
}

// New Language type for multilingual support
export interface Language {
  code: string; // ISO language code (e.g., 'en', 'sz', 'my')
  name: string; // Display name (e.g., 'English', 'Sizang', 'Burmese')
  nativeName: string; // Name in the language itself
  isActive: boolean;
  isDefault: boolean;
  direction: 'ltr' | 'rtl'; // Text direction
}

// New Notification type for user notifications
export interface Notification {
  id: number;
  userId: string;
  type: 'comment' | 'like' | 'mention' | 'group_invite' | 'group_post' | 'resource';
  content: string;
  relatedId: number; // ID of the related item (discussion, comment, etc.)
  relatedType: string; // Type of the related item
  createdAt: string;
  isRead: boolean;
}

// Add new Permission type
export type Permission = 
  | "manageUsers" 
  | "manageContent" 
  | "moderateContent" 
  | "createContent" 
  | "editOwnContent" 
  | "deleteOwnContent" 
  | "viewPrivateContent";

// Add new RolePermissions type
export interface RolePermissions {
  admin: Permission[];
  moderator: Permission[];
  member: Permission[];
  guest: Permission[];
}