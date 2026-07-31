import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { GetStarted } from './components/GetStarted';
import { BasicExample } from './examples/BasicExample';
import { MediumExample } from './examples/MediumExample';
import { AdvancedExample } from './examples/AdvancedExample';
import { BasicCompExample } from './examples/BasicCompExample';
import { MediumCompExample } from './examples/MediumCompExample';
import { AdvancedCompExample } from './examples/AdvancedCompExample';

export default function App() {
  const [activeTab, setActiveTab] = useState('get-started');

  return (
    <div className="min-h-screen bg-slate-50 flex font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'get-started' && <GetStarted />}
          {activeTab === 'basic' && <BasicExample />}
          {activeTab === 'medium' && <MediumExample />}
          {activeTab === 'advanced' && <AdvancedExample />}
          {activeTab === 'comp-basic' && <BasicCompExample />}
          {activeTab === 'comp-medium' && <MediumCompExample />}
          {activeTab === 'comp-advanced' && <AdvancedCompExample />}
        </div>
      </main>
    </div>
  );
}
