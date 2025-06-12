import React from "react";
import { Card, CardBody, CardHeader, Avatar, Button, Textarea, Divider, Chip, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDiscussions } from "../context/discussion-context";
import { useAuth } from "../components/auth/auth-context";

interface Comment {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  timeAgo: string;
  likes: number;
}

interface DiscussionDetailPageProps {
  match?: {
    params: {
      id: string;
    };
  };
}

export const DiscussionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const discussionId = parseInt(id || "0");
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  
  // Replace static data with context
  const { 
    selectedDiscussion, 
    comments, 
    isLoading, 
    error, 
    fetchDiscussionById, 
    likeDiscussion, 
    addComment, 
    likeComment 
  } = useDiscussions();
  
  const { user, isAuthenticated } = useAuth();
  
  // Fetch discussion data when component mounts or ID changes
  React.useEffect(() => {
    if (discussionId) {
      fetchDiscussionById(discussionId);
    }
  }, [discussionId, fetchDiscussionById]);
  
  const handleSubmitComment = async () => {
    if (!comment.trim() || !discussionId) return;
    
    setIsSubmitting(true);
    try {
      await addComment(discussionId, comment);
      setComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLikeDiscussion = () => {
    if (selectedDiscussion) {
      likeDiscussion(selectedDiscussion.id);
    }
  };
  
  const handleLikeComment = (commentId: number) => {
    if (discussionId) {
      likeComment(discussionId, commentId);
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }
  
  if (error || !selectedDiscussion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Icon icon="lucide:alert-circle" className="text-danger text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Discussion not found</h2>
        <p className="text-foreground-500 mb-6">The discussion you're looking for doesn't exist or has been removed.</p>
        <Button 
          color="primary"
          onPress={() => navigate("/forums")}
          startContent={<Icon icon="lucide:arrow-left" />}
        >
          Back to Forums
        </Button>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <Link to="/forums" className="flex items-center gap-2 text-primary mb-4 hover:underline">
          <Icon icon="lucide:arrow-left" />
          <span>Back to Forums</span>
        </Link>
        
        <Card className="border border-divider/40 shadow-md overflow-hidden">
          <CardBody className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={selectedDiscussion.authorAvatar} className="flex-shrink-0" isBordered color="primary" />
              <div>
                <div className="font-semibold">{selectedDiscussion.author}</div>
                <div className="text-foreground-400 text-xs">{selectedDiscussion.timeAgo}</div>
              </div>
              <Chip size="sm" color="primary" variant="flat" className="ml-auto">
                {selectedDiscussion.category}
              </Chip>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{selectedDiscussion.title}</h1>
            
            <div className="prose max-w-none mb-6">
              {selectedDiscussion.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground-600">{paragraph}</p>
              ))}
            </div>
            
            {selectedDiscussion.hasImage && selectedDiscussion.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden border border-divider/40">
                <img 
                  src={selectedDiscussion.imageUrl} 
                  alt={selectedDiscussion.title}
                  className="w-full object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <Button 
                size="sm" 
                variant="flat" 
                color="primary"
                className="font-medium"
                startContent={<Icon icon="lucide:heart" />}
                onPress={handleLikeDiscussion}
              >
                {selectedDiscussion.likes}
              </Button>
              <Button 
                size="sm" 
                variant="flat" 
                color="primary"
                className="font-medium"
                startContent={<Icon icon="lucide:bookmark" />}
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="flat" 
                color="primary"
                className="font-medium"
                startContent={<Icon icon="lucide:share-2" />}
              >
                Share
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
        
        <Card className="border border-divider/40 shadow-md overflow-hidden mb-6">
          <CardBody className="p-6">
            <div className="flex gap-4">
              <Avatar 
                src={user?.avatar || "https://img.heroui.chat/image/avatar?w=150&h=150&u=99"} 
                className="flex-shrink-0" 
              />
              <div className="flex-grow">
                <Textarea
                  placeholder={isAuthenticated ? "Add your comment..." : "Sign in to comment"}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-3 w-full"
                  minRows={3}
                  isDisabled={!isAuthenticated}
                />
                <div className="flex justify-end">
                  <Button 
                    color="primary" 
                    isDisabled={!isAuthenticated || !comment.trim()}
                    isLoading={isSubmitting}
                    onPress={handleSubmitComment}
                  >
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="lucide:message-square" className="text-foreground-300 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No comments yet</h3>
            <p className="text-foreground-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          >
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border border-divider/40 shadow-sm overflow-hidden">
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar src={comment.authorAvatar} className="flex-shrink-0" />
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <div className="font-semibold">{comment.author}</div>
                          <div className="text-foreground-400 text-xs">{comment.timeAgo}</div>
                        </div>
                        <p className="text-foreground-600 mb-3">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button 
                            size="sm" 
                            variant="light" 
                            startContent={<Icon icon="lucide:heart" />}
                            onPress={() => handleLikeComment(comment.id)}
                          >
                            {comment.likes}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="light" 
                            startContent={<Icon icon="lucide:message-circle" />}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};