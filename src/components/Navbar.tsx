import React, { useState } from 'react';
import { 
  Wallet, 
  Search, 
  Activity, 
  Droplets, 
  ChevronDown, 
  CheckCircle2, 
  Copy, 
  LogOut, 
  Menu, 
  X,
  Radio,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { ChainInfo, NetworkChainId, WalletState } from '../types';
import { SUPPORTED_CHAINS } from '../data/chainsData';

interface NavbarProps {
  wallet: WalletState;
  onConnectClick: () => void;
  onDisconnectClick: () => void;
  selectedChain: NetworkChainId;
  onSelectChain: (chain: NetworkChainId) => void;
  onOpenCommandPalette: () => void;
  onOpenFaucet: () => void;
  onOpenLiveStats: () => void;
  onQuickDiagnostic: (moduleId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onConnectClick,
  onDisconnectClick,
  selectedChain,
  onSelectChain,
  onOpenCommandPalette,
  onOpenFaucet,
  onOpenLiveStats,
  onQuickDiagnostic
}) => {
  const [chainDropdownOpen, setChainDropdownOpen] = useState(false);
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tools' | 'modules' | 'protocol'>('tools');

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === selectedChain) || SUPPORTED_CHAINS[0];

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleNavTab = (tab: 'tools' | 'modules' | 'protocol') => {
    setActiveTab(tab);
    if (tab === 'tools') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'modules') {
      const el = document.getElementById('diagnostic-modules');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'protocol') {
      const el = document.getElementById('protocols-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Left: Logo Brand */}
          <div className="flex items-center shrink-0">
            <a href="#" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs sm:text-base shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform shrink-0">
                C
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors leading-tight whitespace-nowrap">
                  Chain Module
                </span>
                <span className="text-[10px] text-white/40 font-mono font-medium hidden md:block">
                  Web3 Decentralized Application
                </span>
              </div>
            </a>
          </div>

          {/* Centralized Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-white/60">
            <button
              onClick={() => handleNavTab('tools')}
              className={`transition-all py-1 cursor-pointer ${
                activeTab === 'tools'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              Tools
            </button>
            <button
              onClick={() => handleNavTab('modules')}
              className={`transition-all py-1 cursor-pointer ${
                activeTab === 'modules'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              Modules
            </button>
            <button
              onClick={() => handleNavTab('protocol')}
              className={`transition-all py-1 cursor-pointer ${
                activeTab === 'protocol'
                  ? 'text-white border-b-2 border-blue-500 font-bold'
                  : 'hover:text-white'
              }`}
            >
              Protocol
            </button>
          </div>

          {/* Right Section: Network Selector + Connect Button + Mobile Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            
            {/* Chain Selector */}
            <div className="relative">
              <button
                id="chain-selector-btn"
                onClick={() => setChainDropdownOpen(!chainDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-mono text-white/80 bg-[#111111] hover:bg-[#181818] border border-white/10 hover:border-blue-500/40 rounded-lg transition-all whitespace-nowrap"
                aria-expanded={chainDropdownOpen}
              >
                <div 
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0"
                  style={{ backgroundColor: currentChain.color }}
                />
                <span className="font-semibold">{currentChain.shortName}</span>
                <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
              </button>

              {chainDropdownOpen && (
                <div 
                  id="chain-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 sm:w-64 rounded-xl bg-[#0a0a0b] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-mono"
                  onClick={() => setChainDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[10px] uppercase text-white/40 font-semibold border-b border-white/10 mb-1 flex items-center justify-between tracking-wider">
                    <span>Select RPC Network</span>
                    <Radio className="w-3 h-3 text-blue-500 animate-pulse" />
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-1 py-1">
                    {SUPPORTED_CHAINS.map((chain: ChainInfo) => (
                      <button
                        key={chain.id}
                        id={`select-chain-${chain.id}`}
                        onClick={() => onSelectChain(chain.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                          selectedChain === chain.id
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                            : 'text-white/70 hover:bg-[#161616] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: chain.color }}
                          />
                          <span className="font-semibold">{chain.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                          <span className="text-emerald-400">{chain.rpcLatencyMs}ms</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Connect Wallet Button */}
            {!wallet.isConnected ? (
              <button
                id="connect-wallet-nav-btn"
                onClick={onConnectClick}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white text-black font-bold text-[10px] sm:text-xs rounded hover:bg-blue-500 hover:text-white transition-colors uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap shrink-0"
              >
                CONNECT<span className="hidden sm:inline"> WALLET</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  id="connected-wallet-btn"
                  onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-blue-500/40 text-[10px] sm:text-xs font-mono text-white transition-all whitespace-nowrap"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-blue-400 font-semibold">{truncateAddress(wallet.address)}</span>
                  <span className="text-white/40 hidden sm:inline">({wallet.balance})</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                </button>

                {walletDropdownOpen && (
                  <div 
                    id="wallet-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 sm:w-72 rounded-xl bg-[#0a0a0b] border border-white/10 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 font-mono"
                  >
                    <div className="p-3 bg-[#111111] rounded-lg border border-white/5 mb-2">
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Connected Address</div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-white font-semibold break-all">
                          {wallet.address}
                        </span>
                        <button
                          onClick={handleCopyAddress}
                          className="p-1.5 hover:bg-[#1e1e1e] text-white/40 hover:text-blue-400 rounded transition-colors"
                          title="Copy address"
                        >
                          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                        <span className="text-white/40">Balance:</span>
                        <span className="font-bold text-blue-400">{wallet.balance}</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <button
                        onClick={() => {
                          setWalletDropdownOpen(false);
                          onQuickDiagnostic('wallet-sync');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-[#161616] hover:text-blue-400 rounded-lg transition-colors text-left"
                      >
                        <Wallet className="w-3.5 h-3.5 text-blue-500" />
                        <span>Run Wallet Diagnostics</span>
                      </button>

                      <button
                        onClick={() => {
                          setWalletDropdownOpen(false);
                          onDisconnectClick();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Disconnect Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg bg-[#111111] border border-white/10 text-white/70 hover:text-white shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-white/10 space-y-2 animate-in fade-in duration-200">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavTab('tools');
                }}
                className="px-3 py-2 rounded-lg bg-[#111111] text-xs font-semibold text-white/80 text-center"
              >
                Tools
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavTab('modules');
                }}
                className="px-3 py-2 rounded-lg bg-[#111111] text-xs font-semibold text-white/80 text-center"
              >
                Modules
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavTab('protocol');
                }}
                className="px-3 py-2 rounded-lg bg-[#111111] text-xs font-semibold text-white/80 text-center"
              >
                Protocol
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};

