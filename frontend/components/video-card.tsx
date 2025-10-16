'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { ApiClient } from '@/lib/api-client';
import { toast } from 'sonner';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    channelTitle: string;
    publishedAt: string;
  };
  isFavorite?: boolean;
  onFavoriteChange?: () => void;
}

export function VideoCard({ video, isFavorite = false, onFavoriteChange }: VideoCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      if (favorite) {
        await ApiClient.removeFavorite(video.id);
        toast.success('Removed from favorites', {
          description: 'Video removed successfully',
        });
      } else {
        await ApiClient.addFavorite(video.id, {
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          channelTitle: video.channelTitle,
        });
        toast.success('Added to favorites', {
          description: 'Video saved successfully',
        });
      }
      setFavorite(!favorite);
      onFavoriteChange?.();
    } catch (error: any) {
      toast.error('Error', {
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const openVideo = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative cursor-pointer" onClick={openVideo}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2 cursor-pointer hover:text-blue-600" onClick={openVideo}>
              {video.title}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-1">
              {video.channelTitle}
            </CardDescription>
            <CardDescription className="mt-2 line-clamp-2 text-xs">
              {video.description}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            disabled={loading}
            className="flex-shrink-0"
          >
            <Heart
              className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}