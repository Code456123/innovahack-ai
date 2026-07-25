'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import {
  ShieldCheck,
  Users,
  Cpu,
  Activity,
  Sliders,
  Search,
  UserPlus,
  UserCheck,
  UserX,
  Trash2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Save,
  Server,
  Layers,
} from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'Researcher' | 'Analyst' | 'Lead Researcher' | 'System Admin';
  status: 'Active' | 'Suspended';
  searchesCount: number;
  avgConfidence: number;
  joinedDate: string;
}

interface AgentConfig {
  id: string;
  name: string;
  status: 'Operational' | 'Paused' | 'Maintenance';
  model: 'GPT-4o' | 'Claude 3.5 Sonnet' | 'Gemini 1.5 Pro';
  confidenceThreshold: number;
  maxParallelSources: number;
  searchDepth: 'Standard' | 'Deep Web' | 'Academic Repositories';
}

const initialUsers: SystemUser[] = [
  { id: 'usr-1', name: 'Shivam Chaubey', email: 'researcher@verigen.ai', role: 'System Admin', status: 'Active', searchesCount: 42, avgConfidence: 96, joinedDate: '2026-01-10' },
  { id: 'usr-2', name: 'Dr. Aris Thorne', email: 'analyst@verigen.ai', role: 'Lead Researcher', status: 'Active', searchesCount: 28, avgConfidence: 94, joinedDate: '2026-02-15' },
  { id: 'usr-3', name: 'Elena Rostova', email: 'elena@biomed-lab.org', role: 'Researcher', status: 'Active', searchesCount: 15, avgConfidence: 91, joinedDate: '2026-03-01' },
  { id: 'usr-4', name: 'Marcus Vance', email: 'm.vance@techjournal.com', role: 'Analyst', status: 'Suspended', searchesCount: 6, avgConfidence: 84, joinedDate: '2026-04-12' },
];

const initialAgents: AgentConfig[] = [
  { id: 'ag-1', name: 'Research Agent', status: 'Operational', model: 'Gemini 1.5 Pro', confidenceThreshold: 85, maxParallelSources: 30, searchDepth: 'Academic Repositories' },
  { id: 'ag-2', name: 'Verification Agent', status: 'Operational', model: 'Claude 3.5 Sonnet', confidenceThreshold: 90, maxParallelSources: 25, searchDepth: 'Academic Repositories' },
  { id: 'ag-3', name: 'Contradiction Detector', status: 'Operational', model: 'GPT-4o', confidenceThreshold: 88, maxParallelSources: 20, searchDepth: 'Deep Web' },
  { id: 'ag-4', name: 'Citation Generator', status: 'Operational', model: 'GPT-4o', confidenceThreshold: 95, maxParallelSources: 15, searchDepth: 'Standard' },
  { id: 'ag-5', name: 'Report Builder', status: 'Operational', model: 'Claude 3.5 Sonnet', confidenceThreshold: 90, maxParallelSources: 20, searchDepth: 'Standard' },
];

