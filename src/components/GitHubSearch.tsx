
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface GitHubSearchProps {
  onSearch: (username: string) => void;
  isLoading: boolean;
}

const GitHubSearch = ({ onSearch, isLoading }: GitHubSearchProps) => {
  const [username, setUsername] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg group gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-5 pr-10 py-6 rounded-l-lg border-r-0 text-base shadow-sm focus-visible:ring-primary bg-white"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading || !username.trim()} 
        className="rounded-l-none rounded-lg px-8 py-6 bg-primary hover:bg-primary/90 transition-all shadow-sm"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching
          </span>
        ) : (
          <span className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Search
          </span>
        )}
      </Button>
    </form>
  );
};

export default GitHubSearch;
