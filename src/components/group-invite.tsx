import React, { useState } from 'react';
import { Button, Input } from "@heroui/react";
import { useAuth } from '../components/auth/auth-context';
import { NotificationService } from "../services/notification-service";

interface GroupInviteProps {
  groupId: string;
  groupName: string;
  onInviteSent: () => void;
}

export const GroupInvite: React.FC<GroupInviteProps> = ({
  groupId,
  groupName,
  onInviteSent
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !user) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/groups/${groupId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to send invite');

      const invite = await response.json();

      // Create notification for invited user
      await NotificationService.notifyGroupInvite(
        invite.userId,
        user.displayName,
        groupId,
        groupName
      );

      setEmail('');
      onInviteSent();
    } catch (error) {
      console.error('Error sending invite:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email address"
        label="Invite by Email"
        isRequired
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          isDisabled={!email.trim()}
        >
          Send Invite
        </Button>
      </div>
    </form>
  );
};