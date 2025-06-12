import React from "react";
import { Avatar, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategories } from "../context/category-context";
import { useAuth } from "./auth/auth-context";
import { NotificationService } from "../services/notification-service";

interface DiscussionPostProps {
  post: {
    id: number;
    title: string;
    author: string;
    authorAvatar: string;
    category: string;
    content: string;
    timeAgo: string;
    comments: number;
    likes: number;
    hasImage: boolean;
    imageUrl?: string;
    authorId?: string; // Add authorId for permission checks
  };
  onClick?: () => void; // Add onClick prop for navigation
}

export const DiscussionPost: React.FC<DiscussionPostProps> = ({ post, onClick }) => {
  // Add translation hook
  const { t, i18n } = useTranslation();
  // Add navigate for navigation
  const navigate = useNavigate();
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Add auth context
  const { canManageContent, canDeleteContent } = useAuth();
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  // Detect if content is in a different language than the UI
  const contentLanguage = post.contentLanguage || "en";
  const isContentDifferentLanguage = contentLanguage !== i18n.language;

  // Add comment handler
  const handleComment = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the post click
    
    // In a real app, this would open a comment form
    // For demo, we'll just simulate sending a notification
    if (post.authorId && user) {
      // Get the post author (in a real app, this would be a database query)
      const postAuthor = {
        id: post.authorId,
        name: post.author,
        email: "author@example.com", // In a real app, this would be the actual email
        avatar: post.authorAvatar
      };
      
      // Send notification to the post author
      await NotificationService.sendForumReplyNotification(
        postAuthor,
        post.title,
        user.name,
        "This is a comment on your post. In a real app, this would be the actual comment text."
      );
    }
  };

  return (
    <motion.div 
      className="p-4 hover:bg-content2/50 transition-colors cursor-pointer"
      variants={itemVariants}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <Avatar 
          src={post.authorAvatar} 
          className="flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{post.author}</span>
            <span className="text-foreground-400 text-xs">• {post.timeAgo}</span>
            <Chip 
              size="sm" 
              color="primary" 
              variant="flat" 
              className="ml-auto"
            >
              {post.category}
            </Chip>
            
            {/* Add language indicator if content is in different language */}
            {isContentDifferentLanguage && post.language && (
              <Chip 
                size="sm" 
                variant="flat" 
                color="default" 
                className="ml-2"
              >
                {post.language.toUpperCase()}
              </Chip>
            )}
          </div>
          
          <h3 className="font-semibold mb-2">{post.title}</h3>
          <p className="text-foreground-600 mb-3 line-clamp-3">{post.content}</p>
          
          {post.hasImage && post.imageUrl && (
            <div className="mb-3 rounded-md overflow-hidden">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Button 
              size="sm" 
              variant="light" 
              startContent={<Icon icon="lucide:message-circle" />}
              onPress={handleComment} // Add comment handler
            >
              {post.comments}
            </Button>
            <Button 
              size="sm" 
              variant="light" 
              startContent={<Icon icon="lucide:heart" />}
            >
              {post.likes}
            </Button>
            
            {/* Only show share button if user can create content */}
            {canManageContent(post.authorId) && (
              <Button 
                size="sm" 
                variant="light" 
                startContent={<Icon icon="lucide:share-2" />}
              >
                {t('forums.share')}
              </Button>
            )}
            
            {/* Show edit/delete buttons for content owners or moderators */}
            {canManageContent(post.authorId) && (
              <Button 
                size="sm" 
                variant="light" 
                startContent={<Icon icon="lucide:edit-3" />}
              >
                Edit
              </Button>
            )}
            
            {canDeleteContent(post.authorId) && (
              <Button 
                size="sm" 
                variant="light" 
                color="danger"
                startContent={<Icon icon="lucide:trash-2" />}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};