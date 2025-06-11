import React from "react";
import { Card, CardBody, CardHeader, Avatar, Button, Tabs, Tab, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAuth } from "../../components/auth/auth-context";

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState("profile");
  const [isEditing, setIsEditing] = React.useState(false);
  
  // Form state
  const [name, setName] = React.useState(user?.name || "");
  const [bio, setBio] = React.useState("Sizang community member");
  const [location, setLocation] = React.useState("Dallas, TX");
  
  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-divider/40 shadow-md overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-primary-100 to-primary-50 relative">
          <Button
            isIconOnly
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-md"
            variant="flat"
            size="sm"
          >
            <Icon icon="lucide:camera" />
          </Button>
        </div>
        
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-16 left-6 border-4 border-background rounded-full">
            <Avatar
              src={user?.avatar || "https://img.heroui.chat/image/avatar?w=150&h=150&u=1"}
              className="w-32 h-32"
            />
          </div>
          
          <div className="mt-20 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-foreground-500">@{user?.name.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
            
            {!isEditing ? (
              <Button
                color="primary"
                variant="flat"
                onPress={() => setIsEditing(true)}
                startContent={<Icon icon="lucide:edit" />}
              >
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="flat"
                  onPress={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSaveProfile}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          
          <Tabs 
            selectedKey={selectedTab} 
            onSelectionChange={setSelectedTab as any}
            aria-label="Profile tabs"
            className="mt-6"
            color="primary"
            variant="underlined"
          >
            <Tab key="profile" title="Profile" />
            <Tab key="activity" title="Activity" />
            <Tab key="groups" title="Groups" />
            <Tab key="resources" title="Resources" />
          </Tabs>
        </div>
      </Card>
      
      <div className="mt-6">
        {selectedTab === "profile" && (
          <Card className="border border-divider/40 shadow-md">
            <CardBody className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="bordered"
                  />
                  
                  <Textarea
                    label="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    variant="bordered"
                    minRows={3}
                  />
                  
                  <Input
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="bordered"
                    startContent={<Icon icon="lucide:map-pin" className="text-foreground-400" />}
                  />
                  
                  <Input
                    label="Email"
                    value={user?.email || ""}
                    isReadOnly
                    variant="bordered"
                    startContent={<Icon icon="lucide:mail" className="text-foreground-400" />}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-foreground-600">{bio}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:map-pin" className="text-foreground-400" />
                      <span>{location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:mail" className="text-foreground-400" />
                      <span>{user?.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:calendar" className="text-foreground-400" />
                      <span>Joined April 2023</span>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}
        
        {selectedTab === "activity" && (
          <Card className="border border-divider/40 shadow-md">
            <CardBody className="p-6">
              <div className="text-center py-12">
                <Icon icon="lucide:activity" className="text-foreground-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Recent Activity</h3>
                <p className="text-foreground-500 mb-6">Your activity will appear here once you start participating in discussions.</p>
                <Button 
                  color="primary"
                  href="/forums"
                  as="a"
                >
                  Browse Forums
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        
        {selectedTab === "groups" && (
          <Card className="border border-divider/40 shadow-md">
            <CardBody className="p-6">
              <div className="text-center py-12">
                <Icon icon="lucide:users" className="text-foreground-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Groups Joined</h3>
                <p className="text-foreground-500 mb-6">You haven't joined any groups yet. Find groups to connect with community members.</p>
                <Button 
                  color="primary"
                  href="/groups"
                  as="a"
                >
                  Explore Groups
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
        
        {selectedTab === "resources" && (
          <Card className="border border-divider/40 shadow-md">
            <CardBody className="p-6">
              <div className="text-center py-12">
                <Icon icon="lucide:file" className="text-foreground-300 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Resources Shared</h3>
                <p className="text-foreground-500 mb-6">You haven't shared any resources yet. Upload resources to help the community.</p>
                <Button 
                  color="primary"
                  href="/resources"
                  as="a"
                >
                  Browse Resources
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </motion.div>
  );
};