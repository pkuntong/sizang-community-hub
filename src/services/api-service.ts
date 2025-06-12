import { 
  Discussion, 
  Comment, 
  Group, 
  Resource, 
  User, 
  GroupPost, 
  GroupComment, 
  Category, 
  Tag, 
  Language, 
  Notification 
} from "../types";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service to simulate backend calls
export class ApiService {
  // Store data in localStorage for persistence
  private static getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error getting storage item ${key}:`, error);
      return defaultValue;
    }
  }

  private static setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting storage item ${key}:`, error);
    }
  }

  // Discussion API methods
  static async getDiscussions(): Promise<Discussion[]> {
    try {
      await delay(800);
      return this.getStorageItem<Discussion[]>("discussions", MOCK_DISCUSSIONS);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      throw new Error("Failed to fetch discussions");
    }
  }

  static async getDiscussionById(id: number): Promise<Discussion | undefined> {
    await delay(600);
    const discussions = this.getStorageItem<Discussion[]>("discussions", MOCK_DISCUSSIONS);
    return discussions.find(d => d.id === id);
  }

  static async createDiscussion(discussion: Omit<Discussion, "id" | "timeAgo" | "comments" | "likes">): Promise<Discussion> {
    await delay(1000);
    const discussions = this.getStorageItem<Discussion[]>("discussions", MOCK_DISCUSSIONS);
    
    const newDiscussion: Discussion = {
      ...discussion,
      id: Math.max(...discussions.map(d => d.id)) + 1,
      timeAgo: "Just now",
      comments: 0,
      likes: 0
    };
    
    const updatedDiscussions = [newDiscussion, ...discussions];
    this.setStorageItem("discussions", updatedDiscussions);
    
    return newDiscussion;
  }

  // Comments API methods
  static async getCommentsByDiscussionId(discussionId: number): Promise<Comment[]> {
    await delay(700);
    const allComments = this.getStorageItem<Record<string, Comment[]>>("comments", MOCK_COMMENTS);
    return allComments[discussionId.toString()] || [];
  }

  static async addComment(discussionId: number, content: string, user: User): Promise<Comment> {
    await delay(800);
    const allComments = this.getStorageItem<Record<string, Comment[]>>("comments", MOCK_COMMENTS);
    const discussionComments = allComments[discussionId.toString()] || [];
    
    const newComment: Comment = {
      id: Date.now(),
      author: user.name,
      authorAvatar: user.avatar || "https://img.heroui.chat/image/avatar?w=150&h=150&u=99",
      content,
      timeAgo: "Just now",
      likes: 0
    };
    
    const updatedComments = [newComment, ...discussionComments];
    allComments[discussionId.toString()] = updatedComments;
    this.setStorageItem("comments", allComments);
    
    // Update discussion comment count
    const discussions = this.getStorageItem<Discussion[]>("discussions", MOCK_DISCUSSIONS);
    const updatedDiscussions = discussions.map(d => {
      if (d.id === discussionId) {
        return { ...d, comments: d.comments + 1 };
      }
      return d;
    });
    this.setStorageItem("discussions", updatedDiscussions);
    
    return newComment;
  }

  // Groups API methods
  static async getGroups(): Promise<Group[]> {
    await delay(800);
    return this.getStorageItem<Group[]>("groups", MOCK_GROUPS);
  }

  static async joinGroup(groupId: number, userId: string): Promise<Group> {
    await delay(600);
    const groups = this.getStorageItem<Group[]>("groups", MOCK_GROUPS);
    
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members + 1,
          memberIds: [...(group.memberIds || []), userId]
        };
      }
      return group;
    });
    
    this.setStorageItem("groups", updatedGroups);
    return updatedGroups.find(g => g.id === groupId)!;
  }

  static async leaveGroup(groupId: number, userId: string): Promise<Group> {
    await delay(600);
    const groups = this.getStorageItem<Group[]>("groups", MOCK_GROUPS);
    
    const updatedGroups = groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: Math.max(0, group.members - 1),
          memberIds: (group.memberIds || []).filter(id => id !== userId)
        };
      }
      return group;
    });
    
    this.setStorageItem("groups", updatedGroups);
    return updatedGroups.find(g => g.id === groupId)!;
  }

  static async createGroup(group: Omit<Group, "id" | "members" | "memberIds">): Promise<Group> {
    await delay(1200);
    const groups = this.getStorageItem<Group[]>("groups", MOCK_GROUPS);
    
    const newGroup: Group = {
      ...group,
      id: Math.max(...groups.map(g => g.id)) + 1,
      members: 1,
      memberIds: [group.creatorId]
    };
    
    const updatedGroups = [...groups, newGroup];
    this.setStorageItem("groups", updatedGroups);
    
    return newGroup;
  }

  // Resources API methods
  static async getResources(): Promise<Resource[]> {
    await delay(700);
    return this.getStorageItem<Resource[]>("resources", MOCK_RESOURCES);
  }

  static async getResourceById(id: number): Promise<Resource | undefined> {
    await delay(500);
    const resources = this.getStorageItem<Resource[]>("resources", MOCK_RESOURCES);
    return resources.find(r => r.id === id);
  }

  static async uploadResource(resource: Omit<Resource, "id" | "dateAdded" | "downloads">): Promise<Resource> {
    await delay(1500); // Longer delay to simulate file upload
    const resources = this.getStorageItem<Resource[]>("resources", MOCK_RESOURCES);
    
    const today = new Date();
    const formattedDate = `${today.toLocaleString('default', { month: 'long' })} ${today.getDate()}, ${today.getFullYear()}`;
    
    const newResource: Resource = {
      ...resource,
      id: Math.max(...resources.map(r => r.id)) + 1,
      dateAdded: formattedDate,
      downloads: 0
    };
    
    const updatedResources = [...resources, newResource];
    this.setStorageItem("resources", updatedResources);
    
    return newResource;
  }

  static async downloadResource(id: number): Promise<Resource> {
    await delay(800);
    const resources = this.getStorageItem<Resource[]>("resources", MOCK_RESOURCES);
    
    const updatedResources = resources.map(resource => {
      if (resource.id === id) {
        return { ...resource, downloads: resource.downloads + 1 };
      }
      return resource;
    });
    
    this.setStorageItem("resources", updatedResources);
    return updatedResources.find(r => r.id === id)!;
  }

  // Like functionality
  static async likeDiscussion(id: number): Promise<Discussion> {
    await delay(400);
    const discussions = this.getStorageItem<Discussion[]>("discussions", MOCK_DISCUSSIONS);
    
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === id) {
        return { ...discussion, likes: discussion.likes + 1 };
      }
      return discussion;
    });
    
    this.setStorageItem("discussions", updatedDiscussions);
    return updatedDiscussions.find(d => d.id === id)!;
  }

  static async likeComment(discussionId: number, commentId: number): Promise<Comment> {
    await delay(400);
    const allComments = this.getStorageItem<Record<string, Comment[]>>("comments", MOCK_COMMENTS);
    const discussionComments = allComments[discussionId.toString()] || [];
    
    const updatedComments = discussionComments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 };
      }
      return comment;
    });
    
    allComments[discussionId.toString()] = updatedComments;
    this.setStorageItem("comments", allComments);
    
    return updatedComments.find(c => c.id === commentId)!;
  }

  // Add new API methods for categories
  static async getCategories(): Promise<Category[]> {
    await delay(500);
    return this.getStorageItem<Category[]>("categories", MOCK_CATEGORIES);
  }

  static async getCategoryById(id: number): Promise<Category | undefined> {
    await delay(300);
    const categories = this.getStorageItem<Category[]>("categories", MOCK_CATEGORIES);
    return categories.find(c => c.id === id);
  }

  // Add new API methods for tags
  static async getTags(): Promise<Tag[]> {
    await delay(500);
    return this.getStorageItem<Tag[]>("tags", MOCK_TAGS);
  }

  static async getTagById(id: number): Promise<Tag | undefined> {
    await delay(300);
    const tags = this.getStorageItem<Tag[]>("tags", MOCK_TAGS);
    return tags.find(t => t.id === id);
  }

  // Add new API methods for languages
  static async getLanguages(): Promise<Language[]> {
    await delay(400);
    return this.getStorageItem<Language[]>("languages", MOCK_LANGUAGES);
  }

  static async getLanguageByCode(code: string): Promise<Language | undefined> {
    await delay(300);
    const languages = this.getStorageItem<Language[]>("languages", MOCK_LANGUAGES);
    return languages.find(l => l.code === code);
  }

  // Add new API methods for group posts
  static async getGroupPosts(groupId: number): Promise<GroupPost[]> {
    await delay(700);
    const allGroupPosts = this.getStorageItem<Record<string, GroupPost[]>>("groupPosts", MOCK_GROUP_POSTS);
    return allGroupPosts[groupId.toString()] || [];
  }

  static async createGroupPost(post: Omit<GroupPost, "id" | "createdAt" | "likes" | "comments">): Promise<GroupPost> {
    await delay(800);
    const allGroupPosts = this.getStorageItem<Record<string, GroupPost[]>>("groupPosts", MOCK_GROUP_POSTS);
    const groupPosts = allGroupPosts[post.groupId.toString()] || [];
    
    const newPost: GroupPost = {
      ...post,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0
    };
    
    const updatedPosts = [newPost, ...groupPosts];
    allGroupPosts[post.groupId.toString()] = updatedPosts;
    this.setStorageItem("groupPosts", allGroupPosts);
    
    return newPost;
  }

  // Add new API methods for group comments
  static async getGroupComments(groupId: number, postId: number): Promise<GroupComment[]> {
    await delay(600);
    const key = `${groupId}_${postId}`;
    const allGroupComments = this.getStorageItem<Record<string, GroupComment[]>>("groupComments", MOCK_GROUP_COMMENTS);
    return allGroupComments[key] || [];
  }

  static async createGroupComment(comment: Omit<GroupComment, "id" | "createdAt" | "likes">): Promise<GroupComment> {
    await delay(700);
    const key = `${comment.groupId}_${comment.postId}`;
    const allGroupComments = this.getStorageItem<Record<string, GroupComment[]>>("groupComments", MOCK_GROUP_COMMENTS);
    const comments = allGroupComments[key] || [];
    
    const newComment: GroupComment = {
      ...comment,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    const updatedComments = [newComment, ...comments];
    allGroupComments[key] = updatedComments;
    this.setStorageItem("groupComments", allGroupComments);
    
    // Update post comment count
    const allGroupPosts = this.getStorageItem<Record<string, GroupPost[]>>("groupPosts", MOCK_GROUP_POSTS);
    const groupPosts = allGroupPosts[comment.groupId.toString()] || [];
    const updatedPosts = groupPosts.map(p => {
      if (p.id === comment.postId) {
        return { ...p, comments: p.comments + 1 };
      }
      return p;
    });
    allGroupPosts[comment.groupId.toString()] = updatedPosts;
    this.setStorageItem("groupPosts", allGroupPosts);
    
    return newComment;
  }

  // Add new API methods for user management
  static async getUserById(id: string): Promise<User | undefined> {
    await delay(500);
    const users = this.getStorageItem<User[]>("users", MOCK_USERS);
    return users.find(u => u.id === id);
  }

  static async updateUserProfile(id: string, updates: Partial<User>): Promise<User> {
    await delay(800);
    const users = this.getStorageItem<User[]>("users", MOCK_USERS);
    
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, ...updates, updatedAt: new Date().toISOString() };
      }
      return user;
    });
    
    this.setStorageItem("users", updatedUsers);
    return updatedUsers.find(u => u.id === id)!;
  }

  // Add new API methods for notifications
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    await delay(600);
    const allNotifications = this.getStorageItem<Record<string, Notification[]>>("notifications", MOCK_NOTIFICATIONS);
    return allNotifications[userId] || [];
  }

  static async markNotificationAsRead(userId: string, notificationId: number): Promise<void> {
    await delay(400);
    const allNotifications = this.getStorageItem<Record<string, Notification[]>>("notifications", MOCK_NOTIFICATIONS);
    const userNotifications = allNotifications[userId] || [];
    
    const updatedNotifications = userNotifications.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, isRead: true };
      }
      return notification;
    });
    
    allNotifications[userId] = updatedNotifications;
    this.setStorageItem("notifications", allNotifications);
  }
}

