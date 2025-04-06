import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GitHubUser } from '@/services/githubService';
import { MapPin, Link, Twitter, Building, Calendar, Users, BookOpen, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserProfileProps {
  user: GitHubUser | null;
  isLoading: boolean;
}

const UserProfile = ({ user, isLoading }: UserProfileProps) => {
  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-full overflow-hidden rounded-xl shadow-sm hover-card">
      <CardHeader className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-6 bg-white border-b">
        <Avatar className="h-28 w-28 border-2 border-white rounded-xl shadow-sm">
          <img src={user.avatar_url} alt={user.login} className="aspect-square" />
        </Avatar>
        <div className="space-y-2">
          <CardTitle className="text-3xl">
            {user.name || user.login}
          </CardTitle>
          <div className="text-primary font-medium">@{user.login}</div>
          {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{user.public_repos}</div>
                <div className="text-xs text-muted-foreground mt-1">Repositories</div>
              </div>
              <div className="bg-pink-100 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{user.followers}</div>
                <div className="text-xs text-muted-foreground mt-1">Followers</div>
              </div>
              <div className="bg-purple-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-7 w-7 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{user.following}</div>
                <div className="text-xs text-muted-foreground mt-1">Following</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 bg-gray-50 p-5 rounded-lg">
            {user.location && (
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-3 text-primary" />
                <span>{user.location}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center text-sm">
                <Link className="h-4 w-4 mr-3 text-primary" />
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
                   target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:underline">
                  {user.blog}
                </a>
              </div>
            )}
            {user.twitter_username && (
              <div className="flex items-center text-sm">
                <Twitter className="h-4 w-4 mr-3 text-primary" />
                <a href={`https://twitter.com/${user.twitter_username}`} 
                   target="_blank" rel="noopener noreferrer"
                   className="text-primary hover:underline">
                  @{user.twitter_username}
                </a>
              </div>
            )}
            {user.company && (
              <div className="flex items-center text-sm">
                <Building className="h-4 w-4 mr-3 text-primary" />
                <span>{user.company}</span>
              </div>
            )}
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-3 text-primary" />
              <span>Joined on {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UserProfileSkeleton = () => {
  return (
    <Card className="w-full rounded-xl">
      <CardHeader className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <Skeleton className="h-28 w-28 rounded-xl" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-4 w-4 mr-3" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
