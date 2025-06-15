export interface Group {
  id: string;
  name: string;
  description: string;
  slug: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'SECRET';
  creatorId: string;
  rules?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
} 