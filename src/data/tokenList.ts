
export interface TokenConfig {
  name: string;
  symbol: string;
  address: string;
  abiFile: string;
  rewardToken?: {
    symbol: string;
    address: string;
  };
  wrappedToken?: {
    symbol: string;
    address: string;
  };
  hasDistributor: boolean;
}

export const TOKEN_LIST: TokenConfig[] = [
  {
    name: "PulseNet",
    symbol: "PLSN",
    address: "0xf651e3978f1f6ec38a6da6014caa6aa07fbae453",
    abiFile: "TaxTokenABI",
    rewardToken: {
      symbol: "USDL",
      address: "0xusdl" // Replace with actual USDL contract address
    },
    wrappedToken: {
      symbol: "wPLSN",
      address: "0xwplsn" // Replace with actual wrapped PLSN address
    },
    hasDistributor: true
  }
  // Add more tokens here as needed
];

// Dead addresses for burned supply calculation
export const DEAD_ADDRESSES = [
  "0x0000000000000000000000000000000000000000",
  "0x000000000000000000000000000000000000dEaD",
  "0x0000000000000000000000000000000000000369"
];
