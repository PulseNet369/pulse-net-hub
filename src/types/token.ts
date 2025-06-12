
export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  address: string;
  totalSupply: string;
  burnedSupply?: string;
  decimals: number;
  distributorAddress?: string;
  liquidityTax?: number;
  reflectionTax?: number;
  devTax?: number;
  marketingTax?: number;
  totalTax?: number;
  sellMultiplier?: number;
  rewardToken?: string;
  wrappedToken?: string;
  price?: string; // Legacy field for backwards compatibility
  change24h?: string; // Legacy field for backwards compatibility
  marketCap?: string; // Legacy field for backwards compatibility
  priceUSD?: string;
  pricePLS?: string;
  change24hUSD?: string;
  change24hPLS?: string;
  marketCapUSD?: string;
  marketCapPLS?: string;
  holders?: number;
  hasDistributor?: boolean;
}
