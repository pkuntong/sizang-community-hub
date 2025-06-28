import React from 'react';
import { Card, CardBody, Switch, Input, Button } from "@heroui/react";
import { useAuth } from '../../components/auth/auth-context';

interface SiteSettings {
  inviteOnly: boolean;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
}

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = React.useState<SiteSettings>({
    inviteOnly: true,
    maintenanceMode: false,
    allowRegistration: false,
    siteName: 'Sizang Community Hub',
    siteDescription: 'A private digital space for the global Sizang (Siyin) people to connect, share, and preserve our culture.',
    contactEmail: 'info@sizangcommunity.org'
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Show success message
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

      <Card>
        <CardBody>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
                <Input
                  label="Site Description"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Access Control</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Invite-Only Mode</h3>
                    <p className="text-sm text-foreground-500">
                      Only allow new users to register with an invite code
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.inviteOnly}
                    onValueChange={(value) => setSettings({ ...settings, inviteOnly: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Maintenance Mode</h3>
                    <p className="text-sm text-foreground-500">
                      Temporarily disable the site for maintenance
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.maintenanceMode}
                    onValueChange={(value) => setSettings({ ...settings, maintenanceMode: value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Allow Registration</h3>
                    <p className="text-sm text-foreground-500">
                      Allow new users to register (if not in invite-only mode)
                    </p>
                  </div>
                  <Switch
                    isSelected={settings.allowRegistration}
                    onValueChange={(value) => setSettings({ ...settings, allowRegistration: value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                color="primary"
                isLoading={saving}
                onClick={handleSave}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};