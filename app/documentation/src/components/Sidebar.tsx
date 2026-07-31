import React from 'react';
import { BookOpen, Code, Zap, Layers, Play } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="font-bold text-slate-800 tracking-tight">Docs</span>
      </div>
      <nav className="p-4 flex-1 space-y-1">
        <button
          onClick={() => setActiveTab('get-started')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'get-started' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Play className="w-4 h-4" /> Getting Started
        </button>
        
        <div className="pt-4 pb-2">
          <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Hook Samples</span>
        </div>

        <button
          onClick={() => setActiveTab('basic')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'basic' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" /> Básico
        </button>
        <button
          onClick={() => setActiveTab('medium')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'medium' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" /> Medio
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'advanced' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" /> Avanzado
        </button>

        <div className="pt-4 pb-2">
          <span className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Component Samples</span>
        </div>

        <button
          onClick={() => setActiveTab('comp-basic')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'comp-basic' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" /> Básico
        </button>
        <button
          onClick={() => setActiveTab('comp-medium')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'comp-medium' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" /> Medio
        </button>
        <button
          onClick={() => setActiveTab('comp-advanced')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'comp-advanced' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" /> Avanzado
        </button>
      </nav>
      <div className="p-4 border-t border-slate-200">
        <a href="/app/playground/" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition shadow-sm">
          <Zap className="w-4 h-4" /> Ir al Playground
        </a>
      </div>
    </aside>
  );
}
