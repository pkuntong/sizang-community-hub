export interface ForumThread {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  language: string;
  authorId: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  lastReplyAt: string;
} 