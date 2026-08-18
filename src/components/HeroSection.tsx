import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  ArrowRight, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Zap, 
  Cpu, 
  Search, 
  CheckCircle,
  TrendingUp,
  Radio
} from 'lucide-react';
import { LiveStats, NetworkChainId } from '../types';
import { SUPPORTED_CHAINS } from '../data/chainsData';

interface HeroSectionProps {
  onConnectWallet: () => void;
  onSelectModule: (moduleId: string) => void;
  liveStats: LiveStats;
  selectedChain: NetworkChainId;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onConnectWallet,
  onSelectModule,
  liveStats,
  selectedChain,
  searchQuery,
  onSearchChange
}) => {
  const [showLiveDrawer, setShowLiveDrawer] = useState(false);

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === selectedChain) || SUPPORTED_CHAINS[0];

  return (
    <section id="hero-section" className="relative pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden border-b border-white/10 bg-[#050505]">
      
      {/* Hero Background Illustration from Source Website with Dark Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src="https://chainmodule-dev.web.app/herro.png"
          alt="Chain Module Universal Illustration"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-15 mix-blend-luminosity filter blur-[1px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/95 to-[#050505]" />
      </div>

      {/* Background ambient lighting effects matching the theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-radial-gradient pointer-events-none -z-10" />
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Monospace Tag from Design HTML */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="text-[11px] font-mono text-blue-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>Web3 Decentralized Application // Multichain Diagnostic</span>
          </div>

          {/* Bold Display Headline with Text Stroke */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic text-white mb-6">
            Chain<br />
            <span className="text-stroke-white text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.9)' }}>
              Module
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/60 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            Advanced multichain debugging interface for wallets, transactions, RPC endpoints, bridging, staking, protocol-level diagnostics, validation, contract rectification, whitelisting, and more.
          </p>

          {/* Primary Action Buttons matching high contrast button archetypes */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              id="hero-connect-btn"
              onClick={onConnectWallet}
              className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <span>CONNECT WALLET</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <button
              id="hero-quick-sync-btn"
              onClick={() => onSelectModule('wallet-sync')}
              className="px-5 py-3 bg-[#111111] hover:bg-[#181818] text-white/80 hover:text-white border border-white/10 hover:border-blue-500/50 text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-500" />
              <span>Wallet Sync</span>
            </button>

            <button
              id="hero-tx-fix-btn"
              onClick={() => onSelectModule('tx-troubleshoot')}
              className="px-5 py-3 bg-[#111111] hover:bg-[#181818] text-white/80 hover:text-white border border-white/10 hover:border-blue-500/50 text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Mempool Fixer</span>
            </button>
          </div>

          {/* Quick Search in Hero */}
          <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-blue-500" />
              </div>
              <input
                id="hero-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search diagnostic tools, error codes, or RPC chains (e.g. Nonce, Gas, Bridge, Staking)..."
                className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-xs sm:text-sm text-white placeholder-white/40 outline-none backdrop-blur-md transition-all font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-white/40 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Live Stats Collapsible Toggle Strip */}
          <div className="w-full max-w-4xl mx-auto">
            <div 
              onClick={() => setShowLiveDrawer(!showLiveDrawer)}
              className="cursor-pointer group flex items-center justify-between px-5 py-3 bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500/50 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-white">Cluster Telemetry Feed</span>
                    <span className="text-[9px] font-mono uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold">
                      Live
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-white/50 flex items-center gap-3 mt-0.5">
                    <span>ETH Gas: <strong className="text-white font-normal">{liveStats.ethGas} Gwei</strong></span>
                    <span>•</span>
                    <span>Mempool: <strong className="text-amber-300 font-normal">{liveStats.pendingMempool.toLocaleString()} txs</strong></span>
                    <span>•</span>
                    <span className="hidden sm:inline">Active Validators: <strong className="text-emerald-400 font-normal">{liveStats.activeValidators.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400 group-hover:text-white">
                <span className="hidden sm:inline">{showLiveDrawer ? 'Collapse' : 'Inspect'}</span>
                {showLiveDrawer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            {/* Expandable Live Metrics Matrix */}
            {showLiveDrawer && (
              <div className="mt-3 p-5 bg-[#0a0a0b] border border-white/10 rounded-xl animate-in fade-in zoom-in-95 duration-200 text-left">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  
                  <div className="p-3.5 bg-[#111111] rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono uppercase text-white/40 mb-1 flex items-center justify-between">
                      <span>Ethereum Base Gas</span>
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="text-base font-bold text-white font-mono">{liveStats.ethGas} <span className="text-xs text-white/40">Gwei</span></div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">EIP-1559 Standard</div>
                  </div>

                  <div className="p-3.5 bg-[#111111] rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono uppercase text-white/40 mb-1 flex items-center justify-between">
                      <span>Global Mempool</span>
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="text-base font-bold text-white font-mono">{liveStats.pendingMempool.toLocaleString()}</div>
                    <div className="text-[10px] text-white/40 font-mono mt-0.5">12 Chain Indexers</div>
                  </div>

                  <div className="p-3.5 bg-[#111111] rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono uppercase text-white/40 mb-1 flex items-center justify-between">
                      <span>Active Validators</span>
                      <Cpu className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="text-base font-bold text-white font-mono">{liveStats.activeValidators.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Consensus Verified</div>
                  </div>

                  <div className="p-3.5 bg-[#111111] rounded-lg border border-white/5">
                    <div className="text-[10px] font-mono uppercase text-white/40 mb-1 flex items-center justify-between">
                      <span>Rectified Incidents</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-base font-bold text-white font-mono">{liveStats.securityIncidentsResolved.toLocaleString()}</div>
                    <div className="text-[10px] text-blue-400 font-mono mt-0.5">Non-Custodial</div>
                  </div>

                </div>

                {/* Multichain Fast RPC Table */}
                <div className="border-t border-white/5 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase text-white/40 tracking-wider">Cluster Latency &amp; Block Heights</span>
                    <span className="text-[10px] font-mono text-emerald-400">18/18 Regional Nodes Healthy</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    {SUPPORTED_CHAINS.slice(0, 4).map(chain => (
                      <div key={chain.id} className="flex items-center justify-between px-2.5 py-1.5 bg-[#111111] rounded border border-white/5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chain.color }} />
                          <span className="text-white/80 font-medium">{chain.shortName}</span>
                        </div>
                        <span className="text-emerald-400 text-[11px]">{chain.rpcLatencyMs}ms</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

