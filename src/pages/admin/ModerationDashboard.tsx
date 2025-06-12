import React, { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  MapPinIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface Report {
  id: string;
  postId: string;
  postTitle: string;
  reason: string;
  reportedBy: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

interface Post {
  id: string;
  title: string;
  author: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
}

export const ModerationDashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'posts'>('reports');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // TODO: Implement actual API calls
        // Mock data for now
        const mockReports: Report[] = [
          {
            id: '1',
            postId: '1',
            postTitle: 'Sample Post',
            reason: 'Spam',
            reportedBy: 'user1',
            createdAt: new Date().toISOString(),
            status: 'pending'
          }
        ];

        const mockPosts: Post[] = [
          {
            id: '1',
            title: 'Sample Post',
            author: 'user1',
            isPinned: false,
            isLocked: false,
            createdAt: new Date().toISOString()
          }
        ];

        setReports(mockReports);
        setPosts(mockPosts);
      } catch (error) {
        console.error('Error fetching moderation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleModerationAction = async (
    action: 'delete' | 'pin' | 'unpin' | 'lock' | 'unlock',
    postId: string
  ) => {
    try {
      // TODO: Implement actual API call
      console.log(`Performing ${action} on post ${postId}`);
    } catch (error) {
      console.error('Error performing moderation action:', error);
    }
  };

  const handleReportAction = async (
    action: 'resolve' | 'dismiss',
    reportId: string
  ) => {
    try {
      // TODO: Implement actual API call
      console.log(`Performing ${action} on report ${reportId}`);
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Moderation Dashboard</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('reports')}
              className={`${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Posts
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'reports' ? (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{report.postTitle}</h2>
                  <p className="text-gray-600 mb-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 inline mr-2" />
                    {report.reason}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Reported by: {report.reportedBy}</span>
                    <span>•</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{report.status}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReportAction('resolve', report.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleReportAction('dismiss', report.id)}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>By: {post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleModerationAction(post.isPinned ? 'unpin' : 'pin', post.id)}
                    className={`p-2 rounded ${
                      post.isPinned ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                    } hover:bg-opacity-90`}
                  >
                    <MapPinIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleModerationAction(post.isLocked ? 'unlock' : 'lock', post.id)}
                    className={`p-2 rounded ${
                      post.isLocked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                    } hover:bg-opacity-90`}
                  >
                    <LockClosedIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleModerationAction('delete', post.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 