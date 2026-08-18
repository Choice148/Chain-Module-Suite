import React, { useState } from 'react';
import { 
  Coins, 
  Zap, 
  Repeat, 
  Layers, 
  PieChart, 
  CircleDollarSign, 
  TrendingUp, 
  Shield, 
  Boxes, 
  Network, 
  Wallet, 
  Percent, 
  Building2, 
  Compass, 
  Key, 
  Cpu, 
  Circle, 
  Hexagon,
  ExternalLink,
  CheckCircle2,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { ProtocolItem } from '../types';
import { PROTOCOLS_LIST } from '../data/protocolsData';

interface SupportedProtocolsMarqueeProps {
  onSelectProtocolDiagnostic?: (protocolName: string) => void;
}

export const SupportedProtocolsMarquee: React.FC<SupportedProtocolsMarqueeProps> = ({
  onSelectProtocolDiagnostic
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolItem | null>(null);

  const categories = ['All', 'Layer 1 / L2', 'DEX & Swaps', 'Lending & Yield', 'Wallets', 'Oracles & Infra'];

  const filteredProtocols = activeCategory === 'All' 
    ? PROTOCOLS_LIST 
    : PROTOCOLS_LIST.filter(p => p.category === activeCategory);

  const getProtocolIcon = (iconName: string, color: string) => {
    const props = { className: "w-5 h-5", style: { color } };
    switch (iconName) {
      case 'Coins': return <Coins {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Repeat': return <Repeat {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'PieChart': return <PieChart {...props} />;
      case 'CircleDollarSign': return <CircleDollarSign {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Boxes': return <Boxes {...props} />;
      case 'Network': return <Network {...props} />;
      case 'Wallet': return <Wallet {...props} />;
      case 'Percent': return <Percent {...props} />;
      case 'Building2': return <Building2 {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'Key': return <Key {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Circle': return <Circle {...props} />;
      case 'Hexagon': return <Hexagon {...props} />;
      default: return <Coins {...props} />;
    }
  };

  return (
    <section id="protocols-section" className="py-14 sm:py-20 bg-[#050505] border-b border-white/10 relative overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-[11px] font-mono text-blue-500 uppercase tracking-[0.3em] mb-2 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>INTEROPERABILITY &amp; INTEGRATION MATRIX</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            Supported Protocols &amp; Relayers
          </h2>
          
          <p className="text-sm text-white/50 mt-2 max-w-2xl mx-auto">
            Diagnostic telemetry, state verification, and bytecode rectification interoperable with top DeFi protocols, cross-chain bridges, and decentralized indexers.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/60 font-semibold'
                    : 'bg-[#111111] text-white/50 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Infinite Scrolling Marquee Track 1 */}
      <div className="w-full overflow-hidden py-2 relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-4">
          {[...filteredProtocols, ...filteredProtocols].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => setSelectedProtocol(item)}
              className="flex-shrink-0 cursor-pointer group p-3.5 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500/50 backdrop-blur-md transition-all duration-200 hover:-translate-y-1 shadow-md flex items-center gap-3 w-56 sm:w-64"
            >
              <div 
                className="w-10 h-10 rounded-lg bg-[#0a0a0b] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-blue-500/40 transition-colors overflow-hidden p-1.5"
              >
                {item.iconUrl ? (
                  <img 
                    src={item.iconUrl} 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to vector icon if image fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  getProtocolIcon(item.iconName, item.color)
                )}
              </div>

              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5 text-[10px] font-mono text-white/40">
                  <span>{item.ticker}</span>
                  <span className="text-emerald-400">{item.tvlOrVolume}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Selected Protocol Detail Modal/Drawer */}
      {selectedProtocol && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0a0a0b] border border-white/10 p-6 shadow-2xl animate-in zoom-in-95 duration-150 font-mono">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#111111] border border-white/10 flex items-center justify-center overflow-hidden p-1.5">
                  {selectedProtocol.iconUrl ? (
                    <img
                      src={selectedProtocol.iconUrl}
                      alt={selectedProtocol.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    getProtocolIcon(selectedProtocol.iconName, selectedProtocol.color)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-sans">{selectedProtocol.name}</h3>
                  <span className="text-[10px] uppercase text-blue-400 tracking-wider">{selectedProtocol.category}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProtocol(null)}
                className="p-1 rounded-lg bg-[#111111] text-white/50 hover:text-white border border-white/10"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2.5 p-3 rounded-lg bg-[#111111] border border-white/5 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-white/40">Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% RPC Synced
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">TVL / Volume:</span>
                <span className="text-white font-semibold">{selectedProtocol.tvlOrVolume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Contract ABI:</span>
                <span className="text-blue-400">Verified &amp; Indexed</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectProtocolDiagnostic) {
                  onSelectProtocolDiagnostic(selectedProtocol.name);
                }
                setSelectedProtocol(null);
              }}
              className="w-full py-2.5 rounded bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
            >
              Run Diagnostic on {selectedProtocol.name}
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

