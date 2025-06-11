import React from "react";
import { Card, CardBody, CardHeader, Tabs, Tab, Avatar, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { DiscussionPost } from "./discussion-post";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const DiscussionFeed: React.FC = () => {
  const [selected, setSelected] = React.useState("latest");
  const history = useHistory();
  const { t } = useTranslation();

  const discussions = [
    {
      id: 1,
      title: "Traditional Sizang Weaving Patterns - Documentation Project",
      author: "Maria Thang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
      category: "Culture",
      content: "I'm starting a project to document traditional Sizang weaving patterns. Many of our elders still remember these designs, but they're not being passed down. Would anyone be interested in helping collect photos and stories?",
      timeAgo: "2 hours ago",
      comments: 12,
      likes: 24,
      hasImage: true,
      imageUrl: "https://img.heroui.chat/image/fashion?w=600&h=400&u=1"
    },
    {
      id: 2,
      title: "Upcoming Sizang Youth Conference in Dallas",
      author: "David Naulak",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
      category: "Events",
      content: "The annual Sizang Youth Conference will be held in Dallas this year from July 15-17. Registration is now open! Please share with all youth members in your area.",
      timeAgo: "5 hours ago",
      comments: 8,
      likes: 32,
      hasImage: false
    },
    {
      id: 3,
      title: "Help Translating Sizang Bible Study Materials",
      author: "Rev. Joseph Thawng",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=4",
      category: "Religion",
      content: "We're looking for volunteers to help translate Bible study materials from English to Sizang. This would be a great help for our community members who are more comfortable reading in their native language.",
      timeAgo: "1 day ago",
      comments: 15,
      likes: 41,
      hasImage: false
    },
    {
      id: 4,
      title: "Sizang Language Learning Resources",
      author: "Sarah Niang",
      authorAvatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
      category: "Language",
      content: "I've compiled some resources for learning the Sizang language. These include audio recordings, basic vocabulary lists, and grammar guides. Perfect for the younger generation or those who have moved away and want to maintain their language skills.",
      timeAgo: "2 days ago",
      comments: 23,
      likes: 56,
      hasImage: true,
      imageUrl: "https://img.heroui.chat/image/book?w=600&h=400&u=2"
    }
  ];

  const handleDiscussionClick = (discussionId: number) => {
    history.push(`/forums/discussion/${discussionId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Community Discussions</h2>
          <Button 
            color="primary" 
            size="sm"
            onPress={() => history.push("/forums")}
          >
            New Post
          </Button>
        </div>
        <Tabs 
          selectedKey={selected} 
          onSelectionChange={setSelected as any}
          aria-label="Discussion categories"
          classNames={{
            base: "overflow-x-auto",
            tabList: "w-full",
            tab: "h-10 px-2 flex-shrink-0",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab key="latest" title="Latest" />
          <Tab key="popular" title="Popular" />
          <Tab key="culture" title="Culture" />
          <Tab key="religion" title="Religion" />
          <Tab key="youth" title="Youth" />
          <Tab key="migration" title="Migration" />
        </Tabs>
      </CardHeader>
      <CardBody className="p-0">
        <div className="divide-y divide-divider">
          {discussions.map((discussion) => (
            <DiscussionPost 
              key={discussion.id} 
              post={discussion} 
              onClick={() => handleDiscussionClick(discussion.id)}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};