// Mock data
const MOCK_DISCUSSIONS: Discussion[] = [
  {
    id: 1,
    title: "Traditional Sizang Weaving Patterns - Documentation Project",
    author: "Maria Thang",
    authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
    category: "Culture",
    content: "I'm starting a project to document traditional Sizang weaving patterns. Many of our elders still remember these designs, but they're not being passed down.\n\nThe goal is to create a digital archive of these patterns with photographs, stories, and possibly even instructions on how to recreate them. This could be a valuable resource for future generations who want to connect with their heritage.\n\nWould anyone be interested in helping collect photos and stories? Or if you know elders who might be willing to share their knowledge, please let me know. I'm planning to start with interviews in the Dallas area, but would love to expand to other communities as well.",
    timeAgo: "2 hours ago",
    comments: 12,
    likes: 24,
    hasImage: true,
    imageUrl: "https://img.heroui.chat/image/fashion?w=600&h=400&u=1"
  },
  {
    id: 2,
    title: "Upcoming Sizang Youth Conference in Dallas",
    author: "David Naulak",
    authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
    category: "Events",
    content: "The annual Sizang Youth Conference will be held in Dallas this year from July 15-17. Registration is now open! Please share with all youth members in your area.\n\nThis year's theme is 'Connecting Roots' and we'll be focusing on helping young Sizang people connect with their cultural heritage while building community with each other.\n\nWe have several exciting workshops planned, including traditional music, language learning, and discussions about navigating cultural identity in America. We'll also have social events and opportunities to build lasting friendships.\n\nEarly bird registration is $45 until June 1st, then $60 after that. Scholarships are available for those who need financial assistance.",
    timeAgo: "5 hours ago",
    comments: 8,
    likes: 32,
    hasImage: false
  },
  {
    id: 3,
    title: "Help Translating Sizang Bible Study Materials",
    author: "Rev. Joseph Thawng",
    authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=4",
    category: "Religion",
    content: "We're looking for volunteers to help translate Bible study materials from English to Sizang. This would be a great help for our community members who are more comfortable reading in their native language.\n\nThe materials include weekly study guides, devotionals, and some children's resources. Even if you can only help with a small portion, it would be greatly appreciated.\n\nIf you're fluent in both English and Sizang and would be willing to help, please comment below or message me directly. This is a wonderful opportunity to serve our community and help preserve our language.",
    timeAgo: "1 day ago",
    comments: 15,
    likes: 41,
    hasImage: false
  },
  {
    id: 4,
    title: "Sizang Language Learning Resources",
    author: "Sarah Niang",
    authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
    category: "Language",
    content: "I've compiled some resources for learning the Sizang language. These include audio recordings, basic vocabulary lists, and grammar guides. Perfect for the younger generation or those who have moved away and want to maintain their language skills.\n\nI've been working on this project for about a year, recording conversations with elders and creating structured lessons. The materials are designed for self-study but could also be used in community language classes.\n\nAll resources are available for free download through the link below. I'm also looking for feedback and additional contributions to expand the collection.",
    timeAgo: "2 days ago",
    comments: 23,
    likes: 56,
    hasImage: true,
    imageUrl: "https://img.heroui.chat/image/book?w=600&h=400&u=2"
  },
  {
    id: 5,
    title: "Sizang Recipes Collection - Call for Submissions",
    author: "Lisa Mang",
    authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=6",
    category: "Culture",
    content: "I'm putting together a collection of traditional Sizang recipes and would love your contributions! Food is such an important part of our cultural heritage, and I want to make sure these recipes are preserved for future generations.\n\nIf you have family recipes, cooking techniques, or stories about traditional Sizang foods, please share them here. I'm especially interested in dishes that might be less common or at risk of being forgotten.\n\nMy plan is to compile everything into a digital cookbook that will be freely available to the community. Photos of the dishes would be wonderful too if you have them!",
    timeAgo: "3 days ago",
    comments: 19,
    likes: 47,
    hasImage: true,
    imageUrl: "https://img.heroui.chat/image/food?w=600&h=400&u=1"
  }
];

