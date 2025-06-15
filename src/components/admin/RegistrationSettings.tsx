import React, { useState, useEffect } from 'react';

interface RegistrationSettings {
  isInviteOnly: boolean;
  inviteCodes: {
    code: string;
    createdBy: string;
    createdAt: string;
    usedBy?: string;
    usedAt?: string;
  }[];
}

export const RegistrationSettings: React.FC = () => {
  const [settings, setSettings] = useState<RegistrationSettings>({
    isInviteOnly: false,
    inviteCodes: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newInviteCode, setNewInviteCode] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Replace all TODO: Implement actual API call comments with real fetch calls to:
        // - GET /api/admin/registration-settings
        // Mock data for now
        const mockSettings: RegistrationSettings = {
          isInviteOnly: true,
          inviteCodes: [
            {
              code: 'INVITE123',
              createdBy: 'admin',
              createdAt: new Date().toISOString(),
              usedBy: 'user1',
              usedAt: new Date().toISOString()
            }
          ]
        };

        setSettings(mockSettings);
      } catch (error) {
        console.error('Error fetching registration settings:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load registration settings'
        });
      }
    };

    fetchSettings();
  }, []);

  const handleToggleInviteOnly = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Replace all TODO: Implement actual API call comments with real fetch calls to:
      // - GET /api/admin/registration-settings
      // - PATCH /api/admin/registration-settings (for toggling invite-only)
      setSettings(prev => ({
        ...prev,
        isInviteOnly: !prev.isInviteOnly
      }));

      setMessage({
        type: 'success',
        text: `Registration is now ${!settings.isInviteOnly ? 'invite-only' : 'public'}`
      });
    } catch (error) {
      console.error('Error updating registration settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update registration settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateInviteCode = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Replace all TODO: Implement actual API call comments with real fetch calls to:
      // - GET /api/admin/registration-settings
      // - POST /api/admin/invite-codes (for generating)
      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setNewInviteCode(newCode);

      setSettings(prev => ({
        ...prev,
        inviteCodes: [
          ...prev.inviteCodes,
          {
            code: newCode,
            createdBy: 'admin', // TODO: Get actual admin username
            createdAt: new Date().toISOString()
          }
        ]
      }));

      setMessage({
        type: 'success',
        text: 'New invite code generated'
      });
    } catch (error) {
      console.error('Error generating invite code:', error);
      setMessage({
        type: 'error',
        text: 'Failed to generate invite code'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevokeInviteCode = async (code: string) => {
    setIsSaving(true);
    setMessage(null);

    try {
      // Replace all TODO: Implement actual API call comments with real fetch calls to:
      // - GET /api/admin/registration-settings
      // - DELETE /api/admin/invite-codes/:code (for revoking)
      setSettings(prev => ({
        ...prev,
        inviteCodes: prev.inviteCodes.filter(ic => ic.code !== code)
      }));

      setMessage({
        type: 'success',
        text: 'Invite code revoked'
      });
    } catch (error) {
      console.error('Error revoking invite code:', error);
      setMessage({
        type: 'error',
        text: 'Failed to revoke invite code'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Registration Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Control how new users can register on the platform
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Invite-Only Registration</h3>
          <p className="text-sm text-gray-500">
            When enabled, only users with valid invite codes can register
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleInviteOnly}
          disabled={isSaving}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            settings.isInviteOnly ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              settings.isInviteOnly ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {settings.isInviteOnly && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Invite Codes</h3>
            <button
              type="button"
              onClick={handleGenerateInviteCode}
              disabled={isSaving}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Generate New Code
            </button>
          </div>

          {newInviteCode && (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                New invite code generated: <span className="font-mono font-bold">{newInviteCode}</span>
              </p>
            </div>
          )}

          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    Code
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created By
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Created At
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {settings.inviteCodes.map((inviteCode) => (
                  <tr key={inviteCode.code}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-mono">
                      {inviteCode.code}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {inviteCode.createdBy}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(inviteCode.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {inviteCode.usedBy ? (
                        <span className="text-gray-500">Used by {inviteCode.usedBy}</span>
                      ) : (
                        <span className="text-green-600">Available</span>
                      )}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      {!inviteCode.usedBy && (
                        <button
                          onClick={() => handleRevokeInviteCode(inviteCode.code)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 