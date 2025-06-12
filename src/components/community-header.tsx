import React from "react";
import { Card, CardBody, Button, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const CommunityHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-none bg-gradient-to-r from-primary-100 to-primary-50">
      <CardBody className="py-8">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-primary flex items-center justify-center">
              <Icon icon="lucide:users" className="text-white text-4xl md:text-5xl" />
            </div>
          </div>
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to the Sizang Community Hub</h1>
            <p className="text-foreground-600 mb-4 max-w-2xl">
              A private digital space for the global Sizang (Siyin) people to connect, share, and preserve our culture.
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Button 
                color="primary" 
                startContent={<Icon icon="lucide:plus" />}
                className="w-full sm:w-auto"
              >
                New Discussion
              </Button>
              <Button 
                variant="flat" 
                color="primary" 
                startContent={<Icon icon="lucide:users" />}
                className="w-full sm:w-auto"
              >
                Join a Group
              </Button>
              <Button 
                variant="flat" 
                color="primary" 
                startContent={<Icon icon="lucide:calendar" />}
                className="w-full sm:w-auto"
              >
                Events
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};