const MOCK_COMMENTS: Record<string, Comment[]> = {
  "1": [
    {
      id: 1,
      author: "David Naulak",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
      content: "This is a wonderful initiative! My grandmother was a skilled weaver and I have some photos of her work. I'd be happy to share them and any stories she told me about the patterns.",
      timeAgo: "1 hour ago",
      likes: 8
    },
    {
      id: 2,
      author: "Sarah Niang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
      content: "I've been thinking about a similar project! I have some contacts in Myanmar who might be able to connect us with elders who still practice traditional weaving. Let's collaborate!",
      timeAgo: "45 minutes ago",
      likes: 12
    },
    {
      id: 3,
      author: "Rev. Joseph Thawng",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=4",
      content: "The church in Minneapolis has a cultural preservation committee that might be interested in supporting this. I'll mention it at our next meeting.",
      timeAgo: "30 minutes ago",
      likes: 5
    }
  ],
  "2": [
    {
      id: 1,
      author: "Lisa Mang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=6",
      content: "This is great news! I'll be coming from Chicago with a few youth from our church. Is there a way to coordinate transportation from the airport?",
      timeAgo: "3 hours ago",
      likes: 2
    },
    {
      id: 2,
      author: "Michael Kam",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=7",
      content: "I attended last year and it was an amazing experience. Highly recommend for all Sizang youth who want to connect with their roots and meet others from across the country.",
      timeAgo: "4 hours ago",
      likes: 7
    }
  ]
};

