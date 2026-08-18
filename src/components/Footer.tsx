import React from 'react';
import { ShieldCheck, Activity, Terminal, Radio, Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../data/chainsData';

interface FooterProps {
  onSelectModule: (moduleId: string) => void;
  onOpenFaucet: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectModule,
  onOpenFaucet
}) => {
  return (
    <footer id="main-footer" className="border-t border-white/10 bg-[#050505] text-white/50 py-12 sm:py-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Disclaimer */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>
              <span className="font-heading font-black text-lg text-white tracking-tight uppercase">
                CHAIN<span className="text-blue-500">MODULE</span>
              </span>
            </div>

            <p className="text-white/50 leading-relaxed max-w-md font-normal text-sm">
              Universal decentralized infrastructure orchestrator and debugging interface for EVM and SVM blockchains. All state verification and rectification payloads are generated client-side with zero custody.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-white/40">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>18/18 Regional Relayers Operational</span>
              </div>
              <span>•</span>
              <span>EIP-712 &amp; EIP-1559 Compliant</span>
            </div>
          </div>

          {/* Col 2: Core Diagnostics */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-widest">
              Diagnostic Tools
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li>
                <button 
                  onClick={() => onSelectModule('wallet-sync')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Wallet Sync &amp; Restore
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectModule('tx-troubleshoot')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Transaction Troubleshoot
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectModule('contract-rectify')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Contract Rectification
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectModule('network-health')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Network Health Monitor
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectModule('crosschain-bridge')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Cross-Chain Bridge Checker
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Protocols & Developer Tools */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs text-white uppercase tracking-widest">
              Developer Utilities
            </h4>
            <ul className="space-y-2 font-mono text-[11px]">
              <li>
                <button 
                  onClick={() => onSelectModule('security-audit')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Security Audit Toolkit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectModule('onchain-validation')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  On-Chain Validation
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectModule('gas-optimizer')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Gas Fee Optimizer
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenFaucet}
                  className="hover:text-white transition-colors text-left text-blue-400 font-semibold flex items-center gap-1"
                >
                  <span>Testnet Token Faucet</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectModule('whitelisting-mgr')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Whitelisting Manager
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & status line */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-white/40">
          <div>
            &copy; {new Date().getFullYear()} Chain Module Infrastructure Suite. Non-Custodial &amp; Decentralized.
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security Audits</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition-colors">RPC Telemetry</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

