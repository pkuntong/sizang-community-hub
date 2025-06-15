export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'LINK' | 'FILE' | 'ARTICLE';
  url?: string;
  fileUrl?: string;
  language: string;
  authorId: string;
  category: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
} 