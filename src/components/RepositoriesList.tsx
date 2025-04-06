
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitHubRepo } from '@/services/githubService';
import { Star, GitFork, Code, ArrowUpDown, ExternalLink, Calendar, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RepositoriesListProps {
  repositories: GitHubRepo[] | null;
  isLoading: boolean;
}

type SortOption = 'updated' | 'stars' | 'name' | 'created';

const RepositoriesList = ({ repositories, isLoading }: RepositoriesListProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [showForks, setShowForks] = useState<boolean>(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const sortedRepositories = React.useMemo(() => {
    if (!repositories) return [];
    
    // Filter out forks if showForks is false
    const filteredRepos = showForks 
      ? repositories 
      : repositories.filter(repo => !repo.fork);
    
    // Sort repositories based on selected sort option
    return [...filteredRepos].sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });
  }, [repositories, sortBy, showForks]);

  if (isLoading) {
    return <RepositoriesListSkeleton />;
  }

  if (!repositories || repositories.length === 0) {
    return (
      <Card className="w-full rounded-xl shadow-sm hover-card">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
          <CardTitle className="text-gradient">Repositories</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-12 text-muted-foreground">No repositories found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-xl shadow-sm hover-card">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white border-b">
        <CardTitle className="text-gradient flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Repositories ({showForks ? repositories.length : repositories.filter(repo => !repo.fork).length})
        </CardTitle>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowForks(!showForks)}
            className="flex items-center text-sm"
          >
            <Filter className="mr-1 h-4 w-4" />
            {showForks ? 'Hide forks' : 'Show forks'}
          </Button>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px] text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last updated</SelectItem>
              <SelectItem value="stars">Stars</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {sortedRepositories.map((repo) => (
            <div key={repo.id} className="border rounded-lg p-5 hover:shadow transition-shadow bg-white card-highlight">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        {repo.name}
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </h3>
                    {repo.fork && (
                      <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200">Fork</Badge>
                    )}
                    {repo.archived && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Archived</Badge>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-sm text-muted-foreground">{repo.description}</p>
                  )}
                </div>
                <div className="flex space-x-4 text-sm">
                  {repo.stargazers_count > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-amber-500" />
                      <span className="font-medium">{repo.stargazers_count}</span>
                    </div>
                  )}
                  {repo.forks_count > 0 && (
                    <div className="flex items-center">
                      <GitFork className="h-4 w-4 mr-1 text-primary" />
                      <span className="font-medium">{repo.forks_count}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {repo.language && (
                  <div className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-md">
                    <span className={`w-2 h-2 rounded-full mr-1.5 bg-primary`}></span>
                    {repo.language}
                  </div>
                )}
                <div className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-md">
                  <Calendar className="mr-1.5 h-3 w-3 text-muted-foreground" />
                  Updated {formatDate(repo.updated_at)}
                </div>
              </div>
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100">
                      {topic}
                    </Badge>
                  ))}
                  {repo.topics.length > 5 && (
                    <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-500">
                      +{repo.topics.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const BookOpen = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
};

const RepositoriesListSkeleton = () => {
  return (
    <Card className="w-full rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-5">
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72 mt-2" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-36" />
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-5 w-16 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RepositoriesList;
