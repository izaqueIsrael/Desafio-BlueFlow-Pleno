'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LogOut, Search, Heart, User } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  activeView?: 'search' | 'favorites';
  onViewChange?: (view: 'search' | 'favorites') => void;
}

export function Navbar({ activeView = 'search', onViewChange }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BF</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">BlueFlow</h1>
            </Link>

            {onViewChange && (
              <div className="hidden md:flex gap-2">
                <Button
                  variant={activeView === 'search' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('search')}
                  size="sm"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant={activeView === 'favorites' ? 'default' : 'ghost'}
                  onClick={() => onViewChange('favorites')}
                  size="sm"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.name}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}