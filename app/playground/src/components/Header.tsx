import React from 'react';
import { Eye, BookOpen } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="h-16 border-b border-zinc-800/60 px-8 flex items-center justify-between bg-zinc-950/50 backdrop-blur-md shrink-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">jl-optimize-images</span>
        </div>
        <div className="h-4 w-[1px] bg-zinc-800"></div>
        <div className="flex gap-4">
          <a
            href="/app/documentation/"
            className="flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all duration-200 hover:text-white hover:border-zinc-700 shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            Documentación
          </a>
        </div>
      </div>
    </nav>
  );
};
