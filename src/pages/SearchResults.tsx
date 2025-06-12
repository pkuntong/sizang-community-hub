import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  type: 'forum' | 'group' | 'resource';
  language: string;
  createdAt: string;
  excerpt: string;
}

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // TODO: Implement actual API call
        const query = searchParams.get('q');
        const category = searchParams.get('category');
        const language = searchParams.get('language');
        const dateRange = searchParams.get('dateRange');

        // Mock data for now
        const mockResults: SearchResult[] = [
          {
            id: '1',
            title: 'Sample Forum Post',
            type: 'forum',
            language: 'en',
            createdAt: new Date().toISOString(),
            excerpt: 'This is a sample forum post...'
          }
        ];

        setResults(mockResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      
      {results.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No results found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
                  <p className="text-gray-600 mb-2">{result.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{result.type}</span>
                    <span>•</span>
                    <span>{result.language}</span>
                    <span>•</span>
                    <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 