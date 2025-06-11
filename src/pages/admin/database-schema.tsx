import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab, Divider, Code } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const DatabaseSchemaPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState("users");
  
  return (
    <motion.div 
      className="max-w-6xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Database Schema</h1>
          <p className="text-foreground-600">Database structure and models for the Sizang Community Hub</p>
        </div>
      </div>
      
      <Card className="border border-divider/40 shadow-md">
        <CardHeader>
          <Tabs 
            selectedKey={selectedTab} 
            onSelectionChange={setSelectedTab as any}
            aria-label="Database schema tabs"
            color="primary"
            variant="underlined"
          >
            <Tab key="users" title="Users" />
            <Tab key="discussions" title="Discussions" />
            <Tab key="groups" title="Groups" />
            <Tab key="resources" title="Resources" />
            <Tab key="categories" title="Categories & Tags" />
            <Tab key="languages" title="Languages" />
          </Tabs>
        </CardHeader>
        <CardBody className="p-6">
          {selectedTab === "users" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:users" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Users</h2>
              </div>
              
              <p className="mb-4">The User model stores information about community members, including their roles and preferences.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface User {
  id: string;               // Unique identifier
  name: string;             // Full name
  email: string;            // Email address
  avatar?: string;          // Profile picture URL
  role: "admin" | "moderator" | "member";  // User role
  joinDate: string;         // When user joined
  bio?: string;             // User biography
  location?: string;        // User location
  language?: string[];      // Preferred languages
  lastActive?: string;      // Last active timestamp
  isVerified: boolean;      // Email verification status
}`}
                </Code>
              </div>
              
              <Divider className="my-6" />
              
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:bell" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Notifications</h2>
              </div>
              
              <p className="mb-4">The Notification model tracks user notifications for various activities.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Notification {
  id: number;               // Unique identifier
  userId: string;           // User receiving the notification
  type: 'comment' | 'like' | 'mention' | 'group_invite' | 'group_post' | 'resource';
  content: string;          // Notification message
  relatedId: number;        // ID of related item
  relatedType: string;      // Type of related item
  createdAt: string;        // Creation timestamp
  isRead: boolean;          // Read status
}`}
                </Code>
              </div>
            </div>
          )}
          
          {selectedTab === "discussions" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:message-square" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Discussions</h2>
              </div>
              
              <p className="mb-4">The Discussion model represents forum threads with categorization and metadata.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Discussion {
  id: number;               // Unique identifier
  title: string;            // Discussion title
  author: string;           // Author name
  authorId: string;         // Author ID (links to User)
  authorAvatar: string;     // Author avatar URL
  category: string;         // Primary category
  content: string;          // Discussion content
  timeAgo: string;          // Relative time (display only)
  createdAt: string;        // Creation timestamp
  updatedAt?: string;       // Last update timestamp
  comments: number;         // Comment count
  likes: number;            // Like count
  hasImage: boolean;        // Has attached image
  imageUrl?: string;        // Image URL if present
  tags: string[];           // Associated tags
  language: string;         // Content language
  isPinned: boolean;        // Pinned status
  isLocked: boolean;        // Locked status (no new comments)
  viewCount: number;        // View count
  likedBy: string[];        // User IDs who liked
}`}
                </Code>
              </div>
              
              <Divider className="my-6" />
              
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:message-circle" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Comments</h2>
              </div>
              
              <p className="mb-4">The Comment model represents responses to discussions with nesting support.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Comment {
  id: number;               // Unique identifier
  discussionId: number;     // Parent discussion ID
  author: string;           // Author name
  authorId: string;         // Author ID (links to User)
  authorAvatar: string;     // Author avatar URL
  content: string;          // Comment content
  timeAgo: string;          // Relative time (display only)
  createdAt: string;        // Creation timestamp
  updatedAt?: string;       // Last update timestamp
  likes: number;            // Like count
  language: string;         // Content language
  isEdited: boolean;        // Edit status
  likedBy: string[];        // User IDs who liked
  parentId?: number;        // Parent comment ID for replies
}`}
                </Code>
              </div>
            </div>
          )}
          
          {selectedTab === "groups" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:users" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Groups</h2>
              </div>
              
              <p className="mb-4">The Group model represents community sub-groups with membership tracking.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Group {
  id: number;               // Unique identifier
  name: string;             // Group name
  description: string;      // Group description
  members: number;          // Member count
  icon: string;             // Group icon
  coverImage: string;       // Cover image URL
  creatorId: string;        // Creator user ID
  memberIds?: string[];     // Member user IDs
  createdAt: string;        // Creation timestamp
  updatedAt?: string;       // Last update timestamp
  category: string;         // Group category
  tags: string[];           // Associated tags
  isPrivate: boolean;       // Privacy setting
  moderatorIds: string[];   // Moderator user IDs
  language: string;         // Primary language
}`}
                </Code>
              </div>
              
              <Divider className="my-6" />
              
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:file-text" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Group Posts</h2>
              </div>
              
              <p className="mb-4">The GroupPost model represents content shared within groups.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface GroupPost {
  id: number;               // Unique identifier
  groupId: number;          // Parent group ID
  title?: string;           // Optional post title
  content: string;          // Post content
  authorId: string;         // Author user ID
  authorName: string;       // Author name
  authorAvatar: string;     // Author avatar URL
  createdAt: string;        // Creation timestamp
  updatedAt?: string;       // Last update timestamp
  likes: number;            // Like count
  comments: number;         // Comment count
  hasAttachment: boolean;   // Has attachment
  attachmentUrl?: string;   // Attachment URL if present
  language: string;         // Content language
}`}
                </Code>
              </div>
              
              <Divider className="my-6" />
              
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:message-circle" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Group Comments</h2>
              </div>
              
              <p className="mb-4">The GroupComment model represents responses to group posts.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface GroupComment {
  id: number;               // Unique identifier
  groupId: number;          // Parent group ID
  postId: number;           // Parent post ID
  content: string;          // Comment content
  authorId: string;         // Author user ID
  authorName: string;       // Author name
  authorAvatar: string;     // Author avatar URL
  createdAt: string;        // Creation timestamp
  updatedAt?: string;       // Last update timestamp
  likes: number;            // Like count
  language: string;         // Content language
}`}
                </Code>
              </div>
            </div>
          )}
          
          {selectedTab === "resources" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:file" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Resources</h2>
              </div>
              
              <p className="mb-4">The Resource model represents shared files and links with metadata.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Resource {
  id: number;               // Unique identifier
  title: string;            // Resource title
  description: string;      // Resource description
  type: "Document" | "Audio" | "Video" | "Link" | "Image";
  category: string;         // Resource category
  author: string;           // Author name
  authorId: string;         // Author user ID
  dateAdded: string;        // Date added (display format)
  createdAt: string;        // Creation timestamp
  updatedAt?: string;       // Last update timestamp
  downloads: number;        // Download count
  imageUrl: string;         // Preview image URL
  fileUrl: string;          // File or link URL
  tags: string[];           // Associated tags
  language: string;         // Resource language
  size?: number;            // File size in bytes
  format?: string;          // File format
  isApproved: boolean;      // Approval status
  approvedBy?: string;      // Approver user ID
}`}
                </Code>
              </div>
            </div>
          )}
          
          {selectedTab === "categories" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:folder" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Categories</h2>
              </div>
              
              <p className="mb-4">The Category model organizes discussions and resources with hierarchical support.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Category {
  id: number;               // Unique identifier
  name: string;             // Category name
  description: string;      // Category description
  slug: string;             // URL-friendly identifier
  parentId?: number;        // Parent category ID
  icon?: string;            // Category icon
  color?: string;           // Category color
  order: number;            // Display order
  isActive: boolean;        // Active status
}`}
                </Code>
              </div>
              
              <Divider className="my-6" />
              
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:tag" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Tags</h2>
              </div>
              
              <p className="mb-4">The Tag model provides flexible content categorization across the platform.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Tag {
  id: number;               // Unique identifier
  name: string;             // Tag name
  slug: string;             // URL-friendly identifier
  color?: string;           // Tag color
  count: number;            // Usage count
}`}
                </Code>
              </div>
            </div>
          )}
          
          {selectedTab === "languages" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="lucide:globe" className="text-xl text-primary" />
                <h2 className="text-xl font-bold">Languages</h2>
              </div>
              
              <p className="mb-4">The Language model supports multilingual content across the platform.</p>
              
              <div className="bg-content2 p-4 rounded-lg overflow-x-auto">
                <Code>
{`interface Language {
  code: string;             // ISO language code
  name: string;             // Display name
  nativeName: string;       // Name in the language itself
  isActive: boolean;        // Active status
  isDefault: boolean;       // Default language flag
  direction: 'ltr' | 'rtl'; // Text direction
}`}
                </Code>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};