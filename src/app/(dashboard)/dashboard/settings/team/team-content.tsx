'use client';

import { useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Crown,
  Eye,
  MoreHorizontal,
  Check,
  X,
  Clock,
  Search,
  ChevronDown,
  Sparkles,
  Activity,
  Settings,
  Trash2,
  Edit3,
  Send,
  Copy,
  CheckCircle2,
} from 'lucide-react';

// Role configuration
const ROLES = {
  ADMIN: {
    name: 'Admin',
    description: 'Full access to all features',
    icon: Crown,
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
  },
  MANAGER: {
    name: 'Manager',
    description: 'Can manage team and deals',
    icon: Shield,
    color: 'violet',
    gradient: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
  },
  MEMBER: {
    name: 'Member',
    description: 'Can view and edit deals',
    icon: Users,
    color: 'cyan',
    gradient: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
  },
  VIEWER: {
    name: 'Viewer',
    description: 'Read-only access',
    icon: Eye,
    color: 'gray',
    gradient: 'from-gray-500 to-gray-600',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
    textColor: 'text-white/60',
  },
};

type RoleType = keyof typeof ROLES;

// Mock team members data
const mockTeamMembers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'ADMIN' as RoleType,
    avatar: null,
    status: 'active',
    lastActive: '2 minutes ago',
    dealsOwned: 24,
    joinedAt: '2024-06-15',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@company.com',
    role: 'MANAGER' as RoleType,
    avatar: null,
    status: 'active',
    lastActive: '1 hour ago',
    dealsOwned: 18,
    joinedAt: '2024-08-22',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@company.com',
    role: 'MEMBER' as RoleType,
    avatar: null,
    status: 'active',
    lastActive: '3 hours ago',
    dealsOwned: 12,
    joinedAt: '2024-10-01',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'MEMBER' as RoleType,
    avatar: null,
    status: 'inactive',
    lastActive: '2 days ago',
    dealsOwned: 8,
    joinedAt: '2024-11-10',
  },
];

// Mock pending invites
const mockPendingInvites = [
  {
    id: '1',
    email: 'alex.turner@company.com',
    role: 'MEMBER' as RoleType,
    sentAt: '2026-01-28',
    expiresIn: '5 days',
  },
  {
    id: '2',
    email: 'jessica.wu@company.com',
    role: 'VIEWER' as RoleType,
    sentAt: '2026-01-25',
    expiresIn: '2 days',
  },
];

// Avatar component
function Avatar({
  name,
  size = 'default',
  status,
}: {
  name: string;
  size?: 'small' | 'default' | 'large';
  status?: 'active' | 'inactive';
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const sizeClasses = {
    small: 'h-8 w-8 text-xs',
    default: 'h-10 w-10 text-sm',
    large: 'h-14 w-14 text-lg',
  };

  // Generate consistent color based on name
  const colors = [
    'from-violet-500 to-violet-600',
    'from-cyan-500 to-cyan-600',
    'from-pink-500 to-pink-600',
    'from-emerald-500 to-emerald-600',
    'from-amber-500 to-amber-600',
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br ${colors[colorIndex]} font-semibold text-white shadow-lg ${sizeClasses[size]}`}
      >
        {initials}
      </div>
      {status && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#030014] ${
            status === 'active' ? 'bg-emerald-500' : 'bg-white/30'
          }`}
        />
      )}
    </div>
  );
}

