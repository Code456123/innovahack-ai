'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { BarChart3, TrendingUp, ShieldCheck, Cpu, Zap, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AnalyticsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activityData = [
    { name: 'Mon', searches: 14, verified: 13 },
    { name: 'Tue', searches: 22, verified: 21 },
    { name: 'Wed', searches: 35, verified: 34 },
    { name: 'Thu', searches: 28, verified: 27 },
    { name: 'Fri', searches: 42, verified: 40 },
    { name: 'Sat', searches: 19, verified: 19 },
    { name: 'Sun', searches: 31, verified: 30 },
  ];

  const agentLatencyData = [
    { name: 'Research Agent', time: 35 },
    { name: 'Verification Agent', time: 55 },
    { name: 'Contradiction Detector', time: 25 },
    { name: 'Citation Generator', time: 15 },
    { name: 'Report Builder', time: 30 },
  ];

  const accuracyPieData = [
    { name: 'High Confidence (90-100%)', value: 78, color: '#22C55E' },
    { name: 'Medium Confidence (70-89%)', value: 18, color: '#F59E0B' },
    { name: 'Low/Contradicted (<70%)', value: 4, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#06B6D4]" /> Multi-Agent System Analytics
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time telemetry on research execution throughput, agent latency, and verification consensus.
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1">Weekly Throughput</div>
              <div className="text-2xl font-bold text-white">191 Queries</div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +18.4% vs last week
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1">Verification Accuracy</div>
              <div className="text-2xl font-bold text-[#06B6D4]">98.2%</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">Audit consensus rate</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1">Avg Execution Latency</div>
              <div className="text-2xl font-bold text-[#6C63FF]">2m 14s</div>
              <p className="text-[11px] text-slate-400 font-mono mt-1">5 parallel sub-agents</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10">
              <div className="text-xs font-mono text-slate-400 mb-1">Contradictions Resolved</div>
              <div className="text-2xl font-bold text-[#F59E0B]">42 Claims</div>
              <p className="text-[11px] text-emerald-400 font-mono mt-1">Zero unresolved errors</p>
            </div>
          </div>

          {/* Main Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Research Growth Area Chart (2 Cols) */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#6C63FF]" /> Research Activity Growth
                </h3>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">Daily Queries</span>
              </div>
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="searches" stroke="#6C63FF" strokeWidth={3} fillOpacity={1} fill="url(#colorSearches)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Verification Accuracy Pie Chart (1 Col) */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#06B6D4]" /> Claim Confidence Distribution
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={accuracyPieData} innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                      {accuracyPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 text-xs">
                {accuracyPieData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-mono font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Performance Latency Bar Chart */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#EC4899]" /> Average Agent Latency Breakdown (Seconds)
            </h3>
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentLatencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', fontSize: '12px' }} />
                  <Bar dataKey="time" fill="#06B6D4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
