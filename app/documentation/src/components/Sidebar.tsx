import React, { useState } from 'react';
import { BookOpen, Code, Zap, Layers, Play, Menu, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const navItems = [
    { id: 'get-started', label: 'Getting Started', icon: Play, section: 'General' },
    { id: 'basic', label: 'Hook Básico', icon: Code, section: 'Hook Samples' },
    { id: 'medium', label: 'Hook Medio', icon: Zap, section: 'Hook Samples' },
    { id: 'advanced', label: 'Hook Avanzado', icon: Layers, section: 'Hook Samples' },
    { id: 'comp-basic', label: 'Componente Básico', icon: Code, section: 'Component Samples' },
    { id: 'comp-medium', label: 'Componente Medio', icon: Zap, section: 'Component Samples' },
    { id: 'comp-advanced', label: 'Componente Avanzado', icon: Layers, section: 'Component Samples' },
  ];

  return (
    <>
      {/* Mobile Sticky Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-700 hover:text-indigo-600 bg-slate-100 rounded-lg transition min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-sm">jl-optimize-images Docs</span>
          </div>
        </div>

        <a
          href="/app/playground/"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Playground
        </a>
      </header>

      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content (Desktop Sticky Sidebar & Mobile Slide-Over Drawer) */}
      <aside
        className={`
          bg-white border-r border-slate-200 shrink-0 z-50 flex flex-col justify-between
          /* Desktop layout */
          hidden md:flex w-64 h-screen sticky top-0
          /* Mobile Drawer layout */
          ${isOpen ? '!flex fixed inset-y-0 left-0 w-72 shadow-2xl animate-in slide-in-from-left duration-200' : ''}
        `}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 tracking-tight block text-sm">jl-optimize-images</span>
              <span className="text-[10px] text-slate-400 font-mono">v1.0 Documentation</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 flex-1 space-y-1 overflow-y-auto">
          {/* Getting Started */}
          <button
            onClick={() => handleSelectTab('get-started')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
              activeTab === 'get-started' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Play className="w-4 h-4 shrink-0" /> Getting Started
          </button>
          
          <div className="pt-4 pb-2">
            <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Hook Samples</span>
          </div>

          <button
            onClick={() => handleSelectTab('basic')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
              activeTab === 'basic' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4 shrink-0" /> Básico
          </button>
          <button
            onClick={() => handleSelectTab('medium')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
              activeTab === 'medium' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" /> Medio
          </button>
          <button
            onClick={() => handleSelectTab('advanced')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
              activeTab === 'advanced' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" /> Avanzado
          </button>

          <div className="pt-4 pb-2">
            <span className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Component Samples</span>
          </div>

          <button
            onClick={() => handleSelectTab('comp-basic')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
              activeTab === 'comp-basic' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4 shrink-0" /> Básico
          </button>
          <button
            onClick={() => handleSelectTab('comp-medium')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
              activeTab === 'comp-medium' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" /> Medio
          </button>
          <button
            onClick={() => handleSelectTab('comp-advanced')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition min-h-[44px] ${
              activeTab === 'comp-advanced' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" /> Avanzado
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <a href="/app/playground/" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition shadow-sm active:scale-95">
            <Zap className="w-4 h-4 text-amber-400" /> Compressor Playground
          </a>
        </div>
      </aside>
    </>
  );
}
