import React from "react";
import { motion } from "framer-motion";
import { CommunityHeader } from "../components/community-header";
import { DiscussionFeed } from "../components/discussion-feed";
import { PopularGroups } from "../components/popular-groups";
import { CultureSpotlight } from "../components/culture-spotlight";

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <CommunityHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2">
          <DiscussionFeed />
        </div>
        <div className="space-y-6">
          <PopularGroups />
          <CultureSpotlight />
        </div>
      </div>
    </div>
  );
};