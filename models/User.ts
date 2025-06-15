export interface User {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  profilePicture?: string;
  role: 'ADMIN' | 'MODERATOR' | 'USER';
  languagePreference: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
} 