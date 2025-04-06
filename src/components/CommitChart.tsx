
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { CommitActivity } from '@/services/githubService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommitChartProps {
  commitData: CommitActivity[] | null;
  loading: boolean;
  username: string | null;
}

const CommitChart: React.FC<CommitChartProps> = ({ commitData, loading, username }) => {
  // Format the date to a more readable format
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${new Date(label).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}`}</p>
          <p className="text-sm text-primary font-semibold mt-1">
            {payload[0].value} commits
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden rounded-xl shadow-sm hover-card border">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4 border-b">
        <CardTitle className="text-lg font-medium flex items-center text-gradient">
          Commit Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 bg-white">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse-light text-sm font-medium text-muted-foreground">Loading commit data...</div>
          </div>
        ) : !commitData || commitData.length === 0 ? (
          <div className="h-64 flex items-center justify-center flex-col p-6">
            <p className="text-gray-500 mb-2 font-medium">No recent commit data available</p>
            {username && <p className="text-sm text-gray-400">Recent commits for {username} will appear here</p>}
          </div>
        ) : (
          <div className="h-64 w-full px-4 pb-6 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={commitData}
                margin={{
                  top: 20,
                  right: 15,
                  left: 0,
                  bottom: 5,
                }}
                barSize={12}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate} 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  stroke="#9ca3af"
                  tickMargin={8}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  stroke="#9ca3af"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="count" 
                  fill="url(#commitGradient)" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1000}
                />
                <defs>
                  <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommitChart;
