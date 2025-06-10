
export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  address: string;
  totalSupply: string;
  decimals: number;
  distributorAddress: string;
  liquidityTax: number;
  reflectionTax: number;
  devTax: number;
  marketingTax: number;
  totalTax: number;
  sellMultiplier: number;
  rewardToken?: string;
  price?: string;
  change24h?: string;
  tvl?: string;
  holders?: number;
}
