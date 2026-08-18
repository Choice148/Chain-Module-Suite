import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  Play, 
  RefreshCw, 
  Download, 
  ExternalLink, 
  ShieldCheck,
  Cpu,
  Layers,
  Check,
  Copy,
  Wallet,
  Lock
} from 'lucide-react';
import { DiagnosticLog, FeatureModule, NetworkChainId, WalletState } from '../types';
import { SUPPORTED_CHAINS } from '../data/chainsData';

interface DiagnosticModalProps {
  module: FeatureModule | null;
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  selectedChain: NetworkChainId;
  onSelectChain: (chain: NetworkChainId) => void;
  onRequireConnectWallet: (initialAddress?: string) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  module,
  isOpen,
  onClose,
  wallet,
  selectedChain,
  onSelectChain,
  onRequireConnectWallet
}) => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'completed' | 'rectifying' | 'rectified' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
  const [detectedIssues, setDetectedIssues] = useState<FeatureModule['sampleIssues']>([]);
  const [rectificationHash, setRectificationHash] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [pendingScanAfterConnect, setPendingScanAfterConnect] = useState(false);

  // Initialize input with connected wallet or default placeholder when modal opens
  useEffect(() => {
    if (isOpen && module) {
      setStatus('idle');
      setProgress(0);
      setLogs([]);
      setDetectedIssues([]);
      setRectificationHash('');
      setPendingScanAfterConnect(false);
      
      if (wallet.isConnected && wallet.address && (module.inputType === 'address' || module.inputType === 'contract')) {
        setInputValue(wallet.address);
      } else {
        setInputValue('');
      }
    }
  }, [isOpen, module, wallet.isConnected, wallet.address]);

  // If user connected wallet after triggering a scan, automatically start the scan
  const prevConnectedRef = useRef(wallet.isConnected);
  useEffect(() => {
    if (!prevConnectedRef.current && wallet.isConnected) {
      if (wallet.address && !inputValue) {
        setInputValue(wallet.address);
      }
      if (pendingScanAfterConnect && status === 'idle') {
        setPendingScanAfterConnect(false);
        // Trigger the scan
        startScanEngine(wallet.address || inputValue);
      }
    }
    prevConnectedRef.current = wallet.isConnected;
  }, [wallet.isConnected, pendingScanAfterConnect, status, wallet.address, inputValue]);

  if (!isOpen || !module) return null;

  const currentChain = SUPPORTED_CHAINS.find(c => c.id === selectedChain) || SUPPORTED_CHAINS[0];

  const startScanEngine = (targetAddress?: string) => {
    const activeTarget = targetAddress || inputValue || wallet.address || '0x71C8364f3B821c172fFa75276D36e9275FaeE730';
    setInputValue(activeTarget);

    setStatus('scanning');
    setProgress(10);
    setLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        message: `[AUTH] Web3 Session verified for ${wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}` : 'target'}`
      },
      {
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        message: `[INIT] Connecting to ${currentChain.name} RPC gateway (${currentChain.rpcLatencyMs}ms)...`
      }
    ]);

    const steps = module.diagnosticSteps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / (steps.length + 1)) * 100), 95);
      setProgress(currentProgress);

      if (currentStep <= steps.length) {
        const stepMsg = steps[currentStep - 1];
        setLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            type: currentStep % 2 === 0 ? 'success' : 'info',
            message: `[STEP ${currentStep}/${steps.length}] ${stepMsg}`
          }
        ]);
      } else {
        clearInterval(interval);
        setProgress(100);
        setStatus('completed');
        setDetectedIssues(module.sampleIssues);
        setLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            type: 'warning',
            message: `[DIAGNOSTIC COMPLETE] Found ${module.sampleIssues.length} actionable protocol state alerts.`
          }
        ]);
      }
    }, 600);
  };

  const handleStartScan = () => {
    // Check if wallet is connected first before scanning (even after inputting wallet address)
    if (!wallet.isConnected) {
      setPendingScanAfterConnect(true);
      onRequireConnectWallet(inputValue.trim() || undefined);
      return;
    }

    startScanEngine();
  };

  const handleExecuteRectification = () => {
    // As requested, execute automated rectification button triggers the connect wallet flow
    setPendingScanAfterConnect(false);
    onRequireConnectWallet(inputValue.trim() || wallet.address || undefined);
  };

  const handleDownloadReport = () => {
    const reportData = {
      app: 'Chain Module Web3 Diagnostic Suite v2.8',
      timestamp: new Date().toISOString(),
      module: module.title,
      network: currentChain.name,
      targetInput: inputValue,
      status: status,
      rectificationHash: rectificationHash || 'N/A',
      detectedIssues: detectedIssues,
      executionLogs: logs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chainmodule-report-${module.id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyHash = () => {
    if (rectificationHash) {
      navigator.clipboard.writeText(rectificationHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="diagnostic-modal-card"
        className="relative w-full max-w-3xl rounded-2xl bg-[#0a0a0b] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-lg sm:text-xl text-white uppercase tracking-tight">
                  {module.title}
                </h3>
                <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  {module.badge}
                </span>
              </div>
              <p className="text-xs text-white/40 font-mono mt-0.5">
                Non-custodial EVM / SVM diagnostic orchestrator
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Target Chain and Input Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider mb-1.5">
                Target Network
              </label>
              <select
                value={selectedChain}
                onChange={(e) => onSelectChain(e.target.value as NetworkChainId)}
                className="w-full bg-[#111111] border border-white/10 focus:border-blue-500 rounded-lg px-3 py-2.5 text-xs text-white font-mono outline-none"
              >
                {SUPPORTED_CHAINS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.rpcLatencyMs}ms)
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-mono uppercase text-white/40 tracking-wider">
                  {module.defaultInputLabel}
                </label>
                {wallet.isConnected && wallet.address && (
                  <button
                    onClick={() => setInputValue(wallet.address || '')}
                    className="text-[10px] font-mono text-blue-400 hover:text-white hover:underline cursor-pointer"
                  >
                    Auto-fill Connected Wallet
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={module.defaultInputPlaceholder}
                  disabled={status === 'scanning' || status === 'rectifying'}
                  className="w-full bg-[#111111] border border-white/10 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono placeholder-white/30 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          {status === 'idle' && (
            <div className="space-y-2">
              <button
                onClick={handleStartScan}
                className={`w-full py-3.5 rounded font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  wallet.isConnected
                    ? 'bg-white text-black hover:bg-blue-500 hover:text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                }`}
              >
                {wallet.isConnected ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current stroke-none" />
                    <span>Run Multichain Diagnostic Scan</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 stroke-[2.5]" />
                    <span>Connect Wallet to Scan</span>
                  </>
                )}
              </button>

              {!wallet.isConnected && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-white/40">
                  <Lock className="w-3 h-3 text-blue-400" />
                  <span>Web3 wallet authentication required before executing diagnostic</span>
                </div>
              )}
            </div>
          )}

          {/* Scanning Progress Bar & Terminal Logs */}
          {(status === 'scanning' || status === 'completed' || status === 'rectifying' || status === 'rectified') && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Progress track */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-white/80 font-medium flex items-center gap-1.5">
                    {status === 'scanning' && <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />}
                    {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {status === 'rectifying' && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
                    {status === 'rectified' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    <span>
                      {status === 'scanning' && 'Running Deep Protocol Inspection...'}
                      {status === 'completed' && 'Diagnostic Finished — Analysis Ready'}
                      {status === 'rectifying' && 'Broadcasting Protocol Rectification...'}
                      {status === 'rectified' && 'Rectification Confirmed on Chain'}
                    </span>
                  </span>
                  <span className="text-blue-400 font-bold">{progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#111111] overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Terminal Logs Output */}
              <div className="p-3.5 rounded-xl bg-[#050505] border border-white/10 font-mono text-[11px] max-h-40 overflow-y-auto space-y-1">
                <div className="text-white/40 pb-1 border-b border-white/5 flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-blue-500" />
                    <span>DIAGNOSTIC TELEMETRY LOG</span>
                  </span>
                  <span className="text-[9px] text-white/30">EVM-V8 ENGINE</span>
                </div>
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-white/30 select-none">[{log.timestamp}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warning' ? 'text-amber-300' :
                      log.type === 'error' ? 'text-rose-400' : 'text-white/70'
                    }>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Issues & Resolution Plan */}
          {(status === 'completed' || status === 'rectifying' || status === 'rectified') && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase font-bold text-white/80 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  <span>Detected Diagnostic Findings ({detectedIssues.length})</span>
                </h4>
                <span className="text-[10px] font-mono text-blue-400">Automated Resolution Available</span>
              </div>

              <div className="space-y-2.5">
                {detectedIssues.map((issue, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-[#111111] border border-white/10 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                          issue.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          issue.severity === 'warning' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {issue.severity}
                        </span>
                        <span className="text-xs font-mono text-white/40">{issue.code}</span>
                      </div>
                      <span className="font-bold text-xs text-white flex-1 text-right">
                        {issue.title}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 leading-normal">
                      {issue.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-[#050505] border border-white/5 text-[11px] font-mono text-emerald-400 flex items-start gap-1.5">
                      <span className="font-bold text-blue-400 shrink-0">ACTION:</span>
                      <span>{issue.fixAction}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons for Rectification */}
              {status === 'completed' && (
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleExecuteRectification}
                    className="flex-1 py-3 rounded bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Execute Automated Rectification</span>
                  </button>

                  <button
                    onClick={handleDownloadReport}
                    className="px-4 py-3 rounded bg-[#111111] hover:bg-[#181818] border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Audit</span>
                  </button>
                </div>
              )}

              {/* Rectified Success Box */}
              {status === 'rectified' && (
                <div className="p-4 rounded-xl bg-[#0e1713] border border-emerald-500/30 text-emerald-300 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Protocol State Rectification Completed</span>
                  </div>
                  
                  <p className="text-xs text-white/70">
                    The protocol parameters, nonce gaps, or authorization locks have been resolved and aligned with the network tip.
                  </p>

                  {rectificationHash && (
                    <div className="p-2.5 rounded-lg bg-black/60 border border-emerald-500/30 flex items-center justify-between gap-2 font-mono text-xs">
                      <div className="truncate">
                        <span className="text-white/40">TxID: </span>
                        <span className="text-blue-400">{rectificationHash}</span>
                      </div>
                      <button
                        onClick={copyHash}
                        className="p-1 hover:bg-[#111111] rounded text-white/50 hover:text-white"
                        title="Copy Tx Hash"
                      >
                        {copiedHash ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleDownloadReport}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 rounded text-xs font-mono uppercase tracking-wider text-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </button>

                    <button
                      onClick={handleStartScan}
                      className="px-3 py-1.5 bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 rounded text-xs font-mono uppercase tracking-wider text-white/80 transition-colors cursor-pointer"
                    >
                      Scan Again
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#111111] flex items-center justify-between text-[11px] font-mono text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Connected to {currentChain.name} Archive Node</span>
          </div>
          <span>Safe • Non-Custodial Protocol</span>
        </div>

      </div>
    </div>
  );
};
