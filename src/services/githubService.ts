
import { toast } from "sonner";

const API_BASE_URL = 'https://api.github.com';

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  location: string | null;
  twitter_username: string | null;
  company: string | null;
  blog: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  visibility: string;
  fork: boolean;
  archived: boolean;
}

export interface CommitActivity {
  date: string; 
  count: number;
}

const handleApiError = (error: any) => {
  console.error('GitHub API Error:', error);
  
  if (error.response) {
    if (error.response.status === 404) {
      toast.error('User not found. Please check the username and try again.');
    } else if (error.response.status === 403) {
      toast.error('API rate limit exceeded. Please try again later.');
    } else {
      toast.error(`Error: ${error.response.data.message || 'Failed to fetch data'}`);
    }
  } else if (error.request) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred.');
  }
  
  throw error;
};

// Fetch user profile data
export const fetchUserProfile = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${username}`);
    
    if (!response.ok) {
      throw { response };
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch user repositories
export const fetchUserRepositories = async (username: string): Promise<GitHubRepo[]> => {
  try {
    // Get up to 100 repositories sorted by updated date
    const response = await fetch(`${API_BASE_URL}/users/${username}/repos?per_page=100&sort=updated`);
    
    if (!response.ok) {
      throw { response };
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch commit activity
export const fetchCommitActivity = async (username: string): Promise<CommitActivity[]> => {
  try {
    // This is a simplified approach - GitHub doesn't have a direct API for all user commits
    // For a real app, you'd need to aggregate commits from each repo, which can be rate-limited
    // Instead, we'll use the events API to get recent activity
    const response = await fetch(`${API_BASE_URL}/users/${username}/events?per_page=100`);
    
    if (!response.ok) {
      throw { response };
    }
    
    const events = await response.json();
    
    // Filter for push events and extract commit data
    const commitEvents = events.filter((event: any) => event.type === 'PushEvent');
    
    // Group commits by date
    const commitsByDate = commitEvents.reduce((acc: any, event: any) => {
      const date = event.created_at.split('T')[0]; // Get just the date part
      const commitCount = event.payload.commits ? event.payload.commits.length : 0;
      
      if (!acc[date]) {
        acc[date] = 0;
      }
      
      acc[date] += commitCount;
      return acc;
    }, {});
    
    // Convert to array format for chart
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      last30Days.push({
        date: dateString,
        count: commitsByDate[dateString] || 0
      });
    }
    
    return last30Days;
  } catch (error) {
    return handleApiError(error);
  }
};
