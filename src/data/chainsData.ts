import { ChainInfo } from '../types';

export const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    id: 'eth',
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    symbol: 'ETH',
    rpcLatencyMs: 24,
    blockHeight: 20561892,
    gasGwei: 14.8,
    status: 'healthy',
    color: '#627EEA'
  },
  {
    id: 'arb',
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    symbol: 'ETH',
    rpcLatencyMs: 18,
    blockHeight: 244192080,
    gasGwei: 0.08,
    status: 'healthy',
    color: '#28A0F0'
  },
  {
    id: 'base',
    name: 'Base',
    shortName: 'Base',
    symbol: 'ETH',
    rpcLatencyMs: 16,
    blockHeight: 18720194,
    gasGwei: 0.02,
    status: 'healthy',
    color: '#0052FF'
  },
  {
    id: 'sol',
    name: 'Solana',
    shortName: 'Solana',
    symbol: 'SOL',
    rpcLatencyMs: 32,
    blockHeight: 284102910,
    gasGwei: 0.000005,
    status: 'healthy',
    color: '#14F195'
  },
  {
    id: 'op',
    name: 'OP Mainnet',
    shortName: 'Optimism',
    symbol: 'ETH',
    rpcLatencyMs: 21,
    blockHeight: 124190822,
    gasGwei: 0.05,
    status: 'healthy',
    color: '#FF0420'
  },
  {
    id: 'poly',
    name: 'Polygon PoS',
    shortName: 'Polygon',
    symbol: 'POL',
    rpcLatencyMs: 27,
    blockHeight: 60812903,
    gasGwei: 32.1,
    status: 'healthy',
    color: '#8247E5'
  },
  {
    id: 'bnb',
    name: 'BNB Smart Chain',
    shortName: 'BNB Chain',
    symbol: 'BNB',
    rpcLatencyMs: 29,
    blockHeight: 41508239,
    gasGwei: 1.2,
    status: 'healthy',
    color: '#F3BA2F'
  },
  {
    id: 'avax',
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    symbol: 'AVAX',
    rpcLatencyMs: 25,
    blockHeight: 49102834,
    gasGwei: 26.5,
    status: 'healthy',
    color: '#E84142'
  },
  {
    id: 'sepolia',
    name: 'Ethereum Sepolia Testnet',
    shortName: 'Sepolia',
    symbol: 'SepoliaETH',
    rpcLatencyMs: 19,
    blockHeight: 6491023,
    gasGwei: 1.5,
    status: 'healthy',
    color: '#A0AEC0',
    isTestnet: true
  },
  {
    id: 'sol-devnet',
    name: 'Solana Devnet',
    shortName: 'Sol Devnet',
    symbol: 'SOL',
    rpcLatencyMs: 35,
    blockHeight: 310928194,
    gasGwei: 0.000005,
    status: 'healthy',
    color: '#14F195',
    isTestnet: true
  }
];
