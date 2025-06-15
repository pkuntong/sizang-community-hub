import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge } from "@heroui/react";
import { useNotifications } from '../context/notification-context';
import { useNavigate } from 'react-router-dom';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate based on notification type and relatedId
    switch (notification.type) {
      case 'REPLY':
      case 'MENTION':
        navigate(`/forum/thread/${notification.relatedId}`);
        break;
      case 'GROUP_INVITE':
        navigate(`/groups/${notification.relatedId}`);
        break;
      case 'GROUP_POST':
        navigate(`/groups/${notification.relatedId}/posts`);
        break;
      case 'RESOURCE_SHARE':
        navigate(`/resources/${notification.relatedId}`);
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REPLY':
        return 'lucide:message-square';
      case 'MENTION':
        return 'lucide:at-sign';
      case 'GROUP_INVITE':
        return 'lucide:users';
      case 'GROUP_POST':
        return 'lucide:file-text';
      case 'RESOURCE_SHARE':
        return 'lucide:link';
      default:
        return 'lucide:bell';
    }
  };

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Notifications"
        >
          <Icon icon="lucide:bell" className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              color="danger"
              shape="circle"
              size="sm"
              className="absolute -top-1 -right-1"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Notifications"
        className="w-80"
        onAction={(key) => {
          if (key === 'mark-all-read') {
            markAllAsRead();
          }
        }}
      >
        <DropdownItem
          key="header"
          className="h-12 flex items-center justify-between border-b border-divider"
        >
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="light"
              onPress={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </DropdownItem>

        {notifications.length === 0 ? (
          <DropdownItem key="empty" className="h-24 flex items-center justify-center text-foreground-500">
            <span>No notifications</span>
          </DropdownItem>
        ) : (
          notifications.map((notification) => (
            <DropdownItem
              key={notification.id}
              className={`py-3 ${!notification.isRead ? 'bg-primary-50' : ''}`}
              onPress={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-3">
                <Icon
                  icon={getNotificationIcon(notification.type)}
                  className={`w-5 h-5 mt-0.5 ${
                    !notification.isRead ? 'text-primary' : 'text-foreground-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''}`}>
                    {notification.content}
                  </p>
                  <p className="text-xs text-foreground-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </DropdownItem>
          ))
        )}
      </DropdownMenu>
    </Dropdown>
  );
}; 