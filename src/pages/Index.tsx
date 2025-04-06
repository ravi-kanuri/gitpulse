
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Github, Search } from 'lucide-react';

import GitHubSearch from '@/components/GitHubSearch';
import UserProfile from '@/components/UserProfile';
import RepositoriesList from '@/components/RepositoriesList';
import CommitChart from '@/components/CommitChart';
import { fetchUserProfile, fetchUserRepositories, fetchCommitActivity, GitHubUser, GitHubRepo, CommitActivity } from '@/services/githubService';

const Index = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[] | null>(null);
  const [commitData, setCommitData] = useState<CommitActivity[] | null>(null);

  const handleSearch = async (searchUsername: string) => {
    setIsLoading(true);
    setUsername(searchUsername);

    try {
      // Fetch all data in parallel for better performance
      const [userProfile, userRepos, userCommits] = await Promise.all([
        fetchUserProfile(searchUsername),
        fetchUserRepositories(searchUsername),
        fetchCommitActivity(searchUsername)
      ]);

      setUserData(userProfile);
      setRepositories(userRepos);
      setCommitData(userCommits);
      
      toast.success(`Successfully loaded ${searchUsername}'s GitHub profile`, {
        description: `Found ${userRepos.length} repositories`
      });
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      setUsername(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10 backdrop-blur-lg bg-white/80">
        <div className="container py-4 flex justify-center">
          <div className="flex items-center">
            <Github className="h-12 w-12 mr-2 text-primary" />
            <h1 className="text-4xl font-bold text-gradient">Gitpulse</h1>
          </div>
        </div>
      </header>

      <main className="container py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <GitHubSearch onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {(userData || isLoading) && (
          <div className="space-y-8 animate-fade">
            <UserProfile user={userData} isLoading={isLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RepositoriesList repositories={repositories} isLoading={isLoading} />
              </div>
              <div>
                <CommitChart commitData={commitData} loading={isLoading} username={username} />
              </div>
            </div>
          </div>
        )}

        {!userData && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-10 glass-card hover-card max-w-lg rounded-2xl">
              <div className="floating">
                <Github className="h-20 w-20 mb-8 text-primary mx-auto" />
              </div>
              <h2 className="text-3xl font-semibold mb-4">Explore GitHub Profiles</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Enter any GitHub username to discover their public profile, repositories, and development activity.
              </p>
            </div>
          </div>
        )}
      </main>
      
    
    </div>
  );
};

export default Index;
