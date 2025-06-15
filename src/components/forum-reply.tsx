import React, { useState } from 'react';
import { Button, Textarea } from "@heroui/react";
import { useAuth } from '../hooks/useAuth';
import { NotificationService } from "../services/notification-service";

interface ForumReplyProps {
  threadId: string;
  threadTitle: string;
  threadAuthorId: string;
  onReplyPosted: (reply: any) => void;
}

export const ForumReply: React.FC<ForumReplyProps> = ({
  threadId,
  threadTitle,
  threadAuthorId,
  onReplyPosted
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/threads/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to post reply');

      const reply = await response.json();
      onReplyPosted(reply);

      // Create notification for thread author if it's not the same user
      if (threadAuthorId !== user.id) {
        await NotificationService.notifyThreadReply(
          threadAuthorId,
          user.displayName,
          threadId,
          threadTitle
        );
      }

      // Check for mentions and notify mentioned users
      const mentionRegex = /@(\w+)/g;
      const mentions = content.match(mentionRegex);
      if (mentions) {
        const mentionedUsernames = mentions.map(m => m.slice(1));
        // TODO: Fetch user IDs for mentioned usernames
        // For each mentioned user:
        // await NotificationService.notifyMention(
        //   mentionedUserId,
        //   user.displayName,
        //   threadId,
        //   threadTitle
        // );
      }

      setContent('');
    } catch (error) {
      console.error('Error posting reply:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        minRows={3}
        maxRows={10}
        className="w-full"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          isDisabled={!content.trim()}
        >
          Post Reply
        </Button>
      </div>
    </form>
  );
}; 