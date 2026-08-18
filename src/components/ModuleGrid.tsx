import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowLeftRight, 
  FileCode2, 
  Network, 
  GitCompare, 
  RefreshCw, 
  Coins, 
  Flame, 
  ShieldCheck, 
  UserCheck, 
  ShieldAlert, 
  Activity,
  Layers,
  ArrowUpRight,
  Radio,
  Sliders
} from 'lucide-react';
import { FeatureModule } from '../types';
import { FEATURE_MODULES } from '../data/modulesData';

interface ModuleGridProps {
  onSelectModule: (moduleId: string) => void;
  searchQuery: string;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  onSelectModule,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: `All Modules (${FEATURE_MODULES.length})` },
    { id: 'core', label: 'Core & Wallet' },
    { id: 'transaction', label: 'Transactions & Gas' },
    { id: 'security', label: 'Security & Validation' },
    { id: 'infrastructure', label: 'Infrastructure & RPC' },
    { id: 'tokens', label: 'Tokens & Allocations' }
  ];

  const filteredModules = FEATURE_MODULES.filter((module: FeatureModule) => {
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesSearch = 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.sampleIssues.some(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getModuleIdCode = (id: string, index: number) => {
    const padded = String(index + 1).padStart(2, '0');
    const suffix = id.slice(0, 3).toUpperCase();
    return `ID: CM-${padded}-${suffix}`;
  };

  const getIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 transition-transform duration-200 group-hover:scale-110" };
    switch (iconName) {
      case 'Wallet': return <Wallet {...props} />;
      case 'ArrowLeftRight': return <ArrowLeftRight {...props} />;
      case 'FileCode2': return <FileCode2 {...props} />;
      case 'Network': return <Network {...props} />;
      case 'GitCompare': return <GitCompare {...props} />;
      case 'RefreshCw': return <RefreshCw {...props} />;
      case 'Coins': return <Coins {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'UserCheck': return <UserCheck {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Layers': return <Layers {...props} />;
      default: return <Activity {...props} />;
    }
  };

  return (
    <section id="diagnostic-modules" className="py-14 sm:py-18 bg-[#050505] relative border-b border-white/10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-mono text-blue-500 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span>DIAGNOSTIC &amp; RECTIFICATION PROTOCOLS</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
              Universal Engine Modules
            </h2>
            <p className="text-sm text-white/50 mt-1 max-w-2xl">
              Non-custodial EVM/SVM bytecode diagnostics, mempool synchronization, and automated state rectification.
            </p>
          </div>

          {/* Quick status count */}
          <div className="flex items-center gap-3 font-mono text-xs text-white/50">
            <span className="px-3 py-1.5 rounded-lg bg-[#111111] border border-white/10 text-white/80">
              <strong className="text-blue-400 font-semibold">{filteredModules.length}</strong> / {FEATURE_MODULES.length} Systems Active
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/60 font-semibold'
                  : 'bg-[#111111] text-white/50 hover:text-white hover:bg-[#181818] border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 12 Feature Cards Grid matching the Professional Polish card architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module: FeatureModule, index: number) => (
            <div
              key={module.id}
              id={`module-card-${module.id}`}
              onClick={() => onSelectModule(module.id)}
              className="bg-[#111111] border border-white/10 rounded-xl p-6 flex flex-col justify-between group hover:border-blue-500/50 transition-all cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(37,99,235,0.15)]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-600/10 rounded-lg text-blue-500 border border-blue-500/20 group-hover:bg-blue-600/20 transition-colors">
                    {getIcon(module.icon)}
                  </div>
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">
                    {getModuleIdCode(module.id, index)}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {module.title}
                </h3>

                <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
                  {module.description}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Ready to Scan</span>
                </span>
                
                <button 
                  className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-white transition-colors flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectModule(module.id);
                  }}
                >
                  <span>Configure</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="py-16 text-center bg-[#111111] rounded-xl border border-white/10">
            <ShieldAlert className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <p className="text-sm text-white font-semibold">No diagnostic modules matched your search</p>
            <p className="text-xs text-white/40 font-mono mt-1">Try searching for "Gas", "Nonce", "Contract", or "Staking"</p>
          </div>
        )}

      </div>
    </section>
  );
};

