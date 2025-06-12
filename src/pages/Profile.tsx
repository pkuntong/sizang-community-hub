import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  username: string;
  bio: string;
  avatarUrl?: string;
  joinedAt: string;
  postCount: number;
  groupCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  category: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

export const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'groups'>('posts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // TODO: Implement actual API calls
        // Mock data for now
        const mockUser: User = {
          id: '1',
          username: username || 'user',
          bio: 'This is a sample bio',
          joinedAt: new Date().toISOString(),
          postCount: 5,
          groupCount: 3
        };

        const mockPosts: Post[] = [
          {
            id: '1',
            title: 'Sample Post',
            content: 'This is a sample post content',
            createdAt: new Date().toISOString(),
            category: 'General'
          }
        ];

        const mockGroups: Group[] = [
          {
            id: '1',
            name: 'Sample Group',
            description: 'This is a sample group',
            memberCount: 10
          }
        ];

        setUser(mockUser);
        setPosts(mockPosts);
        setGroups(mockGroups);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="absolute -bottom-16 left-8">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
            ) : (
              <UserCircleIcon className="w-32 h-32 text-white" />
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-6 px-8">
          <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
          <p className="mt-2 text-gray-600">{user.bio}</p>
          <div className="mt-4 flex space-x-4 text-sm text-gray-500">
            <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{user.postCount} posts</span>
            <span>•</span>
            <span>{user.groupCount} groups</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('posts')}
              className={`${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`${
                activeTab === 'groups'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Groups
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'posts' ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="mt-2 text-gray-600">{post.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="mt-2 text-gray-600">{group.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    {group.memberCount} members
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 