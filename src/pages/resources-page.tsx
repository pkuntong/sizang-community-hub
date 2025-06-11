import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Tabs, Tab, Chip, Input, Select, SelectItem, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useResources } from "../context/resource-context";
import { useAuth } from "../components/auth/auth-context";

export const ResourcesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  
  const { resources, isLoading, error, downloadResource, getResourcesByCategory } = useResources();
  const { isAuthenticated } = useAuth();
  
  const filteredResources = React.useMemo(() => {
    let filtered = getResourcesByCategory(selectedCategory);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(query) || 
        resource.description.toLowerCase().includes(query) ||
        resource.author.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [resources, selectedCategory, searchQuery, getResourcesByCategory]);
  
  const handleDownload = (id: number) => {
    downloadResource(id);
  };
  
  const handleUploadResource = (data: {
    title: string;
    description: string;
    type: "Document" | "Audio" | "Video" | "Link" | "Image";
    category: string;
    file?: File;
  }) => {
    console.log("Uploading resource:", data);
    setIsUploadModalOpen(false);
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

  const getIconForType = (type: string) => {
    switch(type) {
      case "Document": return "lucide:file-text";
      case "Audio": return "lucide:music";
      case "Video": return "lucide:video";
      default: return "lucide:file";
    }
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
          <h1 className="text-3xl font-bold mb-2">Resources</h1>
          <p className="text-foreground-600">Explore and share resources related to Sizang culture, language, and history</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
            className="w-full md:w-64"
          />
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:upload" />}
            onPress={() => setIsUploadModalOpen(true)}
            isDisabled={!isAuthenticated}
          >
            Upload
          </Button>
        </div>
      </div>
      
      <Card className="border border-divider/40 shadow-md overflow-hidden mb-6">
        <CardHeader className="bg-content1 border-b border-divider/40">
          <Tabs 
            selectedKey={selectedCategory} 
            onSelectionChange={setSelectedCategory as any}
            aria-label="Resource categories"
            color="primary"
            variant="underlined"
            classNames={{
              tab: "h-10 data-[hover=true]:text-primary",
              tabContent: "group-data-[selected=true]:text-primary font-medium",
              cursor: "bg-primary"
            }}
          >
            <Tab key="all" title="All Resources" />
            <Tab key="language" title="Language" />
            <Tab key="history" title="History" />
            <Tab key="culture" title="Culture" />
            <Tab key="education" title="Education" />
            <Tab key="media" title="Media" />
          </Tabs>
        </CardHeader>
      </Card>
      
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
      ) : filteredResources.length === 0 ? (
        <div className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <Icon icon="lucide:file-x" className="text-foreground-400 text-5xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No resources found</h3>
          <p className="text-foreground-500 mb-4">
            {searchQuery ? "Try a different search term" : selectedCategory !== "all" ? "Try a different category" : "Be the first to upload a resource!"}
          </p>
          {isAuthenticated && (
            <Button 
              color="primary"
              onPress={() => setIsUploadModalOpen(true)}
            >
              Upload Resource
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
          {filteredResources.map((resource) => (
            <motion.div key={resource.id} variants={itemVariants}>
              <Card className="border border-divider/40 shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img 
                      src={resource.imageUrl} 
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{resource.title}</h3>
                      <Chip 
                        size="sm" 
                        color="primary" 
                        variant="flat" 
                        startContent={<Icon icon={getIconForType(resource.type)} size={14} />}
                      >
                        {resource.type}
                      </Chip>
                    </div>
                    <p className="text-foreground-600 mb-3 line-clamp-2">{resource.description}</p>
                    <div className="text-xs text-foreground-400 mb-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Icon icon="lucide:user" size={14} />
                        <span>{resource.author}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Icon icon="lucide:calendar" size={14} />
                        <span>{resource.dateAdded}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:download" size={14} />
                        <span>{resource.downloads} downloads</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        color="primary"
                        startContent={<Icon icon="lucide:download" size={16} />}
                        onPress={() => handleDownload(resource.id)}
                      >
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        variant="flat"
                        startContent={<Icon icon="lucide:share-2" size={16} />}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Upload Resource Modal */}
      <Modal 
        isOpen={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Resource
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Title"
                    placeholder="Enter a title for your resource"
                    isRequired
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="Describe your resource..."
                    minRows={3}
                    isRequired
                  />
                  
                  <div className="flex gap-4">
                    <Select
                      label="Type"
                      placeholder="Select type"
                      className="flex-1"
                      isRequired
                    >
                      <SelectItem key="document" value="Document">Document</SelectItem>
                      <SelectItem key="audio" value="Audio">Audio</SelectItem>
                      <SelectItem key="video" value="Video">Video</SelectItem>
                      <SelectItem key="image" value="Image">Image</SelectItem>
                      <SelectItem key="link" value="Link">Link</SelectItem>
                    </Select>
                    
                    <Select
                      label="Category"
                      placeholder="Select category"
                      className="flex-1"
                      isRequired
                    >
                      <SelectItem key="language" value="Language">Language</SelectItem>
                      <SelectItem key="history" value="History">History</SelectItem>
                      <SelectItem key="culture" value="Culture">Culture</SelectItem>
                      <SelectItem key="education" value="Education">Education</SelectItem>
                      <SelectItem key="media" value="Media">Media</SelectItem>
                    </Select>
                  </div>
                  
                  <div className="border border-dashed border-divider rounded-lg p-4 flex flex-col items-center justify-center gap-2">
                    <Icon icon="lucide:file-plus" className="text-2xl text-foreground-400" />
                    <p className="text-sm text-foreground-500">Drag and drop your file or click to browse</p>
                    <Button
                      variant="flat"
                      color="primary"
                      size="sm"
                      startContent={<Icon icon="lucide:upload" />}
                    >
                      Select File
                    </Button>
                    <p className="text-xs text-foreground-400">Max file size: 50MB</p>
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
                    handleUploadResource({
                      title: "New Resource", // In a real app, this would come from form inputs
                      description: "Resource description",
                      type: "Document",
                      category: "Culture"
                    });
                    onClose();
                  }}
                >
                  Upload
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};