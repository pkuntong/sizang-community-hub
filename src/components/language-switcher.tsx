import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const languages = {
    en: t("languages.en"),
    sz: t("languages.sz"),
    my: t("languages.my")
  };

  const handleLanguageChange = (key: string) => {
    i18n.changeLanguage(key);
  };

  // Get flag icon based on language code
  const getLanguageIcon = (code: string) => {
    switch(code) {
      case 'en':
        return "lucide:flag";
      case 'sz':
        return "lucide:flag";
      case 'my':
        return "lucide:flag";
      default:
        return "lucide:globe";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Dropdown>
        <DropdownTrigger>
          <Button 
            variant="light" 
            startContent={<Icon icon={getLanguageIcon(i18n.language)} className="text-primary" />}
            className="min-w-[120px] justify-start"
          >
            {languages[i18n.language as keyof typeof languages] || t("languages.select")}
          </Button>
        </DropdownTrigger>
        <DropdownMenu 
          aria-label={t("languages.select")}
          onAction={(key) => handleLanguageChange(key as string)}
          selectedKeys={[i18n.language]}
          selectionMode="single"
        >
          <DropdownItem key="en" startContent={<Icon icon={getLanguageIcon('en')} />}>
            {t("languages.en")}
          </DropdownItem>
          <DropdownItem key="sz" startContent={<Icon icon={getLanguageIcon('sz')} />}>
            {t("languages.sz")}
          </DropdownItem>
          <DropdownItem key="my" startContent={<Icon icon={getLanguageIcon('my')} />}>
            {t("languages.my")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </motion.div>
  );
};
