
import { ethers } from 'ethers';
import { TaxTokenABI } from '../contracts/TaxTokenABI';
import { TokenData } from '../types/token';

const RPC_URL = 'https://rpc.pulsechain.com';

export async function fetchTokenData(contractAddress: string): Promise<Partial<TokenData>> {
  try {
    console.log(`Fetching token data for contract: ${contractAddress}`);
    
    // Create provider and contract instance
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(contractAddress, TaxTokenABI, provider);

    // Fetch all required data in parallel
    const [
      name,
      symbol,
      decimals,
      totalSupply,
      distributorAddress,
      liquidityFee,
      reflectionFee,
      devFee,
      marketingFee,
      totalFee,
      sellMultiplier
    ] = await Promise.all([
      contract.name().catch(() => 'Unknown'),
      contract.symbol().catch(() => 'UNKNOWN'),
      contract.decimals().catch(() => 18),
      contract.totalSupply().catch(() => 0n),
      contract.distributor().catch(() => '0x0000000000000000000000000000000000000000'),
      contract.liquidityFee().catch(() => 0n),
      contract.reflectionFee().catch(() => 0n),
      contract.devFee().catch(() => 0n),
      contract.marketingFee().catch(() => 0n),
      contract.totalFee().catch(() => 0n),
      contract.sellMultiplier().catch(() => 100n)
    ]);

    console.log('Token data fetched successfully:', {
      name,
      symbol,
      decimals,
      totalSupply: totalSupply.toString(),
      liquidityFee: liquidityFee.toString(),
      reflectionFee: reflectionFee.toString(),
      devFee: devFee.toString(),
      marketingFee: marketingFee.toString(),
      totalFee: totalFee.toString(),
      sellMultiplier: sellMultiplier.toString()
    });

    return {
      name,
      symbol,
      address: contractAddress,
      decimals: Number(decimals),
      totalSupply: ethers.formatUnits(totalSupply, decimals),
      distributorAddress,
      liquidityTax: Number(liquidityFee),
      reflectionTax: Number(reflectionFee),
      devTax: Number(devFee),
      marketingTax: Number(marketingFee),
      totalTax: Number(totalFee),
      sellMultiplier: Number(sellMultiplier)
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    throw error;
  }
}
