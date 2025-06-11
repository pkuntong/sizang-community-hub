import React from "react";
import { Card, CardBody, CardHeader, Button, Switch, Tabs, Tab, Input, Select, SelectItem, Divider, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAuth } from "../components/auth/auth-context";
import { useTranslation } from "react-i18next";

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = React.useState("account");
  const { t, i18n } = useTranslation();
  
  // Form states
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [bio, setBio] = React.useState(user?.bio || "");
  const [location, setLocation] = React.useState(user?.location || "");
  
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [discussionNotifications, setDiscussionNotifications] = React.useState(true);
  const [groupNotifications, setGroupNotifications] = React.useState(true);
  const [resourceNotifications, setResourceNotifications] = React.useState(false);
  
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  
  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    alert("Profile updated successfully!");
  };
  
  const handleSavePassword = () => {
    // In a real app, this would save to the backend
    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleSaveNotifications = () => {
    // In a real app, this would save to the backend
    alert("Notification preferences saved!");
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="border border-divider/40 shadow-md h-fit md:w-64">
          <CardBody className="p-0">
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={setSelectedTab as any}
              aria-label="Settings tabs"
              orientation="vertical"
              color="primary"
              classNames={{
                tab: "justify-start h-12",
                tabContent: "group-data-[selected=true]:text-primary font-medium",
                cursor: "bg-primary"
              }}
            >
              <Tab
                key="account"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:user" />
                    <span>{t('settings.account')}</span>
                  </div>
                }
              />
              <Tab
                key="security"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:shield" />
                    <span>{t('settings.security')}</span>
                  </div>
                }
              />
              <Tab
                key="notifications"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:bell" />
                    <span>{t('settings.notifications')}</span>
                  </div>
                }
              />
              <Tab
                key="language"
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:globe" />
                    <span>{t('settings.language')}</span>
                  </div>
                }
              />
            </Tabs>
          </CardBody>
        </Card>
        
        <div className="flex-1">
          {selectedTab === "account" && (
            <Card className="border border-divider/40 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">{t('settings.accountSettings')}</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar
                      src={user?.avatar || "https://img.heroui.chat/image/avatar?w=150&h=150&u=1"}
                      className="w-16 h-16"
                    />
                    <div>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        startContent={<Icon icon="lucide:upload" />}
                      >
                        {t('settings.changeAvatar')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      label={t('settings.name')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="bordered"
                    />
                    
                    <Input
                      label={t('settings.email')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="bordered"
                    />
                    
                    <Input
                      label={t('settings.bio')}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      variant="bordered"
                    />
                    
                    <Input
                      label={t('settings.location')}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      variant="bordered"
                    />
                    
                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={handleSaveProfile}
                      >
                        {t('settings.saveChanges')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
          
          {selectedTab === "security" && (
            <Card className="border border-divider/40 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">{t('settings.securitySettings')}</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">{t('settings.changePassword')}</h3>
                  
                  <div className="space-y-4">
                    <Input
                      label={t('settings.currentPassword')}
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      variant="bordered"
                    />
                    
                    <Input
                      label={t('settings.newPassword')}
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      variant="bordered"
                    />
                    
                    <Input
                      label={t('settings.confirmNewPassword')}
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      variant="bordered"
                    />
                    
                    <div className="flex justify-end">
                      <Button
                        color="primary"
                        onPress={handleSavePassword}
                        isDisabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                      >
                        {t('settings.updatePassword')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
          
          {selectedTab === "notifications" && (
            <Card className="border border-divider/40 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">{t('settings.notificationSettings')}</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{t('settings.emailNotifications')}</p>
                        <p className="text-sm text-foreground-500">{t('settings.emailNotificationsDesc')}</p>
                      </div>
                      <Switch 
                        isSelected={emailNotifications}
                        onValueChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{t('settings.discussionReplies')}</p>
                        <p className="text-sm text-foreground-500">{t('settings.discussionRepliesDesc')}</p>
                      </div>
                      <Switch 
                        isSelected={discussionNotifications}
                        onValueChange={setDiscussionNotifications}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{t('settings.groupUpdates')}</p>
                        <p className="text-sm text-foreground-500">{t('settings.groupUpdatesDesc')}</p>
                      </div>
                      <Switch 
                        isSelected={groupNotifications}
                        onValueChange={setGroupNotifications}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{t('settings.resourceUpdates')}</p>
                        <p className="text-sm text-foreground-500">{t('settings.resourceUpdatesDesc')}</p>
                      </div>
                      <Switch 
                        isSelected={resourceNotifications}
                        onValueChange={setResourceNotifications}
                      />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button
                        color="primary"
                        onPress={handleSaveNotifications}
                      >
                        {t('settings.savePreferences')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
          
          {selectedTab === "language" && (
            <Card className="border border-divider/40 shadow-md">
              <CardHeader>
                <h2 className="text-xl font-bold">{t('settings.languageSettings')}</h2>
              </CardHeader>
              <CardBody className="p-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Select
                      label={t('settings.interfaceLanguage')}
                      defaultSelectedKeys={[i18n.language]}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                      <SelectItem key="en" value="en">{t('languages.en')}</SelectItem>
                      <SelectItem key="sz" value="sz">{t('languages.sz')}</SelectItem>
                      <SelectItem key="my" value="my">{t('languages.my')}</SelectItem>
                    </Select>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};