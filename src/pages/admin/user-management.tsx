import React from "react";
import { Card, CardBody, CardHeader, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Chip, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAuth } from "../../components/auth/auth-context";
import { PermissionGuard } from "../../components/permission-guard";
import { RoleBadge } from "../../components/role-badge";
import { User } from "../../types";

// Mock users for the demo
const mockUsers: User[] = [
  {
    id: "user1",
    name: "Maria Thang",
    email: "maria.thang@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=2",
    role: "admin",
    joinDate: "2022-08-15",
    bio: "Community organizer and cultural preservationist",
    location: "Dallas, TX",
    language: ["en", "sz"],
    lastActive: new Date().toISOString(),
    isEmailVerified: true,
    permissions: {
      canManageUsers: true,
      canManageContent: true,
      canModerateContent: true,
      canCreateContent: true,
      canEditOwnContent: true,
      canDeleteOwnContent: true,
      canViewPrivateContent: true
    }
  },
  {
    id: "user2",
    name: "David Naulak",
    email: "david.naulak@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=3",
    role: "moderator",
    joinDate: "2022-09-20",
    bio: "Youth coordinator and musician",
    location: "Minneapolis, MN",
    language: ["en", "sz", "my"],
    lastActive: new Date().toISOString(),
    isEmailVerified: true,
    permissions: {
      canManageUsers: false,
      canManageContent: false,
      canModerateContent: true,
      canCreateContent: true,
      canEditOwnContent: true,
      canDeleteOwnContent: true,
      canViewPrivateContent: true
    }
  },
  {
    id: "user3",
    name: "Sarah Niang",
    email: "sarah.niang@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=5",
    role: "member",
    joinDate: "2022-10-12",
    bio: "Language educator and translator",
    location: "Seattle, WA",
    language: ["en", "sz", "my"],
    lastActive: new Date().toISOString(),
    isEmailVerified: true,
    permissions: {
      canManageUsers: false,
      canManageContent: false,
      canModerateContent: false,
      canCreateContent: true,
      canEditOwnContent: true,
      canDeleteOwnContent: true,
      canViewPrivateContent: true
    }
  },
  {
    id: "user4",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://img.heroui.chat/image/avatar?w=150&h=150&u=7",
    role: "member",
    joinDate: "2023-01-05",
    bio: "New community member",
    location: "Chicago, IL",
    language: ["en"],
    lastActive: new Date().toISOString(),
    isEmailVerified: false,
    permissions: {
      canManageUsers: false,
      canManageContent: false,
      canModerateContent: false,
      canCreateContent: true,
      canEditOwnContent: true,
      canDeleteOwnContent: true,
      canViewPrivateContent: true
    }
  }
];

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { user: currentUser } = useAuth();
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };
  
  const handleUpdateRole = (userId: string, newRole: User["role"]) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          // In a real app, this would be an API call
          return {
            ...user,
            role: newRole,
            permissions: {
              canManageUsers: newRole === "admin",
              canManageContent: newRole === "admin",
              canModerateContent: newRole === "admin" || newRole === "moderator",
              canCreateContent: newRole !== "guest",
              canEditOwnContent: newRole !== "guest",
              canDeleteOwnContent: newRole !== "guest",
              canViewPrivateContent: newRole !== "guest"
            }
          };
        }
        return user;
      })
    );
  };
  
  const handleVerifyUser = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user.id === userId) {
          // In a real app, this would be an API call
          return {
            ...user,
            isEmailVerified: true
          };
        }
        return user;
      })
    );
  };
  
  const handleDeleteUser = (userId: string) => {
    // In a real app, this would be an API call with confirmation
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  return (
    <PermissionGuard permission="manageUsers">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-foreground-600">Manage community members and their roles</p>
          </div>
          <Button 
            color="primary" 
            startContent={<Icon icon="lucide:user-plus" />}
          >
            Add New User
          </Button>
        </motion.div>
        
        <Card className="border border-divider/40 shadow-md">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Users</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Search users..."
                startContent={<Icon icon="lucide:search" className="text-foreground-400" />}
                size="sm"
                className="w-60"
              />
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <Table 
              aria-label="Users table"
              removeWrapper
              selectionMode="none"
            >
              <TableHeader>
                <TableColumn>USER</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>JOIN DATE</TableColumn>
                <TableColumn>LAST ACTIVE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} size="sm" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-foreground-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>
                      {user.isEmailVerified ? (
                        <Chip color="success" variant="flat" size="sm">Verified</Chip>
                      ) : (
                        <Chip color="warning" variant="flat" size="sm">Unverified</Chip>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground-500 text-sm">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-foreground-500 text-sm">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button 
                              size="sm" 
                              variant="flat"
                              isDisabled={user.id === currentUser?.id}
                            >
                              Change Role
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu 
                            aria-label="Role actions"
                            disabledKeys={[user.role]}
                          >
                            <DropdownItem key="admin" onPress={() => handleUpdateRole(user.id, "admin")}>
                              Admin
                            </DropdownItem>
                            <DropdownItem key="moderator" onPress={() => handleUpdateRole(user.id, "moderator")}>
                              Moderator
                            </DropdownItem>
                            <DropdownItem key="member" onPress={() => handleUpdateRole(user.id, "member")}>
                              Member
                            </DropdownItem>
                            <DropdownItem key="guest" onPress={() => handleUpdateRole(user.id, "guest")}>
                              Guest
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        
                        <Dropdown>
                          <DropdownTrigger>
                            <Button 
                              size="sm" 
                              variant="light"
                              isIconOnly
                              isDisabled={user.id === currentUser?.id}
                            >
                              <Icon icon="lucide:more-vertical" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="User actions">
                            <DropdownItem onPress={() => handleEditUser(user)}>
                              Edit User
                            </DropdownItem>
                            {!user.isEmailVerified && (
                              <DropdownItem onPress={() => handleVerifyUser(user.id)}>
                                Verify Email
                              </DropdownItem>
                            )}
                            <DropdownItem 
                              className="text-danger" 
                              color="danger"
                              onPress={() => handleDeleteUser(user.id)}
                            >
                              Delete User
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
        
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Edit User</ModalHeader>
                <ModalBody>
                  {selectedUser && (
                    <div className="space-y-4">
                      <Input
                        label="Name"
                        defaultValue={selectedUser.name}
                        variant="bordered"
                      />
                      <Input
                        label="Email"
                        defaultValue={selectedUser.email}
                        variant="bordered"
                      />
                      <Select
                        label="Role"
                        defaultSelectedKeys={[selectedUser.role]}
                        variant="bordered"
                      >
                        <SelectItem key="admin" value="admin">Admin</SelectItem>
                        <SelectItem key="moderator" value="moderator">Moderator</SelectItem>
                        <SelectItem key="member" value="member">Member</SelectItem>
                        <SelectItem key="guest" value="guest">Guest</SelectItem>
                      </Select>
                      <Input
                        label="Location"
                        defaultValue={selectedUser.location || ""}
                        variant="bordered"
                      />
                      <Input
                        label="Bio"
                        defaultValue={selectedUser.bio || ""}
                        variant="bordered"
                      />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Save Changes
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </PermissionGuard>
  );
};