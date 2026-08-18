import React, { useState } from 'react';
import { 
  X, 
  Droplets, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Send, 
  Coins, 
  Copy, 
  Check 
} from 'lucide-react';
import { NetworkChainId, WalletState } from '../types';
import { SUPPORTED_CHAINS } from '../data/chainsData';

interface TestnetFaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  selectedChain: NetworkChainId;
  onRequireConnectWallet: (initialAddress?: string) => void;
}

export const TestnetFaucetModal: React.FC<TestnetFaucetModalProps> = ({
  isOpen,
  onClose,
  wallet,
  selectedChain,
  onRequireConnectWallet
}) => {
  const [targetChain, setTargetChain] = useState<string>('sepolia');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isDispensing, setIsDispensing] = useState(false);
  const [faucetTxHash, setFaucetTxHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const testnetChains = [
    { id: 'sepolia', name: 'Ethereum Sepolia', amount: '0.25 SepoliaETH', symbol: 'ETH', color: '#A0AEC0' },
    { id: 'arb-sepolia', name: 'Arbitrum Sepolia', amount: '0.50 ArbETH', symbol: 'ETH', color: '#28A0F0' },
    { id: 'base-sepolia', name: 'Base Sepolia', amount: '0.50 BaseETH', symbol: 'ETH', color: '#0052FF' },
    { id: 'sol-devnet', name: 'Solana Devnet', amount: '2.00 Devnet SOL', symbol: 'SOL', color: '#14F195' }
  ];

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.isConnected) {
      onRequireConnectWallet(recipientAddress.trim() || undefined);
      return;
    }

    const addr = recipientAddress.trim() || wallet.address || '0x71C8364f3B821c172fFa75276D36e9275FaeE730';
    setRecipientAddress(addr);

    setIsDispensing(true);
    setFaucetTxHash(null);

    setTimeout(() => {
      const mockHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setFaucetTxHash(mockHash);
      setIsDispensing(false);
    }, 1500);
  };

  const handleCopyHash = () => {
    if (faucetTxHash) {
      navigator.clipboard.writeText(faucetTxHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="faucet-modal"
        className="relative w-full max-w-lg rounded-2xl bg-[#0a0a0b] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                Testnet Token Faucet
              </h3>
              <p className="text-xs text-white/40 font-mono mt-0.5">
                Dispense testnet funds for diagnostic &amp; contract testing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#050505] hover:bg-[#1a1a1a] text-white/50 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleDispense} className="p-5 sm:p-6 space-y-4">
          
          <div>
            <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider mb-2">
              Select Testnet Network
            </label>
            <div className="grid grid-cols-2 gap-2">
              {testnetChains.map(tc => (
                <button
                  type="button"
                  key={tc.id}
                  onClick={() => setTargetChain(tc.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    targetChain === tc.id
                      ? 'bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                      : 'bg-[#111111] border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tc.color }} />
                    <span className="text-xs font-bold font-mono">{tc.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-blue-400 font-semibold">{tc.amount}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider">
                Recipient Wallet Address
              </label>
              {wallet.isConnected && wallet.address && (
                <button
                  type="button"
                  onClick={() => setRecipientAddress(wallet.address || '')}
                  className="text-[10px] font-mono text-blue-400 hover:text-white hover:underline cursor-pointer"
                >
                  Fill Connected ({wallet.address.slice(0, 6)}...)
                </button>
              )}
            </div>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x... or solana address"
              className="w-full bg-[#111111] border border-white/10 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/30 outline-none"
            />
          </div>

          {/* Dispense Trigger Button */}
          <button
            type="submit"
            disabled={isDispensing}
            className="w-full py-3 rounded bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isDispensing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-black animate-spin" />
                <span>Broadcasting Faucet Dispatch...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Request Free Testnet Tokens</span>
              </>
            )}
          </button>

          {/* Success Receipt */}
          {faucetTxHash && (
            <div className="p-4 rounded-xl bg-[#0e1713] border border-emerald-500/30 text-emerald-300 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Testnet Funds Dispatched Successfully!</span>
              </div>
              <p className="text-[11px] text-white/70">
                0.25 - 2.00 test tokens have been transferred from the faucet hot-wallet node to your target address.
              </p>
              <div className="p-2 bg-black/60 rounded border border-emerald-500/30 flex items-center justify-between font-mono text-[11px]">
                <span className="truncate text-blue-400">{faucetTxHash}</span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="p-1 hover:bg-[#111111] text-white/50 hover:text-white rounded"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#111111] flex items-center justify-between text-[11px] font-mono text-white/40">
          <span>Rate Limit: 1 request / 24h per IP</span>
          <span className="text-blue-400">Zero Mainnet Value</span>
        </div>
      </div>
    </div>
  );
};
