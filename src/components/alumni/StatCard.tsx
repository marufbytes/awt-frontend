// src/components/alumni/StatCard.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  hint: string;
  icon: LucideIcon;
  /** Tailwind classes for the icon square. Defaults to sky. */
  tone?: string;
}

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'bg-sky-50 text-sky-600',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{hint}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