// Role badge component
function RoleBadge({ role }: { role: RoleType }) {
  const config = ROLES[role];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${config.bgColor} ${config.borderColor} border px-2.5 py-1 text-xs font-medium ${config.textColor}`}
    >
      <Icon className="h-3 w-3" />
      {config.name}
    </span>
  );
}

// Team member row component
function TeamMemberRow({
  member,
  onEdit,
  onRemove,
}: {
  member: (typeof mockTeamMembers)[0];
  onEdit: () => void;
  onRemove: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:border-violet-500/20 hover:bg-white/[0.04]">
      <div className="flex items-center gap-4">
        <Avatar name={member.name} status={member.status as 'active' | 'inactive'} />
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white">{member.name}</h4>
            {member.role === 'ADMIN' && (
              <Crown className="h-3.5 w-3.5 text-amber-400" />
            )}
          </div>
          <p className="text-sm text-white/40">{member.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm text-white/60">{member.dealsOwned} deals</p>
          <p className="text-xs text-white/30">Active {member.lastActive}</p>
        </div>

        <RoleBadge role={member.role} />

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0A0520] py-1 shadow-xl">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/[0.04]"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Role
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/[0.04]"
                >
                  <Settings className="h-4 w-4" />
                  View Activity
                </button>
                <div className="my-1 border-t border-white/[0.06]" />
                <button
                  onClick={() => {
                    onRemove();
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Pending invite row component
function PendingInviteRow({
  invite,
  onResend,
  onCancel,
}: {
  invite: (typeof mockPendingInvites)[0];
  onResend: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/30">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-white/70">{invite.email}</p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Clock className="h-3 w-3" />
            Expires in {invite.expiresIn}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RoleBadge role={invite.role} />
        <div className="flex gap-1">
          <button
            onClick={onResend}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-violet-400"
            title="Resend invite"
          >
            <Send className="h-4 w-4" />
          </button>
          <button
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-red-400"
            title="Cancel invite"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Invite modal component
function InviteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('MEMBER');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    setInviteLink('https://app.revsignal.ai/invite/abc123xyz');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0A0520] shadow-2xl">
        {/* Header */}
        <div className="border-b border-white/[0.06] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Invite Team Member</h2>
              <p className="text-sm text-white/40">Add someone to your organization</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Email Input */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-white">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-white">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(ROLES) as RoleType[]).map((roleKey) => {
                const role = ROLES[roleKey];
                const Icon = role.icon;
                const isSelected = selectedRole === roleKey;

                return (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedRole(roleKey)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? `${role.borderColor} ${role.bgColor}`
                        : 'border-white/[0.06] hover:border-white/10'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isSelected ? `bg-gradient-to-br ${role.gradient}` : 'bg-white/[0.04]'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-white/40'}`}
                      />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? role.textColor : 'text-white/60'}`}>
                        {role.name}
                      </p>
                      <p className="text-xs text-white/30">{role.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Invite Link */}
          <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Or share invite link</p>
              <button
                onClick={generateLink}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                Generate Link
              </button>
            </div>
            {inviteLink ? (
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-white/60">
                  {inviteLink}
                </code>
                <button
                  onClick={copyLink}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                    copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.04] text-white/40 hover:text-white'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ) : (
              <p className="text-xs text-white/30">Click generate to create a shareable invite link</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-white/[0.06] bg-white/[0.01] p-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            disabled={!email}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<RoleType | 'ALL'>('ALL');

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const teamStats = {
    total: mockTeamMembers.length,
    active: mockTeamMembers.filter((m) => m.status === 'active').length,
    admins: mockTeamMembers.filter((m) => m.role === 'ADMIN').length,
    pending: mockPendingInvites.length,
  };

  return (
    <div className="relative min-h-screen p-6 lg:p-8">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb orb-violet h-[500px] w-[500px] -right-48 -top-48 opacity-20" />
        <div className="orb orb-cyan h-[400px] w-[400px] -left-32 top-1/3 opacity-15" />
        <div className="orb orb-pink h-[300px] w-[300px] right-1/4 bottom-0 opacity-10" />
      </div>

      {/* Header */}
      <div className="relative mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="animate-in-up">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-400">
              <Users className="h-3 w-3" />
              Team Management
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white lg:text-4xl">Team</h1>
          <p className="mt-1 text-white/40">Manage your team members and their permissions</p>
        </div>

        <div className="animate-in-up delay-1">
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Total Members',
            value: teamStats.total,
            subtext: 'of 10 seats',
            icon: Users,
            gradient: 'from-violet-500 to-violet-600',
            color: 'violet',
          },
          {
            label: 'Active Now',
            value: teamStats.active,
            subtext: 'online',
            icon: Activity,
            gradient: 'from-emerald-500 to-emerald-600',
            color: 'emerald',
          },
          {
            label: 'Administrators',
            value: teamStats.admins,
            subtext: 'with full access',
            icon: Crown,
            gradient: 'from-amber-500 to-amber-600',
            color: 'amber',
          },
          {
            label: 'Pending Invites',
            value: teamStats.pending,
            subtext: 'awaiting response',
            icon: Mail,
            gradient: 'from-cyan-500 to-cyan-600',
            color: 'cyan',
          },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`animate-in-up group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all hover:border-${stat.color}-500/30 hover:bg-white/[0.04]`}
            style={{ animationDelay: `${(i + 2) * 100}ms` }}
          >
            <div
              className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-${stat.color}-500/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100`}
            />
            <div className="relative">
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/40">
                {stat.label} <span className="text-white/30">· {stat.subtext}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Team Members Section */}
      <div className="animate-in-up delay-6 mb-8 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        {/* Section Header */}
        <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Team Members</h3>
              <p className="text-xs text-white/40">{filteredMembers.length} members</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.02] py-2 pl-9 pr-4 text-sm text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none sm:w-64"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as RoleType | 'ALL')}
                className="appearance-none rounded-lg border border-white/10 bg-white/[0.02] py-2 pl-4 pr-10 text-sm text-white focus:border-violet-500/50 focus:outline-none"
              >
                <option value="ALL">All Roles</option>
                {(Object.keys(ROLES) as RoleType[]).map((role) => (
                  <option key={role} value={role}>
                    {ROLES[role].name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-white/[0.04] p-5">
          {filteredMembers.length > 0 ? (
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <TeamMemberRow
                  key={member.id}
                  member={member}
                  onEdit={() => {}}
                  onRemove={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
                <Users className="h-8 w-8 text-white/30" />
              </div>
              <p className="text-white/60">No members found</p>
              <p className="mt-1 text-sm text-white/40">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Pending Invites Section */}
      {mockPendingInvites.length > 0 && (
        <div className="animate-in-up delay-7 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-white/[0.06] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pending Invites</h3>
              <p className="text-xs text-white/40">{mockPendingInvites.length} awaiting response</p>
            </div>
          </div>

          <div className="space-y-3 p-5">
            {mockPendingInvites.map((invite) => (
              <PendingInviteRow
                key={invite.id}
                invite={invite}
                onResend={() => {}}
                onCancel={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Role Permissions Info */}
      <div className="animate-in-up delay-8 mt-8">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-400" />
            <h3 className="font-semibold text-white">Role Permissions</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(ROLES) as RoleType[]).map((roleKey) => {
              const role = ROLES[roleKey];
              const Icon = role.icon;

              const permissions =
                roleKey === 'ADMIN'
                  ? ['Full system access', 'Manage team', 'Billing access', 'API keys']
                  : roleKey === 'MANAGER'
                    ? ['Manage deals', 'View reports', 'Assign tasks', 'Team overview']
                    : roleKey === 'MEMBER'
                      ? ['Create deals', 'Edit own deals', 'View reports', 'Basic access']
                      : ['View deals', 'View reports', 'Read-only', 'No editing'];

              return (
                <div
                  key={roleKey}
                  className={`rounded-xl border ${role.borderColor} ${role.bgColor} p-4`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${role.gradient}`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className={`font-medium ${role.textColor}`}>{role.name}</span>
                  </div>
                  <ul className="space-y-1">
                    {permissions.map((perm) => (
                      <li key={perm} className="flex items-center gap-2 text-xs text-white/50">
                        <CheckCircle2 className="h-3 w-3 text-white/30" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />

      {/* Bottom spacing */}
      <div className="h-8" />
    </div>
  );
}
