import React, { createContext, useContext, useState, useEffect } from "react";
import { Discussion, Comment, User } from "../types";
import { ApiService } from "../services/api-service";
import { useAuth } from "../components/auth/auth-context";
import { addToast } from "@heroui/react";

interface DiscussionContextType {
  discussions: Discussion[];
  isLoading: boolean;
  error: string | null;
  selectedDiscussion: Discussion | null;
  comments: Comment[];
  fetchDiscussions: () => Promise<void>;
  fetchDiscussionById: (id: number) => Promise<void>;
  createDiscussion: (discussion: Omit<Discussion, "id" | "timeAgo" | "comments" | "likes">) => Promise<Discussion>;
  likeDiscussion: (id: number) => Promise<void>;
  addComment: (discussionId: number, content: string) => Promise<void>;
  likeComment: (discussionId: number, commentId: number) => Promise<void>;
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined);

export const DiscussionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDiscussions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.getDiscussions();
      setDiscussions(data);
    } catch (err) {
      setError("Failed to fetch discussions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDiscussionById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const discussion = await ApiService.getDiscussionById(id);
      if (discussion) {
        setSelectedDiscussion(discussion);
        const commentsData = await ApiService.getCommentsByDiscussionId(id);
        setComments(commentsData);
      } else {
        setError("Discussion not found");
      }
    } catch (err) {
      setError("Failed to fetch discussion");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createDiscussion = async (discussion: Omit<Discussion, "id" | "timeAgo" | "comments" | "likes">) => {
    setIsLoading(true);
    setError(null);
    try {
      const newDiscussion = await ApiService.createDiscussion(discussion);
      setDiscussions(prev => [newDiscussion, ...prev]);
      addToast({
        title: "Success!",
        description: "Your discussion has been created",
        color: "success"
      });
      return newDiscussion;
    } catch (err) {
      setError("Failed to create discussion");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const likeDiscussion = async (id: number) => {
    try {
      const updatedDiscussion = await ApiService.likeDiscussion(id);
      
      // Update discussions list
      setDiscussions(prev => 
        prev.map(d => d.id === id ? updatedDiscussion : d)
      );
      
      // Update selected discussion if it's the one being liked
      if (selectedDiscussion && selectedDiscussion.id === id) {
        setSelectedDiscussion(updatedDiscussion);
      }
    } catch (err) {
      console.error("Failed to like discussion:", err);
    }
  };

  const addComment = async (discussionId: number, content: string) => {
    if (!user) {
      addToast({
        title: "Authentication required",
        description: "Please sign in to comment",
        color: "warning"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const newComment = await ApiService.addComment(discussionId, content, user);
      setComments(prev => [newComment, ...prev]);
      
      // Update discussion comment count
      if (selectedDiscussion && selectedDiscussion.id === discussionId) {
        setSelectedDiscussion({
          ...selectedDiscussion,
          comments: selectedDiscussion.comments + 1
        });
      }
      
      // Update in the discussions list too
      setDiscussions(prev => 
        prev.map(d => d.id === discussionId 
          ? { ...d, comments: d.comments + 1 } 
          : d
        )
      );
    } catch (err) {
      console.error("Failed to add comment:", err);
      addToast({
        title: "Error",
        description: "Failed to post your comment",
        color: "danger"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const likeComment = async (discussionId: number, commentId: number) => {
    try {
      const updatedComment = await ApiService.likeComment(discussionId, commentId);
      setComments(prev => 
        prev.map(c => c.id === commentId ? updatedComment : c)
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  // Load discussions on initial mount
  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <DiscussionContext.Provider
      value={{
        discussions,
        isLoading,
        error,
        selectedDiscussion,
        comments,
        fetchDiscussions,
        fetchDiscussionById,
        createDiscussion,
        likeDiscussion,
        addComment,
        likeComment
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
};

export const useDiscussions = () => {
  const context = useContext(DiscussionContext);
  if (context === undefined) {
    throw new Error("useDiscussions must be used within a DiscussionProvider");
  }
  return context;
};
