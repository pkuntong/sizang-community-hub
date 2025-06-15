import React from 'react';
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AdminForums } from "./admin-forums";
import { AdminReports } from "./admin-reports";
import { RegistrationSettings } from "../../components/admin/RegistrationSettings";

// Placeholder for group approval
const GroupApproval: React.FC = () => (
  <Card className="mb-6">
    <CardBody>
      <h2 className="text-xl font-semibold mb-4">Pending Groups</h2>
      <p>List and approve/reject new group requests here. (To be implemented)</p>
    </CardBody>
  </Card>
);

// Placeholder for user invitations
const UserInvitations: React.FC = () => (
  <Card className="mb-6">
    <CardBody>
      <h2 className="text-xl font-semibold mb-4">Invite New Users</h2>
      <p>Generate invite codes or send manual email invitations here. (To be implemented)</p>
    </CardBody>
  </Card>
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not admin
  React.useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Tabs aria-label="Admin sections" variant="underlined" color="primary">
        <Tab key="forums" title={<span><Icon icon="lucide:message-square" className="mr-2" />Forum Categories</span>}>
          <AdminForums />
        </Tab>
        <Tab key="groups" title={<span><Icon icon="lucide:users" className="mr-2" />Group Approval</span>}>
          <GroupApproval />
        </Tab>
        <Tab key="reports" title={<span><Icon icon="lucide:flag" className="mr-2" />Flagged Reports</span>}>
          <AdminReports />
        </Tab>
        <Tab key="invites" title={<span><Icon icon="lucide:mail" className="mr-2" />User Invitations</span>}>
          <RegistrationSettings />
        </Tab>
      </Tabs>
    </div>
  );
}; 