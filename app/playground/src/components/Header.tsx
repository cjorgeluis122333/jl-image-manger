import React from 'react';
import { BookOpen, Sliders, X } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isMobileSidebarOpen?: boolean;
  setIsMobileSidebarOpen?: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMobileSidebarOpen = false,
  setIsMobileSidebarOpen,
}) => {
  return (
    <nav className="h-16 border-b border-zinc-800/60 px-4 sm:px-8 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md shrink-0 z-50">
      <div className="flex items-center gap-3 sm:gap-6">
        {setIsMobileSidebarOpen && (
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition flex items-center justify-center min-w-[40px] min-h-[40px]"
            title="Ajustes y Subida"
            aria-label="Toggle settings sidebar"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5 text-rose-400" /> : <Sliders className="w-5 h-5 text-blue-400" />}
          </button>
        )}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white truncate max-w-[140px] sm:max-w-none">
            jl-optimize-images
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <a
          href="/app/documentation/"
          className="flex items-center gap-2 text-xs font-semibold px-3 sm:px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all duration-200 hover:text-white hover:border-zinc-700 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="hidden sm:inline">Documentación</span>
          <span className="sm:hidden">Docs</span>
        </a>
      </div>
    </nav>
  );
};