const MOCK_GROUPS: Group[] = [
  {
    id: 1,
    name: "Sizang Youth Network",
    description: "A community for young Sizang people to connect, share ideas, and organize events.",
    members: 245,
    icon: "lucide:users",
    coverImage: "https://img.heroui.chat/image/places?w=800&h=300&u=10",
    creatorId: "admin-1",
    memberIds: []
  },
  {
    id: 2,
    name: "Elders' Stories & Wisdom",
    description: "Preserving the knowledge and stories of our elders for future generations.",
    members: 128,
    icon: "lucide:book-open",
    coverImage: "https://img.heroui.chat/image/places?w=800&h=300&u=11",
    creatorId: "admin-1",
    memberIds: []
  },
  {
    id: 3,
    name: "Sizang Bible Study",
    description: "Weekly discussions on scripture and faith in the Sizang context.",
    members: 187,
    icon: "lucide:book",
    coverImage: "https://img.heroui.chat/image/places?w=800&h=300&u=12",
    creatorId: "admin-2",
    memberIds: []
  },
  {
    id: 4,
    name: "Cultural Preservation",
    description: "Documenting and preserving Sizang cultural practices, language, and traditions.",
    members: 156,
    icon: "lucide:landmark",
    coverImage: "https://img.heroui.chat/image/places?w=800&h=300&u=13",
    creatorId: "admin-2",
    memberIds: []
  }
];

