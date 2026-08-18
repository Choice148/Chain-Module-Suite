export type NetworkChainId = 'eth' | 'arb' | 'op' | 'poly' | 'sol' | 'base' | 'bnb' | 'avax' | 'sepolia' | 'sol-devnet';

export interface ChainInfo {
  id: NetworkChainId;
  name: string;
  shortName: string;
  symbol: string;
  rpcLatencyMs: number;
  blockHeight: number;
  gasGwei: number;
  status: 'healthy' | 'degraded' | 'congested';
  color: string;
  isTestnet?: boolean;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: NetworkChainId;
  providerName: string | null;
  balance: string;
  isConnecting: boolean;
  walletType?: 'injected' | 'walletconnect' | 'ledger' | 'manual';
}

export interface FeatureModule {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  category: 'core' | 'transaction' | 'security' | 'infrastructure' | 'tokens';
  icon: string;
  badge: string;
  badgeColor?: string;
  defaultInputLabel: string;
  defaultInputPlaceholder: string;
  inputType: 'address' | 'txhash' | 'contract' | 'select' | 'text';
  diagnosticSteps: string[];
  sampleIssues: Array<{
    code: string;
    title: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
    fixAction: string;
  }>;
}

export interface DiagnosticLog {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface DiagnosticRunState {
  moduleId: string;
  status: 'idle' | 'scanning' | 'analyzing' | 'completed' | 'rectifying' | 'rectified' | 'error';
  progress: number;
  logs: DiagnosticLog[];
  inputData: string;
  selectedChain: NetworkChainId;
  detectedIssues: Array<{
    code: string;
    title: string;
    severity: 'critical' | 'warning' | 'info';
    description: string;
    fixAction: string;
  }>;
  rectificationTxHash?: string;
  summaryNote?: string;
}

export interface ProtocolItem {
  id: string;
  name: string;
  category: 'Layer 1 / L2' | 'DEX & Swaps' | 'Lending & Yield' | 'Wallets' | 'Oracles & Infra';
  ticker: string;
  tvlOrVolume: string;
  health: 'Optimal' | 'Synced' | 'High Traffic';
  iconUrl?: string;
  iconName: string;
  color: string;
}

export interface LiveStats {
  ethGas: number;
  solanaTps: number;
  ethTps: number;
  activeValidators: number;
  pendingMempool: number;
  bridgedVolume24h: string;
  securityIncidentsResolved: number;
  lastUpdated: string;
}
