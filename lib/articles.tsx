import React from 'react';

export interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: React.ReactNode; // Store the full content as JSX
}

/**
 * All news articles are defined here.
 * To add a new article, just add a new object to this array.
 */
export const articles: Article[] = [
  {
    slug: 'bf1942-online-2-0',
    title: 'Bf1942.Online 2.0 is Here!',
    category: 'News',
    date: 'November 7, 2025',
    excerpt: 'A complete overhaul of the site, from a new stats backend to modern tools for players and admins.',
    content: (
      <div className="space-y-6 text-base text-muted-foreground">
        <p className="text-lg text-foreground">
          Welcome to the new Bf1942.Online! We're thrilled to launch version 2.0, a complete
          overhaul of the site from the ground up, built to provide a modern, fast, and
          data-rich hub for the entire Battlefield 1942 community.
        </p>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">A New Foundation for Stats</h3>
          <p className="mb-2">
            The biggest change isn't one you can immediately see. We have successfully migrated to a
            completely new, high-performance database and backend infrastructure. This moves us
            beyond simple server polling and into a robust, time-series data model.
          </p>
          <p>
            This new backend is the engine that powers our new live statistics, historical graphs,
            and detailed player profiles. It allows us to track player performance over time,
            calculate global leaderboards, and provide the detailed metrics you now see on
            every server and player page.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">A Modern, Responsive Frontend</h3>
          <p className="mb-2">
            As you've probably noticed, the entire site has been rebuilt using Next.js 14,
            Tailwind CSS, and a modern, responsive design. The new
            Command Center works beautifully on both desktop and mobile, with light and dark modes
            to suit your preference.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">New Tools for the Community</h3>
          <p className="mb-2">
            We're also excited to launch our new "Tools" section, dedicated to utilities
            that help server admins and players. The first of these is our{" "}
            <strong>Linux BF1942 Server Scripts</strong>, designed to help admins get a secure,
            64-bit compatible dedicated server running on modern systems like Ubuntu 24.04.
          </p>
        </div>

        <div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">What's Next?</h3>
          <p className="mb-2">
            This is just the beginning. We are already hard at work on our next major tool: a
            comprehensive <strong>Mod Manager</strong> to make installing and switching between popular mods
            like Desert Combat, Forgotten Hope, and Eve of Destruction easier than ever.
          </p>
          <p>
            Thank you for your support. We're excited to keep building this platform for the
            best gaming community in the world. See you on the battlefield!
          </p>
        </div>
      </div>
    )
  },
  // {
  //   slug: 'new-article-slug',
  //   title: 'My Next Article Title',
  //   category: 'Community',
  //   date: 'November 8, 2025',
  //   excerpt: 'A short summary of the new article...',
  //   content: (
  //     <p>Full content of the new article goes here.</p>
  //   )
  // },
];

/**
 * Helper function to find a single article by its slug.
 */
export const getArticleBySlug = (slug: string) => {
  return articles.find(article => article.slug === slug);
};