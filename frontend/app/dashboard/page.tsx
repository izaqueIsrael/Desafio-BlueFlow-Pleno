'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ApiClient } from '@/lib/api-client';
import { VideoCard } from '@/components/video-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, LogOut, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearch, setCurrentSearch] = useState(''); // Track what's currently being displayed
  const [searching, setSearching] = useState(false);
  const [view, setView] = useState<'search' | 'favorites'>('search');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageToken, setPrevPageToken] = useState<string | null>(null);
  const [pageHistory, setPageHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadTrendingVideos();
    }
  }, [user]);

  const loadTrendingVideos = async () => {
    try {
      setSearching(true);
      const response = await ApiClient.getTrendingVideos();
      setVideos(response.videos || []);
      setNextPageToken(response.nextPageToken || null);
      setPrevPageToken(null);
      setPageHistory([]);
      setCurrentSearch('');
      setSearchQuery('');
    } catch (error) {
      console.error('Error loading trending videos:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent, pageToken?: string) => {
    e?.preventDefault();
    
    // If search is empty, load trending videos
    if (!searchQuery.trim() && !pageToken) {
      loadTrendingVideos();
      return;
    }

    try {
      setSearching(true);
      const response = await ApiClient.searchVideos(searchQuery, pageToken);
      setVideos(response.videos || []);
      setNextPageToken(response.nextPageToken || null);
      setCurrentSearch(searchQuery);
      
      // Manage page history for back navigation
      if (pageToken) {
        setPageHistory([...pageHistory, pageToken]);
      } else {
        setPageHistory([]);
      }
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadTrendingVideos();
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      handleSearch(undefined, nextPageToken);
    }
  };

  const handlePrevPage = () => {
    if (pageHistory.length > 0) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const prevToken = newHistory[newHistory.length - 1];
      
      setPageHistory(newHistory);
      handleSearch(undefined, prevToken);
    } else {
      // Go back to first page
      handleSearch(undefined, undefined);
    }
  };

  const loadFavorites = async () => {
    try {
      setSearching(true);
      const favorites = await ApiClient.getFavorites();
      setVideos(favorites.map((f: any) => ({
        id: f.videoId,
        ...f.videoData,
      })));
      setView('favorites');
      setNextPageToken(null);
      setPrevPageToken(null);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setSearching(false);
    }
  };

  const switchToSearch = () => {
    setView('search');
    if (currentSearch) {
      // If there was a previous search, keep showing those results
      return;
    }
    loadTrendingVideos();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">BlueFlow</h1>
              <div className="flex gap-2">
                <Button
                  variant={view === 'search' ? 'default' : 'outline'}
                  onClick={switchToSearch}
                  size="sm"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant={view === 'favorites' ? 'default' : 'outline'}
                  onClick={loadFavorites}
                  size="sm"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hi, {user.name}!</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {view === 'search' && (
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="submit" disabled={searching}>
                <Search className="h-4 w-4 mr-2" />
                {searching ? 'Searching...' : 'Search'}
              </Button>
              {currentSearch && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClearSearch}
                  disabled={searching}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        )}

        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {view === 'favorites' 
                ? 'Your Favorites' 
                : currentSearch 
                  ? `Search Results for "${currentSearch}"` 
                  : 'Trending Videos'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} found
            </p>
          </div>
          
          {view === 'search' && (pageHistory.length > 0 || nextPageToken) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={pageHistory.length === 0 || searching}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!nextPageToken || searching}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {searching ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading videos...</div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                isFavorite={view === 'favorites'}
                onFavoriteChange={view === 'favorites' ? loadFavorites : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {currentSearch 
                ? `No videos found for "${currentSearch}"` 
                : 'No videos found'}
            </p>
            {currentSearch && (
              <Button 
                variant="link" 
                onClick={handleClearSearch}
                className="mt-2"
              >
                Clear search and view trending videos
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}