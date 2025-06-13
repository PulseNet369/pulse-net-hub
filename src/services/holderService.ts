
interface HolderCountResponse {
  token_holders_count: string;
  transfers_count: string;
}

interface Holder {
  address: string;
  value: string;
}

interface HolderListResponse {
  message: string;
  result: Holder[];
  status: string;
}

export async function fetchHolderCount(tokenAddress?: string): Promise<number> {
  // Use the provided token address or default to PLSN
  const address = tokenAddress || '0xf651e3978f1f6ec38a6da6014caa6aa07fbae453';
  
  try {
    const response = await fetch(`https://api.scan.pulsechain.com/api/v2/tokens/${address}/counters`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: HolderCountResponse = await response.json();
    console.log(`Holder count for ${address}:`, data.token_holders_count);
    return parseInt(data.token_holders_count, 10);
  } catch (error) {
    console.error('Error fetching holder count:', error);
    return 0;
  }
}

export async function fetchHolders(page: number = 1, offset: number = 10, tokenAddress?: string): Promise<{ holders: Holder[]; hasMore: boolean }> {
  // Use the provided token address or default to PLSN
  const address = tokenAddress || '0xf651e3978f1f6ec38a6da6014caa6aa07fbae453';
  
  try {
    const response = await fetch(
      `https://api.scan.pulsechain.com/api?module=token&action=getTokenHolders&contractaddress=${address}&page=${page}&offset=${offset}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: HolderListResponse = await response.json();
    
    if (data.status === "1" && data.result) {
      return {
        holders: data.result,
        hasMore: data.result.length === offset
      };
    }
    
    return { holders: [], hasMore: false };
  } catch (error) {
    console.error('Error fetching holders:', error);
    return { holders: [], hasMore: false };
  }
}

export function formatHolderBalance(value: string, decimals: number = 18): string {
  try {
    const balance = parseFloat(value) / Math.pow(10, decimals);
    return balance.toLocaleString(undefined, { maximumFractionDigits: 2 });
  } catch (error) {
    return '0';
  }
}

export function calculateSupplyOwned(holderValue: string, totalSupply: string, decimals: number = 18): string {
  try {
    const holderBalance = parseFloat(holderValue);
    const total = parseFloat(totalSupply) * Math.pow(10, decimals);
    const percentage = (holderBalance / total) * 100;
    return percentage.toFixed(4);
  } catch (error) {
    return '0';
  }
}