import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'agents' | 'logs' | 'gateway'>('users');
  
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [agents, setAgents] = useState<AgentConfig[]>(initialAgents);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [isSaved, setIsSaved] = useState(false);

  // New User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Researcher' | 'Analyst' | 'Lead Researcher' | 'System Admin'>('Researcher');

  useEffect(() => {
    const isAuth = localStorage.getItem('verigen_admin_authenticated');
    if (isAuth !== 'true') {
      router.push('/admin/login');
      return;
    }

    const storedUsers = localStorage.getItem('verigen_admin_users');
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    
    const storedAgents = localStorage.getItem('verigen_admin_agents');
    if (storedAgents) setAgents(JSON.parse(storedAgents));
  }, [router]);

  const handleLockSession = () => {
    localStorage.removeItem('verigen_admin_authenticated');
    router.push('/admin/login');
  };

  const saveUsersState = (updated: SystemUser[]) => {
    setUsers(updated);
    localStorage.setItem('verigen_admin_users', JSON.stringify(updated));
  };

  const saveAgentsState = (updated: AgentConfig[]) => {
    setAgents(updated);
    localStorage.setItem('verigen_admin_agents', JSON.stringify(updated));
  };

  const handleToggleUserStatus = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'Active' ? ('Suspended' as const) : ('Active' as const) } : u
    );
    saveUsersState(updated);
  };

  const handleRoleChange = (id: string, newRole: SystemUser['role']) => {
    const updated = users.map((u) => (u.id === id ? { ...u, role: newRole } : u));
    saveUsersState(updated);
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsersState(updated);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: 'Active',
      searchesCount: 0,
      avgConfidence: 95,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    saveUsersState([newUser, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const handleAgentStatusToggle = (id: string) => {
    const updated = agents.map((a) =>
      a.id === id ? { ...a, status: a.status === 'Operational' ? ('Paused' as const) : ('Operational' as const) } : a
    );
    saveAgentsState(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAgentModelChange = (id: string, model: AgentConfig['model']) => {
    const updated = agents.map((a) => (a.id === id ? { ...a, model } : a));
    saveAgentsState(updated);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'All') return u.role === roleFilter;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-xs font-mono text-[#A5B4FC] mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#06B6D4]" /> Administrative Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Platform Admin Control Panel</h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage user privileges, agent cluster parameters, LLM model routing, and discrepancy audit queues.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {isSaved && (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold animate-pulse">
                  <CheckCircle2 className="w-4 h-4" /> Agent Parameters Updated!
                </div>
              )}
              <button
                onClick={handleLockSession}
                className="btn-secondary px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 border-rose-500/30 hover:bg-rose-500/10 flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" /> Lock Admin Session
              </button>
            </div>
          </div>

          {/* Overview Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                <span>System Users</span>
                <Users className="w-4 h-4 text-[#6C63FF]" />
              </div>
              <div className="text-2xl font-extrabold text-white">{users.length} Total</div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1">
                {users.filter((u) => u.status === 'Active').length} Active Accounts
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                <span>Agent Cluster</span>
                <Cpu className="w-4 h-4 text-[#06B6D4]" />
              </div>
              <div className="text-2xl font-extrabold text-[#06B6D4]">
                {agents.filter((a) => a.status === 'Operational').length}/5 Active
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">0% Cluster Failure</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                <span>Token Usage</span>
                <Zap className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div className="text-2xl font-extrabold text-white">1.42M</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Of 5.0M Monthly Quota</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1 flex items-center justify-between">
                <span>Audit Queue</span>
                <AlertTriangle className="w-4 h-4 text-[#EC4899]" />
              </div>
              <div className="text-2xl font-extrabold text-[#EC4899]">1 Flagged</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Requires admin review</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="glass-panel p-2 rounded-2xl border border-white/10 flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'users', label: `User Management (${users.length})`, icon: Users },
              { id: 'agents', label: `Agent Configuration (${agents.length})`, icon: Cpu },
              { id: 'logs', label: 'Fact Audit Stream', icon: Activity },
              { id: 'gateway', label: 'Model Gateway', icon: Server },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6C63FF]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: User Management */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search user by name or email..."
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                    {['All', 'System Admin', 'Lead Researcher', 'Researcher', 'Analyst'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                          roleFilter === r ? 'bg-[#6C63FF] text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <UserPlus className="w-4 h-4" /> Add User
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-slate-400 font-mono border-b border-white/10">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Researches</th>
                        <th className="p-4">Avg Confidence</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </td>
                          <td className="p-4">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                              className="bg-[#111827] border border-white/10 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#6C63FF]"
                            >
                              <option value="Researcher">Researcher</option>
                              <option value="Analyst">Analyst</option>
                              <option value="Lead Researcher">Lead Researcher</option>
                              <option value="System Admin">System Admin</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                                u.status === 'Active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                              }`}
                            >
                              {u.status === 'Active' ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                              {u.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono">{u.searchesCount} queries</td>
                          <td className="p-4 font-mono text-[#06B6D4] font-bold">{u.avgConfidence}%</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                                  u.status === 'Active'
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                                }`}
                              >
                                {u.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Agent Cluster Configuration */}
          {activeTab === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#06B6D4] flex items-center justify-center font-bold text-white shadow-lg">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white">{agent.name}</h3>
                        <p className="text-xs text-[#06B6D4] font-mono">{agent.model}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAgentStatusToggle(agent.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold font-mono transition-all ${
                        agent.status === 'Operational'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {agent.status}
                    </button>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Assigned LLM Model</label>
                      <select
                        value={agent.model}
                        onChange={(e) => handleAgentModelChange(agent.id, e.target.value as any)}
                        className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#6C63FF]"
                      >
                        <option value="GPT-4o">OpenAI GPT-4o</option>
                        <option value="Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                        <option value="Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Verification Threshold</label>
                        <input
                          type="number"
                          value={agent.confidenceThreshold}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 80;
                            saveAgentsState(agents.map((a) => (a.id === agent.id ? { ...a, confidenceThreshold: val } : a)));
                          }}
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Max Parallel Sources</label>
                        <input
                          type="number"
                          value={agent.maxParallelSources}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 15;
                            saveAgentsState(agents.map((a) => (a.id === agent.id ? { ...a, maxParallelSources: val } : a)));
                          }}
                          className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Fact Audit Stream */}
          {activeTab === 'logs' && (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#06B6D4]" /> Real-Time Multi-Agent Audit Log Stream
              </h3>
              <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto pr-2">
                {[
                  { time: '13:42:10', agent: 'Verification Agent', msg: 'Verified statement against JAMA Oncology 2026. Confidence: 96%', level: 'info' },
                  { time: '13:40:05', agent: 'Contradiction Detector', msg: 'FLAGGED DISCREPANCY: Radiologist employment headcount mismatch between ACR and Tech Health Review', level: 'warn' },
                  { time: '13:38:22', agent: 'Research Agent', msg: 'Successfully ingested 14,200 papers from PubMed & IEEE Xplore', level: 'info' },
                  { time: '13:35:14', agent: 'Citation Generator', msg: 'Generated 38 APA-7 formatted citation links', level: 'info' },
                ].map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-start gap-3 ${
                      log.level === 'warn'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-white/5 border-white/5 text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 shrink-0">{log.time}</span>
                    <span className="text-[#06B6D4] font-bold shrink-0">[{log.agent}]</span>
                    <span className="flex-1">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Model Gateway */}
          {activeTab === 'gateway' && (
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-[#6C63FF]" /> Global LLM Provider & Gateway Routing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { provider: 'Google Gemini 1.5 Pro', latency: '420ms', status: 'Primary', load: '38%' },
                  { provider: 'Anthropic Claude 3.5 Sonnet', latency: '680ms', status: 'Secondary', load: '45%' },
                  { provider: 'OpenAI GPT-4o', latency: '540ms', status: 'Fallback', load: '17%' },
                ].map((gw, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{gw.provider}</span>
                      <span className="text-[#06B6D4] font-mono">{gw.status}</span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">Avg Latency: {gw.latency}</div>
                    <div className="text-xs text-slate-400 font-mono">Traffic Load: {gw.load}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Platform User</h3>
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Dr. Jordan Vance"
                  className="w-full glass-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6C63FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="jordan@lab.org"
                  className="w-full glass-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#6C63FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Access Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#6C63FF]"
                >
                  <option value="Researcher">Researcher</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Lead Researcher">Lead Researcher</option>
                  <option value="System Admin">System Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
