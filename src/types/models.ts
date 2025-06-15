export interface User {
  id: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  role: 'admin' | 'moderator' | 'user';
  languagePreference: string;
  createdAt: Date;
  lastActive: Date;
  bio?: string;
  location?: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  order: number;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  language: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastReplyAt: Date;
}

export interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  slug: string;
  privacy: 'public' | 'private' | 'secret';
  creatorId: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  coverImage?: string;
  rules?: string;
}

export interface GroupMembership {
  id: string;
  groupId: string;
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  status: 'active' | 'pending' | 'banned';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'link' | 'file' | 'article';
  url?: string;
  fileUrl?: string;
  language: string;
  authorId: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface Report {
  id: string;
  type: 'thread' | 'reply' | 'group' | 'resource' | 'user';
  targetId: string;
  reporterId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface Invite {
  id: string;
  email: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  role: 'user' | 'moderator';
} 