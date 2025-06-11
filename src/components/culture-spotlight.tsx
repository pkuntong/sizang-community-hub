import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const CultureSpotlight: React.FC = () => {
  const history = useHistory();
  
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Culture Spotlight</h2>
        <Button 
          size="sm" 
          variant="light"
          onPress={() => history.push("/resources?category=culture")}
        >
          More
        </Button>
      </CardHeader>
      <CardBody className="p-0">
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <img 
            src="https://img.heroui.chat/image/places?w=600&h=400&u=3" 
            alt="Traditional Festival"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
            <h3 className="text-white font-semibold text-xl">Traditional Festival</h3>
            <p className="text-white/90 text-sm">Festival Description</p>
          </div>
        </motion.div>
        <div className="p-5 border-t border-divider/40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="font-semibold mb-2 text-lg flex items-center gap-2">
              <Icon icon="lucide:languages" className="text-primary" />
              Language Project
            </h3>
            <p className="text-sm text-foreground-600 mb-3">
              Language Project Description
            </p>
            <div className="flex items-center gap-2 text-xs text-foreground-400">
              <Icon icon="lucide:calendar" />
              <span>Ongoing Project</span>
            </div>
          </motion.div>
        </div>
      </CardBody>
      <CardFooter>
        <Link 
          color="primary" 
          size="sm"
          className="cursor-pointer"
          onPress={() => history.push("/resources")}
        >
          View All Cultural Resources
        </Link>
      </CardFooter>
    </Card>
  );
};