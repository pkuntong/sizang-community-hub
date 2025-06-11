import React from "react";
import { Card, CardBody, CardHeader, Button, Avatar, Input, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useGroups } from "../context/group-context";
import { useAuth } from "../components/auth/auth-context";

export const GroupsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  
  // Replace static data with context
  const { groups, isLoading, error, joinGroup, leaveGroup, createGroup, isUserInGroup } = useGroups();
  const { isAuthenticated, user } = useAuth();
  
  // Filter groups based on search query
  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return groups;
    
    const query = searchQuery.toLowerCase();
    return groups.filter(group => 
      group.name.toLowerCase().includes(query) || 
      group.description.toLowerCase().includes(query)
    );
  }, [groups, searchQuery]);
  
  const handleCreateGroup = async (data: {
    name: string;
    description: string;
    icon: string;
  }) => {
    if (!user) return;
    
    try {
      await createGroup({
        name: data.name,
        description: data.description,
        icon: data.icon || "lucide:users",
        coverImage: "https://img.heroui.chat/image/places?w=800&h=300&u=99", // In a real app, this would be the uploaded image
        creatorId: user.id
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };
  
  const handleGroupAction = (groupId: number) => {
    if (isUserInGroup(groupId)) {
      leaveGroup(groupId);
    } else {
      joinGroup(groupId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Groups</h1>
          <p className="text-foreground-600">Join groups based on shared interests and connect with community members</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
            className="w-full md:w-64"
          />
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:plus" />}
            onPress={() => setIsCreateModalOpen(true)}
            isDisabled={!isAuthenticated}
          >
            Create Group
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner color="primary" size="lg" />
        </div>
      ) : error ? (
        <div className="p-6 text-center text-danger">
          <p>{error}</p>
          <Button 
            color="primary" 
            variant="light" 
            className="mt-2"
            onPress={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <Icon icon="lucide:users-x" className="text-foreground-400 text-5xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No groups found</h3>
          <p className="text-foreground-500 mb-4">
            {searchQuery ? "Try a different search term" : "Be the first to create a group!"}
          </p>
          {isAuthenticated && (
            <Button 
              color="primary"
              onPress={() => setIsCreateModalOpen(true)}
            >
              Create Group
            </Button>
          )}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredGroups.map((group) => (
            <motion.div key={group.id} variants={itemVariants}>
              <Card className="border border-divider/40 shadow-md overflow-hidden">
                <div className="relative h-40">
                  <img 
                    src={group.coverImage} 
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
                      <Icon icon={group.icon} className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{group.name}</h3>
                      <p className="text-white/80 text-xs">{group.members} members</p>
                    </div>
                  </div>
                </div>
                <CardBody className="p-4">
                  <p className="text-foreground-600 mb-4">{group.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <Avatar 
                          key={i}
                          src={`https://img.heroui.chat/image/avatar?w=40&h=40&u=${group.id * 10 + i}`} 
                          className="border-2 border-background" 
                          size="sm"
                        />
                      ))}
                      <div className="w-8 h-8 rounded-full bg-content2 flex items-center justify-center text-xs font-medium border-2 border-background">
                        +{group.members - 3}
                      </div>
                    </div>
                    <Button 
                      color={isUserInGroup(group.id) ? "default" : "primary"} 
                      size="sm"
                      onPress={() => handleGroupAction(group.id)}
                      isDisabled={!isAuthenticated}
                    >
                      {isUserInGroup(group.id) ? "Leave Group" : "Join Group"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Create Group Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Group
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Group Name"
                    placeholder="Enter a name for your group"
                    isRequired
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="Describe what your group is about..."
                    minRows={3}
                    isRequired
                  />
                  
                  <div className="border border-dashed border-divider rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                    <Icon icon="lucide:image" className="text-2xl text-foreground-400" />
                    <p className="text-sm text-foreground-500">Upload a cover image for your group</p>
                    <Button
                      variant="flat"
                      color="primary"
                      size="sm"
                      startContent={<Icon icon="lucide:upload" />}
                    >
                      Upload Image
                    </Button>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={() => {
                    handleCreateGroup({
                      name: "New Group", // In a real app, this would come from form inputs
                      description: "Group description",
                      icon: "lucide:users"
                    });
                    onClose();
                  }}
                >
                  Create Group
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};