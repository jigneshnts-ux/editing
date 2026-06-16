export type DashboardTask = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export const dashboardTasks: DashboardTask[] = [
  {
    id: 'news-poster',
    title: 'News Poster',
    description: 'Create Hindi or Hinglish breaking-news posts quickly.',
    category: 'News'
  },
  {
    id: 'reel-scene',
    title: 'Reel Scene',
    description: 'Plan vertical story scenes for Instagram Reels.',
    category: 'Video'
  }
];
