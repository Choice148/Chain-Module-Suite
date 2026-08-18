import { FeatureModule } from '../types';

export const FEATURE_MODULES: FeatureModule[] = [
  {
    id: 'wallet-sync',
    title: 'Wallet Sync & Restore',
    shortTitle: 'Wallet Sync',
    description: 'Diagnose and re-synchronize stale wallet state, resolve derivation path discrepancies, fix non-responsive token balances, and restore RPC indexer connections.',
    category: 'core',
    icon: 'Wallet',
    badge: 'Core Protocol',
    badgeColor: 'cyan',
    defaultInputLabel: 'Wallet Address or ENS / SNS Domain',
    defaultInputPlaceholder: '0x71C... or vitalik.eth / wallet.sol',
    inputType: 'address',
    diagnosticSteps: [
      'Querying multichain indexers and balance states',
      'Checking nonce consistency across RPC nodes',
      'Validating derivation path schemas (BIP-44 / SLIP-0044)',
      'Scanning for unindexed token balances and approval records',
      'Generating wallet state realignment manifest'
    ],
    sampleIssues: [
      {
        code: 'WS-104',
        title: 'Mempool Nonce Desynchronization',
        severity: 'critical',
        description: 'Local wallet nonce is out of sync with on-chain pending transaction pool by 2 transactions.',
        fixAction: 'Re-align wallet nonce counter to on-chain height and purge dangling local lock.'
      },
      {
        code: 'WS-209',
        title: 'Stale Token Cache & ERC-20 Index Lag',
        severity: 'warning',
        description: '3 newly transferred token contracts are missing from local state cache due to RPC block header cache lag.',
        fixAction: 'Force push ERC-20/721 token registry re-index from archive node.'
      }
    ]
  },
  {
    id: 'tx-troubleshoot',
    title: 'Transaction Troubleshoot',
    shortTitle: 'Tx Troubleshoot',
    description: 'Debug stuck or pending transactions, resolve low gas nonce collisions, accelerate stalled mempool payloads, and trace EVM revert reasons with bytecode decoding.',
    category: 'transaction',
    icon: 'ArrowLeftRight',
    badge: 'Mempool Fix',
    badgeColor: 'amber',
    defaultInputLabel: 'Transaction Hash (TxID) or Sender Address',
    defaultInputPlaceholder: '0x8f3c4e92a... or Sender Address',
    inputType: 'txhash',
    diagnosticSteps: [
      'Locating transaction in global mempool and flashbots bundles',
      'Analyzing effective gas price vs base fee curve',
      'Checking for blocker nonces and dropped dependencies',
      'Simulating transaction execution against latest block state',
      'Generating replacement payload with optimal priority fee'
    ],
    sampleIssues: [
      {
        code: 'TX-401',
        title: 'Underpriced MaxFeePerGas Stalled in Pool',
        severity: 'critical',
        description: 'Transaction submitted with 12 Gwei while current network base fee has escalated to 24 Gwei.',
        fixAction: 'Broadcast EIP-1559 speed-up transaction with +15% priority tip buffer.'
      },
      {
        code: 'TX-502',
        title: 'Execution Reverted: STF (TransferHelper: TRANSFER_FAILED)',
        severity: 'warning',
        description: 'Target contract failed transfer due to insufficient token allowance or transfer tax fee mismatch.',
        fixAction: 'Simulate approval override and calculate adjusted slippage tolerance.'
      }
    ]
  },
  {
    id: 'contract-rectify',
    title: 'Contract Rectification',
    shortTitle: 'Contract Rectify',
    description: 'Inspect smart contract interactions, revoke hazardous unlimited allowances, rectify broken proxy delegations, and debug failed execution traces.',
    category: 'security',
    icon: 'FileCode2',
    badge: 'EVM Debugger',
    badgeColor: 'purple',
    defaultInputLabel: 'Contract Address / dApp URL',
    defaultInputPlaceholder: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    inputType: 'contract',
    diagnosticSteps: [
      'Fetching verified contract ABI and bytecode signatures',
      'Checking implementation address on ERC-1967 proxy slots',
      'Scanning token allowance permissions and spender approvals',
      'Simulating fallback & receive handler integrity',
      'Formulating contract parameter rectification payload'
    ],
    sampleIssues: [
      {
        code: 'CR-303',
        title: 'Excessive Spender Allowance Detected',
        severity: 'critical',
        description: 'Unlimited uint256 max approval granted to an unverified or outdated routing router contract.',
        fixAction: 'Generate zero-allowance revocation transaction (approve(0)).'
      },
      {
        code: 'CR-112',
        title: 'Proxy Storage Collision Warning',
        severity: 'warning',
        description: 'Potential slot collision detected on logic contract upgrade delegatecall handler.',
        fixAction: 'Audit storage layout and generate safe delegatecall patch parameter.'
      }
    ]
  },
  {
    id: 'network-health',
    title: 'Network Health Monitor',
    shortTitle: 'Network Health',
    description: 'Real-time multi-chain RPC latency benchmarking, node block-height gap analyzer, fork detection, and intelligent fallback endpoint routing.',
    category: 'infrastructure',
    icon: 'Network',
    badge: 'Real-Time RPC',
    badgeColor: 'emerald',
    defaultInputLabel: 'RPC Endpoint URL or Chain Identifier',
    defaultInputPlaceholder: 'https://rpc.ankr.com/eth or select chain below',
    inputType: 'select',
    diagnosticSteps: [
      'Pinging 18 distributed archive and full nodes globally',
      'Comparing block header timestamps and latest safe block numbers',
      'Testing gas oracle response latency and JSON-RPC method coverage',
      'Evaluating peer count and consensus sync drift',
      'Benchmarking fastest fallback RPC endpoints'
    ],
    sampleIssues: [
      {
        code: 'NET-088',
        title: 'Primary RPC Node 14 Blocks Behind Tip',
        severity: 'warning',
        description: 'The configured default RPC provider is experiencing node latency drift of 14 blocks (~2.8 mins).',
        fixAction: 'Switch active provider to high-speed verified fallback cluster.'
      }
    ]
  },
  {
    id: 'crosschain-bridge',
    title: 'Cross-Chain Bridge Checker',
    shortTitle: 'Bridge Checker',
    description: 'Verify cross-chain packet delivery, track LayerZero / Wormhole / Axelar / CCIP message relayers, and resolve stuck asset liquidity transitions.',
    category: 'transaction',
    icon: 'GitCompare',
    badge: 'Omnichain',
    badgeColor: 'cyan',
    defaultInputLabel: 'Source Bridge Tx Hash or Relayer Sequence ID',
    defaultInputPlaceholder: '0x9a8b7c6d5e... / Wormhole VAA / LayerZero Guid',
    inputType: 'txhash',
    diagnosticSteps: [
      'Locating message emitter on source chain',
      'Verifying validator signature threshold on Relayer network',
      'Scanning destination chain execution receiver mailbox',
      'Calculating destination gas budget and relayer fee execution margin',
      'Preparing manual destination claim trigger'
    ],
    sampleIssues: [
      {
        code: 'BRG-701',
        title: 'Destination Execution Pending Relayer Gas Top-Up',
        severity: 'warning',
        description: 'Message verified by oracles but destination execution gas exceeded prepaid relay fee due to gas spike.',
        fixAction: 'Submit destination manual execute() call with updated gas fee parameter.'
      }
    ]
  },
  {
    id: 'migration-assistant',
    title: 'Migration Assistant',
    shortTitle: 'Migration Tool',
    description: 'Validate token v1 to v2 token migrations, LP pool transitions, contract upgrade state transfers, and legacy bridging deprecations.',
    category: 'tokens',
    icon: 'RefreshCw',
    badge: 'Token Upgrades',
    badgeColor: 'blue',
    defaultInputLabel: 'Token Contract or User Wallet Address',
    defaultInputPlaceholder: '0x... Old token address or wallet holding legacy tokens',
    inputType: 'address',
    diagnosticSteps: [
      'Scanning holding of deprecated token contracts',
      'Verifying migration ratio and snapshot block balance',
      'Checking official migration bridge liquidity reserves',
      'Simulating 1-step upgrade call vs 2-step burn-and-mint',
      'Generating compliant migration transaction bundle'
    ],
    sampleIssues: [
      {
        code: 'MIG-202',
        title: 'Legacy V1 Token Balance Eligible for V2 Upgrade',
        severity: 'info',
        description: 'Found 1,450.00 V1 tokens ready for 1:1 penalty-free smart contract migration.',
        fixAction: 'Execute migration contract bridge deposit to claim fresh V2 tokens.'
      }
    ]
  },
  {
    id: 'staking-manager',
    title: 'Staking Manager',
    shortTitle: 'Staking Monitor',
    description: 'Diagnose validator node health, calculate remaining unbonding windows, troubleshoot delayed reward distributions, and detect slashing risk factors.',
    category: 'infrastructure',
    icon: 'Coins',
    badge: 'PoS Diagnostic',
    badgeColor: 'amber',
    defaultInputLabel: 'Staking Account Address or Validator Pubkey',
    defaultInputPlaceholder: '0x... or validator public key',
    inputType: 'address',
    diagnosticSteps: [
      'Inspecting staking delegation contract positions',
      'Verifying validator uptime, missed attestations and commission fee',
      'Checking cooldown timer and epoch unlock timestamps',
      'Simulating pending reward compounding & claim gas costs',
      'Generating re-delegation or unbonding execution plan'
    ],
    sampleIssues: [
      {
        code: 'STK-091',
        title: 'Validator Inactivity Penalty Detected',
        severity: 'warning',
        description: 'Delegated validator node has missed 4 consecutive attestation epochs.',
        fixAction: 'Instant re-delegate stake to top tier 100% uptime verified validator node.'
      }
    ]
  },
  {
    id: 'gas-optimizer',
    title: 'Gas Fee Optimizer',
    shortTitle: 'Gas Optimizer',
    description: 'EIP-1559 base fee projection model, mempool congestion heatmap, calldata compression simulator, and optimal gas timing recommendations.',
    category: 'transaction',
    icon: 'Flame',
    badge: 'Fee Engine',
    badgeColor: 'rose',
    defaultInputLabel: 'Target Chain or Transaction Calldata (Optional)',
    defaultInputPlaceholder: 'Ethereum Mainnet or paste 0x calldata',
    inputType: 'select',
    diagnosticSteps: [
      'Sampling past 200 blocks gas target utilization',
      'Analyzing MEV bot bidding competition and priority fee floors',
      'Calculating estimated block space availability over next 60 minutes',
      'Evaluating calldata zero-byte compression savings',
      'Providing customized maxFee and maxPriorityFee parameters'
    ],
    sampleIssues: [
      {
        code: 'GAS-105',
        title: 'Mempool Surge: Wait 6 Minutes for 38% Fee Savings',
        severity: 'info',
        description: 'Current base fee is at 28.4 Gwei due to NFT minting burst; statistical model indicates drop to 17 Gwei.',
        fixAction: 'Schedule transaction with auto-broadcast gas trigger at 17.5 Gwei.'
      }
    ]
  },
  {
    id: 'onchain-validation',
    title: 'On-Chain Validation',
    shortTitle: 'On-Chain Validator',
    description: 'EIP-712 typed signature inspector, Merkle proof tree verification, cryptographic message hash decoder, and smart account ERC-4337 validation.',
    category: 'security',
    icon: 'ShieldCheck',
    badge: 'Cryptographic',
    badgeColor: 'emerald',
    defaultInputLabel: 'Signed Message Hash / Merkle Proof Array / EIP-712 JSON',
    defaultInputPlaceholder: '0x... or paste raw signature / typed data payload',
    inputType: 'text',
    diagnosticSteps: [
      'Decoding cryptographic elliptic curve components (r, s, v)',
      'Validating domain separator (name, version, chainId, verifyingContract)',
      'Checking Merkle path leaf node against on-chain published root',
      'Evaluating EIP-1271 isValidSignature support on smart contract wallets',
      'Confirming signature authenticity and replay attack immunity'
    ],
    sampleIssues: [
      {
        code: 'VAL-001',
        title: 'EIP-712 Domain ChainId Mismatch',
        severity: 'critical',
        description: 'Signature was generated for chainId 1 (Ethereum) but target contract is on chainId 8453 (Base).',
        fixAction: 'Re-sign with correct target chain domain separator parameters.'
      }
    ]
  },
  {
    id: 'whitelisting-mgr',
    title: 'Whitelisting Manager',
    shortTitle: 'Whitelisting',
    description: 'Verify presale allocation eligibility, Merkle tree root inclusions, tier-based token distribution allowances, and snapshot proof generators.',
    category: 'tokens',
    icon: 'UserCheck',
    badge: 'Allocation Tool',
    badgeColor: 'blue',
    defaultInputLabel: 'Wallet Address & Drop / Presale Contract',
    defaultInputPlaceholder: '0x... Wallet Address to check against presale root',
    inputType: 'address',
    diagnosticSteps: [
      'Querying on-chain Merkle root distributor contract',
      'Generating cryptographic proof branch for wallet leaf index',
      'Checking whether claim allocation has already been executed',
      'Validating vesting cliff timestamps and claimable token unlock schedule',
      'Exporting formatted bytes32[] Merkle proof array'
    ],
    sampleIssues: [
      {
        code: 'WL-301',
        title: 'Eligible for Tier 1 Presale Allocation',
        severity: 'info',
        description: 'Address verified in Merkle tree with 2,500.00 Token entitlement. Unclaimed state confirmed.',
        fixAction: 'Execute claim(bytes32[] proof) call with generated cryptographic proof.'
      }
    ]
  },
  {
    id: 'security-audit',
    title: 'Security Audit Toolkit',
    shortTitle: 'Security Audit',
    description: 'Automated wallet exposure scanner, drainer trap identification, malicious signature detection, honeypot token checks, and private key safety audits.',
    category: 'security',
    icon: 'ShieldAlert',
    badge: 'Threat Shield',
    badgeColor: 'rose',
    defaultInputLabel: 'Wallet Address or Token / DApp URL to Audit',
    defaultInputPlaceholder: '0x... Wallet or suspicious contract address',
    inputType: 'address',
    diagnosticSteps: [
      'Querying global threat database and reported scam registry',
      'Scanning active token approvals for known drainer addresses',
      'Inspecting contract bytecode for honeypot transfer restrictions & blacklist code',
      'Auditing Permit / Permit2 signature nonces for open authorization loops',
      'Generating comprehensive vulnerability audit scorecard'
    ],
    sampleIssues: [
      {
        code: 'SEC-909',
        title: 'Active Approval to Deprecated Router with Exploit Vector',
        severity: 'critical',
        description: 'Found active allowance on USDT to an old DEX contract identified with historical vulnerabilities.',
        fixAction: 'Emergency revoke all open approvals to suspicious spender addresses.'
      },
      {
        code: 'SEC-102',
        title: 'Unchecked Permit2 Signature Nonce',
        severity: 'warning',
        description: 'Permit2 allowance granted without expiration timestamp limit.',
        fixAction: 'Set expiration timestamp to 1 hour and clamp spending limit.'
      }
    ]
  },
  {
    id: 'live-monitor',
    title: 'Live Blockchain Monitor',
    shortTitle: 'Live Monitor',
    description: 'High-frequency block stream telemetry, WebSocket transaction feed, gas price trend tracking, and mempool queue monitoring.',
    category: 'infrastructure',
    icon: 'Activity',
    badge: 'Telemetry',
    badgeColor: 'cyan',
    defaultInputLabel: 'RPC WebSocket Node or Chain Identifier',
    defaultInputPlaceholder: 'wss://eth-mainnet.g.alchemy.com/v2/...',
    inputType: 'select',
    diagnosticSteps: [
      'Establishing low-latency WebSocket connection to node cluster',
      'Streaming real-time block header validations and base fee trends',
      'Parsing transaction throughput (TPS) across multi-chain indexers',
      'Benchmarking node sync state and re-org resilience',
      'Generating live blockchain health telemetry stream'
    ],
    sampleIssues: [
      {
        code: 'MON-101',
        title: 'High Block Latency Detected on Regional RPC Node',
        severity: 'warning',
        description: 'Selected RPC node response time is 185ms above regional baseline.',
        fixAction: 'Automatically reroute telemetry pipeline to lower latency edge cluster.'
      }
    ]
  },
  {
    id: 'nft-viewer',
    title: 'NFT Viewer',
    shortTitle: 'NFT Viewer',
    description: 'Inspect ERC-721 and ERC-1155 tokens, resolve IPFS/Arweave decentralized metadata, verify token provenance, and check on-chain royalties (EIP-2981).',
    category: 'tokens',
    icon: 'Layers',
    badge: 'NFT Inspector',
    badgeColor: 'purple',
    defaultInputLabel: 'NFT Contract Address & Token ID',
    defaultInputPlaceholder: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d / 1024',
    inputType: 'contract',
    diagnosticSteps: [
      'Fetching ERC-721 / ERC-1155 smart contract metadata',
      'Resolving tokenURI JSON on decentralized IPFS / Arweave gateways',
      'Verifying media checksum and high-resolution asset availability',
      'Inspecting EIP-2981 royalty registry and marketplace approval permissions',
      'Validating token ownership history and provenance record'
    ],
    sampleIssues: [
      {
        code: 'NFT-404',
        title: 'Broken IPFS Gateway Pin Detected',
        severity: 'warning',
        description: 'Primary IPFS gateway timed out; metadata successfully retrieved via backup cluster.',
        fixAction: 'Re-pin asset to persistent Web3 decentralized storage node.'
      }
    ]
  },
  {
    id: 'testnet-faucet',
    title: 'Testnet Token Faucet',
    shortTitle: 'Token Faucet',
    description: 'Direct multi-chain developer dispenser for Sepolia ETH, Arbitrum Sepolia, Base Sepolia, Polygon Amoy, and Solana Devnet gas tokens.',
    category: 'core',
    icon: 'Flame',
    badge: 'Faucet Dispenser',
    badgeColor: 'emerald',
    defaultInputLabel: 'Recipient Wallet Address',
    defaultInputPlaceholder: '0x... EVM address or Solana Devnet pubkey',
    inputType: 'address',
    diagnosticSteps: [
      'Checking testnet faucet vault reserves and daily quota',
      'Verifying recipient address format for target testnet network',
      'Simulating testnet gas token dispensing payload',
      'Broadcasting faucet payout transaction to testnet mempool',
      'Confirming block inclusion and updating target wallet balance'
    ],
    sampleIssues: [
      {
        code: 'FCT-001',
        title: 'Daily Dispenser Allocation Available',
        severity: 'info',
        description: 'Eligible for 0.50 Testnet ETH / 2.0 Devnet SOL instant gas drop.',
        fixAction: 'Initiate automatic dispenser payout to connected recipient address.'
      }
    ]
  }
];
