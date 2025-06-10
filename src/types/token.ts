
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
  price?: string;
  change24h?: string;
  marketCap?: string;
  holders?: number;
  hasDistributor?: boolean;
}
