import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Terminal, 
  Layers, 
  Activity, 
  Radio, 
  ArrowRight,
  Droplets,
  Wallet
} from 'lucide-react';
import { FEATURE_MODULES } from '../data/modulesData';
import { PROTOCOLS_LIST } from '../data/protocolsData';
import { SUPPORTED_CHAINS } from '../data/chainsData';
import { NetworkChainId } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (moduleId: string) => void;
  onSelectChain: (chainId: NetworkChainId) => void;
  onOpenFaucet: () => void;
  onConnectWallet: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  onSelectChain,
  onOpenFaucet,
  onConnectWallet
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent if wired
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredModules = FEATURE_MODULES.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.description.toLowerCase().includes(query.toLowerCase()) ||
    m.badge.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProtocols = PROTOCOLS_LIST.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.ticker.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChains = SUPPORTED_CHAINS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.symbol.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-md">
      <div 
        id="command-palette-dialog"
        className="relative w-full max-w-2xl rounded-2xl bg-[#0a0a0b] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-[#111111]">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search diagnostic tools, protocols, or RPC networks (e.g. Nonce, Base, Uniswap)..."
            className="w-full bg-transparent text-sm text-white placeholder-white/30 font-mono outline-none"
          />
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono bg-[#050505] border border-white/10 rounded text-white/40">
            ESC
          </kbd>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="text-[10px] uppercase text-white/40 font-bold mb-2 tracking-wider">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onConnectWallet();
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500/50 text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span>Connect / Switch Wallet</span>
                </button>
                <button
                  onClick={() => {
                    onOpenFaucet();
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500/50 text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Request Testnet Faucet</span>
                </button>
              </div>
            </div>
          )}

          {/* Diagnostic Modules */}
          {filteredModules.length > 0 && (
            <div>
              <div className="text-[10px] uppercase text-white/40 font-bold mb-2 tracking-wider flex items-center justify-between">
                <span>Diagnostic Modules ({filteredModules.length})</span>
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="space-y-1.5">
                {filteredModules.slice(0, 6).map(mod => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      onSelectModule(mod.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500/50 text-left group transition-all cursor-pointer"
                  >
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                          {mod.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20 font-mono">
                          {mod.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/40 truncate mt-0.5">{mod.description}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-blue-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Networks */}
          {filteredChains.length > 0 && (
            <div>
              <div className="text-[10px] uppercase text-white/40 font-bold mb-2 tracking-wider flex items-center justify-between">
                <span>RPC Networks ({filteredChains.length})</span>
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredChains.slice(0, 4).map(chain => (
                  <button
                    key={chain.id}
                    onClick={() => {
                      onSelectChain(chain.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: chain.color }} />
                      <span className="font-semibold text-white">{chain.name}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400">{chain.rpcLatencyMs}ms</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Protocols */}
          {filteredProtocols.length > 0 && (
            <div>
              <div className="text-[10px] uppercase text-white/40 font-bold mb-2 tracking-wider flex items-center justify-between">
                <span>Protocols &amp; DeFi ({filteredProtocols.length})</span>
                <Layers className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredProtocols.slice(0, 6).map(proto => (
                  <button
                    key={proto.id}
                    onClick={() => {
                      onSelectModule('wallet-sync');
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 text-left text-white/80 hover:text-white transition-colors truncate cursor-pointer"
                  >
                    <div className="font-bold text-white truncate">{proto.name}</div>
                    <div className="text-[10px] text-white/40">{proto.ticker} • {proto.tvlOrVolume}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredModules.length === 0 && filteredProtocols.length === 0 && filteredChains.length === 0 && (
            <div className="py-8 text-center text-white/40">
              No matching diagnostic tools or protocols found for "{query}".
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-white/10 bg-[#111111] flex items-center justify-between text-[10px] font-mono text-white/40">
          <span>Navigate with arrows • Select with Return</span>
          <span className="text-blue-400">Chain Module Command v2.8</span>
        </div>
      </div>
    </div>
  );
};
