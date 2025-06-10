
import { ethers } from 'ethers';
import { TaxTokenABI } from '../contracts/TaxTokenABI';
import { TokenData } from '../types/token';
import { TokenConfig, DEAD_ADDRESSES } from '../data/tokenList';

const RPC_URL = 'https://rpc.pulsechain.com';

export async function fetchTokenData(tokenConfig: TokenConfig): Promise<Partial<TokenData>> {
  try {
    console.log(`Fetching token data for ${tokenConfig.name} (${tokenConfig.address})`);
    
    // Create provider and contract instance
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(tokenConfig.address, TaxTokenABI, provider);

    // Calculate burned supply by checking dead addresses
    const burnedBalancePromises = DEAD_ADDRESSES.map(deadAddress => 
      contract.balanceOf(deadAddress).catch(() => 0n)
    );

    // Fetch basic token data
    const basicDataPromises = [
      contract.name().catch(() => tokenConfig.name),
      contract.symbol().catch(() => tokenConfig.symbol),
      contract.decimals().catch(() => 18),
      contract.totalSupply().catch(() => 0n)
    ];

    // Fetch tax data only if token has distributor
    const taxDataPromises = tokenConfig.hasDistributor ? [
      contract.distributor().catch(() => '0x0000000000000000000000000000000000000000'),
      contract.liquidityFee().catch(() => 0n),
      contract.reflectionFee().catch(() => 0n),
      contract.devFee().catch(() => 0n),
      contract.marketingFee().catch(() => 0n),
      contract.totalFee().catch(() => 0n),
      contract.sellMultiplier().catch(() => 100n)
    ] : [];

    const [
      burnedBalances,
      [name, symbol, decimals, totalSupply],
      taxData
    ] = await Promise.all([
      Promise.all(burnedBalancePromises),
      Promise.all(basicDataPromises),
      tokenConfig.hasDistributor ? Promise.all(taxDataPromises) : Promise.resolve([])
    ]);

    // Calculate total burned supply
    const totalBurned = burnedBalances.reduce((sum, balance) => sum + balance, 0n);
    const burnedSupply = ethers.formatUnits(totalBurned, decimals);

    console.log('Token data fetched successfully:', {
      name,
      symbol,
      decimals,
      totalSupply: totalSupply.toString(),
      burnedSupply,
      hasDistributor: tokenConfig.hasDistributor
    });

    const result: Partial<TokenData> = {
      name,
      symbol,
      address: tokenConfig.address,
      decimals: Number(decimals),
      totalSupply: ethers.formatUnits(totalSupply, decimals),
      burnedSupply,
      rewardToken: tokenConfig.rewardToken?.symbol,
      wrappedToken: tokenConfig.wrappedToken?.symbol
    };

    // Add tax-related data only if token has distributor
    if (tokenConfig.hasDistributor && taxData.length > 0) {
      const [distributorAddress, liquidityFee, reflectionFee, devFee, marketingFee, totalFee, sellMultiplier] = taxData;
      
      result.distributorAddress = distributorAddress;
      result.liquidityTax = Number(liquidityFee);
      result.reflectionTax = Number(reflectionFee);
      result.devTax = Number(devFee);
      result.marketingTax = Number(marketingFee);
      result.totalTax = Number(totalFee);
      result.sellMultiplier = Number(sellMultiplier);
    }

    return result;
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}
