import { addToast } from "@heroui/react";
import { User } from "../types";

// Email notification templates
const emailTemplates = {
  welcome: (user: User) => ({
    subject: `Welcome to Sizang Community Hub, ${user.name}!`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2>Welcome to the Sizang Community Hub!</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for joining our community. We're excited to have you as part of our global Sizang family.</p>
        <p>With your new account, you can:</p>
        <ul>
          <li>Participate in community discussions</li>
          <li>Join interest groups</li>
          <li>Access cultural resources</li>
          <li>Connect with Sizang people worldwide</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The Sizang Community Hub Team</p>
      </div>
    `
  }),
  
  forumReply: (user: User, threadTitle: string, replyAuthor: string, replyPreview: string) => ({
    subject: `New reply to your discussion: "${threadTitle}"`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2>New Reply to Your Discussion</h2>
        <p>Dear ${user.name},</p>
        <p><strong>${replyAuthor}</strong> has replied to your discussion: <strong>${threadTitle}</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #4f46e5; margin: 15px 0;">
          <p style="margin: 0;">"${replyPreview}..."</p>
        </div>
        <p>Click the button below to view the full reply and continue the conversation.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="#" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Reply</a>
        </div>
        <p>Best regards,<br>The Sizang Community Hub Team</p>
      </div>
    `
  }),
  
  groupInvite: (user: User, groupName: string, inviterName: string) => ({
    subject: `You've been invited to join "${groupName}" group`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2>Group Invitation</h2>
        <p>Dear ${user.name},</p>
        <p><strong>${inviterName}</strong> has invited you to join the <strong>${groupName}</strong> group on Sizang Community Hub.</p>
        <p>This group is a space for members to connect and discuss topics related to ${groupName}.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="#" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">Accept Invitation</a>
          <a href="#" style="background-color: #e5e7eb; color: #374151; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Decline</a>
        </div>
        <p>Best regards,<br>The Sizang Community Hub Team</p>
      </div>
    `
  }),
  
  passwordReset: (user: User, resetToken: string) => ({
    subject: `Password Reset Request - Sizang Community Hub`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Dear ${user.name},</p>
        <p>We received a request to reset your password for your Sizang Community Hub account. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below. This link will expire in 24 hours.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="#" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; font-size: 12px;">https://sizangcommunity.org/reset-password?token=${resetToken}</p>
        <p>Best regards,<br>The Sizang Community Hub Team</p>
      </div>
    `
  }),
  
  emailVerification: (user: User, verificationToken: string) => ({
    subject: `Verify Your Email - Sizang Community Hub`,
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2>Email Verification</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for registering with Sizang Community Hub. To complete your registration, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="#" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; font-size: 12px;">https://sizangcommunity.org/verify-email?token=${verificationToken}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Sizang Community Hub Team</p>
      </div>
    `
  })
};

// Email notification service
export class NotificationService {
  // In a real app, this would connect to an email service provider like SendGrid, Mailgun, etc.
  private static async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    // Simulate sending an email
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    
    // In development, we'll just show a toast notification
    addToast({
      title: `Email sent to ${to}`,
      description: subject,
      color: "success"
    });
    
    // Simulate a successful email send
    return true;
  }
  
  // Send welcome email
  public static async sendWelcomeEmail(user: User): Promise<boolean> {
    const { subject, body } = emailTemplates.welcome(user);
    return this.sendEmail(user.email, subject, body);
  }
  
  // Send forum reply notification
  public static async sendForumReplyNotification(
    user: User, 
    threadTitle: string, 
    replyAuthor: string, 
    replyPreview: string
  ): Promise<boolean> {
    const { subject, body } = emailTemplates.forumReply(user, threadTitle, replyAuthor, replyPreview);
    return this.sendEmail(user.email, subject, body);
  }
  
  // Send group invite notification
  public static async sendGroupInviteNotification(
    user: User, 
    groupName: string, 
    inviterName: string
  ): Promise<boolean> {
    const { subject, body } = emailTemplates.groupInvite(user, groupName, inviterName);
    return this.sendEmail(user.email, subject, body);
  }
  
  // Send password reset email
  public static async sendPasswordResetEmail(user: User, resetToken: string): Promise<boolean> {
    const { subject, body } = emailTemplates.passwordReset(user, resetToken);
    return this.sendEmail(user.email, subject, body);
  }
  
  // Send email verification
  public static async sendEmailVerificationEmail(user: User, verificationToken: string): Promise<boolean> {
    const { subject, body } = emailTemplates.emailVerification(user, verificationToken);
    return this.sendEmail(user.email, subject, body);
  }

  // Create a notification in the database
  private static async createNotification(data: {
    userId: string;
    type: 'REPLY' | 'MENTION' | 'GROUP_INVITE' | 'GROUP_POST' | 'RESOURCE_SHARE';
    content: string;
    relatedId?: string;
    relatedType?: string;
  }): Promise<void> {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create notification');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  // Notify user of a new reply to their thread
  public static async notifyThreadReply(
    threadAuthorId: string,
    replyAuthorName: string,
    threadId: string,
    threadTitle: string
  ): Promise<void> {
    await this.createNotification({
      userId: threadAuthorId,
      type: 'REPLY',
      content: `${replyAuthorName} replied to your thread: "${threadTitle}"`,
      relatedId: threadId,
      relatedType: 'thread'
    });
  }

  // Notify user when they are mentioned in a reply
  public static async notifyMention(
    mentionedUserId: string,
    mentionerName: string,
    threadId: string,
    threadTitle: string
  ): Promise<void> {
    await this.createNotification({
      userId: mentionedUserId,
      type: 'MENTION',
      content: `${mentionerName} mentioned you in "${threadTitle}"`,
      relatedId: threadId,
      relatedType: 'thread'
    });
  }

  // Notify user of a group invite
  public static async notifyGroupInvite(
    invitedUserId: string,
    inviterName: string,
    groupId: string,
    groupName: string
  ): Promise<void> {
    await this.createNotification({
      userId: invitedUserId,
      type: 'GROUP_INVITE',
      content: `${inviterName} invited you to join "${groupName}"`,
      relatedId: groupId,
      relatedType: 'group'
    });
  }

  // Notify group members of a new post
  public static async notifyGroupPost(
    groupMemberIds: string[],
    posterName: string,
    groupId: string,
    groupName: string
  ): Promise<void> {
    const notifications = groupMemberIds.map(userId => 
      this.createNotification({
        userId,
        type: 'GROUP_POST',
        content: `${posterName} posted in "${groupName}"`,
        relatedId: groupId,
        relatedType: 'group'
      })
    );

    await Promise.all(notifications);
  }
}
