/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ModuleGrid } from './components/ModuleGrid';
import { SupportedProtocolsMarquee } from './components/SupportedProtocolsMarquee';
import { DiagnosticModal } from './components/DiagnosticModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { TestnetFaucetModal } from './components/TestnetFaucetModal';
import { CommandPalette } from './components/CommandPalette';
import { Footer } from './components/Footer';
import { FeatureModule, LiveStats, NetworkChainId, WalletState } from './types';
import { FEATURE_MODULES } from './data/modulesData';
import { SUPPORTED_CHAINS } from './data/chainsData';

export default function App() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: 'eth',
    providerName: null,
    balance: '0.0000 ETH',
    isConnecting: false
  });

  const [selectedChain, setSelectedChain] = useState<NetworkChainId>('eth');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [walletModalInitialAddress, setWalletModalInitialAddress] = useState<string>('');
  const [isFaucetModalOpen, setIsFaucetModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleOpenWalletModal = (initialAddr?: string) => {
    setWalletModalInitialAddress(initialAddr || '');
    setIsWalletModalOpen(true);
  };

  // Live on-chain simulation ticker
  const [liveStats, setLiveStats] = useState<LiveStats>({
    ethGas: 14.8,
    solanaTps: 2840,
    ethTps: 15.2,
    activeValidators: 1042890,
    pendingMempool: 142680,
    bridgedVolume24h: '$184.2M',
    securityIncidentsResolved: 4892,
    lastUpdated: new Date().toLocaleTimeString()
  });

  // Simulated live fluctuating stats every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        ethGas: +(12 + Math.random() * 6).toFixed(1),
        solanaTps: Math.floor(2600 + Math.random() * 450),
        pendingMempool: Math.floor(138000 + Math.random() * 8000),
        lastUpdated: new Date().toLocaleTimeString()
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConnectSuccess = (walletInfo: Partial<WalletState>) => {
    setWallet(prev => ({
      ...prev,
      ...walletInfo,
      isConnected: true
    }));
  };

  const handleDisconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      chainId: 'eth',
      providerName: null,
      balance: '0.0000 ETH',
      isConnecting: false
    });
  };

  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
  };

  const activeModule: FeatureModule | null = 
    FEATURE_MODULES.find(m => m.id === activeModuleId) || null;

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col antialiased selection:bg-blue-600/30 selection:text-blue-200 font-sans enterprise-grid">
      
      {/* Navigation Header */}
      <Navbar
        wallet={wallet}
        onConnectClick={() => setIsWalletModalOpen(true)}
        onDisconnectClick={handleDisconnect}
        selectedChain={selectedChain}
        onSelectChain={setSelectedChain}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenFaucet={() => setIsFaucetModalOpen(true)}
        onOpenLiveStats={() => {
          const el = document.getElementById('hero-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onQuickDiagnostic={(modId) => handleSelectModule(modId)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onConnectWallet={() => setIsWalletModalOpen(true)}
          onSelectModule={handleSelectModule}
          liveStats={liveStats}
          selectedChain={selectedChain}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 12 Interactive Diagnostic Modules Grid */}
        <ModuleGrid
          onSelectModule={handleSelectModule}
          searchQuery={searchQuery}
        />

        {/* Supported Protocols & Integrations Marquee */}
        <SupportedProtocolsMarquee
          onSelectProtocolDiagnostic={(protoName) => {
            handleSelectModule('contract-rectify');
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectModule={handleSelectModule}
        onOpenFaucet={() => setIsFaucetModalOpen(true)}
      />

      {/* Interactive Modals */}
      
      {/* 1. Diagnostic Runner Modal */}
      <DiagnosticModal
        module={activeModule}
        isOpen={activeModuleId !== null}
        onClose={() => setActiveModuleId(null)}
        wallet={wallet}
        selectedChain={selectedChain}
        onSelectChain={setSelectedChain}
        onRequireConnectWallet={handleOpenWalletModal}
      />

      {/* 2. Web3 Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
        selectedChain={selectedChain}
        initialAddress={walletModalInitialAddress}
      />

      {/* 3. Testnet Faucet Dispenser Modal */}
      <TestnetFaucetModal
        isOpen={isFaucetModalOpen}
        onClose={() => setIsFaucetModalOpen(false)}
        wallet={wallet}
        selectedChain={selectedChain}
        onRequireConnectWallet={handleOpenWalletModal}
      />

      {/* 4. Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={handleSelectModule}
        onSelectChain={setSelectedChain}
        onOpenFaucet={() => setIsFaucetModalOpen(true)}
        onConnectWallet={() => setIsWalletModalOpen(true)}
      />

    </div>
  );
}