const MOCK_RESOURCES: Resource[] = [
  {
    id: 1,
    title: "Sizang Language Learning Guide",
    description: "A comprehensive guide for learning the Sizang language, including vocabulary, grammar, and pronunciation.",
    type: "Document",
    category: "Language",
    author: "Sarah Niang",
    dateAdded: "March 15, 2023",
    downloads: 156,
    imageUrl: "https://img.heroui.chat/image/book?w=600&h=400&u=1",
    fileUrl: "#"
  },
  {
    id: 2,
    title: "Traditional Sizang Music Collection",
    description: "A collection of traditional Sizang songs and music, recorded from community elders.",
    type: "Audio",
    category: "Culture",
    author: "David Thawng",
    dateAdded: "January 8, 2023",
    downloads: 89,
    imageUrl: "https://img.heroui.chat/image/album?w=600&h=400&u=2",
    fileUrl: "#"
  },
  {
    id: 3,
    title: "Sizang Cultural Practices Documentary",
    description: "A documentary exploring the traditional cultural practices of the Sizang people.",
    type: "Video",
    category: "Culture",
    author: "Michael Kam",
    dateAdded: "November 20, 2022",
    downloads: 213,
    imageUrl: "https://img.heroui.chat/image/movie?w=600&h=400&u=3",
    fileUrl: "#"
  },
  {
    id: 4,
    title: "History of Sizang Migration",
    description: "Research paper documenting the migration patterns of Sizang people throughout history.",
    type: "Document",
    category: "History",
    author: "Dr. Joseph Thang",
    dateAdded: "February 5, 2023",
    downloads: 127,
    imageUrl: "https://img.heroui.chat/image/book?w=600&h=400&u=4",
    fileUrl: "#"
  }
];

