import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab, Button, Input, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { DiscussionPost } from "../components/discussion-post";
import { NewDiscussionModal } from "../components/new-discussion-modal";
import { useDiscussions } from "../context/discussion-context";
import { useAuth } from "../components/auth/auth-context";
import { PermissionGuard } from "../components/permission-guard";

export const ForumsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Replace static data with context
  const { discussions, isLoading, error, createDiscussion } = useDiscussions();
  const { isAuthenticated } = useAuth();
  
  // Add state for the new discussion modal
  const [isNewDiscussionModalOpen, setIsNewDiscussionModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  
  // Add missing animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Filter discussions based on category and search query
  const filteredDiscussions = React.useMemo(() => {
    let filtered = discussions;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(d => 
        d.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.title.toLowerCase().includes(query) || 
        d.content.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [discussions, selectedCategory, searchQuery]);

  const handleCreateDiscussion = async (data: {
    title: string;
    content: string;
    category: string;
    image?: File;
  }) => {
    try {
      await createDiscussion({
        title: data.title,
        content: data.content,
        category: data.category,
        author: "You", // In a real app, this would come from the user profile
        authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=99",
        hasImage: !!data.image,
        imageUrl: data.image ? "https://img.heroui.chat/image/fashion?w=600&h=400&u=99" : undefined // In a real app, this would be the uploaded image URL
      });
    } catch (error) {
      console.error("Error creating discussion:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forums</h1>
          <p className="text-foreground-600">Join discussions on various topics with the Sizang community</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
            className="w-full md:w-64"
          />
          <PermissionGuard 
            permission="createContent"
            fallback={
              <Button
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => history.push("/auth/sign-in")}
                className="mb-4"
              >
                Sign in to create discussion
              </Button>
            }
          >
            <Button
              color="primary"
              startContent={<Icon icon="lucide:plus" />}
              onPress={() => setIsCreateModalOpen(true)}
              className="mb-4"
            >
              New Discussion
            </Button>
          </PermissionGuard>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          {/* Wrap the new discussion button with PermissionGuard */}
          <PermissionGuard 
            permission="createContent"
            fallback={
              <Button
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => history.push("/auth/sign-in")}
                className="mb-4"
              >
                Sign in to create discussion
              </Button>
            }
          >
            <Button
              color="primary"
              startContent={<Icon icon="lucide:plus" />}
              onPress={() => setIsCreateModalOpen(true)}
              className="mb-4"
            >
              New Discussion
            </Button>
          </PermissionGuard>
          
          {/* ... existing discussion feed ... */}
        </div>
        
        {/* ... existing sidebar ... */}
      </div>
      
      {/* ... existing modals ... */}
    </div>
  );
};