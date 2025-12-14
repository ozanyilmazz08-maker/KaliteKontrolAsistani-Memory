import React, { useState } from 'react';
import { X, Link2, Mail, Users, Copy, Check } from 'lucide-react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { toast } from 'sonner@2.0.3';

/**
 * INTERACTION CHAIN: Share Button → Share Dialog → Copy/Send → Success Feedback
 * Complete sharing workflow with link generation and email options
 */

interface ShareDialogProps {
  onClose: () => void;
}

export default function ShareDialog({ onClose }: ShareDialogProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'team'>('link');
  const [linkCopied, setLinkCopied] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState('');
  const [message, setMessage] = useState('');
  const [permission, setPermission] = useState('view');

  const shareLink = 'https://datalens.app/share/abc123xyz789';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSendEmail = () => {
    toast.success('Invitations sent', {
      description: `Sent to ${emailAddresses.split(',').length} recipient(s)`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-gray-900">Share Analysis</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 flex gap-1">
          {[
            { id: 'link' as const, label: 'Share Link', icon: Link2 },
            { id: 'email' as const, label: 'Send Email', icon: Mail },
            { id: 'team' as const, label: 'Team Access', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg bg-gray-50"
                  />
                  <Button
                    variant={linkCopied ? 'primary' : 'secondary'}
                    icon={linkCopied ? Check : Copy}
                    onClick={handleCopyLink}
                  >
                    {linkCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Permission Level</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'view', label: 'View Only', desc: 'Can view but not edit' },
                    { value: 'edit', label: 'Can Edit', desc: 'Can view and modify' }
                  ].map((perm) => (
                    <button
                      key={perm.value}
                      onClick={() => setPermission(perm.value)}
                      className={`p-4 border-2 rounded-lg transition-all text-left ${
                        permission === perm.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <p className="text-gray-900">{perm.label}</p>
                      <p className="text-gray-600 text-xs mt-1">{perm.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-900">Anyone with this link can {permission === 'view' ? 'view' : 'edit'} this analysis</p>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Email Addresses</label>
                <Input
                  value={emailAddresses}
                  onChange={setEmailAddresses}
                  placeholder="Enter email addresses (comma-separated)"
                  fullWidth
                />
                <p className="text-gray-600 mt-1">Separate multiple addresses with commas</p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={4}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Permission Level</label>
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="view">View Only</option>
                  <option value="edit">Can Edit</option>
                  <option value="admin">Full Access</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'Owner', avatar: 'SC' },
                  { name: 'Mike Johnson', email: 'mike.j@company.com', role: 'Editor', avatar: 'MJ' },
                  { name: 'Emily Davis', email: 'emily.d@company.com', role: 'Viewer', avatar: 'ED' }
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-gray-900">{member.name}</p>
                        <p className="text-gray-600">{member.email}</p>
                      </div>
                    </div>
                    <select
                      defaultValue={member.role.toLowerCase()}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                ))}
              </div>

              <Button variant="secondary" icon={Users} fullWidth>
                Add Team Member
              </Button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          {activeTab === 'email' ? (
            <>
              <Button variant="primary" fullWidth onClick={handleSendEmail}>
                Send Invitations
              </Button>
              <Button variant="secondary" fullWidth onClick={onClose}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="secondary" fullWidth onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