const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Culture",
    description: "Discussions about Sizang cultural practices, traditions, and heritage",
    slug: "culture",
    icon: "lucide:landmark",
    color: "#4f46e5",
    order: 1,
    isActive: true
  },
  {
    id: 2,
    name: "Religion",
    description: "Faith-based discussions and resources",
    slug: "religion",
    icon: "lucide:book",
    color: "#0891b2",
    order: 2,
    isActive: true
  },
  {
    id: 3,
    name: "Youth",
    description: "Topics relevant to young Sizang people",
    slug: "youth",
    icon: "lucide:sparkles",
    color: "#16a34a",
    order: 3,
    isActive: true
  },
  {
    id: 4,
    name: "Language",
    description: "Discussions about the Sizang language, learning resources, and translations",
    slug: "language",
    icon: "lucide:message-square",
    color: "#ea580c",
    order: 4,
    isActive: true
  },
  {
    id: 5,
    name: "Events",
    description: "Announcements and discussions about community events",
    slug: "events",
    icon: "lucide:calendar",
    color: "#8b5cf6",
    order: 5,
    isActive: true
  },
  {
    id: 6,
    name: "Migration",
    description: "Topics related to migration, resettlement, and diaspora experiences",
    slug: "migration",
    icon: "lucide:map",
    color: "#0ea5e9",
    order: 6,
    isActive: true
  }
];

const MOCK_TAGS: Tag[] = [
  { id: 1, name: "Traditional", slug: "traditional", color: "#4f46e5", count: 12 },
  { id: 2, name: "Modern", slug: "modern", color: "#0891b2", count: 8 },
  { id: 3, name: "Language Learning", slug: "language-learning", color: "#16a34a", count: 15 },
  { id: 4, name: "History", slug: "history", color: "#ea580c", count: 10 },
  { id: 5, name: "Music", slug: "music", color: "#8b5cf6", count: 7 },
  { id: 6, name: "Food", slug: "food", color: "#0ea5e9", count: 9 },
  { id: 7, name: "Community", slug: "community", color: "#ec4899", count: 14 },
  { id: 8, name: "Identity", slug: "identity", color: "#f59e0b", count: 11 }
];

const MOCK_LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    isActive: true,
    isDefault: true,
    direction: "ltr"
  },
  {
    code: "sz",
    name: "Sizang",
    nativeName: "Sizang",
    isActive: true,
    isDefault: false,
    direction: "ltr"
  },
  {
    code: "my",
    name: "Burmese",
    nativeName: "မြန်မာဘာသာ",
    isActive: true,
    isDefault: false,
    direction: "ltr"
  }
];

const MOCK_USERS: User[] = [
  {
    id: "user1",
    name: "Maria Thang",
    email: "maria.thang@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
    role: "admin",
    joinDate: "2022-08-15",
    bio: "Community organizer and cultural preservationist",
    location: "Dallas, TX",
    language: ["en", "sz"],
    lastActive: "2023-05-10T14:30:00Z",
    isVerified: true
  },
  {
    id: "user2",
    name: "David Naulak",
    email: "david.naulak@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
    role: "moderator",
    joinDate: "2022-09-20",
    bio: "Youth coordinator and musician",
    location: "Minneapolis, MN",
    language: ["en", "sz", "my"],
    lastActive: "2023-05-09T18:45:00Z",
    isVerified: true
  },
  {
    id: "user3",
    name: "Rev. Joseph Thawng",
    email: "joseph.thawng@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=4",
    role: "moderator",
    joinDate: "2022-07-05",
    bio: "Pastor and community leader",
    location: "Indianapolis, IN",
    language: ["en", "sz"],
    lastActive: "2023-05-08T09:15:00Z",
    isVerified: true
  },
  {
    id: "user4",
    name: "Sarah Niang",
    email: "sarah.niang@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
    role: "member",
    joinDate: "2022-10-12",
    bio: "Language educator and translator",
    location: "Seattle, WA",
    language: ["en", "sz", "my"],
    lastActive: "2023-05-10T11:20:00Z",
    isVerified: true
  },
  {
    id: "user5",
    name: "Lisa Mang",
    email: "lisa.mang@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=6",
    role: "member",
    joinDate: "2023-01-08",
    bio: "Culinary enthusiast and recipe collector",
    location: "Chicago, IL",
    language: ["en", "sz"],
    lastActive: "2023-05-09T20:30:00Z",
    isVerified: true
  }
];

const MOCK_GROUP_POSTS: Record<string, GroupPost[]> = {
  "1": [
    {
      id: 1,
      groupId: 1,
      title: "Youth Conference Planning",
      content: "Let's start planning for the upcoming youth conference in July. We need volunteers for various committees.",
      authorId: "user2",
      authorName: "David Naulak",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
      createdAt: "2023-05-08T14:30:00Z",
      likes: 12,
      comments: 5,
      hasAttachment: false,
      language: "en"
    },
    {
      id: 2,
      groupId: 1,
      title: "Music Workshop Ideas",
      content: "I'd like to organize a traditional music workshop for youth. Does anyone have suggestions for instructors or materials?",
      authorId: "user4",
      authorName: "Sarah Niang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
      createdAt: "2023-05-07T10:15:00Z",
      likes: 8,
      comments: 3,
      hasAttachment: true,
      attachmentUrl: "https://img.heroui.chat/image/album?w=600&h=400&u=5",
      language: "en"
    }
  ],
  "2": [
    {
      id: 1,
      groupId: 2,
      title: "Collecting Stories from Elders",
      content: "I've started recording interviews with elders about their experiences growing up in Myanmar. Would love to coordinate with others doing similar work.",
      authorId: "user1",
      authorName: "Maria Thang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
      createdAt: "2023-05-09T16:45:00Z",
      likes: 15,
      comments: 7,
      hasAttachment: false,
      language: "en"
    }
  ],
  "3": [
    {
      id: 1,
      groupId: 3,
      title: "Weekly Bible Study Schedule",
      content: "Our weekly Bible study will be held every Wednesday at 7:00 PM. This week we'll be discussing the Book of Ruth.",
      authorId: "user3",
      authorName: "Rev. Joseph Thawng",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=4",
      createdAt: "2023-05-10T08:30:00Z",
      likes: 10,
      comments: 2,
      hasAttachment: false,
      language: "en"
    }
  ]
};

const MOCK_GROUP_COMMENTS: Record<string, GroupComment[]> = {
  "1_1": [
    {
      id: 1,
      groupId: 1,
      postId: 1,
      content: "I can help with the registration committee!",
      authorId: "user4",
      authorName: "Sarah Niang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
      createdAt: "2023-05-08T15:10:00Z",
      likes: 3,
      language: "en"
    },
    {
      id: 2,
      groupId: 1,
      postId: 1,
      content: "When is our first planning meeting?",
      authorId: "user5",
      authorName: "Lisa Mang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=6",
      createdAt: "2023-05-08T16:25:00Z",
      likes: 1,
      language: "en"
    }
  ],
  "2_1": [
    {
      id: 1,
      groupId: 2,
      postId: 1,
      content: "This is so important! I've been wanting to do something similar with my grandparents.",
      authorId: "user2",
      authorName: "David Naulak",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
      createdAt: "2023-05-09T17:30:00Z",
      likes: 4,
      language: "en"
    }
  ]
};

const MOCK_NOTIFICATIONS: Record<string, Notification[]> = {
  "user1": [
    {
      id: 1,
      userId: "user1",
      type: "comment",
      content: "David Naulak commented on your post",
      relatedId: 1,
      relatedType: "discussion",
      createdAt: "2023-05-10T09:30:00Z",
      isRead: false
    },
    {
      id: 2,
      userId: "user1",
      type: "like",
      content: "Sarah Niang liked your discussion",
      relatedId: 1,
      relatedType: "discussion",
      createdAt: "2023-05-09T14:15:00Z",
      isRead: true
    }
  ],
  "user2": [
    {
      id: 1,
      userId: "user2",
      type: "group_post",
      content: "New post in Sizang Youth Network",
      relatedId: 1,
      relatedType: "group",
      createdAt: "2023-05-10T10:45:00Z",
      isRead: false
    }
  ]
};